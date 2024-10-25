import { getCurrentElement } from './selection.js';
import { handleLink } from './links.js';
import { moveElement, promoteElement, convertToHeading } from './elements.js';

export function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Handle heading conversion (Ctrl+Alt+1 through Ctrl+Alt+6)
        if (e.ctrlKey && e.altKey && e.keyCode >= 49 && e.keyCode <= 54) {
            e.preventDefault();
            const level = e.keyCode - 48;
            convertToHeading(level);
            return;
        }

        // Handle link creation/editing (Ctrl/Cmd + K)
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 75 && !e.altKey) {
            e.preventDefault();
            handleLink();
            return;
        }

        // Handle Shift+Enter for line break
        if (e.shiftKey && e.keyCode === 13) {
            e.preventDefault();
            const br = document.createElement('br');
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            range.insertNode(br);
            range.setStartAfter(br);
            range.setEndAfter(br);
            return;
        }

        const currentElement = getCurrentElement();

        // Handle Ctrl+Up for promotion (without Alt)
        if (e.ctrlKey && !e.altKey && e.keyCode === 38) {
            e.preventDefault();
            promoteElement(currentElement);
            return;
        }

        // Handle Ctrl+Alt combinations
        if (e.ctrlKey && e.altKey) {
            e.preventDefault();
            handleCtrlAltShortcut(e.keyCode, currentElement);
        }
    });
}

function handleCtrlAltShortcut(keyCode, currentElement) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const newElement = document.createElement('div');

    switch (keyCode) {
        case 68: // D key
            newElement.innerHTML = '<div>New div</div>';
            range.insertNode(newElement);
            maintainFocus(newElement.firstElementChild);
            break;
        case 80: // P key
            newElement.innerHTML = '<p>New paragraph</p>';
            range.insertNode(newElement);
            maintainFocus(newElement.firstElementChild);
            break;
        case 88: // X key
            if (currentElement && currentElement !== document.body) {
                const parentElement = currentElement.parentElement;
                currentElement.remove();
                maintainFocus(parentElement);
            }
            break;
        case 83: // S key
            saveCurrentPage();
            break;
        case 37: // Left arrow
            moveElement(currentElement, 'up');
            break;
        case 39: // Right arrow
            moveElement(currentElement, 'down');
            break;
    }
}

function saveCurrentPage() {
    // Clean up the page before saving
    const cleanupStyles = document.querySelectorAll('style');
    cleanupStyles.forEach(style => {
        if (style.textContent.includes('pb-highlight-overlay') || 
            style.textContent.includes('pb-url-input')) {
            style.remove();
        }
    });

    // Remove overlay element
    const overlay = document.querySelector('.pb-highlight-overlay');
    if (overlay) overlay.remove();

    // Remove contentEditable attribute from body
    document.body.contentEditable = 'false';
    document.designMode = 'off';

    // Get the cleaned HTML
    const htmlContent = document.documentElement.outerHTML;

    // Restore the editor state
    document.body.contentEditable = 'true';
    document.designMode = 'on';

    // Create and trigger download
    const blob = new Blob([htmlContent], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'edited_page.html';
    a.click();
}