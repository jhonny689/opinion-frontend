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
    
    container.style.display='block';
    survey.style.display='block';

    let categoryPromise = dbConnect(getURL('survey_categories/'));
    categoryPromise.then(dbCategories => Category.createAll(dbCategories, categoryDD));

    let surveryorPromise = dbConnect(getURL('users?admin=true'));
    surveryorPromise.then(dbSurveyors => {
        //debugger;
        Surveyor.createAll(dbSurveyors, surveyorDD)
    });

    let surveysPromise = dbConnect(getURL('surveys?status=published'));
    const surveysTable = document.getElementById('surveys-table')
    surveysPromise.then(dbSurveys => {
        Survey.createAll(dbSurveys, surveysTable)
    })
    
}

