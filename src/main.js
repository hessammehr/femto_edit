import css from './styles.css';
import { setupSelectionHandlers, updateOverlay } from './selection.js';
import { setupKeyboardShortcuts } from './shortcuts.js';
import { cleanupEmptyElements } from './elements.js';

export function initializeFemtoEdit() {
    // Make the body content editable
    document.body.contentEditable = 'true';
    document.designMode = 'on';

    // Create and inject styles
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'pb-highlight-overlay';
    document.body.appendChild(overlay);

    // Setup handlers
    setupSelectionHandlers(overlay);
    setupKeyboardShortcuts();

    // Setup mutation observer for cleanup
    const observer = new MutationObserver(() => cleanupEmptyElements());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Show instructions
    showInstructions();
}

function showInstructions() {
    alert('FemtoEdit activated!\n\n' +
          'Keyboard shortcuts:\n' +
          'Ctrl+Alt+D: Add new div\n' +
          'Ctrl+Alt+P: Add new paragraph\n' +
          'Shift+Enter: Add line break\n' +
          'Ctrl+Alt+X: Delete current element\n' +
          'Ctrl+Alt+S: Save page\n' +
          'Ctrl+Alt+←/→: Move element left/right\n' +
          'Ctrl+↑: Promote element to parent level\n' +
          'Ctrl+K: Add/edit link\n' +
          'Ctrl+Alt+1-6: Convert to heading (H1-H6)');
}

// Auto-initialize
initializeFemtoEdit();