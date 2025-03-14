﻿function showSystemView() {
    document.getElementById('system-view').style.display = 'flex';
    document.getElementById('staff-view').style.display = 'none';
    document.getElementById('system-reviewtab').classList.add('active');
    document.getElementById('staff-reviewtab').classList.remove('active');

    const imageContainer = document.querySelector('.image-container');
    const systemReviewTable = document.getElementById('system-review-table');

    imageContainer.style.display = 'flex';
    systemReviewTable.style.display = 'none';
}

function showStaffView() {
    document.getElementById('system-view').style.display = 'none';
    document.getElementById('staff-view').style.display = 'flex';
    document.getElementById('system-reviewtab').classList.remove('active');
    document.getElementById('staff-reviewtab').classList.add('active');
    document.getElementById('staff-view-reviewcontent').style.display = 'flex';
    document.getElementById('staffAfterSearch').style.display = 'none';
    document.getElementById('staffcontentLayout').style.display = 'none';

    const pcImage = document.querySelector('.staff-view-image');
    if (pcImage) {
        pcImage.style.display = 'block'; 
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

function loadReviewContent(systemName, department) {
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

    fetch(`/Review/GetFilesBySystem?systemId=${department.dataset.systemId}`)
        .then(response => response.json())
        .then(data => {
            populateFilesTable(data);
        })
        .catch(error => console.error('Error fetching files:', error)); 
}


function populateFilesTable(files, uniqueFileIdentifiers, viewedFiles) {
    const tableBody = document.querySelector('#fileTableUnique tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Get the StaffNo from the staff card
    const staffNo = document.querySelector('.staff-card-header .id').textContent.trim().substring(2); // Assuming the format is "- StaffNo"
    console.log(`StaffNo to be checked is: ${staffNo}`); // Log the StaffNo

    // Create a map for quick lookup of viewed dates by uniqueFileIdentifier
    const viewedDateMap = {};
    viewedFiles.forEach(viewedFile => {
        viewedDateMap[viewedFile.uniqueFileIdentifier] = viewedFile.viewedDate;
    });

    // Iterate over each file and create a row
    files.forEach(file => {
        const row = document.createElement('tr');

        // Determine the icon based on the file type
        const icon = file.fileType === 'Video'
            ? `<img src="/Content/Assets/system-video-icon.svg" alt="Video Icon" class="file-option-icon" />`
            : `<img src="/Content/Assets/system-file-icon.svg" alt="Document Icon" class="file-option-icon" />`;

        // Check if the file's uniqueFileIdentifier is in the uniqueFileIdentifiers array
        const isRead = uniqueFileIdentifiers.includes(file.uniqueFileIdentifier); // Check if the file has been read
        const statusText = isRead ? 'Read' : 'Pending'; // Set status based on whether it has been read
        const statusClass = isRead ? 'status-read' : 'status-pending'; // Set class for styling

        // Get the viewed date if the file has been read
        const viewedDate = isRead ? formatDate(viewedDateMap[file.uniqueFileIdentifier]) : '-'; // Format the viewed date

        // Log the uniqueFileIdentifier and VIEWEDDATE if the file has been read
        if (isRead) {
            console.log(`UNIQUEFILEIDENTIFIER: ${file.uniqueFileIdentifier}, VIEWEDDATE: ${viewedDate}`);
        }

        // Update the row to include fileName and fileCategory
        row.innerHTML = `
            <td>${icon}${file.fileName}</td>
            <td>${file.fileCategory}</td>
            <td class="read-by-unique">
                <i class="fas fa-eye"></i>154 <span class="clickable-icon-unique" onclick="openReadModalUnique()"></span>
            </td>
            <td class="pending-by-unique">
                <i class="fas fa-hourglass-half"></i>233 <span class="clickable-icon-unique" onclick="openPendingModalUnique()"></span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Format as "Mar 12, 2025"
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
    const staffNo = document.getElementById('staffViewSearchInput').value.trim();

    if (!staffNo) {
        alert("Please enter a Staff ID.");
        return;
    }

    fetch(`/Review/CheckStaffNoExists?staffNo=${staffNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                fetch(`/Review/GetStaffDetails?staffNo=${staffNo}`)
                    .then(response => response.json())
                    .then(staffData => {
                        document.querySelector('.staff-card-header .name').textContent = staffData.staffName;
                        document.querySelector('.staff-card-header .id').textContent = `- ${staffData.staffNo}`;
                        document.querySelector('.staff-card-body .left .item:nth-child(1) div').textContent = staffData.department;
                        document.querySelector('.staff-card-body .left .item:nth-child(2) div').textContent = staffData.jobTitle;
                        document.querySelector('.staff-card-body .right .item:nth-child(1) div').textContent = staffData.email;

                        // Fetch Department ID and then systems
                        getDepartmentId(staffData.department).then(departmentId => {
                            return fetch(`/Review/GetSystemsByDepartment?departmentId=${departmentId}`);
                        }).then(response => response.json())
                            .then(systems => {
                                updateStaffViewSidebar2(systems); // Update staffViewSidebar2
                            });

                        document.getElementById('system-view').style.display = 'none';
                        document.getElementById('staff-view').style.display = 'flex';
                        document.getElementById('staffAfterSearch').style.display = 'flex';
                        document.getElementById('staffcontentLayout').style.display = 'flex';
                        document.getElementById('staff-view-reviewcontent').style.display = 'none';
                        adjustStaffViewContentHeight();
                    });
            } else {
                // Handle error
            }
        });
}

function adjustStaffViewContentHeight() {
    const staffViewContent = document.querySelector('.staffViewContent');
    staffViewContent.style.height = '450px'; 
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

    const pcImage = document.querySelector('.staff-view-image');

    if (pcImage) {

        pcImage.style.display = 'none';

    }

    document.querySelector('.tableChanger').style.display = 'block';

}
function staffViewActive(event) {

    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {

        item.classList.remove('active');

    });


    event.currentTarget.classList.add('active');


    const pcImage = document.querySelector('.staff-view-image');

    if (pcImage) {

        pcImage.style.display = 'none';

    }


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

    var departmentId = element.getAttribute('data-department-id');

    const imageContainer = document.querySelector('.image-container');
    const systemReviewTable = document.getElementById('system-review-table');

    imageContainer.style.display = 'flex';
    systemReviewTable.style.display = 'none';

    // Fetch systems for the selected department and update staffViewSidebar
    fetch(`/Review/GetSystemsByDepartment?departmentId=${departmentId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Log the systems to the console for debugging
            updateStaffViewSidebar(data); // Update the staffViewSidebar with the fetched systems
        })
        .catch(error => console.error('Error fetching systems:', error));
}


function updateStaffViewSidebar2(systems) {
    const sidebar = document.querySelector('.staffViewSidebar2');
    sidebar.innerHTML = ''; // Clear existing content

    if (systems.length === 0) {
        sidebar.innerHTML = '<div class="no-systems">No systems found</div>';
    } else {
        systems.forEach(system => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.systemId = system.systemID; // Store SystemID in data attribute

            // Add an event handler specific to staffViewSidebar2
            menuItem.onclick = function () {
                fetchFilesBySystem(system.systemID); // Fetch files for the selected system
                staffViewActive(event); // Keep the existing functionality
            };

            menuItem.innerHTML = `<i class="fas fa-folder"></i><span>${system.systemName}</span>`;
            sidebar.appendChild(menuItem);
        });
    }
}

function fetchFilesBySystem(systemId) {
    // Fetch the system details to get the system name
    fetch(`/Review/GetSystemById?systemId=${systemId}`)
        .then(response => response.json())
        .then(system => {
            // Update the system name in the header
            const headerElement = document.getElementById('system-header');
            headerElement.innerHTML = system.systemName; // Set the system name

            // Hide the image container and show the system review table
            const imageContainer = document.querySelector('.image-container');
            const systemReviewTable = document.getElementById('system-review-table');

            imageContainer.style.display = 'none'; // Hide the image container
            systemReviewTable.style.display = 'block'; // Show the system review table

            // Fetch the non-deleted files associated with the system
            return fetch(`/Review/GetNonDeletedFilesBySystem?systemId=${systemId}`);
        })
        .then(response => response.json())
        .then(files => {
            console.log("Non-deleted files:", files); // Log the non-deleted files

            // Fetch unique file identifiers for the current staffNo
            const staffNo = document.querySelector('.staff-card-header .id').textContent.trim().substring(2);
            return fetch(`/Review/GetUniqueFileIdentifiers?staffNo=${staffNo}`)
                .then(response => response.json())
                .then(uniqueData => {
                    // Fetch viewed files for the current staffNo
                    return fetch(`/Review/GetViewedFiles?staffNo=${staffNo}`)
                        .then(response => response.json())
                        .then(viewedFiles => {
                            // Populate the table with the fetched files, unique file identifiers, and viewed files
                            const uniqueFileIdentifiers = uniqueData.uniqueFileIdentifiers;
                            populateFilesTable(files, uniqueFileIdentifiers, viewedFiles);
                        });
                });
        })
        .catch(error => console.error('Error fetching files:', error));
}


function updateStaffViewSidebar(systems) {
    const sidebar = document.querySelector('.staffViewSidebar');
    sidebar.innerHTML = ''; // Clear existing content

    if (systems.length === 0) {
        sidebar.innerHTML = '<div class="no-systems">No systems found</div>';
    } else {
        systems.forEach(system => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.dataset.systemId = system.systemID; // Store SystemID in data attribute

            // Add an event handler specific to staffViewSidebar
            menuItem.onclick = function () {
                fetchFilesBySystem(system.systemID); // Fetch files for the selected system
                staffViewActive(event); // Keep the existing functionality
            };

            menuItem.innerHTML = `<i class="fas fa-folder"></i><span>${system.systemName}</span>`;
            sidebar.appendChild(menuItem);
        });
    }
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

function getDepartmentId(departmentName) {
    return fetch(`/Review/GetDepartmentId?departmentName=${encodeURIComponent(departmentName)}`)
        .then(response => response.json())
        .then(data => data.departmentId);
}

function checkStaffNoExists(staffNo) {
    fetch(`/Review/CheckStaffNoExists?staffNo=${staffNo}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                console.log("yes");
                // Fetch unique file identifiers and viewed dates
                fetch(`/Review/GetViewedFiles?staffNo=${staffNo}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log("Unique File Identifiers and Viewed Dates:", data);
                        // Pass the identifiers and viewed dates to populateFilesTable
                        const uniqueFileIdentifiers = data.map(file => file.UniqueFileIdentifier);
                        const viewedDates = data.map(file => file.ViewedDate);
                        populateFilesTable(files, uniqueFileIdentifiers, viewedDates);
                    })
                    .catch(error => console.error('Error fetching viewed files:', error));
            } else {
                console.log("no");
            }
        })
        .catch(error => console.error('Error checking StaffNo:', error));
}