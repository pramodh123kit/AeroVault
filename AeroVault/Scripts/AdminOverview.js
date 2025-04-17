﻿var week1Count = 0;
var week2Count = 0;
var week3Count = 0;
var week4Count = 0;

var myChart; 
var myChart2; 

$(document).ready(function () {
    initializeCharts(); 
});

function initializeCharts() {
    console.log("Fetching staff login times...");
   
    fetch(`${baseUrWel}Overview/GetStaffLoginTimes`)
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);

            const currentDate = new Date();
            const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

            const filteredLoginTimes = data.filter(login => {
                const loginTime = new Date(login.timeOfLoggingIn);
                return loginTime >= firstDayOfCurrentMonth && loginTime < firstDayOfNextMonth;
            });

            const groups = {
                week1: [],
                week2: [],
                week3: [],
                week4: []
            };

            filteredLoginTimes.forEach(login => {
                const loginTime = new Date(login.timeOfLoggingIn);
                const dayOfMonth = loginTime.getDate();

                if (dayOfMonth <= 7) {
                    groups.week1.push(login);
                } else if (dayOfMonth <= 14) {
                    groups.week2.push(login);
                } else if (dayOfMonth <= 21) {
                    groups.week3.push(login);
                } else {
                    groups.week4.push(login);
                }
            });

            week1Count = groups.week1.length;
            week2Count = groups.week2.length;
            week3Count = groups.week3.length;
            week4Count = groups.week4.length;

            console.log("Counts:");
            console.log("Week 1 Count:", week1Count);
            console.log("Week 2 Count:", week2Count);
            console.log("Week 3 Count:", week3Count);
            console.log("Week 4 Count:", week4Count);

            renderCharts();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function renderCharts() {
    const docs = document.querySelector('.stats-container .stat-item[data-all-time-docs]');
    const videos = document.querySelector('.stats-container .stat-item[data-all-time-videos]');
    const systems = document.querySelector('.stats-container .stat-item[data-all-time-systems]');
    const departments = document.querySelector('.stats-container .stat-item[data-all-time-departments]');
    const divisions = document.querySelector('.stats-container .stat-item[data-all-time-divisions]');

    const ctx = document.getElementById('myChart').getContext('2d');
    const ctx2 = document.getElementById('myChart2').getContext('2d');

    const gradient1 = ctx.createLinearGradient(0, 0, 400, 400);
    gradient1.addColorStop(0, '#36A2EB'); 
    gradient1.addColorStop(1, '#05448B'); 

    const gradient2 = ctx.createLinearGradient(0, 0, 800, 400);
    gradient2.addColorStop(0, '#C9AA22'); 
    gradient2.addColorStop(1, '#635411');

    const gradient3 = ctx.createLinearGradient(0, 0, 800, 400);
    gradient3.addColorStop(0, '#CE1D1D'); 
    gradient3.addColorStop(1, '#680F0F'); 

    const gradient4 = ctx.createLinearGradient(0, 0, 800, 400);
    gradient4.addColorStop(0, '#2E8D58'); 
    gradient4.addColorStop(1, '#04612D'); 

    const gradient5 = ctx.createLinearGradient(0, 0, 800, 400);
    gradient5.addColorStop(0, '#FF6333'); 
    gradient5.addColorStop(1, '#993B1F'); 

    const gradient6 = ctx.createLinearGradient(0, 0, 800, 400);
    gradient6.addColorStop(0, '#053C7A'); 
    gradient6.addColorStop(1, '#052850'); 

    const gradient7 = ctx2.createLinearGradient(0, 0, 800, 0);
    gradient7.addColorStop(0, 'rgba(5, 60, 122, 0.90)');
    gradient7.addColorStop(1, 'rgba(5, 40, 80, 0.90)');

    let selectedDocs = docs ? docs.getAttribute('data-all-time-docs') : null;
    let selectedVideos = videos ? videos.getAttribute('data-all-time-videos') : null;
    let selectedSystems = systems ? systems.getAttribute('data-all-time-systems') : null;
    let selectedDepartments = departments ? departments.getAttribute('data-all-time-departments') : null;
    let selectedDivisions = divisions ? divisions.getAttribute('data-all-time-divisions') : null;

    const dataset = [{
        label: 'Total ',
        data: [selectedSystems, selectedDepartments, selectedDocs, selectedVideos, selectedDivisions],
        borderWidth: 0,
        backgroundColor: [gradient3, gradient4, gradient5, gradient2, gradient1], 
        hoverBackgroundColor: ['#CE1D1D', '#2E8D58', '#FF6333', '#C9AA22', '#36A2EB'] 
    }];

    function calculateBarThickness() {
        const screenWidth = window.innerWidth;
        return Math.max(30, Math.min(70, screenWidth / 15)); 
    }

    const barThickness = calculateBarThickness();

    const dataset2 = [{
        label: 'Logged In Staff  ',
        data: [week1Count, week2Count, week3Count, week4Count],
        borderWidth: 0,
        backgroundColor: [gradient7], 
        hoverBackgroundColor: ['#36A2EB'], 
        barThickness: barThickness,
        borderRadius: {
            topLeft: 10,
            topRight: 10,
            bottomLeft: 0,
            bottomRight: 0
        }
    }];

    if (myChart) {
        myChart.destroy(); 
    }
    if (myChart2) {
        myChart2.destroy(); 
    }

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ["Systems", "Departments", "Documents", "Videos", "Divisions"],
            datasets: dataset
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    bodyFont: {
                        size: 14 
                    },
                    titleFont: {
                        size: 15 
                    }
                }
            }
        }
    });

    myChart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: dataset2
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    ticks: {
                        stepSize: 1, 
                        beginAtZero: true 
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    bodyFont: {
                        size: 14 
                    },
                    titleFont: {
                        size: 15 
                    }
                }
            }
        }
    });
}

if (!myChart && !myChart2) {
    initializeCharts();
}

function toggleCustomDropdown() {
    const dropdownContent = document.querySelector('.custom-dropdown-content');
    const dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    const selector = document.querySelector('.custom-selector');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');

        selector.style.borderBottomLeftRadius = '10px';
        selector.style.borderBottomRightRadius = '10px';
        selector.style.borderBottom = '1px solid #6D6D6D';
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';

        showAllCustomOptions();
    }
}

function selectCustomOption(element) {
    const selectedOption = element.textContent || element.innerText;
    document.getElementById('selected-option').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    const divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    const dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    dropdownToggle.style.borderBottomLeftRadius = '';
    dropdownToggle.style.borderBottomRightRadius = '';
    dropdownToggle.style.borderBottom = '';

    updateStats(selectedOption);
}

function updateChartData(selectedDocs, selectedVideos, selectedSystems, selectedDepartments, selectedDivisions) {
    if (myChart) {
        myChart.data.datasets[0].data = [selectedSystems, selectedDepartments, selectedDocs, selectedVideos, selectedDivisions];
        myChart.update();
    }
}

function updateStats(option) {
    const docs = document.querySelector('.stats-container .stat-item[data-all-time-docs]');
    const videos = document.querySelector('.stats-container .stat-item[data-all-time-videos]');
    const systems = document.querySelector('.stats-container .stat-item[data-all-time-systems]');
    const departments = document.querySelector('.stats-container .stat-item[data-all-time-departments]');
    const divisions = document.querySelector('.stats-container .stat-item[data-all-time-divisions]');

    let selectedDocs, selectedVideos, selectedSystems, selectedDepartments, selectedDivisions;

    switch (option) {
        case "All Time":
            selectedDocs = docs ? docs.getAttribute('data-all-time-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-all-time-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-all-time-systems') : null;
            selectedDepartments = departments ? departments.getAttribute('data-all-time-departments') : null;
            selectedDivisions = divisions ? divisions.getAttribute('data-all-time-divisions') : null;
            break;
        case "Last Month":
            selectedDocs = docs ? docs.getAttribute('data-last-month-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-month-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-last-month-systems') : null;
            selectedDepartments = departments ? departments.getAttribute('data-last-month-departments') : null;
            selectedDivisions = divisions ? divisions.getAttribute('data-last-month-divisions') : null;
            break;
        case "Last 3 Months":
            selectedDocs = docs ? docs.getAttribute('data-last-3-months-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-3-months-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-last-3-months-systems') : null;
            selectedDepartments = departments ? departments.getAttribute('data-last-3-months-departments') : null;
            selectedDivisions = divisions ? divisions.getAttribute('data-last-3-months-divisions') : null;
            break;
        case "Last 6 Months":
            selectedDocs = docs ? docs.getAttribute('data-last-6-months-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-6-months-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-last-6-months-systems') : null;
            selectedDepartments = departments ? departments.getAttribute('data-last-6-months-departments') : null;
            selectedDivisions = divisions ? divisions.getAttribute('data-last-6-months-divisions') : null;
            break;
        case "Last Year":
            selectedDocs = docs ? docs.getAttribute('data-last-year-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-year-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-last-year-systems') : null;
            selectedDepartments = departments ? departments.getAttribute('data-last-year-depart ments') : null;
            selectedDivisions = divisions ? divisions.getAttribute('data-last-year-divisions') : null;
            break;
    }

    if (docs) {
        docs.querySelector('.stat-number').textContent = selectedDocs || 'N/A';
    }
    if (videos) {
        videos.querySelector('.stat-number').textContent = selectedVideos || 'N/A';
    }
    if (systems) {
        systems.querySelector('.stat-number').textContent = selectedSystems || 'N/A';
    }
    if (departments) {
        departments.querySelector('.stat-number').textContent = selectedDepartments || 'N/A';
    }
    if (divisions) {
        divisions.querySelector('.stat-number').textContent = selectedDivisions || 'N/A';
    }

    updateChartData(selectedDocs, selectedVideos, selectedSystems, selectedDepartments, selectedDivisions);
}

function showAllCustomOptions() {
    const divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}