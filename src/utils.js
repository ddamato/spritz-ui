const CLAUSE_PAUSE_ADJUST = 1.5;
const NUMBER_PAUSE_ADJUST = 1.5;
const SENTENCE_PAUSE_ADJUST = 3;

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

export const orpTagName = 'b';

export function adjustTiming(duration, { content }) {
  duration *= Number(!/[,:;]$/.test(content)) && CLAUSE_PAUSE_ADJUST;
  duration *= Number(!/\d+[^,:;.!?]{0,}$/.test(content)) && NUMBER_PAUSE_ADJUST;
  duration *= Number(!/[.?!]$/.test(content) && checkExceptions(content)) && SENTENCE_PAUSE_ADJUST;
  return duration;
}

export function requestTimeout(fn, delay) {
  let raf;
  const start = new Date().getTime();

  const loop = () => {
    const delta = new Date().getTime() - start;
    if (delta >= delay) {
      fn();
      window.cancelAnimationFrame(raf);
      return;
    }
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
  };
  raf = window.requestAnimationFrame(loop);
  return () => window.cancelAnimationFrame(raf);
}

function checkExceptions(content) {
  return !puncExceptions.includes(content.toLowerCase())
}

export function removePunctuation(word) {
  return word.replace(/[.?!,;:]/g, '');
}

export function getOptimalRecognitionPoint(word) {
  const orp = Math.ceil((word.length - 1) / 4);
  return /\W/.test(word[orp]) ? orp - 1 : orp;
}

export function getInnerHTML({ content, orp }) {
  return content.replace(/./g, (char, i) => i === orp ? `<${orpTagName}>${char}</${orpTagName}>` : char);
}