/**
 * Utility functions for DOM manipulation
 */

// Element transformation
export function transformElement(element, transform) {
    if (!element || element === document.body) return null;
    
    const parent = element.parentNode;
    const nextSibling = element.nextSibling;
    
    // Apply transformation
    const newElement = transform(element);
    
    // Reinsert if parent exists and element was actually transformed
    if (parent && newElement && newElement !== element) {
        parent.insertBefore(newElement, nextSibling);
        element.remove();
    }
    
    return newElement || element;
}

// Common transformations
export const domTransforms = {
    changeTag: (newTag) => (element) => {
        const newElement = document.createElement(newTag);
        
        // Copy attributes
        Array.from(element.attributes).forEach(attr => {
            newElement.setAttribute(attr.name, attr.value);
        });
        
        // Copy contents
        newElement.innerHTML = element.innerHTML;
        
        return newElement;
    },

    moveUp: (element) => {
        const prev = element.previousElementSibling;
        if (prev) {
            element.parentNode.insertBefore(element, prev);
        }
        return element;
    },

    moveDown: (element) => {
        const next = element.nextElementSibling;
        if (next && next.nextSibling) {
            element.parentNode.insertBefore(element, next.nextSibling);
        } else if (next) {
            element.parentNode.appendChild(element);
        }
        return element;
    },

    promote: (element) => {
        const parent = element.parentNode;
        const grandparent = parent?.parentNode;
        
        if (grandparent && parent !== document.body) {
            grandparent.insertBefore(element, parent.nextSibling);
        }
        return element;
    }
};

// Clean up page before save
export function cleanupPage() {
    // Store current state
    const state = {
        styles: [],
        overlay: null,
        editableState: document.body.contentEditable
    };

    // Remove page builder styles
    document.querySelectorAll('style').forEach(style => {
        if (style.textContent.includes('fe-')) {
            state.styles.push({
                element: style,
                parent: style.parentNode
            });
            style.remove();
        }
    });

    // Remove overlay
    const overlay = document.querySelector('.fe-highlight-overlay');
    if (overlay) {
        state.overlay = {
            element: overlay,
            parent: overlay.parentNode
        };
        overlay.remove();
    }

    // Disable editing
    document.body.contentEditable = 'false';
    document.designMode = 'off';

    return {
        cleanup: state,
        restore: () => {
            // Restore styles
            state.styles.forEach(({element, parent}) => {
                parent.appendChild(element);
            });

            // Restore overlay
            if (state.overlay) {
                state.overlay.parent.appendChild(state.overlay.element);
            }

            // Restore editing
            document.body.contentEditable = state.editableState;
            document.designMode = 'on';
        }
    };
}