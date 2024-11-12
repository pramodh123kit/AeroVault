// userOverview.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the progress chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    // You can replace this with your Chart.js configuration once you provide it
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [70, 30],
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
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Populate recent files dynamically
    const recentFiles = [
        {
            name: 'Aircraft Maintenance Checklist',
            system: 'Charika',
            date: 'Mar 4, 2024'
        },
        {
            name: 'EasyPass System Instructions',
            system: 'EasyPass',
            date: 'Mar 13, 2024'
        },
        {
            name: 'EasyPass System Instructions',
            system: 'EasyPass',
            date: 'Mar 15, 2024'
        },
        {
            name: 'Aircraft Maintenance Checklist',
            system: 'Charika',
            date: 'Mar 22, 2024'
        },
        {
            name: 'Aircraft Maintenance Checklist',
            system: 'Charika',
            date: 'Mar 25, 2024'
        }
    ];

    const fileList = document.querySelector('.file-list');
    
    recentFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <img src="/Assets/file-icon.svg" alt="File" class="file-icon">
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="system-name">${file.system}</span>
            </div>
            <span class="file-date">${file.date}</span>
        `;
        fileList.appendChild(fileItem);
    });
});