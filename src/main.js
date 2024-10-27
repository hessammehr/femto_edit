import { setupCommands } from './commands';
import { selectionManager } from './utils/selection';
import { BottomBar } from './components/ui';
import styles from './styles.css';

class FemtoEdit {
    constructor() {
        this.initialized = false;
        this.ui = {
            bottomBar: null
        };
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

        // Add bottom margin to body to account for bottom bar
        const originalBodyMargin = document.body.style.marginBottom;
        document.body.style.marginBottom = '50px'; // Slightly more than bottom bar height

        // Initialize UI components
        this.ui.bottomBar = new BottomBar();
        this.ui.bottomBar.mount();

        // Setup commands and keyboard shortcuts
        setupCommands();

        // Store cleanup data
        this._cleanup = {
            styleElement,
            originalBodyMargin
        };

        this.initialized = true;
    }

    destroy() {
        if (!this.initialized) return;

        // Clean up selection manager
        selectionManager.cleanup();

        // Clean up UI components
        if (this.ui.bottomBar) {
            this.ui.bottomBar.element.remove();
        }

        // Remove contentEditable
        document.body.contentEditable = 'false';
        document.designMode = 'off';

        // Restore body margin
        document.body.style.marginBottom = this._cleanup.originalBodyMargin;

        // Remove styles
        if (this._cleanup.styleElement) {
            this._cleanup.styleElement.remove();
        }

        // Remove any other fe- elements that might be left
        document.querySelectorAll('[class^="fe-"]').forEach(el => el.remove());

        this.initialized = false;
        this.ui = {};
    }
}

// Export singleton instance
export const femtoEdit = new FemtoEdit();

// Auto-initialize if loaded directly
if (typeof window !== 'undefined') {
    femtoEdit.init();
}