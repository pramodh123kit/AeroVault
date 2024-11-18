// userOverview.js
document.addEventListener('DOMContentLoaded', function() {
    
    function calculateReadPercentage(readFiles, totalFiles) {
        return Math.round((readFiles / totalFiles) * 100);
    }

    // Initialize chart with initial values
    const readFileCount = 90;  // This should come from your backend
    const totalFiles = 100;     // This should come from your backend
    const readPercentage = calculateReadPercentage(readFileCount, totalFiles);
    const pendingPercentage = 100 - readPercentage;

    const ctx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
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
                    enabled: false
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

    // Add legend below chart
    const legend = `
        <div class="chart-legend">
            <div class="legend-item">
                <span class="legend-color" style="background: #2a5298;"></span>
                <span class="legend-text">Read File Count: ${readFileCount}</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #f5f5f5;"></span>
                <span class="legend-text">Pending File Count: ${totalFiles - readFileCount}</span>
            </div>
        </div>
    `;
    
    const chartContainer = document.querySelector('.chart-container');
    chartContainer.insertAdjacentHTML('afterend', legend);

    // Function to update chart
    window.updateChart = function(newReadCount, newTotalFiles) {
        const newReadPercentage = calculateReadPercentage(newReadCount, newTotalFiles);
        progressChart.data.datasets[0].data = [newReadPercentage, 100 - newReadPercentage];
        progressChart.update();

        // Update legend text
        document.querySelectorAll('.legend-text')[0].textContent = `Read File Count: ${newReadCount}`;
        document.querySelectorAll('.legend-text')[1].textContent = `Pending File Count: ${newTotalFiles - newReadCount}`;
    };

    // Your existing recent files code remains here
    const recentFiles = [
        {
            name: 'Aircraft Maintenance Checklist',
            system: 'Charika',
            date: 'Mar 4, 2024'
        },

        {
            name: 'EasyPass System Instructions',
            system: 'EasyPass',
            date: 'Mar 20, 2024'
        },

        {
            name: 'Aircraft Maintenance Checklist',
            system: 'Charika',
            date: 'Mar 11, 2024'
        },

        {
            name: 'EasyPass System Instructions',
            system: 'EasyPass',
            date: 'Mar 01, 2024'
        },

        {
            name: 'Aircraft Maintenance Checklist',
            system: 'Charika',
            date: 'Mar 21, 2024'
        },


        // ... rest of your recent files
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