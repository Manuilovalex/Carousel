function Carousel() {
  this.container = document.querySelector('#carousel');
  this.slides = this.container.querySelectorAll('.slide');
  this.indicatorContainer = this.container.querySelector(
    '#indicator-container'
  );
  this.indicatorItems = this.indicatorContainer.querySelectorAll('.indicator');
  this.pauseBtn = this.container.querySelector('#pause-btn');
  this.prevBtn = this.container.querySelector('#prev-btn');
  this.nextBtn = this.container.querySelector('#next-btn');

  this.SLIDES_COUNT = this.slides.length;
  this.CODE_ARROW_LEFT = 'ArrowLeft';
  this.CODE_ARROW_RIGHT = 'ArrowRight';
  this.CODE_SPACE = 'Space';

  this.currentSlide = 0;
  this.timerId = null;
  this.isPlaying = true;
  this.startPosX = null;
  this.endPosX = null;
  this.interval = 2000;
}

Carousel.prototype = {
  gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  },

  gotoPrev() {
    this.gotoNth(this.currentSlide - 1);
  },

  gotoNext() {
    this.gotoNth(this.currentSlide + 1);
  },

  tick() {
    this.timerId = setInterval(() => this.gotoNext(), this.interval);
  },

  pauseHandler() {
    if (!this.isPlaying) return;
    clearInterval(this.timerId);
    this.pauseBtn.innerHTML = 'Play';
    this.isPlaying = false;
  },

  playHandler() {
    this.tick();
    this.pauseBtn.innerHTML = 'Pause';
    this.isPlaying = true;
  },

  pausePlayHandler() {
    this.isPlaying ? this.pauseHandler() : this.playHandler();
  },

  prevHandler() {
    this.pauseHandler();
    this.gotoPrev();
  },

  nextHandler() {
    this.pauseHandler();
    this.gotoNext();
  },

  indicateHandler(e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      this.pauseHandler();
      this.gotoNth(+target.dataset.slideTo);
    }
  },

  pressKey(e) {
    const { code } = e;
    e.preventDefault();
    if (code === this.CODE_SPACE) this.pausePlayHandler();
    if (code === this.CODE_ARROW_LEFT) this.prevHandler();
    if (code === this.CODE_ARROW_RIGHT) this.nextHandler();
  },

  swipeStart(e) {
    this.startPosX =
      e instanceof MouseEvent
        ? (this.startPosX = e.pageX)
        : (this.startPosX = e.changedTouches[0].pageX);
  },

  swipeEnd(e) {
    this.endPosX =
      e instanceof MouseEvent
        ? (this.endPosX = e.pageX)
        : (this.endPosX = e.changedTouches[0].pageX);
    if (this.endPosX - this.startPosX > 75) this.prevHandler();
    if (this.endPosX - this.startPosX < -75) this.nextHandler();
  },

  initListeners() {
    this.pauseBtn.addEventListener('click', () => this.pausePlayHandler());
    this.nextBtn.addEventListener('click', () => this.nextHandler());
    this.prevBtn.addEventListener('click', () => this.prevHandler());
    this.indicatorContainer.addEventListener('click', (e) =>
      this.indicateHandler(e)
    );
    this.container.addEventListener('touchstart', (e) => this.swipeStart(e));
    this.container.addEventListener('touchend', (e) => this.swipeEnd(e));
    this.container.addEventListener('mousedown', (e) => this.swipeStart(e));
    this.container.addEventListener('mouseup', (e) => this.swipeEnd(e));
    document.addEventListener('keydown', (e) => this.pressKey(e));
  },

  init() {
    this.initListeners();
    this.tick();
  },
};

const carousel = new Carousel();
carousel.init();
