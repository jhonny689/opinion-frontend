class Question{
    static all = [];
    
    constructor({id, survey_id, question_type_id, question_text, choices}){
        this.id = id;
        this.survey_id = survey_id;
        this.question_type_id = question_type_id;
        this.htmlEL = Question.buildHTML(id, question_type_id, question_text, choices);
        this.answered = false;
        
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
        qHTML.classList.add('question-card', 'animate__animated');

        let qBody = "";
        switch(Qtype){
            case 1:
                qBody = this.qWSA(Qid, Qtype, Qtext, Qchoices);
                break;
            case 2:
                qBody = this.yesOrNo(Qid, Qtype, Qtext);
                break;
            case 3:
                qBody = this.qWMA(Qid, Qtype, Qtext, Qchoices);
                break;
            case 4:
                qBody = this.ratingScale(Qid, Qtype, Qtext);
                break;
            case 5:
                qBody = this.likertScale(Qid, Qtype, Qtext);
                break;
            case 6:
                qBody = this.dropDown(Qid, Qtype, Qtext, Qchoices);
                break;
            case 7:
                qBody = this.openEnded(Qid, Qtype, Qtext);
                break;
            case 8:
                qBody = this.ranking(Qid, Qtype, Qtext, Qchoices);
                break;
            case 9:
                qBody = this.imageChoice(Qid, Qtype, Qtext, Qchoices);
                break;
            case 10:
                qBody = this.slider(Qid, Qtype, Qtext);
                break;
            default:
                break;
        }
        console.log('qBody before append', qBody);
        qHTML.appendChild(qBody);

        this.addDisabledButton(qHTML, 'Next >>')
        console.log('qHTML after append', qHTML);
        return qHTML;
    };

    static fillContainer(container, index = 0){
        if (index < this.all.length){
            console.log("fillContainer with index = ", index, "and type = ",this.all[index].question_type_id);

            container.appendChild(this.all[index].htmlEL);
            if(this.all[index].question_type_id === 8){
                this.prototype.setupDragAndDrop();
            }
        }else{
            container.appendChild(Question.getLastQuestion());
        }
        
    };

    static getLastQuestion(){
        const qHTML = document.createElement('div');
        qHTML.classList.add('question-card', 'animate__animated');
        const card = document.createElement('div');
        const button_cancel = document.createElement('button');
        button_cancel.classList.add('btn_cancel');
        button_cancel.textContent = "Cancel";
        const button_submit = document.createElement('button');
        button_submit.classList.add('btn_submit');
        button_submit.textContent = "Submit";

        card.append(button_cancel, button_submit);
        qHTML.append(card)
        return qHTML;
    }

    static qWSA(Qid, Qtype, Qtext, Qoptions){
        // const card = document.createElement('div');
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        for(let option of Qoptions.split(', ')){
            this.createAndAppendInput("radio", Qid, option, card);
        }
        console.log('card', card);
        
        return card;
    }

    static yesOrNo(Qid, Qtype, Qtext){
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        this.createAndAppendInput("radio", Qid, "Yes", card);
        this.createAndAppendInput("radio", Qid, "No", card);
        
        return card;
    }

    static qWMA(Qid, Qtype, Qtext, Qoptions){
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        for(let option of Qoptions.split(', ')){
            this.createAndAppendInput("checkbox", Qid, option, card);
        }
        console.log('card', card);
        
        return card;
    }
    static ratingScale(Qid, Qtype, Qtext){
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        card.append(this.createScale(Qid));

        return card;
    }

    static likertScale(Qid, Qtext){
        const likert = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
        const card = document.createElement('form');
        card.dataset.questionId = Qid;

        this.createAndAppendQuest(Qtext, card);

        for(let i = 0; i < 5; i++){
            this.createAndAppendInput("radio", Qid, likert[i], card);
        }

        return card;
    }
    static dropDown(Qid, Qtype, Qtext, Qoptions){
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        card.append(this.buildDropDown(Qid, Qoptions));
        return card;
    }
    static openEnded(Qid, Qtype, Qtext){
        // const card = document.createElement('div');
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;
    
        this.createAndAppendQuest(Qtext, card);
        let input = document.createElement('textarea');
        input.name = "answer";
        card.append(input);

        return card;
    }
    static ranking(Qid, Qtype, Qtext, Qoptions){
        const card = document.createElement('div');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        //todo: add the ranking part;
        const divContainer = document.createElement('div');
        divContainer.classList.add("source-container");

        let index = 0;
        for(let option of Qoptions.split(', ')){
            this.createAndAppendDraggableItem(++index, Qid, option, divContainer);
        }
        card.append(divContainer);
        return card;
    }

    static createAndAppendDraggableItem(index, Qid, option, container){
        const sourceDiv = document.createElement('div');
        sourceDiv.classList.add("source");
        sourceDiv.innerHTML = `<span>${index}</span>`;
        const itemDiv = document.createElement('div');
        itemDiv.classList.add("item");
        itemDiv.innerHTML = `<p>${option}</p>`;

        sourceDiv.append(itemDiv);
        container.append(sourceDiv);

    }
    static imageChoice(Qid, Qtype, Qtext, Qoptions){
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;

        this.createAndAppendQuest(Qtext, card);

        //todo: add the Options  building for photos;

        return card;
    }
    static slider(Qid, Qtype, Qtext){
        const card = document.createElement('form');
        card.dataset.questionId = Qid;
        card.dataset.questionTypeId = Qtype;
        
        this.createAndAppendQuest(Qtext, card);
        
        card.appendChild(this.createSlider());
        
        return card;
    }
    
    static createAndAppendQuest(Qtext, container){
        const text = document.createElement('label');

        text.innerText = Qtext;
        container.append(text);
        container.append(document.createElement('br'));
    }
    static createAndAppendInput(type, name, label, container){
        let option = document.createElement('input');
        option.type = type;
        option.name = "answer";
        option.id = name+label;
        option.value = label;
        let labelTag = document.createElement('label');
        labelTag.htmlFor = name+label;
        labelTag.innerText = label;
        
        container.append(option,labelTag, document.createElement('br'));
    }

    static createScale(Qid){
        const ratingDiv = document.createElement('div');
        ratingDiv.classList.add("rating");
        for(let i = 9; i >= 0; i--){
            this.createAndAppendInput("radio", Qid, i+1, ratingDiv);
        }
        return ratingDiv;
    }
    
    static createSlider(Qid){
        //<input type="range" min="1" max="100" value="50" class="slider" id="myRange">
        //const sliderDiv = document.createElement('div');
        const rangeInput = document.createElement('input');
        rangeInput.type="range";
        rangeInput.name="answer";
        rangeInput.min="1";
        rangeInput.max="100";
        rangeInput.value = "50";
        rangeInput.classList.add("slider");
        rangeInput.classList.id = Qid;
        
        return rangeInput;
    }

    static buildDropDown(Qid, Qoptions){
        const selectEL = document.createElement('select');
        selectEL.name = "answer";
        selectEL.id = Qid;
        
        for(let option of Qoptions.split(', ')){
            selectEL.innerHTML += `<option value="${option}">${option}</option>`;
        }

        return selectEL;
    }

    static addDisabledButton(parentNode, text) {
        const nextButton = document.createElement('button');
        nextButton.classList.add('load-next');
        // nextButton.setAttribute('disabled', 'true');
        nextButton.textContent = text;
        parentNode.appendChild(nextButton);
    }

    static answered(container){
        if(container.matches('div')){
            return true;
        }else if(container.matches('form')){
            
            if(container.answer && container.answer.value){
                return true;
            }else{
                let arr = [...container.answer];
                return arr.some(cb => cb.checked == true);
            }
        }
    }
}