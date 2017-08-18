// Element offset change
// is step scrolled change
// removed animSpeed

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
      onStepNext: () => {},
      onStepBack: () => {}
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
    const isStepScrolled = step => vals.elementOffset >= vals.height * step;
    const getClassAction = step => (isStepScrolled(step) ? "add" : "remove");
    const getStepClassName = i => `${this.config.stepModifierClass}-${i}`;
    const toggleClass = (step, i) =>
      this.panel.classList[getClassAction(step)](getStepClassName(i));

    this.config.steps.forEach(toggleClass);

    this.state.isAnimating = vals.elementOffset > 0;

    const lastActive = this.config.steps.filter(isStepScrolled).pop();
    const currentStep = this.config.steps.indexOf(lastActive);

    if (currentStep > -1) {
      if (this.state.currentStep < currentStep)
        this.config.onStepNext(currentStep);
      if (this.state.currentStep > currentStep)
        this.config.onStepBack(currentStep);
      this.state.currentStep = currentStep;
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
    const elementOffset = top + window.innerHeight;

    return { top, height, elementOffset };
  }
}

const phoneEl = document.querySelector(".Scrollnimation__phone");
const phoneLines = [...phoneEl.querySelectorAll("#iPhone-6-Plus > *:not(g)")];
const strokeLine = line => (line.style.strokeDashoffset = "0");
const unstrokeLine = line => {
  const length = line.getTotalLength();
  line.style.strokeDasharray = length + " " + length;
  line.style.strokeDashoffset = length;
};
const showPhone = () => (phoneEl.style.opacity = 1);
const strokePhone = () => phoneLines.forEach(strokeLine);
const unstrokePhone = () => phoneLines.forEach(unstrokeLine);

// prepare phone
unstrokePhone(); // this takes 1 sec
setTimeout(showPhone, 1000);

const scrollnimarionEl = document.querySelector(".Scrollnimation");

new Scrollnimation(scrollnimarionEl, {
  steps: [0, 0.1, 0.3, 0.5, 0.7, 1],
  onStepNext: n => {
    (n == 1) && strokePhone();
    (n == 4) && unstrokePhone();
  },
  onStepBack: n => {
    (n == 0) && unstrokePhone();
    (n == 3) && strokePhone();
  }
});
