var week1Count = 0;
var week2Count = 0;
var week3Count = 0;
var week4Count = 0;

var myChart;
var myChart2; 

document.getElementById('sidebar-toggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('sidebar-visible');
    document.getElementById('overlay').classList.toggle('overlay-visible');
});

document.getElementById('overlay').addEventListener('click', function () {
    document.getElementById('sidebar').classList.remove('sidebar-visible');
    this.classList.remove('overlay-visible');
});

function loadContent(controllerName, pageTitle) {

    document.querySelector('.page-title-name').textContent = pageTitle;

    const loadingScreen = document.getElementById('loading-screen');

    // Show loading screen with a slight delay
    let loadingTimeout = setTimeout(() => {
        loadingScreen.style.display = 'flex';
    }, 100);

    // Define the base URL correctly
   // const baseUrWel = window.location.origin + "/";

    // Define the correct mapping for controllers and actions
    const controllerMap = {
        'Index': { controller: 'Overview', action: 'Index' },
        'Upload': { controller: 'Upload', action: 'Index' },
        'Systems': { controller: 'Systems', action: 'Index' },
        'Departments': { controller: 'Departments', action: 'Index' },
        'Divisions': { controller: 'Divisions', action: 'Index' },
        'Review': { controller: 'Review', action: 'Index' }
    };

    // Validate controller name
    if (!controllerMap[controllerName]) {
        console.error("Invalid controller name:", controllerName);
        return;
    }

    // Get controller and action dynamically
    const selectedController = controllerMap[controllerName];

    // Construct the correct URL
    const url = `${baseUrWel}${selectedController.controller}/${selectedController.action}`;

    console.log("Loading URL:", url);

    $.ajax({
        url: url,
        type: 'GET',
        success: function (result) {
            clearTimeout(loadingTimeout);
            loadingScreen.style.display = 'none';
            $('#main-content').html(result);

            // If the loaded page is Overview, initialize charts
            if (selectedController.controller === 'Overview' && selectedController.action === 'Index') {
                initializeCharts();
            }
        },
        error: function (xhr, status, error) {
            clearTimeout(loadingTimeout);
            loadingScreen.style.display = 'none';
            console.error("Error loading content:", error);
            $('#main-content').html('<p class="text-danger">Failed to load content. Please try again later.</p>');
        }
    });
}

function initializeCharts() {
    console.log("Fetching staff login times...");

    $.ajax({
        url: baseUrWel + "Overview/GetStaffLoginTimes",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log("Data received:", data);

            const currentDate = new Date();
            const firstDayOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const firstDayOfNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

            const filteredLoginTimes = data.filter(function (login) {
                const loginTime = new Date(login.timeOfLoggingIn);
                return loginTime >= firstDayOfCurrentMonth && loginTime < firstDayOfNextMonth;
            });

            const groups = {
                week1: [],
                week2: [],
                week3: [],
                week4: []
            };

            $.each(filteredLoginTimes, function (index, login) {
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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("There was a problem with the AJAX request:", textStatus, errorThrown);
        }
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




//function loadContent(controllerName, pageTitle) {
//    document.querySelector('.page-title-name').textContent = pageTitle;

//    const loadingScreen = document.getElementById('loading-screen');
//    let loadingTimeout = setTimeout(() => {
//        loadingScreen.style.display = 'flex'; /
//    }, 100);

   
//    const controllerMap = {
//        'Index': 'Overview',
//        '_Upload': 'Upload',
//        '_Systems': 'Systems',
//        '_Departments': 'Departments',
//        '_Divisions': 'Divisions',
//        '_Review': 'Review'
//    };
  
//    const controller = controllerMap[controllerName] || 'Overview';
//    if (typeof baseUrWel === 'undefined') {
//        var baseUrWel = 'https://localhost:44369/';
//    }
//    console.log("base", baseUrWel)
//    $.ajax({
//        url: `${baseUrWel}Overview/Index`, 
//        type: 'GET',
//        success: function (result) {
//            clearTimeout(loadingTimeout); 
//            loadingScreen.style.display = 'none'; 
//            $('#main-content').html(result);

//            if (controller === 'Overview') {
              
//                initializeCharts();
//            }
//        },
//        error: function (xhr, status, error) {
//            clearTimeout(loadingTimeout); // Clear the loading timeout
//            loadingScreen.style.display = 'none'; // Hide loading screen
//            console.error("Error loading content:", error);
//            $('#main-content').html('<p class="text-danger">Failed to load content. Please try again later.</p>');
//        }
//    });
//}

document.addEventListener("DOMContentLoaded", function () {
    loadContent('Index', 'Overview');
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const dropdownIcon = document.getElementById('dropdown-icon');

    const profileInfo = document.querySelector('.profile-info');
    const profileDetails = document.querySelector('.profile-details');

    profileInfo.addEventListener('click', function () {
        // Toggle the visibility of profile details
        if (profileDetails.style.display === 'none' || profileDetails.style.display === '') {
            profileDetails.style.display = 'block';
        } else {
            profileDetails.style.display = 'none';
        }
    });

    sidebarToggle.addEventListener("click", function () {
        if (window.innerWidth >= 1024) {
            sidebar.classList.toggle("hidden");
        } else {
            sidebar.classList.remove("hidden");
        }
    });

    document.getElementById('manage-toggle').addEventListener('click', function () {
        const subMenu = document.getElementById('manage-sub-menu');
        const isVisible = subMenu.classList.contains('visible');
        const manageLink = this;

        if (!isVisible) {
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            subMenu.classList.add('visible');
            dropdownIcon.classList.add('rotate');
            manageLink.classList.add('manage-active');
        } else {
            subMenu.style.maxHeight = null;
            subMenu.classList.remove('visible');
            dropdownIcon.classList.remove('rotate');
            manageLink.classList.remove('manage-active');
        }
    });

    function handleNavLinkClick(event) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const icon = link.querySelector('img');
            if (icon) {
                icon.src = icon.getAttribute('data-original');
            }
        });

        event.currentTarget.classList.add('active');

        const clickedIcon = event.currentTarget.querySelector('img');
        const newIconSrc = event.currentTarget.getAttribute('data-icon');
        if (clickedIcon) {
            clickedIcon.src = newIconSrc;
        }

        // Check if the clicked link is inside the manage sub-menu
        const isManageSubMenuItem = event.currentTarget.closest('#manage-sub-menu');

        // Check if the clicked link is the "Manage" link
        const isManageLink = event.currentTarget.id === 'manage-toggle';

        if (isManageSubMenuItem) {
            // If a sub-menu item is clicked, close the sidebar on mobile
            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.remove('sidebar-visible');
                document.getElementById('overlay').classList.remove('overlay-visible');
            }
        }

        if (isManageLink) {
            // If "Manage" is clicked, keep the sub-menu toggle behavior
            return; // Prevent further action for Manage link
        }

        // Close sidebar for other menu items on small screens
        if (window.innerWidth < 1024) {
            document.getElementById('sidebar').classList.remove('sidebar-visible');
            document.getElementById('overlay').classList.remove('overlay-visible');
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action

            // Remove active class and restore original icon for all links
            document.querySelectorAll('.nav-link').forEach(otherLink => {
                otherLink.classList.remove('active');
                const otherIcon = otherLink.querySelector('img');
                if (otherIcon) {
                    const originalIcon = otherIcon.getAttribute('data-original');
                    if (originalIcon) {
                        otherIcon.src = originalIcon;
                    }
                }
            });

            // Add active class to clicked link
            this.classList.add('active');

            // Change icon source for the clicked link
            const icon = this.querySelector('img');
            let activeIcon = this.getAttribute('data-icon');

            if (icon && activeIcon) {
                if (activeIcon.startsWith('~/')) {
                    // Replace `~/` with the correct base URL
                    activeIcon = activeIcon.replace('~/', window.location.origin + '/');
                }

                // Add /AeroVaultCore if the base URL contains it
                if (window.location.pathname.includes('/AeroVaultCore')) {
                    activeIcon = '/AeroVaultCore' + activeIcon;
                }

                icon.src = activeIcon;
            }
        });

        // Store the original icon source
        const icon = link.querySelector('img');
        if (icon) {
            icon.setAttribute('data-original', icon.src);
        }

        // Handle mouseover to change the icon source
        link.addEventListener('mouseover', function () {
            let hoverIcon = this.getAttribute('data-icon');
            if (icon && hoverIcon) {
                if (hoverIcon.startsWith('~/')) {
                    // Replace `~/` with the correct base URL on hover as well
                    hoverIcon = hoverIcon.replace('~/', window.location.origin + '/');
                }

                // Add /AeroVaultCore if the base URL contains it
                if (window.location.pathname.includes('/AeroVaultCore')) {
                    hoverIcon = '/AeroVaultCore' + hoverIcon;
                }

                icon.src = hoverIcon;
            }
        });

        // Handle mouseout to restore the original icon unless the link is active
        link.addEventListener('mouseout', function () {
            if (!link.classList.contains('active')) {
                const originalIcon = icon.getAttribute('data-original');
                if (icon) {
                    icon.src = originalIcon;
                }
            }
        });
    });


});

function fileEditopenPopup() {
    document.getElementById('dark-overlay6').style.display = 'block';
    document.getElementById('editfile-popup2').style.display = 'block';
}

function fileEditClosePopup() {
    document.getElementById('dark-overlay6').style.display = 'none';
    document.getElementById('editfile-popup2').style.display = 'none';
}

document.querySelectorAll(".logout-icon").forEach(function (icon) {
    icon.onclick = fileEditopenPopup;
});

document.getElementById('dark-overlay6').onclick = fileEditClosePopup;
document.getElementById('close-logout').onclick = fileEditClosePopup;

document.getElementById('sidebar-toggle').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Toggle sidebar visibility
    sidebar.classList.toggle('sidebar-visible');

    // If the sidebar is visible, show the overlay; otherwise, hide it
    if (sidebar.classList.contains('sidebar-visible')) {
        overlay.classList.add('overlay-visible');
    } else {
        overlay.classList.remove('overlay-visible');
    }
});

// Hide sidebar and overlay when overlay is clicked
document.getElementById('overlay').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('sidebar-visible');
    overlay.classList.remove('overlay-visible');
});

document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    sidebarToggle.addEventListener("click", function () {
        if (window.innerWidth < 1024) {
            sidebar.classList.toggle("sidebar-visible");
            const overlay = document.getElementById('overlay');
            if (sidebar.classList.contains('sidebar-visible')) {
                overlay.classList.add('overlay-visible');
            } else {
                overlay.classList.remove('overlay-visible');
            }
        }
    });
});