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
    'hh:mm:ss': [0, 1, 1, 2, 3, 3, 4, 5, 5]
};

const MAX = 3600 * 99 + 60 * 59 + 1 * 59;

const KEYLEFT = 37;
const KEYUP = 38;
const KEYRIGHT = 39;
const KEYDOWN = 40;


export default class Selection {
    constructor(el, options) {
        this.durationFormat = 'hh:mm:ss';
        this.value = 0;
        this.index = undefined;
        this.el = el;

        this.init();
    }

    formatDuration() {
        return moment.duration(this.value, 'seconds').format(this.durationFormat, {trim: false});
    }

    setSelection(input) {
        let data = units[this.index];
        setTimeout(() => {
            input.setSelectionRange(data.start, data.end);
        }, 0);
    }

    decrement(amount) {
        if ((this.value - amount) < 0) {
            this.value = this.value + MAX - amount + 1;
        }
        else {
            this.value -= amount; 
        }
    }

    increment(amount) {
        if ((this.value + amount) > MAX) {
            this.value = this.value - MAX + amount - 1;
        }
        else {
            this.value += amount;
        }
    }

    init() {
        this.el.value = this.formatDuration();

        this.el.addEventListener("click", (e) => {
            e.preventDefault();

            let input = e.target;
            let index = formatSelectionPoints[this.durationFormat][input.selectionStart];
            this.index = index;
            this.setSelection(e.target);
        });

        this.el.addEventListener("keydown", (e) => {
            e.preventDefault();
        });

        this.el.addEventListener("keyup", (e) => {
            e.preventDefault();

            let input = e.target;
            let data = units[this.index]

            switch(e.which) {
                case KEYUP:
                    this.increment(data.increment);
                    input.value = this.formatDuration();
                    break;
                case KEYDOWN:
                    this.decrement(data.increment);
                    input.value = this.formatDuration();
                    break;
                case KEYLEFT:
                    this.index -= 1;
                    break;
                case KEYRIGHT:
                    this.index += 1;
                    break;
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
                    let number = e.which - 48;
                    let prev = Number(this.formatDuration().substring(data.start, data.end));
                    let amount = number * data.increment - prev * data.increment;

                    this.value += amount;
                    this.index += 1;
                    input.value = this.formatDuration();
                    break;

            }

            if (this.index >= 0 || this.index < this.units.length) {
                this.setSelection(input);
            }
        });
    }
}

export default function(el, options={}) {

    return new Selection(el, options);
}