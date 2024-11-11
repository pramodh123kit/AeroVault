function filterSystems() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('systemSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("systemList");
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function highlightSystem(selectedItem) {
    // Remove background and bold from all list items
    const listItems = document.querySelectorAll("#systemList li");
    listItems.forEach(item => {
        item.style.backgroundColor = ""; // Reset background color
        item.style.fontWeight = ""; // Reset font weight
        item.style.padding = ""; // Reset padding
    });

    // Apply background, padding, and bold text to selected item
    selectedItem.style.backgroundColor = "#BBDCF9";
    selectedItem.style.fontWeight = "bold";
    

    // Get the name of the selected system
    const systemName = selectedItem.innerText.trim();

    // Update the system name in the system-container
    document.querySelector('.systems-name').innerText = systemName;
    document.querySelector('.system-edit-name').value = systemName;

    // Update the modal title in the delete confirmation popup
    const deleteModalTitle = document.querySelector('#deletesystem-popup h2');
    deleteModalTitle.innerText = `Delete ${systemName} System?`;

    // Hide the image container and show the system container
    document.querySelector('.image-container').style.display = 'none'; // Hide the image container
    document.querySelector('.system-container').style.display = 'block'; // Show the system container
}




function filterFiles() {
    const input = document.getElementById('SystemfileSearch'); // Update the ID here
    const filter = input.value.toLowerCase(); // Convert input to lowercase
    const table = document.querySelector('.file-table tbody');
    const rows = table.getElementsByTagName('tr'); // Get all rows

    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName('td')[0]; // Get the first cell (file name)
        if (td) {
            const txtValue = td.textContent || td.innerText; // Get the text of the cell
            // Check if the text matches the search input
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = ""; // Show the row
            } else {
                rows[i].style.display = "none"; // Hide the row
            }
        }
    }
}



// SYSTEM ADD POPUP
function openPopup() {
    document.getElementById('dark-overlay').style.display = 'block';
    document.getElementById('addsystem-popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('dark-overlay').style.display = 'none'; 
    document.getElementById('addsystem-popup').style.display = 'none';
}

document.querySelector('.add-system-button').onclick = openPopup;

document.getElementById('close-icon').onclick = closePopup;
document.getElementById('dark-overlay').onclick = closePopup;





// SYSTEM EDIT POPUP
function systemEditopenPopup() {
    document.getElementById('dark-overlay1').style.display = 'block'; 
    document.getElementById('editsystem-popup').style.display = 'block'; 
}

function systemEditClosePopup() {
    document.getElementById('dark-overlay1').style.display = 'none'; 
    document.getElementById('editsystem-popup').style.display = 'none'; 
}

document.querySelector('.edit-system-button').onclick = systemEditopenPopup;

document.getElementById('close-icon1').onclick = systemEditClosePopup;
document.getElementById('dark-overlay1').onclick = systemEditClosePopup;











// SYSTEM DELETE POPUP
function systemDeleteopenPopup() {
    document.getElementById('dark-overlay2').style.display = 'block'; 
    document.getElementById('deletesystem-popup').style.display = 'block'; 
}

function systemDeleteClosePopup() {
    document.getElementById('dark-overlay2').style.display = 'none'; 
    document.getElementById('deletesystem-popup').style.display = 'none'; 
}


document.querySelector('.delete-system-button').onclick = systemDeleteopenPopup;

document.getElementById('close-icon2').onclick = systemDeleteClosePopup;
document.getElementById('dark-overlay2').onclick = systemDeleteClosePopup;






// FILE DELETE POPUP
function fileDeleteopenPopup() {
    document.getElementById('dark-overlay4').style.display = 'block'; 
    document.getElementById('deletefile-popup').style.display = 'block'; 
}

function fileDeleteClosePopup() {
    document.getElementById('dark-overlay4').style.display = 'none'; 
    document.getElementById('deletefile-popup').style.display = 'none'; 
}


document.querySelectorAll(".file-delete-icon").forEach(function (icon) {
    icon.onclick = fileDeleteopenPopup; 
});

document.getElementById('close-icon4').onclick = fileDeleteClosePopup;
document.getElementById('dark-overlay4').onclick = fileDeleteClosePopup;






// FILE EDIT POPUP
function fileEditopenPopup() {
    document.getElementById('dark-overlay5').style.display = 'block';
    document.getElementById('editfile-popup').style.display = 'block';
}

function fileEditClosePopup() {
    document.getElementById('dark-overlay5').style.display = 'none';
    document.getElementById('editfile-popup').style.display = 'none';
}



document.querySelectorAll(".file-edit-icon").forEach(function (icon) {
    icon.onclick = fileEditopenPopup;
});

document.getElementById('close-icon5').onclick = fileEditClosePopup;
document.getElementById('dark-overlay5').onclick = fileEditClosePopup;








// SYSTEM ADDED NOTIFICATION POPUP
//function notificationOpenPopup() {
//    document.getElementById('dark-overlay3').style.display = 'block';
//    document.getElementById('notification-popup').style.display = 'block';
//}

//function notificationClosePopup() {
//    document.getElementById('dark-overlay3').style.display = 'none';
//    document.getElementById('notification-popup').style.display = 'none';
//}


//document.querySelector('.save-btn').onclick = notificationOpenPopup;

//document.getElementById('close-icon3').onclick = notificationClosePopup;
//document.getElementById('dark-overlay3').onclick = notificationClosePopup;

































document.querySelectorAll('.division-header').forEach(header => {
    header.addEventListener('click', () => {
        const activeHeader = document.querySelector('.division-header.active');
        if (activeHeader && activeHeader !== header) {
            activeHeader.classList.remove('active');
            activeHeader.nextElementSibling.classList.remove('active');
            activeHeader.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-right');
        }
        header.classList.toggle('active');
        header.nextElementSibling.classList.toggle('active');
        const icon = header.querySelector('i');
        if (header.classList.contains('active')) {
            icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
        } else {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
        }
    });
});

document.querySelectorAll('.select-all').forEach(selectAllCheckbox => {
    selectAllCheckbox.addEventListener('change', (event) => {
        const checkboxGroup = event.target.closest('.division-content').querySelectorAll('.department');
        checkboxGroup.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateSelectedCount(event.target.closest('.division'));
    });
});

document.querySelectorAll('.department').forEach(departmentCheckbox => {
    departmentCheckbox.addEventListener('change', (event) => {
        updateSelectedCount(event.target.closest('.division'));
    });
});

function updateSelectedCount(division) {
    const selectedCountElement = division.querySelector('.selected-count');
    const departmentCheckboxes = division.querySelectorAll('.department');
    const selectedCount = Array.from(departmentCheckboxes).filter(checkbox => checkbox.checked).length;
    selectedCountElement.textContent = selectedCount;

    selectedCountElement.textContent = selectedCount > 0 ? selectedCount : '';

    if (selectedCount > 0) {
        division.querySelector('.division-header').classList.add('selected');
    } else {
        division.querySelector('.division-header').classList.remove('selected');
    }
}

// Initialize selected counts
document.querySelectorAll('.division').forEach(division => {
    updateSelectedCount(division);
});



function filterDepartmentsDivisions() {
    const input = document.getElementById('DepartmentsDivisionsSearch').value.toLowerCase();
    const divisions = document.querySelectorAll('.division');

    divisions.forEach(division => {
        const divisionName = division.querySelector('.division-header span').textContent.toLowerCase();
        const departmentLabels = division.querySelectorAll('.department');
        let hasVisibleDepartment = false;

        // Check if the division name matches the search input
        if (divisionName.includes(input)) {
            division.style.display = ''; // Show the division
        } else {
            // Check if any department matches the search input
            departmentLabels.forEach(label => {
                const departmentName = label.textContent.toLowerCase();
                if (departmentName.includes(input)) {
                    hasVisibleDepartment = true; // At least one department matches
                }
            });
            // Show or hide the division based on department visibility
            division.style.display = hasVisibleDepartment ? '' : 'none';
        }
    });
}


function filterDepartmentsDivisions1() {
    const input = document.getElementById('DepartmentsDivisionsSearch1').value.toLowerCase();
    const divisions = document.querySelectorAll('.division');

    divisions.forEach(division => {
        const divisionName = division.querySelector('.division-header span').textContent.toLowerCase();
        const departmentLabels = division.querySelectorAll('.department');
        let hasVisibleDepartment = false;

        // Check if the division name matches the search input
        if (divisionName.includes(input)) {
            division.style.display = ''; // Show the division
        } else {
            // Check if any department matches the search input
            departmentLabels.forEach(label => {
                const departmentName = label.textContent.toLowerCase();
                if (departmentName.includes(input)) {
                    hasVisibleDepartment = true; // At least one department matches
                }
            });
            // Show or hide the division based on department visibility
            division.style.display = hasVisibleDepartment ? '' : 'none';
        }
    });
}


// Function to handle the Add New System button click
function addNewSystem() {
    // Close the add system popup
    closePopup(); // This will close the add system popup

    // Check if the notification popup and overlay exist before trying to access them
    var notificationPopup = document.getElementById('notification-popup');
    var darkOverlay3 = document.getElementById('dark-overlay3');

    if (darkOverlay3 && notificationPopup) {
        darkOverlay3.style.display = 'block'; // Show the overlay for notification
        notificationPopup.style.display = 'block'; // Show the notification popup
    } else {
        console.error("Notification popup or overlay not found.");
    }
}

// Attach the addNewSystem function to the save button
document.querySelector('.save-btn').onclick = addNewSystem;


// Function to close the notification popup
function closeNotificationPopup() {
    document.getElementById('dark-overlay3').style.display = 'none'; // Hide the overlay
    document.getElementById('notification-popup').style.display = 'none'; // Hide the notification popup
}

// Attach the closeNotificationPopup function to the close icon and overlay
document.getElementById('close-icon3').onclick = closeNotificationPopup;
document.getElementById('dark-overlay3').onclick = closeNotificationPopup;







function filterDivisionOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('division-search'); // Change to your search input ID
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.division-dropdown-list div'); // Change to your dropdown list selector
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = ""; // Show the division option
        } else {
            div[i].style.display = "none"; // Hide the division option
        }
    }
}

function selectDivisionOption(element) {
    var selectedDivision = element.textContent || element.innerText;
    document.getElementById('selected-division-option').textContent = selectedDivision; // Update selected division text
    document.querySelector('.division-dropdown-content').style.display = 'none'; // Hide dropdown
    document.querySelector('.division-dropdown-toggle').classList.remove('open'); // Remove open class

    // Optionally reset styles for selected items
    var divs = document.querySelectorAll('.division-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('selected');
    });
    element.classList.add('selected'); // Highlight the selected division
}

function toggleDivisionDropdown() {
    var dropdownContent = document.querySelector('.division-dropdown-content');
    var dropdownToggle = document.querySelector('.division-dropdown-toggle');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none'; // Hide the dropdown
        dropdownToggle.classList.remove('open'); // Remove open class
    } else {
        dropdownContent.style.display = 'block'; // Show the dropdown
        dropdownToggle.classList.add('open'); // Add open class
        document.getElementById('division-search').value = ''; // Clear the search input
        showAllDivisionOptions(); // Show all division options
    }
}

function showAllDivisionOptions() {
    var divs = document.querySelectorAll('.division-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = ""; // Show all division options
    });
}

// Close dropdown when clicking outside
window.onclick = function (event) {
    const dropdownContent = document.querySelector('.division-dropdown-content');
    const dropdownToggle = document.querySelector('.division-dropdown-toggle');

    if (!event.target.matches('.division-dropdown-toggle') && !event.target.matches('.division-dropdown-toggle *') && !event.target.matches('#division-search')) {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none'; // Hide dropdown
            dropdownToggle.classList.remove('open'); // Remove open class
        }
    }
};