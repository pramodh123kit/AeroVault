const ctx = document.getElementById('myChart').getContext('2d');
const ctx2 = document.getElementById('myChart2');

// Create gradients
var gradient1 = ctx.createLinearGradient(0, 0, 400, 400);
gradient1.addColorStop(0, '#36A2EB'); // Start color blue
gradient1.addColorStop(1, '#05448B'); // End color

var gradient2 = ctx.createLinearGradient(0, 0, 800, 400);
gradient2.addColorStop(0, '#C9AA22'); // Start color yellow
gradient2.addColorStop(1, '#635411'); // End color

var gradient3 = ctx.createLinearGradient(0, 0, 800, 400);
gradient3.addColorStop(0, '#CE1D1D'); // Start color red
gradient3.addColorStop(1, '#680F0F'); // End color

var gradient4 = ctx.createLinearGradient(0, 0, 800, 400);
gradient4.addColorStop(0, '#2E8D58'); // Start color Green
gradient4.addColorStop(1, '#04612D'); // End color

var gradient5 = ctx.createLinearGradient(0, 0, 800, 400);
gradient5.addColorStop(0, '#FF6333'); // Start color orange
gradient5.addColorStop(1, '#993B1F'); // End color

var dataset = [{
    label: 'Total ',
    data: [12, 19, 10, 20, 10],
    borderWidth: 0,
    backgroundColor: [gradient3, gradient4, gradient5, gradient2, gradient1], // Segment colors
    hoverBackgroundColor: ['#CE1D1D', '#2E8D58', '#FF6333', '#C9AA22', '#36A2EB'] // Hover colors
}];
new Chart(ctx, {

    type: 'doughnut',
    data: {
        labels: ["Systems", "Departments", "Documents", "Videos", "Divisions"],
        datasets: dataset
    },
    options: {
        plugins: {
            legend: {
                display: false // Hides the legend
            }
        }
    }
});



new Chart(ctx2, {
    type: 'pie',
    data: {
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 0
        }]
    },
});