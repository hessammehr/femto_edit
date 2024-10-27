export function createNestedElements(element, tags) {
    if (!tags.length) return null;

    let currentElement = element;
    let lastElement = null;

    // Convert first tag and maintain content
    if (tags[0] !== element.tagName.toLowerCase()) {
        currentElement = transformElement(
            element, 
            domTransforms.changeTag(tags[0])
        );
    }
    lastElement = currentElement;

    // Create nested structure for remaining tags
    for (let i = 1; i < tags.length; i++) {
        const newElement = document.createElement(tags[i]);
        lastElement.innerHTML = ''; // Clear previous content for nested elements
        lastElement.appendChild(newElement);
        lastElement = newElement;
    }

    // Move original content to innermost element
    if (tags.length > 1) {
        lastElement.innerHTML = element.innerHTML;
    }

    return lastElement; // Return the innermost element for focusing
}

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
    // Create a clone of the document for saving
    const documentClone = document.documentElement.cloneNode(true);

    // Clean up the clone
    const cleanup = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        // Remove FemtoEdit elements
        if (node.className && typeof node.className === 'string' && 
            (node.className.includes('fe-') || node.id?.includes('fe-'))) {
            node.remove();
            return;
        }

        // Special handling for style tags
        if (node.tagName === 'STYLE') {
            // Remove any style tag that contains our styles
            if (node.textContent.includes('fe-')) {
                node.remove();
                return;
            }
        }

        // Clean up editing attributes
        node.removeAttribute('contenteditable');
        node.removeAttribute('spellcheck');

        // Remove any empty class attributes
        if (node.getAttribute('class') === '') {
            node.removeAttribute('class');
        }

        // Clean up other FemtoEdit-specific attributes
        for (const attr of Array.from(node.attributes)) {
            if (attr.name.startsWith('fe-') || attr.value.includes('fe-')) {
                node.removeAttribute(attr.name);
            }
        }

        // Clean children
        Array.from(node.children).forEach(cleanup);
    };

    // First clean up head to remove style tags
    const headElement = documentClone.querySelector('head');
    if (headElement) {
        Array.from(headElement.children).forEach(cleanup);
    }

    // Then clean up body
    const bodyElement = documentClone.querySelector('body');
    if (bodyElement) {
        // Remove margin we added for the bottom bar
        bodyElement.style.marginBottom = '';
        if (bodyElement.getAttribute('style') === '') {
            bodyElement.removeAttribute('style');
        }
        
        // Explicitly remove contentEditable from body
        bodyElement.removeAttribute('contenteditable');
        
        // Clean up body contents
        Array.from(bodyElement.children).forEach(cleanup);
    }

    // Remove any document-level designMode
    documentClone.removeAttribute('designmode');
    documentClone.removeAttribute('contenteditable');

    // Store original states
    const originalContentEditable = document.body.contentEditable;
    const originalDesignMode = document.designMode;
    const originalMarginBottom = document.body.style.marginBottom;

    return {
        getCleanHTML: () => {
            // Final pass to ensure clean HTML
            const html = documentClone.outerHTML
                .replace(/\scontenteditable=".*?"/g, '')
                .replace(/\sdesignmode=".*?"/g, '')
                .replace(/\sspellcheck=".*?"/g, '');
            return html;
        },
        restore: () => {
            // Restore editing state
            document.body.contentEditable = originalContentEditable;
            document.designMode = originalDesignMode;
            document.body.style.marginBottom = originalMarginBottom;
        }
    };
}