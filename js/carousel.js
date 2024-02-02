class Carousel {
  constructor(params) {
    this.settings = this._initConfig(params);
    this.container = document.querySelector(this.settings.containerId);
    this.slideItems = this.container.querySelectorAll(this.settings.slideId);
    this.interval = this.settings.interval;
    this.isPlaying = this.settings.isPlaying;
  }

  _initConfig(objectWithInerParams) {
    const defaultparams = {
      containerId: '#carousel',
      slideId: '.slide',
      interval: 4000,
      isPlaying: true,
    };
    return { ...defaultparams, ...objectWithInerParams };
  }

  _initProps() {
    this.SLIDES_COUNT = this.slideItems.length;
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_SPACE = 'Space';

    this.currentSlide = 0;
    this.timerId = null;
    this.startPosX = null;
    this.endPosX = null;
    this.FA_PAUSE =
      '<img width="40px" src="../assets/img/icons/icons8-пауза-64.png" alt="pause"></img>';
    this.FA_PLAY =
      '<img width="40px" src="../assets/img/icons/icons8-воспроизведение-64.png" alt="play"></img>';
    this.FA_PREV =
      '<img width="40px"  src="../assets/img/icons/icons8-перемотка-назад-64.png" alt="prev"></img>';
    this.FA_NEXT =
      '<img width="40px" src="../assets/img/icons/icons8-быстрая-перемотка-вперед-64.png" alt="next"></img>';
  }

  _initControls() {
    const controls = document.createElement('div');
    const PAUSE = `<span id="pause-btn" class="control control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('id', ' ');
    controls.classList.add('controls');

    controls.innerHTML = PREV + PAUSE + NEXT;

    this.container.append(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

    if (!this.pauseBtn || !this.prevBtn || !this.nextBtn) {
      throw new Error('One or more control elements not found.');
    }
  }

  _initIndicators() {
    const indicators = document.createElement('div');
    indicators.setAttribute('id', 'indicators-container');
    indicators.setAttribute('class', 'indicators');

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    this.container.prepend(indicators);

    this.indicatorsContainer = this.container.querySelector(
      '#indicators-container'
    );
    this.indicatorItems =
      this.indicatorsContainer.querySelectorAll('.indicator');
  }

  _initListeners() {
    this.pauseBtn.addEventListener('click', () => this.pausePlay(this));
    this.nextBtn.addEventListener('click', () => this.next(this));
    this.prevBtn.addEventListener('click', () => this.prev(this));
    this.indicatorsContainer.addEventListener(
      'click',
      this._indicateHandler.bind(this)
    );

    document.addEventListener('keydown', (e) => this._pressKey(e));

    this.slidesContainer.addEventListener('mouseenter', this.pause.bind(this));
    this.slidesContainer.addEventListener('mouseleave', this.play.bind(this));
  }

  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  _tick() {
    this.timerId = setInterval(() => this._gotoNext(), this.interval);
  }

  _indicateHandler(e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      this.pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  }

  _pressKey(e) {
    const { code } = e;
    e.preventDefault();
    if (code === this.CODE_SPACE) this.pausePlay();
    if (code === this.CODE_ARROW_LEFT) this.prev();
    if (code === this.CODE_ARROW_RIGHT) this.next();
  }

  pause() {
    if (!this.isPlaying) return;
    clearInterval(this.timerId);
    this.pauseBtn.innerHTML = this.FA_PLAY;
    this.isPlaying = false;
  }

  play() {
    if (this.isPlaying) return;
    this._tick();
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.isPlaying = true;
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  prev() {
    this.pause();
    this._gotoPrev();
  }

  next() {
    this.pause();
    this._gotoNext();
  }

  init() {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    if (this.isPlaying) {
      this._tick();
    } else {
      this.pause();
      this.pauseBtn.innerHTML = this.FA_PLAY;
    }
  }
}

export default Carousel;
