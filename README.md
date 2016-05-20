#timepoint-selection

[![npm](https://img.shields.io/npm/dm/timepoint-selection.svg)](https://www.npmjs.com/package/timepoint-selection)

**Enhance input elements with easy key entry and validation for time durations**. Library is in pure javascript, no framework is needed. Event handlers are added directly to the input and the package includes a destroy method to remove all added events.
* Input numbers directly or increment and decrement with up and down arrow keys.
* Left and right arrow keys navigate through the input selecting the next important character for entry.
* Rollover is automatically handled.
* Tabbing into an element automatically selects the first character in the input for easier entry.
* Non-valid characters are prevented from input.

![Screenshot](pic.png?raw=true "23:59:59 limited selection")

![Screenshot](pic2.png?raw=true "Setting separators")

## Installation

  `npm install timepoint-selection`

## Basic Usage

```javascript
var selection = require('timepoint-selection');

var timepoint = selection(document.getElementById("input"), {
    'durationFormat': 'hh:mm:ss',
    'max': 3600 * 24,               // point of rollover in seconds.
    'value': 0,                     // initial value of input in seconds.
    'useAbbr': true,                // configure the separator to not be ':'
    'abbr': {                       // pass in custom separator (with trailing space if desired)
      'dd': 'days ',
      'hh': 'h ',
      'mm': 'm ',
      'ss': 's'
    }
});

//returns the current value of the input in seconds.
timepoint.getValue();

//sets the current value of the input in seconds.
timepoint.setValue(seconds);

//remove all the event listeners from the input.
timepoint.destroy();
```

Accepted duration formats:
- 'dd:hh:mm:ss'
- 'dd:hh:mm'
- 'hh:mm:ss'
- 'hh:mm'
- 'mm:ss'

d = days, h = hours, m = minutes, s = seconds

## Examples

[Demo site](http://naomiaro.github.io/timepoint-selection/)

## Development

  `npm run start` runs the webpack dev server.

## License

[MIT License](http://doge.mit-license.org)