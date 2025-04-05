import { toggleVisibility } from "../../utils/domUtils.js";

/**
 * Represents a generic form popup element.
 * This class handles the display, input, and submission of a form within a popup.
 */
export class FormPopup {
    /**
     * Creates a new FormPopup instance.
     * @param {HTMLElement} popup - The popup element itself.
     */
    constructor(popup) {
        /** @type {HTMLElement} The popup element. */
        this.popup = popup;
        /** @type {HTMLElement} The overlay element associated with the popup. */
        this.overlay = document.querySelector(`#overlay-${this.popup.id.split("-").slice(1).join("-")}`);
        /** @type {HTMLFormElement} The form element within the popup. */
        this.form = document.querySelector(`#${this.popup.id} form`);
        /** @type {NodeListOf<HTMLInputElement | HTMLSelectElement>} All input and select elements within the form. */
        this.inputs = document.querySelectorAll(`#${this.popup.id} form input, #${this.popup.id} form select`);
        /** @type {NodeListOf<HTMLButtonElement>} All button elements within the popup. */
        this.buttons = document.querySelectorAll(`#${this.popup.id} button`);
    }

    /**
     * Loads data into the popup's input fields.
     * @param {Array<string>} data - An array of values to populate the input fields. Populates the input fields from top to bottom.
     */
    loadPopupInputs(data) {
        for (let i = 0; i < this.inputs.length; i++){
            this.inputs.item(i).value = data[i];
        }
    }
    
    /**
     * Clears the values of all input fields in the popup.
     */
    cleanPopupInputs(){
        for (let input of this.inputs){
            if (input.nodeName === "SELECT") {
                input.selectedIndex = 0; // Reset select to first option
            } else {
                input.value = null; // Clear input field
            }
        }
    }

    /**
     * Toggles the visibility of the popup and its overlay.
     */
    togglePopupVisibility() {
        toggleVisibility(this.popup.id);
        toggleVisibility(this.overlay.id);
    }

    /**
     * Gets the values of all visible input fields in the popup.
     * @returns {Array<string>} An array of input values.
     */
    getInputsValues() {
        let inputsValues = [];
        for (let input of this.inputs) {
            if(input.checkVisibility()) { // Only get visible inputs
                inputsValues.push(input.value);
            }
        }

        return inputsValues;
    }

    /**
     * Shows or hides a target element based on the value of a trigger element.
     * @param {HTMLElement} triggerElement - The element that triggers the change (e.g., a select dropdown).
     * @param {HTMLElement} targetElement - The element to show/hide.
     * @param {Array<string>} values - The values of the triggerElement that will result in showing the targetElement. If not founded, the targetElement is hide.
     */
    showElementOnValues(triggerElement, targetElement, values) {
        triggerElement.addEventListener('change', () => {
            for (let value of values) {
                if(triggerElement.value === value) {
                    toggleVisibility(targetElement.id, true);
                    return;
                }
            }

            toggleVisibility(targetElement.id, false);
        });    
    }

    /**
     * Sets up the event handlers for the popup (close, submit, prevent propagation).
     * @param {function} submitHandler - The function to call when the form is submitted.
     * @param {boolean} cleanPopupInputs - if it is necessary clean inputs after submit.
     */
    setHandlers(submitHandler, cleanPopupInputs) {
        this.setStopPropagationHandler();
        this.setCloseHandler();
        this.setSubmitHandler(submitHandler, cleanPopupInputs);
    }

    /**
     * Sets the event handler for form submission.
     * @param {function} submitHandler - The function to call when the form is submitted.
     * @param {boolean} cleanPopupInputs - A flag to indicate if the input fields should be cleared after submit. Default false.
     * @param {FormPopup|null} otherPopup - another popup that could be involved in the submit process. Default null
     */
    setSubmitHandler(submitHandler, cleanPopupInputs=false, otherPopup=null) {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission behavior
            if (otherPopup === null) {
                submitHandler(this.getInputsValues()); // Call submit handler with inputs
            } else {
                submitHandler(this.getInputsValues(), otherPopup); // Call submit handler with inputs and other Popup
            }
            if (cleanPopupInputs) {
                this.cleanPopupInputs(); // Clear inputs if needed
            }
        });
    }

    /**
     * Sets the event handler for closing the popup.
     */
    setCloseHandler() {
        let closeButton = this.buttons[0];
        closeButton.addEventListener('click', () => {
            this.togglePopupVisibility();
        });
        this.overlay.addEventListener('click', () => {
            this.togglePopupVisibility();
        });
    }

    /**
     * Sets the event handler to prevent event propagation when clicking inside the popup.
     */
    setStopPropagationHandler() {
        this.popup.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from propagating to overlay
        });
    }
}
