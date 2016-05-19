#timepoint-selection

Enhance input elements with easy key entry and validation for durations. Can input numbers directly or increment and decrement with up and down arrow keys. Rollover is automatically handled. Left and right arrow keys navigate through the input selecting the next important character for entry. Tabbing into an element automatically selects the first character in the input for easier entry.

![Screenshot](pic.png?raw=true "23:59:59 limited selection")

## Installation

  `npm install timepoint-selection`

## Basic Usage

```javascript
var selection = require('timepoint-selection');

var timepoint = selection(document.getElementById("input"), {
    'durationFormat': 'hh:mm:ss',
    'max': 3600 * 24
});

//remove all the event listeners from the input.
timepoint.destroy();
```

## Development

  `npm run start`

## License

[MIT License](http://doge.mit-license.org)