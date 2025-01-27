function showSystemView() {
    document.getElementById('system-view').style.display = 'flex';
    document.getElementById('staff-view').style.display = 'none';
    document.getElementById('system-reviewtab').classList.add('active');
    document.getElementById('staff-reviewtab').classList.remove('active');

    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.style.display = 'flex'; 
    }

    document.getElementById('system-review-table').style.display = 'none';
}

function showStaffView() {
    document.getElementById('system-view').style.display = 'none';
    document.getElementById('staff-view').style.display = 'flex';
    document.getElementById('system-reviewtab').classList.remove('active');
    document.getElementById('staff-reviewtab').classList.add('active');
    document.getElementById('staff-view-reviewcontent').style.display = 'flex';
    document.getElementById('staffAfterSearch').style.display = 'none';
    document.getElementById('staffcontentLayout').style.display = 'none';

    // Show the image when Staff View is active
    const pcImage = document.querySelector('.staff-view-image');
    if (pcImage) {
        pcImage.style.display = 'block'; // Show the image
    }
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
    event.stopPropagation(); 
    const parentLi = event.currentTarget;
    const dropdown = parentLi.querySelector('.reviewdropdown');

    if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none'; 
        parentLi.classList.remove('open'); 
    } else {
        const allDropdowns = document.querySelectorAll('.reviewdropdown');
        allDropdowns.forEach((dd) => {
            dd.style.display = 'none';
            dd.parentElement.classList.remove('open');
        });

        dropdown.style.display = 'block'; 
        parentLi.classList.add('open'); 
    }
}

function loadReviewContent(systemName, department, system) {
    document.querySelector('.image-container').style.display = 'none'; 
    const systemReviewTable = document.getElementById('system-review-table');
    systemReviewTable.style.display = 'block';

    const headerElement = document.getElementById('system-header');
    const departmentName = department.querySelector(':scope > :first-child').textContent.trim();
    headerElement.innerHTML = `<b>${departmentName} / </b>${systemName}`;

    var departments = document.querySelectorAll('.reviewsidebar-reviewcontainer .menu-item');
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

    if (cardBody.classList.contains('expanded')) {
        cardBody.classList.remove('expanded');
        cardBody.style.maxHeight = '0px'; 
        dropdownIcon.classList.remove('fa-chevron-up');
        dropdownIcon.classList.add('fa-chevron-down');
    } else {
        cardBody.classList.add('expanded');
        cardBody.style.maxHeight = cardBody.scrollHeight + "px"; 
        dropdownIcon.classList.remove('fa-chevron-down');
        dropdownIcon.classList.add('fa-chevron-up');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var cardBody = document.getElementById('staff-card-body');
    cardBody.style.maxHeight = '0px';
    cardBody.style.borderTop = 'none';
    cardBody.style.padding = '0 20px'; 
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
    document.querySelector('.tableChanger').style.display = 'block';
}

function staffViewActive(event) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    event.currentTarget.classList.add('active');
    showFlightPlanningTable();
}

function toggleStatusDropdown() {
    var dropdownContent = document.querySelector('.status-dropdown-content');
    var dropdownToggle = document.querySelector('.status-dropdown-toggle');
    var selector = document.querySelector('.status-selector');

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
        document.getElementById('status-search-input').value = '';
        showAllStatusOptions();
    }
}

function filterStatusOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('status-search-input');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.status-dropdown-list div');
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

function selectStatusOption(element) {
    var selectedStatus = element.textContent || element.innerText;
    document.getElementById('selected-status').textContent = selectedStatus;
    document.querySelector('.status-dropdown-content').style.display = 'none';
    document.querySelector('.status-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.status-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.status-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');
}

function showAllStatusOptions() {
    var divs = document.querySelectorAll('.status-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('status-search-input').addEventListener('blur', function () {
    const selector = document.querySelector('.status-selector');

    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';

    selector.style.border = '1px solid #6D6D6D';
});

window.onclick = function (event) {
    const dropdownContent = document.querySelector('.status-dropdown-content');
    const selector = document.querySelector('.status-selector');

    if (!event.target.matches('.status-dropdown-toggle') && !event.target.matches('.status-dropdown-toggle *') && !event.target.matches('#status-search-input')) {

        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            document.getElementById('status-search-input').value = '';
            filterStatusOptions();
            document.querySelector('.status-dropdown-toggle').classList.remove('open');

            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }
};