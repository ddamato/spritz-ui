const quotations = {
  '\"': '\"',
  '\“': '\”',
  '«': '»'
}

const brackets = {
  '(': ')',
  '[': ']',
  '{': '}',
}

const wrappings = Object.assign(quotations, brackets);

function toUnicode(ch) {
  return `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`;
}

function constructStartingRegex() {
  const str = Object.keys(wrappings).map(toUnicode).join('');
  return new RegExp(`^[${str}]+`, 'g');
}

function constructEndingRegex() {
  const str = Object.values(wrappings).map(toUnicode).join('');
  return new RegExp(`[${str}]+$`, 'g');
}

function constructUnwrapRegex() {
  const startChars = Object.keys(wrappings).map(toUnicode).join('');
  const endChars = Object.values(wrappings).map(toUnicode).join('');
  return new RegExp(`[${startChars + endChars}]+`, 'g');
}

export const COMPLETE_REGEX_START = constructStartingRegex();
export const COMPLETE_REGEX_END = constructEndingRegex();
export const COMPLETE_REGEX_UNWRAP = constructUnwrapRegex();


export default wrappings;