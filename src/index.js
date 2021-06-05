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

  process(text) {
    this._words = _utils.process(text, this._sentenceIndices);
    return this;
  }

  connectedCallback() {
    this._sentenceIndices = [0];
    this._words = [];

    this.index = -1;
    this.wpm = 250;

    this._orpOffset = this._$redicle.style.getPropertyValue('--orpOffset');

    this._$redicle.addEventListener('animationend', () => this._play());
    this._$slot.addEventListener('slotchange', () => {
      const [node] = this._$slot.assignedNodes({ flatten: true });
      this.process(node.textContent);
    });
  }

  get duration() {
    return 60000 / this.wpm;
  }

  get estimatedMinutes() {
    return this._words.length / this.wpm;
  }

  static get observedAttributes() {
    return ['index', 'status', 'wpm'];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal === newVal) return;

    if (attrName === 'index') {
      this._render();
    }

    if (attrName === 'wpm') {
      this._$redicle.style.setProperty('--msDuration', this.duration);
    }

    if (attrName === 'status') {
      if (newVal === statuses.STATUS_PAUSED)  {
        this._pause && this._pause();
      }

      if (newVal === statuses.STATUS_STOPPED)  {
        this._pause && this._pause();
        this.index = -1;
      }
    }
  }

  play() {
    this.status = 'playing';
    return this;
  }

  get status() {
    return this.getAttribute('status');
  }

  set status(newVal) {
    const val = Object.values(statuses).includes(newVal)
      ? newVal
      : statuses.STATUS_STOPPED;
      this.setAttribute('status', val);
  }

  pause() {
    this.status = 'paused';
    return this;
  }

  stop() {
    this.status = 'stopped';
    return this;
  }

  stepforward() {
    this.pause();
    this.index++;
  }

  stepbackward() {
    this.pause();
    this.index--;
  }

  fastbackward() {
    this.pause();
    this.index = this._jumpBackward();
  }

  fastforward() {
    this.pause();
    this.index = this._jumpForward();
  }

  _getSentenceIndex() {
    const closestWordIndex = this._sentenceIndices.find((i) => i >= this.index);
    const closestSentenceIndex = this._sentenceIndices.indexOf(closestWordIndex);
    return closestWordIndex !== this.index
      ? _utils.indexWithinBoundaries(closestSentenceIndex - 1, this._sentenceIndices)
      : closestSentenceIndex;
  }

  _jumpForward() {
    const sentenceIndex = this._getSentenceIndex();
    const wordIndex = _utils.indexWithinBoundaries(sentenceIndex + 1, this._sentenceIndices);
    return this._sentenceIndices[wordIndex];
  }

  _jumpBackward() {
    const sentenceIndex = this._getSentenceIndex();
    const wordIndex = _utils.indexWithinBoundaries(sentenceIndex - 1, this._sentenceIndices);
    return this._sentenceIndices[wordIndex];
  }

  _play() {
    if (!this._words.length || this._wordUndefined(this.index + 1)) return this.stop();
    this.index += 1;
    const ms = _utils.adjustTiming(this.duration, this._words[this.index]);
    this._pause = _utils.requestTimeout(() => this._play(), ms);
  }

  _wordUndefined(index) {
    return !this._words[index];
  }

  _sentenceUndefined(index) {
    return !this._sentenceIndices[index];
  }

  _render() {
    if (!~this.index) return this._reset();
    const word = this._words[this.index];
    this._$word.innerHTML = _utils.getInnerHTML(word);
    const $orp = this._$word.querySelector(_utils.orpTagName);
    const offset = _utils.adjustOffsetPercent($orp, this._$redicle);
    this._$word.style.setProperty('--wordOffset', `${this._orpOffset - offset}%`); // change to percentage
    this._setAttr('quotes', word);
    this._setAttr('parentheses', word);
  }

  _reset() {
    this._$word.innerHTML = '';
    this._$word.style = '';
    this.removeAttribute('quotes');
    this.removeAttribute('parentheses');
  }

  _setAttr(key, metadata) {
    if (metadata[key]) {
      this.setAttribute(key, '');
    } else {
      this.removeAttribute(key);
    }
  }

  get wpm() {
    return Number(this.getAttribute('wpm'));
  }

  set wpm(newVal) {
    if (!isNaN(newVal)) {
      this.setAttribute('wpm', newVal);
    } else {
      this.removeAttribute('wpm');
    }
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
}

window.customElements.define('spritz-ui', SpritzUI);