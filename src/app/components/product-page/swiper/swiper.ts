import Swiper from 'swiper/bundle';

// init Swiper:
const initSwiper = () =>
  new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    effect: 'fade',
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });

const initZoomedSwiper = () =>
  new Swiper('.zoomedSwiper', {
    direction: 'horizontal',
    zoom: true,
    effect: 'fade',
    loop: true,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },

    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
export { initSwiper, initZoomedSwiper };
