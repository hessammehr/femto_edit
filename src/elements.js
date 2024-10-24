import { maintainFocus } from './selection.js';

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