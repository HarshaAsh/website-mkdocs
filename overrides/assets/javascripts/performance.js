// Performance helpers: lazy load images/iframes and set decoding hints
(function () {
  function applyLazyLoading() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (img.hasAttribute('data-no-lazy')) return;
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((frame) => {
      if (frame.hasAttribute('data-no-lazy')) return;
      if (!frame.hasAttribute('loading')) frame.setAttribute('loading', 'lazy');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLazyLoading);
  } else {
    applyLazyLoading();
  }
})();
