/**
 * Represents a popup that appears on mouse hover over a specific element.
 */
export class MousePopup {
    /**
     * Creates a new MousePopup instance.
     * @param {HTMLElement} triggerElement - The HTML element that will trigger the popup on mouse hover.
     * @param {string} title - The title text to be displayed in the popup.
     * @param {string} description - The description text to be displayed in the popup. Can contain line breaks (\n) and html elements (e.g., \<strong\>).
     */
    constructor(triggerElement, title, description) {
        /**
         * @type {string} - The title of the popup.
         */
        this.title = title;
        /**
         * @type {string} - The description of the popup.
         */
        this.description = description;
        /**
         * @type {HTMLElement} - The element that triggers the popup.
         */
        this.triggerElement = triggerElement;

        /**
         * @type {HTMLDivElement} - The main popup container element.
         */
        this.mousePopup = document.createElement('div');
        this.mousePopup.classList.add('mouse-popup');

        this.mousePopupTitle = document.createElement('div');
        this.mousePopupTitle.classList.add('mouse-popup__title');
        this.mousePopupTitle.innerHTML = title; // Set the title as the initial content

        /**
         * @type {HTMLDivElement} - The container for the description text.
         */
        this.mousePopupDescription = document.createElement('div');
        this.mousePopupDescription.classList.add('mouse-popup__description');
        // Split the description into lines and create <p> elements for each line.
        for (let line of description.split('\n')) {
            if(line === "") {
                // If the line is empty, add a <br> for spacing.
                this.mousePopupDescription.appendChild(document.createElement('br'));
                continue;
            }
            // Add each line as a paragraph.
            this.mousePopupDescription.innerHTML += `<p>${line}</p>`;
        }

        // Append the title and description to the main popup container.
        this.mousePopup.appendChild(this.mousePopupTitle);
        this.mousePopup.appendChild(this.mousePopupDescription);

        document.body.appendChild(this.mousePopup);

        // Initially hide the popup.
        this.mousePopup.style.opacity = 0;

        this.addEventListener(this.triggerElement);
    }

    /**
     * Adds mouseover and mouseout event listeners to the trigger element.
     * @param {HTMLElement} triggerElement - The element to attach the event listeners to.
     */
    addEventListener(triggerElement) {
        // Show the popup when the mouse is over the trigger element.
        triggerElement.addEventListener('mouseover', (event) => {
            this.showPopup();
        });

        // Hide the popup when the mouse leaves the trigger element.
        triggerElement.addEventListener('mouseout', (event) => {
            this.hidePopup();
        });
    }

    /**
     * Shows the popup and positions it relative to the trigger element.
     */
    showPopup() {
        // Get the bounding rectangle of the trigger element.
        const rect = this.triggerElement.getBoundingClientRect();
        // Get the width and height of the popup.
        const popupWidth = this.mousePopup.offsetWidth;
        const popupHeight = this.mousePopup.offsetHeight;

        // Calculate position relative to the viewport
        let top = rect.top - popupHeight - 10; // Position above the trigger element, add 10px padding
        let left = rect.left; // Align with the left edge of the trigger element

        // Adjust for overflow, if goes out of the page
        if (top < 0) {
            top = rect.bottom + 10; // position 10px below the trigger element, if top dons't have space
        }

        if (left + popupWidth > window.innerWidth) {
            left = window.innerWidth - popupWidth - 10; // position 10px to the left, if right dons't have space
        }

        if(left < 0) {
            left = 10; //position 10px to the right, if left dons't have space
        }

        // Set the popup's position.
        this.mousePopup.style.top = `${top}px`;
        this.mousePopup.style.left = `${left}px`;

        // Make the popup visible.
        this.mousePopup.style.opacity = 1;
    }

    /**
     * Hides the popup.
     */
    hidePopup() {
        // Make the popup invisible.
        this.mousePopup.style.opacity = 0;
    }
}
