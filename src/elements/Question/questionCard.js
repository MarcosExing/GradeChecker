import { getElementById } from "../../utils/domUtils.js";

/**
 * This class is responsible for creating, editing, and deleting the HTML elements that represent a question card.
 * It also handles the display of the question's information within the card.
 */
export class QuestionCard {
    /**
     * @type {Object} - An object to store translations for the card's content.
     */
    translations = {};

    /**
     * Adds a new question card to the DOM.
     * @param {Question} question - The Question object containing the question's data.
     * @param {string} questionId - The unique ID for the question card.
     * @returns {HTMLDivElement} The newly created question card element.
     */
    static addCard(question, questionId) {
        // Create a new div element to represent the question card.
        const questionCard = document.createElement("div");
        // Set the ID of the card.
        questionCard.id = questionId;
        // Add the "card" class for styling.
        questionCard.classList.add("card");
        // Add a class to indicate if the question is correct or incorrect.
        if(question.status === true) {
            questionCard.classList.add("correct");
        }
        else if(question.status === false) {
            questionCard.classList.add("incorrect");
        }

        // Set the inner HTML of the card using the #createCard method.
        questionCard.innerHTML = questionCard.innerHTML = QuestionCard.#createCard(question, questionId);

        // Return the created card element.
        return questionCard;
    }

    /**
     * Edits an existing question card in the DOM.
     * @param {Question} question - The Question object containing the updated question's data.
     * @param {string} questionId - The unique ID of the question card to edit.
     * @returns {HTMLDivElement} The updated question card element.
     */
    static editCard(question, questionId) {
        // Get the existing question card element by its ID.
        const questionCard = getElementById(questionId);
        // Remove the "correct" and "incorrect" classes to reset the card's status.
        questionCard.classList.remove("correct");
        questionCard.classList.remove("incorrect");

        // Add a class to indicate if the question is correct or incorrect.
        if(question.status === true) {
            questionCard.classList.add("correct");
        }
        else if(question.status === false) {
            questionCard.classList.add("incorrect");
        }

        // Update the inner HTML of the card using the #createCard method.
        questionCard.innerHTML = QuestionCard.#createCard(question, questionId);

        // Return the updated card element.
        return questionCard;
    }

    /**
     * Deletes a question card from the DOM.
     * @param {string} questionId - The unique ID of the question card to delete.
     */
    static deleteCard(questionId) {
        // Get the question card element by its ID and remove it from the DOM.
        getElementById(questionId).remove();
    }

    /**
     * Creates the HTML content for a question card.
     * @param {Question} question - The Question object containing the question's data.
     * @param {string} questionId - The unique ID for the question card.
     * @returns {string} The HTML string for the question card.
     * @private
     */
    static #createCard(question, questionId) {
        // Create the HTML string for the question card.
        const questionCard = `
            <button id="${questionId}-btn-edit"><span class="fa fa-pen-to-square"></span></button>
            <h3 id="${questionId}-title">${question.name}</h3>
            <div class="card-content">
                <span id="${questionId}-student-answer"><strong>${question.studentAnswer}</strong>: ${QuestionCard.translations.studentAnswer}</span>
                <span id="${questionId}-correct-answer"><strong>${question.correctAnswer}</strong>: ${QuestionCard.translations.correctAnswer}</span>
            </div>
            <span id="${questionId}-stamp-difficulty" class="stamp"><strong>${QuestionCard.translations[question.difficulty]}</strong></span>
        `;

        // Return the HTML string.
        return questionCard;
    }
}
