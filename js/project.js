/* =====================================================================
   НАСЛЕДИЕ — скрипт страницы проекта (галерея)
   ===================================================================== */
(function () {
  'use strict';

  var mainImage = document.querySelector('.gallery__main img');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.gallery__thumb'));
  if (!mainImage || !thumbs.length) return;

  var current = 0;

  function show(index) {
    if (index < 0) index = thumbs.length - 1;
    if (index >= thumbs.length) index = 0;
    current = index;
    var src = thumbs[index].querySelector('img').getAttribute('src');
    mainImage.setAttribute('src', src);
    thumbs.forEach(function (t) { t.classList.remove('is-active'); });
    thumbs[index].classList.add('is-active');
  }

  thumbs.forEach(function (thumb, i) {
    thumb.addEventListener('click', function () { show(i); });
  });

  var prev = document.querySelector('.gallery__nav--prev');
  var next = document.querySelector('.gallery__nav--next');
  if (prev) prev.addEventListener('click', function () { show(current - 1); });
  if (next) next.addEventListener('click', function () { show(current + 1); });

  show(0);
})();
