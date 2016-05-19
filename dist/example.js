selection(document.getElementById("ex1"));

selection(document.getElementById("ex2"), {
    'durationFormat': 'hh:mm:ss',
    'max': 3600 * 24
});

selection(document.getElementById("ex3"), {
    'durationFormat': 'hh:mm'
});

selection(document.getElementById("ex4"), {
    'durationFormat': 'hh:mm',
    'max': 3600 * 12
});
