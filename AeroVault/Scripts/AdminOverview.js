(function () {
    // Check if the variables are already defined
    if (typeof myChart === 'undefined') {
        var myChart; // Declare myChart in the local scope
    }
    if (typeof myChart2 === 'undefined') {
        var myChart2; // Declare myChart2 in the local scope
    }

    function initializeCharts() {
        const ctx = document.getElementById('myChart').getContext('2d');
        const ctx2 = document.getElementById('myChart2').getContext('2d');

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

        var gradient6 = ctx.createLinearGradient(0, 0, 800, 400);
        gradient6.addColorStop(0, '#053C7A'); // Start color orange
        gradient6.addColorStop(1, '#052850'); // End color

        var gradient7 = ctx2.createLinearGradient(0, 0, 800, 0);
        gradient7.addColorStop(0, 'rgba(5, 60, 122, 0.90)');
        gradient7.addColorStop(1, 'rgba(5, 40, 80, 0.90)');

        var dataset = [{
            label: 'Total ',
            data: [12, 19, 10, 20, 10],
            borderWidth: 0,
            backgroundColor: [gradient3, gradient4, gradient5, gradient2, gradient1], // Segment colors
            hoverBackgroundColor: ['#CE1D1D', '#2E8D58', '#FF6333', '#C9AA22', '#36A2EB'] // Hover colors
        }];

        function calculateBarThickness() {
            const screenWidth = window.innerWidth;
            return Math.max(30, Math.min(70, screenWidth / 15)); // Adjust the divisor as needed
        }

        function renderCharts() {
            const barThickness = calculateBarThickness();

            var dataset2 = [{
                label: 'Logged In Staff  ',
                data: [120, 190, 100, 200, 100],
                borderWidth: 0,
                backgroundColor: [gradient7], // Segment colors
                hoverBackgroundColor: ['#36A2EB'], // Hover colors
                barThickness: barThickness,
                borderRadius: {
                    topLeft: 10,
                    topRight: 10,
                    bottomLeft: 0,
                    bottomRight: 0
                }
            }];

            // Clear existing charts
            if (myChart) {
                myChart.destroy(); // Call destroy on the existing dough nut chart instance
            }
            if (myChart2) {
                myChart2.destroy(); // Call destroy on the existing bar chart instance
            }

            // Create doughnut chart
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
                                size: 14 // Change this to your desired font size
                            },
                            titleFont: {
                                size: 15 // Change this to your desired title font size
                            }
                        }
                    }
                }
            });

            // Create bar chart
            myChart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: dataset2
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
                                size: 14 // Change this to your desired font size
                            },
                            titleFont: {
                                size: 15 // Change this to your desired title font size
                            }
                        }
                    }
                }
            });
        }

        renderCharts(); // Initial render

        // Add event listener for window resize
        window.addEventListener('resize', renderCharts);
    }

    // Call initializeCharts only if the charts are not already initialized
    if (!myChart && !myChart2) {
        setTimeout(initializeCharts, 900);
    }
})();


function toggleCustomDropdown() {
    var dropdownContent = document.querySelector('.custom-dropdown-content');
    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    var selector = document.querySelector('.custom-selector');

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

        // Remove or comment out this line if the input doesn't exist
        // document.getElementById('custom-search-input').value = ''; 
        showAllCustomOptions();
    }
}


function selectCustomOption(element) {
    var selectedOption = element.textContent || element.innerText;
    document.getElementById('selected-option').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    // Call the updateStats function with the selected option
    updateStats(selectedOption);
}

function updateStats(option) {
    const docs = document.querySelector('.stats-container .stat-item[data-all-time-docs]');
    const videos = document.querySelector('.stats-container .stat-item[data-all-time-videos]');
    const systems = document.querySelector('.stats-container .stat-item[data-all-time-systems]');
    const departments = document.querySelector('.stats-container .stat-item[data-all-time-departments]');
    const divisions = document.querySelector('.stats-container .stat-item[data-all-time-divisions]');

    // Log the selected elements to check if they are found
    console.log('Docs Element:', docs);
    console.log('Videos Element:', videos);
    console.log('Systems Element:', systems);
    console.log('Departments Element:', departments);
    console.log('Divisions Element:', divisions);

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
            selectedSystems = systems ? systems.getAttribute('data-all-time-systems') : null; // Assuming no change for systems
            selectedDepartments = departments ? departments.getAttribute('data-all-time-departments') : null; // Assuming no change for departments
            selectedDivisions = divisions ? divisions.getAttribute('data-all-time-divisions') : null; // Assuming no change for divisions
            break;
        case "Last 3 Months":
            selectedDocs = docs ? docs.getAttribute('data-last-3-months-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-3-months-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-all-time-systems') : null; // Assuming no change for systems
            selectedDepartments = departments ? departments.getAttribute('data-all-time-departments') : null; // Assuming no change for departments
            selectedDivisions = divisions ? divisions.getAttribute('data-all-time-divisions') : null; // Assuming no change for divisions
            break;
        case "Last 6 Months":
            selectedDocs = docs ? docs.getAttribute('data-last-6-months-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-6-months-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-all-time-systems') : null; // Assuming no change for systems
            selectedDepartments = departments ? departments.getAttribute('data-all-time-departments') : null; // Assuming no change for departments
            selectedDivisions = divisions ? divisions.getAttribute('data-all-time-divisions') : null; // Assuming no change for divisions
            break;
        case "Last Year":
            selectedDocs = docs ? docs.getAttribute('data-last-year-docs') : null;
            selectedVideos = videos ? videos.getAttribute('data-last-year-videos') : null;
            selectedSystems = systems ? systems.getAttribute('data-all-time-systems') : null; // Assuming no change for systems
            selectedDepartments = departments ? departments.getAttribute('data-all-time-departments') : null; // Assuming no change for departments
            selectedDivisions = divisions ? divisions.getAttribute('data-all-time-divisions') : null; // Assuming no change for divisions
            break;
    }

    // Update the displayed values with error handling
    if (docs) {
        docs.querySelector('.stat-number').textContent = selectedDocs || 'N/A';
    } else {
        console.warn('Docs element not found');
    }
    if (videos) {
        videos.querySelector('.stat-number').textContent = selectedVideos || 'N/A';
    } else {
        console.warn('Videos element not found');
    }
    if (systems) {
        systems.querySelector('.stat-number').textContent = selectedSystems || 'N/A';
    } else {
        console.warn('Systems element not found');
    }
    if (departments) {
        departments.querySelector('.stat-number').textContent = selectedDepartments || 'N/A';
    } else {
        console.warn('Departments element not found');
    }
    if (divisions) {
        divisions.querySelector('.stat-number').textContent = selectedDivisions || 'N/A';
    } else {
        console.warn('Divisions element not found');
    }
}
function showAllCustomOptions() {
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}