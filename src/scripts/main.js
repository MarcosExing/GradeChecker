import { SubjectController } from "../elements/Subject/subjectController.js";
import { ResultController } from "../elements/Result/resultController.js";
import { getElementById } from "../utils/domUtils.js";
import { DOM_IDS } from "./constants.js";
import { FormPopup } from "../elements/Popups/formPopup.js";
import { MousePopup } from "../elements/Popups/mousePopup.js";
import { Translation } from "./translation.js";

class AppInitializer {
    constructor() {
        this.#initializeTranslation().then(() => {
            this.#initializePopups();
            this.#initializeSubjectController(this.translation.translations);
            this.#initializeResultController(this.translation.translations);
            this.#setupPopupEventListeners();
            this.#setupEventListeners(this.translation.translations);
        });
    }
    
    async #initializeTranslation() {
        // Load the user's preferred language or fallback to default
        const storedLanguage = localStorage.getItem('language');
        const defaultLanguage = "en";
        const userLanguage = navigator.language;
        const initialLanguage = storedLanguage || userLanguage || defaultLanguage;

        // Create a new translation instance and load the translations
        this.translation = new Translation(initialLanguage);
        await this.translation.loadTranslations();
        this.translation.translatePage();

        // Set the language select dropdown to the current language
        getElementById('language-select').value = initialLanguage;
    }

    #initializePopups() {
        // Initialize all the popups used in the application
        this.popups = {
            editSubject: new FormPopup(getElementById(DOM_IDS.POPUP_EDIT_SUBJECT)),
            addSubject: new FormPopup(getElementById(DOM_IDS.POPUP_ADD_SUBJECT)),
            editQuestion: new FormPopup(getElementById(DOM_IDS.POPUP_EDIT_QUESTION)),
            editAllQuestions: new FormPopup(getElementById(DOM_IDS.POPUP_EDIT_ALL_QUESTIONS))
        };
    }

    #initializeSubjectController(translations) {
        this.subjectController = new SubjectController(this.popups.editSubject, getElementById(DOM_IDS.SUBJECTS_CARD), translations);
    }

    #initializeResultController(translations) {
        const htmlElements = {
            main: document.querySelector('main'),
            editQuestionPopup: this.popups.editQuestion,
            editAllQuestionsPopup: this.popups.editAllQuestions,
            inputStudentAnswers: getElementById(DOM_IDS.INPUT_STUDENT_ANSWERS),
            inputAnswerKey: getElementById(DOM_IDS.INPUT_CORRECT_ANSWERS)
        }
        this.resultController = new ResultController(this.subjectController, htmlElements, translations);
        // If the result is saved on the local storage, loads it
        this.resultController.loadResultFromLocalStorage();
    }

    #setupPopupEventListeners() {
        this.popups.editSubject.setHandlers(this.subjectController.editSubject.bind(this.subjectController));

        this.popups.addSubject.setHandlers(this.subjectController.addSubject.bind(this.subjectController), true);

        this.popups.editQuestion.setHandlers(this.resultController.editQuestion.bind(this.resultController));

        this.popups.editAllQuestions.setHandlers(this.resultController.editAllQuestions.bind(this.resultController), true);

        // Show or hide elements based on the selected criteria in the editAllQuestions popup
        this.popups.editAllQuestions.showElementOnValues(getElementById(DOM_IDS.EDIT_ALL_QUESTIONS_CRITERIA), 
        getElementById(DOM_IDS.EDIT_ALL_QUESTIONS_VALUE_1), 
        ["studentAnswer"]);
        this.popups.editAllQuestions.showElementOnValues(getElementById(DOM_IDS.EDIT_ALL_QUESTIONS_CRITERIA), 
        getElementById(DOM_IDS.EDIT_ALL_QUESTIONS_VALUE_2), 
        ["answerKey"]);
        this.popups.editAllQuestions.showElementOnValues(getElementById(DOM_IDS.EDIT_ALL_QUESTIONS_CRITERIA), 
        getElementById(DOM_IDS.EDIT_ALL_QUESTIONS_VALUE_3), 
        ["difficulty"]);
    }

    #setupEventListeners(translations) {
        // Set up event listeners for the main application elements
        
        // Language change event
        getElementById('language-select').addEventListener('change', (event) => {
            localStorage.setItem('language', event.target.value);
            window.location.reload();
        });

        // Add subject button event
        getElementById(DOM_IDS.BTN_ADD_SUBJECT).addEventListener('click', () => {
            this.popups.addSubject.togglePopupVisibility();
        });

        // Save subjects button event
        getElementById(DOM_IDS.BTN_SAVE_SUBJECTS).addEventListener('click', () => {
            this.subjectController.saveSubjects();
        });

        // Load subjects button event
        getElementById(DOM_IDS.BTN_LOAD_SUBJECTS).addEventListener('click', () => {
            this.subjectController.loadSubjects();
        });

        // Mouse popups for input fields
        new MousePopup(getElementById(DOM_IDS.INPUT_STUDENT_ANSWERS), translations.mousePopupStudentAnswerTitle, translations.mousePopupStudentAnswerDescription);
        new MousePopup(getElementById(DOM_IDS.INPUT_CORRECT_ANSWERS), translations.mousePopupAnswerKeyTitle, translations.mousePopupAnswerKeyDescription);

        // Calculate result form submission event
        getElementById(DOM_IDS.FORM_CALCULATE_RESULT).addEventListener('submit', (event) => {
            event.preventDefault();
            this.resultController.addResultFromInput(
                getElementById(DOM_IDS.INPUT_STUDENT_ANSWERS).value,
                getElementById(DOM_IDS.INPUT_CORRECT_ANSWERS).value
            );
        });

        // Load result button event
        getElementById(DOM_IDS.BTN_LOAD_RESULT_2).addEventListener('click', () => {
            this.resultController.loadResult();
        });
    }
}

// Initialize the application
const app = new AppInitializer();
