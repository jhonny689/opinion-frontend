document.addEventListener('DOMContentLoaded', e => {
    LOGGED_IN_USER = null;
    USER_ID = null;
    // LOGGED_IN_USER = "admin";
    // USER_ID = 3;

    LoadWebPage();
});
function LoadWebPage(){
    const loginPage = document.getElementById('login-container');
    // const adminPage = document.getElementById('admin-container');
    const userPage = document.getElementById('user-container');
    const surveyContainer = document.getElementById('survey-container');

    if(!LOGGED_IN_USER){
        setupLoginPage(loginPage);
    }else if (LOGGED_IN_USER === "admin"){
        // setupAdminPage(adminPage, surveyContainer);
        setupAdminPage();
    }else if(LOGGED_IN_USER === "surveyee"){
        setupUserPage(userPage, surveyContainer);
    }else if(LOGGED_IN_USER === "guest"){
        setupGuestPage(surveyContainer);
    }
}

function setupLoginPage(loginPage){
    setVisibility(loginPage);
    // setUpPwdInputListners();
    setUpLoginClickListners(loginPage);
}

// function setUpPwdInputListners(){
//     const pwd = document.querySelector('div#password');
//     pwd.addEventListener('keydown', e => {
//         console.log("*");
//     })
// }

function setUpLoginClickListners(loginPage){
    const username = loginPage.querySelector('input#username');
    const password = loginPage.querySelector('input#password');
    loginPage.addEventListener('click', e => {
        if(e.target.matches('.cancel-btn')){
            username.value = '';
            password.value = '';
        }else if(e.target.matches('.login-btn')){
            console.log('clicked Login...');
            let authentication = {
                username: username.value,
                password: password.value,
            };
            let options = buildOptions('POST', authentication);
            let connection = dbConnect(getURL('authentications/'),options);
            connection.then(user => {
                username.value = '';
                password.value = '';
                setLoggedInUser(user);
            });
        }
    })
    const logoutBtn = document.querySelector('button.log-out');
    logoutBtn.addEventListener('click', e => {
        LOGGED_IN_USER = null;
        USER_ID = null;
        LoadWebPage();
    })
}

function setLoggedInUser(user){
    if (user.length > 0){
        LOGGED_IN_USER = user[0].user.role;
        USER_ID = user[0].user_id;
        LoadWebPage();
    }else{
        alert("Wrong username or password");
    }
}

function setupUserPage(container, survey){
    const categoryDD = document.querySelector('select#category');
    const surveyorDD = document.querySelector('select#surveyor');
    const surveysTable = document.getElementById('surveys-table');
    const loginPage = document.getElementById('login-container');

    loginPage.style.display = 'none';
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
            console.log('You clicked NEXT');
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
            console.log("inside cancel button functionality");
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
    if(survey)
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
    const surveysPromise = dbConnect(getURL(`surveys?status=published&user=${USER_ID}`));
    const surveysTableBody = surveysTable.querySelector('tbody');
    
    surveysPromise.then(dbSurveys => {
        Survey.createAll(dbSurveys, surveysTableBody);
        if ( $.fn.dataTable.isDataTable( '#surveys-table' ) ) {
            table = $('#surveys-table').DataTable();
        }else{
            $('#surveys-table').DataTable({
                searching: false,
            });
        }
    });
}

// function setupAdminPage(adminContainer, contentContainer){
function setupAdminPage() {
    const contentContainer = document.getElementById('survey-container');
    contentContainer.innerHTML = "";
    const adminContainer = document.getElementById('admin-container');
    const draftSurvey = document.querySelector('div#drafts');
    const publishedSurvey = document.querySelector('div#published');
    const closedSurvey = document.querySelector('div#closed');
    const loginPage = document.getElementById('login-container');

    loginPage.style.display = 'none';
    setVisibility(adminContainer, contentContainer);
    renderDrafts(draftSurvey);
    renderPublished(publishedSurvey);
    renderClosed(closedSurvey);
    setupAdminClicksListener(adminContainer, contentContainer);
    setupSurveyClicksListener(contentContainer);
}

function setupAdminClicksListener(container, contentContainer){
    container.addEventListener('click', e => {
        if (e.target.matches('.new-survey-btn')){
            contentContainer.style.display = 'block';
            document.getElementById('data-analytics').style.display = 'none';
            renderNewSurveyForm(contentContainer);
        }else if(e.target.matches('div#drafts li')){
            const clickedSurvey = e.target
            const analyticsContainer = document.querySelector('div#data-analytics');
            analyticsContainer.style.display = 'none';
            setVisibility(contentContainer);
            Survey.loadSurveyDraft(clickedSurvey, contentContainer);
            console.log("clicked a draft survey");
            //Survey.loadSurveyForUpdate(surveyId, contentContainer);
        }else if(e.target.matches('div#published li')){
            console.log("clicked a published survey");
            let surveyId = e.target.dataset.id;
            const analyticsContainer = document.querySelector('div#data-analytics');
            contentContainer.style.display = 'none';
            setVisibility(analyticsContainer);
            Analytics.loadAnalysis(surveyId,contentContainer);
        }else if(e.target.matches('div#closed li')){
            console.log("clicked a closed survey");
        }
    })
}

function setupSurveyClicksListener(container){
    container.addEventListener('click', e => {
        if(e.target.matches('.new-question-btn')){

            showNewQuestForm(e, container);
        }else if(e.target.matches('.submit-btn')){

            createQuestion(e.target.closest('div#form-box'));
        }else if(e.target.matches('.submit-survey-btn')){

            Survey.submit(prepSurvey(USER_ID, "draft", container));
            container.innerHTML="";
        }else if(e.target.matches('.publish-survey-btn')){

            Survey.submit(prepSurvey(USER_ID, "published", container));
            container.innerHTML="";
        }else if (e.target.matches('.Save')) {
            Survey.appendSurveyStatus('Survey Saved', container)
        }else if (e.target.matches('.Publish')) {
            const surveyId = e.target.dataset.surveyId;
            Survey.publishSurvey(surveyId, container);
        }
    })
}

function prepSurvey(userId, status, container){
    const title = container.querySelector('h1').textContent;
    const description = container.querySelector('h3').textContent;
    const date = container.querySelector('#due-date-input').value;
    const survey_category = container.querySelector('#survey-category').value;
    const questions = [...Question.surveyTemp];
    questions.forEach(question => {
        delete question.htmlEL;
        delete question.answered;
    });

    return {
        title: title,
        description: description,
        due_date: date,
        status: status,
        user_id: userId,
        survey_category_id: survey_category,
        questions: questions
    }
}
function createQuestion(container){
    console.log(container);
    const qText = container.querySelector('#qtext').textContent;
    const qType = container.querySelector('#qType').value;
    const qOptions = container.querySelector('#qOptions').textContent;

    let question = Question.prepareSurvey({question_type_id: parseInt(qType), question_text: qText, choices: qOptions}); 
    container.outerHTML = question.outerHTML;

}

function renderNewSurveyForm(container){
    container.innerHTML = "";
    const headerTitle = document.createElement('h1');
    headerTitle.contentEditable = true;
    headerTitle.classList.add('single-line');
    headerTitle.classList.add('survey-title');
    headerTitle.onkeypress = (e) => {return (e.target.textContent.length <= 25)};
    headerTitle.textContent = "Your Survey Title...";

    container.appendChild(headerTitle);
    console.log(container.innerHTML);

    const surveyDesc = document.createElement('h3');
    surveyDesc.contentEditable = true;
    surveyDesc.classList.add('multi-line');
    surveyDesc.classList.add('survey-description');
    surveyDesc.onkeypress = (e) => {return (e.target.textContent.length <= 500)};
    surveyDesc.textContent = "Your Survey Description...";

    container.appendChild(surveyDesc);
    console.log(container.innerHTML);

    const lineBreak = document.createElement('hr');
    container.appendChild(lineBreak);

    const surveyDueDateLabel = document.createElement('label');
    // surveyDueDateLabel.classList.add('label-due-date');
    surveyDueDateLabel.textContent = "Due Date :"
    
    const surveyDueDate = document.createElement('input')
    surveyDueDate.type = 'date';
    surveyDueDate.id = 'due-date-input';
    surveyDueDate.minimum = new Date();

    // container.append(surveyDueDateLabel, surveyDueDate);
    const dateAndCatDiv = document.createElement('div');
    dateAndCatDiv.classList.add('date-category');
    dateAndCatDiv.append(surveyDueDateLabel, surveyDueDate);
    console.log(container.innerHTML);
    
    const surveyCategoryLabel = document.createElement('label');
    surveyCategoryLabel.textContent = " Survey Category :"
    
    const surveyCategory = document.createElement('select')
    surveyCategory.type = 'date';
    surveyCategory.id = 'survey-category';
    surveyCategory.innerHTML = `
        <option value="0">Select Category</option>
        <option value="1">Film/TV</option>
        <option value="2">Music</option>
        <option value="3">Celebrities</option>
        <option value="4">Books</option>
        <option value="5">Politics</option>
    `;

    // container.append(surveyCategoryLabel, surveyCategory);
    dateAndCatDiv.append(surveyCategoryLabel, surveyCategory);
    container.append(dateAndCatDiv);
    console.log(container.innerHTML);

    const addQuestBtn = document.createElement('div');
    addQuestBtn.textContent = "Add new Question";
    addQuestBtn.classList.add('btn');
    addQuestBtn.classList.add('new-question-btn');
    container.appendChild(addQuestBtn);
    console.log(container.innerHTML);

    const submitSurveyBtn = document.createElement('div');
    submitSurveyBtn.textContent = "Save Survey";
    submitSurveyBtn.classList.add('btn');
    submitSurveyBtn.classList.add('submit-survey-btn');
    container.appendChild(submitSurveyBtn);
    
    const publishSurveyBtn = document.createElement('div');
    publishSurveyBtn.textContent = "Publish Survey";
    publishSurveyBtn.classList.add('btn');
    publishSurveyBtn.classList.add('publish-survey-btn');
    container.appendChild(publishSurveyBtn);
    console.log(container.innerHTML);
}

function showNewQuestForm(e, container){
    container.insertBefore(renderNewQuestForm(), e.target);
    setupTheDropDown();
}

function detectDDChange(qTypeDD){
    console.dir(qTypeDD.value);
    switch(qTypeDD.value){
    case "1":
    case "3":
    case "6":
    case "8":
    case "9":
        console.log("worked")
        document.getElementById('optionsTR').className = "visible";
        break;
    default:
        console.log("didn't work")
        document.getElementById('optionsTR').className= "hidden";
    }
    
}

function renderNewQuestForm(){
    const questForm = document.createElement('div');
    questForm.classList.add('form-box');
    questForm.id = 'form-box';
    questForm.innerHTML = `
        <table style="width:100%;">
            <tr>
                <td><label>Your Question</label></td>
                <td>:</td>
                <td colspan="2"><div contenteditable='true' id='qtext' class='single-line text-box'><div></td>
            </tr>
            <tr>
                <td><label>Your Question Type</label></td>
                <td>:</td>
                <td colspan="2">${getQuestTypeDropDown()}</td>
            </tr>
            <tr id='optionsTR' class='hidden'>
                <td><label>Your Options</label></td>
                <td>:</td>
                <td colspan="2"><div contenteditable='true' id='qOptions' class='multi-line text-box'><div></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td align="right"><div class="cancel-btn" id="cancel-btn" style="display:'inline';">Cancel</div></td>
                <td align="center"><div class="submit-btn" id="submit-btn">Submit</div></td>
            </tr>
        </table>
    `
    return questForm;
}

function getQuestTypeDropDown(){
    const resDiv = document.createElement('div');
    resDiv.classList.add('custom-select');
    resDiv.style="width:262px;";
    resDiv.innerHTML = `
        <select id='qType' onchange='detectDDChange(this)'>
            <option value='0'>Select Type:</option>
            <option value='1'>One Answer, Multiple Choices</option>
            <option value='2'>True Or False</option>
            <option value='3'>Multiple Answers and Choices </option>
            <option value='4'>Rating Scale</option>
            <option value='5'>Likert Scale</option>
            <option value='6'>Dropdown</option>
            <option value='7'>Open Ended</option>
            <option value='8'>Ranking</option>
            <option value='9'>Image Choice</option>
            <option value='10'>Slider</option>
        </select>
    `;

    return resDiv.outerHTML;

}

function renderDrafts(container){
    if (container.querySelector('ul')){
        container.querySelector('ul').remove();
    }
    const surveyPromise = dbConnect(getURL(`users/${USER_ID}?surveys=draft`));
    surveyPromise.then(adminSurveys => {
        Survey.renderAdminSurveys(adminSurveys['survey_drafts'], container);
    });
}

function renderPublished(container){
    if (container.querySelector('ul')){
        container.querySelector('ul').remove();
    }
    const surveyPromise = dbConnect(getURL(`users/${USER_ID}?surveys=published`));
    surveyPromise.then(adminSurveys => {
        Survey.renderAdminSurveys(adminSurveys['published_surveys'], container);
    });
}

function renderClosed(container){
    if (container.querySelector('ul')){
        container.querySelector('ul').remove();
    }
    const surveyPromise = dbConnect(getURL(`users/${USER_ID}?surveys=closed`));
    surveyPromise.then(adminSurveys => {
        Survey.renderAdminSurveys(adminSurveys['closed_surveys'], container);
    });
}

function setupTheDropDown(){
    console.log("setting up the custom drop down")
    var x, i, j, l, ll, selElmnt, a, b, c;
    
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;

        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
    
        for (j = 1; j < ll; j++) {
        
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
                s.dispatchEvent(new Event('change'));
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
}

function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove("select-arrow-active");
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add("select-hide");
      }
    }
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
            surveyTableBody.innerHTML = '';
            Survey.render(surveyTableBody);
        }
    });
}
