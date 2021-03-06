class Survey{
    static all = [];
    
    constructor({id, title, surveyor, description, due_date_formatted, survey_category_id}){
        this.id = id;
        this.title = title;
        this.surveyor = surveyor;
        this.description = description;
        this.due_date = due_date_formatted;
        this.survey_category_id = survey_category_id;

        Survey.all.push(this);
    }
    render_me(){
        const tableRow = document.createElement('tr');
        tableRow.dataset.surveyId= this.id;
        console.log(this.id);

        tableRow.innerHTML = `
            <td> ${this.title} </td>
            <td> ${this.description}</td>
            <td> ${this.surveyor}</td>
            <td> ${this.due_date}</td>
        `

        return tableRow;
    }

    static render(container, surveyCollection){
        //I added a 2nd parameter and the code below to be able to reuse this function.
        //It shouldn't affect previous use of the function. -roy
        let surveys = surveyCollection || this.all;
        
        for(let survey of surveys){
            container.append(survey.render_me())
        }
    }

    static createAll(dbObjects, container){
        console.log("creating surveyors");
        // debugger
        Survey.all =[];
        let dbOBJ = dbObjects["data"];
        for(let dbSurvey of dbOBJ){
            // debugger;
            new Survey(dbSurvey.attributes);
        }
        Survey.render(container);
    }

    static parseQuestions(serveyId, container){
        const questionsPromise = dbConnect(getURL(`questions?survey=${serveyId}`));
        console.log("before calling renderAll in the promise.then")
        questionsPromise.then(dbQuestions => Question.renderAll(dbQuestions, container));
    }

    static renderAdminSurveys(dbObject, container){
        const surveyUl = document.createElement('Ul');

        for (const survey of dbObject){
            const surveyLi = this.createSurveyLi(survey);
            surveyUl.append(surveyLi);
        }
        
        container.append(surveyUl)
    }

    static createSurveyLi(survey){
        const surveyLi = document.createElement('li');
        surveyLi.textContent = survey.title;
        surveyLi.dataset.id = survey.id; 
        surveyLi.classList.add('admin-survey-list');
        return surveyLi;
    }

    static thankYou(container){
        container.innerHTML = "";
        const text = document.createElement('h1');
        text.textContent = 'Thank You'
        text.classList.add('animate__animated', 'animate__jackInTheBox');
        container.append(text);
    }
    static submit(jsonSurvey){
        let options = buildOptions('POST',jsonSurvey);
        //debugger;
        dbConnect(getURL('surveys/'),options);
    }

    // static prepareJsonSurvey(title, description, date, status, userId){
    //     return {
    //         title: title,
    //         description: description,
    //         due_date: date,
    //         status: status,
    //         user_id: userId,
    //         questions: Question.surveyTemp
    //     }
    // }

    static loadSurveyDraft(surveyLi, container) {
        container.innerHTML = '';
        const surveyTitle = document.createElement('h2');
        surveyTitle.textContent = surveyLi.textContent;
        const surveyId = surveyLi.dataset.id;
        container.append(surveyTitle);

        Survey.loadDraftQuestions(surveyId, container);
    }

    static loadDraftQuestions(surveyId, container) {
        const questionsPromise = dbConnect(getURL(`questions?survey=${surveyId}`));
        questionsPromise.then(dbQuestions => {
            Question.renderDraftQuestions(dbQuestions, container, surveyId);
        });
    }

    static addDraftButton(buttonText, container, surveyId) {
        const newButton = document.createElement('div');
        newButton.classList.add('draft-btn', buttonText);
        newButton.textContent = buttonText;
        newButton.dataset.surveyId = surveyId; 

        container.append(newButton);
    }

    static appendSurveyStatus(text, container) {
        container.innerHTML = '';
        const message = document.createElement('h2');
        message.textContent = text;
        
        
        container.append(message);
        message.classList.add('animate__animated', 'animate__jackInTheBox');
    }

    static publishSurvey(surveyId, container) {
        let obj = {};
        obj['status'] = "published";
        const surveyPatchPromise = dbConnect(getURL(`surveys/${surveyId}`), buildOptions("PATCH", obj));
        surveyPatchPromise.then((data) => {
            setupAdminPage();
            Survey.appendSurveyStatus('Survey Published', container)    
        })
        
    }
}