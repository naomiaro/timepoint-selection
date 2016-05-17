selection(document.getElementById("ts"));

selection(document.getElementById("hhmmss"), {
    'durationFormat': 'hh:mm:ss',
    'max': 3600 * 24
});

selection(document.getElementById("hhmm"), {
    'durationFormat': 'hh:mm'
});

selection(document.getElementById("mmss"), {
    'durationFormat': 'mm:ss'
});
