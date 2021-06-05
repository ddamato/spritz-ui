export default class Wrapper {
  constructor() {
    this.parentheses = false;
    this.quotes = false;
  }

  check(word) {
    word = _removePunctuation(word);
    return {
      parentheses: _check.call(this, { 
        key: 'parentheses',
        startsWith: /^\(/.test(word),
        endsWith: /\)$/.test(word)
      }),
      quotes: _check.call(this, { 
        key: 'quotes',
        startsWith: /^\"/.test(word),
        endsWith: /\"$/.test(word)
      }),
    };
  }
}

function _removePunctuation(word) {
  return word.replace(/[.?!,;:]/g, '');
}

function _check({ key, startsWith, endsWith }) {
  const isEnd = this[key] && endsWith;
  const isStart = !this[key] && startsWith && !endsWith;

  if (isStart || isEnd) {
    this[key] = !this[key];
    return true;
  }
  return this[key];
}
