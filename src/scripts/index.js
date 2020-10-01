document.addEventListener('DOMContentLoaded', e => {
    const loggedInUser = "surveyee";
    // const loggedInUser = "admin";
    const loginPage = document.getElementById('login-container');
    const adminPage = document.getElementById('admin-container');
    const userPage = document.getElementById('user-container');
    const surveyContainer = document.getElementById('survey-container');
    
    // adminPage.style.display='none';
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
    setFilterEventListener(surveysTable);
}

function setClickListener(surveysTable, survey){
    console.log("setting up click listener");
    surveysTable.addEventListener('click', e => {
        if(e.target.matches('td')){
            console.log("should be able to catch click in td")
            survey.innerHTML = '';
            tableRowClickListener(e.target.parentNode, survey);
        }
    });
    let i = 0;
    survey.addEventListener('click', e => {
        
        if(e.target.matches('.load-next')){
            if(Question.answered(e.target.previousSibling)){
                
                Answer.prepareAnswerSheet(e.target.previousSibling)
                e.target.parentElement.classList.add("animate__flip");
                e.target.parentElement.style = "background-color:#fff";
                
                let intervalID = setInterval(() => {
                    e.target.parentElement.remove();
                    Question.fillContainer(survey, ++i);
                    e.target.parentElement.classList.remove("animate__flip");
                    clearInterval(intervalID);
                },  800);
            }
        }else if(e.target.matches('.btn_submit')){
            const contentCard = e.target.parentElement;
            Survey.thankYou(contentCard);
            Answer.submitAnswerSheet();
        }else if(e.target.matches('.btn_cancel')){
            Answer.resetAnswerSheet();
            Question.fillContainer(survey,0);
            i = 0;
        }
    })
}

function tableRowClickListener(clickedRow, surveyContainer){
    const surveyId = clickedRow.dataset.surveyId;
    const surveyTitle = document.createElement('h2');
    
    surveyTitle.textContent = clickedRow.children[0].textContent;
    surveyContainer.appendChild(surveyTitle);
    console.log("before parsing the Questions");
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

function setupAdminPage(adminContainer, contentContainer){
    const draftSurvey = document.querySelector('div#drafts');
    const publishedSurvey = document.querySelector('div#published');
    const closedSurvey = document.querySelector('div#closed');

    setVisibility(adminContainer, contentContainer);
    renderDrafts(draftSurvey);
    renderPublished(publishedSurvey);
    renderClosed(closedSurvey);
}

function renderDrafts(container){
    const surveyPromise = dbConnect(getURL('users/1?surveys=draft'));
    surveyPromise.then(adminSurveys => {
        Survey.renderAdminSurveys(adminSurveys['survey_drafts'], container);
    });
}

function renderPublished(container){
    const surveyPromise = dbConnect(getURL('users/1?surveys=published'));
    surveyPromise.then(adminSurveys => {
        Survey.renderAdminSurveys(adminSurveys['published_surveys'], container);
    });
}

function renderClosed(container){
    const surveyPromise = dbConnect(getURL('users/1?surveys=closed'));
    surveyPromise.then(adminSurveys => {
        Survey.renderAdminSurveys(adminSurveys['closed_surveys'], container);
    });
}

function setFilterEventListener(container) {
    const surveyTableBody = container.querySelector('tbody');
    const filterForm = document.querySelector('#lookup-form');
    
    filterForm.addEventListener('input', e => {
        let currentSurveyCollection = Survey.all;
        let filteredCollection = [];
        
        currentSurveyCollection.forEach(function(survey) {
            if (survey.title.toLowerCase().includes(filterForm.title.value.toString())){
                filteredCollection.push(survey);
            }
        });

        surveyTableBody.innerHTML = '';
        Survey.render(surveyTableBody, filteredCollection);
    });

    filterForm.addEventListener('change', e => {
        filterForm.title.value = '';
        if(e.target.matches('#category')){
            filterForm.surveyor.selectedIndex = 0;
            
            let filteredByCategory = [];
            Survey.all.forEach(function(survey){
                if (survey.survey_category_id == e.target.value) {
                    filteredByCategory.push(survey)
                }
            });
            surveyTableBody.innerHTML = '';
            Survey.render(surveyTableBody, filteredByCategory);
        }else if (e.target.matches('#surveyor')){
            filterForm.category.selectedIndex = 0;
            
            let filteredBySurveyor = [];
            Survey.all.forEach(function(survey){
                if (survey.surveyor === e.target.options[e.target.selectedIndex].text) {
                    filteredBySurveyor.push(survey)
                }
            });
            surveyTableBody.innerHTML = '';
            Survey.render(surveyTableBody, filteredBySurveyor);
        }
    });    

    filterForm.addEventListener('click', e => {
        if (e.target.matches('#btn-reset')){
            e.preventDefault();
            filterForm.surveyor.selectedIndex = 0;
            filterForm.category.selectedIndex = 0;
            Survey.render(surveyTableBody);
        }
    });
}