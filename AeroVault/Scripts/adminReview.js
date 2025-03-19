function showSystemView() {
    document.getElementById('system-view').style.display = 'flex';
    document.getElementById('staff-view').style.display = 'none';
    document.getElementById('system-reviewtab').classList.add('active');
    document.getElementById('staff-reviewtab').classList.remove('active');

    const imageContainer = document.querySelector('.image-container');
    const systemReviewTable = document.getElementById('system-review-table');

    imageContainer.style.display = 'flex';
    systemReviewTable.style.display = 'none';

    // Check if the image container is visible
    if (imageContainer.style.display === 'flex') {
        // Remove any active class from the staffViewSidebar
        const staffViewSidebar = document.querySelector('.staffViewSidebar');
        staffViewSidebar.querySelectorAll('.menu-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
}

function showStaffView() {
    document.getElementById('system-view').style.display = 'none';
    document.getElementById('staff-view').style.display = 'flex';
    document.getElementById('system-reviewtab').classList.remove('active');
    document.getElementById('staff-reviewtab').classList.add('active');
    document.getElementById('staff-view-reviewcontent').style.display = 'flex';
    document.getElementById('staffAfterSearch').style.display = 'none';
    document.getElementById('staffcontentLayout').style.display = 'none';

    // Hide the tableChanger and reset the active state
    const tableChanger = document.querySelector('.tableChanger');
    tableChanger.style.display = 'none'; // Hide the tableChanger

    const staffViewSidebar2 = document.querySelector('.staffViewSidebar2');
    staffViewSidebar2.querySelectorAll('.menu-item.active').forEach(item => {
        item.classList.remove('active'); // Remove active class from any selected item
    });

    const pcImage = document.querySelector('.staff-view-image');
    if (pcImage) {
        pcImage.style.display = 'block';
    }

    document.getElementById('staffViewSearchInput').value = ''; // Clear the input field
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
    const tableBody = document.querySelector('.table-container tbody');
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

        row.innerHTML = `
            <td>${icon}${file.fileName}</td>
            <td>${file.fileCategory}</td>
            <td>${viewedDate}</td>
            <td class="${statusClass}">${statusText}</td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Format as "Mar 12, 2025"
}


function closeReadModalUnique() {
    document.getElementById("readModalUnique").style.display = "none";
}

function openReadModalUnique(uniqueFileIdentifier, fileName) {
    // Update the modal title with the file name
    const readModalTitle = document.getElementById("readModal-title");
    readModalTitle.textContent = `Read Users - ${fileName}`; // Set the title text

    // Update the modal header with the selected department and system names
    const readModalHeader = document.getElementById("readModal-header");
    readModalHeader.textContent = `${selectedDepartmentName} / ${selectedSystemName}`; // Set the header text

    // Fetch the staff details for the given uniqueFileIdentifier
    fetch(`/Review/GetStaffNosByUniqueFileIdentifier?uniqueFileIdentifier=${uniqueFileIdentifier}`)
        .then(response => response.json())
        .then(staffDetails => {
            if (staffDetails.length === 0) {
                console.log("No staff have read this file.");
                return; // Exit if no staff have read the file
            }

            // Create a map to store unique staff entries
            const uniqueStaffMap = new Map();

            // Iterate over the staff details and add them to the map
            staffDetails.forEach(staff => {
                if (!uniqueStaffMap.has(staff.staffNo)) {
                    uniqueStaffMap.set(staff.staffNo, staff);
                }
            });

            // Convert the map values back to an array
            const uniqueStaffDetails = Array.from(uniqueStaffMap.values());

            // Populate the modal with the unique staff details
            const readUsersTableBody = document.querySelector('#readUsers-dataTable tbody');
            readUsersTableBody.innerHTML = ''; // Clear existing rows

            // Log each STAFFNO in the modal
            uniqueStaffDetails.forEach(staff => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${staff.staffNo}</td>
                    <td>${staff.staffName}</td>
                    <td>${formatViewedDate(staff.viewedDate)}</td> <!-- Format the viewed date -->
                `;
                readUsersTableBody.appendChild(row);
            });

            // Show the modal
            document.getElementById("readModalUnique").style.display = "block";
        })
        .catch(error => console.error('Error fetching staff numbers:', error));
}
function formatViewedDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Format as "Mar 14, 2025"
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
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("readUsers-searchInput");
    filter = input.value.toUpperCase(); // Convert input to uppercase for case-insensitive comparison
    table = document.getElementById("readUsers-dataTable");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) { // Start from 1 to skip the header row
        tr[i].style.display = "none"; // Initially hide all rows
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText; // Get the text content of the cell
                // Check if the text value matches the input
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = ""; // Show the row if it matches
                    break; // No need to check other cells in this row
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
    const staffNo = document.getElementById('staffViewSearchInput').value.trim().toUpperCase();
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.style.display = 'none';

    if (!staffNo) {
        errorMessageDiv.textContent = "Please enter a Staff ID.";
        errorMessageDiv.style.display = 'block';
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

                        getDepartmentId(staffData.department).then(departmentId => {
                            return fetch(`/Review/GetSystemsByDepartment?departmentId=${departmentId}`);
                        }).then(response => response.json())
                            .then(systems => {
                                updateStaffViewSidebar2(systems);
                            });

                        document.getElementById('system-view').style.display = 'none';
                        document.getElementById('staff-view').style.display = 'flex';
                        document.getElementById('staffAfterSearch').style.display = 'flex';
                        document.getElementById('staffcontentLayout').style.display = 'flex';
                        document.getElementById('staff-view-reviewcontent').style.display = 'none';
                        adjustStaffViewContentHeight();
                    });
            } else {
                errorMessageDiv.textContent = "This staff hasn't read any files.";
                errorMessageDiv.style.display = 'block';
            }
        });
}

function adjustStaffViewContentHeight() {
    const staffViewContent = document.querySelector('.staffViewContent');
    staffViewContent.style.height = '450px';
}

function filterStaffViewSidebar() {
    var input, filter, sidebar, menuItems, i, txtValue;
    input = document.getElementById("searchInputStaff");
    filter = input.value.toUpperCase(); // Convert input to uppercase for case-insensitive comparison
    sidebar = document.querySelector(".staffViewSidebar2");
    menuItems = sidebar.getElementsByClassName("menu-item");

    for (i = 0; i < menuItems.length; i++) {
        txtValue = menuItems[i].textContent || menuItems[i].innerText; // Get the text content of the menu item
        // Check if the text value matches the input
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            menuItems[i].style.display = ""; // Show the menu item if it matches
        } else {
            menuItems[i].style.display = "none"; // Hide the menu item if it does not match
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
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("staffSearchInput");
    filter = input.value.toUpperCase(); // Convert input to uppercase for case-insensitive comparison
    table = document.querySelector(".tableChanger table"); // Select the table within the tableChanger
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) { // Start from 1 to skip the header row
        tr[i].style.display = "none"; // Initially hide all rows
        td = tr[i].getElementsByTagName("td");
        if (td.length > 0) {
            txtValue = td[0].textContent || td[0].innerText; // Get the text content of the first cell (File Name)
            // Check if the text value matches the input
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // Show the row if it matches
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


var selectedDepartmentName = ''; // Global variable to store the selected department name

function selectStatusOption(element) {
    selectedDepartmentName = element.textContent || element.innerText; // Store the selected department name

    document.getElementById('selected-status').textContent = selectedDepartmentName;

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

var selectedSystemName = ''; // Global variable to store the selected system name

function selectSystem(system) {
    selectedSystemName = system.querySelector('span').textContent; // Store the system name
    const headerElement = document.getElementById('system-header');
    headerElement.textContent = selectedSystemName; // Update the header with the system name

    const systemId = system.dataset.systemId; // Get the system ID

    // Fetch files for the selected system
    fetchFilesForSystemView(systemId); // Fetch files for the selected system
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

                selectSystemForStaffView(menuItem); // Call the new selectSystemForStaffView function

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

                selectSystem(menuItem); // Call the new selectSystem function

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


function fetchFilesForStaffView(systemId) {

    const staffNo = document.querySelector('.staff-card-header .id').textContent.trim().substring(2); // Get the StaffNo

    const selectedStatus = document.getElementById('staffViewDropdown-status').value; // Get the selected status


    // Fetch the non-deleted files associated with the system

    fetch(`/Review/GetNonDeletedFilesBySystem?systemId=${systemId}`)

        .then(response => response.json())

        .then(files => {

            // Fetch viewed files for the current staffNo

            return fetch(`/Review/GetViewedFiles?staffNo=${staffNo}`)

                .then(response => response.json())

                .then(viewedFiles => {

                    // Filter files based on the selected status

                    const filteredFiles = files.filter(file => {

                        const isRead = viewedFiles.some(viewedFile => viewedFile.uniqueFileIdentifier === file.uniqueFileIdentifier);

                        if (selectedStatus === 'all') {

                            return true; // Show all files

                        } else if (selectedStatus === 'read') {

                            return isRead; // Show only read files

                        } else if (selectedStatus === 'pending') {

                            return !isRead; // Show only pending files

                        }

                    });

                    // Populate the table with the filtered files and viewed files

                    populateFilesTableForStaffView(filteredFiles, viewedFiles);

                });

        })

        .catch(error => console.error('Error fetching files:', error));

}


function fetchFilesForStaffView(systemId) {
    const staffNo = document.querySelector('.staff-card-header .id').textContent.trim().substring(2); // Get the StaffNo
    const selectedStatus = document.getElementById('staffViewDropdown-status').value; // Get the selected status

    // Fetch the non-deleted files associated with the system
    fetch(`/Review/GetNonDeletedFilesBySystem?systemId=${systemId}`)
        .then(response => response.json())
        .then(files => {
            // Fetch viewed files for the current staffNo
            return fetch(`/Review/GetViewedFiles?staffNo=${staffNo}`)
                .then(response => response.json())
                .then(viewedFiles => {
                    // Filter files based on the selected status
                    const filteredFiles = files.filter(file => {
                        const isRead = viewedFiles.some(viewedFile => viewedFile.uniqueFileIdentifier === file.uniqueFileIdentifier);
                        if (selectedStatus === 'all') {
                            return true; // Show all files
                        } else if (selectedStatus === 'read') {
                            return isRead; // Show only read files
                        } else if (selectedStatus === 'pending') {
                            return !isRead; // Show only pending files
                        }
                    });
                    // Populate the table with the filtered files and viewed files
                    populateFilesTableForStaffView(filteredFiles, viewedFiles);
                });
        })
        .catch(error => console.error('Error fetching files:', error));
}

function populateFilesTableForStaffView(files, viewedFiles) {
    const tableBody = document.querySelector('.tableChanger tbody'); // Select the tbody within the tableChanger
    tableBody.innerHTML = ''; // Clear existing rows

    // Create a map for quick lookup of viewed dates by uniqueFileIdentifier
    const viewedDateMap = {};
    viewedFiles.forEach(viewedFile => {
        viewedDateMap[viewedFile.uniqueFileIdentifier] = viewedFile.viewedDate;
    });

    // Iterate over each file and create a row
    files.forEach(file => {
        const row = document.createElement('tr');
        const fileNameWithoutExtension = file.fileName.replace(/\.[^/.]+$/, "");
        const icon = file.fileType === 'Video'
            ? `<img src="/Content/Assets/system-video-icon.svg" alt="Video Icon" class="file-option-icon" />`
            : `<img src="/Content/Assets/system-file-icon.svg" alt="Document Icon" class="file-option-icon" />`;

        const viewedDate = viewedDateMap[file.uniqueFileIdentifier]
            ? formatDate(viewedDateMap[file.uniqueFileIdentifier])
            : '-';

        const statusText = viewedDate !== '-' ? 'Read' : 'Pending';
        const statusClass = viewedDate !== '-' ? 'status-read' : 'status-pending';

        row.innerHTML = `
            <td>${icon}${fileNameWithoutExtension}</td>
            <td>${file.fileCategory}</td>
            <td>${viewedDate}</td>
            <td class="${statusClass}">${statusText}</td>
        `;
        tableBody.appendChild(row);
    });

    const tableChanger = document.querySelector('.tableChanger');
    tableChanger.style.display = 'block'; // Show the tableChanger
}

function populateFilesTableForSystemView(files) {
    const tableBody = document.querySelector('#fileTableUnique tbody'); // Select the tbody within the table-container-unique
    tableBody.innerHTML = ''; // Clear existing rows

    // Iterate over each file and create a row
    files.forEach(file => {
        const row = document.createElement('tr');

        // Determine the icon based on the file type
        const icon = file.fileType === 'Video'
            ? `<img src="/Content/Assets/system-video-icon.svg" alt="Video Icon" class="file-option-icon" />`
            : `<img src="/Content/Assets/system-file-icon.svg" alt="Document Icon" class="file-option-icon" />`;

        // Remove the file extension from the fileName
        const fileNameWithoutExtension = file.fileName.replace(/\.[^/.]+$/, "");

        // Fetch the count of entries in the VIEWEDFILES table for this UniqueFileIdentifier
        fetch(`/Review/GetViewedFileCount?uniqueFileIdentifier=${file.uniqueFileIdentifier}`)
            .then(response => response.json())
            .then(data => {
                // Update the "Read by" column with the count
                const readByCount = data.count;

                // Populate the row with the file details
                row.innerHTML = `
                    <td>${icon}${fileNameWithoutExtension}</td>
                    <td>${file.fileCategory}</td>
                    <td class="read-by-unique">
                        <i class="fas fa-eye"></i>${readByCount} 
                        <span class="clickable-icon-unique" 
                              onclick="${readByCount > 0 ? `openReadModalUnique('${file.uniqueFileIdentifier}', '${fileNameWithoutExtension}')` : 'return false;'}">
                        </span>
                    </td>
                    
                `;

                //<td class="pending-by-unique">
                //    <i class="fas fa-hourglass-half"></i>233 <span class="clickable-icon-unique" onclick="openPendingModalUnique()"></span>
                //</td>
                tableBody.appendChild(row);
            })
            .catch(error => console.error('Error fetching viewed file count:', error));
    });

    // Make the system review table visible
    const systemReviewTable = document.getElementById('system-review-table');
    systemReviewTable.style.display = 'block';

    const systemReviewTable2 = document.getElementById('image-container-id');
    systemReviewTable2.style.display = 'none';
}


function fetchFilesForSystemView(systemId) {
    // Fetch the non-deleted files associated with the system
    fetch(`/Review/GetNonDeletedFilesBySystem?systemId=${systemId}`)
        .then(response => response.json())
        .then(files => {
            // Iterate over each file and log the details
            files.forEach(file => {
                console.log(`File Name: ${file.fileName}, Unique File Identifier: ${file.uniqueFileIdentifier}`);

                // Fetch the STAFFNO for this UNIQUEFILEIDENTIFIER
                fetch(`/Review/GetStaffNosByUniqueFileIdentifier?uniqueFileIdentifier=${file.uniqueFileIdentifier}`)
                    .then(response => response.json())
                    .then(staffNos => {
                        // Log each STAFFNO
                        staffNos.forEach(staffNo => {
                            console.log(`STAFFNO: ${staffNo}`);
                        });

                        // Log the total count of staff who read this file
                        console.log(`Total STAFFNO for ${file.fileName}: ${staffNos.length}`);
                    })
                    .catch(error => console.error('Error fetching staff numbers:', error));
            });

            // Populate the table with the fetched files
            populateFilesTableForSystemView(files);
        })
        .catch(error => console.error('Error fetching files:', error));
}

function filterFiles() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("SystemfileSearch");
    filter = input.value.toUpperCase(); // Convert input to uppercase for case-insensitive comparison
    table = document.getElementById("fileTableUnique");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) { // Start from 1 to skip the header row
        tr[i].style.display = "none"; // Initially hide all rows
        td = tr[i].getElementsByTagName("td");
        if (td.length > 0) {
            txtValue = td[0].textContent || td[0].innerText; // Get the text content of the first cell (File Name)
            // Check if the text value matches the input
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // Show the row if it matches
            }
        }
    }
}

function selectSystemForStaffView(system) {

    const headerElement = document.getElementById('system-header');

    const systemId = system.dataset.systemId; // Get the system ID


    // Fetch files for the selected system based on the current status

    fetchFilesForStaffView(systemId); // Fetch files for the selected system


    // Show the tableChanger

    const tableChanger = document.querySelector('.tableChanger');

    tableChanger.style.display = 'block'; // Show the tableChanger


    // Set the active class for the selected system

    const staffViewSidebar2 = document.querySelector('.staffViewSidebar2');

    staffViewSidebar2.querySelectorAll('.menu-item.active').forEach(item => {

        item.classList.remove('active'); // Remove active class from any previously selected item

    });

    system.classList.add('active'); // Add active class to the selected system

}

document.getElementById('staffViewDropdown-status').addEventListener('change', function () {

    const selectedStatus = this.value;

    const activeSystem = document.querySelector('.staffViewSidebar2 .menu-item.active');


    if (activeSystem) {

        const systemId = activeSystem.dataset.systemId; // Get the active system ID

        fetchFilesForStaffView(systemId); // Fetch files for the selected system based on the current status

    }

});

function goBack() {
    // Hide the current staff content layout
    document.getElementById('staffcontentLayout').style.display = 'none';

    // Show the staff view again
    document.getElementById('staffAfterSearch').style.display = 'none';
    document.getElementById('staff-view-reviewcontent').style.display = 'flex';

    // Clear the input field for Staff ID
    document.getElementById('staffViewSearchInput').value = ''; // Clear the input field

    // Reset the sidebar and other UI elements if necessary
    const staffViewSidebar2 = document.querySelector('.staffViewSidebar2');
    staffViewSidebar2.innerHTML = ''; // Clear the sidebar
    const pcImage = document.querySelector('.staff-view-image');
    if (pcImage) {
        pcImage.style.display = 'block'; // Show the PC image
    }
}