var currentSelectedDivisionName = null; 
function toggleCustomDropdown(event) {
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
    var divisionId = element.getAttribute('data-division-id'); 

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

    // Update the current selected division ID
    currentSelectedDivisionId = divisionId; 
    currentSelectedDivisionName = selectedOption; 

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

    // Update the delete popup header
    updateDeletePopupHeader();

    // Fetch departments for the selected division
    fetch(`/Divisions/GetDepartmentsByDivision?divisionId=${currentSelectedDivisionId}`)
        .then(response => response.json())
        .then(departments => {
            const fileList = document.querySelector('.file-list');
            fileList.innerHTML = '';

            if (departments.length === 0) {
                fileList.innerHTML = '<div>No departments available.</div>';
            } else {
                departments.forEach(department => {
                    const fileItem = document.createElement('div');
                    fileItem.className = 'file-item';
                    fileItem.textContent = department.departmentName;
                    fileList.appendChild(fileItem);
                });
            }

            // Show the delete popup
            document.getElementById('dark-overlay-dep2').style.display = 'block';
            document.getElementById('deletedepartment-popup').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching departments:', error);
            alert('Failed to fetch departments for the selected division.');
        });
}

function depDeleteClosePopup() {
    document.getElementById('dark-overlay-dep2').style.display = 'none';
    document.getElementById('deletedepartment-popup').style.display = 'none';
    
}


document.querySelector('.delete-dep-button').onclick = depDeleteopenPopup;

document.getElementById('close-icon-dep2').onclick = depDeleteClosePopup;
//document.getElementById('dark-overlay-dep2').onclick = depDeleteClosePopup;
document.getElementById('cancel-btn').onclick = depDeleteClosePopup;




// DEPARTMENT ADD POPUP
function depAddopenPopup() {
    document.getElementById('dark-overlay-dep1').style.display = 'block';
    document.getElementById('adddepartment-popup').style.display = 'block';
}

function depAddClosePopup() {
    document.getElementById('dark-overlay-dep1').style.display = 'none';
    document.getElementById('dark-overlay-dep3').style.display = 'none';
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

// Add event listeners
document.getElementById('close-icon-dep3').addEventListener('click', closeNotificationPopup);
//document.getElementById('close-division-added-btn').addEventListener('click', closeNotificationPopup);
document.getElementById('dark-overlay-dep3').addEventListener('click', closeNotificationPopup);


function highlightSystem(selectedItem) {
    const systemName = selectedItem.textContent.trim();
    currentSelectedDivisionName = systemName; // Store the selected division name

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



function showDivisionDeletedSuccessPopup(divisionName) {
    // First, close any existing popups
    depDeleteClosePopup();

    // Show the dark overlay
    const darkOverlay = document.getElementById('dark-overlay-div2');
    if (darkOverlay) {
        darkOverlay.style.display = 'block';
    }

    // Create the success popup
    const successPopup = document.createElement('div');
    successPopup.className = 'modal-delete-system division-deleted-success-popup del-div-pop';
    successPopup.innerHTML = `
        <div class="modal-header-delete-system" style="display: flex; align-items: center; justify-content: center; width:auto;">
            <h2 style="margin: 0; text-align: center;">Division Deleted</h2>
        </div>
        <div style="text-align: center; padding: 20px;">
            <img src="Content/Assets/system-added-successfully.svg" alt="Success" style="max-width: 100px; margin-bottom: 15px;">
            <p>Division "${divisionName}" and its associated departments have been successfully deleted.</p>
        </div>
        <div class="modal-footer div-div-delete-popup" style="padding: 20px; margin-bottom:0px; justify-content: center; padding-top:0px;">
            <button class="delete-btn division-deleted-ok-btn" style="background-color:#00436C;">OK</button>
        </div>
    `;

    // Add to body
    document.body.appendChild(successPopup);

    // Add event listener to OK button
    const okButton = successPopup.querySelector('.division-deleted-ok-btn');
    okButton.addEventListener('click', () => {
        // Remove the popup
        successPopup.remove();

        // Hide the dark overlay
        if (darkOverlay) {
            darkOverlay.style.display = 'none';
        }

        // Hide the system container
        const systemContainer = document.querySelector('.system-container');
        if (systemContainer) {
            systemContainer.style.display = 'none'; // Hide the system container
        }

        // Show the image container
        const imageContainer = document.querySelector('.image-container');
        if (imageContainer) {
            imageContainer.style.display = 'block'; // Show the image container
        }
    });

    // Optional: Close popup if clicking outside
    darkOverlay.addEventListener('click', (event) => {
        if (event.target === darkOverlay) {
            successPopup.remove();
            darkOverlay.style.display = 'none';
        }
    });
}

// Modify the confirmDeleteDivision function to use the new popup
function confirmDeleteDivision() {
    if (!currentSelectedDivisionId) {
        alert('Please select a division to delete');
        return;
    }

    // Clear the input field for department name before the deletion process
    const departmentNameInput = document.getElementById('department-name');
    if (departmentNameInput) {
        departmentNameInput.value = ''; // Clear the input field
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

            // Show the new success popup
            showDivisionDeletedSuccessPopup(currentSelectedDivisionName);

            // Reset the selected division
            currentSelectedDivisionId = null;
            currentSelectedDivisionName = null;

            // Hide the system container
            const systemContainer = document.querySelector('.system-container');
            if (systemContainer) {
                systemContainer.style.display = 'none'; // Hide the system container
            }

            // Show the image container
            const imageContainer = document.querySelector('.image-container');
            if (imageContainer) {
                imageContainer.style.display = 'block'; // Show the image container
            }

            const selectedOptionSpan = document.getElementById('selected-option');
            selectedOptionSpan.textContent = "Select a division";
        },
        error: function (xhr, status, error) {
            console.error('Error deleting division:', error);
            alert('Failed to delete division');
        }
    });
}

function updateDeletePopupHeader() {
    // Update the popup header to include the selected division name
    document.querySelector('#deletedepartment-popup h2').textContent = `Delete ${currentSelectedDivisionName} Division?`;
}

// Modify your existing delete button event listener
document.querySelector('.delete-btn').addEventListener('click', confirmDeleteDivision);