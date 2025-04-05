export class Result {
    /**
     * Creates a new Result instance and calculates the student's performance based on the provided subjects and questions.
     * @param {Object} subjects - An object containing the subjects, where keys are subject IDs and values are subject objects.
     * @param {Object} questions - An object containing the questions, where keys are question IDs (e.g., "Question1") and values are Question objects.
     */
    constructor(subjects, questions) {
        this.#calculateResult(subjects, questions);
    }

    /**
     * Calculates the student's overall result and performance in each subject.
     * @param {Object} subjects - An object containing the subjects, where keys are subject IDs and values are subject objects.
     * @param {Object} questions - An object containing the questions, where keys are question IDs (e.g., "Question1") and values are Question objects.
     * @private
     */
    #calculateResult(subjects, questions) {
        /**
         * @type {number} - The student's overall grade (percentage).
         */
        this.studentGrade = 0;
        /**
         * @type {number} - The total points the student earned.
         */
        this.points = 0;
        /**
         * @type {number} - The maximum possible points.
         */
        this.maxPoints = 0;
        /**
         * @type {number} - The number of correct answers.
         */
        this.correctAnswers = 0;
        /**
         * @type {number} - The number of wrong answers.
         */
        this.wrongAnswers = 0;
        /**
         * @type {number} - The number of unanswered questions.
         */
        this.unanswered = 0;
        /**
         * @type {Object.<string, {points: number, grade: number}>} - An object containing the student's performance in each subject.
         *                                                              Keys are subject IDs, and values are objects with 'points' and 'grade' properties.
         */
        this.subjectsPerformance = {};
        
        // Initialize a counter for question IDs.
        let i = 1;

        // Iterate over each subject.
        for (let key of Object.keys(subjects)) {
            // Get the current subject.
            let subject = subjects[key];
            /**
             * @type {number} - The number of wrong answers in the current subject.
             */
            let subjectWrongAnswers = 0;
            /**
             * @type {{points: number, grade: number}} - An object to store the student's performance in the current subject.
             */
            let subjectPerformance = {
                points: 0,
                grade: 0
            };
            /**
             * @type {number} - The maximum possible points for the current subject.
             */
            let subjectMaxPoints = subject.questionValue * subject.questionsQuantity;

            // Iterate over each question in the current subject.
            for (let j = 0; j < subject.questionsQuantity; j++) {
                // Check the status of the current question.
                if (questions[`Question${i}`].status === true) {
                    // If the answer is correct, add the question's value to the total points and subject's points.
                    this.points += subject.questionValue * 1;
                    subjectPerformance.points += subject.questionValue * 1;
                    
                    this.correctAnswers += 1;
                }
                else if (questions[`Question${i}`].status === null) {
                    // If the question is not answered, increment the unanswered count.
                    this.unanswered += 1;
                }
                else {
                    // If the answer is wrong, increment the wrongAnswers count and the subject's wrong answers count.
                    this.wrongAnswers += 1;
                    subjectWrongAnswers += 1;
                }
                // Add the question's value to the maximum possible points.
                this.maxPoints += subject.questionValue * 1;
                // Increment the question ID counter.
                i++;
            }

            // Deduct points for wrong answers based on the subject's wrongPenalty.
            this.points -= subject.wrongPenalty * subjectWrongAnswers;
            subjectPerformance.points -= subject.wrongPenalty * subjectWrongAnswers;
            // Calculate the subject's grade as a percentage.
            subjectPerformance.grade = subjectPerformance.points/subjectMaxPoints * 100;
            // Store the subject's performance in the subjectsPerformance object.
            this.subjectsPerformance[key] = subjectPerformance;
        }

        // Calculate the student's overall grade as a percentage.
        this.studentGrade = this.points/this.maxPoints * 100;

    }
}
