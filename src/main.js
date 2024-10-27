import { setupCommands } from './commands';
import { selectionManager } from './utils/selection';
import styles from './styles.css';

class FemtoEdit {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Initialize styles
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);

        // Make page editable
        document.body.contentEditable = 'true';
        document.designMode = 'on';

        // Setup commands and keyboard shortcuts
        setupCommands();

        // Show instructions
        this.showInstructions();

        this.initialized = true;
    }

    destroy() {
        if (!this.initialized) return;

        // Clean up selection manager
        selectionManager.cleanup();

        // Remove contentEditable
        document.body.contentEditable = 'false';
        document.designMode = 'off';

        // Remove styles
        document.querySelectorAll('style').forEach(style => {
            if (style.textContent.includes('fe-')) {
                style.remove();
            }
        });

        this.initialized = false;
    }

    showInstructions() {
        alert(
            'Page Builder activated!\n\n' +
            'Keyboard shortcuts:\n' +
            'Ctrl/Cmd+/: Change element tag\n' +
            'Ctrl/Cmd+K: Add/edit link\n' +
            'Shift+Enter: Add line break\n' +
            'Ctrl/Cmd+↑: Promote element\n' +
            'Ctrl/Cmd+Alt+←/→: Move element\n' +
            'Ctrl/Cmd+Alt+S: Save page\n' +
            'Ctrl/Cmd+Alt+1-6: Convert to heading'
        );
    }
}

// Export singleton instance
export const femtoEdit = new FemtoEdit();

// Auto-initialize if loaded directly
if (typeof window !== 'undefined') {
    femtoEdit.init();
}