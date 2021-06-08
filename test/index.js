import { JSDOM } from 'jsdom';
import { expect } from 'chai';
import fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

async function getHTML() {
  const script = await readFile(resolve(__dirname, '..', 'dist', 'spritz-ui.umd.js'));
  return `<html><head><script>${script}</script></head><body></body></html>`;
}

describe('spritz-ui', function () {
  describe('browser context', function() {
    let window, document, spritz;

    before(async function() {
      const html = await getHTML();
      const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
      window = dom.window;
      document = window.document;
    });

    beforeEach(function() {
      document.body.innerHTML = '';
      const text = document.createElement('div');
      text.id = 'my-text-content';
      text.textContent = `Scenester banh mi sustainable shoreditch live-edge austin. Lo-fi chambray craft beer occupy (8-bit poutine "whatever" small batch) quinoa farm-to-table woke hashtag chartreuse. Street art meditation pinterest viral. Godard beard salvia irony pop-up. Tacos scenester [bespoke yuccie] raclette meditation. Lumbersexual XOXO adaptogen typewriter. Try-hard 3 wolf moon pickled vaporware.`;
      document.body.appendChild(text);
      spritz = document.createElement('spritz-ui');
      spritz.content = text.id;
      document.body.appendChild(spritz);
    });

    it('defines a custom element', async function() {
      await window.customElements.whenDefined('spritz-ui');
      expect(window.customElements.get('spritz-ui')).to.exist;
    })

    it('create a custom element', function() {
      expect(document.body.children.length).to.equal(2);
      expect(spritz.shadowRoot).to.exist;
    });

    it('should process text content', function () {
      expect(spritz._words.length).to.equal(55);
    });
  });
});