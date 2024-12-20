﻿function toggleCustomDropdown(event) {
    event.stopPropagation();
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
    var input = document.getElementById('custom-search-input');
    var filter = input.value.toUpperCase();
    var divs = document.querySelectorAll('.custom-dropdown-list div');

    divs.forEach(function (div) {
        var txtValue = div.textContent || div.innerText;
        div.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
    });
}

function selectCustomOption(element) {
    // Trim the selected option to remove any extra whitespace
    var selectedOption = (element.textContent || element.innerText).trim();

    document.getElementById('selected-option').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.custom-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    // Get the input element
    var departmentNameInput = document.getElementById('department-name');

    // Set the value and data attribute with trimmed value
    departmentNameInput.value = selectedOption;
    departmentNameInput.setAttribute('data-original-name', selectedOption);

    // Ensure text alignment
    departmentNameInput.style.textAlign = 'left';

    // Highlight the selected dropdown item
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => {
        div.classList.remove('active');
        div.style.backgroundColor = '';
        div.style.fontWeight = '';
    });
    element.classList.add('active');
    element.style.backgroundColor = "#BBDCF9";
    element.style.fontWeight = "bold";

    // Update systems name
    document.querySelector('.systems-name').innerText = selectedOption;

    // Show/hide containers
    document.querySelector('.image-container').style.display = 'none';
    document.querySelector('.system-container').style.display = 'block';

    // Call setDivisionName with trimmed value
    setDivisionName(selectedOption);
}

function showAllCustomOptions() {
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => div.style.display = "");
}

window.addEventListener('click', function (event) {

    var dropdownContent = document.querySelector('.custom-dropdown-content');
    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    var selector = document.querySelector('.custom-selector');

    if (!dropdownToggle.contains(event.target) && !dropdownContent.contains(event.target) && dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');
        selector.style.borderBottomLeftRadius = '10px';
        selector.style.borderBottomRightRadius = '10px';
        selector.style.borderBottom = '1px solid #6D6D6D';
    }
});

function depDeleteopenPopup() {
    if (!currentSelectedDivisionId) {
        alert('Please select a division to delete');
        return;
    }

    // Update the popup to show the current division name
    document.querySelector('#deletedepartment-popup h2').textContent = `Delete ${currentSelectedDivisionName} Division?`;

    document.getElementById('dark-overlay-dep2').style.display = 'block';
    document.getElementById('deletedepartment-popup').style.display = 'block';
}

function depDeleteClosePopup() {
    document.getElementById('dark-overlay-dep2').style.display = 'none';
    document.getElementById('deletedepartment-popup').style.display = 'none';
}


document.querySelector('.delete-dep-button').onclick = depDeleteopenPopup;

document.getElementById('close-icon-dep2').onclick = depDeleteClosePopup;
document.getElementById('dark-overlay-dep2').onclick = depDeleteClosePopup;




// DEPARTMENT ADD POPUP
function depAddopenPopup() {
    document.getElementById('dark-overlay-dep1').style.display = 'block';
    document.getElementById('adddepartment-popup').style.display = 'block';
}

function depAddClosePopup() {
    document.getElementById('dark-overlay-dep1').style.display = 'none';
    document.getElementById('adddepartment-popup').style.display = 'none';
}


document.querySelector('.add-dep-button').onclick = depAddopenPopup;

document.getElementById('close-icon-dep1').onclick = depAddClosePopup;
//document.getElementById('dark-overlay-dep1').onclick = depAddClosePopup;

function addNewDepartment() {
    // Get the input field value
    var divisionName = document.getElementById('new-department-name').value.trim();

    // Check if the input is not empty
    if (divisionName) {
        depAddClosePopup();

        var notificationPopup = document.getElementById('notification-popup2');
        var darkOverlay3 = document.getElementById('dark-overlay-dep3');

        if (darkOverlay3 && notificationPopup) {
            darkOverlay3.style.display = 'block';
            notificationPopup.style.display = 'block';
        } else {
            console.error("Notification popup or overlay not found.");
        }
    } else {
        // If input is empty, show the error message
        var errorSpan = document.getElementById('division-name-error');
        if (errorSpan) {
            errorSpan.style.display = 'block';
        }
    }
}

document.querySelector('.add-new-dep-popup-btn').onclick = addNewDepartment;


// Function to close the notification popup
function closeNotificationPopup() {
    document.getElementById('dark-overlay-dep3').style.display = 'none';
    document.getElementById('notification-popup2').style.display = 'none';
}

document.getElementById('close-icon-dep3').onclick = closeNotificationPopup;
document.getElementById('dark-overlay-dep3').onclick = closeNotificationPopup;


function highlightSystem(selectedItem) {
    const systemName = selectedItem.textContent.trim();
    currentSelectedDivisionName = systemName;

    // You'll need to modify this to also set the division ID
    // This might require adding a data attribute to your list items
    const divisionId = selectedItem.getAttribute('data-division-id');
    currentSelectedDivisionId = divisionId;

    const listItems = document.querySelectorAll("#systemList li");
    listItems.forEach(item => {
        item.style.backgroundColor = "";
        item.style.fontWeight = "";
        item.style.padding = "";
    });

    selectedItem.style.backgroundColor = "#BBDCF9";
    selectedItem.style.fontWeight = "bold";

    // Extract the division name from the selected item
    //const systemName = selectedItem.textContent.trim();

    // Set the system name in the header
    document.querySelector('.systems-name').innerText = systemName;

    // Prefill the input with the division name
    document.getElementById('department-name').value = systemName;

    // Set the original division name as a data attribute
    document.getElementById('department-name').setAttribute('data-original-name', systemName);
    document.querySelector('.image-container').style.display = 'none';
    document.querySelector('.system-container').style.display = 'block';

    // Call setDivisionName to handle any additional logic
    setDivisionName(systemName);
}
function setDivisionName(divisionName) {
    const departmentNameInput = document.getElementById('department-name');

    // Trim the division name
    const trimmedDivisionName = divisionName.trim();

    // Set value and data attribute with trimmed name
    departmentNameInput.value = trimmedDivisionName;
    departmentNameInput.setAttribute('data-original-name', trimmedDivisionName);

    // Set global original division name
    originalDivisionName = trimmedDivisionName;

    const saveChangesButton = document.querySelector('.div-edit');
    saveChangesButton.disabled = true;
    saveChangesButton.classList.add('disabled-button');
}

function filterSystems() {
    var searchInput = document.getElementById('systemSearch').value.toUpperCase();
    var listItems = document.querySelectorAll('#systemList li');
    listItems.forEach(function (item) {
        var txtValue = item.textContent || item.innerText;
        if (txtValue.toUpperCase().indexOf(searchInput) > -1) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}




















// Store the original division name
var originalDivisionName = '';

function setDivisionName(divisionName) {
    // Set the input value
    document.getElementById('department-name').value = divisionName;

    originalDivisionName = divisionName;

    const saveChangesButton = document.querySelector('.div-edit');
    saveChangesButton.disabled = true;
    saveChangesButton.classList.add('disabled-button');
}

document.getElementById('department-name').addEventListener('input', function () {
    const saveChangesButton = document.querySelector('.div-edit');
    const originalName = this.getAttribute('data-original-name');
    const currentDivisionName = this.value.trim();

    // Always enable the save button when the input changes
    if (currentDivisionName !== '') {
        saveChangesButton.disabled = false;
        saveChangesButton.classList.remove('disabled-button');
    } else {
        saveChangesButton.disabled = true;
        saveChangesButton.classList.add('disabled-button');
    }
});

function saveChanges() {
    const newDivisionName = document.getElementById('department-name').value.trim();

    if (newDivisionName === '' || newDivisionName === originalDivisionName) {
        return;
    }

    // AJAX call to update division name
    $.ajax({
        type: 'POST',
        url: '/Divisions/UpdateDivision',
        data: {
            originalName: originalDivisionName,
            newDivisionName: newDivisionName
        },
        success: function (response) {
            // Update the list item text in the system list
            const listItems = document.querySelectorAll('#systemList li');
            listItems.forEach(item => {
                if (item.textContent.trim() === originalDivisionName) {
                    item.textContent = newDivisionName;
                }
            });

            // Update the dropdown list
            const dropdownItems = document.querySelectorAll('.custom-dropdown-list div');
            dropdownItems.forEach(item => {
                if (item.textContent.trim() === originalDivisionName) {
                    item.textContent = newDivisionName;
                }
            });

            // Update the selected option span
            const selectedOptionSpan = document.getElementById('selected-option');
            if (selectedOptionSpan) {
                selectedOptionSpan.textContent = newDivisionName;
            }

            const systemsNameElement = document.querySelector('.systems-name');
            if (systemsNameElement) {
                systemsNameElement.textContent = newDivisionName;
            }

            originalDivisionName = newDivisionName;

            // Disable save button again
            const saveChangesButton = document.querySelector('.edit-system-button');
            saveChangesButton.disabled = true;
            saveChangesButton.classList.add('disabled-button');

            // Show division updated popup
            showDivisionUpdatedPopup();
        },
        error: function (xhr, status, error) {
            console.error('Error updating division:', error);
            alert('Failed to update division name');
        }
    });
}
function showDivisionUpdatedPopup() {
    const darkOverlay = document.getElementById('dark-overlay-dep9');
    const popup = document.getElementById('division-updated-popup');

    if (darkOverlay && popup) {
        darkOverlay.style.display = 'block';
        popup.style.display = 'block';

        // Setup listeners every time the popup is shown
        setupDivisionUpdatedPopupListeners();
    }
}

function closeDivisionUpdatedPopup() {
    console.log('Attempting to close popup');
    const darkOverlay = document.getElementById('dark-overlay-dep9');
    const popup = document.getElementById('division-updated-popup');
    const error = document.getElementById('division-name-error');

    if (darkOverlay && popup) {
        console.log('Closing popup and overlay');
        darkOverlay.style.display = 'none';
        popup.style.display = 'none';
        error.style.display = 'none';
    } else {
        console.error('Dark overlay or popup not found', { darkOverlay, popup });
    }
}

function setupDivisionUpdatedPopupListeners() {
    const closeIcon = document.getElementById('close-icon-dep9');
    const closeButton = document.getElementById('close-division-updated-btn9');
    const darkOverlay = document.getElementById('dark-overlay-dep9');

    if (closeIcon) {
        closeIcon.removeEventListener('click', closeDivisionUpdatedPopup);
        closeIcon.addEventListener('click', closeDivisionUpdatedPopup);
    }

    if (closeButton) {
        closeButton.removeEventListener('click', closeDivisionUpdatedPopup);
        closeButton.addEventListener('click', closeDivisionUpdatedPopup);
    }

    if (darkOverlay) {
        darkOverlay.removeEventListener('click', closeDivisionUpdatedPopup);
        darkOverlay.addEventListener('click', closeDivisionUpdatedPopup);
    }
}

document.querySelector('.reset-changes').addEventListener('click', function () {
    document.getElementById('department-name').value = originalDivisionName;

    // Disable save changes button
    const saveChangesButton = document.querySelector('.div-edit');
    saveChangesButton.disabled = true;
    saveChangesButton.classList.add('disabled-button');
});

// Attach the save changes function to the button
document.querySelector('.div-edit').addEventListener('click', saveChanges);
document.addEventListener('DOMContentLoaded', setupDivisionUpdatedPopupListeners);


var currentSelectedDivisionId = null;
var currentSelectedDivisionName = null;



function confirmDeleteDivision() {
    if (!currentSelectedDivisionId) {
        alert('Please select a division to delete');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/Divisions/SoftDeleteDivision',
        contentType: 'application/json',
        data: JSON.stringify({
            DivisionId: parseInt(currentSelectedDivisionId)
        }),
        success: function (response) {
            // Remove the division from the list
            const listItems = document.querySelectorAll('#systemList li');
            listItems.forEach(item => {
                if (item.textContent.trim() === currentSelectedDivisionName) {
                    item.remove();
                }
            });

            // Remove from custom dropdown
            const dropdownItems = document.querySelectorAll('.custom-dropdown-list div');
            dropdownItems.forEach(item => {
                if (item.textContent.trim() === currentSelectedDivisionName) {
                    item.remove();
                }
            });

            // Close the delete popup
            depDeleteClosePopup();

            // Optionally show a success message
            alert('Division deleted successfully');

            // Reset the selected division
            currentSelectedDivisionId = null;
            currentSelectedDivisionName = null;

            // Hide the system container and show the image container
            document.querySelector('.system-container').style.display = 'none';
            document.querySelector('.image-container').style.display = 'block';
        },
        error: function (xhr, status, error) {
            console.error('Error deleting division:', error);
            alert('Failed to delete division');
        }
    });
}

// Modify your existing delete button event listener
document.querySelector('.delete-btn').addEventListener('click', confirmDeleteDivision);
