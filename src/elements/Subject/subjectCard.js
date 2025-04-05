import { getElementById } from "../../utils/domUtils.js";

/**
 * The SubjectCard class is responsible for managing the display and interaction of individual subject cards in the UI.
 * It handles adding, editing, and deleting subject cards, as well as attaching event listeners for user interactions.
 */
export class SubjectCard {
    /**
     * @type {HTMLElement|null} - A static property to store the container element for all subject cards.
     *                             It should be set to the actual container element in the main application logic.
     */
    static subjectsCard = null;

    /**
     * Adds a new subject card to the DOM.
     * @param {string} subjectId - The unique ID for the subject.
     * @param {Subject} subject - The Subject object containing the subject's data.
     */
    static addSubjectCard(subjectId, subject) {
        // Create a new div element to represent the subject card.
        let subjectCard = document.createElement('div');
        // Set the ID of the card.
        subjectCard.id = `${subjectId}-card`;
        // Add the "card" class for styling.
        subjectCard.className = 'card';

        // Set the inner HTML of the card with the subject's information and buttons.
        subjectCard.innerHTML = `
            <span id="${subjectId}-name">${subject.name}</span>
            <span id="${subjectId}-questionsQuantity">${subject.questionsQuantity}</span>
            <button id="${subjectId}-card-edit-button" class="button-dark"><span class="fa fa-pen-to-square"></span></button>
            <button id="${subjectId}-card-delete-button" class="button-dark button-hover__red"><span class="fa fa-trash"></span></button>
        `;

        // Append the new card to the subjectsCard container.
        SubjectCard.subjectsCard.appendChild(subjectCard);
    }

    /**
     * Edits an existing subject card in the DOM.
     * @param {string} subjectId - The unique ID of the subject card to edit.
     * @param {Subject} subject - The Subject object containing the updated subject's data.
     */
    static editSubjectCard(subjectId, subject) {
        // Update the subject's name in the card.
        getElementById(`${subjectId}-name`).textContent = subject.name;
        // Update the subject's questions quantity in the card.
        getElementById(`${subjectId}-questionsQuantity`).textContent = subject.questionsQuantity;
    }

    /**
     * Deletes a subject card from the DOM.
     * @param {string} subjectId - The unique ID of the subject card to delete.
     */
    static deleteSubjectCard(subjectId) {
        // Get the subject card element by its ID and remove it from the DOM.
        getElementById(`${subjectId}-card`).remove();
    }

    /**
     * Adds event listeners to a subject card for editing and deleting.
     * @param {string} subjectId - The unique ID of the subject card.
     * @param {Subject} subject - The Subject object associated with the card.
     * @param {FormPopup} editPopup - The popup used for editing subject details.
     * @param {SubjectController} subjectController - The controller for managing subjects.
     */
    static addEventListeners(subjectId, subject, editPopup, subjectController) {
        // Add a click event listener to the edit button.
        getElementById(`${subjectId}-card-edit-button`).addEventListener('click', () => {
            // Load the subject's data into the edit popup.
            editPopup.loadPopupInputs(Object.values(subject));
            // Show the edit popup.
            editPopup.togglePopupVisibility();
            // Set the current subject ID in the subject controller for editing.
            subjectController.currentEditId = subjectId;
        });

        // Add a click event listener to the delete button.
        getElementById(`${subjectId}-card-delete-button`).addEventListener('click', () => {
            // Delete the subject.
            subjectController.deleteSubject(subjectId);
        });
    }
}
