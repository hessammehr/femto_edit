import { getCurrentElement, maintainFocus } from './selection.js';

export function handleLink() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const linkInfo = findExistingLink(range);
    const selectedText = range.toString();
    
    if (!selectedText && !linkInfo.url) return;

    const input = createUrlInput(range, linkInfo.url);
    document.body.appendChild(input);
    input.focus();
}

function createUrlInput(range, defaultUrl) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'pb-url-input';
    input.value = defaultUrl || '';
    input.placeholder = 'Enter URL and press Enter';

    const rect = range.getBoundingClientRect();
    input.style.left = `${rect.left + window.scrollX}px`;
    input.style.top = `${rect.bottom + window.scrollY + 5}px`;

    input.onkeydown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            e.preventDefault();
            const url = input.value.trim();
            if (url) {
                createOrUpdateLink(range, url);
            }
            input.remove();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            input.remove();
        }
    };

    return input;
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
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(link);
    selection.addRange(newRange);
}