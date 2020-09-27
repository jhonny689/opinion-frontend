class Category{

    static all = [];
    
    constructor({id, name, description}){
        this.id = id;
        this.name = name;
        this.description = description;

        Category.all.push(this);
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
        
        for(let cat of this.all){
            console.log("cat ", cat)
            container.append(cat.render_me())
        }
    }

    static createAll(dbObjects, container){
        console.log("creating categories");
        for(let dbCat of dbObjects){
            new Category(dbCat);
        }
        Category.render(container);
    }

}
