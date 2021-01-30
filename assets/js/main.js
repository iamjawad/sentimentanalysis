function showChart(){
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
                label: 'Overview',
                data: [app.textGroup.filter(i => i.status == "Positive").length, app.textGroup.filter(i => i.status == "Negative").length, app.textGroup.filter(i => i.status == "Neutral").length],
                backgroundColor: [
                    
                    'rgba(3, 183, 3, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    
                    'rgba(3, 183, 3, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Overview',
                position: 'top',
                fontSize: 16,
                padding: 20
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


var app = new Vue({
    el: '#mainapp',
    data: {
        text: "",
        textGroup: [],
        step: 1,
    },
    methods: {
        setStep: function(step){
            this.step = step;
        },
        restart: function(){
            this.text = "";
            this.textGroup = [];
            this.step = 1;
        },
        apiRequest: function(text){
            // jQuery.ajax({
            //     url: "http://159.65.138.171:8080/api/roman_urdu/" + text,
            //     context: document.body
            //   }).done(function(data) {
            //     this.textGroup.push({text: this.text, status: data});
            //   }.bind(this));

              var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function()
                {
                    if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    {
                        this.textGroup.push({text: this.text, status: xmlHttp.responseText});
                        // myChart.update();
                        showChart();
                    }
                }.bind(this)
                xmlHttp.open("get", "https://cors-anywhere.herokuapp.com/http://159.65.138.171:8080/api/roman_urdu/" + this.text); 
                xmlHttp.send(); 
        },
        mark: function(status){
            this.textGroup.push({text: this.text, status: status});
        }
    }
});