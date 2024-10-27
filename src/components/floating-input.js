import { computePosition, flip, shift, offset } from '@floating-ui/dom';

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
        this.referenceEl = referenceEl;
        this.onSubmit = onSubmit;
        this.onCancel = onCancel;

        // Add to DOM first so we can measure it
        document.body.appendChild(this.input);
        
        // Position the input
        this.updatePosition();

        // Listen for keyboard events
        this.input.addEventListener('keydown', this.handleKeydown);
        
        // Focus and select text
        this.input.focus();
        this.input.select();

        // Listen for scroll/resize
        window.addEventListener('scroll', this.updatePosition.bind(this), true);
        window.addEventListener('resize', this.updatePosition.bind(this));
    }

    updatePosition() {
        computePosition(this.referenceEl, this.input, {
            placement: 'bottom',
            middleware: [
                offset(6),  // 6px spacing
                flip(),     // flip if no space below
                shift({ padding: 10 })  // keep 10px from viewport edges
            ]
        }).then(({x, y}) => {
            Object.assign(this.input.style, {
                left: `${x}px`,
                top: `${y}px`
            });
        });
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
        window.removeEventListener('scroll', this.updatePosition.bind(this), true);
        window.removeEventListener('resize', this.updatePosition.bind(this));
        this.input.removeEventListener('keydown', this.handleKeydown);
        this.input.remove();
    }
}