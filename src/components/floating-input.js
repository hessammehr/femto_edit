export class FloatingInput {
    constructor(options = {}) {
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.className = 'fe-floating-input';
        
        // Apply options
        Object.assign(this.input, {
            placeholder: options.placeholder || '',
            value: options.value || '',
        });

        // Bind methods
        this.handleKeydown = this.handleKeydown.bind(this);
    }

    // Shows the input relative to a reference element
    show(referenceEl, onSubmit, onCancel) {
        this.onSubmit = onSubmit;
        this.onCancel = onCancel;

        // Add to DOM
        document.body.appendChild(this.input);
        
        // Center in viewport
        Object.assign(this.input.style, {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw'
        });

        // Listen for keyboard events
        this.input.addEventListener('keydown', this.handleKeydown);
        
        // Focus and select text
        this.input.focus();
        this.input.select();
    }

    handleKeydown(e) {
        e.stopPropagation();
        
        if (e.key === 'Enter' && this.onSubmit) {
            e.preventDefault();
            const value = this.input.value.trim();
            this.cleanup();
            this.onSubmit(value);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.cleanup();
            if (this.onCancel) this.onCancel();
        }
    }

    cleanup() {
        this.input.removeEventListener('keydown', this.handleKeydown);
        this.input.remove();
    }
}