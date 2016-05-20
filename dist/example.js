selection(document.getElementById("ex1"));

selection(document.getElementById("ex2"), {
    'durationFormat': 'hh:mm:ss',
    'max': 3600 * 24,
    'useAbbr': true,
    'abbr': {
        'hh': 'h ',
        'mm': 'm ',
        'ss': 's'
    }
});

selection(document.getElementById("ex3"), {
    'durationFormat': 'hh:mm',
    'value': 3600 * 2 + 60 * 30,
    'useAbbr': true
});

selection(document.getElementById("ex4"), {
    'durationFormat': 'hh:mm',
    'max': 3600 * 12
});

selection(document.getElementById("ex5"), {
    'durationFormat': 'dd:hh:mm:ss',
    'useAbbr': true,
    'abbr': {
      'dd': 'days ',
      'hh': 'h ',
      'mm': 'm ',
      'ss': 's'
    }
});

selection(document.getElementById("ex6"), {
    'durationFormat': 'dd:hh:mm'
});
