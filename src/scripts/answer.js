class Answer{
    static all = [];
    static answersheet = [];
    constructor({question_id, user_id, value}){
        this.user_id = user_id;
        this.question_id = question_id;
        this.value = value;
    }

    static prepareAnswerSheet(answerForm){
        let questionId = answerForm.dataset.questionId;
        let userId = 3;
        let input = answerForm.answer.value;
        this.answersheet.add(new Answer({question_id: questionId, user_id: userId, value: input}));
    }

    static resetAnswerSheet(){
        this.answersheet = [];
    }
}