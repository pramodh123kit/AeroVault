document.addEventListener('DOMContentLoaded', function () {
    function calculateReadPercentage(readFiles, totalFiles) {
        return Math.round((readFiles / totalFiles) * 100);
    }

    // Initialize chart with initial values
    const readFileCount = 90;
    const totalFiles = 100;
    const readPercentage = calculateReadPercentage(readFileCount, totalFiles);
    const pendingPercentage = 100 - readPercentage;

    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Processed Files', 'Pending Files'], // Add labels
            datasets: [{
                data: [readPercentage, pendingPercentage],
                backgroundColor: [
                    '#2a5298',   // Blue for Read files
                    '#f5f5f5'    // Gray for Pending files
                ],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true, // Enable tooltips
                    callbacks: {
                        label: function (context) {
                            const label = context.label;
                            const value = context.parsed;

                            // Customize tooltip text
                            if (label === 'Processed Files') {
                                return `Read: ${readFileCount} files`;
                            } else {
                                return `Pending: ${totalFiles - readFileCount} files`;
                            }
                        },
                        title: function () {
                            return 'Total Files'; // Optional: custom title
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.7)', // Tooltip background color
                    titleColor: '#fff', // Title text color
                    bodyColor: '#fff',   // Body text color

                }
            },
            responsive: true,
            maintainAspectRatio: false
        },
        plugins: [{
            id: 'centerText',
            afterDraw: (chart) => {
                const { ctx, chartArea: { width, height } } = chart;
                ctx.save();

                const centerX = width / 2;
                const centerY = height / 2;

                // Draw percentage
                ctx.font = 'bold 32px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(readPercentage + '%', centerX, centerY);

                // Draw "Completed" text
                ctx.font = '16px Arial';
                ctx.fillStyle = '#666666';
                ctx.textBaseline = 'top';
                ctx.fillText('Completed', centerX, centerY);

                ctx.restore();
            }
        }]
    });

    // Rest of the code remains the same...
});

























































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
        document.getElementById('custom-search-input').value = '';
        showAllCustomOptions();
    }
}

function filterCustomOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('custom-search-input');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.custom-dropdown-list div');
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

function selectCustomOption(element) {
    var selectedOption = element.textContent || element.innerText;
    document.getElementById('selected-option').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.custom-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');
}

function showAllCustomOptions() {
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('custom-search-input').addEventListener('blur', function () {
    const selector = document.querySelector('.custom-selector');

    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';

    selector.style.border = '1px solid #6D6D6D';
});

window.onclick = function (event) {
    const dropdownContent = document.querySelector('.custom-dropdown-content');
    const selector = document.querySelector('.custom-selector');

    if (!event.target.matches('.custom-dropdown-toggle') && !event.target.matches('.custom-dropdown-toggle *') && !event.target.matches('#custom-search-input')) {

        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            document.getElementById('custom-search-input').value = '';
            filterCustomOptions();
            document.querySelector('.custom-dropdown-toggle').classList.remove('open');

            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }
};