document.addEventListener('DOMContentLoaded', e => {
    const loggedInUser = "surveyee";
    const loginPage = document.getElementById('login-container');
    const adminPage = document.getElementById('admin-container');
    const userPage = document.getElementById('user-container');
    const surveyContainer = document.getElementById('survey-container');
    
    adminPage.style.display='none';
    if (loggedInUser === "admin"){
        setupAdminPage(adminPage, surveyContainer);
    }else if(loggedInUser === "surveyee"){
        setupUserPage(userPage, surveyContainer);
    }else if(loggedInUser === "guest"){
        setupGuestPage(surveyContainer);
    }else{
        setupLoginPage(loginPage);
    }
});


function setupUserPage(container, survey){
    const categoryDD = document.querySelector('select#category');
    const surveyorDD = document.querySelector('select#surveyor');
    const surveysTable = document.getElementById('surveys-table');

    setVisibility(container, survey);
    setCategories(categoryDD);
    setSurveyors(surveyorDD);
    setSurveysList(surveysTable);
    setClickListener(surveysTable, survey);
}

function setClickListener(surveysTable, survey){
    console.log("setting up click listener");
    surveysTable.addEventListener('click', e => {
        if(e.target.matches('td')){
            console.log("should be able to catch click in td")
            tableRowClickListener(e.target.parentNode, survey);
        }
    })
}

function tableRowClickListener(clickedRow, surveyContainer){
    const surveyId = clickedRow.dataset.surveyId;
    const surveyTitle = document.createElement('h2');
    
    surveyTitle.textContent = clickedRow.children[0].textContent;
    surveyContainer.appendChild(surveyTitle);

    Survey.parseQuestions(surveyId, surveyContainer);
}

function setVisibility(container, survey){
    container.style.display='block';
    survey.style.display='block';
}

function setCategories(categoryDD){
    const categoryPromise = dbConnect(getURL('survey_categories/'));
    categoryPromise.then(dbCategories => Category.createAll(dbCategories, categoryDD));
}

function setSurveyors(surveyorDD){
    const surveryorPromise = dbConnect(getURL('users?admin=true'));
    surveryorPromise.then(dbSurveyors => Surveyor.createAll(dbSurveyors, surveyorDD));
}

function setSurveysList(surveysTable){
    const surveysPromise = dbConnect(getURL('surveys?status=published'));
    const surveysTableBody = surveysTable.querySelector('tbody');
    
    surveysPromise.then(dbSurveys => {
        Survey.createAll(dbSurveys, surveysTableBody);
        $('#surveys-table').DataTable({
            searching: false,
        });
    });
}