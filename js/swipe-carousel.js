import Carousel from './carousel.js';

function SwipeCarousel() {
  Carousel.apply(this, arguments);
}

SwipeCarousel.prototype = Object.create(Carousel.prototype);
SwipeCarousel.prototype.constructor = SwipeCarousel;

SwipeCarousel.prototype._initListeners = function () {
  Carousel.prototype._initListeners.apply(this);
  this.container.addEventListener('touchstart', this._swipeStart.bind(this));
  this.container.addEventListener('touchend', this._swipeEnd.bind(this));
  this.container.addEventListener('mousedown', this._swipeStart.bind(this));
  this.container.addEventListener('mouseup', this._swipeEnd.bind(this));
};

SwipeCarousel.prototype._swipeStart = function (e) {
  this.startPosX =
    e instanceof MouseEvent
      ? (this.startPosX = e.pageX)
      : (this.startPosX = e.changedTouches[0].pageX);
};

SwipeCarousel.prototype._swipeEnd = function (e) {
  this.endPosX =
    e instanceof MouseEvent
      ? (this.endPosX = e.pageX)
      : (this.endPosX = e.changedTouches[0].pageX);
  if (this.endPosX - this.startPosX > 75) this.prev();
  if (this.endPosX - this.startPosX < -75) this.next();
};

export default SwipeCarousel;
