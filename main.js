import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

import moment from 'moment';
import 'moment-duration-format';

import createElement from 'virtual-dom/create-element';
import Delegator from 'dom-delegator';
import EventEmitter from 'event-emitter';


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
    constructor() {
        this.durationFormat = 'hh:mm:ss';
        this.value = 0;
        this.index = undefined;
    }

    formatDuration(duration) {
        return moment.duration(duration, 'seconds').format(this.durationFormat, {trim: false});
    }

    setSelection(input) {
        setTimeout(() => {
            let data = units[this.index];
            input.setSelectionRange(data.start, data.end);
        }, 0);
    }

    render() {
        return h('div.timepoint-selection',
            h('input', {
                'type': 'text',
                'value': this.formatDuration(this.value),
                'ev-click': (e) => {
                    e.preventDefault();

                    let input = e.target;
                    let index = formatSelectionPoints[this.durationFormat][input.selectionStart];
                    let data = units[index];

                    this.setSelection(e.target, data.start, data.end);
                    this.index = index;
                },
                'ev-keydown': (e) => {
                    e.preventDefault();
                },
                'ev-keyup': (e) => {
                    e.preventDefault();

                    let input = e.target;
                    let data = units[this.index]

                    switch(e.which) {
                        case KEYUP:
                            if ((this.value + data.increment) > MAX) {
                                this.value = this.value - MAX + data.increment - 1;
                            }
                            else {
                                this.value += data.increment;
                            }
                            input.value = this.formatDuration(this.value);
                            break;
                        case KEYDOWN:
                            
                            if ((this.value - data.increment) < 0) {
                                this.value = this.value + MAX - data.increment + 1;
                            }
                            else {
                                this.value -= data.increment; 
                            }
                            input.value = this.formatDuration(this.value);
                            break;
                        case KEYLEFT:
                            this.index -= 1;
                            break;
                        case KEYRIGHT:
                            this.index += 1;
                            break;
                    }

                    this.setSelection(input);
                }
            })
        );
    }
}

export default class SelectionRenderer {
    constructor(selection, el) {
        this.tree = selection.render();
        this.rootNode = createElement(this.tree);
        this.selection = selection;

        el.appendChild(this.rootNode);
    }

    draw() {
        window.requestAnimationFrame(() => {
            let newTree = this.selection.render();
            let patches = diff(this.tree, newTree);
            this.rootNode = patch(this.rootNode, patches);
            this.tree = newTree;
        });
    }

}

export function init(options={}, ee=EventEmitter(), delegator=Delegator()) {
    if (options.container === undefined) {
        throw new Error("DOM element container must be given.");
    }

    let selection = new Selection();
    let renderer = new SelectionRenderer(selection, options.container);
}