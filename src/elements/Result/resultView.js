import { getElementById } from "../../utils/domUtils.js";
import { createDonutGraph } from "../../utils/graphUtils.js";

/**
 * The ResultView class is responsible for rendering the result of a test or exam,
 * including the overall performance, subject-specific performance, and individual question details.
 * It also handles user interactions related to the result, such as editing questions, recalculating the result, saving, and loading.
 */
export class ResultView {
    /**
     * Creates a new ResultView instance.
     * @param {HTMLElement} main - The main container element where the result view will be appended.
     * @param {Object} translations - An object containing translations for UI elements.
     */
    constructor(main, translations) {
        /**
         * @type {HTMLElement} - The main container element.
         */
        this.main = main;
        /**
         * @type {HTMLElement|null} - The result view element, initially null.
         */
        this.resultView = null;
        /**
         * @type {HTMLElement|null} - The container for student answers, initially null.
         */
        this.studentAnswers = null;
        /**
         * @type {HTMLElement|null} - The container for buttons, initially null.
         */
        this.buttons = null;
        /**
         * @type {Object} - An object containing translations for UI elements.
         */
        this.translations = translations;
    }

    /**
     * Adds the result view to the DOM, including the overall performance, subject-specific performance, and individual question details.
     * @param {Result} result - The Result object containing the calculated result data.
     * @param {Object} subjects - An object containing the subjects, where keys are subject IDs and values are subject objects.
     * @param {Array<HTMLElement>} questionsCard - An array of question card elements.
     */
    addView(result, subjects, questionsCard) {
        // Create the main result view container.
        this.resultView = document.createElement('section');
        this.resultView.id = 'result';
        this.resultView.classList.add('result');
        // Set the inner HTML of the result view container.
        this.resultView.innerHTML = `
                <div class="performance">
                    <div class="title">
                        <h1>${this.translations.result}</h1>
                    </div>

                    <div id="result-content">
                        <div id="graph-result" class="graph">
                        </div>
                        <p>${this.translations.points}: <strong class="strong-blue">${result.points}</strong> ${this.translations.of} ${result.maxPoints} (${(result.points/result.maxPoints * 100).toFixed(2)}%)</p>
                        <p>${this.translations.correctAnswers}: <strong class="strong-green">${result.correctAnswers}</strong></p>
                        <p>${this.translations.incorrectAnswers}: <strong class="strong-red">${result.wrongAnswers}</strong></p>
                        <p>${this.translations.unanswered}: ${result.unanswered}</p>
                    </div>
                    <div class="buttons">
                        <button id="btn-save-result" class="button-dark">${this.translations.saveResult}</button>
                        <button id="btn-load-result" class="button-dark">${this.translations.loadResult}</button>
                    </div>
                </div>
        `;

        // Create the container for student answers.
        this.studentAnswers = document.createElement('div');
        this.studentAnswers.classList.add('student-answers');
        this.studentAnswers.innerHTML = `
            <div class="title">
                <h1>${this.translations.studentAnswers}</h1>
            </div>
        `;

        // Iterate over each subject and its questions to create the subject-specific performance view.
        let i = 0;
        for (let [key, subject] of Object.entries(subjects)) {
            // Create a container for the subject's performance.
            const superCard = document.createElement('div');
            superCard.id = `${key}-super-card`;
            superCard.classList.add('super-card');
            // Set the inner HTML of the subject's performance container.
            superCard.innerHTML = `
                <h2>${subject.name}: ${result.subjectsPerformance[key].points} ${this.translations.points} (${(result.subjectsPerformance[key].grade).toFixed(2)}%)</h2>
            `;

            // Create a container for the subject's question cards.
            const cards = document.createElement('div');
            cards.classList.add('cards');
            // Iterate over each question in the subject and append its card to the container.
            for (let j = 0; j < subject.questionsQuantity; j++) {
                const card = questionsCard[i];
                cards.appendChild(card);
                i++;
            }

            // Append the question cards container to the subject's performance container.
            superCard.appendChild(cards);
            // Append the subject's performance container to the student answers container.
            this.studentAnswers.appendChild(superCard);
        }

        // Append the student answers container to the result view container.
        this.resultView.appendChild(this.studentAnswers);

        // Create the container for buttons.
        this.buttons = document.createElement('div');
        this.buttons.classList.add('buttons');
        // Set the inner HTML of the buttons container.
        this.buttons.innerHTML = `
            <div class="header">
                <button id="btn-delete-allQuestions" class="button-dark">${this.translations.deleteAll} <span class="fa fa-trash"></span> </button>
                <button id="btn-edit-allQuestions" class="button-dark">${this.translations.editAll} <span class="fa fa-pen-to-square"></span> </button>
            </div>
        `;
        // Append the buttons container to the result view container.
        this.resultView.appendChild(this.buttons);
        // Append the result view container to the main container.
        this.main.appendChild(this.resultView);

        // Create the result graph.
        this.createGraph(result);
    }

    /**
     * Removes the result view from the DOM.
     */
    deleteView() {
        // If the result view is null, return early.
        if(this.resultView === null) return;
        // Remove the result view from the DOM.
        this.resultView.remove();
    }

    /**
     * Creates a donut graph to visualize the student's performance.
     * @param {Result} result - The Result object containing the calculated result data.
     */
    createGraph(result) {
        // Initialize arrays for labels and values, and an object for colors.
        const labels = [];
        const values = [];
        const colors = {};

        // Set background and text colors for the graph.
        colors["bgColor"] = "#1d1d1d";
        colors["textColor"] = "#ffffff";
        
        // Add data for correct answers to the graph.
        if (result.correctAnswers > 0) {
            labels.push(this.translations.correctAnswers);
            colors[this.translations.correctAnswers] = "#5454bf";
            values.push(result.correctAnswers);
        }
        // Add data for wrong answers to the graph.
        if (result.wrongAnswers > 0) {
            labels.push(this.translations.wrongAnswers);
            colors[this.translations.wrongAnswers] = "#bd1c1c";
            values.push(result.wrongAnswers);
        }
        // Add data for unanswered questions to the graph.
        if (result.unanswered > 0) {
            labels.push(this.translations.unanswered);
            colors[this.translations.unanswered] = "#b7b5b5";
            values.push(result.unanswered);
        }

        // Create the donut graph using the provided data.
        createDonutGraph(labels, colors, values, this.translations.studentPerformance, "graph-result");
    }

    /**
     * Adds event listeners to the result view.
     * @param {Object} htmlElements - An object containing references to various HTML elements.
     * @param {QuestionController} questionController - The controller for managing questions.
     * @param {ResultController} resultController - The controller for managing results.
     */
    addEventListeners(htmlElements, questionController, resultController) {
        // Add event listeners for editing individual questions.
        this.addStudentAnswersEventListener(htmlElements.editQuestionPopup, questionController, resultController);
        // Add event listeners for editing all questions and recalculating the result.
        this.addButtonsEventListener(htmlElements.editAllQuestionsPopup, resultController);
        // Add event listener for saving the result.
        this.addSaveButtonEventListener(resultController);
        // Add event listener for loading the result.
        this.addLoadButtonEventListener(resultController);
    }

    /**
     * Adds event listeners for editing individual questions.
     * @param {FormPopup} editPopup - The popup used for editing question details.
     * @param {QuestionController} questionController - The controller for managing questions.
     */
    addStudentAnswersEventListener(editPopup, questionController, resultController) {
        // Add a click event listener to the student answers container.
        this.studentAnswers.addEventListener('click', (event) => {
            // Check if the clicked element or its parent is a button.
            const button = event.target.closest('button');
            if (!button) return;

            // Check if the clicked button is within a question card.
            const questionCard = button.closest('.card');
            if (!questionCard) return;

            // Get the question ID from the card's ID.
            const questionId = questionCard.id;
            // If the clicked button is the edit button.
            if (button.id === `${questionId}-btn-edit`) {
                // Get the question data from the question controller.
                const question = questionController.getQuestion(questionId);
                // Load the question data into the edit popup.
                editPopup.loadPopupInputs([question.name, question.studentAnswer, question.answerKey, question.difficulty]);
                // Show the edit popup.
                editPopup.togglePopupVisibility();
                // Set the current question ID in the question controller.
                questionController.currentQuestionId = questionId;
            }
            
            if (button.id === `${questionId}-btn-delete`) {
                // Check if the delete button is within a super-card
                const superCard = questionCard.closest('.super-card');
                if (!superCard) return;
            
                // Get the subject ID from the subject super-card
                const subjectId = superCard.id.split("-")[0];

                resultController.deleteQuestion(subjectId, questionId);
            }
        });
    }

    /**
     * Adds event listeners for editing all questions and recalculating the result.
     * @param {FormPopup} editAllQuestionsPopup - The popup used for editing all questions.
     * @param {ResultController} resultController - The controller for managing results.
     */
    addButtonsEventListener(editAllQuestionsPopup, resultController) {
        // Add a click event listener to the buttons container.
        this.buttons.addEventListener('click', (event) => {
            // Check if the clicked element or its parent is a button.
            const button = event.target.closest('button');
            if(!button) return;

            // If the clicked button is the edit all questions button.
            if (button.id === "btn-edit-allQuestions") {
                // Show the edit all questions popup.
                editAllQuestionsPopup.togglePopupVisibility();
            }
            if (button.id === "btn-delete-allQuestions") {
                // Delete all questions.
                resultController.deleteResult();
            }
        });
    }

    /**
     * Adds an event listener for saving the result.
     * @param {ResultController} resultController - The controller for managing results.
     */
    addSaveButtonEventListener(resultController) {
        // Add a click event listener to the save result button.
        getElementById("btn-save-result").addEventListener('click', () => {
            // Save the result.
            resultController.saveResult();
        });
    }

    /**
     * Adds an event listener for loading the result.
     * @param {ResultController} resultController - The controller for managing results.
     */
    addLoadButtonEventListener(resultController) {
        // Add a click event listener to the load result button.
        getElementById("btn-load-result").addEventListener('click', () => {
            // Load the result.
            resultController.loadResult();
        }); 
    }

}
