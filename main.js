import h from 'virtual-dom/h';
import diff from 'virtual-dom/diff';
import patch from 'virtual-dom/patch';

import moment from 'moment';
import 'moment-duration-format';

import createElement from 'virtual-dom/create-element';
import Delegator from 'dom-delegator';
import EventEmitter from 'event-emitter';

export default class Selection {
    constructor() {
        this.durationFormat = 'hh:mm:ss';
        this.value = 0;
    }

    formatDuration(duration) {
        return moment.duration(duration, 'seconds').format(this.durationFormat, {trim: false});
    }

    render() {
        return h('div.timepoint-selection',
            this.formatDuration(this.value).split('').map((char) => {
                return h('span.char', char);
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