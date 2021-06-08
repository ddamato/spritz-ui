# spritz-ui
[![npm version](https://img.shields.io/npm/v/spritz-ui.svg)](https://www.npmjs.com/package/spritz-ui)
[![Build Status](https://travis-ci.org/ddamato/spritz-ui.svg?branch=master)](https://travis-ci.org/ddamato/spritz-ui)
[![Coverage Status](https://coveralls.io/repos/github/ddamato/spritz-ui/badge.svg?branch=master)](https://coveralls.io/github/ddamato/spritz-ui?branch=master)

Web Component based off of the Spritz speed reading technique.

[Spritz](https://spritz.com/) analyzes content and presents it to the reader one word at a time in a window we call the redicle. One key letter in each word is highlighted. We we call this letter the “Optimal Recognition Point” (ORP). Our redicle keeps your eyes focused on the ORP, allowing you to read, comprehend, and retain information without the need to move your eyes.

[Readsy](http://www.readsy.co/) is powered by Spritz.

This package mimicks the features of Spritz as a web component.

## Install

You can just add the `unpkg` link to the top of your page.

```html
<script src="https://unpkg.com/spritz-ui" />
```

Otherwise, install and bundle.

```sh
npm i spritz-ui
```

Then import the component on the page.

```js
import 'spritz-ui';
```
## Usage

Just put the component on the page which has the initialization script.
```html
<spritz-ui content="element-id-with-content"></spritz-ui>
```

Note: the UI does not come with controls. You will need to provide your own controls. [The demo](https://ddamato.github.io/spritz-ui/) has a sample of how these could be made.

### Attributes
#### `content`
This is an `id` of another element on the page which holds the content expected to be processed and displayed through the component.

#### `index`
This is a representation of where in the passage the component is currently. Increasing or decreasing this number will more the display forward or backward. A value of `-1` will clear the display.

#### `status`
This has 3 possible values:
- `stopped` - Currently not playing or displaying content.
- `playing` - About to or currently cycling through each word in the passage.
- `paused` - Currently displaying the more recent word but cycling has stopped.

While you could change these attributes directly, it is recommended to call the methods to control the component instead.

### `wpm`
The words-per-minute to display in the component, default is set to 250. Must be a whole number greater than 0.

### Methods
#### `fastbackward()`
Sends the display back one sentence.

#### `fastforward()`
Sends the display forward one sentence.

#### `pause()`
Pauses the display where it currently is.

#### `play()`
Begins displaying each word at the provided `wpm`.

#### `process(text)`
Processes the given text to be displayed in the component. This is called automatically when provided an element `id` to the `content` attribute.

#### `stepbackward()`
Sends the display back one word.

#### `stepforward()`
Sends the display forward one word.

#### `stop()`
Stops the display, resetting to the beginning.

## Additional features

There have been a few features that go beyond the component that this was originally inspired from.

### Sentence jumping
In additional to jumping to a previous or next word, this component can also jump to the previous and next sentences.

### Punctuation exceptions
This component has a built-in list of punctuation exceptions. This is so the component doesn't falsly pause on words that don't actually end sentences.

### Intelligent wrapping
The component will identify different kinds of characters expected to wrap text; specifically brackets and quotes. It will display the wrapping on the outside of the reader for the duration of the wrapping. While you're unable to turn this off completely, you can hide the wrappings with CSS.

```css
spritz-ui[prewrap]:before,
spritz-ui[postwrap]:after {
  display: none;
}
```