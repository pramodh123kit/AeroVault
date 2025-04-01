document.addEventListener('DOMContentLoaded', function () {

    const userRole = document.getElementById('userRole')?.value || 'Role not found';
    const staffName = document.getElementById('staffName')?.value || 'Name not found';

    console.log('User Details:', {
        Role: userRole,
        Name: staffName
    });

    function calculateReadPercentage(readFiles, totalFiles) {
        return Math.round((readFiles / totalFiles) * 100);
    }

    const readFileCount = 90;
    const totalFiles = 100;
    const readPercentage = calculateReadPercentage(readFileCount, totalFiles);
    const pendingPercentage = 100 - readPercentage;

    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Processed Files', 'Pending Files'], 
            datasets: [{
                data: [readPercentage, pendingPercentage],
                backgroundColor: [
                    '#2a5298',   
                    '#f5f5f5'    
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
                    enabled: true, 
                    callbacks: {
                        label: function (context) {
                            const label = context.label;
                            const value = context.parsed;

                            if (label === 'Processed Files') {
                                return `Read: ${readFileCount} files`;
                            } else {
                                return `Pending: ${totalFiles - readFileCount} files`;
                            }
                        },
                        title: function () {
                            return 'Total Files'; 
                        }
                    },
                    backgroundColor: 'rgba(0,0,0,0.7)', 
                    titleColor: '#fff', 
                    bodyColor: '#fff',   

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

                ctx.font = 'bold 32px Arial';
                ctx.fillStyle = '#000000';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(readPercentage + '%', centerX, centerY);

                ctx.font = '16px Arial';
                ctx.fillStyle = '#666666';
                ctx.textBaseline = 'top';
                ctx.fillText('Completed', centerX, centerY);

                ctx.restore();
            }
        }]
    });
});
function toggleCustomDropdown() {
    var dropdown = document.querySelector('.custom-dropdown');
    if (dropdown.classList.contains('disabled')) {
        return false;
    }

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
    var dropdown = document.querySelector('.custom-dropdown');
    if (dropdown.classList.contains('disabled')) {
        return false;
    }

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

window.onclick = function (event) {
    const dropdown = document.querySelector('.custom-dropdown');
    const dropdownContent = document.querySelector('.custom-dropdown-content');
    const selector = document.querySelector('.custom-selector');

    if (dropdown.classList.contains('disabled')) {
        return;
    }

    if (!event.target.matches('.custom-dropdown-toggle') &&
        !event.target.matches('.custom-dropdown-toggle *') &&
        !event.target.matches('#custom-search-input')) {

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