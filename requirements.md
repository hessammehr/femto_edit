# FemtoEdit Requirements

## Core Functionality
- Content-editable mode for the entire page
- No visible UI - purely keyboard driven
- Visual feedback for current selection and hover states
- Clean DOM output (no unnecessary elements)
- Automatic cleanup of empty formatting elements

## Visual Feedback
- Hover feedback: 1px dashed blue outline
- Current element feedback: 2px solid blue outline
- Floating overlay for current element (no DOM pollution)
- URL input interface for link editing

## Keyboard Shortcuts

### Element Creation
- Ctrl+Alt+D: Add new div
- Ctrl+Alt+P: Add new paragraph
- Shift+Enter: Add line break

### Element Manipulation
- Ctrl+Alt+Left/Right: Move element up/down within parent
- Ctrl+Up: Promote element to parent level (move up in hierarchy)
- Ctrl+Alt+X: Delete current element
- Ctrl+Alt+1-6: Convert element to heading (H1-H6)

### Links
- Ctrl/Cmd+K: Add/edit link
  - Shows floating input for URL
  - Pre-fills with existing URL if editing
  - Enter to confirm, Escape to cancel
  - Merges text around existing links
  - Preserves text content when editing links

### Page Management
- Ctrl+Alt+S: Save current page as HTML

## Project Structure
- ES6 modules for code organization
- Separate CSS file
- Build process using esbuild
- Single output file as IIFE
- Minimal dependencies

## Browser Compatibility
- Support for modern browsers
- Mac compatibility for keyboard shortcuts
- Cross-platform key handling using keyCodes

## Additional Requirements
- Maintain selection after operations
- Scroll elements into view when selected
- Clean handling of nested elements
- Prevent promotion beyond body element
- Auto-initialize on script load

## Non-Requirements
- No visible UI elements
- No toolbar or buttons
- No configuration options
- No dependency on external libraries