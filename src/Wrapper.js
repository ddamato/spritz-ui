import wrappings, { COMPLETE_REGEX_START, COMPLETE_REGEX_END } from './wrappings';
export default class Wrapper {
  constructor() {
    this.start = [];
    this.end = [];
  }

  check(word) {
    return _check.call(this, _removePunctuation(word));
  }
}

function getProperMatches(word, regex) {
  const [result] = word.match(regex) || [''];
  return result.split('');
}

function _check(word) {

  const startingMatches = getProperMatches(word, COMPLETE_REGEX_START);
  const endingMatches = getProperMatches(word, COMPLETE_REGEX_END);
  const orphanMatches = startingMatches.filter((m) => !endingMatches.includes(wrappings[m]));

  const result = { start: this.start.slice(), end: this.end.slice() };

  // If the word has a wrapping pair, early return the wrapping (don't update the status)
  if (startingMatches.length && !orphanMatches.length) {
    return { start: startingMatches, end: endingMatches };
  }

  // If the word has an ending character, prepare to remove, return the final wrapping
  if (endingMatches.length) {
    endingMatches.forEach((m) => {
      const endingIndex = this.end.indexOf(m);
      let startingIndex = (this.start.length - 1) - endingIndex;

      // This just double-checks to make sure we don't remove the wrong character by index
      if (!wrappings[this.start[startingIndex]] === m) {
        const startingChar = Object
          .entries(wrappings)
          .reduce((acc, [key, value]) => value === m ? key : acc, null);
        startingIndex = this.start.indexOf(startingChar);
      }

      this.end.splice(endingIndex, 1);
      this.start.splice(startingIndex, 1);
    });
  }

  // If the word has a starting character, add and return new wrapping
  if (startingMatches.length) {
    startingMatches.forEach((m) => {
      result.start.push(m);
      result.end.unshift(wrappings[m]);
    });
    this.start = result.start.slice();
    this.end = result.end.slice();
  }

  return result;
}

function _removePunctuation(word) {
  return word.replace(/[.?!,;:]/g, '');
}