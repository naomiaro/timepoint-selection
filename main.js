import moment from 'moment';
import 'moment-duration-format';

let units = [
    {start: 0, end: 1, increment: 36000},
    {start: 1, end: 2, increment: 3600},
    {start: 3, end: 4, increment: 600},
    {start: 4, end: 5, increment: 60},
    {start: 6, end: 7, increment: 10},
    {start: 7, end: 8, increment: 1}
];

let formatSelectionPoints = {
    'hh:mm:ss': [0, 0, 1, 2, 2, 3, 4, 4, 5],
    'hh:mm': [0, 0, 1, 2, 2, 3],
    'mm:ss': [0, 0, 1, 2, 2, 3]
};

let unitView = {
    'hh:mm:ss': [],
    'hh:mm': [0, 4],
    'mm:ss': [2, 6]
}

let maxValue = {
    'hh:mm:ss': 3600 * 100,
    'hh:mm': 3600 * 100,
    'mm:ss': 60 * 100
}

const KEYLEFT = 37;
const KEYUP = 38;
const KEYRIGHT = 39;
const KEYDOWN = 40;


export default class Selection {
    constructor(el, options) {
        this.durationFormat = options.durationFormat || 'hh:mm:ss';
        this.value = 0;
        this.index = undefined;
        this.max = Math.max(options.max || 0, maxValue[this.durationFormat]);
        this.el = el;

        this.setUnits();
        this.init();
    }

    setUnits() {
        this.units = units.slice(...unitView[this.durationFormat]);  
    }

    formatDuration() {
        return moment.duration(this.value, 'seconds').format(this.durationFormat, {trim: false});
    }

    setSelection() {
        let data = this.units[this.index];

        if (data === undefined) {
            this.el.blur();
            return;
        }

        this.el.selectionStart = data.start;
        this.el.selectionEnd = data.end;
    }

    decrement(amount) {
        if ((this.value - amount) < 0) {
            this.value = this.value + this.max - amount;
        }
        else {
            this.value -= amount; 
        }
    }

    increment(amount) {
        if ((this.value + amount) >= this.max) {
            this.value = this.value - this.max + amount;
        }
        else {
            this.value += amount;
        }
    }

    getDigit(e) {
        if (e.key) {
            return Number(e.key);
        }

        return ((e.which || e.keyCode) - 48);
    }

    init() {
        this.el.value = this.formatDuration();

        this.el.addEventListener("click", (e) => {
            e.preventDefault();

            this.index = formatSelectionPoints[this.durationFormat][this.el.selectionStart];
            this.setSelection();
        });

        this.el.addEventListener("keydown", (e) => {
            e.preventDefault();

            let data = this.units[this.index]
            let input = this.el;
            let key = e.key || e.which || e.keyCode;

            switch(key) {
                case "ArrowUp":
                case KEYUP:
                    this.increment(data.increment);
                    input.value = this.formatDuration();
                    break;
                case "ArrowDown":
                case KEYDOWN:
                    this.decrement(data.increment);
                    input.value = this.formatDuration();
                    break;
                case "ArrowLeft":
                case KEYLEFT:
                    this.index -= 1;
                    break;
                case "ArrowRight":
                case KEYRIGHT:
                    this.index += 1;
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case 48:
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                    let number = this.getDigit(e);
                    let prev = Number(this.formatDuration().substring(data.start, data.end));
                    let amount = number * data.increment - prev * data.increment;

                    this.value += amount;
                    this.index += 1;
                    input.value = this.formatDuration();
                    break;
            }

            this.setSelection();
        });
    }
}

export default function(el, options={}) {

    return new Selection(el, options);
}