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
        questionsPromise.then(dbQuestions => Question.renderAll(dbQuestions, container));
    }
}