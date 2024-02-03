import SwipeCarousel from './swipe-carousel.js';

const carousel = new SwipeCarousel({
  // containerId: '#carousel',
  // slideId: '.slide',
  interval: 4000,
  isPlaying: true,
});

carousel.init();
