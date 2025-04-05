/**
 * Represents a subject in a test or exam, including its name, number of questions, question type, question value, and cost for wrong answers.
 */
export class Subject {
    /**
     * Creates a new Subject instance.
     * @param {Array} data - An array containing the subject's data: [name, questionsQuantity, questionType, questionValue, wrongPenalty].
     *                       - name: The name of the subject (string).
     *                       - questionsQuantity: The number of questions in the subject (number).
     *                       - questionType: The type of questions (e.g., "multiple", "trueFalse") (string).
     *                       - questionValue: The value of each question in the subject (number).
     *                       - wrongPenalty: The cost deducted for each wrong answer (number, optional, defaults to 0).
     * @throws {Error} Throws an error if the data format is invalid.
     */
    constructor(data) {
        this.#fillData(data);
    }

    /**
     * Fills the subject's properties with the provided data.
     * @param {Array} data - An array containing the subject's data: [name, questionsQuantity, questionType, questionValue, wrongPenalty].
     * @throws {Error} Throws an error if the data format is invalid.
     * @private
     */
    #fillData(data) {
        // Check if the data is an array and has at least 5 elements (name, questionsQuantity, questionType, questionValue, wrongPenalty, isGeneric).
        if(!Array.isArray(data) || data.length < 5) {
            throw new Error('Invalid data format');
        }

        /**
         * @type {string} - The name of the subject.
         */
        this.name = data[0];
        /**
         * @type {number} - The number of questions in the subject.
         */
        this.questionsQuantity = Number(data[1]);
        /**
         * @type {string} - The type of questions in the subject.
         */
        this.questionType = data[2];
        /**
         * @type {number} - The value of each question in the subject.
         */
        this.questionValue = Number(data[3]);
        /**
         * @type {number} - The cost deducted for each wrong answer (defaults to 0 if not provided or empty).
         */
        this.wrongPenalty = (data[4]=='' ? 0 : Number(data[4]));
        /**
         * @type {boolean} - A flag to indicate if the subject was automatic generate
         */
        this.isGeneric = data[5] !== null && data[5] !== undefined ? data[5] : false;
    }

    /**
     * Updates the subject's properties with new data.
     * @param {Array} data - An array containing the new subject data: [name, questionsQuantity, questionType, questionValue, wrongPenalty].
     */
    update(data) {
        this.#fillData(data);
    }
}
