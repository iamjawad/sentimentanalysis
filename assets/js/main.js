function showChart() {
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
        del: ".",
        splitMode: false,
        splitText: []
    },
    methods: {
        setStep: function (step) {
            this.step = step;
        },
        restart: function () {
            this.text = "";
            this.textGroup = [];
            this.step = 1;
        },
        apiRequest: function (text) {
            // jQuery.ajax({
            //     url: "http://159.65.138.171:8080/api/roman_urdu/" + text,
            //     context: document.body
            //   }).done(function(data) {
            //     this.textGroup.push({text: this.text, status: data});
            //   }.bind(this));
            var el = document.getElementsByClassName('load-wrapper')[0];
            var loopCount = 0;
            this.splitText = [];
            this.split();
            el.classList.remove('d-none');


            if (this.splitMode == false) {
                this.textGroup = [];
                var xmlHttp = new XMLHttpRequest();

                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                            this.textGroup.push({ text: this.text, status: xmlHttp.responseText });
                            console.log(loopCount);

                            el.classList.add('d-none');
                        }

                        if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
                            el.classList.add('d-none');
                        }
                    }.bind(this)
                    xmlHttp.open("get", "http://159.65.138.171:8080/api/roman_urdu/" + this.text);
                    // xmlHttp.setRequestHeader("Accept", "application/vnd.github.3.raw");
                    xmlHttp.send();
            } else {
                this.textGroup = [];
                this.splitText.forEach((element, index) => {
                    loopCount++;
                    var xmlHttp = new XMLHttpRequest();

                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                            this.textGroup.push({ text: element, status: xmlHttp.responseText });
                            // myChart.update();
                            // if(this.splitMode){
                            //    showChart(); 
                            // }
                            console.log(loopCount);
                            if (loopCount == this.splitText.length) {

                                showChart();
                            }

                            el.classList.add('d-none');
                        }

                        if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
                            el.classList.add('d-none');
                        }
                    }.bind(this)
                    xmlHttp.open("get", "https://cors-anywhere.herokuapp.com/http://159.65.138.171:8080/api/roman_urdu/" + element);
                    // xmlHttp.setRequestHeader("Accept", "application/vnd.github.3.raw");
                    xmlHttp.send();
                });
            }

        },
        mark: function (status) {
            this.textGroup.push({ text: this.text, status: status });
        },
        split: function () {
            this.splitText = [];

            // Remove last
            if (this.text[this.text.length - 1] == this.del.includes(this.text[this.text.length - 1])) {
                this.text = this.text.slice(0, -1);
            }

            this.del.split(' ').forEach(function (e) {
                this.splitText = this.splitText.concat(this.text.split(e));
            }.bind(this));

            // this.splitText = this.text.split(this.del);
            this.splitText.forEach(function (el, i) {
                this[i] = el.trim();
            }, this.splitText);


            this.splitText = this.splitText.filter(
                function (value, index) {
                    return this.splitText.indexOf(value) == index && value != ""
                }.bind(this));

            console.log(this.splitText);
            // this.splitText = this.splitText.filter(function(el) { return el; });
            // app.text.split('.', app.text.split('.').length - 1)
        }
    }
});

$(function () {
    var triggerTabList = [].slice.call(document.querySelectorAll('#myTab a'))
    triggerTabList.forEach(function (triggerEl) {
        var tabTrigger = new bootstrap.Tab(triggerEl)

        triggerEl.addEventListener('click', function (event) {
            event.preventDefault()
            tabTrigger.show()
        })
    })
})