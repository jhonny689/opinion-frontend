class Answer{
    static all = [];
    static answersheet = {answers: []} ;
    constructor({question_id, user_id, value}){
        this.user_id = user_id;
        this.question_id = question_id;
        this.value = value;

        Answer.all.push(this);
    }

    static prepareAnswerSheet(answerForm){
        console.clear();
        console.log("got answer form to prepare answer sheet", answerForm);
        let questionId = answerForm.dataset.questionId;
        let userId = 3;
        let input = this.grabAnswerValue(answerForm);
        this.answersheet.answers.push(new Answer({question_id: questionId, user_id: userId, value: input}));
    }

    static grabAnswerValue(answerForm){
        console.log("question type  = ", answerForm.dataset.questionTypeId)
        switch(answerForm.dataset.questionTypeId){
            case "3": 
                return this.grabCheckboxValue(answerForm);
            case "8":
                return this.grabRankingValue(answerForm);
            case "9":
                return this.grabImageChoiceValue(answerForm);
            default:
                return answerForm.answer.value;
        }
    }

    static grabCheckboxValue(checkboxForm){
        console.log("grabbing checkbox value");
        let arr = [...checkboxForm.answer].filter(cb => cb.checked == true);
        return arr.map(cbItem => cbItem.value);
    }

    static grabRankingValue(rankingForm){
        console.log("grabbing ranking value");
        let itemCards = [...rankingForm.querySelectorAll('.item p')];
        let items = {};
        for(let i = 0; i< itemCards.length; i++)
            items[itemCards[i].innerText] = itemCards.length - i;
        return items;
    }

    static grabImageChoiceValue(image){
        console.log("grabbing Image choice value");
    }

    static submitAnswerSheet(){
        console.dir(this.answersheet);
        let options = buildOptions('POST',this.answersheet);
        debugger;
        dbConnect(getURL('responses/'),options);
    }
    
    static resetAnswerSheet(){
        this.answersheet.answers = [];
    }
}