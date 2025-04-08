import { Result } from "./result.js";
import { QuestionController } from "../Question/questionController.js";
import { ResultView } from "./resultView.js";
import { saveFile, loadFile } from "../../utils/fileUtils.js";
import { NotificationPopup } from "../Popups/notificationPopup.js";

/**
 * The ResultController class manages the calculation, display, saving, and loading of results.
 * It interacts with the SubjectController, QuestionController, and ResultView to handle the result data and UI.
 */
export class ResultController {
    /**
     * Creates a new ResultController instance.
     * @param {SubjectController} subjectController - The controller for managing subjects.
     * @param {Object} htmlElements - An object containing references to various HTML elements.
     * @param {Object} translations - An object containing translations for UI elements.
     */
    constructor(subjectController, htmlElements, translations) {
        /**
         * @type {Object} - An object to store the result data (subjects and questions) for saving.
         *                  It will have the structure:
         *                  {
         *                      subjects: { [subjectId]: subjectData, ... },
         *                      questions: { [questionId]: questionData, ... }
         *                  }
         */
        this.resultToSave = {
            subjects: {},
            questions: {}
        }
        /**
         * @type {SubjectController} - The controller for managing subjects.
         */
        this.subjectController = subjectController;
        /**
         * @type {QuestionController} - The controller for managing questions.
         */
        this.questionController = new QuestionController(htmlElements.editQuestionPopup, translations);
        /**
         * @type {Object} - An object containing references to various HTML elements.
         *                  It is expected to have properties like:
         *                  {
         *                      main: HTMLElement, // The main container element.
         *                      editQuestionPopup: FormPopup, // The popup for editing questions.
         *                      inputStudentAnswers: HTMLInputElement, // The input for student answers.
         *                      inputAnswerKey: HTMLInputElement // The input for answer key.
         *                  }
         */
        this.htmlElements = htmlElements;
        /**
         * @type {Object} - An object containing translations for UI elements.
         *                  It is expected to have properties like:
         *                  {
         *                      windowAlertUnmatchedAnswers: string,
         *                      windowAlertUnmatchedAnswersWithQuestions: string,
         *                      question: string,
         *                      resultLoaded: string, ... other translations
         *                  }
         */
        this.translations = translations;
        /**
         * @type {Array<HTMLElement>} - An array to store the question card elements.
         */
        this.questionCards = [];
        /**
         * @type {ResultView} - The view for displaying the result.
         */
        this.resultView = new ResultView(htmlElements.main, translations);
    }

    /**
     * Adds a result based on student and answer key provided as input strings.
     * @param {string} studentAnswers - A string of student answers (e.g., "AAABBCCDDEE").
     * @param {string} answerKey - A string of answer key (e.g., "AAACCDDEECC").
     */
    addResultFromInput(studentAnswers, answerKey) {
        // Delete any existing result.
        this.deleteResult(false);
        // The total number of questions across all subjects.
        let subjectsQuestions = this.subjectController.getSubjectsQuestionsQuantity(this.subjectController.subjects);
        // Remove any spaces from the input strings.
        studentAnswers = studentAnswers.replaceAll(" ", "");
        answerKey = answerKey.replaceAll(" ", "");

        // Check if the number of student answers matches the number of answer key.
        if (studentAnswers.length != answerKey.length) {
            window.alert(this.translations.windowAlertUnmatchedAnswers + " " + studentAnswers.length + " " + answerKey.length);
            return;
        }
        
        // Check if the number of answers matches the total number of questions.
        if (studentAnswers.length != subjectsQuestions) {
            // Add a generic Subject if no subject was add
            if (subjectsQuestions === 0) {
                this.subjectController.addGenericSubject(studentAnswers.length);
            }
            else {
                window.alert(this.translations.windowAlertUnmatchedAnswersWithQuestions + " " + subjectsQuestions + " " + studentAnswers.length);
                return;
            }
        }

        // Add each question to the question controller.
        for (let i = 0; i < studentAnswers.length; i++) {
            this.questionController.addQuestion([`${this.translations.question} ${i+1}`, studentAnswers[i], answerKey[i]]);
        }
        this.questionCards = Array.from(this.questionController.questionsCard.childNodes); // questionsCard.childNodes is empty out after the assign

        this.#addResult();
    }

    /**
     * Adds a result based on an object containing question data and another containing subject data.
     * @param {Object} subjects - A object where keys are subject IDs and values are subject data arrays.
     *                           Each subject data array should be in the format: [name, questionsQuantity, questionType, questionValue, wrongPenalty] 
     * @param {Object} questions - An object where keys are question IDs and values are question data arrays.
     *                            Each question data array should be in the format: [name, studentAnswer, answerKey, difficulty].
     */
    addResultFromObjects(subjects, questions) {

        // Delete any existing result.
        this.deleteResult(false);
        // Delete any existing subjects.
        this.subjectController.deleteSubjects();
        
        // If there are no subjects or questions, return early.
        if(Object.values(subjects).length === 0 && Object.values(questions).length === 0) {
            return;
        }

        // Adds a generic subject if dons't exist
        if (Object.values(subjects).length === 0) {
            this.subjectController.addGenericSubject(Object.values(questions).length, false);
        }
        else {
            // Add each subject from the loaded data.
            for (let subject of Object.values(subjects)) {
                if (subject.isGeneric) {
                    subject.name = this.translations.genericSubject;
                }
                this.subjectController.addSubject(Array.from(Object.values(subject)), false);
            }
        }

        let subjectsQuestions = this.subjectController.getSubjectsQuestionsQuantity(this.subjectController.subjects);
        let questionsQuantity = this.questionController.getQuestionsQuantity(questions);

        if (questionsQuantity == 0) {
            return;
        }

        if (subjectsQuestions != questionsQuantity) {
            window.alert(this.translations.windowAlertUnmatchedAnswersWithQuestions + " " + subjectsQuestions + " " + questionsQuantity);
            return;
        }

        // Add each question to the question controller.
        let questionIndex = 1;
        for (let question of Object.values(questions)) {
            if (question.isGenericName) {
                question.name = `${this.translations.question} ${questionIndex}`;
            }
            this.questionController.addQuestion(Array.from(Object.values(question)));
            questionIndex++;
        }
        this.questionCards = Array.from(this.questionController.questionsCard.childNodes); // questionsCard.childNodes is empty out after the assign

        this.loadInputs(Object.values(questions));
        this.#addResult(false);
    }

    /**
     * Adds the calculated result to the view and sets up event listeners.
     * @param {boolean} showNotification - A flag that indicates if show or not a notification after the finalization. Default value is true.
     * @private
     */
    #addResult(showNotification = true) {
        const result = new Result(this.subjectController.subjects, this.questionController.questions);
        // Updates the results to save
        this.resultToSave.subjects = this.subjectController.subjects;
        this.resultToSave.questions = this.questionController.questions;
        this.saveResultToLocalStorage();

        this.resultView.addView(result, this.subjectController.subjects, this.questionCards);
        this.resultView.addEventListeners(this.htmlElements, this.questionController, this);

        if (showNotification) new NotificationPopup(this.translations.resultCalculated, "success");
    }

    /**
     * Edits the current result, recalculates it, and updates the view.
     */
    editResult() {
        this.addResultFromObjects(this.subjectController.subjectsCopy, this.questionController.questionsCopy);
        new NotificationPopup(this.translations.resultRecalculated, "success");
    }

    /**
     * Edit the question and updates the result.
     * @param {Array} data - An array containing the updated question data: [name, studentAnswer, answerKey, difficulty]. 
     */
    editQuestion(data) {
        this.questionController.editQuestion(data, true);
        this.addResultFromObjects(this.subjectController.subjectsCopy, this.questionController.questionsCopy);
    }

    /**
     * Edits all questions with the criteria and updates de result.
     * @param {Array} data - An array containing the edit parameters: [studentAnswer, answerKey, difficulty, criteria, criteriaValue]. 
     */
    editAllQuestions(data) {
        this.questionController.editAllQuestions(data, true);
        this.addResultFromObjects(this.subjectController.subjectsCopy, this.questionController.questionsCopy);
    }

    /**
     * Deletes the current result and removes the corresponding UI elements.
     */
    deleteResult(cleanInputs = true) {
        // If there are no questions, return early.
        if(this.questionController.questions === null) return;

        // Delete each question from the question controller.
        for (let questionId of Object.keys(this.questionController.questions)) {
            this.questionController.deleteQuestion(questionId);
        }

        this.resultView.deleteView();
        if (cleanInputs) this.loadInputs([]);
    }

    /**
     * Deletes the target question and decrease the subject questions quantity or deletes the subject.
     */ 
    deleteQuestion(subjectId, questionId) {
        // If is the last question, delete all result
        if (this.questionController.getQuestionsQuantity(this.questionController.questions) === 1) {
            resultController.deleteResult();
            this.subjectController.deleteSubjects();

            return;
        }

        // Delete the subject if is the last question of it
        else if (this.subjectController.getSubject(subjectId).questionsQuantity === 1) {
            this.questionController.deleteQuestion(questionId);
            this.subjectController.deleteSubject(subjectId);

            this.addResultFromObjects(this.subjectController.subjectsCopy, this.questionController.questionsCopy);

            return;
        }

        this.questionController.deleteQuestion(questionId);
        this.subjectController.getSubject(subjectId).questionsQuantity -= 1;

        this.addResultFromObjects(this.subjectController.subjectsCopy, this.questionController.questionsCopy);
    }

    /**
     * Saves the current result data to a JSON file.
     */
    saveResult() {
        // Save the result data as a JSON file.
        saveFile(JSON.stringify(this.resultToSave, null, 4), "result", "application/json");
    }

    /**
     * Saves the current result data to the local storage for cache purpose
     */
    saveResultToLocalStorage() {
        // Store the current subjects and questions for saving.
        this.subjectController.saveSubjectsToLocalStorage();
        this.questionController.saveQuestionsToLocalStorage();
    }

    /**
     * Loads a result from a JSON file and updates the UI.
     * @async
     */
    async loadResult() {
        let studentAnswers = [];
        let answerKey = [];

        try {
            var fileContent = await loadFile(".json");
            var data = JSON.parse(fileContent);

        } catch (error){
            console.error("Error parsing JSON:", error);
            window.alert(this.translations.windowAlertInvalidJsonFile);
            return; // Exit the function if there's an error
        }

        // Add the result based on the loaded subjects and questions.
        this.addResultFromObjects(data.subjects, data.questions);

        new NotificationPopup(this.translations.resultLoaded, "success");
    }

    /**
     * Loads the result from the local storage and updates the UI
     */
    loadResultFromLocalStorage() {
        let subjects = this.subjectController.loadSubjectsFromLocalStorage();
        let questions = this.questionController.loadQuestionsFromLocalStorage();

        if (questions !== null) {
            this.loadInputs(Object.values(questions));
        }

        if (subjects !== null) {
            this.addResultFromObjects(subjects, questions);
        }
    }

    /**
     * Loads the student answers and answer key inputs with the questions objects
     * @param {Array} questions - A array of questions objects with at least: [studentAnswer] and [answerKey] attributes. 
     */
    loadInputs(questions) {
        let studentAnswers = [];
        let answerKey = [];

        if(questions.length !== 0) {
            for (let question of questions) {
                studentAnswers.push(question.studentAnswer);
                answerKey.push(question.answerKey);
            }
        }

        this.htmlElements.inputStudentAnswers.value = studentAnswers.join("");
        this.htmlElements.inputAnswerKey.value = answerKey.join("");
    }
}
