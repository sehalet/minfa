/**
 * @name       Farm Assistant with Enhanced Features
 * @version    2.0
 * @description Filters villages based on resource range and supports shortcuts for quick actions.
 */

// Ensure namespace exists
if (!window.twcheese) window.twcheese = {};

// DOM Elements
const farmWidget = document.getElementById("am_widget_Farm");
const table = document.querySelector("#plunder_list");
const rows = Array.from(table?.getElementsByTagName("tr") || []);

// Local Storage Keys
const LOCAL_STORAGE_MIN_KEY = "tm4rkus_savedMinRess";
const LOCAL_STORAGE_MAX_KEY = "tm4rkus_savedMaxRess";

// Saved values
let savedMinRess = localStorage.getItem(LOCAL_STORAGE_MIN_KEY) || "";
let savedMaxRess = localStorage.getItem(LOCAL_STORAGE_MAX_KEY) || "";

// Add input fields for filtering
function addInputFields() {
    const headerCells = rows[0]?.getElementsByTagName("th");
    if (!headerCells || headerCells.length < 6) return;

    const minInput = createInputField("Min", savedMinRess);
    const maxInput = createInputField("Max", savedMaxRess);

    // Insert inputs into the header row
    headerCells[5].prepend(minInput, maxInput);

    // Add event listeners for dynamic filtering
    minInput.addEventListener("input", filterRows);
    maxInput.addEventListener("input", filterRows);
}

// Create a reusable input field with default size
function createInputField(placeholder, value) {
    const input = document.createElement("input");
    input.type = "number";
    input.size = 6; // Same size as the original version
    input.value = value;
    input.style.marginRight = "5px";
    input.placeholder = placeholder;
    return input;
}

// Filter rows based on resource range
function filterRows() {
    const minRess = Number(document.querySelector("input[placeholder='Min']").value) || 0;
    const maxRess = Number(document.querySelector("input[placeholder='Max']").value) || Infinity;

    // Save values to local storage
    localStorage.setItem(LOCAL_STORAGE_MIN_KEY, minRess);
    localStorage.setItem(LOCAL_STORAGE_MAX_KEY, maxRess);

    rows.slice(1).forEach(row => {
        const cells = row.getElementsByTagName("td");
        if (cells.length < 10) return;

        const totalResources = calculateResources(cells[5]);
        row.style.display = totalResources >= minRess && totalResources <= maxRess ? "" : "none";
    });
}

// Calculate total resources from a cell
function calculateResources(cell) {
    const resources = Array.from(cell.querySelectorAll(".res, .warn_90, .warn"))
        .map(el => Number(el.textContent.replace(/\./g, "")) || 0);
    return resources.reduce((sum, res) => sum + res, 0);
}

// Add keyboard shortcuts (A, B, C)
function addKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
        const keyMap = { "A": 0, "B": 1, "C": 2 };
        const buttonIndex = keyMap[event.key];
        if (buttonIndex === undefined) return;

        rows.slice(1).forEach(row => {
            if (row.style.display === "none") return;
            const buttons = row.getElementsByTagName("a");
            if (buttons && buttons[buttonIndex]) {
                buttons[buttonIndex].click();
            }
        });
    });
}

// Initialize the script
function initFarmAssistant() {
    if (!farmWidget || !table || rows.length === 0) {
        console.error("Farm Assistant: Required elements not found.");
        return;
    }

    addInputFields();
    filterRows(); // Initial filtering
    addKeyboardShortcuts();
}

// Run the script
initFarmAssistant();
