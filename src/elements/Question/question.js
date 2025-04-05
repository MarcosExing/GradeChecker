/**
 * Represents a single question in a test or exam.
 */
export class Question {
    /**
     * Creates a new Question instance.
     * @param {Array} data - An array containing the question's data: [name, studentAnswer, correctAnswer, difficulty].
     *                       - name: The name or identifier of the question (string).
     *                       - studentAnswer: The student's answer to the question (string).
     *                       - correctAnswer: The correct answer to the question (string).
     *                       - difficulty: The difficulty level of the question (string, optional, defaults to "medium").
     *                       - isGenericName: A flag to tell if the question has the automate generic name (boolean, optional, defaults to true).
     * @throws {Error} Throws an error if the data format is invalid.
     */
    constructor(data) {
        this.#fillData(data);
    }

    /**
     * Fills the question's properties with the provided data.
     * @param {Array} data - An array containing the question's data: [name, studentAnswer, correctAnswer, difficulty].
     * @throws {Error} Throws an error if the data format is invalid.
     * @private
     */
    #fillData(data) {
        // Check if the data is an array and has at least 3 elements (name, studentAnswer, correctAnswer).
        if (!Array.isArray(data) || data.length < 3) {
            console.log(data);
            throw new Error('Invalid data format');
        }

        /**
         * @type {string} - The name or identifier of the question.
         */
        this.name = data[0];
        /**
         * @type {string} - The student's answer to the question (converted to uppercase).
         */
        this.studentAnswer = data[1].toUpperCase();
        /**
         * @type {string} - The correct answer to the question (converted to uppercase).
         */
        this.correctAnswer = data[2].toUpperCase();
        /**
         * @type {string} - The difficulty level of the question (defaults to "medium" if not provided).
         */
        this.difficulty = data[3] == null ? "medium" : data[3];
        /**
         * @type {boolean} - A flag to indicate if the question has a automatic generate name
         */
        this.isGenericName = data[4] !== null && data[4] !== undefined ? data[4] : true;
        /**
         * @type {boolean|null} - The status of the question:
         *                         - true: if the student's answer matches the correct answer or if the correct answer is "_".
         *                         - null: if the student's answer is "_".
         *                         - false: otherwise.
         */
        this.status;
        if (this.studentAnswer === this.correctAnswer || this.correctAnswer === "_") {
            this.status = true;
        } else if (this.studentAnswer === "_") {
            this.status = null;
        } else {
            this.status = false;
        }
    }

    /**
     * Updates the question's properties with new data.
     * @param {Array} data - An array containing the new question data: [name, studentAnswer, correctAnswer, difficulty].
     */
    update(data) {
        this.#fillData(data);
    }
}
