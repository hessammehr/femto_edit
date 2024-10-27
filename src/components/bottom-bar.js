import { tinykeys } from 'tinykeys';
import { createElement } from '../utils/dom';

export class BottomBar {
    constructor() {
        this.element = createElement('div', {
            className: 'fe-bottom-bar',
            innerHTML: `
                <div class="fe-help">
                    <button>?</button>
                    <div class="fe-shortcuts">
                        <div class="fe-shortcut">
                            <kbd>Ctrl</kbd> + <kbd>/</kbd> Change element tag
                        </div>
                        <div class="fe-shortcut">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd> Add/edit link
                        </div>
                        <div class="fe-shortcut">
                            <kbd>Ctrl</kbd> + <kbd>↑</kbd> Promote element
                        </div>
                        <div class="fe-shortcut">
                            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>←</kbd>/<kbd>→</kbd> Move element
                        </div>
                        <div class="fe-shortcut">
                            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>1-6</kbd> Heading level
                        </div>
                        <div class="fe-shortcut">
                            <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> Save page
                        </div>
                    </div>
                </div>
                <div class="fe-dom-tree">
                    <button>🌳</button>
                </div>
                <div class="fe-breadcrumbs"></div>
            `
        });

        this.setupEventListeners();
    }

    setupEventListeners() {
        const domTreeBtn = this.element.querySelector('.fe-dom-tree button');
        domTreeBtn.addEventListener('click', () => this.toggleDomTree());
    }

    updateBreadcrumbs(element) {
        if (!element) return;

        const breadcrumbs = this.element.querySelector('.fe-breadcrumbs');
        breadcrumbs.innerHTML = '';

        let current = element;
        const path = [];

        while (current && current !== document.body.parentNode) {
            path.unshift(current);
            current = current.parentNode;
        }

        path.forEach((node, index) => {
            if (index > 0) {
                breadcrumbs.appendChild(createElement('span', {
                    className: 'fe-breadcrumb-separator',
                    textContent: ' ▶ '
                }));
            }

            breadcrumbs.appendChild(createElement('button', {
                className: 'fe-breadcrumb',
                textContent: node.tagName.toLowerCase(),
                onclick: () => {
                    document.dispatchEvent(new CustomEvent('femtoedit:select', {
                        detail: { element: node }
                    }));
                }
            }));
        });
    }

    toggleDomTree() {
        // Implementation coming in next component
    }

    mount() {
        document.body.appendChild(this.element);
    }

    cleanup() {
        this.element.remove();
    }
}
