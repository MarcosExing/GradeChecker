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
     * Adds a new question to the collection and creates a corresponding card in the UI.
     * @param {Array} data - An array containing the question's data: [name, studentAnswer, correctAnswer, difficulty].
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
     * @param {Array} data - An array containing the updated question data: [name, studentAnswer, correctAnswer, difficulty].
     */
    editQuestion(data) {
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
    }

    /**
     * Edits multiple questions based on specified criteria and values.
     * @param {Array} data - An array containing the edit parameters: [studentAnswer, correctAnswer, difficulty, criteria, criteriaValue].
     *                       - studentAnswer: The new student answer value (or "" to keep the same).
     *                       - correctAnswer: The new correct answer value (or "" to keep the same).
     *                       - difficulty: The new difficulty value (or "" to keep the same).
     *                       - criteria: The criteria to filter questions by (e.g., "studentAnswer", "correctAnswer", "difficulty").
     *                       - criteriaValue: The value to match against the criteria.
     */
    editAllQuestions(data) {
        // Extract the edit parameters from the data array.
        const studentAnswer = data[0];
        const correctAnswer = data[1];
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
                case "correctAnswer":
                    // Check if the question's correct answer matches the criteria value.
                    if (questionClone.correctAnswer != criteriaValue) continue;
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
                        // Set the student answer to the correct answer.
                        questionClone.studentAnswer = question.correctAnswer;
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
            if (correctAnswer === "_") {
                // Set the correct answer to null.
                questionClone.correctAnswer = "_";
            }
            if (difficulty != "") {
                // Set the difficulty to the new value.
                questionClone.difficulty = difficulty;
            }
            
            // Update the question with the modified data.
            this.currentQuestionId = id;
            this.editQuestion(Array.from(Object.values(questionClone)));
        }
    }

    /**
     * Deletes a question from the collection and removes its card from the UI.
     * @param {string} questionId - The ID of the question to delete.
     */
    deleteQuestion(questionId) {
        // Remove the question from the collection.
        delete this.questions[questionId];
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
