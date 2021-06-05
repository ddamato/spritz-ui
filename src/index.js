import html from './template.html';
import css from './style.pcss';
import * as _utils from './utils';

const statuses = {
  STATUS_STOPPED: 'stopped',
  STATUS_PAUSED: 'paused',
  STATUS_PLAYING: 'playing',
}
export default class SpritzUI extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this._$redicle = this.shadowRoot.getElementById('redicle');
    this._$word = this.shadowRoot.getElementById('word');
    this._$slot = this.shadowRoot.getElementById('text');
  }

  static get observedAttributes() {
    return ['index', 'status', 'wpm'];
  }

  connectedCallback() {
    this._$redicle.addEventListener('animationend', () => this._play());
    this._$slot.addEventListener('slotchange', () => {
      const [node] = this._$slot.assignedNodes({ flatten: true });
      this.process(node.textContent);
    });
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (attrName === 'index') this._render();
    if (attrName === 'wpm') this._$redicle.style.setProperty('--msDuration', this.duration);
    if (attrName === 'status') this._handleStatusChange(newVal);
  }

  fastbackward() {
    this.pause();
    this.index = this._jumpBackward();
    return this;
  }

  fastforward() {
    this.pause();
    this.index = this._jumpForward();
    return this;
  }

  pause() {
    this.status = 'paused';
    return this;
  }

  play() {
    this.status = 'playing';
    return this;
  }

  process(text) {
    this._init();
    this._words = _utils.process(text, this._sentenceIndices);
    return this;
  }

  stepbackward() {
    this.pause();
    this.index--;
    return this;
  }

  stepforward() {
    this.pause();
    this.index++;
    return this;
  }

  stop() {
    this.status = 'stopped';
    return this;
  }

  _getSentenceIndex() {
    const closestWordIndex = this._sentenceIndices.find((i) => i >= this.index);
    const closestSentenceIndex = this._sentenceIndices.indexOf(closestWordIndex);
    return closestWordIndex !== this.index
      ? _utils.indexWithinBoundaries(closestSentenceIndex - 1, this._sentenceIndices)
      : closestSentenceIndex;
  }

  _handleStatusChange(status) {
    if (status === statuses.STATUS_PAUSED)  {
      this._pause && this._pause();
    }

    if (status === statuses.STATUS_STOPPED)  {
      this._pause && this._pause();
      this.index = -1;
    }
  }

  _init() {
    this._orpOffset = 38;
    this._sentenceIndices = [0];
    this._words = [];

    this.index = -1;
    this.wpm = 250;
  }

  _jumpBackward() {
    const sentenceIndex = this._getSentenceIndex();
    const wordIndex = _utils.indexWithinBoundaries(sentenceIndex - 1, this._sentenceIndices);
    return this._sentenceIndices[wordIndex];
  }

  _jumpForward() {
    const sentenceIndex = this._getSentenceIndex();
    const wordIndex = _utils.indexWithinBoundaries(sentenceIndex + 1, this._sentenceIndices);
    return this._sentenceIndices[wordIndex];
  }

  _play() {
    if (!this._words.length || !this._words[this.index + 1]) return this.stop();
    this.index += 1;
    const ms = _utils.adjustTiming(this.duration, this._words[this.index]);
    this._pause = _utils.requestTimeout(() => this._play(), ms);
  }

  _render() {
    if (!~this.index) return this._reset();
    const word = this._words[this.index];
    this._$word.innerHTML = _utils.getInnerHTML(word);
    const $orp = this._$word.querySelector(_utils.orpTagName);
    const offset = _utils.adjustOffsetPercent($orp, this._$redicle);
    this._$word.style.setProperty('--wordOffset', `${this._orpOffset - offset}%`);
    _utils.setAttr({ elem: this, key: 'quotes', value: word['quotes'] });
    _utils.setAttr({ elem: this, key: 'parentheses', value: word['parentheses'] });
  }

  _reset() {
    this._$word.innerHTML = '';
    this._$word.removeAttribute('style');
    _utils.setAttr({ elem: this, key: 'quotes', value: false });
    _utils.setAttr({ elem: this, key: 'parentheses', value: false });
  }

  get duration() {
    return 60000 / this.wpm;
  }

  get estimatedMinutes() {
    return this._words.length / this.wpm;
  }

  get index() {
    return parseInt(this.getAttribute('index'));
  }

  set index(newVal) {
    let val = -1;
    if (isNaN(newVal)) return;
    val = parseInt(newVal);
    if (!(_utils.indexWithinBoundaries(val, this._words) === val || val === -1)) return;
    this.setAttribute('index', val);
  }

  get status() {
    return this.getAttribute('status');
  }

  set status(newVal) {
    const status = Object.values(statuses).includes(newVal)
      ? newVal
      : statuses.STATUS_STOPPED;
      this.setAttribute('status', status);
  }

  get wpm() {
    return Number(this.getAttribute('wpm'));
  }

  set wpm(newVal) {
    _utils.setAttr({ 
      elem: this,
      key: 'wpm',
      value: newVal,
      check: (v) => !isNaN(v)
    });
  }

  get _orpOffset() {
    return this._$redicle.style.getPropertyValue('--orpOffset');
  }

  set _orpOffset(newVal) {
    this._$redicle.style.setProperty('--orpOffset', newVal);
  }
}

window.customElements.define('spritz-ui', SpritzUI);