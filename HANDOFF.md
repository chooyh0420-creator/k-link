# K-Link 인수인계 문서 (Codex 인계용)

작성일: 2026-09-22
작성: Claude (Cowork) — 계명대학교 장학복지팀 담당자와 함께 작업
대상 독자: 이 프로젝트를 이어받는 다른 코딩 에이전트(Codex 등) + 담당자 본인

이 문서 하나만 읽으면 이 프로젝트를 안전하게(그리고 사용자가 "말만 해도 바로 배포까지" 이어지는 방식으로) 계속 작업할 수 있도록 정리했습니다. **특히 "가장 중요한 문제" 섹션은 반드시 먼저 읽어주세요.** 이번 세션에서만 데이터가 4번 사라졌고, 원인이 명확한데도 근본 수정은 아직 안 된 상태입니다.

---

## 1. 프로젝트 개요

**K-Link**는 계명대학교 장학복지팀이 사용하는 "장학금 캘린더 + 업무 관리" 웹앱입니다. 두 가지 화면이 있습니다.

- **학생용**: 장학금 신청/지급/등록금 납부 일정을 캘린더로 보여주는 공개 페이지. 흐르는 안내 문구(마퀴)도 있음.
- **직원용**: 장학복지팀·재무팀·교무학사팀 등 여러 부서가 업무를 카드로 만들고, 선행-후속 관계로 연결해서 "업무 연결 지도"를 관리. 일정이 밀리면 후속 업무에 미치는 영향도 계산해줌. 코드로 잠긴 로그인(비밀번호 방식, 코드는 index.html 안에 있음).

## 2. 배포 구조 (가장 중요)

- **저장소**: `https://github.com/chooyh0420-creator/k-link.git` (main 브랜치)
- **배포**: Cloudflare Pages가 GitHub main 브랜치에 push하면 **자동 배포**됨. 별도 빌드 명령 없음(정적 파일 그대로 서빙).
- **실사용 URL**: `https://k-link.pages.dev`
- **로컬 작업 위치(사용자 컴퓨터)**: `D:\장학복지팀_백업_20250123\클로드코드\케이링크` (Windows). 이 폴더가 곧 git 저장소 루트.
- **핵심 파일**: `index.html` 딱 하나. HTML+CSS+JS가 전부 이 한 파일 안에 있음(빌드 스텝 없음, 프레임워크 없음, 순수 vanilla JS). 파일 크기는 약 240KB, 3,200줄 이상.
- **백엔드**: Supabase (Postgres + REST API), 프로젝트 ref `mfvifreyikksugkylirs`.
  - URL: `https://mfvifreyikksugkylirs.supabase.co`
  - anon/publishable key: `sb_publishable_bXOqP1h-uDlPaK5xnx714Q_Uz1XyUW4`
  - 테이블: `klink_meta` (key-value 구조: `key` text, `value` text(JSON)). 이 anon key는 SELECT/INSERT/UPDATE는 되지만 DELETE 권한은 없음(RLS 정책).
  - 주요 key들:
    - `staff_data` — `{TASKS, FLOWS, HISTORY, MEMOS, seq, flowSeq, memoSeq, replySeq}` 전체를 JSON 문자열로 저장. **직원용 화면의 모든 업무/카드/이력 데이터가 여기 딱 하나의 행에 통째로 들어있음.**
    - `notice_config` — 학생용 캘린더 위 흐르는 안내 문구 설정 `{text, speed, size, color}`
    - `notice_config_history` — 안내 문구 저장 시마다 자동 백업되는 최근 5개 이력(이번 세션에 새로 추가한 기능)
    - `pay_updated_at`, `hidden_event_ids`, `exclude_keywords`, `filter_default_ids`, `preview_state` — 기타 설정값들
    - `visit-*` 로 시작하는 키들 — 방문자 카운터 관련(무시해도 됨)

## 3. ⚠️ 가장 중요한 문제: 전체 스냅샷 덮어쓰기 구조 (반복적 데이터 유실의 근본 원인)

**이번 세션에서 담당자님의 업무 데이터가 최소 4번 사라졌습니다.** 매번 원인이 같습니다. Codex가 이 프로젝트를 맡으면 **이 문제를 근본적으로 고치는 것을 최우선 작업으로 제안해주세요.**

### 근본 원인

`index.html` 안의 `persistStaffData()` 함수(대략 1305번째 줄 근처)를 보면:

```js
function persistStaffData(){
  const snapshot={TASKS, FLOWS, HISTORY, MEMOS, seq, flowSeq, memoSeq, replySeq};
  cloudSetMeta('staff_data', JSON.stringify(snapshot));
}
```

이 함수는 화면에서 클릭/입력/드래그가 일어날 때마다(`scheduleStaffSave()`를 통해 0.7초 디바운스 후) **현재 브라우저 탭이 메모리에 들고 있는 TASKS/FLOWS 전체를 통째로 서버에 덮어씁니다.** 부분 업데이트가 아니라 완전 교체(upsert)입니다.

문제는 이 앱을 **여러 브라우저 탭/창에서 동시에 열어두고 쓰는 경우**(담당자님이 실제로 그렇게 작업하심)입니다. 예를 들어:

1. 탭 A를 오전에 열어서 "2027-1학기 업무처리 일정" 흐름을 만듦 → 탭 A의 메모리엔 이 데이터가 있음.
2. 탭 B를 나중에 열어서 다른 작업(예: 안내 문구 수정)을 함 → 탭 B가 로드된 시점의 서버 데이터만 탭 B 메모리에 있음(탭 A가 만든 걸 모름, 또는 탭 A보다 먼저 로드되어 더 오래된 상태를 들고 있음).
3. 탭 B에서 아무 클릭이나 하면(안내 문구랑 무관한 클릭이어도) `scheduleStaffSave()`가 걸려서 탭 B의 **오래된/다른** TASKS·FLOWS 전체가 서버에 덮어써짐 → 탭 A가 만든 내용이 통째로 사라짐.
4. 나중에 탭 A를 다시 클릭하면 이번엔 탭 A가 서버를 덮어써서 탭 B 이후 작업이 사라짐 — **이런 식으로 계속 핑퐁하듯 서로를 지움.**

이번 세션 실제로 발생한 사례:
- 계명행복우수A/다자녀/등록금 납부일 3개(총 5개 업무) 유실 → 담당자님이 우연히 예전 탭을 클릭해서 부분적으로 복구됨.
- 안내 문구(5개 문장으로 정성껏 작성한 것) 유실 → 다행히 예전 탭이 남아있어서 복구.
- "2027-1학기 업무처리 일정" 흐름(카드 5개) 유실 → Claude가 만든 콘솔 스크립트로 복구.
- 그 복구 스크립트를 실행하는 과정에서 **이번엔 반대로 계명행복우수A 등 5개가 다시 사라짐** (2026-09-22 기준 아직 미해결 — 이 문서 끝의 "즉시 처리할 작업" 참고).

### 권장 해결책 (Codex가 검토해야 할 것)

우선순위 순:

1. **낙관적 잠금(optimistic concurrency)**: `staff_data` 저장 시 현재 알고 있는 이전 버전 번호(또는 `updated_at` 타임스탬프)를 같이 보내고, 서버의 실제 최신 버전과 다르면 저장을 막고 "다른 곳에서 변경되었습니다. 새로고침 후 다시 시도하세요" 경고를 띄우기. Supabase는 `updated_at` 컬럼 + PostgREST의 `If-Match` 헤더나, 그냥 klink_meta에 `version` 정수 컬럼을 추가해서 `.eq('version', expectedVersion)` 조건부 UPDATE로 구현 가능.
2. **부분 업데이트로 전환**: TASKS/FLOWS를 하나의 JSON 덩어리가 아니라 Supabase의 별도 테이블(`tasks`, `flows`)로 분리해서 행 단위로 insert/update/delete. 이러면 애초에 "전체 스냅샷 덮어쓰기" 자체가 없어짐. 리팩터링 범위가 크지만 가장 근본적인 해결책.
3. **최소한의 임시 방어책** (1, 2번을 당장 못하면): 저장 직전에 서버의 최신 데이터를 다시 fetch해서 로컬 메모리와 **merge**한 뒤 저장 (예: TASKS는 id 기준으로 합집합, 최근 수정시각이 있는 쪽을 우선). 완벽하지 않지만 최소 서로 지우는 사고는 줄어듦.
4. 안내 문구(`notice_config`)에는 이번 세션에 최근 5개 자동 백업 기능을 추가해뒀습니다(`notice_config_history` 키). TASKS/FLOWS(`staff_data`)에는 아직 이런 백업이 없습니다 — 최소한 이것만이라도 먼저 추가하면 사고가 나도 되돌릴 수 있습니다.

## 4. 안전한 편집 워크플로우 (Codex가 이 저장소를 고칠 때 반드시 따라야 할 순서)

이 파일은 3,000줄이 넘는 단일 HTML이라 통째로 다시 쓰면 사고 위험이 큽니다. 이번 세션 내내 아래 순서로만 작업해서 한 번도 배포 사고가 없었습니다.

1. **백업**: 수정 전 `cp index.html index.html.bak_$(date +%Y%m%d_%H%M%S)` (`.gitignore`에 이미 `index.html.bak_*` 패턴이 등록되어 있어 git에는 안 올라감).
2. **정확한 문자열 치환 스크립트로만 수정**: Python으로 아래와 같은 `replace_once` 패턴을 써서, "정확히 1번만 일치하는지" 검증 후 치환. 통째로 다시 쓰거나 정규식으로 넓게 치환하지 말 것.
   ```python
   def replace_once(s, old, new, label):
       n = s.count(old)
       if n != 1:
           raise SystemExit(f"[FAIL] {label}: expected 1 occurrence, found {n}")
       return s.replace(old, new, 1)
   ```
3. **태그/중괄호 균형 검증**: 수정 후 `div`, `script`, `style`, `button`, `span`, `select`, `textarea` 등 주요 태그의 여는/닫는 개수가 일치하는지, `{`/`}` 개수가 일치하는지 확인.
4. **JS 문법 검증**: `<script>` 안의 인라인 JS를 추출해서 `node -e "new Function(fs.readFileSync('extracted.js','utf8')); console.log('syntax OK')"` 로 문법 에러 없는지 확인 (실행은 안 하고 파싱만).
5. **git commit + push**: 커밋 메시지는 한국어로 무엇을/왜 바꿨는지 간단히. `git push`.
6. **배포 확인**: Cloudflare Pages는 push 후 보통 몇 초~1분 내 반영됨. `curl`로 캐시를 우회해서(쿼리 파라미터에 타임스탬프 붙이기) 방금 넣은 코드의 특징적인 문자열이 실제 응답에 있는지 반복 확인.
   ```bash
   for i in $(seq 1 20); do
     R=$(curl -s "https://k-link.pages.dev/?nocache=$(date +%s%N)")
     if echo "$R" | grep -q '방금_추가한_고유_문자열'; then echo "DEPLOYED"; break; fi
     sleep 6
   done
   ```
7. **실제 동작 확인**: 가능하면 헤드리스/숨김 브라우저 탭으로 실제 페이지를 열어서 콘솔 에러 없이 동작하는지 확인. **이때 절대로 실제 운영 데이터를 저장하는 함수(`persistStaffData`, `cloudSetMeta`)가 호출되지 않도록 먼저 스텁으로 막아둘 것** (예: `window.persistStaffData=function(){}; window.cloudSetMeta=function(){return Promise.resolve();};`) — 안 그러면 검증하려던 행위 자체가 위 3번 문제(전체 덮어쓰기)를 유발해서 실제 데이터를 훼손할 수 있음. **이 부분이 이번 세션에서 반드시 지켜야 했던 가장 중요한 안전 수칙입니다.**

### 이 저장소에서 절대 하면 안 되는 것

- Supabase에 직접 쓰기 작업(INSERT/UPDATE/UPSERT)을 **에이전트 스스로** 실행하는 것. (Claude Code 환경에서는 "Modify Shared Resources" 안전장치가 이를 자동 차단했음 — 사용자 승인이 있어도 우회 불가.) **실제 운영 데이터를 바꿔야 할 때는 항상 사용자 본인의 브라우저 콘솔에서 사용자가 직접 스크립트를 실행하도록 안내할 것.** 에이전트는 읽기 전용(REST GET)으로 확인만 하고, 쓰기는 사용자 손으로.
- 검증용으로 페이지를 로드할 때 스텁 없이 무작정 클릭/모드 전환하는 것 (위 7번 참고).

## 5. 사용자와 일하는 방식 (참고)

- 담당자님은 한국어 존댓말로 소통을 선호하고, 친절하고 상냥한 톤을 좋아하심 (이모티콘 약간 사용 환영).
- 엑셀 파일 작업 시 비밀번호가 걸려있으면 묻지 말고 `kmd016` 또는 `0420`으로 바로 열어서 진행.
- 산출물(파일)을 만들어 전달한 뒤 추가 수정 요청이 오면 기존 파일을 덮어쓰지 말고 `_v2`, `_v3`처럼 버전을 올려 새로 전달 (이건 파일 산출물에 대한 규칙이고, 이 K-Link 웹앱 자체는 git 커밋으로 버전 관리되므로 별도 버전 파일링은 불필요).
- 문제가 생기면 스크린샷을 자주 첨부해주시니, 스크린샷 속 텍스트/날짜/버튼 위치를 꼼꼼히 읽고 대응할 것.

## 6. 이번 세션 작업 이력 (최신순)

| 커밋 | 시각 | 내용 |
|---|---|---|
| afb2411 | 09-22 02:51 | 안내 문구 마퀴 반복 사이 공백 제거 (텍스트 2벌 이어붙여 seamless 루프) |
| 7dc79e4 | 09-22 02:44 | 안내 문구 속도 최대 60초로 확장 + 마우스오버 일시정지 + 저장 시 이전 문구 자동 백업(최근 5개) |
| 595f550 | 09-22 02:19 | 학생용/직원용 상단바 색상 맞교환 |
| d7df85a | 09-22 02:14 | 업무 연결 지도 카드에 종료일 칸을 항상 표시 (버튼 없이) |
| 5d92822 | 09-22 02:00 | 종료일 추가 시 바로 기간 표시 안 되던 문제 수정 |
| cd68652 | 09-22 01:59 | 업무 연결 지도 카드에 종료일(기간 ~) 표시 기능 최초 추가 |
| ba01191 | 09-22 01:51 | 카드 날짜칸을 네이티브 date input → 직접 마스킹하는 텍스트 입력으로 교체 (연도 자릿수 초과 버그 해결) |
| 21c75be | 09-22 01:44 | 카드 날짜 입력 시 커밋 시점을 change → blur로 변경 (뒤에서부터 채워지던 버그 해결) |
| 61a720f | 09-22 01:23 | 업무 연결 지도 카드 추가 시 중복 생성되던 버그 수정 (`syncOrder` 자동 보정과의 충돌) |
| (그 이전) | 09-21~09-22 | 모바일 레이아웃, 캘린더 정렬, 안내 문구 최초 도입 등 다수 |

세션 중 **코드 커밋 없이** 발생한 데이터 사고 (모두 `staff_data`/`notice_config` 값 자체의 문제, 코드 버그 아님):
1. 계명행복우수A/다자녀/등록금 3종 업무(5건) 유실 → 예전 탭 재접속으로 부분 복구.
2. 안내 문구(5문장) 유실 → 예전 탭에서 텍스트 회수 후 재저장으로 복구.
3. "2027-1학기 업무처리 일정" 흐름(카드 5개) 유실 → 콘솔 복구 스크립트로 복구.
4. **(미해결)** 위 스크립트 실행 과정에서 계명행복우수A 등 5건이 다시 사라짐 — 아래 "즉시 처리할 작업" 참고.

## 7. 즉시 처리할 작업 (이 문서 작성 시점 기준 미해결)

**지금 서버 상태(2026-09-22 확인)**: `staff_data`의 TASKS에 "2027-1학기 업무처리 일정"(N111~N115, 흐름 FN12)만 있고, 계명행복우수A/다자녀/등록금 납부일 3종(5건, 흐름 FN11)이 다시 비어있음.

아래 스크립트를 **담당자님이 K-Link를 새로고침한 직후, 브라우저 콘솔에서 직접** 실행하면 두 흐름을 모두 살릴 수 있습니다 (2027-1학기 것은 건드리지 않고 계명행복우수A 등 5건만 추가):

```js
(function(){
  try{
    if (TASKS.some(t=>t.name && t.name.includes('계명행복우수A'))) { console.log('이미 복구되어 있습니다.'); return; }
    const mk=(name,dept,date,end,isPublic,publicLabel,publicKind,publicUrl,publicDesc)=>{
      const t={id:'N'+(seq++), flow:null, name, dept, owner:'미지정', date,
        end:(end&&end!==date)?end:undefined, baseDate:date, status:'예정',
        prev:[], files:['(미등록)'], criteria:[['완료 확인',false]], note:'',
        isPublic:!!isPublic, publicLabel:publicLabel||'', publicKind:publicKind||'due',
        publicUrl:publicUrl||'', publicDesc:publicDesc||''};
      TASKS.push(t);
      return t;
    };
    let f=FLOWS.find(x=>x.id==='FN11') || FLOWS.find(x=>x.name==='새 업무 흐름');
    if(!f){ f={id:'FN'+(flowSeq++), name:'새 업무 흐름', note:'', order:[]}; FLOWS.push(f); }

    const t1=mk('계명행복우수A, 총장특별(성적우수), 총장특별(학업우수) 장학생 신청','JH','2026-09-07','2026-10-30',true,
      '계명행복우수A, 총장특별(성적우수), 총장특별(학업우수) 장학생 신청','apply','https://edward.kmu.ac.kr/',
      'https://www.kmu.ac.kr/uni/main/page.jsp?pageNo=1&pagePrvNxt=1&pageRef=270851&pageOrder=0&cmd=2&parm_bod_uid=270222&srchVoteType=-1&srchEnable=-1&srchBgpUid=-1&srchKeyword=&srchSDate=&srchColumn=&srchEDate=&mnu_uid=145&');
    const t2=mk('교내 다자녀, 목사자녀 장학금 신청','JH','2026-09-07','2026-10-30',true,'','apply','https://edward.kmu.ac.kr/',
      '교내 다자녀 장학금:\nhttps://www.kmu.ac.kr/uni/main/page.jsp?pageNo=1&pagePrvNxt=1&pageRef=270216&pageOrder=0&cmd=2&parm_bod_uid=270216&srchVoteType=-1&srchEnable=-1&srchBgpUid=-1&srchKeyword=%EB%8B%A4%EC%9E%90%EB%85%80&srchSDate=&srchColumn=bod_title&srchEDate=&mnu_uid=145&\n\n목사자녀 장학금:\nhttps://www.kmu.ac.kr/uni/main/page.jsp?pageNo=1&pagePrvNxt=1&pageRef=270217&pageOrder=0&cmd=2&parm_bod_uid=270217&srchVoteType=-1&srchKeyword=%EB%AA%A9%EC%82%AC&srchSDate=&srchColumn=bod_title&srchEDate=&mnu_uid=145&');
    const t3=mk('정규 등록금 납부일','JM','2026-08-26','2026-08-28',true);
    const t4=mk('2차 등록금 추가납부일','JM','2026-09-01','2026-09-04',true);
    const t5=mk('3차 등록금 추가 납부일','JM','2026-09-09','2026-09-11',true);

    [t1,t2,t3,t4,t5].forEach(t=>{ t.flow=f.id; if(!f.order.includes(t.id)) f.order.push(t.id); });

    try{ drawStaff(); drawFlows(); drawDeptRows(); }catch(e){ console.warn('화면 갱신 오류(무시 가능):', e); }
  } finally {
    try{ scheduleStaffSave(); }catch(e){ console.error('저장 예약 실패:', e); }
  }
  console.log('복구 완료. TASKS 개수:', TASKS.length, '/ FLOWS 개수:', FLOWS.length);
})();
```

실행 후에는 **다른 탭은 절대 건드리지 말고**, 이 스크립트를 실행한 탭에서 몇 초 기다린 뒤 저장이 완료됐는지(콘솔에 에러 없는지) 확인하는 것을 권장합니다.

## 8. 다음으로 손대면 좋을 것 (제안, 필수 아님)

- 위 3번 섹션의 낙관적 잠금/부분 업데이트 리팩터링 (최우선 권장).
- TASKS/FLOWS에도 `notice_config_history`처럼 최근 저장본 자동 백업 추가.
- 삭제 버튼들("이 업무 삭제", "흐름 삭제" 등)에 확인(confirm) 창이 전혀 없음 — 실수 방지를 위해 추가 검토.
- 여러 탭이 동시에 열려 있을 때 사용자에게 경고를 띄우는 기능(예: `visibilitychange`/`storage` 이벤트로 다른 탭 감지) 검토.
