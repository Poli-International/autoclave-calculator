# Autoclave & Sterilization Calculator - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support / Contact](#support--contact)

---

## Architecture Overview

### Technology Stack

The tool is a **dependency-free static HTML/CSS/JavaScript application**. No frameworks, build tools, or external libraries are required.

- **HTML5** - Semantic markup with forms, sections, and collapsible panels
- **CSS3** - Custom stylesheets with dark/light mode support
- **Vanilla JavaScript (ES6+)** - All logic, data, and event handling in plain JS

### File Structure

```
autoclave-calculator/
├── index.html              # Main tool interface
├── documentation.html      # Standalone documentation page
├── embed.html              # Embed code generator page
├── css/
│   ├── poli-standard.css   # Shared Poli International styling
│   └── style.css           # Tool-specific styles
└── js/
    ├── calculator.js       # Core logic, databases, event handlers
    └── common.js           # Theme toggling, iframe resizing, embed modal
```

### Component / Logic Breakdown

The tool consists of four main interactive components:

1. **Sterilization Cycle Calculator** - Calculates temperature, pressure, and time based on autoclave type, load type, load size, instrument material, and wrapping status
2. **Spore Test Schedule Tracker** - Tracks biological indicator test dates and calculates next due date based on state/region requirements
3. **Load Optimization Calculator** - Computes chamber volume and instrument density from user-provided dimensions
4. **Sterilization Troubleshooter** - Provides step-by-step diagnostic guidance for common autoclave problems

---

## Data Schemas

All data is defined as JavaScript constants in `calculator.js`.

### AUTOCLAVE_DATABASE

```javascript
const AUTOCLAVE_DATABASE = {
    gravity: {
        name: 'Gravity Displacement (Type N)',
        wrapped: {
            temperature: { f: 250, c: 121 },
            pressure: { psi: 15, bar: 1.0 },
            exposureTime: 30,    // minutes
            dryTime: 15,         // minutes
            totalCycle: 60       // minutes
        },
        unwrapped: {
            temperature: { f: 250, c: 121 },
            pressure: { psi: 15, bar: 1.0 },
            exposureTime: 15,
            dryTime: 0,
            totalCycle: 30
        },
        hollow: null,            // Not suitable
        textiles: {
            temperature: { f: 250, c: 121 },
            pressure: { psi: 15, bar: 1.0 },
            exposureTime: 45,
            dryTime: 20,
            totalCycle: 80
        },
        glass: {
            temperature: { f: 250, c: 121 },
            pressure: { psi: 15, bar: 1.0 },
            exposureTime: 30,
            dryTime: 15,
            totalCycle: 60
        },
        liquids: null            // Not suitable
    },
    prevacuum: {
        name: 'Pre-Vacuum (Type B)',
        wrapped: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 27, bar: 1.9 },
            exposureTime: 4,
            dryTime: 20,
            totalCycle: 35
        },
        // ... (unwrapped, hollow, textiles, glass, liquids)
    },
    chemical: {
        name: 'Chemical Vapor (Chemiclave)',
        wrapped: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 20, bar: 1.4 },
            exposureTime: 20,
            dryTime: 0,
            totalCycle: 35
        },
        // ... (unwrapped only; others null)
    }
};
```

**Keys:** `gravity`, `prevacuum`, `chemical`  
**Load types per autoclave:** `wrapped`, `unwrapped`, `hollow`, `textiles`, `glass`, `liquids`  
**Null values** indicate invalid combinations.

### STATE_REQUIREMENTS

```javascript
const STATE_REQUIREMENTS = {
    AL: { name: 'Alabama', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    CA: { name: 'California', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required by law' },
    TX: { name: 'Texas', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required by law' },
    UK: { name: 'United Kingdom', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    OTHER: { name: 'Other', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local regulations)' },
    // ... all 50 US states, DC, 18 European countries, Canada
};
```

**Keys:** Two-letter state/country codes (e.g., `AL`, `CA`, `UK`, `DE`)  
**All entries** default to `frequency: 'weekly'` and `days: 7`.

### MATERIAL_COMPATIBILITY

```javascript
const MATERIAL_COMPATIBILITY = {
    'stainless-steel': {
        name: 'Stainless Steel',
        gravity: true,
        prevacuum: true,
        chemical: true,
        notes: 'Safe for all autoclave types'
    },
    'titanium': {
        name: 'Titanium',
        gravity: true,
        prevacuum: true,
        chemical: true,
        notes: 'Safe for all autoclave types'
    },
    'anodized': {
        name: 'Anodized Aluminum',
        gravity: false,
        prevacuum: false,
        chemical: false,
        notes: 'NOT SAFE - Anodization will be damaged'
    },
    // ... 8 material types total
};
```

### TROUBLESHOOTING_DATABASE

```javascript
const TROUBLESHOOTING_DATABASE = {
    'wet-instruments': {
        title: 'Instruments Coming Out Wet',
        steps: [
            'Check that you\'re using the correct wrapped vs. unwrapped cycle',
            'Ensure adequate drying time is programmed (20-30 minutes for wrapped)',
            // ... 8 steps total
        ]
    },
    'failed-spore': {
        title: '🚨 FAILED SPORE TEST - CRITICAL',
        steps: [
            '⚠️ STOP: Do not use autoclave until resolved',
            // ... 10 steps total
        ]
    },
    'slow-cycle': { /* ... 10 steps */ },
    'temperature-issues': { /* ... 9 steps */ },
    'pressure-problems': { /* ... 9 steps */ },
    'package-integrity': { /* ... 9 steps */ }
};
```

### AppState

```javascript
const AppState = {
    theme: 'light',
    lastCalculation: null,   // Stores last calculator result object
    lastSporeTest: null      // Stores last spore test result object
};
```

---

## Calculation / Logic Algorithms

### Sterilization Cycle Calculation

**Function:** `handleCalculatorSubmit(event)`

**Algorithm:**

1. Read form values: `autoclaveType`, `loadType`, `loadSize`
2. Validate all three fields are non-empty
3. Look up parameters from `AUTOCLAVE_DATABASE[autoclaveType][loadType]`
4. If parameters are `null`, call `showInvalidCombination()` and return
5. Otherwise, call `adjustForLoadSize(parameters, loadSize)` to apply multipliers
6. Call `displayCalculatorResults()` to render output
7. Save calculation to `AppState.lastCalculation`

**Load Size Adjustment Formula:**

```javascript
const sizeMultipliers = {
    small:  1.0,   // 25% capacity
    medium: 1.2,   // 50% capacity
    large:  1.5,   // 75% capacity
    full:   1.8    // 100% capacity (not recommended)
};

adjustedExposureTime = Math.ceil(baseExposureTime * multiplier);
adjustedTotalCycle   = Math.ceil(baseTotalCycle * multiplier);
```

### Spore Test Schedule Calculation

**Function:** `handleSporeTestSubmit(event)`

**Algorithm:**

1. Read `lastTestDate` (date string) and `stateCode` (two-letter code)
2. Validate both fields are non-empty
3. Look up state requirements from `STATE_REQUIREMENTS[stateCode]`
4. Parse `lastTestDate` into a `Date` object
5. Calculate `nextTestDate` by adding `state.days` (always 7) to `lastTestDate`
6. Calculate `daysUntilDue` as the difference between `nextTestDate` and today
7. Display results including state name, frequency, last test date, next due date, and days remaining

### Load Optimization Calculation

**Function:** `handleLoadOptimizationSubmit(event)`

**Algorithm:**

1. Read chamber dimensions: `width`, `depth`, `height` (with unit selection)
2. Read `numInstruments`
3. Convert all dimensions to inches (if in mm or cm)
4. Calculate chamber volume: `width * depth * height` (cubic inches)
5. Calculate instruments per cubic inch: `numInstruments / volume`
6. Display volume and density results

### Troubleshooter Logic

**Function:** `attachTroubleshooterListeners()`

**Algorithm:**

1. Query all buttons with `data-issue` attribute
2. On click, look up the issue key in `TROUBLESHOOTING_DATABASE`
3. Display the `title` and iterate over `steps` array to render ordered list

---

## API Reference

All functions are defined in `calculator.js` and `common.js`. No external API endpoints are called.

### Public Functions

#### `initializeApp()`
- **Description:** Sets max date on spore test date picker to today
- **Returns:** `void`

#### `handleCalculatorSubmit(event)`
- **Parameters:** `event` (Form submit event)
- **Description:** Main sterilization calculation entry point
- **Returns:** `void`

#### `adjustForLoadSize(baseParams, loadSize)`
- **Parameters:**
  - `baseParams` (object) - Parameters from `AUTOCLAVE_DATABASE`
  - `loadSize` (string) - `'small'`, `'medium'`, `'large'`, or `'full'`
- **Returns:** Object with adjusted `exposureTime` and `totalCycle`

#### `displayCalculatorResults(autoclaveType, loadType, params)`
- **Parameters:**
  - `autoclaveType` (string) - Autoclave database key
  - `loadType` (string) - Load type key
  - `params` (object) - Adjusted parameters object
- **Returns:** `void`

#### `showInvalidCombination(autoclaveType, loadType)`
- **Parameters:**
  - `autoclaveType` (string) - Autoclave database key
  - `loadType` (string) - Load type key
- **Returns:** `void`

#### `handleSporeTestSubmit(event)`
- **Parameters:** `event` (Form submit event)
- **Description:** Spore test schedule calculation entry point
- **Returns:** `void`

#### `handleLoadOptimizationSubmit(event)`
- **Parameters:** `event` (Form submit event)
- **Description:** Load optimization calculation entry point
- **Returns:** `void`

#### `attachCollapsibleListeners()`
- **Description:** Binds click handlers to all collapsible section triggers
- **Returns:** `void`

#### `attachTroubleshooterListeners()`
- **Description:** Binds click handlers to all troubleshooting buttons
- **Returns:** `void`

#### `attachTabListeners()`
- **Description:** Binds click handlers to tool/docs/embed tab buttons
- **Returns:** `void`

#### `toggleDarkMode()`
- **Description:** Toggles between dark and light mode, saves preference to localStorage
- **Returns:** `void`

#### `sendHeight()`
- **Description:** Sends current document height to parent iframe via `postMessage`
- **Returns:** `void`

#### `printCycleLog()`
- **Description:** Opens browser print dialog for sterilization cycle results
- **Returns:** `void`

#### `saveToRecords()`
- **Description:** Placeholder function for saving results (currently logs to console)
- **Returns:** `void`

#### `printTestSchedule()`
- **Description:** Opens browser print dialog for spore test schedule
- **Returns:** `void`

#### `downloadLogTemplate()`
- **Description:** Placeholder function for downloading log template
- **Returns:** `void`

---

## Integration Guide

### Standalone Embedding via iframe

The tool is fully self-contained and can be embedded on any website using an iframe:

```html
<iframe
  src="https://poliinternational.com/tools/autoclave-calculator/index.html"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;"
  title="Autoclave Calculator by Poli International">
</iframe>
```

### Available Embed Sizes

| Version | Height | Use Case |
|---------|--------|----------|
| Standard | 800px | Recommended for most layouts |
| Large | 1000px | Dedicated tool pages |
| Compact | 600px | Space-constrained layouts |

### iframe Communication

The tool sends its height to the parent window via `postMessage`:

```javascript
window.parent.postMessage({ height: document.body.scrollHeight + 50 }, '*');
```

The tool also listens for theme messages:

```javascript
window.addEventListener('message', function(event) {
    if (event.data && event.data.theme) {
        setTheme(event.data.theme, true);
    }
});
```

### Dependency-Free

The tool requires **zero external dependencies**. No CDN links, no JavaScript frameworks, no API keys. It works entirely offline once the HTML/CSS/JS files are served.

---

## Customization

### Theme Support

The tool supports dark and light modes. Theme preference is stored in `localStorage` under the key `'theme'`.

To set the theme from a parent page, send a postMessage:

```javascript
// Set dark mode
document.querySelector('iframe').contentWindow.postMessage({ theme: 'dark' }, '*');

// Set light mode
document.querySelector('iframe').contentWindow.postMessage({ theme: 'light' }, '*');
```

### CSS Customization

The tool uses two stylesheets:

- `poli-standard.css` - Shared Poli International brand styling
- `style.css` - Tool-specific styles

All classes use the `autoclave__` prefix (BEM-like naming convention). Override styles by targeting these classes in your parent page's CSS.

---

## Performance

- **Zero network requests** after initial page load (no external fonts, libraries, or analytics)
- **Minimal DOM manipulation** - Results are shown/hidden, not created/destroyed
- **No animations or transitions** that could cause layout thrashing
- **Static data** - All databases are hardcoded JavaScript objects, no API calls
- **File size:** Approximately 50KB total (HTML + CSS + JS)

---

## Browser Compatibility

Based on the embed documentation and code analysis:

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| iOS Safari | 14+ |
| Android Chrome | 90+ |

The tool uses:
- `const` and `let` (ES6)
- Arrow functions (ES6)
- Template literals (ES6)
- `fetch` is not used
- `localStorage` for theme persistence
- `postMessage` for iframe communication
- `MutationObserver` for dynamic height resizing

---

## Security

### Input Handling

- All user inputs are read from form fields and used only for client-side calculations
- No user input is sent to any server or external service
- No user input is rendered as HTML (all output is set via `textContent` or controlled `innerHTML` with hardcoded strings)
- Form validation occurs before any calculation runs

### XSS Prevention

- User-supplied values are never inserted into the DOM as HTML
- All dynamic content uses `textContent` or `innerHTML` with pre-defined template strings
- No `eval()`, `document.write()`, or `innerHTML` with user input

### iframe Security

- The tool sets `X-Frame-Options` is not explicitly set (allows embedding)
- No cross-origin requests are made
- No cookies are set by the tool
- Camera/microphone access is not requested

### Data Privacy

- All calculations happen entirely client-side
- No data is transmitted, stored, or logged externally
- Theme preference is stored only in `localStorage` (browser-only, not accessible to servers)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-01 | Initial release |

---

## Support / Contact

For technical support, integration assistance, or bug reports:

- **Email:** support@poliinternational.com
- **Website:** https://poliinternational.com
- **Documentation:** https://poliinternational.com/autoclave-calculator-documentation/
- **Ko-fi:** https://ko-fi.com/patrickkofi
