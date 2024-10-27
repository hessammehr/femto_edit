import { tinykeys } from 'tinykeys';
import { FloatingInput } from '../components/floating-input';
import { transformElement, domTransforms, cleanupPage, createNestedElements } from '../utils/dom';
import { getCurrentElement, focusElement } from '../utils/selection';

function handleTagChange(element = getCurrentElement()) {
    if (!element || element === document.body) return;

    const input = new FloatingInput({
        placeholder: 'Enter tag name(s)',
        value: element.tagName.toLowerCase()
    });

    input.show(
        element,
        (value) => {
            if (!value) {
                focusElement(element);
                return;
            }

            // Split input into multiple tags and clean them
            const tags = value.toLowerCase()
                .split(/\s+/)
                .filter(tag => tag.length > 0);

            if (tags.length === 0) {
                focusElement(element);
                return;
            }

            // Handle single tag case normally
            if (tags.length === 1) {
                if (tags[0] !== element.tagName.toLowerCase()) {
                    const newElement = transformElement(
                        element,
                        domTransforms.changeTag(tags[0])
                    );
                    if (newElement) {
                        focusElement(newElement);
                    }
                } else {
                    focusElement(element);
                }
                return;
            }

            // Handle multiple tags
            const newElement = createNestedElements(element, tags);
            if (newElement) {
                focusElement(newElement);
            }
        },
        () => focusElement(element)
    );
}

function handleLinkEdit(element = getCurrentElement()) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const linkElement = range.collapsed 
        ? (element.closest('a') || element.querySelector('a'))
        : null;
            
    const input = new FloatingInput({
        placeholder: 'Enter URL',
        value: linkElement ? linkElement.href : ''
    });

    input.show(
        element,
        (url) => {
            if (!url) {
                focusElement(element);
                return;
            }

            if (linkElement) {
                linkElement.href = url;
                focusElement(linkElement);
            } else if (!range.collapsed) {
                const content = range.extractContents();
                const link = document.createElement('a');
                link.href = url;
                link.appendChild(content);
                range.insertNode(link);
                focusElement(link);
            }
        },
        () => focusElement(element)
    );
}

export function saveCurrentPage() {
    const { getCleanHTML, restore } = cleanupPage();
    
    // Create and trigger download
    const blob = new Blob([getCleanHTML()], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edited_page.html';
    a.click();
    URL.revokeObjectURL(a.href);

    // Restore editor state
    restore();
}

export function setupCommands() {
    const shortcuts = {
        // Basic editing
        "$mod+/": e => {
            e.preventDefault();
            handleTagChange();
        },
        "$mod+k": e => {
            e.preventDefault();
            handleLinkEdit();
        },
        
        // Element movement
        "Control+Alt+ArrowLeft": e => {
            e.preventDefault();
            const element = getCurrentElement();
            if (element) {
                const newElement = transformElement(element, domTransforms.moveUp);
                if (newElement) focusElement(newElement);
            }
        },
        "Control+Alt+ArrowRight": e => {
            e.preventDefault();
            const element = getCurrentElement();
            if (element) {
                const newElement = transformElement(element, domTransforms.moveDown);
                if (newElement) focusElement(newElement);
            }
        },
        "Control+ArrowUp": e => {
            e.preventDefault();
            const element = getCurrentElement();
            if (element) {
                const newElement = transformElement(element, domTransforms.promote);
                if (newElement) focusElement(newElement);
            }
        },

        // Page management
        "Control+Alt+KeyS": e => {
            e.preventDefault();
            saveCurrentPage();
        }
    };

    // Add heading shortcuts (1-6)
    for (let i = 1; i <= 6; i++) {
        shortcuts[`Control+Alt+Digit${i}`] = e => {
            e.preventDefault();
            const element = getCurrentElement();
            if (element) {
                const newElement = transformElement(
                    element, 
                    domTransforms.changeTag(`h${i}`)
                );
                if (newElement) focusElement(newElement);
            }
        };
    }

    // Register all shortcuts
    tinykeys(window, shortcuts);
}