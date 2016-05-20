selection(document.getElementById("ex1"));

selection(document.getElementById("ex2"), {
    'durationFormat': 'hh:mm:ss',
    'max': 3600 * 24
});

selection(document.getElementById("ex3"), {
    'durationFormat': 'hh:mm',
    'value': 3600 * 2 + 60 * 30 
});

selection(document.getElementById("ex4"), {
    'durationFormat': 'hh:mm',
    'max': 3600 * 12
});

selection(document.getElementById("ex5"), {
    'durationFormat': 'dd:hh:mm:ss'
});

selection(document.getElementById("ex6"), {
    'durationFormat': 'dd:hh:mm'
});
