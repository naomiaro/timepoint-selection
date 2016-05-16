import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

import moment from 'moment';
import 'moment-duration-format';

import createElement from 'virtual-dom/create-element';
import Delegator from 'dom-delegator';
import EventEmitter from 'event-emitter';

// hh:mm:ss
var hh,mm,ss;

hh = {start: 0, end: 2, increment: 3600};
mm = {start: 3, end: 5, increment: 60};
ss = {start: 6, end: 8, increment: 1};

hh.next = mm;
mm.prev = hh;
mm.next = ss;
ss.prev = mm;

var formatSelectionPoints = {
    'hh:mm:ss': [
        hh, //0
        hh, //1
        hh, //2
        mm, //3
        mm, //4
        mm, //5
        ss, //6
        ss, //7
        ss  //8
    ]
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
        this.data = undefined;
    }

    formatDuration(duration) {
        return moment.duration(duration, 'seconds').format(this.durationFormat, {trim: false});
    }

    setSelection(input, start, end) {
        setTimeout(() => {
            input.setSelectionRange(start, end);
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
                    let data = formatSelectionPoints[this.durationFormat][input.selectionStart];

                    this.setSelection(e.target, data.start, data.end);
                    this.data = data;
                },
                'ev-keydown': (e) => {
                    e.preventDefault();
                },
                'ev-keyup': (e) => {
                    e.preventDefault();

                    let input = e.target;

                    console.log(e);

                    switch(e.which) {
                        case KEYUP:
                            if ((this.value + this.data.increment) > MAX) {
                                this.value = this.value - MAX;
                            }
                            else {
                                this.value += this.data.increment;
                            }
                            input.value = this.formatDuration(this.value);
                            break;
                        case KEYDOWN:
                            
                            if ((this.value - this.data.increment) < 0) {
                                this.value = this.value + MAX;
                            }
                            else {
                                this.value -= this.data.increment; 
                            }
                            input.value = this.formatDuration(this.value);
                            break;
                        case KEYLEFT:
                            this.data = this.data.prev;
                            break;
                        case KEYRIGHT:
                            this.data = this.data.next;
                            break;
                    }

                    this.setSelection(input, this.data.start, this.data.end);
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