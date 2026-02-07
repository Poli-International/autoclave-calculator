/* ============================================
   AUTOCLAVE STERILIZATION CALCULATOR
   JavaScript Logic & Database Engine
   Poli International Widget Suite - Tool 4
   ============================================ */

'use strict';

/* ============================================
   DATABASE: AUTOCLAVE SPECIFICATIONS
   Based on CDC, FDA & Manufacturer Standards
   ============================================ */

const AUTOCLAVE_DATABASE = {
    gravity: {
        name: 'Gravity Displacement (Type N)',
        wrapped: {
            temperature: { f: 250, c: 121 },
            pressure: { psi: 15, bar: 1.0 },
            exposureTime: 30,
            dryTime: 15,
            totalCycle: 60
        },
        unwrapped: {
            temperature: { f: 250, c: 121 },
            pressure: { psi: 15, bar: 1.0 },
            exposureTime: 15,
            dryTime: 0,
            totalCycle: 30
        },
        hollow: null, // Not suitable
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
        liquids: null // Not suitable
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
        unwrapped: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 27, bar: 1.9 },
            exposureTime: 3,
            dryTime: 0,
            totalCycle: 15
        },
        hollow: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 27, bar: 1.9 },
            exposureTime: 10,
            dryTime: 30,
            totalCycle: 50
        },
        textiles: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 27, bar: 1.9 },
            exposureTime: 8,
            dryTime: 25,
            totalCycle: 45
        },
        glass: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 27, bar: 1.9 },
            exposureTime: 4,
            dryTime: 20,
            totalCycle: 35
        },
        liquids: null // Not suitable
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
        unwrapped: {
            temperature: { f: 270, c: 132 },
            pressure: { psi: 20, bar: 1.4 },
            exposureTime: 10,
            dryTime: 0,
            totalCycle: 25
        },
        hollow: null, // Not recommended
        textiles: null, // Not suitable
        glass: null, // Not suitable
        liquids: null // Not suitable
    }
};

/* ============================================
   DATABASE: 50-STATE SPORE TEST REQUIREMENTS
   Legal Requirements by State
   ============================================ */

const STATE_REQUIREMENTS = {
    AL: { name: 'Alabama', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    AK: { name: 'Alaska', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    AZ: { name: 'Arizona', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    AR: { name: 'Arkansas', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    CA: { name: 'California', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required by law' },
    CO: { name: 'Colorado', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    CT: { name: 'Connecticut', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    DE: { name: 'Delaware', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    FL: { name: 'Florida', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required by statute' },
    GA: { name: 'Georgia', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    HI: { name: 'Hawaii', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    ID: { name: 'Idaho', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    IL: { name: 'Illinois', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    IN: { name: 'Indiana', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    IA: { name: 'Iowa', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    KS: { name: 'Kansas', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    KY: { name: 'Kentucky', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    LA: { name: 'Louisiana', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    ME: { name: 'Maine', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MD: { name: 'Maryland', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MA: { name: 'Massachusetts', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MI: { name: 'Michigan', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MN: { name: 'Minnesota', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MS: { name: 'Mississippi', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MO: { name: 'Missouri', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    MT: { name: 'Montana', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    NE: { name: 'Nebraska', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    NV: { name: 'Nevada', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    NH: { name: 'New Hampshire', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    NJ: { name: 'New Jersey', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    NM: { name: 'New Mexico', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    NY: { name: 'New York', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required by law' },
    NC: { name: 'North Carolina', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    ND: { name: 'North Dakota', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    OH: { name: 'Ohio', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    OK: { name: 'Oklahoma', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    OR: { name: 'Oregon', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    PA: { name: 'Pennsylvania', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    RI: { name: 'Rhode Island', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    SC: { name: 'South Carolina', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    SD: { name: 'South Dakota', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    TN: { name: 'Tennessee', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    TX: { name: 'Texas', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required by law' },
    UT: { name: 'Utah', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    VT: { name: 'Vermont', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    VA: { name: 'Virginia', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    WA: { name: 'Washington', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    WV: { name: 'West Virginia', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    WI: { name: 'Wisconsin', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },
    WY: { name: 'Wyoming', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended' },
    DC: { name: 'District of Columbia', frequency: 'weekly', days: 7, notes: 'Weekly spore testing required' },

    // Europe
    UK: { name: 'United Kingdom', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    FR: { name: 'France', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    DE: { name: 'Germany', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    IT: { name: 'Italy', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    ES: { name: 'Spain', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    NL: { name: 'Netherlands', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    BE: { name: 'Belgium', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    CH: { name: 'Switzerland', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    AT: { name: 'Austria', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    SE: { name: 'Sweden', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    NO: { name: 'Norway', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    DK: { name: 'Denmark', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    FI: { name: 'Finland', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    PL: { name: 'Poland', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    IE: { name: 'Ireland', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    PT: { name: 'Portugal', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    GR: { name: 'Greece', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },
    CZ: { name: 'Czech Republic', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local health regulations)' },

    // Canada & Other
    CA: { name: 'Canada', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check provincial regulations)' },
    OTHER: { name: 'Other', frequency: 'weekly', days: 7, notes: 'Weekly spore testing recommended (check local regulations)' }
};

/* ============================================
   DATABASE: MATERIAL COMPATIBILITY
   Safe Sterilization Methods by Material
   ============================================ */

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
    'niobium': {
        name: 'Niobium',
        gravity: true,
        prevacuum: true,
        chemical: false,
        notes: 'Avoid chemical vapor - use steam only'
    },
    'implant-grade': {
        name: 'Implant Grade (ASTM F136)',
        gravity: true,
        prevacuum: true,
        chemical: true,
        notes: 'Safe for all methods, pre-vacuum recommended'
    },
    'glass': {
        name: 'Glass',
        gravity: true,
        prevacuum: true,
        chemical: false,
        notes: 'Steam only - no chemical vapor'
    },
    'plastic-peek': {
        name: 'Plastic (PEEK)',
        gravity: true,
        prevacuum: true,
        chemical: false,
        notes: 'Steam only at correct temperatures'
    },
    'silicone': {
        name: 'Silicone',
        gravity: true,
        prevacuum: true,
        chemical: false,
        notes: 'Steam only'
    },
    'anodized': {
        name: 'Anodized Aluminum',
        gravity: false,
        prevacuum: false,
        chemical: false,
        notes: 'NOT SAFE - Anodization will be damaged'
    },
    'plated': {
        name: 'Plated/Coated Metals',
        gravity: false,
        prevacuum: false,
        chemical: false,
        notes: 'NOT SAFE - Plating will be damaged'
    }
};

/* ============================================
   DATABASE: TROUBLESHOOTING GUIDE
   Step-by-Step Problem Resolution
   ============================================ */

const TROUBLESHOOTING_DATABASE = {
    'wet-instruments': {
        title: 'Instruments Coming Out Wet',
        steps: [
            'Check that you\'re using the correct wrapped vs. unwrapped cycle',
            'Ensure adequate drying time is programmed (20-30 minutes for wrapped)',
            'Don\'t overload the autoclave - leave space between pouches',
            'Verify door gasket is sealing properly (check for wear/cracks)',
            'Make sure items aren\'t touching chamber walls',
            'Check that drain strainer is clean and not blocked',
            'Allow items to cool in chamber for 5-10 minutes before removing',
            'Use proper autoclave pouches (not substitute materials)'
        ]
    },
    'failed-spore': {
        title: '🚨 FAILED SPORE TEST - CRITICAL',
        steps: [
            '⚠️ STOP: Do not use autoclave until resolved',
            'Re-run spore test immediately to confirm failure',
            'If second test fails: Quarantine all items sterilized since last passing test',
            'Check autoclave reached correct temperature (use recording thermometer)',
            'Verify pressure gauge is accurate',
            'Run empty cycle and check all parameters',
            'Check that spore test was stored correctly (not expired)',
            'Contact autoclave service technician immediately',
            'Document everything for health department',
            'Do NOT return to use until subsequent spore test passes'
        ]
    },
    'slow-cycle': {
        title: 'Cycle Taking Too Long',
        steps: [
            'Check water reservoir level (if applicable)',
            'Clean chamber and door gasket - remove any debris',
            'Verify door is closing completely and sealing',
            'Check that you\'re not overloading the chamber',
            'Ensure proper spacing between items',
            'Clean or replace air filters',
            'Check drain line for clogs',
            'Verify electrical supply voltage is correct',
            'May need professional maintenance if problem persists'
        ]
    },
    'temperature-issues': {
        title: 'Not Reaching Temperature',
        steps: [
            'Verify you\'re reading temperature correctly (Fahrenheit vs. Celsius)',
            'Check that heating element is functioning',
            'Ensure adequate water supply (steam autoclaves)',
            'Verify door gasket is intact and sealing properly',
            'Check for air leaks around door',
            'Clean temperature sensor/probe',
            'Run diagnostic cycle if available',
            'Contact service technician - may need calibration',
            'Do not use until temperature issue resolved'
        ]
    },
    'pressure-problems': {
        title: 'Pressure Not Building',
        steps: [
            'Check door gasket condition - replace if cracked or worn',
            'Ensure door is fully closed and latched',
            'Verify safety valve is closed',
            'Check that chamber drain is not clogged',
            'Inspect all seals and gaskets',
            'Ensure water reservoir is filled (if applicable)',
            'Check pressure relief valve function',
            'May need professional service for pressure system',
            'Pressure gauge may need calibration'
        ]
    },
    'package-integrity': {
        title: 'Package/Pouch Issues',
        steps: [
            'Verify you\'re using autoclave-rated pouches (not regular plastic)',
            'Check that pouches are correct size (not overfilled)',
            'Ensure pouches are sealed properly with heat sealer',
            'Don\'t fold pouches - use larger size if needed',
            'Load pouches on edge (paper side down)',
            'Don\'t let pouches touch chamber walls',
            'Use correct cycle for wrapped items',
            'Check chemical indicator strips are inside pouches',
            'Store sterilized pouches in dry, clean area'
        ]
    }
};

/* ============================================
   APPLICATION STATE
   ============================================ */

const AppState = {
    theme: 'light',
    lastCalculation: null,
    lastSporeTest: null
};

/* ============================================
   INITIALIZATION
   DOM Ready Event Listener
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔬 Autoclave Calculator Initialized');

    initializeApp();
    attachEventListeners();
    loadSavedTheme();
});

/* ============================================
   INITIALIZE APPLICATION
   ============================================ */

function initializeApp() {
    // Set today's date as max for spore test date picker
    const lastTestDateInput = document.getElementById('last-test-date');
    if (lastTestDateInput) {
        const today = new Date().toISOString().split('T')[0];
        lastTestDateInput.setAttribute('max', today);
    }
}

/* ============================================
   EVENT LISTENERS
   Attach All Interactive Handlers
   ============================================ */

function attachEventListeners() {
    // Calculator Form
    const calculatorForm = document.getElementById('calculator-form');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', handleCalculatorSubmit);
    }

    // Spore Test Form
    const sporeForm = document.getElementById('spore-form');
    if (sporeForm) {
        sporeForm.addEventListener('submit', handleSporeTestSubmit);
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Embed Button & Modal
    const embedButton = document.getElementById('embed-button');
    const embedModal = document.getElementById('embed-modal');
    const modalClose = document.querySelector('.autoclave__modal-close');
    const modalOverlay = document.querySelector('.autoclave__modal-overlay');

    if (embedButton && embedModal) {
        embedButton.addEventListener('click', () => openEmbedModal());
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => closeEmbedModal());
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeEmbedModal());
    }

    // Copy Embed Code Button
    const copyButton = document.getElementById('copy-embed-code');
    if (copyButton) {
        copyButton.addEventListener('click', copyEmbedCode);
    }

    // Email Forms (Footer & Modal)
    const footerEmailForm = document.getElementById('footer-email-form');
    const modalEmailForm = document.getElementById('modal-email-form');

    if (footerEmailForm) {
        footerEmailForm.addEventListener('submit', handleEmailSubmit);
    }

    if (modalEmailForm) {
        modalEmailForm.addEventListener('submit', handleEmailSubmit);
    }

    // Collapsible Sections
    attachCollapsibleListeners();

    // Troubleshooter Buttons
    attachTroubleshooterListeners();

    // Tab Navigation
    attachTabListeners();

    // Load Optimization Form
    const optimizationForm = document.getElementById('optimization-form');
    if (optimizationForm) {
        optimizationForm.addEventListener('submit', handleLoadOptimizationSubmit);
    }

    // Material Compatibility Form
    const compatibilityForm = document.getElementById('compatibility-form');
    if (compatibilityForm) {
        compatibilityForm.addEventListener('submit', handleCompatibilitySubmit);
    }

    // Print and Download Buttons (Spore Test)
    const printButton = document.getElementById('print-schedule');
    const downloadButton = document.getElementById('download-log');

    if (printButton) {
        printButton.addEventListener('click', printTestSchedule);
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', downloadLogTemplate);
    }

    // Print and Save Buttons (Calculator Results)
    const printResultsButton = document.getElementById('print-results');
    const saveResultsButton = document.getElementById('save-results');

    if (printResultsButton) {
        printResultsButton.addEventListener('click', printCycleLog);
    }

    if (saveResultsButton) {
        saveResultsButton.addEventListener('click', saveToRecords);
    }
}

/* ============================================
   CALCULATOR: MAIN STERILIZATION CALCULATOR
   ============================================ */

function handleCalculatorSubmit(event) {
    event.preventDefault();

    // Get form values
    const autoclaveType = document.getElementById('autoclave-type').value;
    const loadType = document.getElementById('load-type').value;
    const loadSize = document.getElementById('load-size').value;

    // Validate inputs
    if (!autoclaveType || !loadType || !loadSize) {
        alert('Please fill in all required fields');
        return;
    }

    // Get parameters from database
    const parameters = AUTOCLAVE_DATABASE[autoclaveType][loadType];

    // Check if combination is valid
    if (!parameters) {
        showInvalidCombination(autoclaveType, loadType);
        // Still save to state so print/save buttons work
        AppState.lastCalculation = {
            autoclaveType,
            loadType,
            loadSize,
            parameters: null,
            invalid: true,
            timestamp: new Date()
        };
        return;
    }

    // Adjust parameters based on load size
    const adjustedParameters = adjustForLoadSize(parameters, loadSize);

    // Display results
    displayCalculatorResults(autoclaveType, loadType, adjustedParameters);

    // Save to state
    AppState.lastCalculation = {
        autoclaveType,
        loadType,
        loadSize,
        parameters: adjustedParameters,
        invalid: false,
        timestamp: new Date()
    };

    // Scroll to results
    document.getElementById('calculator-results').scrollIntoView({ behavior: 'smooth' });
}

function adjustForLoadSize(baseParams, loadSize) {
    const adjusted = { ...baseParams };

    // Adjust exposure time based on load size
    const sizeMultipliers = {
        small: 1.0,
        medium: 1.2,
        large: 1.5,
        full: 1.8
    };

    const multiplier = sizeMultipliers[loadSize] || 1.0;

    adjusted.exposureTime = Math.ceil(baseParams.exposureTime * multiplier);
    adjusted.totalCycle = Math.ceil(baseParams.totalCycle * multiplier);

    return adjusted;
}

function displayCalculatorResults(autoclaveType, loadType, params) {
    const resultsDiv = document.getElementById('calculator-results');
    const autoclaveInfo = AUTOCLAVE_DATABASE[autoclaveType];

    // Show results container
    resultsDiv.style.display = 'block';

    // Update safety badge
    const safetyBadge = document.getElementById('results-safety-badge');
    safetyBadge.className = 'autoclave__safety-badge autoclave__safety-badge--safe';
    safetyBadge.innerHTML = '✓ Safe Parameters';

    // Update temperature
    document.getElementById('result-temperature').innerHTML =
        `${params.temperature.f}°F<br><small>(${params.temperature.c}°C)</small>`;

    // Update pressure
    document.getElementById('result-pressure').innerHTML =
        `${params.pressure.psi} PSI<br><small>(${params.pressure.bar} bar)</small>`;

    // Update exposure time
    document.getElementById('result-exposure').innerHTML =
        `${params.exposureTime} min`;

    // Update total cycle
    document.getElementById('result-total').innerHTML =
        `${params.totalCycle} min`;

    // Update description
    const descDiv = document.getElementById('results-description');
    descDiv.innerHTML = `
        <p><strong>Autoclave Type:</strong> ${autoclaveInfo.name}</p>
        <p><strong>Load Type:</strong> ${formatLoadType(loadType)}</p>
        <p><strong>Instructions:</strong></p>
        <ul>
            <li>Set autoclave to ${params.temperature.f}°F (${params.temperature.c}°C)</li>
            <li>Wait for pressure to reach ${params.pressure.psi} PSI</li>
            <li>Expose for minimum ${params.exposureTime} minutes</li>
            <li>Allow ${params.dryTime} minutes drying time</li>
            <li>Total cycle time: approximately ${params.totalCycle} minutes</li>
            <li>Let items cool before handling</li>
            <li>Check chemical indicators before use</li>
        </ul>
        <p><strong>⚠️ Always follow your autoclave manufacturer's specific instructions.</strong></p>
    `;
}

function showInvalidCombination(autoclaveType, loadType) {
    const resultsDiv = document.getElementById('calculator-results');
    resultsDiv.style.display = 'block';

    const safetyBadge = document.getElementById('results-safety-badge');
    safetyBadge.className = 'autoclave__safety-badge autoclave__safety-badge--danger';
    safetyBadge.innerHTML = '⚠️ Invalid Combination';

    document.getElementById('result-temperature').innerHTML = 'N/A';
    document.getElementById('result-pressure').innerHTML = 'N/A';
    document.getElementById('result-exposure').innerHTML = 'N/A';
    document.getElementById('result-cycle').innerHTML = 'N/A';

    const descDiv = document.getElementById('results-description');
    const autoclaveInfo = AUTOCLAVE_DATABASE[autoclaveType];

    descDiv.innerHTML = `
        <p><strong>⚠️ This combination is not recommended or safe:</strong></p>
        <p><strong>Autoclave Type:</strong> ${autoclaveInfo.name}</p>
        <p><strong>Load Type:</strong> ${formatLoadType(loadType)}</p>
        <p><strong>Why this doesn't work:</strong></p>
        ${getInvalidCombinationReason(autoclaveType, loadType)}
        <p><strong>Recommended alternative:</strong></p>
        ${getAlternativeRecommendation(loadType)}
    `;

    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function getInvalidCombinationReason(autoclaveType, loadType) {
    if (autoclaveType === 'gravity' && loadType === 'hollow') {
        return '<p>Gravity displacement autoclaves cannot effectively remove air from hollow instruments. Air pockets prevent proper steam penetration and sterilization.</p>';
    }
    if (autoclaveType === 'gravity' && loadType === 'liquids') {
        return '<p>Liquids require specialized autoclave cycles and temperature controls not available in standard gravity autoclaves.</p>';
    }
    if (autoclaveType === 'chemical' && (loadType === 'hollow' || loadType === 'textiles' || loadType === 'glass' || loadType === 'liquids')) {
        return '<p>Chemical vapor sterilization is designed for solid, non-porous instruments only. It cannot penetrate textiles, hollow items, or glass effectively.</p>';
    }
    if (autoclaveType === 'prevacuum' && loadType === 'liquids') {
        return '<p>Pre-vacuum cycles create a vacuum that can cause liquids to boil or containers to rupture. Use a gravity/liquid cycle instead.</p>';
    }
    return '<p>This combination is not recommended by CDC/FDA guidelines.</p>';
}

function getAlternativeRecommendation(loadType) {
    if (loadType === 'hollow') {
        return '<p>Use a <strong>Pre-Vacuum (Type B)</strong> autoclave, which actively removes air from hollow instruments.</p>';
    }
    if (loadType === 'liquids') {
        return '<p>Use a specialized <strong>liquid cycle</strong> or a gravity autoclave with proper liquid containers.</p>';
    }
    if (loadType === 'textiles') {
        return '<p>Use either <strong>Gravity Displacement</strong> or <strong>Pre-Vacuum</strong> autoclave with extended dry time.</p>';
    }
    return '<p>Consult your autoclave manual or a sterilization specialist.</p>';
}

function formatLoadType(loadType) {
    const types = {
        wrapped: 'Wrapped Instruments (pouched)',
        unwrapped: 'Unwrapped Instruments (flash)',
        hollow: 'Hollow Instruments',
        textiles: 'Textiles (towels, drapes)',
        glass: 'Glass Items',
        liquids: 'Liquids'
    };
    return types[loadType] || loadType;
}

/* ============================================
   SPORE TEST TRACKER
   ============================================ */

function handleSporeTestSubmit(event) {
    event.preventDefault();

    const lastTestDate = document.getElementById('last-test-date').value;
    const stateCode = document.getElementById('state-select').value;

    if (!lastTestDate || !stateCode) {
        alert('Please fill in all fields');
        return;
    }

    const state = STATE_REQUIREMENTS[stateCode];
    const lastTest = new Date(lastTestDate);
    const today = new Date();
    const nextTestDate = new Date(lastTest);
    nextTestDate.setDate(nextTestDate.getDate() + state.days);

    const daysUntilDue = Math.ceil((nextTestDate - today) / (1000 * 60 * 60 * 24));
    const daysSinceTest = Math.ceil((today - lastTest) / (1000 * 60 * 60 * 24));

    // Determine status
    let status = 'current';
    let statusText = '✓ Current';
    let statusClass = 'autoclave__spore-status-badge--current';

    if (daysUntilDue < 0) {
        status = 'overdue';
        statusText = '⚠️ OVERDUE';
        statusClass = 'autoclave__spore-status-badge--overdue';
    } else if (daysUntilDue <= 2) {
        status = 'due-soon';
        statusText = '⚠ Due Soon';
        statusClass = 'autoclave__spore-status-badge--due-soon';
    }

    // Display results
    displaySporeTestResults(state, lastTest, nextTestDate, daysUntilDue, daysSinceTest, status, statusText, statusClass);

    // Save to state
    AppState.lastSporeTest = {
        lastTestDate,
        stateCode,
        nextTestDate,
        status,
        timestamp: new Date()
    };

    // Scroll to results
    document.getElementById('spore-results').scrollIntoView({ behavior: 'smooth' });
}

function displaySporeTestResults(state, lastTest, nextTest, daysUntil, daysSince, status, statusText, statusClass) {
    const resultsDiv = document.getElementById('spore-results');
    resultsDiv.style.display = 'block';

    // Update header
    document.querySelector('#spore-results .autoclave__spore-results-title').textContent = 'Spore Test Schedule';

    const statusBadge = document.getElementById('spore-status-badge');
    statusBadge.className = `autoclave__spore-status-badge ${statusClass}`;
    statusBadge.textContent = statusText;

    // Update info grid
    document.getElementById('spore-state-name').textContent = state.name;
    document.getElementById('spore-frequency').textContent = state.frequency.toUpperCase();
    document.getElementById('spore-last-test').textContent = formatDate(lastTest);
    document.getElementById('spore-next-test').textContent = formatDate(nextTest);
    document.getElementById('spore-days-until').textContent = daysUntil > 0 ? `${daysUntil} days` : 'OVERDUE';

    // Update instructions
    const instructionsDiv = document.getElementById('spore-instructions');

    if (status === 'overdue') {
        instructionsDiv.innerHTML = `
            <p><strong>⚠️ YOUR SPORE TEST IS OVERDUE!</strong></p>
            <p>You are ${Math.abs(daysUntil)} days past your required testing date.</p>
            <p><strong>Action Required:</strong></p>
            <ul>
                <li>Run a biological indicator (spore test) IMMEDIATELY</li>
                <li>Document the test date and results</li>
                <li>Contact your health department if required by your state</li>
                <li>Review your spore test calendar/reminder system</li>
            </ul>
            <p><strong>State Requirement:</strong> ${state.notes}</p>
        `;
    } else if (status === 'due-soon') {
        instructionsDiv.innerHTML = `
            <p><strong>⚠ Spore test due in ${daysUntil} days</strong></p>
            <p><strong>Action Required:</strong></p>
            <ul>
                <li>Schedule your next spore test for ${formatDate(nextTest)}</li>
                <li>Ensure you have biological indicators in stock</li>
                <li>Have your spore test log ready to document results</li>
            </ul>
            <p><strong>State Requirement:</strong> ${state.notes}</p>
        `;
    } else {
        instructionsDiv.innerHTML = `
            <p><strong>✓ You are current on spore testing</strong></p>
            <p>Your next spore test is due on ${formatDate(nextTest)} (in ${daysUntil} days).</p>
            <p><strong>Reminder:</strong></p>
            <ul>
                <li>Mark your calendar for ${formatDate(nextTest)}</li>
                <li>Keep biological indicators in stock</li>
                <li>Document all test results in your spore test log</li>
                <li>Failed test = STOP using autoclave immediately</li>
            </ul>
            <p><strong>State Requirement:</strong> ${state.notes}</p>
        `;
    }
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/* ============================================
   COLLAPSIBLE SECTIONS
   ============================================ */

function attachCollapsibleListeners() {
    const triggers = document.querySelectorAll('.autoclave__collapsible-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const targetId = this.getAttribute('aria-controls');
            const content = document.getElementById(targetId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle expanded state
            this.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
        });
    });
}

/* ============================================
   TROUBLESHOOTER
   ============================================ */

function attachTroubleshooterListeners() {
    const buttons = document.querySelectorAll('.autoclave__troubleshooter-button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const issue = this.getAttribute('data-issue');
            displayTroubleshootingSteps(issue);
        });
    });
}

function displayTroubleshootingSteps(issue) {
    const resultsDiv = document.getElementById('troubleshooter-results');
    const guide = TROUBLESHOOTING_DATABASE[issue];

    if (!guide) {
        console.error('Troubleshooting guide not found for issue:', issue);
        return;
    }

    // Build the complete HTML structure
    const stepsHTML = guide.steps.map(step =>
        `<li class="autoclave__troubleshooter-step">${step}</li>`
    ).join('');

    resultsDiv.innerHTML = `
        <h3 class="autoclave__troubleshooter-title">${guide.title}</h3>
        <ul class="autoclave__troubleshooter-steps">
            ${stepsHTML}
        </ul>
    `;

    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

/* ============================================
   TAB NAVIGATION (Quick Reference)
   ============================================ */

function attachTabListeners() {
    const tabButtons = document.querySelectorAll('.autoclave__tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Hide all tab contents
            const tabContents = document.querySelectorAll('.autoclave__tab-content');
            tabContents.forEach(content => content.classList.remove('active'));

            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Populate reference content on first load
    populateReferenceContent();
}

/* ============================================
   POPULATE REFERENCE GUIDE CONTENT
   ============================================ */

function populateReferenceContent() {
    // Populate Autoclave Types tab
    const autoclaveTypesDiv = document.getElementById('reference-autoclave-types');
    if (autoclaveTypesDiv && autoclaveTypesDiv.children.length === 0) {
        autoclaveTypesDiv.innerHTML = `
            <div class="autoclave__reference-card">
                <h4>Gravity Displacement (Type N)</h4>
                <p><strong>How it works:</strong> Steam enters at the top, pushing air out through a drain at the bottom.</p>
                <p><strong>Best for:</strong> Solid instruments, wrapped items, textiles</p>
                <p><strong>Not for:</strong> Hollow instruments, liquids</p>
                <p><strong>Examples:</strong> Ritter M9, Midmark M9</p>
            </div>
            <div class="autoclave__reference-card">
                <h4>Pre-Vacuum (Type B)</h4>
                <p><strong>How it works:</strong> Vacuum pump removes air before steam enters, allowing deeper penetration.</p>
                <p><strong>Best for:</strong> All instrument types, hollow instruments, porous items</p>
                <p><strong>Not for:</strong> Liquids</p>
                <p><strong>Examples:</strong> Midmark M11, Tuttnauer EZ series</p>
            </div>
            <div class="autoclave__reference-card">
                <h4>Chemical Vapor (Chemiclave)</h4>
                <p><strong>How it works:</strong> Uses chemical vapor instead of steam at lower pressure.</p>
                <p><strong>Best for:</strong> Carbon steel instruments, solid items</p>
                <p><strong>Not for:</strong> Hollow items, textiles, glass, plastics</p>
                <p><strong>Examples:</strong> Harvey Chemiclave</p>
            </div>
        `;
    }

    // Populate Temperatures tab
    const temperaturesDiv = document.getElementById('reference-temperatures');
    if (temperaturesDiv && temperaturesDiv.children.length === 0) {
        temperaturesDiv.innerHTML = `
            <table class="autoclave__reference-table">
                <thead>
                    <tr>
                        <th>Autoclave Type</th>
                        <th>Temperature</th>
                        <th>Pressure</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Gravity Displacement</td>
                        <td>250°F (121°C)</td>
                        <td>15 PSI (1.0 bar)</td>
                        <td>Standard steam sterilization</td>
                    </tr>
                    <tr>
                        <td>Pre-Vacuum</td>
                        <td>270°F (132°C)</td>
                        <td>27 PSI (1.9 bar)</td>
                        <td>Higher temp for faster cycles</td>
                    </tr>
                    <tr>
                        <td>Chemical Vapor</td>
                        <td>270°F (132°C)</td>
                        <td>20 PSI (1.4 bar)</td>
                        <td>Formaldehyde/alcohol vapor</td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    // Populate Cycle Times tab
    const cycleTimesDiv = document.getElementById('reference-cycle-times');
    if (cycleTimesDiv && cycleTimesDiv.children.length === 0) {
        cycleTimesDiv.innerHTML = `
            <table class="autoclave__reference-table">
                <thead>
                    <tr>
                        <th>Load Type</th>
                        <th>Gravity (250°F)</th>
                        <th>Pre-Vacuum (270°F)</th>
                        <th>Chemical Vapor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Wrapped Instruments</strong></td>
                        <td>30 min exposure<br>15 min dry</td>
                        <td>4 min exposure<br>20 min dry</td>
                        <td>20 min exposure<br>No dry</td>
                    </tr>
                    <tr>
                        <td><strong>Unwrapped (Flash)</strong></td>
                        <td>15 min exposure<br>No dry</td>
                        <td>3 min exposure<br>No dry</td>
                        <td>10 min exposure<br>No dry</td>
                    </tr>
                    <tr>
                        <td><strong>Hollow Instruments</strong></td>
                        <td>Not suitable</td>
                        <td>10 min exposure<br>30 min dry</td>
                        <td>Not suitable</td>
                    </tr>
                    <tr>
                        <td><strong>Textiles</strong></td>
                        <td>45 min exposure<br>20 min dry</td>
                        <td>8 min exposure<br>25 min dry</td>
                        <td>Not suitable</td>
                    </tr>
                </tbody>
            </table>
            <p class="autoclave__reference-note"><strong>Note:</strong> Times shown are minimum exposure times. Total cycle time includes heat-up and cool-down periods.</p>
        `;
    }

    // Populate Maintenance tab
    const maintenanceDiv = document.getElementById('reference-maintenance');
    if (maintenanceDiv && maintenanceDiv.children.length === 0) {
        maintenanceDiv.innerHTML = `
            <div class="autoclave__maintenance-checklist">
                <h4>Daily</h4>
                <ul class="autoclave__tips-list">
                    <li>Check door gasket for damage or wear</li>
                    <li>Wipe down chamber interior</li>
                    <li>Check water level (if applicable)</li>
                    <li>Inspect chemical indicators before use</li>
                </ul>

                <h4>Weekly</h4>
                <ul class="autoclave__tips-list">
                    <li>✓ Run biological indicator (spore) test</li>
                    <li>Clean chamber and trays thoroughly</li>
                    <li>Check drain strainer</li>
                    <li>Inspect door seal and safety valves</li>
                </ul>

                <h4>Monthly</h4>
                <ul class="autoclave__tips-list">
                    <li>Deep clean chamber with descaling solution</li>
                    <li>Clean water reservoir (if applicable)</li>
                    <li>Check pressure relief valve function</li>
                    <li>Review spore test log for patterns</li>
                </ul>

                <h4>Annually</h4>
                <ul class="autoclave__tips-list">
                    <li>Professional calibration and service</li>
                    <li>Replace door gasket</li>
                    <li>Test all safety systems</li>
                    <li>Update maintenance log</li>
                </ul>
            </div>
        `;
    }
}

/* ============================================
   DARK MODE
   ============================================ */

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    AppState.theme = newTheme;

    // Save to localStorage
    localStorage.setItem('autoclave-calculator-theme', newTheme);

    // Update icon
    const icon = document.querySelector('.autoclave__dark-mode-icon');
    if (icon) {
        icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('autoclave-calculator-theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        AppState.theme = savedTheme;

        const icon = document.querySelector('.autoclave__dark-mode-icon');
        if (icon) {
            icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
        }
    }
}

/* ============================================
   EMBED MODAL
   ============================================ */

function openEmbedModal() {
    const modal = document.getElementById('embed-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeEmbedModal() {
    const modal = document.getElementById('embed-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function copyEmbedCode() {
    const codeElement = document.getElementById('embed-code');
    const button = document.getElementById('copy-embed-code');

    if (codeElement && button) {
        const code = codeElement.textContent;

        navigator.clipboard.writeText(code).then(() => {
            // Success feedback
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="autoclave__copy-icon">✓</span><span class="autoclave__copy-text">Copied!</span>';
            button.classList.add('autoclave__copy-button--success');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('autoclave__copy-button--success');
            }, 2000);
        }).catch(err => {
            alert('Failed to copy code. Please copy manually.');
        });
    }
}

/* ============================================
   EMAIL FORM HANDLING
   ============================================ */

function handleEmailSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const location = form.getAttribute('data-location');
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!emailInput || !emailInput.value) {
        alert('Please enter a valid email address');
        return;
    }

    const email = emailInput.value;

    // Disable button and show loading state
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        console.log(`Email submitted from ${location}:`, email);

        // Success feedback
        submitButton.textContent = '✓ Subscribed!';
        emailInput.value = '';

        // Reset after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 2000);

        // Show thank you message
        alert('Thank you for subscribing! You\'ll be notified when we launch new tools.');
    }, 1000);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ============================================
   UNIT CONVERSION UTILITIES
   ============================================ */

const UnitConverter = {
    // Convert any unit to inches (base unit)
    toInches: function(value, unit) {
        switch (unit) {
            case 'inches':
                return value;
            case 'mm':
                return value / 25.4;
            case 'cm':
                return value / 2.54;
            default:
                return value;
        }
    },

    // Convert inches to any unit
    fromInches: function(inches, unit) {
        switch (unit) {
            case 'inches':
                return inches;
            case 'mm':
                return inches * 25.4;
            case 'cm':
                return inches * 2.54;
            default:
                return inches;
        }
    },

    // Format value with unit label
    formatWithUnit: function(value, unit) {
        const rounded = Math.round(value * 100) / 100;
        const unitLabel = unit === 'mm' ? 'mm' : (unit === 'cm' ? 'cm' : 'in');
        return `${rounded} ${unitLabel}`;
    }
};

/* ============================================
   LOAD OPTIMIZATION CALCULATOR
   ============================================ */

function handleLoadOptimizationSubmit(event) {
    event.preventDefault();

    // Get form values
    const widthValue = parseFloat(document.getElementById('chamber-width').value);
    const depthValue = parseFloat(document.getElementById('chamber-depth').value);
    const heightValue = parseFloat(document.getElementById('chamber-height').value);
    const numInstruments = parseInt(document.getElementById('num-instruments').value);

    // Get selected units
    const widthUnit = document.getElementById('chamber-width-unit').value;
    const depthUnit = document.getElementById('chamber-depth-unit').value;
    const heightUnit = document.getElementById('chamber-height-unit').value;

    // Validate inputs
    if (!widthValue || !depthValue || !heightValue || !numInstruments) {
        alert('Please fill in all required fields');
        return;
    }

    // Convert all measurements to inches (standard unit)
    const widthInches = UnitConverter.toInches(widthValue, widthUnit);
    const depthInches = UnitConverter.toInches(depthValue, depthUnit);
    const heightInches = UnitConverter.toInches(heightValue, heightUnit);

    // Calculate chamber volume and capacity
    const volumeCubicInches = widthInches * depthInches * heightInches;
    const volumeLiters = volumeCubicInches * 0.0163871;

    // Calculate recommended load capacity (don't exceed 75% for optimal steam circulation)
    const maxInstruments = Math.floor(volumeCubicInches / 10); // Rough estimate: 10 cubic inches per instrument
    const recommendedMax = Math.floor(maxInstruments * 0.75);

    // Determine load status
    let loadStatus = 'optimal';
    let statusClass = 'autoclave__status--optimal';
    let statusText = '✓ Optimal Load';
    let statusMessage = 'Your load size is within optimal range for effective sterilization.';

    if (numInstruments > maxInstruments) {
        loadStatus = 'overloaded';
        statusClass = 'autoclave__status--danger';
        statusText = '⚠️ OVERLOADED';
        statusMessage = 'Too many instruments! This will prevent proper steam circulation and effective sterilization.';
    } else if (numInstruments > recommendedMax) {
        loadStatus = 'heavy';
        statusClass = 'autoclave__status--warning';
        statusText = '⚠ Heavy Load';
        statusMessage = 'Load is acceptable but approaching maximum. Consider adding extra exposure time or splitting into two cycles.';
    }

    // Calculate load percentage
    const loadPercentage = Math.round((numInstruments / maxInstruments) * 100);

    // Display results
    displayLoadOptimizationResults({
        widthInches,
        depthInches,
        heightInches,
        widthUnit,
        depthUnit,
        heightUnit,
        widthValue,
        depthValue,
        heightValue,
        volumeCubicInches,
        volumeLiters,
        numInstruments,
        maxInstruments,
        recommendedMax,
        loadPercentage,
        loadStatus,
        statusClass,
        statusText,
        statusMessage
    });

    // Scroll to results
    document.getElementById('optimization-results').scrollIntoView({ behavior: 'smooth' });
}

function displayLoadOptimizationResults(data) {
    const resultsDiv = document.getElementById('optimization-results');
    resultsDiv.style.display = 'block';

    resultsDiv.innerHTML = `
        <div class="autoclave__optimization-header">
            <h3 class="autoclave__optimization-title">Load Analysis</h3>
            <div class="autoclave__status-badge ${data.statusClass}">${data.statusText}</div>
        </div>

        <div class="autoclave__optimization-grid">
            <div class="autoclave__optimization-card">
                <div class="autoclave__optimization-label">Chamber Volume</div>
                <div class="autoclave__optimization-value">${Math.round(data.volumeLiters * 10) / 10} L</div>
                <div class="autoclave__optimization-sublabel">${Math.round(data.volumeCubicInches)} cubic inches</div>
            </div>

            <div class="autoclave__optimization-card">
                <div class="autoclave__optimization-label">Current Load</div>
                <div class="autoclave__optimization-value">${data.numInstruments}</div>
                <div class="autoclave__optimization-sublabel">${data.loadPercentage}% of maximum</div>
            </div>

            <div class="autoclave__optimization-card">
                <div class="autoclave__optimization-label">Recommended Max</div>
                <div class="autoclave__optimization-value">${data.recommendedMax}</div>
                <div class="autoclave__optimization-sublabel">75% capacity</div>
            </div>

            <div class="autoclave__optimization-card">
                <div class="autoclave__optimization-label">Absolute Maximum</div>
                <div class="autoclave__optimization-value">${data.maxInstruments}</div>
                <div class="autoclave__optimization-sublabel">Not recommended</div>
            </div>
        </div>

        <div class="autoclave__optimization-message ${data.statusClass}">
            <p><strong>${data.statusMessage}</strong></p>
        </div>

        <div class="autoclave__optimization-tips">
            <h4 class="autoclave__tips-title">Loading Best Practices:</h4>
            <ul class="autoclave__tips-list">
                <li>Leave space between pouches for steam circulation</li>
                <li>Don't stack pouches - place them on edge</li>
                <li>Heavier items on bottom, lighter items on top</li>
                <li>Don't let items touch chamber walls</li>
                <li>Consider running multiple smaller loads instead of one large load</li>
                ${data.loadStatus === 'overloaded' ? '<li><strong>REDUCE your load by at least ' + (data.numInstruments - data.recommendedMax) + ' instruments</strong></li>' : ''}
                ${data.loadStatus === 'heavy' ? '<li>Consider adding 25-50% extra exposure time for heavy loads</li>' : ''}
            </ul>
        </div>

        <div class="autoclave__optimization-dimensions">
            <h4 class="autoclave__tips-title">Chamber Dimensions (as entered):</h4>
            <p>Width: ${UnitConverter.formatWithUnit(data.widthValue, data.widthUnit)} |
               Depth: ${UnitConverter.formatWithUnit(data.depthValue, data.depthUnit)} |
               Height: ${UnitConverter.formatWithUnit(data.heightValue, data.heightUnit)}</p>
        </div>
    `;
}

/* ============================================
   MATERIAL COMPATIBILITY CHECKER
   ============================================ */

function handleCompatibilitySubmit(event) {
    event.preventDefault();

    // Get form values
    const method = document.getElementById('sterilization-method').value;
    const material = document.getElementById('material-type').value;

    // Validate inputs
    if (!method || !material) {
        alert('Please select both sterilization method and material type');
        return;
    }

    // Map HTML values to database keys
    const materialMap = {
        'stainless': 'stainless-steel',
        'titanium': 'titanium',
        'carbon-steel': 'stainless-steel', // Treat carbon steel same as stainless for general autoclave
        'aluminum': 'anodized', // Aluminum is typically anodized and not safe
        'glass': 'glass',
        'plastic': 'plastic-peek',
        'ceramic': 'glass' // Treat ceramic similar to glass
    };

    const dbMaterialKey = materialMap[material];
    const materialData = MATERIAL_COMPATIBILITY[dbMaterialKey];

    if (!materialData) {
        alert('Material data not found. Please try another material.');
        return;
    }

    // Map sterilization method to database fields
    let methodField = '';
    let methodName = '';
    let isSteam = false;

    switch (method) {
        case 'steam-gravity':
            methodField = 'gravity';
            methodName = 'Steam - Gravity Displacement';
            isSteam = true;
            break;
        case 'steam-prevac':
            methodField = 'prevacuum';
            methodName = 'Steam - Pre-Vacuum';
            isSteam = true;
            break;
        case 'chemical-vapor':
            methodField = 'chemical';
            methodName = 'Chemical Vapor';
            isSteam = false;
            break;
        case 'dry-heat':
            // Dry heat is safe for most materials but not in our database
            methodField = 'dry-heat';
            methodName = 'Dry Heat';
            isSteam = false;
            break;
        default:
            alert('Invalid sterilization method');
            return;
    }

    // Check compatibility
    let isCompatible = false;
    let compatibilityNotes = materialData.notes;

    if (methodField === 'dry-heat') {
        // Special handling for dry heat - safe for most metals and glass, not plastics
        isCompatible = !material.includes('plastic');
        compatibilityNotes = isCompatible ?
            'Dry heat is compatible with most metals and glass. Use 320-375°F for 60-120 minutes.' :
            'Plastics will melt or degrade in dry heat. Use steam sterilization instead.';
    } else {
        isCompatible = materialData[methodField] === true;
    }

    // Display results
    displayCompatibilityResults({
        method: methodName,
        material: materialData.name,
        isCompatible,
        notes: compatibilityNotes,
        materialData,
        methodField,
        isSteam
    });

    // Scroll to results
    document.getElementById('compatibility-results').scrollIntoView({ behavior: 'smooth' });
}

function displayCompatibilityResults(data) {
    const resultsDiv = document.getElementById('compatibility-results');
    resultsDiv.style.display = 'block';

    const statusClass = data.isCompatible ? 'autoclave__status--optimal' : 'autoclave__status--danger';
    const statusText = data.isCompatible ? '✓ SAFE TO USE' : '⚠️ NOT SAFE';
    const statusIcon = data.isCompatible ? '✅' : '❌';

    let detailsHTML = '';
    if (data.isCompatible) {
        detailsHTML = `
            <div class="autoclave__compatibility-success">
                <p><strong>This combination is SAFE for sterilization.</strong></p>
                <p>${data.notes}</p>

                <h4 class="autoclave__tips-title">Best Practices:</h4>
                <ul class="autoclave__tips-list">
                    ${data.isSteam ? `
                        <li>Always use proper wrapping or pouches</li>
                        <li>Ensure adequate drying time for wrapped items</li>
                        <li>Allow instruments to cool before handling</li>
                        <li>Check chemical indicators on every load</li>
                    ` : `
                        <li>Follow manufacturer's specific instructions</li>
                        <li>Ensure proper ventilation</li>
                        <li>Use appropriate chemical indicators</li>
                    `}
                    <li>Run weekly biological indicator (spore) tests</li>
                    <li>Keep detailed sterilization logs</li>
                </ul>
            </div>
        `;
    } else {
        detailsHTML = `
            <div class="autoclave__compatibility-danger">
                <p><strong>⚠️ WARNING: This combination is NOT SAFE!</strong></p>
                <p>${data.notes}</p>

                <h4 class="autoclave__tips-title">Why This Is Unsafe:</h4>
                <ul class="autoclave__tips-list">
                    <li>The material may be damaged or degraded by this sterilization method</li>
                    <li>Protective coatings or finishes may be destroyed</li>
                    <li>The material may corrode or discolor</li>
                    <li>Structural integrity may be compromised</li>
                </ul>

                <h4 class="autoclave__tips-title">Safe Alternative Methods:</h4>
                <ul class="autoclave__tips-list">
                    ${getSafeAlternatives(data.materialData)}
                </ul>
            </div>
        `;
    }

    resultsDiv.innerHTML = `
        <div class="autoclave__compatibility-header">
            <h3 class="autoclave__compatibility-title">${statusIcon} Compatibility Check</h3>
            <div class="autoclave__status-badge ${statusClass}">${statusText}</div>
        </div>

        <div class="autoclave__compatibility-info">
            <div class="autoclave__compatibility-row">
                <strong>Material:</strong> ${data.material}
            </div>
            <div class="autoclave__compatibility-row">
                <strong>Sterilization Method:</strong> ${data.method}
            </div>
        </div>

        ${detailsHTML}
    `;
}

function getSafeAlternatives(materialData) {
    const alternatives = [];

    if (materialData.gravity) {
        alternatives.push('<li>✓ Steam - Gravity Displacement autoclave</li>');
    }
    if (materialData.prevacuum) {
        alternatives.push('<li>✓ Steam - Pre-Vacuum autoclave</li>');
    }
    if (materialData.chemical) {
        alternatives.push('<li>✓ Chemical Vapor sterilization</li>');
    }

    if (alternatives.length === 0) {
        return '<li>Consult manufacturer for appropriate sterilization method</li><li>Consider using disposable alternatives if available</li>';
    }

    return alternatives.join('');
}

/* ============================================
   PRINT & DOWNLOAD FUNCTIONS
   ============================================ */

function printTestSchedule() {
    // Check if spore test results are available
    if (!AppState.lastSporeTest) {
        alert('Please check your test schedule first before printing.');
        return;
    }

    // Open print dialog - browser will use print-specific CSS
    window.print();
}

function downloadLogTemplate() {
    // Create a CSV template for spore test logging
    const csvContent = [
        'Date,Test Type,Autoclave ID,Biological Indicator Lot#,Test Result,Operator Initials,Notes',
        `${new Date().toISOString().split('T')[0]},Weekly Spore Test,,,,,`,
        ',,,,,',
        ',,,,,',
        ',,,,,',
        ',,,,,',
        ',,,,,'
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Spore_Test_Log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function printCycleLog() {
    // Check if calculator results are available
    if (!AppState.lastCalculation) {
        alert('Please calculate a sterilization cycle first before printing.');
        return;
    }

    // Check if the combination was valid
    if (AppState.lastCalculation.invalid || !AppState.lastCalculation.parameters) {
        alert('Cannot print an invalid autoclave/load combination. Please select a valid combination first.');
        return;
    }

    // Open print dialog - browser will use print-specific CSS
    window.print();
}

function saveToRecords() {
    // Check if calculator results are available
    if (!AppState.lastCalculation) {
        alert('Please calculate a sterilization cycle first before saving.');
        return;
    }

    // Check if the combination was valid
    if (AppState.lastCalculation.invalid || !AppState.lastCalculation.parameters) {
        alert('Cannot save an invalid autoclave/load combination. Please select a valid combination first.');
        return;
    }

    const calc = AppState.lastCalculation;
    const params = calc.parameters;
    const date = new Date().toISOString().split('T')[0];

    // Create a CSV record of the sterilization cycle
    const csvContent = [
        'Date,Autoclave Type,Load Type,Load Size,Temperature (F),Temperature (C),Pressure (PSI),Exposure Time (min),Dry Time (min),Total Cycle (min)',
        `${date},${calc.autoclaveType},${calc.loadType},${calc.loadSize},${params.temperature.f},${params.temperature.c},${params.pressure.psi},${params.exposureTime},${params.dryTime},${params.totalCycle}`
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `Sterilization_Cycle_${date}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* ============================================
   CONSOLE BRANDING
   ============================================ */

console.log('%c🔬 Autoclave Sterilization Calculator', 'color: #00A86B; font-size: 16px; font-weight: bold;');
console.log('%cPart of Poli International Widget Suite', 'color: #6C757D; font-size: 12px;');
console.log('%cLearn more: https://poliinternational.com', 'color: #0066CC; font-size: 12px;');

/* ============================================
   END OF JAVASCRIPT
   ============================================ */