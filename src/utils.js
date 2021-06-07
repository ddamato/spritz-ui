import Wrapper from './Wrapper';
import { COMPLETE_REGEX_UNWRAP } from './wrappings';

const puncExceptions = [ 
  'ave.',
  'blvd.',
  'ct.',
  'dr.',
  'eg.',
  'etc.',
  'ie.',
  'mr.',
  'mrs.',
  'mo.',
  'rd.',
  'sr.',
  'st.',
  'ste.',
  'tpk.'
];

const adjustments = {
  clause(content) {
    // Pause multiplier 1.5
    return /[,:;]$/.test(content) ? 1.5 : 1;
  },
  number(content) {
    // Pause multiplier 1.5
    return /\d+[^,:;.!?]{0,}$/.test(content) ? 1.5 : 1;
  },
  sentence(content) {
    // Pause multiplier 3
    return /[.?!]$/.test(content) && !puncExceptions.includes(content.toLowerCase()) ? 3 : 1;
  }
};

const WORD_SPLIT_REGEX = /((?=\w{15,})(\w{7})|(?!^\w{1,14})$)/g;
const HYPHENATE_REGEX = /[^\s-]+-?/g;

export const orpTagName = 'b';

export function adjustOffsetPercent($orp, $redicle) {
  const orpCenter = $orp.offsetLeft + Math.ceil($orp.offsetWidth / 2) - 2;
  return orpCenter * 100 / $redicle.offsetWidth;
}

export function adjustTiming(duration, metadata) {
  if (!metadata) return duration;
  const { content } = metadata;
  duration *= adjustments.clause(content);
  duration *= adjustments.number(content);
  duration *= adjustments.sentence(content);
  return duration;
}

export function getInnerHTML({ content, orp }) {
  return content.replace(/./g, (char, index) => index === orp ? `<${orpTagName}>${char}</${orpTagName}>` : char);
}

function getOptimalRecognitionPoint(word) {
  const orp = Math.ceil((word.length - 1) / 4);
  return /\W/.test(word[orp]) ? orp - 1 : orp;
}

export function indexWithinBoundaries(index, arr) {
  return Math.max(Math.min(index, arr.length - 1), 0);
}

export function process(text, sentenceIndices) {
  if (!text) return;
    const wrapper = new Wrapper();
    return text.replace(WORD_SPLIT_REGEX, '$1- ')
      .match(HYPHENATE_REGEX)
      .filter((result) => /[\w]/.test(result))
      .map((result, i, arr) => {
        if (/[.?!]/.test(result) && arr[i + 1]) sentenceIndices.push(i + 1);
        return {
          content: result.replace(COMPLETE_REGEX_UNWRAP, ''),
          orp: getOptimalRecognitionPoint(result),
          ...wrapper.check(result)  
        }
      });
}

export function requestTimeout(fn, delay) {
  let raf;
  const cancel = () => window.cancelAnimationFrame(raf);
  const start = new Date().getTime();

  const loop = () => {
    const delta = new Date().getTime() - start;
    if (delta >= delay) {
      fn();
      cancel();
      return;
    }
    raf = window.requestAnimationFrame(loop);
    return cancel;
  };
  return loop();
}

function valueToAttr(value) {
  if (typeof value === 'boolean')  return '';
  if (Array.isArray(value)) return value.join('');
  return value;
}

export function setAttr({ elem, key, value, check }) {
  check = check || Boolean;
  value = valueToAttr(value)
  if (check(value)) {
    elem.setAttribute(key, value);
  } else {
    elem.removeAttribute(key);
  }
}