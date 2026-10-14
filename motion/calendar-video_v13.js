/*!
 * 계명대 장학금 캘린더 소개 모션그래픽 (40초) v13
 * v13: 영상은 v12와 동일 — 머리글 버튼 문구를 "사용법 안내"로, 휴대폰은 제목 줄 끝(“계명 장학금 캘린더 (장학금 언제받나요?)” 뒤)에 배치
 * v12: 영상은 v11과 동일 — 영상 버튼을 달력 위 배너에서 상단 머리글(제목과 TODAY·TOTAL 사이)로 옮김
 * v11: 영상은 v10과 동일 — 미리보기를 현재 k-link.pages.dev 학생 화면 그대로로 교체,
 *      마지막 "지금 캘린더 확인하기" 버튼으로 이동할 때 사이트 상단 고정 머리글에 달력 윗부분이 가려지지 않게 보정
 * v10: 영상 왼쪽 위 표시를 '계명대학교 로고 + 계명대학교 장학복지팀' 배지로 (최종본)
 * v9: '꼭 알아두세요' 장면 추가 — 캘린더에 안 보이면 아직 지급일 확정 전 (지급일자 확정 장면 바로 다음, 5.5초)
 * v8: 배경음악 확정 — "Life of Riley" Kevin MacLeod (incompetech.com) / CC BY 4.0
 * v7: 배경음악 후보 3곡(Pleasant Porridge · Wholesome · Life of Riley) — 버튼 속성으로 곡·출처 지정
 * v6: 사용법 장면의 달력 화면을 더 크게 (화면 영역·글자·날짜칸 확대)
 * v5: 첫·마지막 장면 배경을 '정문'에서 '붉은 벽돌 본관(종탑·흰 기둥)'으로 교체 — 자가진단 영상과 배경 구분 (낮 → 노을)
 * v4: 핵심 장면 맨 위 카드 '전표처리 완료' · 아래 달력을 실제 캘린더 화면처럼(상단 메뉴·범례·요일줄·날짜칸·색 막대) 자세하게
 * v3: 핵심 장면을 학생 눈높이로('장학금 지급 처리 완료 → 지급일 확정 → 캘린더 반영') · 달력 종이 표기 정리 · 'I유형' 글자 간격 정리
 * v2: 학생 표정을 '궁금한' 밝은 얼굴로 · 문구 '지급일자가 확정되면' · 첫/마지막 장면 배경에 계명대 정문(아침→노을)
 * 계명대학교 장학복지팀 | 제작: 장학복지팀 추윤호
 * - 버튼(data-calendar-video)을 누를 때만 calendar-launcher_v13.js가 이 파일을 불러옵니다.
 * - HTML 안 <script>/<style>/style="" 를 쓰지 않아 엄격한 CSP에서도 동작합니다.
 * - 자가진단 영상(intro-video)과 같은 페이지에 있어도 충돌하지 않도록 이름표를 kc- 로 구분했습니다.
 * Music: Kevin MacLeod (incompetech.com) / CC BY 4.0 — 곡명은 재생 창 하단에 표시
 */
(function () {
  'use strict';
  if (window.KmuCalendarVideo) return;

  var DUR = 40.5;
  // 장면 경계(초): 0 오프닝(언제 들어와요? · 본관 낮) | 1 기다림 | 2 비밀(지급일자 확정→캘린더) | 2b 꼭 알아두세요(안 보이면 확정 전) | 3 사용법 | 4 다가오는 일정 | 5 엔딩(입금 알림)
  var CUTS = [0, 4.4, 9.0, 17.0, 22.5, 30.5, 35.5, DUR];
  var C = {
    navy: '#00376E', navyDp: '#002851', blue: '#1f4ba6', ink: '#16273C', gold: '#C9922E', goldDk: '#9a6f1c', red: '#D2241E', green: '#116454',
    skin: '#ffdcc2', skinDk: '#f2c3a2', hair: '#2b2a4a', pants: '#2c3550', line: '#c3cbe0', hoodie: '#1f4ba6', hoodieDk: '#15306c'
  };

  /* ================= 학생 캐릭터 (자가진단 영상과 같은 캐릭터) =================
   * pose: 'stand' | 'scratch'(머리 긁적) | 'phone'(휴대폰 보기)   face: 'smile' | 'curious'(궁금) | 'worry' | 'joy'
   */
  function person(o) {
    o = o || {};
    var pose = o.pose || 'stand', face = o.face || 'smile';
    var top = C.hoodie;
    var s = '<svg class="kc-fig ' + (o.cls || '') + '" viewBox="0 0 120 200" aria-hidden="true" focusable="false">';
    // 가방 · 뒷머리 · 다리 · 신발
    s += '<rect x="25" y="96" width="70" height="50" rx="13" fill="' + C.gold + '"/><rect x="25" y="118" width="70" height="5" fill="' + C.goldDk + '" opacity=".45"/>' +
      '<path d="M26 58 Q24 18 60 16 Q96 18 94 58 Q94 72 88 78 L32 78 Q26 72 26 58Z" fill="' + C.hair + '"/>' +
      '<rect x="43" y="146" width="15" height="36" rx="6" fill="' + C.pants + '"/><rect x="62" y="146" width="15" height="36" rx="6" fill="' + C.pants + '"/>' +
      '<rect x="38" y="177" width="22" height="12" rx="6" fill="#fff" stroke="' + C.line + '" stroke-width="1.5"/>' +
      '<rect x="60" y="177" width="22" height="12" rx="6" fill="#fff" stroke="' + C.line + '" stroke-width="1.5"/>' +
      '<rect x="38" y="185" width="22" height="3" rx="1.5" fill="' + C.gold + '"/><rect x="60" y="185" width="22" height="3" rx="1.5" fill="' + C.gold + '"/>';
    // 후드티
    s += '<path d="M36 100 Q36 88 48 87 L72 87 Q84 88 84 100 L86 148 Q86 154 80 154 L40 154 Q34 154 34 148 Z" fill="' + top + '"/>' +
      '<path d="M44 87 Q60 99 76 87 L79 90 Q60 107 41 90 Z" fill="' + C.hoodieDk + '"/>' +
      '<path d="M55 98 L54 111 M65 98 L66 111" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>' +
      '<path d="M47 130 H73 L70 144 H50 Z" fill="' + C.hoodieDk + '" opacity=".55"/>' +
      '<path d="M43 89 Q40 110 43 130" stroke="' + C.gold + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M77 89 Q80 110 77 130" stroke="' + C.gold + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
    // 팔
    if (pose === 'phone') {
      s += '<rect x="48" y="101" width="24" height="36" rx="4.5" fill="' + C.ink + '"/>' +
        '<rect class="kc-phonescreen" x="50.5" y="104" width="19" height="29" rx="2.5" fill="#9cc6ff"/>' +
        '<path d="M38 96 Q28 118 47 123" stroke="' + top + '" stroke-width="11" stroke-linecap="round" fill="none"/>' +
        '<path d="M82 96 Q92 118 73 123" stroke="' + top + '" stroke-width="11" stroke-linecap="round" fill="none"/>' +
        '<circle cx="49" cy="123" r="5.5" fill="' + C.skin + '"/><circle cx="71" cy="123" r="5.5" fill="' + C.skin + '"/>';
    } else {
      s += '<path d="M38 96 Q26 112 28 133" stroke="' + top + '" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="28" cy="137" r="6" fill="' + C.skin + '"/>';
      if (pose !== 'scratch') s += '<path d="M82 96 Q94 112 92 133" stroke="' + top + '" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="92" cy="137" r="6" fill="' + C.skin + '"/>';
    }
    // 얼굴
    s += '<rect x="54" y="80" width="12" height="9" fill="' + C.skinDk + '"/>' +
      '<circle cx="30" cy="60" r="5.5" fill="' + C.skin + '"/><circle cx="90" cy="60" r="5.5" fill="' + C.skin + '"/>' +
      '<ellipse cx="60" cy="56" rx="30" ry="29" fill="' + C.skin + '"/>' +
      '<path d="M30 52 Q30 20 60 19 Q90 20 90 52 Q86 40 76 37 Q70 46 56 44 Q44 42 37 50 Q34 46 30 52Z" fill="' + C.hair + '"/>' +
      '<path d="M44 26 Q54 22 64 24" stroke="#4a4878" stroke-width="2.5" stroke-linecap="round" fill="none"/>';
    if (face === 'worry') s += '<path d="M42 52 L52 48.5 M68 48.5 L78 52" stroke="' + C.hair + '" stroke-width="2.3" stroke-linecap="round" fill="none"/>';
    else if (face === 'curious') s += '<path d="M42.5 47.5 Q47.5 43 53 45.5 M67 45.5 Q72.5 43 77.5 47.5" stroke="' + C.hair + '" stroke-width="2.3" stroke-linecap="round" fill="none"/>';
    else s += '<path d="M43 50 Q48 47.5 53 49 M67 49 Q72 47.5 77 50" stroke="' + C.hair + '" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
    if (face === 'joy') {
      s += '<path d="M45 61 Q49 56 53 61 M67 61 Q71 56 75 61" stroke="#1b2440" stroke-width="2.6" stroke-linecap="round" fill="none"/>';
    } else {
      s += '<ellipse cx="49" cy="60" rx="3.5" ry="4.5" fill="#1b2440"/><ellipse cx="71" cy="60" rx="3.5" ry="4.5" fill="#1b2440"/>' +
        '<circle cx="50.3" cy="58.3" r="1.25" fill="#fff"/><circle cx="72.3" cy="58.3" r="1.25" fill="#fff"/>';
    }
    s += '<ellipse cx="41" cy="68" rx="4.6" ry="2.7" fill="#ff9f93" opacity=".55"/><ellipse cx="79" cy="68" rx="4.6" ry="2.7" fill="#ff9f93" opacity=".55"/>';
    if (face === 'worry') {
      s += '<path d="M54 74 Q57 71 60 74 Q63 77 66 74" stroke="#8a4636" stroke-width="2.3" stroke-linecap="round" fill="none"/>' +
        '<path d="M97 34 Q102 42 97 46 Q92 42 97 34Z" fill="#9ad0f5"/>';
    } else if (face === 'curious') {
      s += '<ellipse cx="61" cy="73" rx="3.4" ry="3.9" fill="#8a4636"/><ellipse cx="61" cy="74.6" rx="2" ry="1.5" fill="#ff9f93"/>';
    } else if (face === 'joy') {
      s += '<path d="M51 69 Q60 81 69 69 Z" fill="#8a4636"/><path d="M54.5 72.5 Q60 76.5 65.5 72.5" stroke="#ff8f8f" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    } else {
      s += '<path d="M53 70.5 Q60 78 67 70.5" stroke="#8a4636" stroke-width="2.4" stroke-linecap="round" fill="#fff"/>';
    }
    if (pose === 'scratch') s += '<path d="M82 97 Q103 84 95 60" stroke="' + top + '" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="93" cy="55" r="6.5" fill="' + C.skin + '"/>';
    return s + '</svg>';
  }

  /* ================= 계명대학교 성서캠퍼스 붉은 벽돌 본관 일러스트 (첫·마지막 장면 배경) =================
   * 참고 사진: 붉은 벽돌 3층 · 흰 창틀 · 파란 지붕 · 가운데 흰 기둥 4개 + 원형 문장 삼각지붕 + 흰 종탑(돔)
   *           양 끝 흰 박공지붕과 모서리 흰 돌장식 · 계단 · 큰 바위 · 국기 게양대 · 소나무 · 잔디 · 도로 */
  var HB = { brick: '#b4533e', brickDk: '#93402f', white: '#f5f2ec', trim: '#e2dccf', roof: '#2c4a9a', roofDk: '#213a7d',
    glass: '#a9c3de', lit: '#ffd27a', door: '#2d3540', stone: '#e6e0d4', pine: '#235a40', pine2: '#2f7150', hedge: '#2a6146' };
  function hR(x, y, w, h, fill, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function hWin(x, y, eve, k) {
    var lit = eve && (k % 5 !== 1);
    return hR(x - 2.5, y - 2.5, 27, 39, HB.white) +
      '<rect class="' + (lit ? 'kc-hlit kc-hlit' + (k % 4) : '') + '" x="' + x + '" y="' + y + '" width="22" height="34" fill="' + (lit ? HB.lit : HB.glass) + '"/>' +
      hR(x + 10, y, 2, 34, HB.white) + hR(x, y + 15, 22, 2, HB.white);
  }
  function hQuoins(x, top, base) {
    var s = '';
    for (var y = top, i = 0; y < base - 4; y += 18, i++) s += hR(x - (i % 2 ? 0 : 4), y, i % 2 ? 12 : 16, 9, HB.white);
    return s;
  }
  function hPine(x, y, r) {
    return hR(x - r * 0.07, y - r * 0.9, r * 0.14, r * 0.9, '#4a3526') +
      '<ellipse cx="' + x + '" cy="' + (y - r * 0.95) + '" rx="' + r + '" ry="' + (r * 0.32) + '" fill="' + HB.pine + '"/>' +
      '<ellipse cx="' + (x - r * 0.15) + '" cy="' + (y - r * 1.3) + '" rx="' + (r * 0.75) + '" ry="' + (r * 0.26) + '" fill="' + HB.pine2 + '"/>' +
      '<ellipse cx="' + (x + r * 0.1) + '" cy="' + (y - r * 1.58) + '" rx="' + (r * 0.48) + '" ry="' + (r * 0.2) + '" fill="' + HB.pine + '"/>';
  }
  // 건물 본체: (0,0) = 가운데 아래(현관 바닥), 폭 1300
  function hallBody(eve) {
    var s = '', k = 0, i, r, x;
    // 파란 지붕 · 처마
    s += '<path d="M-645 -206 L-622 -240 L622 -240 L645 -206 Z" fill="' + HB.roof + '"/>' + hR(-622, -240, 1244, 5, HB.roofDk);
    // 본체 벽돌 · 처마 흰띠 · 기단
    s += hR(-650, -206, 1300, 206, HB.brick) + hR(-656, -212, 1312, 9, HB.white) + hR(-652, -14, 1304, 14, HB.stone);
    // 층 구분 흰 띠
    s += hR(-650, -140, 1300, 3, HB.white, ' opacity=".55"') + hR(-650, -74, 1300, 3, HB.white, ' opacity=".55"');
    // 날개 창문 (왼쪽·오른쪽 각 7칸 × 3층)
    for (r = 0; r < 3; r++) {
      for (i = 0; i < 7; i++) {
        x = -398 + i * 36; s += hWin(x, -190 + r * 66, eve, k++);
        x = 154 + i * 36; s += hWin(x, -190 + r * 66, eve, k++);
      }
    }
    // 양 끝 박공 건물 (돌출) + 모서리 흰 돌장식 + 흰 삼각지붕
    [-650, 420].forEach(function (px) {
      s += hR(px, -212, 230, 212, HB.brick) + hR(px + (px < 0 ? 222 : 0), -212, 8, 212, HB.brickDk, ' opacity=".5"');
      for (r = 0; r < 3; r++) for (i = 0; i < 4; i++) s += hWin(px + 32 + i * 46, -190 + r * 66, eve, k++);
      s += hQuoins(px + 2, -206, -14) + hQuoins(px + 214, -206, -14);
      s += hR(px - 8, -218, 246, 10, HB.white);
      s += '<path d="M' + (px - 12) + ' -218 L' + (px + 115) + ' -300 L' + (px + 242) + ' -218 Z" fill="' + HB.white + '"/>' +
        '<path d="M' + (px + 8) + ' -224 L' + (px + 115) + ' -290 L' + (px + 222) + ' -224 Z" fill="' + HB.trim + '" opacity=".55"/>';
    });
    // 종탑 (가운데 뒤): 벽돌 기단 · 흰 난간 · 흰 등탑 · 돔 · 꼭대기 장식
    s += hR(-42, -372, 84, 100, HB.brick) + hR(-48, -378, 96, 8, HB.white) + hR(-50, -396, 100, 18, HB.white);
    for (i = 0; i < 9; i++) s += hR(-44 + i * 11, -392, 3, 12, HB.trim);
    s += hR(-32, -452, 64, 56, HB.white);
    for (i = 0; i < 3; i++) s += '<path d="M' + (-25 + i * 19) + ' -402 V-434 Q' + (-19 + i * 19) + ' -444 ' + (-13 + i * 19) + ' -434 V-402 Z" fill="' + (eve ? HB.lit : '#5d6f86') + '"/>';
    s += hR(-38, -458, 76, 7, HB.white) + '<path d="M-34 -458 Q0 -505 34 -458 Z" fill="#3b4b60"/>' + hR(-2, -522, 4, 22, '#3b4b60') + '<circle cx="0" cy="-524" r="4.5" fill="#c9922e"/>';
    // 가운데 돌출부 (벽돌) + 흰 삼각지붕 + 원형 문장
    s += hR(-140, -212, 280, 212, HB.brick) + hR(-146, -218, 292, 10, HB.white);
    s += '<path d="M-156 -218 L0 -300 L156 -218 Z" fill="' + HB.white + '"/><path d="M-132 -224 L0 -290 L132 -224 Z" fill="' + HB.trim + '" opacity=".55"/>' +
      '<circle cx="0" cy="-248" r="12" fill="' + HB.white + '" stroke="#9aa3ad" stroke-width="2.5"/><circle cx="0" cy="-248" r="5" fill="none" stroke="#9aa3ad" stroke-width="2"/>';
    // 기둥 뒤 창문 · 현관문
    for (r = 0; r < 2; r++) for (i = 0; i < 3; i++) s += hWin(-83 + i * 72, -176 + r * 66, eve, k++);
    s += hR(-30, -76, 60, 62, HB.white) + hR(-24, -70, 48, 56, HB.door);
    // 흰 기둥 4개 · 엔타블러처
    s += hR(-138, -206, 276, 16, HB.white);
    [-112, -42, 26, 96].forEach(function (cx) {
      s += hR(cx - 2, -192, 20, 7, HB.white) + hR(cx, -186, 16, 170, HB.white) + hR(cx + 10, -186, 6, 170, HB.trim, ' opacity=".8"') + hR(cx - 3, -20, 22, 8, HB.white);
    });
    // 국기 게양대 (왼쪽)
    s += hR(-244, -250, 4, 250, '#e9eef3') + hR(-240, -248, 34, 22, '#ffffff', ' stroke="#d0d5db" stroke-width="1"') +
      '<path d="M-229 -237 a6 6 0 0 1 12 0 Z" fill="#cd2e3a"/><path d="M-229 -237 a6 6 0 0 0 12 0 Z" fill="#0047a0"/>';
    // 기단 앞 화단·나무
    s += hR(-650, -18, 480, 18, HB.hedge, ' rx="8"') + hR(170, -18, 480, 18, HB.hedge, ' rx="8"');
    s += hPine(-575, 4, 46) + hPine(-330, 6, 52) + hPine(-205, 4, 30) + hPine(215, 4, 30) + hPine(340, 6, 52) + hPine(585, 4, 46);
    // 계단 · 큰 바위
    s += '<path d="M-150 0 L150 0 L190 24 L-190 24 Z" fill="#d9d4cb"/>' + hR(-170, 8, 340, 2, '#c3bdb2') + hR(-180, 16, 360, 2, '#c3bdb2');
    s += '<path d="M-26 92 Q-36 52 -16 36 Q4 24 22 38 Q38 58 28 92 Z" fill="#6c7074"/><path d="M-14 44 Q2 34 14 44" stroke="#8d9296" stroke-width="4" fill="none" stroke-linecap="round"/>';
    return s;
  }
  function cloud(x, y, sc, cls) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><g class="kc-cloud ' + cls + '">' +
      '<ellipse cx="0" cy="0" rx="90" ry="26" fill="#fff"/><ellipse cx="-40" cy="-14" rx="44" ry="26" fill="#fff"/>' +
      '<ellipse cx="26" cy="-22" rx="52" ry="32" fill="#fff"/><ellipse cx="78" cy="-6" rx="34" ry="20" fill="#fff"/></g></g>';
  }
  function campusHall(kind, time) {
    var wide = kind === 'wide', eve = time === 'evening', gid = kind + (eve ? 'pm' : 'am');
    var W = wide ? 1600 : 900, H = wide ? 900 : 1600, gy = wide ? 720 : 1250;
    var s = '<svg class="kc-hall kc-hall-' + kind + '" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="kcHSky' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
      (eve ? '<stop offset="0" stop-color="#0e2350"/><stop offset=".45" stop-color="#3a5fb0"/><stop offset=".72" stop-color="#e9a86a"/><stop offset=".86" stop-color="#f7d9a0"/>'
           : '<stop offset="0" stop-color="#3b84e2"/><stop offset=".45" stop-color="#6eaaf0"/><stop offset=".75" stop-color="#c4e0fa"/><stop offset=".86" stop-color="#eef6fd"/>') +
      '</linearGradient><linearGradient id="kcHLawn' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9a4f"/><stop offset="1" stop-color="#2f6f3c"/></linearGradient></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#kcHSky' + gid + ')"/>';
    if (!eve) s += wide ? cloud(260, 150, 1.3, 'kc-cl1') + cloud(1340, 110, 1, 'kc-cl2') + cloud(820, 70, .8, 'kc-cl3')
                        : cloud(180, 300, 1.1, 'kc-cl1') + cloud(720, 420, .9, 'kc-cl2');
    else s += '<circle cx="' + (W * 0.5) + '" cy="' + (gy - 120) + '" r="' + (wide ? 340 : 300) + '" fill="#ffe2a8" opacity=".3"/>';
    s += '<path d="M0 ' + (gy - 120) + ' Q' + (W * .25) + ' ' + (gy - 190) + ' ' + (W * .5) + ' ' + (gy - 140) + ' T' + W + ' ' + (gy - 150) + ' V' + gy + ' H0Z" fill="' + (eve ? '#4b5f95' : '#6f9fbf') + '" opacity=".5"/>';
    // 넓은 화면: 종탑·흰 기둥이 학생과 휴대폰 사이에 보이도록 건물 중심을 오른쪽(71%)으로
    s += '<g class="kc-hallg"><g transform="translate(' + (wide ? 1136 : 450) + ' ' + gy + ') scale(' + (wide ? 1 : 0.95) + ')">' + hallBody(eve) + '</g>';
    var lawnTop = gy + (wide ? 24 : 22), roadTop = gy + (wide ? 120 : 190);
    s += '<path d="M0 ' + lawnTop + ' H' + W + ' V' + roadTop + ' H0Z" fill="url(#kcHLawn' + gid + ')"/>' +
      '<path d="M0 ' + gy + ' H' + W + ' V' + lawnTop + ' H0Z" fill="#7f8a92" opacity=".55"/>' +
      hR(0, roadTop, W, 8, '#e3e5e8') + hR(0, roadTop + 8, W, H - roadTop - 8, '#8c9196') +
      hR(0, roadTop + 26, W, 3, '#ffffff', ' opacity=".55"') + '</g>';
    return s + '</svg>';
  }

  /* ================= 화면 조각 ================= */
  function copy(eyebrow, h, sub, extra) {
    return '<div class="kc-copy">' + (eyebrow ? '<span class="kc-eyebrow">' + eyebrow + '</span>' : '') +
      '<h3 class="kc-h">' + h + '</h3>' + (sub ? '<p class="kc-sub">' + sub + '</p>' : '') + (extra || '') + '</div>';
  }
  var CAL_ICON = '<svg class="kc-appicon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
    '<rect width="64" height="64" rx="14" fill="#00376E"/><rect x="13" y="14" width="38" height="38" rx="5" fill="#fff"/>' +
    '<path d="M13 19a5 5 0 0 1 5-5h28a5 5 0 0 1 5 5v6H13z" fill="#C9922E"/><path d="M23 10v9M41 10v9" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M20 34h5v5h-5zM30 34h5v5h-5zM40 34h5v5h-5zM20 43h5v5h-5zM30 43h5v5h-5z" fill="#00376E"/></svg>';
  var DOC_ICON = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">' +
    '<path d="M10 4h14l8 8v22a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="#00376E" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M24 4v8h8" fill="none" stroke="#00376E" stroke-width="2.4" stroke-linejoin="round"/>' +
    '<path d="M13 19h13M13 24h13M13 29h8" stroke="#8394A8" stroke-width="2.2" stroke-linecap="round"/>' +
    '<circle cx="15" cy="12" r="3.6" fill="#C9922E"/></svg>';
  var REFRESH = '<svg class="kc-refresh" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
    '<path d="M38 24a14 14 0 1 1-4.1-9.9" stroke="#00376E" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<path d="M36 6 L37 16 L27 16" stroke="#00376E" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // 휴대폰 화면 (특정 은행 앱이 아닌 일반적인 '내 통장' 화면)
  function phone(kind) {
    var body;
    if (kind === 'empty') {
      body = '<div class="kc-ph-hd"><b>내 통장</b><span>입출금 내역</span></div>' +
        '<div class="kc-ph-sk"><i></i><i></i></div><div class="kc-ph-sk"><i></i><i></i></div>' +
        '<div class="kc-ph-empty"><span class="kc-ph-emo">📭</span>새로운 입금 내역이 없어요</div>' +
        '<div class="kc-ph-sk kc-ph-sk2"><i></i><i></i></div>';
    } else {
      body = '<div class="kc-ph-hd"><b>내 통장</b><span>입출금 내역</span></div>' +
        '<div class="kc-noti"><span class="kc-noti-ic">🔔</span><span class="kc-noti-t"><b>장학금 입금 완료!</b><small>방금 전 · 계명대학교</small></span></div>' +
        '<div class="kc-ph-row kc-ph-new"><span class="kc-ph-dot"></span><span>장학금 입금</span><em>입금</em></div>' +
        '<div class="kc-ph-sk"><i></i><i></i></div><div class="kc-ph-sk"><i></i><i></i></div>';
    }
    return '<div class="kc-phone kc-phone-' + kind + '"><span class="kc-ph-notch"></span><div class="kc-ph-screen">' + body + '</div></div>';
  }
  // 9월 달력 (2026년 9월 1일 = 화요일)
  var MONTH_START = 2, MONTH_DAYS = 30;
  function monthGrid(bars) {
    var cells = [], d, i;
    for (i = 0; i < MONTH_START; i++) cells.push({ n: 31 - MONTH_START + 1 + i, out: true });
    for (d = 1; d <= MONTH_DAYS; d++) cells.push({ n: d });
    var nd = 1; while (cells.length % 7) cells.push({ n: nd++, out: true });
    var s = '<div class="kc-dow"><span class="kc-sun">일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span class="kc-sat">토</span></div><div class="kc-weeks">';
    for (var w = 0; w < cells.length / 7; w++) {
      s += '<div class="kc-week">';
      for (var c = 0; c < 7; c++) {
        var cell = cells[w * 7 + c];
        s += '<span class="kc-day' + (cell.out ? ' kc-out' : '') + (c === 0 ? ' kc-sun' : '') + (c === 6 ? ' kc-sat' : '') + (!cell.out && cell.n === 21 ? ' kc-d21' : '') + '">' + cell.n + '</span>';
      }
      for (var b = 0; b < bars.length; b++) {
        var br = bars[b];
        if (br.week === w) s += '<span class="kc-bar kc-bar-' + br.type + ' kc-c' + br.col + ' kc-w' + br.span + ' kc-row' + (br.row || 0) + (br.cls ? ' ' + br.cls : '') + '">' + br.text + '</span>';
      }
      if (w === 3) s += '<span class="kc-finger kc-f2" aria-hidden="true">👆</span>';
      s += '</div>';
    }
    return s + '</div>';
  }
  // 실제 '계명대 장학금 캘린더' 화면처럼: 요일줄 + 날짜칸 + 색 막대 (2026년 9월 13일 일요일부터 n주)
  function weekRows(start, weeks, bars, mark, monthDays) {
    var wd = ['일', '월', '화', '수', '목', '금', '토'];
    var s = '<div class="kc-dow">';
    for (var i = 0; i < 7; i++) s += '<span' + (i === 0 ? ' class="kc-sun"' : i === 6 ? ' class="kc-sat"' : '') + '>' + wd[i] + '</span>';
    s += '</div><div class="kc-weeks">';
    for (var w = 0; w < weeks; w++) {
      s += '<div class="kc-week">';
      for (var c = 0; c < 7; c++) {
        var n = start + w * 7 + c, out = monthDays && n > monthDays;
        if (out) n -= monthDays;
        s += '<span class="kc-day' + (out ? ' kc-out' : '') + (c === 0 ? ' kc-sun' : '') + (c === 6 ? ' kc-sat' : '') + (!out && n === mark ? ' kc-dmark' : '') + '"><i>' + n + '</i></span>';
      }
      for (var b = 0; b < bars.length; b++) {
        var br = bars[b];
        if (br.week === w) s += '<span class="kc-bar kc-bar-' + br.type + ' kc-c' + br.col + ' kc-w' + br.span + ' kc-row' + (br.row || 0) + (br.cls ? ' ' + br.cls : '') + '">' + br.text + '</span>';
      }
      s += '</div>';
    }
    return s + '</div>';
  }
  function legend() {
    return '<div class="kc-legend"><span class="kc-lg-all">전체</span><span><i class="kc-dot kc-dot-apply"></i>신청</span><span><i class="kc-dot kc-dot-pay"></i>지급</span><span><i class="kc-dot kc-dot-due"></i>납부·마감</span></div>';
  }
  function upItem(n, day, mon, name, sub, dday) {
    return '<div class="kc-up kc-up' + n + '"><span class="kc-up-date"><b>' + day + '</b><small>' + mon + '</small></span>' +
      '<span class="kc-up-txt"><b>' + name + '</b><small>' + sub + '</small></span>' + dday + '</div>';
  }

  /* ================= 장면 마크업 ================= */
  function scenesHTML() {
    var s = '';
    // 0 오프닝 — 붉은 벽돌 본관 앞(낮), 휴대폰 속 텅 빈 통장 (엔딩과 수미상관)
    s += '<section class="kc-scene kc-s0 kc-dark">' +
      campusHall('wide', 'day') + campusHall('tall', 'day') + '<i class="kc-gate-shade"></i>' +
      '<i class="kc-k kc-k1"></i><i class="kc-k kc-k2"></i><i class="kc-k kc-k3"></i><i class="kc-k kc-k4"></i>' +
      copy('계명대 장학금 캘린더', '장학금,<br><em>언제 들어와요?</em> 🤷‍♂️', '받는 날이 궁금해서 통장만 들여다본 적 있죠?') +
      '<div class="kc-visual"><div class="kc-duo">' +
      '<span class="kc-duo-fig">' + person({ pose: 'phone', face: 'curious' }) + '</span>' +
      '<span class="kc-tear"><span class="kc-tear-top">9월</span>' +
      '<span class="kc-tp kc-tp1"><b>14</b><small>월요일</small></span><span class="kc-tp kc-tp2"><b>15</b><small>화요일</small></span><span class="kc-tp kc-tp3"><b>16</b><small>수요일</small></span></span>' +
      phone('empty') + '<i class="kc-link"></i>' +
      '</div></div></section>';
    // 1 기다림
    s += '<section class="kc-scene kc-s1 kc-light">' +
      copy('이런 적 있죠?', '매번 <em>통장만</em><br>새로고침했죠? 🔄', '언제 들어올지 몰라서 하루에도 몇 번씩…') +
      '<div class="kc-visual"><div class="kc-wait">' +
      '<span class="kc-bub kc-b1">이번 주? 다음 주? 🤔</span>' +
      '<span class="kc-bub kc-b2">오늘은 들어왔나…</span>' +
      '<span class="kc-bub kc-b3">언제 들어오는 거지? 😥</span>' +
      '<span class="kc-rf">' + REFRESH + '</span>' +
      '<span class="kc-wait-fig">' + person({ pose: 'scratch', face: 'curious' }) + '</span>' +
      '</div></div></section>';
    // 2 비밀 — 장학금 지급 처리 완료 → 지급일 확정 → 캘린더 반영 (학생 눈높이 표현)
    s += '<section class="kc-scene kc-s2 kc-light">' +
      copy('그래서 준비했어요', '지급일자가 확정되면,<br><em>바로바로</em> 반영!', '지급일이 정해지는 즉시 캘린더에 올려 드려요') +
      '<div class="kc-visual"><div class="kc-flow">' +
      '<div class="kc-card kc-doc">' +
      '<span class="kc-doc-ic">' + DOC_ICON + '</span>' +
      '<span class="kc-doc-t"><b>전표처리 완료</b><small>국가장학금 I유형</small></span>' +
      '<span class="kc-tag kc-doc-tag">예시</span>' +
      '<span class="kc-okbadge" aria-hidden="true">✓</span>' +
      '</div>' +
      '<div class="kc-arrow"><span class="kc-arrow-t">지급일 확정!</span><i class="kc-arrow-l"></i></div>' +
      '<div class="kc-datepill">📅 9월 21일(월) 지급 예정</div>' +
      '<div class="kc-arrow kc-arrow2"><span class="kc-arrow-t">캘린더에 바로 반영</span><i class="kc-arrow-l"></i></div>' +
      '<div class="kc-card kc-mcal">' +
      '<div class="kc-app-top"><span class="kc-nav">‹</span><b>2026년 9월</b><span class="kc-nav">›</span><span class="kc-today">오늘</span>' + legend() + '</div>' +
      weekRows(13, 2, [
        { week: 0, col: 0, span: 7, type: 'apply', text: '교내 다자녀 장학금 신청', row: 0 },
        { week: 1, col: 0, span: 7, type: 'apply', text: '교내 다자녀 장학금 신청', row: 0 },
        { week: 1, col: 5, span: 1, type: 'pay', text: '계명행복우수A 지급', row: 1 },
        { week: 1, col: 1, span: 1, type: 'pay', text: '국가장학금 I유형 지급', row: 1, cls: 'kc-bar-new' }
      ], 21) +
      '<span class="kc-callout">✓ 9월 21일(월) 국가장학금 I유형 지급, 캘린더 반영 완료!</span>' +
      '</div>' +
      '</div></div></section>';
    // 2b 꼭 알아두세요 (v9) — 캘린더에 안 보이면 = 아직 지급일 확정 전
    //    9/20(일)~10/3(토) 2주: 교내 다자녀 장학금 '신청' 막대(~9/30)만 있고 '지급' 막대는 아직 없음
    s += '<section class="kc-scene kc-s2b kc-light">' +
      copy('꼭 알아두세요', '캘린더에 안 보인다면?<br><em>아직 지급일 확정 전</em>이에요', '신청 일정만 있고 지급일이 없다면, 아직 정해지지 않은 거예요') +
      '<div class="kc-visual"><div class="kc-nq">' +
      '<span class="kc-nq-q">다자녀 장학금 지급일이 안 보여요 🤔</span>' +
      '<div class="kc-card kc-nq-cal">' +
      '<div class="kc-app-top"><span class="kc-nav">‹</span><b>2026년 9월</b><span class="kc-nav">›</span><span class="kc-today">오늘</span>' + legend() + '</div>' +
      '<div class="kc-nq-pick"><span class="kc-nq-pick-l">보고 싶은 장학 종류</span><span class="kc-nq-pick-v">교내 다자녀 장학금<i>▾</i></span></div>' +
      '<div class="kc-nq-grid">' + weekRows(20, 2, [
        { week: 0, col: 0, span: 7, type: 'apply', text: '교내 다자녀 장학금 신청', row: 0 },
        { week: 1, col: 0, span: 4, type: 'apply', text: '교내 다자녀 장학금 신청', row: 0 }
      ], 0, 30) +
      '<span class="kc-nq-lens" aria-hidden="true"><svg viewBox="0 0 40 40" focusable="false"><circle cx="16" cy="16" r="11" fill="rgba(255,255,255,.55)" stroke="#00376E" stroke-width="4"/><path d="M24.5 24.5 L35 35" stroke="#00376E" stroke-width="5.5" stroke-linecap="round"/></svg></span>' +
      '</div>' +
      '<span class="kc-tag kc-nq-tag">예시</span>' +
      '</div>' +
      '<div class="kc-nq-a"><span class="kc-nq-hg" aria-hidden="true"><svg viewBox="0 0 32 40" focusable="false"><path d="M6 3h20M6 37h20" stroke="#9a6f1c" stroke-width="3.4" stroke-linecap="round"/><path d="M8 4c0 9 8 11 8 16s-8 7-8 16h16c0-9-8-11-8-16s8-7 8-16z" fill="#fff" stroke="#9a6f1c" stroke-width="2.6" stroke-linejoin="round"/><path class="kc-hg-top" d="M10.5 8h11c-1 4-5.5 6.5-5.5 9.5c0-3-4.5-5.5-5.5-9.5z" fill="#C9922E"/><path class="kc-hg-bot" d="M10 34c.8-5 6-6.5 6-9.5c0 3 5.2 4.5 6 9.5z" fill="#C9922E"/></svg></span>' +
      '<span class="kc-nq-at"><b>지급일 확정 전이라 아직 안 보여요</b><small>확정되는 즉시 캘린더에 바로 올라와요</small></span></div>' +
      '</div></div></section>';
    // 3 사용법 — 장학 종류 고르기 → 달력 막대 → 날짜 누르기
    var bars = [
      { week: 0, col: 2, span: 5, type: 'apply', text: '계명행복우수장학금A 신청', row: 0 },
      { week: 3, col: 1, span: 1, type: 'pay', text: '국가장학금 I유형 지급', row: 0, cls: 'kc-bar-hero' },
      { week: 3, col: 5, span: 1, type: 'pay', text: '계명행복우수A 지급', row: 0 }
    ];
    s += '<section class="kc-scene kc-s3 kc-light">' +
      copy('이렇게 써요', '내 장학금만 골라서,<br><em>날짜를 한눈에</em>', '보고 싶은 장학 종류를 고르면 달력에 쏙 나타나요') +
      '<div class="kc-visual"><div class="kc-card kc-app">' +
      '<div class="kc-app-top"><span class="kc-nav">‹</span><b>2026년 9월</b><span class="kc-nav">›</span><span class="kc-today">오늘</span>' + legend() + '</div>' +
      '<div class="kc-filter"><span class="kc-cf-label">보고 싶은 장학 종류를 선택해주세요🧑‍🎓</span>' +
      '<span class="kc-cf-btn"><span class="kc-cf-sum kc-cf-all">전체</span><span class="kc-cf-sum kc-cf-two">2개 선택</span><i>▾</i><span class="kc-finger kc-f1" aria-hidden="true">👆</span></span>' +
      '<span class="kc-cf-pop"><span class="kc-cf-head"><b>달력에 표시할 장학금</b><em>전체선택</em></span>' +
      '<span class="kc-cf-opt kc-o1"><i></i>국가장학금 I유형</span>' +
      '<span class="kc-cf-opt kc-o2"><i></i>교내 다자녀 장학금</span>' +
      '<span class="kc-cf-opt kc-o3"><i></i>계명행복우수장학금A</span>' +
      '<span class="kc-cf-opt kc-o4"><i></i>국가근로장학금</span></span>' +
      '</div>' +
      '<div class="kc-month">' + monthGrid(bars) + '</div>' +
      '<span class="kc-detail"><span class="kc-dt-chip">지급</span><b>국가장학금 I유형</b><span class="kc-dt-date">2026. 9. 21.(월)</span><small>지급 예정일 · 사정에 따라 달라질 수 있어요</small></span>' +
            '<span class="kc-tag kc-app-tag">예시</span>' +
      '</div></div></section>';
    // 4 다가오는 일정 — D-day + 일정 전체보기
    s += '<section class="kc-scene kc-s4 kc-light">' +
      copy('놓치지 않게', '다가오는 지급일도<br><em>D-day</em>로 쏙!', '‘장학금 일정 전체보기’에서 신청·지급 일정을 한 번에') +
      '<div class="kc-visual"><div class="kc-s4-wrap">' +
      '<div class="kc-card kc-upnext"><div class="kc-card-hd"><b>다가오는 일정</b><span class="kc-count">3</span><span class="kc-tag">예시</span></div>' +
      upItem(1, '21', '9월', '국가장학금 I유형', '지급 · 9.21', '<span class="kc-dd kc-dd-hero"><i>D-3</i><i>D-2</i><i>D-1</i><i>D-DAY</i></span>') +
      upItem(2, '25', '9월', '계명행복우수장학금A', '지급 · 9.25', '<span class="kc-dd">D-7</span>') +
      upItem(3, '30', '9월', '교내 다자녀 장학금', '신청 · ~9.30', '<span class="kc-dd">D-12</span>') +
      '</div>' +
      '<div class="kc-card kc-table"><div class="kc-tb-title">장학금 일정 전체보기</div>' +
      '<div class="kc-tr kc-th"><span>구분</span><span>장학금</span><span>기간 / 일자</span></div>' +
      '<div class="kc-tr kc-tr1"><span><i class="kc-chip kc-chip-pay">지급</i></span><span>국가장학금 I유형</span><span>2026. 9. 21.(월)</span></div>' +
      '<div class="kc-tr kc-tr2"><span><i class="kc-chip kc-chip-pay">지급</i></span><span>계명행복우수장학금A</span><span>2026. 9. 25.(금)</span></div>' +
      '<div class="kc-tr kc-tr3"><span><i class="kc-chip kc-chip-apply">신청</i></span><span>교내 다자녀 장학금</span><span>9. 1.(화) ~ 9. 30.(수)</span></div>' +
      '</div></div></div></section>';
    // 5 엔딩 — 노을 진 본관 앞, 휴대폰에 입금 알림 (오프닝과 수미상관)
    s += '<section class="kc-scene kc-s5 kc-dark">' +
      campusHall('wide', 'evening') + campusHall('tall', 'evening') + '<i class="kc-gate-shade"></i>' +
      '<i class="kc-k kc-k1"></i><i class="kc-k kc-k2"></i><i class="kc-k kc-k3"></i><i class="kc-k kc-k4"></i>' +
      '<span class="kc-conf" aria-hidden="true"><i class="kc-cf kc-cf1"></i><i class="kc-cf kc-cf2"></i><i class="kc-cf kc-cf3"></i><i class="kc-cf kc-cf4"></i><i class="kc-cf kc-cf5"></i><i class="kc-cf kc-cf6"></i><i class="kc-cf kc-cf7"></i><i class="kc-cf kc-cf8"></i></span>' +
      copy('이제 기다리지 말고', '장학금 언제 받나요?<br>이제 <em>계명대 장학금 캘린더</em>에서!', '',
        '<button type="button" class="kc-cta" data-kc-cta>' + '지금 캘린더 확인하기 →</button>' +
        '<p class="kc-fine">지급일은 예정일이며 학생 계좌·은행 사정 등에 따라 달라질 수 있어요</p>') +
      '<div class="kc-visual"><div class="kc-duo">' +
      '<span class="kc-duo-fig">' + person({ pose: 'phone', face: 'joy' }) + '</span>' +
      '<span class="kc-endicon">' + CAL_ICON + '</span>' +
      phone('paid') + '<i class="kc-link"></i>' +
      '</div></div></section>';
    return s;
  }

  /* ================= 아이콘 ================= */
  var IC = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"/></svg>',
    on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="kc-stroke" d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"/></svg>',
    off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path class="kc-stroke" d="M16 9l5 6M21 9l-5 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="kc-stroke" d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  function fmt(t) {
    t = Math.max(0, Math.floor(t));
    return Math.floor(t / 60) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60);
  }

  /* ================= 플레이어 ================= */
  var current = null;

  function open(opts) {
    opts = opts || {};
    if (current) current.close();
    var audio = opts.audio || null;
    var opener = opts.opener || document.activeElement;
    var target = opts.target || '';
    var base = opts.base || '';

    var root = document.createElement('div');
    root.className = 'kc-overlay';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', '계명대 장학금 캘린더 소개 영상');
    root.innerHTML =
      '<div class="kc-dialog">' +
      '<div class="kc-top"><span class="kc-title">▶ 계명대 장학금 캘린더, 40초 안내</span>' +
      '<button type="button" class="kc-ibtn kc-close" aria-label="영상 닫기">' + IC.close + '</button></div>' +
      '<div class="kc-stage"><div class="kc-mark"><img class="kc-mark-logo" src="' + base + 'kmu-logo.png" alt="계명대학교" decoding="async"><i class="kc-mark-div"></i><span class="kc-mark-t"><b>계명대학교 장학복지팀</b><small>SCHOLARSHIP &amp; WELFARE TEAM</small></span></div><div class="kc-scenes"></div>' +
      '<div class="kc-loading"><i></i>불러오는 중…</div></div>' +
      '<div class="kc-ctrl">' +
      '<button type="button" class="kc-ibtn kc-play" aria-label="일시정지">' + IC.pause + '</button>' +
      '<button type="button" class="kc-ibtn kc-replay" aria-label="처음부터 다시 보기">' + IC.replay + '</button>' +
      '<span class="kc-prog" aria-hidden="true"><i></i></span>' +
      '<span class="kc-time">0:00 / ' + fmt(DUR) + '</span>' +
      '<button type="button" class="kc-ibtn kc-sound" aria-label="소리 끄기">' + IC.on + '</button>' +
      '</div>' +
      '<p class="kc-credit"></p>' +
      '</div>';

    var $ = function (sel) { return root.querySelector(sel); };
    $('.kc-credit').textContent = opts.credit || 'Music: “Life of Riley” Kevin MacLeod (incompetech.com) · CC BY 4.0';
    var scenesEl = $('.kc-scenes'), progEl = $('.kc-prog i'), timeEl = $('.kc-time');
    var playBtn = $('.kc-play'), soundBtn = $('.kc-sound');
    var scenes = [];
    var t = 0, offset = 0, base0 = 0, raf = 0, playing = false, ended = false;
    var useAudio = false, muted = false, startTimer = 0, alive = true, firstRun = true;

    function build() {
      scenesEl.innerHTML = scenesHTML();
      scenes = Array.prototype.slice.call(scenesEl.querySelectorAll('.kc-scene'));
      var cta = scenesEl.querySelector('[data-kc-cta]');
      if (cta) cta.addEventListener('click', goTarget);
    }
    function render() {
      var last = scenes.length - 1;
      for (var i = 0; i < scenes.length; i++) {
        var a = CUTS[i], b = CUTS[i + 1];
        var on = t >= a && (i === last || t < b + 0.5);
        var out = i !== last && t >= b;
        scenes[i].classList.toggle('is-on', on);
        scenes[i].classList.toggle('is-out', on && out);
      }
      progEl.style.transform = 'scaleX(' + Math.min(1, t / DUR).toFixed(4) + ')';
      timeEl.textContent = fmt(t) + ' / ' + fmt(DUR);
    }
    function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
    function tick() {
      if (!playing) return;
      if (useAudio && audio && !audio.paused) t = audio.currentTime;
      else t = offset + (now() - base0) / 1000;
      if (t >= DUR - 0.02 || (useAudio && audio && audio.ended)) { t = DUR; render(); finish(); return; }
      render();
      raf = requestAnimationFrame(tick);
    }
    function setPlayIcon() {
      if (ended) { playBtn.innerHTML = IC.replay; playBtn.setAttribute('aria-label', '처음부터 다시 보기'); }
      else if (playing) { playBtn.innerHTML = IC.pause; playBtn.setAttribute('aria-label', '일시정지'); }
      else { playBtn.innerHTML = IC.play; playBtn.setAttribute('aria-label', '재생'); }
    }
    function setSoundIcon() {
      var off = muted || !useAudio;
      soundBtn.innerHTML = off ? IC.off : IC.on;
      soundBtn.setAttribute('aria-label', off ? '소리 켜기' : '소리 끄기');
    }
    function begin(fromAudio) {
      if (!alive || playing) return;
      clearTimeout(startTimer);
      useAudio = !!fromAudio;
      if (!useAudio && audio) { try { audio.pause(); } catch (e) {} }
      root.classList.remove('is-loading', 'is-paused', 'is-ended');
      offset = 0; base0 = now(); t = useAudio ? audio.currentTime : 0;
      playing = true; ended = false;
      setPlayIcon(); setSoundIcon();
      render();
      raf = requestAnimationFrame(tick);
    }
    function start() {
      cancelAnimationFrame(raf);
      playing = false; ended = false; t = 0; offset = 0;
      build(); render();
      root.classList.add('is-loading');
      if (!audio) { begin(false); return; }
      audio.muted = muted;
      var started = false;
      var go = function () { if (!started) { started = true; begin(true); } };
      var fail = function () { if (!started) { started = true; begin(false); } };
      // 첫 재생: 런처가 버튼 클릭 순간에 이미 음악 재생을 시작해 둔 상태면 그대로 이어서 씀
      if (firstRun && !audio.paused && audio.currentTime < 1.5) {
        firstRun = false;
        if (audio.readyState >= 3 && audio.currentTime > 0) { go(); return; }
        audio.addEventListener('playing', go, { once: true });
        startTimer = setTimeout(fail, 2500);
        return;
      }
      firstRun = false;
      try { audio.pause(); audio.currentTime = 0; } catch (e) {}
      audio.addEventListener('playing', go, { once: true });
      var pr;
      try { pr = audio.play(); } catch (e) { fail(); return; }
      if (pr && pr.catch) pr.catch(fail);
      startTimer = setTimeout(fail, 2500); // 음악이 늦게 오면 화면부터 시작
    }
    function pause() {
      if (!playing) return;
      playing = false; offset = t;
      cancelAnimationFrame(raf);
      if (useAudio && audio) audio.pause();
      root.classList.add('is-paused');
      setPlayIcon();
    }
    function resume() {
      if (playing || ended) return;
      root.classList.remove('is-paused');
      base0 = now(); playing = true;
      if (useAudio && audio) {
        try { audio.currentTime = offset; } catch (e) {}
        var pr = audio.play();
        if (pr && pr.catch) pr.catch(function () { useAudio = false; base0 = now(); setSoundIcon(); });
      }
      setPlayIcon();
      raf = requestAnimationFrame(tick);
    }
    function finish() {
      playing = false; ended = true;
      cancelAnimationFrame(raf);
      root.classList.add('is-ended');
      setPlayIcon();
    }
    function toggleSound() {
      if (!audio) return;
      if (!useAudio) {
        muted = false; audio.muted = false;
        try { audio.currentTime = Math.min(t, DUR - 0.1); } catch (e) {}
        var pr = audio.play();
        var ok = function () { useAudio = true; if (!playing) audio.pause(); setSoundIcon(); };
        if (pr && pr.then) pr.then(ok).catch(function () {}); else ok();
        return;
      }
      muted = !muted; audio.muted = muted; setSoundIcon();
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') {
        var f = root.querySelectorAll('button');
        if (!f.length) return;
        var first = f[0], lastB = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastB.focus(); }
        else if (!e.shiftKey && document.activeElement === lastB) { e.preventDefault(); first.focus(); }
      }
    }
    function onVis() { if (document.hidden) pause(); }
    function close() {
      if (!alive) return;
      alive = false;
      cancelAnimationFrame(raf); clearTimeout(startTimer);
      if (audio) { try { audio.pause(); } catch (e) {} }
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('visibilitychange', onVis);
      document.documentElement.classList.remove('kc-lock');
      root.classList.add('is-closing');
      setTimeout(function () { if (root.parentNode) root.parentNode.removeChild(root); }, 200);
      if (current === api) current = null;
      if (opener && opener.focus) { try { opener.focus({ preventScroll: true }); } catch (e) { opener.focus(); } }
    }
    /* v11: 화면 위에 붙어 있는 머리글(k-link의 상단 고정 헤더 등) 높이를 재서, 달력이 그 밑에 가려지지 않게 함 */
    function stickyTopOffset() {
      var off = 0, vh = window.innerHeight || 800;
      function check(e) {
        if (!e || e === root || e.nodeType !== 1) return;
        var cs = getComputedStyle(e);
        if (cs.position !== 'sticky' && cs.position !== 'fixed') return;
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        var t = parseFloat(cs.top), r = e.getBoundingClientRect();
        if (isNaN(t) || t > 4 || r.height <= 0 || r.height > vh * 0.5) return;
        if (cs.position === 'fixed' && r.top > 4) return;
        off = Math.max(off, t + r.height);
      }
      try {
        var kids = document.body ? document.body.children : [];
        for (var i = 0; i < kids.length; i++) {
          check(kids[i]);
          for (var j = 0; j < kids[i].children.length; j++) check(kids[i].children[j]);
        }
      } catch (e) {}
      return off;
    }
    function goTarget() {
      close();
      var el = null;
      try { el = target ? document.querySelector(target) : null; } catch (e) { el = null; }
      if (el) {
        setTimeout(function () {
          var off = stickyTopOffset();
          if (off > 0) {
            var y = el.getBoundingClientRect().top + (window.pageYOffset || 0) - off - 12;
            try { window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, y)); }
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          var focusable = el.querySelector('select, input, button');
          if (focusable) setTimeout(function () { try { focusable.focus({ preventScroll: true }); } catch (e) {} }, 600);
        }, 220);
      }
    }

    $('.kc-close').addEventListener('click', close);
    $('.kc-replay').addEventListener('click', start);
    playBtn.addEventListener('click', function () { if (ended) start(); else if (playing) pause(); else resume(); });
    soundBtn.addEventListener('click', toggleSound);
    root.addEventListener('click', function (e) { if (e.target === root) close(); });
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('visibilitychange', onVis);

    document.documentElement.classList.add('kc-lock');
    document.body.appendChild(root);
    var api = { close: close, pause: pause, resume: resume, restart: start, el: root };
    current = api;
    start();
    setTimeout(function () { try { $('.kc-close').focus({ preventScroll: true }); } catch (e) {} }, 50);
    return api;
  }

  window.KmuCalendarVideo = { open: open, duration: DUR };
})();
