/**
 * This file provides utility functions for common DOM (Document Object Model) manipulations.
 * It includes functions for toggling the visibility of elements and retrieving elements by their ID.
 */

/**
 * Toggles the visibility of an HTML element by adding or removing the 'hide' class.
 * The 'hide' class is assumed to be defined in the CSS to control the element's visibility (e.g., `display: none;`).
 *
 * @param {string} elementId - The ID of the HTML element to toggle.
 * @param {boolean} [force] - An optional boolean to force the element to be shown (true) or hidden (false).
 *                             If not provided, the visibility will be toggled (shown if hidden, hidden if shown).
 */
export function toggleVisibility(elementId, force) {
    // If the 'force' parameter is not provided, toggle the 'hide' class.
    if(force === undefined) {
        document.getElementById(elementId).classList.toggle('hide');
    }
    // Otherwise, toggle the 'hide' class based on the 'force' value.
    else {
        // If 'force' is true, remove the 'hide' class (show the element).
        // If 'force' is false, add the 'hide' class (hide the element).
        document.getElementById(elementId).classList.toggle('hide', !force);
    }
}

/**
 * Retrieves an HTML element by its ID.
 *
 * @param {string} elementId - The ID of the HTML element to retrieve.
 * @returns {HTMLElement} The HTML element with the specified ID.
 * @throws {Error} Throws an error if no element with the specified ID is found.
 */
export function getElementById(elementId) {
    // Attempt to get the element by its ID.
    let element = document.getElementById(elementId);

    // If no element is found (element is null), throw an error.
    if(element === null) {
        throw new Error(`Element with id ${elementId} not found`);
    }
    // Return the found element.
    return element;
}
