class Scrollnimation {
  constructor(el, config = {}) {
    if (!el) return;
    if (!(config.steps && Array.isArray(config.steps)))
      throw "Scrollnimation: you need to define array of steps for your animation";

    const defaults = {
      preModifierClass: "Scrollnimation--pre",
      stepModifierClass: "Scrollnimation--step",
      matchMedia: "(min-width: 768px)",
      animSpeed: 1,
      onDisable: () => {},
      onEnable: () => {},
      onStep: n => {}
    };

    this.config = Object.assign({}, defaults, config);

    this.state = {
      isEnabled: true,
      machesMedia: true,
      isAnimating: false,
      lastTime: +new Date()
    };

    this.panel = el;

    // init
    this.mediaQueryToggle();
    window.addEventListener("scroll", e => this.handleScroll());
    window.addEventListener("resize", e => this.mediaQueryToggle());
  }

  handleScroll() {
    if (this.isThrottled() || !this.state.machesMedia) return;

    const vals = this.getRectValues();
    const isStepScrolled = step =>
      vals.elementOffset > vals.height * this.config.animSpeed * step;
    const getClassAction = step => (isStepScrolled(step) ? "add" : "remove");
    const getStepClassName = i => `${this.config.stepModifierClass}-${i}`;
    const toggleClass = (step, i) =>
      this.panel.classList[getClassAction(step)](getStepClassName(i));

    this.config.steps.forEach(toggleClass);

    this.state.isAnimating = vals.elementOffset > 0;

    const lastActive = this.config.steps.filter(isStepScrolled).pop();
    const currentStep = this.config.steps.indexOf(lastActive);
    if (this.state.currentStep != currentStep && currentStep > -1) {
      this.state.currentStep = currentStep;
      this.config.onStep(currentStep);
    }
  }

  mediaQueryToggle() {
    this.setMediaState();

    const getStepClassName = i => `${this.config.stepModifierClass}-${i}`;
    const allStepsClassNames = this.config.steps.map((_, i) =>
      getStepClassName(i)
    );

    if (this.state.machesMedia && !this.state.isEnabled) {
      this.panel.classList.add(this.config.preModifierClass);
      this.config.onEnable();
      this.state.isEnabled = true;
    } else if (!this.state.machesMedia && this.state.isEnabled) {
      this.panel.classList.remove(
        ...allStepsClassNames,
        this.config.preModifierClass
      );
      this.config.onDisable();
      this.state.isEnabled = false;
    }
  }

  setMediaState() {
    this.state.machesMedia = window.matchMedia(this.config.matchMedia).matches;
  }

  isThrottled() {
    const throttleTime = 100;
    const now = +new Date();
    const isThrottled =
      !this.state.isAnimating && now < this.state.lastTime + throttleTime;

    if (!isThrottled) this.state.lastTime = now;

    return isThrottled;
  }

  getRectValues() {
    const rect = this.panel.getBoundingClientRect();
    const top = rect.top * -1; // make vals positive
    const height = rect.height;
    const elementOffset = top + height * this.config.animSpeed;

    return { top, height, elementOffset };
  }
}

export default Scrollnimation;
