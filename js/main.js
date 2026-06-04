/* =====================================================================
   НАСЛЕДИЕ — общий скрипт сайта
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Аккордеон вопросов (FAQ) ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-item__q');
    if (!question) return;
    question.addEventListener('click', function () {
      item.classList.toggle('is-open');
    });
  });

  /* ---------- Переключение вкладок (типы проектов) ---------- */
  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
    });
  });

  /* ---------- Кнопка «Ещё»: показать скрытые проекты ---------- */
  var moreBtn = document.getElementById('moreBtn');
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var hidden = document.querySelectorAll('.project-card.is-hidden');
      hidden.forEach(function (card) { card.classList.remove('is-hidden'); });
      moreBtn.parentElement.style.display = 'none';
    });
  }

  /* ---------- Слайдеры (плавная прокрутка вручную) ---------- */
  function animateScroll(el, to) {
    var start = el.scrollLeft;
    var max = el.scrollWidth - el.clientWidth;
    to = Math.max(0, Math.min(to, max));
    var dist = to - start;
    if (Math.abs(dist) < 1) return;
    var duration = 380, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / duration, 1);
      var ease = 1 - Math.pow(1 - p, 3); /* ease-out-cubic */
      el.scrollLeft = start + dist * ease;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function bindSlider(trackId, prevSel, nextSel) {
    var track = document.getElementById(trackId);
    if (!track) return;
    function amount() {
      var first = track.children[0];
      if (!first) return 320;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return first.getBoundingClientRect().width + gap;
    }
    document.querySelectorAll(nextSel).forEach(function (b) {
      b.addEventListener('click', function () { animateScroll(track, track.scrollLeft + amount()); });
    });
    document.querySelectorAll(prevSel).forEach(function (b) {
      b.addEventListener('click', function () { animateScroll(track, track.scrollLeft - amount()); });
    });
  }
  bindSlider('reelsTrack', '[data-reels-prev]', '[data-reels-next]');
  bindSlider('stepsTrack', '[data-steps-prev]', '[data-steps-next]');

  /* ---------- Мобильное меню (бургер) ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  /* ---------- Модальное окно заявки ---------- */
  var modal = document.querySelector('.modal');
  if (modal) {
    var closeEls = modal.querySelectorAll('[data-modal-close]');
    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    closeEls.forEach(function (el) { el.addEventListener('click', closeModal); });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------- Заглушка отправки форм ---------- */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.reset();
      alert('Спасибо за заявку! Наш менеджер свяжется с вами в ближайшее время.');
    });
  });

  /* ---------- Тень у закреплённой шапки при скролле ---------- */
  var headerEl = document.querySelector('.header');
  if (headerEl) {
    var onHeaderScroll = function () {
      headerEl.classList.toggle('is-stuck', window.scrollY > 8);
    };
    window.addEventListener('scroll', onHeaderScroll, { passive: true });
    onHeaderScroll();
  }

  /* ---------- 3D-наклон карточек при наведении ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (finePointer && !reduceMotion) {
    var MAX_TILT = 9; /* градусов */
    document.querySelectorAll('.service-card, .example-card').forEach(function (card) {
      var raf = null;
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          /* угол под курсором «проседает» (уходит на задний план) */
          card.style.transform =
            'perspective(900px) rotateX(' + (-ny * MAX_TILT).toFixed(2) +
            'deg) rotateY(' + (nx * MAX_TILT).toFixed(2) + 'deg) scale(1.015)';
        });
      });
      card.addEventListener('mouseenter', function () {
        card.classList.add('is-tilting');
      });
      card.addEventListener('mouseleave', function () {
        if (raf) cancelAnimationFrame(raf);
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

})();
