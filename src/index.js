import html from './template.html';
import css from './style.pcss';
import * as utils from './utils';
import Wrapper from './Wrapper';

const WORD_SPLIT_REGEX = /((?=\w{15,})(\w{7})|(?!^\w{1,14})$)/g;
const HYPHENATE_REGEX = /[^\s-]+-?/g;
const CHAR_UNWRAP_REGEX = /[\(|\)\"]/g;
export default class SpritzUI extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${css}</style>${html}`;
    this._$redicle = this.shadowRoot.getElementById('redicle');
    this._$word = this.shadowRoot.getElementById('word');
    this._percent = this._$redicle.style.getPropertyValue('--offsetPercentage');
    this._sentenceIndices = [0];
    this._words = [];
  }

  process(text) {
    const wrapper = new Wrapper();
    this._words = text.replace(WORD_SPLIT_REGEX, '$1- ')
      .match(HYPHENATE_REGEX)
      .filter(/[\w]/.test)
      .map((result, i, arr) => {
        if (/[.?!]/.test(result) && arr[i + 1]) this._sentenceIndices.push(i + 1);
        return {
          content: result.replace(CHAR_UNWRAP_REGEX, ''),
          orp: utils.getOptimalRecognitionPoint(result),
          ...wrapper.check(result)  
        }
      });
  }

  static get observedAttributes() {
    return ['index'];
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'index' && oldValue !== newValue) {
      this._render();
    }
  }

  play() {
    this._play(60000 / this.wpm);
    return this;
  }

  pause() {
    window.cancelAnimationFrame(this._t);
    return this;
  }

  stop() {
    this.pause();
    this.index = 0;
  }

  stepforward() {
    this.pause();
    this.index++;
  }

  stepbackward() {
    this.pause();
    this.index--;
  }

  fastforward() {
    this.pause();
    this.index = this._sentenceSteps()[1];
  }

  fastbackward() {
    this.pause();
    this.index = this._sentenceSteps()[0];
  }

  _sentenceSteps() {
    let afterIndex = this._sentenceIndices.findIndex((i) => i >= this.index);
    
    // if equals, get before and after (if they exist)

    if (afterIndex === this.index) {
      // check to see if this._sentenceIndices[this.index - 1] && this._sentenceIndices[this.index + 1] exist
    }

    // if not equals, just get before (if it exists)

    

  }

  _play(time) {
    const ms = utils.adjustTiming(time, this._words[this.index]);
    this.index += 1;
    if (this._wordUndefined(this.index + 1)) {
      return window.cancelAnimationFrame(this._t);
    }
    this._t = utils.requestTimeout(() => this._play(time), ms);
  }

  _wordUndefined(index) {
    return !this._words[index];
  }

  _sentenceUndefined(index) {
    return !this._sentenceIndices[index];
  }

  _render() {
    const word = this._words[this.index];
    this._$word.innerHTML = utils.getInnerHTML(word);
    const orp = this._$word.querySelector(utils.orpTagName);
    const center = Math.ceil(orp.offsetWidth / 2);
    const transform = (this._$redicle.offsetWidth * this._percent) - (orp.offsetLeft + center);
    this._$word.style.setProperty('--transform', `${transform}px`); // change to percentage
    this._setAttr('quotes', word);
    this._setAttr('parentheses', word);
  }

  _setAttr(key, metadata) {
    if (metadata[key]) {
      this.setAttribute(key, '');
    } else {
      this.removeAttribute(key);
    }
  }

  get wpm() {
    return Number(this.getAttribute('wpm')) || 250;
  }

  set wpm(newVal) {
    if (!isNaN(newVal)) {
      this.setAttribute('wpm', newVal);
    } else {
      this.removeAttribute('wpm');
    }
  }

  get index() {
    return Number(this.getAttribute('index')) || 0;
  }

  set index(newVal) {
    if (!isNaN(newVal)) {
      this.setAttribute('index', newVal);
    } else {
      this.removeAttribute('index');
    }
  }

  get estimatedMinutes() {
    return this._words.length / this.wpm;
  }
}

window.customElements.define('spritz-ui', SpritzUI);