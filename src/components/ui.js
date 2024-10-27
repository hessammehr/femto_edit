import { getCurrentElement, focusElement } from '../utils/selection';

export class BottomBar {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'fe-bottom-bar';
        
        // Help icon with shortcuts
        this.helpButton = document.createElement('button');
        this.helpButton.className = 'fe-icon-button';
        this.helpButton.innerHTML = '?';
        this.setupHelpTooltip();

        // DOM tree toggle
        this.treeButton = document.createElement('button');
        this.treeButton.className = 'fe-icon-button';
        this.treeButton.innerHTML = '⋮';
        this.treeButton.addEventListener('click', () => this.toggleTree());

        // Breadcrumbs container
        this.breadcrumbs = document.createElement('div');
        this.breadcrumbs.className = 'fe-breadcrumbs';

        this.element.appendChild(this.helpButton);
        this.element.appendChild(this.treeButton);
        this.element.appendChild(this.breadcrumbs);

        // DOM Tree panel
        this.treePanel = new DOMTreePanel();
        
        // Update breadcrumbs when selection changes
        document.addEventListener('selectionchange', () => {
            this.updateBreadcrumbs();
        });
    }

    mount() {
        document.body.appendChild(this.element);
        this.updateBreadcrumbs();
    }

    setupHelpTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'fe-tooltip';
        tooltip.innerHTML = `
            <div class="fe-tooltip-content">
                <h3>Keyboard Shortcuts</h3>
                <table>
                    <tr><td>Ctrl + /</td><td>Change element tag</td></tr>
                    <tr><td>Ctrl + K</td><td>Edit link</td></tr>
                    <tr><td>Ctrl + ↑</td><td>Promote element</td></tr>
                    <tr><td>Ctrl + Alt + ←/→</td><td>Move element</td></tr>
                    <tr><td>Ctrl + Alt + 1-6</td><td>Convert to heading</td></tr>
                    <tr><td>Ctrl + Alt + S</td><td>Save page</td></tr>
                </table>
            </div>
        `;

        this.helpButton.appendChild(tooltip);
    }

    updateBreadcrumbs() {
        const element = getCurrentElement();
        if (!element) return;

        this.breadcrumbs.innerHTML = '';
        let current = element;
        const chain = [];

        while (current && current !== document.body.parentNode) {
            chain.unshift(current);
            current = current.parentNode;
        }

        chain.forEach((el, index) => {
            if (index > 0) {
                const separator = document.createElement('span');
                separator.className = 'fe-breadcrumb-separator';
                separator.textContent = '▶';
                this.breadcrumbs.appendChild(separator);
            }

            const crumb = document.createElement('button');
            crumb.className = 'fe-breadcrumb';
            crumb.textContent = el.tagName.toLowerCase();
            crumb.addEventListener('click', () => focusElement(el));
            this.breadcrumbs.appendChild(crumb);
        });
    }

    toggleTree() {
        this.treePanel.toggle();
    }
}

class DOMTreePanel {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'fe-tree-panel';
        this.visible = false;
        
        // Keep track of current element
        document.addEventListener('selectionchange', () => {
            if (this.visible) {
                this.render();
            }
        });

        this.render();
    }

    toggle() {
        this.visible = !this.visible;
        this.element.style.display = this.visible ? 'block' : 'none';
        if (this.visible) {
            this.render();
        }
    }

    render() {
        this.element.innerHTML = '';
        const tree = this.renderNode(document.body);
        this.element.appendChild(tree);
        if (!this.element.parentNode) {
            document.body.appendChild(this.element);
        }
    }

    shouldShowNode(node) {
        // Skip our UI elements
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        if (node.className && typeof node.className === 'string' && 
            (node.className.includes('fe-'))) {
            return false;
        }
        return true;
    }

    renderNode(node) {
        if (!this.shouldShowNode(node)) return null;

        const container = document.createElement('div');
        container.className = 'fe-tree-node';

        const label = document.createElement('button');
        label.className = 'fe-tree-label';
        
        // Check if this is the current element
        const currentElement = getCurrentElement();
        if (currentElement === node) {
            label.classList.add('fe-tree-label-current');
        }

        label.textContent = node.tagName.toLowerCase();
        label.addEventListener('click', () => focusElement(node));

        container.appendChild(label);

        if (node.children.length) {
            const children = document.createElement('div');
            children.className = 'fe-tree-children';
            Array.from(node.children)
                .map(child => this.renderNode(child))
                .filter(Boolean)
                .forEach(childNode => {
                    children.appendChild(childNode);
                });
            
            if (children.children.length > 0) {
                container.appendChild(children);
            }
        }

        return container;
    }
}