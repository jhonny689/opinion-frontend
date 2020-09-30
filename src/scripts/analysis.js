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