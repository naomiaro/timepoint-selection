import moment from 'moment';
import 'moment-duration-format';


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


class Selection {
    constructor(el, options) {
        this.durationFormat = options.durationFormat || 'hh:mm:ss';
        this.value = 0;
        this.index = undefined;
        this.max = Math.min(options.max || Infinity, maxValue[this.durationFormat]);
        this.el = el;

        this.setUnits();
        this.init();
    }

    setUnits() {
        let units = [
            {increment: 36000},
            {increment: 3600},
            {increment: 600},
            {increment: 60},
            {increment: 10},
            {increment: 1}
        ];

        this.units = units.slice(...unitView[this.durationFormat]);

        //create start & end for input selection (excluding :)
        this.durationFormat.split(':').forEach((val, i) => {
            this.units[i*2].start = i*3;
            this.units[i*2].end = i*3 + 1;

            this.units[i*2+1].start = i*3 + 1;
            this.units[i*2+1].end = i*3 + 2;
        });
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

    displayValue(value) {
        this.el.value = value;
    }

    getNormalizedMax() {
        let data = this.units[this.index];
        let max = this.max;

        if (this.max % data.increment !== 0) {
            max = this.max + data.increment - (this.max % data.increment);
        }

        return max;
    }

    decrement(amount) {
        let max = this.getNormalizedMax();

        if ((this.value - amount) < 0) {
            this.value = this.value + max - amount;
        }
        else {
            this.value -= amount; 
        }
    }

    increment(amount) {
        let max = this.getNormalizedMax();

        if ((this.value + amount) >= this.max) {
            this.value = Math.max(this.value - max + amount, 0);
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
        this.onclick = (e) => {
            e.preventDefault();

            //click occured on label, focus event handled it.
            if (this.mousedown !== true) {
                return;
            }

            this.index = formatSelectionPoints[this.durationFormat][this.el.selectionStart];
            this.setSelection();
            this.mousedown = false;
        };

        this.onfocus = (e) => {
            e.preventDefault();

            //focus was from tab not click.
            //click event always follows focus.
            if (this.mousedown !== true) {
                this.index = 0;
                window.requestAnimationFrame(() => {
                    this.el.setSelectionRange(0, 1);
                });
            }
        };

        this.onmousedown = () => {
            this.mousedown = true;
        };

        this.onkeydown = (e) => {
            let data = this.units[this.index]
            let key = e.key || e.which || e.keyCode;
            let shouldPreventDefault = true;

            switch(key) {
                case "ArrowUp":
                case KEYUP:
                    this.increment(data.increment);
                    this.displayValue(this.formatDuration());
                    break;
                case "ArrowDown":
                case KEYDOWN:
                    this.decrement(data.increment);
                    this.displayValue(this.formatDuration());
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

                    this.increment(amount);
                    this.index += 1;
                    this.displayValue(this.formatDuration());
                    break;
                case "Tab":
                case 9:
                    shouldPreventDefault = false;
                    break;
            }

            if (shouldPreventDefault) {
                e.preventDefault();
            }

            this.setSelection();
        };

        this.el.value = this.formatDuration();
        this.el.addEventListener("click", this.onclick);
        this.el.addEventListener("mousedown", this.onmousedown);
        this.el.addEventListener("focus", this.onfocus);
        this.el.addEventListener("keydown", this.onkeydown);
    }

    destroy() {
        this.el.removeEventListener("click", this.onclick);
        this.el.removeEventListener("mousedown", this.onmousedown);
        this.el.removeEventListener("focus", this.onfocus);
        this.el.removeEventListener("keydown", this.onkeydown);
    }
}

export default function(el, options={}) {

    return new Selection(el, options);
}