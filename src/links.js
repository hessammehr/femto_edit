import { getCurrentElement, maintainFocus } from './selection.js';

export function handleLink() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    
    // If we have a collapsed selection (just a caret), check if we're inside a link
    if (range.collapsed) {
        const node = range.startContainer;
        const linkElement = (node.nodeType === Node.TEXT_NODE ? node.parentElement : node).closest('a');
        
        if (linkElement) {
            showUrlInput(range, linkElement.href, linkElement);
            return;
        }
    }

    // Otherwise, handle selected text
    const linkInfo = findExistingLink(range);
    const selectedText = range.toString();
    
    if (!selectedText && !linkInfo.url) return;
    
    showUrlInput(range, linkInfo.url);
}

function showUrlInput(range, defaultUrl = '', existingLink = null) {
    const input = createUrlInput(range, defaultUrl, existingLink);
    document.body.appendChild(input);
    input.focus();
    input.select();
}

function createUrlInput(range, defaultUrl, existingLink) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pb-url-input';
    input.value = defaultUrl || '';
    input.placeholder = 'Enter URL and press Enter';

    // Position in the upper portion of the viewport, independent of scroll
    const viewportWidth = window.innerWidth;
    const left = Math.max(10, (viewportWidth - 300) / 2); // 300px is the width set in CSS
    const top = 100; // Fixed distance from top of viewport, no scrollY added

    input.style.left = `${left}px`;
    input.style.top = `${top}px`;

    input.onkeydown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            const url = input.value.trim();
            if (url) {
                if (existingLink) {
                    updateExistingLink(range, url, existingLink);
                } else {
                    createOrUpdateLink(range, url);
                }
            }
            input.remove();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            input.remove();
        }
    };

    document.body.appendChild(input);
    input.focus();
    input.select();

    return input;
}

function updateExistingLink(range, url, linkElement) {
    linkElement.href = url;
    
    // Maintain caret position
    const selection = window.getSelection();
    const newRange = document.createRange();
    newRange.setStart(range.startContainer, range.startOffset);
    newRange.setEnd(range.startContainer, range.startOffset);
    selection.removeAllRanges();
    selection.addRange(newRange);
}

function findExistingLink(range) {
    const fragment = range.cloneContents();
    const links = fragment.querySelectorAll('a');
    const existingLink = links[0];
    
    return {
        url: existingLink ? existingLink.href : '',
        hasLinks: links.length > 0
    };
}

function createOrUpdateLink(range, url) {
    const fragment = range.cloneContents();
    const container = document.createElement('div');
    container.appendChild(fragment);
    
    const links = container.querySelectorAll('a');
    links.forEach(link => {
        const contents = document.createDocumentFragment();
        while (link.firstChild) {
            contents.appendChild(link.firstChild);
        }
        link.parentNode.replaceChild(contents, link);
    });
    
    const textContent = container.textContent;
    range.deleteContents();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = textContent;
    range.insertNode(link);
    
    // Maintain selection
    const selection = window.getSelection();
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(link);
    selection.addRange(newRange);
}