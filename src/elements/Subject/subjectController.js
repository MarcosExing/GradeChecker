import { Subject } from './subject.js';
import { SubjectCard } from './subjectCard.js';
import { saveFile, loadFile } from '../../Utils/fileUtils.js';
import { NotificationPopup } from '../Popups/notificationPopup.js';

/**
 * The SubjectController class manages a collection of Subject objects and their corresponding SubjectCard elements.
 * It handles adding, editing, deleting, saving, and loading subjects, as well as updating the UI to reflect these changes.
 */
export class SubjectController {
    /**
     * Creates a new SubjectController instance.
     * @param {FormPopup} editPopup - The popup used for editing subject details.
     * @param {HTMLElement} subjectsCard - The container element for all subject cards.
     */
    constructor(editPopup, subjectsCard, translations) {
        /**
         * @type {Object.<string, Subject>} - An object to store the subjects, keyed by their unique IDs.
         */
        this.subjects = {};
        /**
         * @type {number} - The total number of questions across all subjects.
         * @private
         */
        this._subjectsQuestions = 0;
        /**
         * @type {string} - The ID of the subject currently being edited.
         */
        this.currentEditId = '';
        /**
         * @type {Object} - An object containing translations for UI elements.
         */
        this.translations = translations;
        /**
         * @type {FormPopup} - The popup used for editing subject details.
         */
        this.editPopup = editPopup;
        /**
         * @type {HTMLElement} - The container element for all subject cards.
         */
        SubjectCard.subjectsCard = subjectsCard;
    }
    
    /**
     * Adds a new subject to the collection and creates a corresponding card in the UI.
     * @param {Array} data - An array containing the subject's data: [name, questionsQuantity, questionType, questionValue, wrongPenalty].
     * @returns {string} The ID of the newly created subject.
    */
   addSubject(data) {
        const subjectId = this.generateSubjectId();
        this.subjects[subjectId] = new Subject(data);
        this.saveSubjectsToLocalStorage();
        
        // Create a new SubjectCard element for the subject.
        SubjectCard.addSubjectCard(subjectId, this.getSubject(subjectId));
        // Add event listeners to the new subject card for editing and deleting.
        SubjectCard.addEventListeners(subjectId, this.getSubject(subjectId), this.editPopup, this);
        
        // Return the ID of the newly created subject.
        return subjectId;
    }

    /**
     * Adds a new generic subject to the collection and creates a corresponding card in the UI
     * @param {number} numberQuestions - The total number of questions 
     */
    addGenericSubject(numberQuestions) {
        let isGeneric = true;
        this.addSubject([this.translations.genericSubject, numberQuestions, "multiple", 1, 0, isGeneric]);

        new NotificationPopup(this.translations.genericSubjectNotificationPopup, "warning");
        console.log(this.loadSubjectsFromLocalStorage());
    }

    /**
     * Edits an existing subject in the collection and updates its card in the UI.
     * @param {Array} data - An array containing the updated subject data: [name, questionsQuantity, questionType, questionValue, wrongPenalty].
     */
    editSubject(data) {
        // Update the subject's data in the collection.
        this.subjects[this.currentEditId].update(data);
        this.saveSubjectsToLocalStorage();
        // Update the subject's card in the UI.
        SubjectCard.editSubjectCard(this.currentEditId, this.getSubject(this.currentEditId));
    }

    /**
     * Deletes a subject from the collection and removes its card from the UI.
     * @param {string} subjectId - The ID of the subject to delete.
     */
    deleteSubject(subjectId) {
        // If the subjectId is null, return early.
        if (subjectId === null) return;
        
        // Remove the subject from the collection.
        delete this.subjects[subjectId];
        // Remove the subject's card from the UI.
        SubjectCard.deleteSubjectCard(subjectId);
    }
    
    /**
     * Deletes all subjects from the collection and removes their cards from the UI.
    */
    deleteSubjects() {
        // Iterate over each subject in the collection.
        for (let subjectId of Object.keys(this.subjects)) {
            // Remove the subject's card from the UI.
            SubjectCard.deleteSubjectCard(subjectId);
        }
        
        // Clear the subjects collection.
        this.subjects = {};
    }
    
    
    /**
     * Saves the current subjects data to a JSON file.
    */
   saveSubjects() {
       // Check if there are any subjects to save.
       if(Object.keys(this.subjects).length === 0) {
           // Show an alert if there are no subjects to save.
           window.alert(this.translations.windowAlertNoSubjectsToSave);
        }
        else{
            // Save the subjects data as a JSON file.
            saveFile(JSON.stringify(this.subjects, null, 4), 'Subjects', 'application/json');
        }
    }
    
    /**
     * Saves the current subjects in the local storage for cache
     */
    saveSubjectsToLocalStorage() {
        localStorage.setItem('subjects', JSON.stringify(this.subjects));
    }

    /**
     * Loads subjects from a JSON file and updates the UI.
     * @async
    */
   async loadSubjects() {
       try {
           // Load the file content.
           var fileContent = await loadFile(".json");
           // Parse the JSON content.
            var data = JSON.parse(fileContent);

        } catch (error){
            // Log any errors to the console.
            console.error("Error parsing JSON:", error);
            // Show an alert if the file is not a valid JSON.
            window.alert(this.translations.windowAlertInvalidJsonFile);
            return; // Exit the function if there's an error
        }

        // Delete any existing subjects.
        this.deleteSubjects();
        // Add each subject from the loaded data.
        for (let key of Object.keys(data)){
            this.addSubject(Object.values(data[key]));
        }
    }

    /**
     * Loads the subjects saved in local storage
     * @returns {Object} A Object containing the subjects saved in the local storage
     */
    loadSubjectsFromLocalStorage() {
        if (localStorage.getItem('subjects') !== null) {
            return JSON.parse(localStorage.getItem('subjects'));
        }
        return null;
    }
    
    /**
     * Retrieves a subject from the collection by its ID.
     * @param {string} subjectId - The ID of the subject to retrieve.
     * @returns {Subject} The Subject object with the specified ID.
    */
   getSubject(subjectId) {
       return this.subjects[subjectId];
    }
    
    /**
     * 
     * @param {Object} subjects -  A Object containing Subject's
     * @returns the total number of questions across all subjects.
     */
    getSubjectsQuestionsQuantity(subjects) {
        this._subjectsQuestions = 0;
        for (let subject of Object.values(subjects)) {
            this._subjectsQuestions += subject.questionsQuantity;
        }
 
        return this._subjectsQuestions;
    }

    /**
     * Generates a unique ID for a new subject.
     * @returns {string} The generated subject ID.
     */
    generateSubjectId() {
        // Create a new ID based on the number of existing subjects.
        return `Subject${Object.keys(this.subjects).length + 1}`;
    }
}
