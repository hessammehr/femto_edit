// Selection and highlighting functionality
export function getCurrentElement() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;
    
    let node = selection.getRangeAt(0).commonAncestorContainer;
    return node.nodeType === 3 ? node.parentElement : node;
}

export function maintainFocus(element, overlay) {
    if (!element) return;
    
    const range = document.createRange();
    const selection = window.getSelection();
    
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    
    updateOverlay(element, overlay);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function updateOverlay(element, overlay) {
    if (!element || element === document.body) {
        overlay.style.display = 'none';
        return;
    }

    const rect = element.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
}

export function setupSelectionHandlers(overlay) {
    document.addEventListener('selectionchange', () => {
        const currentElement = getCurrentElement();
        updateOverlay(currentElement, overlay);
    });

    document.addEventListener('scroll', () => {
        const currentElement = getCurrentElement();
        if (currentElement) {
            updateOverlay(currentElement, overlay);
        }
    }, { passive: true });
}