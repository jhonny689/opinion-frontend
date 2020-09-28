class Question{
    static all = [];
    
    constructor({id, survey_id, question_type_id, question_text, choices}){
        this.id = id;
        this.survey_id = survey_id;
        this.htmlEL = Question.buildHTML(id, question_type_id, question_text, choices);
        
        Question.all.push(this);
    };

    static renderAll(dbQuestions, container){
        Question.all = [];
        for(let question of dbQuestions){
            console.log(question);
            new Question(question);
        }
        this.fillContainer(container);
    };

    static buildHTML(Qid, Qtype, Qtext, Qchoices){
        const qHTML = document.createElement('div');
        qHTML.classList.add('question-card');

        let qBody = "";
        switch(Qtype){
            case 1:
                qBody = this.qWSA(Qid, Qtext, Qchoices);
                break;
            case 2:
                qBody = this.yesOrNo(Qid, Qtext);
                break;
            case 3:
                qBody = this.qWMA(Qid, Qtext, Qchoices);
                break;
            case 4:
                qBody = this.ratingScale(Qid, Qtext);
                break;
            case 5:
                qBody = this.likertScale(Qid, Qtext);
                break;
            case 6:
                qBody = this.dropDown(Qid, Qtext, Qchoices);
                break;
            case 7:
                qBody = this.openEnded(Qid, Qtext);
                break;
            case 8:
                qBody = this.ranking(Qid, Qtext, Qchoices);
                break;
            case 9:
                qBody = this.imageChoice(Qid, Qtext, Qchoices);
                break;
            case 10:
                qBody = this.slider(Qid, Qtext);
                break;
            default:
                break;
        }
        console.log('qBody before append', qBody);
        qHTML.appendChild(qBody);
        console.log('qHTML after append', qHTML);
        return qHTML;
    };

    static fillContainer(container){
        for(let quest of this.all){
            console.log("my question html element:",quest.htmlEL)
            container.appendChild(quest.htmlEL);
        }
    };

    static qWSA(Qid, Qtext, Qoptions){
        const card = document.createElement('div');
        const text = document.createElement('label');
        const brk = document.createElement('br');
        console.log(brk)
        text.innerText = Qtext;
        card.append(text);
        card.append(brk);
        for(let option of Qoptions.split(', ')){
            let radio = document.createElement('input');
            radio.type ="radio";
            radio.name =`"${Qid}"`;
            radio.value = option;
            let label = document.createElement('label');
            label.for = `"${Qid}"`;
            label.innerText = option;
            
            card.append(radio,label,brk);
        }
        console.log('card', card)
        return card;
    }

    static yesOrNo(Qid, Qtext){
        const divvy = document.createElement('div');
        divvy.innerHTML = Qtext;
        return divvy;
    }
    static qWMA(Qtext){

    }
    static ratingScale(Qtext){

    }
    static likertScale(Qtext){

    }
    static dropDown(Qtext, Qoptions){

    }
    static openEnded(Qtext){

    }
    static ranking(Qtext){

    }
    static imageChoice(Qtext, Qoptions){

    }
    static slider(Qtext){

    }

}