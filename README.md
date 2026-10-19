# K-Link 장학 캘린더

장학 일정 캘린더(학생용)와 직원용 지급일 관리 화면입니다. Cloudflare Pages로 배포합니다.

## 다른 저장소와 함께 쓰는 파일

`motion/calendar-*_v14.*` 소개 영상은 **이 저장소가 원본**이고, kmu-scholarship-hub의 `motion/` 폴더에 복사본이 있습니다.
영상을 고치면 kmu-scholarship-hub에도 같은 파일을 덮어써 주세요.
`motion/kmu-logo.png`의 원본은 kmu-scholarship입니다.

## 외부 스크립트

`index.html` 상단의 외부 스크립트는 버전을 정확히 고정해 두었습니다. CDN 파일이 바뀌어도 직원 로그인 화면에서 확인되지 않은 코드가 실행되지 않게 하기 위해서입니다.

- Supabase (`@supabase/supabase-js@2.117.2`): `integrity` 값으로 파일 내용까지 확인합니다. 버전을 올릴 때는 새 버전의 `integrity` 값도 함께 바꿔야 하며, 값이 틀리면 로그인과 동기화가 동작하지 않습니다.
- SheetJS (`xlsx-0.20.3`): 버전이 고정된 공식 CDN 주소를 사용합니다.
