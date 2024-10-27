# FemtoEdit Specification

A minimalist web page editor that operates without visible UI elements, using only keyboard shortcuts for all operations.

## Core Principles
- No visible UI elements (toolbars, buttons, etc.)
- Keyboard-driven interface
- Minimal dependencies
- Clean DOM output
- Cross-platform compatibility

## Dependencies
- `tinykeys` (v3.0.0) - Keyboard shortcut handling
- `@floating-ui/dom` (v5.2.8) - Positioning for floating inputs

## Architecture

### Directory Structure
```
femto-edit/
├── src/
│   ├── components/
│   │   └── floating-input.js    # Reusable floating input component
│   ├── utils/
│   │   ├── dom.js              # DOM manipulation utilities
│   │   └── selection.js        # Selection & focus management
│   ├── commands/
│   │   └── index.js            # Command definitions & keyboard bindings
│   ├── styles.css              # Core styles
│   └── main.js                 # Main FemtoEdit class
└── build.js                    # Build configuration
```

### Core Components

#### FloatingInput Component
- Purpose: Provides floating input box for tag and URL editing
- Positioning: Uses Floating UI for smart viewport-aware positioning
- Behavior: Enter to confirm, Escape to cancel
- Visual: Appears near the current selection/element
- Cleanup: Self-cleaning on completion or cancellation

#### Selection Manager
- Purpose: Manages element selection and visual feedback
- Features:
  - Selection highlight overlay
  - Focus management
  - Scroll into view behavior
  - Selection state tracking

#### DOM Utilities
- Element transformation framework
- Tag changing utilities
- Element movement functions
- Page cleanup for saving

### Keyboard Shortcuts

#### Element Manipulation
- `Ctrl+/`: Change current element's tag (shows floating input)
- `Ctrl+K`: Add/edit link (shows floating input)
- `Ctrl+Alt+ArrowLeft`: Move element left/up in DOM
- `Ctrl+Alt+ArrowRight`: Move element right/down in DOM
- `Ctrl+ArrowUp`: Promote element (move up in hierarchy)
- `Ctrl+Alt+Digit1` through `Ctrl+Alt+Digit6`: Convert to heading (H1-H6)

#### Page Management
- `Ctrl+Alt+KeyS`: Save page (downloads HTML)

### Visual Feedback
1. Element hover:
   - 1px dashed blue outline
   - Indicates potential selection target

2. Current element:
   - 2px solid blue outline
   - Floating overlay (doesn't affect DOM)
   - Updates on selection change
   - Updates on element movement
   - Updates on scroll

### CSS Classes
```css
.fe-highlight-overlay {
    /* Overlay for current element highlight */
    position: absolute;
    pointer-events: none;
    z-index: 10000;
}

.fe-floating-input {
    /* Styling for floating inputs */
    position: fixed;
    z-index: 10001;
    width: 300px;
}
```

### Behaviors

#### Link Editing
1. When cursor is inside link:
   - Shows input with current URL
   - Updates existing link on confirm
2. When text is selected:
   - Shows empty input
   - Wraps selection in new link on confirm
   - Merges existing links in selection

#### Tag Changing
1. Shows input with current tag name
2. On confirm:
   - Creates new element of specified tag
   - Preserves attributes
   - Preserves content
   - Maintains selection

#### Element Movement
1. Up/Down:
   - Moves within current parent
   - Maintains selection
   - Updates overlay
2. Promote:
   - Moves to parent's level
   - Stops at body
   - Maintains selection

#### Page Saving
1. Cleanup phase:
   - Removes editor styles
   - Removes overlay
   - Disables contentEditable
2. Save phase:
   - Downloads clean HTML
3. Restore phase:
   - Restores editor state
   - Re-enables editing

### Initialization
```javascript
// Main class creates singleton instance
const femtoEdit = new FemtoEdit();

// Initialize
femtoEdit.init();
```

### Browser Integration
- Uses contentEditable for native editing
- Preserves browser's built-in line break handling
- Works with native copy/paste
- Preserves native undo/redo

### Error Handling
- Graceful fallback for positioning
- Selection recovery after operations
- DOM operation safety checks
- Clean teardown on errors

## Build Output
- Single self-contained JavaScript file
- Embedded CSS
- No external dependencies after build
- ES5 compatible output
