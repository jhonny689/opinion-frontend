class Survey{
    static all = [];
    
    constructor({id, title, surveyor, description, due_date}){
        this.id = id;
        this.title = title;
        this.surveyor = surveyor;
        this.description = description;
        this.due_date = due_date;

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

    static render(container){
        console.log("rendering ",this.all, " in ", container);
        
        for(let survey of this.all){
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

    static submit(jsonSurvey){
        let options = buildOptions('POST',jsonSurvey);
        debugger;
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
}