/**
 * Utility functions for handling selection and focus
 */

class SelectionManager {
    constructor() {
        this.overlayElement = null;
        this.setupOverlay();
        this.setupListeners();
    }

    setupOverlay() {
        this.overlayElement = document.createElement('div');
        this.overlayElement.className = 'fe-highlight-overlay';
        document.body.appendChild(this.overlayElement);
    }

    setupListeners() {
        // Update overlay on selection changes
        document.addEventListener('selectionchange', () => {
            const element = this.getCurrentElement();
            this.updateOverlay(element);
        });

        // Update overlay position on scroll
        window.addEventListener('scroll', () => {
            const element = this.getCurrentElement();
            if (element) {
                this.updateOverlay(element);
            }
        }, { passive: true });
    }

    getCurrentElement() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return null;
        
        let node = selection.getRangeAt(0).commonAncestorContainer;
        return node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
    }

    getSelectedRange() {
        const selection = window.getSelection();
        return selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    updateOverlay(element) {
        if (!element || element === document.body) {
            this.overlayElement.style.display = 'none';
            return;
        }

        const rect = element.getBoundingClientRect();
        Object.assign(this.overlayElement.style, {
            display: 'block',
            top: `${rect.top + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`
        });
    }

    focusElement(element) {
        if (!element) return;
        
        const range = document.createRange();
        const selection = window.getSelection();
        
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.updateOverlay(element);
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    cleanup() {
        if (this.overlayElement) {
            this.overlayElement.remove();
            this.overlayElement = null;
        }
    }
}

// Export singleton instance
export const selectionManager = new SelectionManager();

// Convenience exports
export const getCurrentElement = () => selectionManager.getCurrentElement();
export const focusElement = (element) => selectionManager.focusElement(element);