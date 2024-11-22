function showSystemView() {
    document.getElementById('system-view').style.display = 'flex';
    document.getElementById('staff-view').style.display = 'none';
    document.getElementById('system-reviewtab').classList.add('active');
    document.getElementById('staff-reviewtab').classList.remove('active');
}

function showStaffView() {
    document.getElementById('system-view').style.display = 'none';
    document.getElementById('staff-view').style.display = 'flex';
    document.getElementById('system-reviewtab').classList.remove('active');
    document.getElementById('staff-reviewtab').classList.add('active');
    document.getElementById('staff-view-reviewcontent').style.display = 'flex';
    document.getElementById('staffAfterSearch').style.display = 'none';
    document.getElementById('staffcontentLayout').style.display = 'none';
}

function filterDepartments() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById('departmentList');
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textReviewContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function toggleReviewDropdown(event) {
    var reviewdropdown = event.currentTarget.querySelector('.reviewdropdown');
    var icon = event.currentTarget.querySelector('.icon');
    var allReviewDropdowns = document.querySelectorAll('.reviewdropdown');
    var allIcons = document.querySelectorAll('.icon');

    allReviewDropdowns.forEach(function (dd) {
        if (dd !== reviewdropdown) {
            dd.style.display = 'none';
        }
    });

    allIcons.forEach(function (ic) {
        if (ic !== icon) {
            ic.classList.remove('rotate');
        }
    });

    if (reviewdropdown.style.display === 'block') {
        reviewdropdown.style.display = 'none';
        icon.classList.remove('rotate');
    } else {
        reviewdropdown.style.display = 'block';
        icon.classList.add('rotate');
    }
}

function loadReviewContent(url, department, system) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById('system-view-reviewcontent').innerHTML = data;
        })
        .catch(error => console.error('Error loading reviewcontent:', error));

    var departments = document.querySelectorAll('.department-list li');
    departments.forEach(function (dept) {
        dept.classList.remove('active');
    });
    department.classList.add('active');

    var systems = department.querySelectorAll('.reviewdropdown li');
    systems.forEach(function (sys) {
        sys.classList.remove('active');
    });
    system.classList.add('active');
}



function openReadModalUnique() {
    
    document.getElementById("readModalUnique").style.display = "block";
}

function closeReadModalUnique() {
    
    document.getElementById("readModalUnique").style.display = "none";
}

function openPendingModalUnique() {
    
    document.getElementById("pendingModalUnique").style.display = "block";
}

function closePendingModalUnique() {
    
    document.getElementById("pendingModalUnique").style.display = "none";
}

window.onclick = function (event) {
    if (event.target == document.getElementById("readModalUnique")) {
        closeReadModalUnique();
    }
    if (event.target == document.getElementById("pendingModalUnique")) {
        closePendingModalUnique();
    }
}

function searchTableUnique() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInputUnique");
    filter = input.value.toLowerCase();
    table = document.getElementById("fileTableUnique");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}



function closePopup() {
    var popup = document.querySelector('.readUsers-container');
    popup.style.display = 'none';
}

function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("readUsers-searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("readUsers-dataTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("readUsers-dataTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


function pendingUsersSearchTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("pendingUsersSearchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("pendingUsersTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

function pendingUsersClosePopup() {
    window.close();
}

function pendingUsersSortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("pendingUsersTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function staffViewPerformSearch() {
    document.getElementById('system-view').style.display = 'none';
    document.getElementById('staff-view').style.display = 'flex';
    document.getElementById('staffAfterSearch').style.display = 'flex';
    document.getElementById('staffcontentLayout').style.display = 'flex';
    document.getElementById('staff-view-reviewcontent').style.display = 'none';
}

function filterStaffViewSidebar() {
    var input, filter, menuItems, i, txtValue;
    input = document.getElementById('searchInputStaff');
    filter = input.value.toLowerCase();
    menuItems = document.getElementsByClassName('menu-item');

    for (i = 0; i < menuItems.length; i++) {
        txtValue = menuItems[i].textContent || menuItems[i].innerText;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            menuItems[i].style.display = "";
        } else {
            menuItems[i].style.display = "none";
        }
    }
}

function staffViewDropdown() {
    var cardBody = document.getElementById('staff-card-body');
    var dropdownIcon = document.getElementById('staff-dropdown-icon');
    if (cardBody.style.maxHeight === '0px' || cardBody.style.maxHeight === '') {
        cardBody.style.maxHeight = cardBody.scrollHeight + "5px";
        cardBody.style.borderTop = '2px solid #ddd'; /* Increased border size */
        cardBody.style.padding = '20px'; /* Increased padding */
        dropdownIcon.classList.remove('fa-chevron-down');
        dropdownIcon.classList.add('fa-chevron-up');
    } else {
        cardBody.style.maxHeight = '0px';
        cardBody.style.borderTop = 'none';
        cardBody.style.padding = '0 0px'; /* Reset padding */
        dropdownIcon.classList.remove('fa-chevron-up');
        dropdownIcon.classList.add('fa-chevron-down');
    }
}

// Initialize the card body to be collapsed
document.addEventListener('DOMContentLoaded', function () {
    var cardBody = document.getElementById('staff-card-body');
    cardBody.style.maxHeight = '0px';
    cardBody.style.borderTop = 'none';
    cardBody.style.padding = '0 20px'; /* Initial padding */
});

function filterStaffViewTable() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("staffSearchInput");
    filter = input.value.toLowerCase();
    table = document.querySelector("table");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}

function showFlightPlanningTable() {
    // Hide other content if necessary
    document.querySelector('.tableChanger').style.display = 'block'; // Show the table
}

// Function to handle menu item clicks
function staffViewActive(event) {
    // Remove active class from all menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to the clicked menu item
    event.currentTarget.classList.add('active');

    // Call the function to show the corresponding table or content
    showFlightPlanningTable();
}