document.addEventListener('DOMContentLoaded', e => {
    let data=[20, 10, 15, 35, 25, 20, 29, 32];
    let labels=["Option1", "Option2", "Option3", "Option4", "Option5","Option6","Option7","Option8"];
    let ctx = document.getElementById('myChart').getContext('2d');

    let types = {
        bar: "bar",
        radar: "radar",
        line: "line",
        donut: "donut",
        pie: "pie",
        scatter: "scatter",
        polarArea: "polarArea",
        area: "line",
        mixed: "bar",
        bubble: "bubble"
    };

    let colors = ['#0096c7','#102542','#7D4F50','#FCB9B2','#FFCAB1','#12664F','#ECDCB0','#F3A712','#FF3C38',
        '#F0A7A0','#8CC084','#0B3C49','#731963','#FFFDFD','#F49390','#AA767C','#F45866','#C7DFC5','#ADEBFF',
        '#F6FEAA','#FCE694','#FFA400','#E2C044','#8E5572','#FF6666','#443850','#393E41','#FFFBFE','#565254'
    ];

    let bgColor = generateColorArray(colors, data.length);
    let borderColor = generateColorArray(colors, data.length);

    createChart(ctx, types.bar, generateChartData(labels, "Question", data, bgColor, borderColor), generaterChartOptions())
});

function generateColorArray(colors, num){
    let colorArray = [];
    for(let i = 0; i < num; i++){
        index = parseInt(Math.random() * num);
        colorArray.push(colors[index]);
    }
    return colorArray;
}

function generateChartData(labels, label, data, bgColor, borderColor){
    return {
        labels: labels,
        datasets: [{
            label: label,
            data: data,
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: 1
        }]
    }
}

function generaterChartOptions(animation){
    let options = {
        responsive: true,
        maintainAspectRatio: false,
    }
    if (animation)
        options.animation = animation;
    
        return options;
}

function createChart(ctx, type, data, options){
    var myLineChart = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

class Analytics{

    static all = [];

    constructor({Qid, QText, valueSummary}){
        this.qId = Qid,
        this.qText = QText,
        this.valueSummary = valueSummary;

        Analytics.all.push(this);
    }
    static loadAnalysis(surveyId,contentContainer){
        let surveyAnswersData = dbConnect(getURL(`responses?survey=${surveyId}/`));
        surveyAnswersData.then(data => {
            let analyticalData  =Analytics.prepareDataForAnalysis(_.pluck(data["data"],'attributes'));
            this.renderCharts(analyticalData);
        });
    }
    static prepareDataForAnalysis(data){
        const newData = [];
        const questions = _.values(_.groupBy(data,'question_id'));
        console.log(questions);
        for(let quest of questions){
            this.setupQuestAnalysis(quest, newData);
        }
        //debugger;
        console.log("Survey Data ready for Visualisation:",newData);
    }
    static setupQuestAnalysis(quest, object){
        let question_id = quest[0]["question_id"];
        let label = quest[0]["question_text"];
        let question_type_id = quest[0]["question_type"];
        let answers = {};
        //debugger;
        switch(question_type_id){
            case 1:
            case 2:
            case 3:
            case 6:
            case 7:
            case 9:
                answers = this.nonNumericalCount(quest);
                break;
            case 8:
                answers = this.rankingCount(quest);
                break;
            default:
                answers = this.numericalCount(quest);
        }
        object.push({
            question_id: question_id,
            label: label,
            answers: answers
        })

    }

    static nonNumericalCount(quest){
        const parser = {};
        const res = {};
        for(let ans of quest){
            if(parser[ans.value]){
                parser[ans.value]++;
            }else{
                parser[ans.value] = 1;
            }
        }
        res["labels"]= _.keys(parser);
        res["values"]= _.values(parser);
        return res;
    }

    static rankingCount(quest){
        const parser = {};
        const res = {};
        for(let ans of quest){
            //debugger;
            let ansJSON = JSON.parse(ans.value);
            let keys = _.keys(ansJSON);
            for(let i=0; i<keys.length; i++){
                if(parser[keys[i]]){
                    parser[keys[i]] = parser[keys[i]] + ansJSON[keys[i]];
                }else{
                    parser[keys[i]] = ansJSON[keys[i]];
                }
            }
        }
        res["labels"] = _.keys(parser);
        res["values"] = _.values(parser);
    }

    static numericalCount(quest){
        const parser = {
            "inFavor":0,
            "notInFavor":0};
        let max = (quest[0].question_type == 4? 10:100)
        for(let ans of quest){
            parser["inFavor"] += parseInt(ans.value);
            parser["notInFavor"] += (max - parseInt(ans.value));
        }
        let res = {};
        res["labels"]=_.keys(parser);
        res["values"]=_.values(parser);
        //debugger;
        return res;
    }
}