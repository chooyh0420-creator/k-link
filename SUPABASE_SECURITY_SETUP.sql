/*
  K-Link 직원용 로그인 + RLS 전환 스크립트

  실행 순서
  1) Supabase Dashboard > Authentication > Providers > Email에서 Email/password를 켭니다.
     - Enable email signup: 끔
     - Confirm email: 끔 (사번 기반 내부 주소에는 메일을 보내지 않습니다)
  2) Authentication > Users > Add user에서 직원 계정을 만듭니다.
     이메일: <사번>@staff.k-link.pages.dev  예) 300599@staff.k-link.pages.dev
     비밀번호: 직원마다 새 비밀번호를 관리자 화면에서 직접 정합니다.
     Auto confirm user: 켬
  3) 이 파일 전체를 SQL Editor에서 실행합니다.
  4) 파일 마지막의 '첫 직원 활성화' INSERT 한 줄에서 사번을 바꿔 실행합니다.
  5) index.html을 배포한 뒤, 직원용에서 사번과 2)에서 정한 비밀번호로 로그인합니다.

  주의: 이 스크립트는 K-Link 테이블의 기존 RLS 정책을 교체합니다.
  staff_data 원문은 절대 anon(학생)에게 공개하지 않고, public_task_events 사본만 공개합니다.
*/

create table if not exists public.klink_staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  staff_no text not null unique check (staff_no ~ '^[A-Za-z0-9._-]{3,32}$'),
  display_name text,
  role text not null default 'staff' check (role in ('admin','staff')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

/* 기존 프로젝트에 없었던 경우에만 학생 공개 일정·직원용 키워드 테이블을 만듭니다. */
create table if not exists public.klink_student_events (
  id text primary key,
  kind text not null,
  name text not null,
  start_date date not null,
  end_date date not null,
  description text not null default '',
  location text not null default '',
  url text not null default '',
  source text,
  source_title text,
  amount text,
  created_at timestamptz not null default now()
);

create table if not exists public.klink_pay_keywords (
  id text primary key,
  word text not null,
  label text not null default '',
  kind text not null default 'pay',
  created_at timestamptz not null default now()
);

create or replace function public.klink_is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.klink_staff_members
    where user_id = auth.uid() and is_active = true
  );
$$;

revoke all on function public.klink_is_active_staff() from public;
grant execute on function public.klink_is_active_staff() to anon, authenticated;

alter table public.klink_meta enable row level security;
alter table public.klink_student_events enable row level security;
alter table public.klink_pay_keywords enable row level security;
alter table public.klink_staff_members enable row level security;

/* 남아 있을 수 있는 이전의 anon 전체 허용 정책을 K-Link 테이블에 한해 제거합니다. */
do $$
declare p record;
begin
  for p in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('klink_meta','klink_student_events','klink_pay_keywords','klink_staff_members')
  loop
    execute format('drop policy if exists %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

revoke all on public.klink_meta from anon, authenticated;
revoke all on public.klink_student_events from anon, authenticated;
revoke all on public.klink_pay_keywords from anon, authenticated;
revoke all on public.klink_staff_members from anon, authenticated;

grant select, insert on public.klink_meta to anon;
grant select, insert, update, delete on public.klink_meta to authenticated;
grant select on public.klink_student_events to anon;
grant select, insert, update, delete on public.klink_student_events to authenticated;
grant select, insert, update, delete on public.klink_pay_keywords to authenticated;
grant select on public.klink_staff_members to authenticated;

/* 학생 공개 화면: 공개 일정, 안내 문구, 숨김 상태, 공개용 업무 사본과 방문 수만 읽습니다. */
create policy "klink public meta read"
on public.klink_meta for select to anon, authenticated
using (
  key in ('notice_config','pay_updated_at','hidden_event_ids','public_task_events')
  or key like 'visit-%'
);

/* 공개 페이지의 방문 숫자용 기록입니다. 기존 upsert가 아닌 insert만 허용합니다. */
create policy "klink public visit insert"
on public.klink_meta for insert to anon, authenticated
with check (key like 'visit-%' and value ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$');

/* 로그인·활성화된 직원만 업무 원문, 이력, 업로드 설정을 모두 관리합니다. */
create policy "klink staff meta manage"
on public.klink_meta for all to authenticated
using (public.klink_is_active_staff())
with check (public.klink_is_active_staff());

create policy "klink public student events read"
on public.klink_student_events for select to anon, authenticated
using (true);

create policy "klink staff student events manage"
on public.klink_student_events for all to authenticated
using (public.klink_is_active_staff())
with check (public.klink_is_active_staff());

create policy "klink staff keywords manage"
on public.klink_pay_keywords for all to authenticated
using (public.klink_is_active_staff())
with check (public.klink_is_active_staff());

create policy "klink member read own"
on public.klink_staff_members for select to authenticated
using (user_id = auth.uid());

/* 기존 staff_data에서 학생 공개로 표시된 업무만 공개 전용 사본으로 1회 생성합니다. */
do $$
declare snapshot jsonb;
declare public_events jsonb;
begin
  select value::jsonb into snapshot
  from public.klink_meta
  where key = 'staff_data';

  if snapshot is not null and jsonb_typeof(snapshot->'TASKS') = 'array' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', 'P:' || coalesce(task->>'id',''),
      'kind', coalesce(task->>'publicKind','pay'),
      'name', coalesce(nullif(btrim(task->>'publicLabel'),''), task->>'name', ''),
      'start', task->>'date',
      'end', coalesce(task->>'end', task->>'date'),
      'desc', coalesce(task->>'publicDesc',''),
      'where', case task->>'dept'
        when 'JH' then '장학복지팀'
        when 'JM' then '재무팀'
        when 'GM' then '교무학사팀'
        when 'IH' then '입학팀'
        when 'JS' then '전산개발팀'
        else '' end,
      'url', coalesce(task->>'publicUrl',''),
      'fromTask', task->>'id'
    )), '[]'::jsonb)
    into public_events
    from jsonb_array_elements(snapshot->'TASKS') task
    where coalesce((task->>'isPublic')::boolean, false) = true;

    insert into public.klink_meta(key, value)
    values ('public_task_events', public_events::text)
    on conflict (key) do update set value = excluded.value;
  end if;
end $$;

/*
  첫 직원 활성화 — 2)에서 만든 사용자 이메일의 사번만 바꿔 이 한 줄을 실행하세요.
  display_name은 화면 인사말에만 쓰이며, 비워도 됩니다.

  insert into public.klink_staff_members (user_id, staff_no, display_name, role, is_active)
  select id, '300599', '윤호님', 'admin', true
  from auth.users
  where email = '300599@staff.k-link.pages.dev'
  on conflict (user_id) do update
    set staff_no = excluded.staff_no, display_name = excluded.display_name,
        role = excluded.role, is_active = true;
*/
