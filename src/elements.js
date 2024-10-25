import { maintainFocus } from './selection.js';

export function createTagInput(element) {
    if (!element || element === document.body) return;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pb-url-input';
    input.placeholder = 'Enter new tag name and press Enter';
    input.value = element.tagName.toLowerCase();

    // Position in the upper portion of the viewport, independent of scroll
    const viewportWidth = window.innerWidth;
    const left = Math.max(10, (viewportWidth - 300) / 2);
    const top = 100;

    input.style.left = `${left}px`;
    input.style.top = `${top}px`;

    function cleanup(focusTarget = null) {
        // Remove the input first
        if (input.parentNode) {
            input.removeEventListener('keydown', handleKeydown);
            input.remove();
        }
        
        // Then handle focus if needed
        if (focusTarget) {
            setTimeout(() => maintainFocus(focusTarget), 0);
        }
    }

    function handleKeydown(e) {
        e.stopPropagation();
        
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = input.value.trim().toLowerCase();
            
            if (newTag && newTag !== element.tagName.toLowerCase()) {
                const newElement = changeElementTag(element, newTag);
                cleanup(newElement);
            } else {
                cleanup(element);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cleanup(element);
        }
    }

    input.addEventListener('keydown', handleKeydown);
    document.body.appendChild(input);
    input.focus();
    input.select();

    return input;
}

function changeElementTag(element, newTag) {
    const newElement = document.createElement(newTag);
    
    // Copy attributes
    Array.from(element.attributes).forEach(attr => {
        newElement.setAttribute(attr.name, attr.value);
    });
    
    // Copy contents
    newElement.innerHTML = element.innerHTML;
    
    // Replace old element with new one
    element.parentNode.replaceChild(newElement, element);
    
    return newElement;
}

export function moveElement(element, direction) {
    if (!element || !element.parentNode) return;
    
    if (direction === 'up') {
        if (element.previousElementSibling) {
            element.parentNode.insertBefore(element, element.previousElementSibling);
            maintainFocus(element);
        }
    } else if (direction === 'down') {
        if (element.nextElementSibling) {
            element.parentNode.insertBefore(element.nextElementSibling, element);
            maintainFocus(element);
        }
    }
}

export function promoteElement(element) {
    if (!element || !element.parentNode || !element.parentNode.parentNode) return;
    if (element.parentNode === document.body) return;
    
    const parent = element.parentNode;
    const grandparent = parent.parentNode;
    grandparent.insertBefore(element, parent.nextSibling);
    maintainFocus(element);
}

export function convertToHeading(level) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const element = getCurrentElement();
    
    if (!range.collapsed && range.toString().trim() !== element.textContent.trim()) {
        const heading = document.createElement(`h${level}`);
        const fragment = range.extractContents();
        heading.appendChild(fragment);
        range.insertNode(heading);
        maintainFocus(heading);
        return;
    }
    
    if (element && element !== document.body) {
        const heading = document.createElement(`h${level}`);
        heading.innerHTML = element.innerHTML;
        element.parentNode.replaceChild(heading, element);
        maintainFocus(heading);
    }
}

export function cleanupEmptyElements() {
    const emptyElements = document.querySelectorAll('span:empty, i:empty, b:empty, u:empty');
    emptyElements.forEach(element => element.remove());
}