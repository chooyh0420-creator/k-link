/*!
 * 계명대 장학금 캘린더 소개 영상 런처 (약 2KB) — 계명대학교 장학복지팀
 * 페이지에는 이 파일만 미리 넣어 둡니다. data-calendar-video 속성이 있는 버튼을 누르는 순간에만
 * calendar-video_v13.css / calendar-video_v13.js / 배경음악(mp3)을 불러오므로 평소 페이지 속도에는 영향이 없습니다.
 *
 * 사용법:
 *   <script src="/motion/calendar-launcher_v13.js" defer></script>
 *   <button type="button" class="kc-open-btn" data-calendar-video data-calendar-target="#t-cal">▶ 영상으로 보기</button>
 */
(function () {
  'use strict';
  var VER = '13';
  var DEFAULT_MUSIC = 'calendar-bgm_v13.mp3';
  var DEFAULT_CREDIT = 'Music: “Life of Riley” Kevin MacLeod (incompetech.com) · CC BY 4.0';
  var me = document.currentScript;
  var BASE = me && me.src ? me.src.replace(/[^\/]*(\?.*)?$/, '') : '';
  var loading = null;

  function loadAssets() {
    if (window.KmuCalendarVideo) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var done = 0;
      var ok = function () { if (++done === 2) resolve(); };
      var bad = function () { loading = null; reject(new Error('calendar-video load failed')); };
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = BASE + 'calendar-video_v13.css?v=' + VER;
      link.onload = ok; link.onerror = bad;
      document.head.appendChild(link);
      var s = document.createElement('script');
      s.src = BASE + 'calendar-video_v13.js?v=' + VER;
      s.onload = ok; s.onerror = bad;
      document.head.appendChild(s);
    });
    return loading;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('[data-calendar-video]') : null;
    if (!btn) return;
    e.preventDefault();
    if (btn.getAttribute('aria-busy') === 'true') return;

    // 휴대폰 자동재생 제한: 음악은 반드시 '누른 그 순간'에 재생을 시작해야 해서 여기서 시작합니다.
    var audio = null;
    try {
      // 배경음악: 확정곡 'Life of Riley' (버튼의 data-calendar-music 값이 있으면 그 파일)
      audio = new Audio(BASE + (btn.getAttribute('data-calendar-music') || DEFAULT_MUSIC) + '?v=' + VER);
      audio.preload = 'auto';
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    } catch (err) { audio = null; }

    btn.setAttribute('aria-busy', 'true');
    loadAssets().then(function () {
      btn.removeAttribute('aria-busy');
      window.KmuCalendarVideo.open({
        audio: audio,
        opener: btn,
        base: BASE,
        target: btn.getAttribute('data-calendar-target') || '',
        credit: btn.getAttribute('data-calendar-credit') || DEFAULT_CREDIT
      });
    }).catch(function () {
      btn.removeAttribute('aria-busy');
      if (audio) { try { audio.pause(); } catch (x) {} }
    });
  });
})();
