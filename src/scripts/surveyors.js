class Surveyor{
    
    static all =[];

    constructor({id, full_name, dob, email}){
        this.id = id;
        this.name = full_name;
        this.dob = dob;
        this.email = email;

        Surveyor.all.push(this);
    }

    render_me(){
        const option = document.createElement('option');
        option.value = this.id;
        option.textContent = this.name;
        console.log("renderedOption ", option);
        return option;
    }

    static render(container){
        console.log("rendering ",this.all, " in ", container);
        
        for(let surveyor of this.all){
            container.append(surveyor.render_me())
        }
    }

    static createAll(dbObjects, container){
        Surveyor.all = [];
        console.log("creating surveyors");
        // debugger
        let dbOBJ = dbObjects["data"];
        for(let dbSurveyor of dbOBJ){
            // debugger;
            new Surveyor(dbSurveyor.attributes);
        }
        Surveyor.render(container);
    }
}