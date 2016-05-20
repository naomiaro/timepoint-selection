#timepoint-selection

Enhance input elements with easy key entry and validation for time durations in hh:mm:ss and hh:mm. Library is in pure javascript, no framework is needed. Event handlers are added directly to the input and the package includes a destroy method to remove all added events.
* Input numbers directly or increment and decrement with up and down arrow keys.
* Left and right arrow keys navigate through the input selecting the next important character for entry.
* Rollover is automatically handled.
* Tabbing into an element automatically selects the first character in the input for easier entry.
* Non-valid characters are prevented from input.

![Screenshot](pic.png?raw=true "23:59:59 limited selection")

## Installation

  `npm install timepoint-selection`

## Basic Usage

```javascript
var selection = require('timepoint-selection');

var timepoint = selection(document.getElementById("input"), {
    'durationFormat': 'hh:mm:ss', // (hh:mm:ss or hh:mm)
    'max': 3600 * 24 // point of rollover in seconds.
});

//remove all the event listeners from the input.
timepoint.destroy();
```

## Development

  `npm run start` runs the webpack dev server.

## License

[MIT License](http://doge.mit-license.org)