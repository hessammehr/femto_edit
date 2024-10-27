import { tinykeys } from 'tinykeys';
import { FloatingInput } from '../components/floating-input';
import { transformElement, domTransforms, cleanupPage } from '../utils/dom';
import { getCurrentElement, focusElement } from '../utils/selection';

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

function saveCurrentPage() {
    const { cleanup, restore } = cleanupPage();
    
    // Get the cleaned HTML
    const htmlContent = document.documentElement.outerHTML;
    
    // Create and trigger download
    const blob = new Blob([htmlContent], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edited_page.html';
    a.click();

    // Restore editor state
    restore();
}

export function setupCommands() {
    const shortcuts = {
        // Basic editing
        "$mod+/": e => {
            e.preventDefault();
            const element = getCurrentElement();
            if (element) {
                const input = new FloatingInput({
                    placeholder: 'Enter new tag name',
                    value: element.tagName.toLowerCase()
                });

                input.show(
                    element,
                    (newTag) => {
                        if (newTag && newTag !== element.tagName.toLowerCase()) {
                            const newElement = transformElement(
                                element, 
                                domTransforms.changeTag(newTag)
                            );
                            if (newElement) {
                                focusElement(newElement);
                            }
                        } else {
                            focusElement(element);
                        }
                    },
                    () => focusElement(element)
                );
            }
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