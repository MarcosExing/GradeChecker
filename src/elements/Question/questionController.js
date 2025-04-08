import { NotificationPopup } from "../Popups/notificationPopup.js";
import { Question } from "./question.js";
import { QuestionCard } from "./questionCard.js";

/**
 * The QuestionController class manages a collection of Question objects and their corresponding QuestionCard elements.
 * It handles adding, editing, and deleting questions, as well as updating the UI to reflect these changes.
 */
export class QuestionController {
    /**
     * Creates a new QuestionController instance.
     * @param {FormPopup} editPopup - The popup used for editing question details.
     * @param {Object} translations - An object containing translations for the UI elements.
     */
    constructor(editPopup, translations) {
        /**
         * @type {Object.<string, Question>} - An object to store the questions, keyed by their unique IDs.
         */
        this.questions = {};
        /**
         * @type {Object.<string, Question>} - A copy of the questions object.
         * @private
         */
        this._questionsCopy = {};
        /**
         * @type {Number} - The total number of questions
         * @private
         */
        this._questionsQuantity = 0;
        /**
         * @type {HTMLDivElement} - A container element to hold all the question cards.
         */
        this.questionsCard = document.createElement('div');
        /**
         * @type {string|null} - The ID of the question currently being edited, or null if no question is being edited.
         */
        this.currentEditId = null;
        /**
         * @type {FormPopup} - The popup used for editing question details.
         */
        this.editPopup = editPopup;
        /**
         * @type {Object} - An object containing translations for the UI elements.
         */
        this.translations = translations;
        /**
         * @type {Object} - A object containing translations for the UI cards elements.
         */
        QuestionCard.translations = translations;
    }

    /**
     * @type {Object.<string, Question>} - A copy of the questions object.
     */
    get questionsCopy() {
        this._questionsCopy = JSON.parse(JSON.stringify(this.questions));

        return this._questionsCopy;
    }

    /**
     * Adds a new question to the collection and creates a corresponding card in the UI.
     * @param {Array} data - An array containing the question's data: [name, studentAnswer, answerKey, difficulty].
     */
    addQuestion(data) {
        // Generate a unique ID for the new question.
        const questionId = this.generateQuestionId();
        // Create a new Question object and store it in the questions collection.
        this.questions[questionId] = new Question(data);
        this.saveQuestionsToLocalStorage();
        // Create a new QuestionCard element for the question.
        const questionCard = QuestionCard.addCard(this.getQuestion(questionId), questionId);
        // Append the new card to the questionsCard container.
        this.questionsCard.appendChild(questionCard);
    }

    /**
     * Edits an existing question in the collection and updates its card in the UI.
     * @param {Array} data - An array containing the updated question data: [name, studentAnswer, answerKey, difficulty].
     */
    editQuestion(data, showNotification = true) {
        // If has a different name of the generic one, changes the flag
        let isGenericName = null;
        let questionName = data[0].split(" ")[0]; // Removes the counter.
        
        if (questionName !== this.translations.question) isGenericName = false;
        data.push(isGenericName);
        
        // Update the question's data in the collection.
        this.questions[this.currentQuestionId].update(data);
        this.saveQuestionsToLocalStorage();
        // Update the question's card in the UI.
        QuestionCard.editCard(this.getQuestion(this.currentQuestionId), this.currentQuestionId);

        if(showNotification) new NotificationPopup(this.translations.editQuestionNotificationPopup, "success");
    }

    /**
     * Edits multiple questions based on specified criteria and values.
     * @param {Array} data - An array containing the edit parameters: [studentAnswer, answerKey, difficulty, criteria, criteriaValue].
     *                       - studentAnswer: The new student answer value (or "" to keep the same).
     *                       - answerKey: The new answer key value (or "" to keep the same).
     *                       - difficulty: The new difficulty value (or "" to keep the same).
     *                       - criteria: The criteria to filter questions by (e.g., "studentAnswer", "answerKey", "difficulty").
     *                       - criteriaValue: The value to match against the criteria.
     */
    editAllQuestions(data, showNotification = true) {
        // Extract the edit parameters from the data array.
        const studentAnswer = data[0];
        const answerKey = data[1];
        const difficulty = data[2];
        const criteria = data[3];
        const criteriaValue = data[4];

        // Iterate over each question in the collection.
        for (let [id, question] of Object.entries(this.questions)) {
            // Create a clone of the question to modify.
            let questionClone = question;

            // Apply the criteria filter.
            switch(criteria) {
                case "studentAnswer":
                    // Check if the question's status matches the criteria value.
                    switch(criteriaValue) {
                        case "true":
                            if (questionClone.status != true) continue;
                            break;
                        case "_":
                            if (questionClone.status != null) continue;
                            break;
                        case "false":
                            if (questionClone.status != false) continue;
                            break;
                    }
                    break;
                case "answerKey":
                    // Check if the question's answer key matches the criteria value.
                    if (questionClone.answerKey != criteriaValue) continue;
                    break;
                case "difficulty":
                    // Check if the question's difficulty matches the criteria value.
                    if (questionClone.difficulty != criteriaValue) continue;
                    break;
            }

            // Apply the new values if they are not empty.
            if (studentAnswer != "") {
                switch(studentAnswer) {
                    case "true": 
                        // Set the student answer to the answer key.
                        questionClone.studentAnswer = question.answerKey;
                        break;
                    case "false":
                        // Set the student answer to a wrong answer.
                        questionClone.studentAnswer = "#";
                        break;
                    case "_":
                        // Set the student answer to null.
                        questionClone.studentAnswer = "_";
                        break;
                }
            }
            if (answerKey === "_") {
                // Set the answer key to null.
                questionClone.answerKey = "_";
            }
            if (difficulty != "") {
                // Set the difficulty to the new value.
                questionClone.difficulty = difficulty;
            }
            
            // Update the question with the modified data.
            this.currentQuestionId = id;
            this.editQuestion(Array.from(Object.values(questionClone)), false);

        }
        if(showNotification) new NotificationPopup(this.translations.editAllQuestionsNotificationPopup, "success");
    }

    /**
     * Deletes a question from the collection and removes its card from the UI.
     * @param {string} questionId - The ID of the question to delete.
     */
    deleteQuestion(questionId) {
        // Remove the question from the collection.
        delete this.questions[questionId];
        this.saveQuestionsToLocalStorage();
        // Remove the question's card from the UI.
        QuestionCard.deleteCard(questionId);
    }
    
    /**
     * Saves the current questions to local storage for cache
    */
   saveQuestionsToLocalStorage() {
       localStorage.setItem('questions', JSON.stringify(this.questions));
    }

    /**
     * Loads the questions from local storage
     * @returns {Object} A Object containing the questions saved on local storage
     */
    loadQuestionsFromLocalStorage() {
        if (localStorage.getItem('questions') !== null) {
            return JSON.parse(localStorage.getItem('questions'));
        }
        return null;
    }
    
    /**
     * Generates a unique ID for a new question.
     * @returns {string} The generated question ID.
     */
    generateQuestionId() {
        // Create a new ID based on the number of existing questions.
        return `Question${Object.keys(this.questions).length + 1}`;
    }
    
    /**
     * Retrieves a question from the collection by its ID.
     * @param {string} questionId - The ID of the question to retrieve.
     * @returns {Question} The Question object with the specified ID.
     */
    getQuestion(questionId) {
        return this.questions[questionId];
    }

    /**
     * @param {Object} questions - A object containing questions
     * @returns The total number of questions
     */
    getQuestionsQuantity(questions) {
        this._questionsQuantity = Object.values(questions).length;
        return this._questionsQuantity;
    }

}
