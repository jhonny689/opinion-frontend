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
        this.prototype.setupDragAndDrop();
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
        this.createAndAppendQuest(Qtext, card);

        for(let option of Qoptions.split(', ')){
            this.createAndAppendInput("radio", Qid, option, card);
        }
        console.log('card', card);
        
        return card;
    }

    static yesOrNo(Qid, Qtext){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);

        this.createAndAppendInput("radio", Qid, "Yes", card);
        this.createAndAppendInput("radio", Qid, "No", card);
        
        return card;
    }
    static qWMA(Qid, Qtext, Qoptions){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);

        for(let option of Qoptions.split(', ')){
            this.createAndAppendInput("checkbox", Qid, option, card);
        }
        console.log('card', card);
        
        return card;
    }
    static ratingScale(Qid, Qtext){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);

        card.append(this.createScale(Qid));

        return card;
    }

    static likertScale(Qid, Qtext){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);
        const likert = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

        for(let i = 0; i < 5; i++){
            this.createAndAppendInput("radio", Qid, likert[i], card);
        }

        return card;
    }
    static dropDown(Qid, Qtext, Qoptions){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);

        card.append(this.buildDropDown(Qid, Qoptions));
        return card;
    }
    static openEnded(Qid, Qtext){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);

        card.append(document.createElement('textarea'));

        return card;
    }
    static ranking(Qid, Qtext, Qoptions){
        const card = document.createElement('div');
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
    static imageChoice(Qid, Qtext, Qoptions){
        const card = document.createElement('div');
        this.createAndAppendQuest(Qtext, card);

        //todo: add the Options  building for photos;

        return card;
    }
    static slider(Qid, Qtext){
        const card = document.createElement('div');
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
        option.name = name;
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
        rangeInput.min="1";
        rangeInput.max="100";
        rangeInput.value = "50";
        rangeInput.classList.add("slider");
        rangeInput.classList.id = Qid;
        
        return rangeInput;
    }

    static buildDropDown(Qid, Qoptions){
        const selectEL = document.createElement('select');
        selectEL.name = Qid;
        selectEL.id = Qid;
        
        for(let option of Qoptions.split(', ')){
            selectEL.innerHTML += `<option value="${option}">${option}</option>`;
        }

        return selectEL;
    }
}