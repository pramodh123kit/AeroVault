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
    const searchInput = document.getElementById('custom-search-input');
    const filter = searchInput.value.toUpperCase();
    const dropdownList = document.querySelector('.custom-dropdown-list');
    const items = dropdownList.querySelectorAll('div');

    items.forEach(item => {
        const txtValue = item.textContent || item.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}



function filterSystems() {
    const searchInput = document.getElementById('systemSearch');
    const filter = searchInput.value.toUpperCase();
    const systemList = document.getElementById('systemList');
    const listItems = systemList.querySelectorAll('li');

    listItems.forEach(li => {
        const txtValue = li.textContent || li.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    });
}

function selectCustomOption(element) {
    var selectedOption = element.textContent.trim() || element.innerText.trim();
    document.getElementById('selected-option').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.custom-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => div.classList.remove('active'));
    element.classList.add('active');

    // Find the corresponding li in the systemList
    const systemList = document.getElementById('systemList');
    const correspondingLi = Array.from(systemList.querySelectorAll('li')).find(li =>
        li.getAttribute('data-department-name').trim() === selectedOption
    );

    if (correspondingLi) {
        // Manually reset previous highlights
        const listItems = systemList.querySelectorAll('li');
        listItems.forEach(item => {
            item.style.backgroundColor = '';
            item.style.fontWeight = '';
        });

        // Manually call highlightSystem logic
        correspondingLi.style.backgroundColor = '#BBDCF9';
        correspondingLi.style.fontWeight = 'bold';

        // Get department details from data attributes
        const departmentName = correspondingLi.getAttribute('data-department-name');
        const departmentId = correspondingLi.getAttribute('data-department-id');
        const divisionId = correspondingLi.getAttribute('data-division-id');
        const divisionName = correspondingLi.getAttribute('data-division-name');

        // Update input and UI elements
        document.getElementById('department-name').value = departmentName;
        document.querySelector('.systems-name').innerText = departmentName;
        document.getElementById('selected-division').innerText = divisionName;

        // Update division selector
        const divisionSelector = document.querySelector('.division-selector');
        if (divisionSelector) {
            divisionSelector.setAttribute('data-division-id', divisionId);
            const divisionSelectorSpan = divisionSelector.querySelector('span');
            if (divisionSelectorSpan) {
                divisionSelectorSpan.innerText = divisionName;
            }
        }

        // Store original values
        originalDepartmentName = departmentName;
        originalDivisionName = divisionName;

        // Show/hide containers
        document.querySelector('.image-container').style.display = 'none';
        document.querySelector('.system-container').style.display = 'block';

        // Check for changes
        checkForChanges();
    } else {
        console.error('Corresponding department not found in system list');
    }

    // Update the systems name display
    document.querySelector('.systems-name').innerText = selectedOption;

    // Get the division name from the selected option
    const divisionName = element.getAttribute('data-division-name');

    // Update the selected division span with bold styling
    document.getElementById('selected-division').innerHTML = `${divisionName}`;
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
function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const divisionSelector = document.querySelector('.division-selector');

    if (dropdownContent.style.display === 'block') {
        closeDropdown();
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');
        divisionSelector.style.borderBottomLeftRadius = '0';
        divisionSelector.style.borderBottomRightRadius = '0';
        divisionSelector.style.borderBottom = 'none';
        document.getElementById('search-division').value = '';
        showAllDivisions();
    }
}

function closeDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const divisionSelector = document.querySelector('.division-selector');

    dropdownContent.style.display = 'none';
    dropdownToggle.classList.remove('open');
    divisionSelector.style.borderBottomLeftRadius = '10px';
    divisionSelector.style.borderBottomRightRadius = '10px';
    divisionSelector.style.borderBottom = '1px solid #6D6D6D';
}

function filterDivisions() {
    const input = document.getElementById('search-division');
    const filter = input.value.toUpperCase();
    const divs = document.querySelectorAll('.dropdown-list div');

    divs.forEach(div => {
        const txtValue = div.textContent || div.innerText;
        div.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
    });
}

function selectDivision(element) {

    const selectedDivision = element.textContent || element.innerText;

    const selectedDivisionId = element.getAttribute('data-division-id');



    // Update the selected division name in the UI

    document.getElementById('selected-division').innerHTML = selectedDivision;


    // Update the division ID in the division selector

    const divisionSelector = document.querySelector('.division-selector');

    divisionSelector.dataset.divisionId = selectedDivisionId;


    // Close the dropdown

    closeDropdown();


    // Check for changes

    checkForChanges();

}

function showAllDivisions() {
    var divs = document.querySelectorAll('.dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('search-division').addEventListener('blur', function () {
    const divisionSelector = document.querySelector('.division-selector');

    divisionSelector.style.borderBottomLeftRadius = '10px';
    divisionSelector.style.borderBottomRightRadius = '10px';

    divisionSelector.style.border = '1px solid #6D6D6D';
    divisionSelector.style.borderRadius = "10px";
});


document.addEventListener('click', function (event) {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    // Check if the click happened outside the dropdown
    if (!dropdownContent.contains(event.target) && !dropdownToggle.contains(event.target)) {
        closeDropdown();
    }
});




window.onclick = function (event) {
    const dropdownContent = document.querySelector('.dropdown-content');
    const selector = document.querySelector('.division-selector');

    if (!event.target.matches('.dropdown-toggle') && !event.target.matches('.dropdown-toggle *') && !event.target.matches('#search-division')) {

        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            document.getElementById('search- division').value = '';
            filterCustomOptions();
            document.querySelector('.dropdown-toggle').classList.remove('open');

            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }
};




function updateDeletePopupHeader() {

    // Find the currently selected department

    const selectedDepartment = document.querySelector('#systemList li[style*="background-color: rgb(187, 220, 249)"]');



    if (!selectedDepartment) {

        // If not found in system list, check custom dropdown

        const selectedCustomDepartment = document.querySelector('.custom-dropdown-list div.active');



        if (selectedCustomDepartment) {

            const departmentName = selectedCustomDepartment.getAttribute('data-department-name');

            document.querySelector('#deletedepartment-popup h2').textContent = `Delete ${departmentName} Department?`;

        } else {

            console.error('No department selected');

        }

        return;

    }



    // Get department name from the selected list item

    const departmentName = selectedDepartment.getAttribute('data-department-name');



    // Update the popup header

    document.querySelector('#deletedepartment-popup h2').textContent = `Delete ${departmentName} Department?`;

}








// DEPARTMENT DELETE POPUP
function depDeleteopenPopup() {

    updateDeletePopupHeader();
    document.getElementById('dark-overlay-dep2').style.display = 'block';
    document.getElementById('deletedepartment-popup').style.display = 'block';
}

function depDeleteClosePopup() {
    document.getElementById('dark-overlay-dep2').style.display = 'none';
    document.getElementById('deletedepartment-popup').style.display = 'none';
}

document.querySelector('.delete-dep-button').onclick = depDeleteopenPopup;
document.getElementById('close-icon-dep2').onclick = depDeleteClosePopup;
document.getElementById('cancel-dep-del').onclick = depDeleteClosePopup;




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





document.getElementById('close-icon-dep1').onclick = function () {
    resetAddDepartmentForm();
    depAddClosePopup();
};

//document.getElementById('dark-overlay-dep1').onclick = function () {
//    resetAddDepartmentForm();
//    depAddClosePopup();
//};

function resetAddDepartmentForm() {
    // Reset department name input
    document.getElementById('new-department-name').value = '';

    // Hide error messages
    document.getElementById('department-name-error').style.display = 'none';
    document.getElementById('division-error').style.display = 'none';

    // Reset division selection
    document.getElementById('unique-selected-option').textContent = 'Select a Division';

    // Remove active class from any previously selected division
    const divisionOptions = document.querySelectorAll('.unique-dropdown-list div');
    divisionOptions.forEach(div => {
        div.classList.remove('active');
    });

    // Disable the add department button
    document.getElementById('add-department-btn').disabled = true;

    // Remove any error styling from input
    const departmentNameInput = document.getElementById('new-department-name');
    departmentNameInput.classList.remove('error-input');
}


function addNewDepartment() {
    // Get department name and selected division
    const departmentName = document.getElementById('new-department-name').value.trim();
    const selectedDivision = document.getElementById('unique-selected-option').innerText;

    // Reset error messages
    const departmentNameError = document.getElementById('department-name-error');
    const divisionError = document.getElementById('division-error');

    departmentNameError.style.display = 'none';
    divisionError.style.display = 'none';

    let hasError = false;

    // Validate department name
    if (!departmentName) {
        departmentNameError.textContent = 'Please enter a department name';
        departmentNameError.style.display = 'block';
        hasError = true;
    }

    // Validate division selection
    if (selectedDivision === 'Select a Division') {
        divisionError.style.display = 'block';
        hasError = true;
    }

    // Check for existing department names (case-insensitive)
    const existingDepartments = Array.from(document.querySelectorAll('#systemList li'))
        .map(li => li.getAttribute('data-department-name').trim().toUpperCase());

    if (existingDepartments.includes(departmentName.toUpperCase())) {
        departmentNameError.textContent = 'Department name already in use';
        departmentNameError.style.display = 'block';
        hasError = true;
    }

    // If there are validation errors, stop the process
    if (hasError) {
        return;
    }

    // If validation passes, proceed with closing and showing notification
    depAddClosePopup();

    var notificationPopup = document.getElementById('notification-popup2');
    var darkOverlay3 = document.getElementById('dark-overlay-dep3');

    if (darkOverlay3 && notificationPopup) {
        darkOverlay3.style.display = 'block';
        notificationPopup.style.display = 'block';
    } else {
        console.error("Notification popup or overlay not found.");
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

function filterDivisionOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('division-search');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.division-dropdown-list div');
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

function selectDivisionOption(element) {
    var selectedDivision = element.textContent || element.innerText;
    document.getElementById('selected-division-option').textContent = selectedDivision;
    document.querySelector('.division-dropdown-content').style.display = 'none';
    document.querySelector('.division-dropdown-toggle').classList.remove('open');

    var divs = document.querySelectorAll('.division-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('selected');
    });
    element.classList.add('selected');
}

function toggleDivisionDropdown() {
    var dropdownContent = document.querySelector('.division-dropdown-content');
    var dropdownToggle = document.querySelector('.division-dropdown-toggle');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');
        document.getElementById('division-search').value = '';
        showAllDivisionOptions();
    }
}

function showAllDivisionOptions() {
    var divs = document.querySelectorAll('.division-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}
window.onclick = function (event) {
    const dropdownContent = document.querySelector('.division-dropdown-content');
    const dropdownToggle = document.querySelector('.division-dropdown-toggle');

    if (!event.target.matches('.division-dropdown-toggle') && !event.target.matches('.division-dropdown-toggle *') && !event.target.matches('#division-search')) {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            dropdownToggle.classList.remove('open');
        }
    }
};


function toggleSystemList() {
    const systemList = document.getElementById('systemList');
    const systemDropdown = document.getElementById('systemDropdown');

    if (window.innerWidth <= 768) {
        systemList.style.display = 'none';
        systemDropdown.style.display = 'block';

        const listItems = systemList.querySelectorAll('li');
        systemDropdown.innerHTML = '<option value="">Select a System</option>';
        listItems.forEach(item => {
            const systemName = item.textContent.trim();
            const option = document.createElement('option');
            option.value = systemName;
            option.textContent = systemName;
            systemDropdown.appendChild(option);
        });
    } else {
        systemList.style.display = 'block';
        systemDropdown.style.display = 'none';
    }
}

function selectSystem(dropdown) {
    const selectedValue = dropdown.value;
    const items = document.querySelectorAll('#systemList li');

    items.forEach(item => {
        if (item.textContent.trim() === selectedValue) {

            (item);
        }
    });
}

window.addEventListener('load', toggleSystemList);
window.addEventListener('resize', toggleSystemList);


var originalDepartmentName = '';
var originalDivisionName = '';

function highlightSystem(selectedItem) {
    // Determine if the selected item is a <li> or a <div>
    const isDiv = selectedItem.tagName.toLowerCase() === 'div';
    const systemList = document.getElementById('systemList');
    let correspondingLi;

    if (isDiv) {
        // If it's a div from the custom dropdown, find the corresponding <li>
        const departmentName = selectedItem.getAttribute('data-department-name');
        correspondingLi = Array.from(systemList.querySelectorAll('li')).find(
            li => li.getAttribute('data-department-name') === departmentName
        );

        if (!correspondingLi) {
            console.error('Corresponding list item not found');
            return;
        }
    } else {
        // If it's already a <li>, use it directly
        correspondingLi = selectedItem;
    }

    // Reset all list items
    const listItems = systemList.querySelectorAll('li');
    listItems.forEach(item => {
        item.style.backgroundColor = "";
        item.style.fontWeight = "";
        item.style.padding = "";
    });

    // Highlight the corresponding list item
    correspondingLi.style.backgroundColor = "#BBDCF9";
    correspondingLi.style.fontWeight = "bold";

    // Get department details from data attributes
    const departmentName = correspondingLi.getAttribute('data-department-name') || correspondingLi.innerText.trim();
    const departmentId = correspondingLi.getAttribute('data-department-id');
    const divisionId = correspondingLi.getAttribute('data-division-id');
    const divisionName = correspondingLi.getAttribute('data-division-name');

    // Ensure divisionName is not undefined
    const safeDivisionName = divisionName || 'Select Division';

    // Store original values
    originalDepartmentName = departmentName;
    originalDivisionName = safeDivisionName;

    // Update department name input
    document.getElementById('department-name').value = departmentName;

    // Update systems name
    document.querySelector('.systems-name').innerText = departmentName;

    // Update selected division span
    document.getElementById('selected-division').innerText = safeDivisionName;

    // Additional logic for setting department details
    if (departmentId && divisionId) {
        // Update the division selector with the current division details
        const divisionSelector = document.querySelector('.division-selector');
        if (divisionSelector) {
            divisionSelector.setAttribute('data-division-id', divisionId);

            // Find the corresponding division in the dropdown list
            const divisionDropdownItems = document.querySelectorAll('.dropdown-list div');
            const matchingDivision = Array.from(divisionDropdownItems).find(
                item => item.getAttribute('data-division-id') === divisionId
            );

            if (matchingDivision) {
                // Update the selected division text
                document.getElementById('selected-division').innerText = matchingDivision.textContent.trim();

                // Update originalDivisionName with the matched division name
                originalDivisionName = matchingDivision.textContent.trim();
            }
        }
    }

    // Ensure the division selector span is updated
    const divisionSelectorSpan = document.querySelector('.division-selector span');
    if (divisionSelectorSpan) {
        divisionSelectorSpan.innerText = safeDivisionName;
    }

    checkForChanges();
    document.querySelector('.image-container').style.display = 'none';
    document.querySelector('.system-container').style.display = 'block';
}


function setDepartmentName(departmentName, departmentId, divisionId, event) {
    // Set the department name in the input field
    document.getElementById('department-name').value = departmentName;

    // Set the selected division in the dropdown
    const selectedDivision = document.querySelector('.division-selector');
    selectedDivision.dataset.divisionId = divisionId; // Store the division ID

    // Use the event to get the division name if possible
    const divisionName = event ? event.currentTarget.dataset.divisionName : '';
    selectedDivision.querySelector('span').innerText = divisionName; // Set the division name

    // Highlight the selected department
    const departmentListItems = document.querySelectorAll('.department-li');
    departmentListItems.forEach(item => item.classList.remove('selected')); // Remove previous selection

    if (event) {
        event.currentTarget.classList.add('selected'); // Highlight the current selection
    }

    // Store the original values for reset functionality
    originalDepartmentName = departmentName;
    originalDivisionName = divisionName;
}

document.querySelector('.reset-changes').addEventListener('click', function () {
    document.getElementById('department-name').value = originalDepartmentName;
    document.getElementById('selected-division').innerText = originalDivisionName;
});




// Add this function to handle soft deletion
function softDeleteDepartment() {
    // Find the currently selected department
    const selectedDepartment = document.querySelector('#systemList li[style*="background-color: rgb(187, 220, 249)"]');

    if (!selectedDepartment) {
        alert("Please select a department to delete.");
        return;
    }

    // Get the department details
    const departmentId = selectedDepartment.getAttribute('data-department-id');
    const departmentName = selectedDepartment.getAttribute('data-department-name');

    // Send a request to the server to soft delete the department
    fetch('/Departments/SoftDeleteDepartment', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            departmentId: parseInt(departmentId)
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    console.error('Error response text:', errorText);
                    throw new Error(errorText);
                });
            }
            return response.json();
        })
        .then(data => {
            // Remove the department from both lists
            // Remove from system list
            selectedDepartment.remove();

            // Remove from custom dropdown list
            const customDropdownList = document.querySelector('.custom-dropdown-list');
            const customDropdownItem = customDropdownList.querySelector(`div[data-department-id="${departmentId}"]`);
            if (customDropdownItem) {
                customDropdownItem.remove();
            }

            // Reset the custom dropdown
            const selectedOptionSpan = document.getElementById('selected-option');
            if (selectedOptionSpan) {
                selectedOptionSpan.textContent = 'Select a department';
                selectedOptionSpan.style.color = '#6D6D6D'; // Optional: change color to indicate unselected state
            }

            // Close the delete confirmation popup
            depDeleteClosePopup();

            // Reset the system container and show image container
            document.querySelector('.system-container').style.display = 'none';
            document.querySelector('.image-container').style.display = 'block';

            // Remove active state from any active custom dropdown items
            const customDropdownItems = document.querySelectorAll('.custom-dropdown-list div');
            customDropdownItems.forEach(item => item.classList.remove('active'));

            // Show department deleted success popup
            showDepartmentDeletedSuccessPopup(departmentName);
        })
        .catch(error => {
            console.error('Full Error:', error);

            // Try to parse the error message if it's a JSON
            try {
                const errorObj = JSON.parse(error.message);
                showErrorPopup(`Error deleting department: ${errorObj.message || errorObj.details || 'Unknown error'}`);
            } catch {
                // If parsing fails, show the original error message
                showErrorPopup(`Error deleting department: ${error.message}`);
            }
        });
}

// New function to show department deleted success popup
function showDepartmentDeletedSuccessPopup(departmentName) {
    // First, close any existing popups
    depDeleteClosePopup();

    // Show the dark overlay
    const darkOverlay = document.getElementById('dark-overlay-dep2');
    if (darkOverlay) {
        darkOverlay.style.display = 'block';
    }

    // Create the success popup
    const successPopup = document.createElement('div');
    successPopup.className = 'modal-delete-system department-deleted-success-popup del-dep-pop';
    successPopup.innerHTML = `
        <div class="modal-header-delete-system" style="display: flex; align-items: center; justify-content: center; width:auto;">
            <h2 style="margin: 0; text-align: center;">Department Deleted</h2>
        </div>
        <div style="text-align: center; padding: 20px;">
            <img src="Content/Assets/system-added-successfully.svg" alt="Success" style="max-width: 100px; margin-bottom: 15px;">
            <p>Department "${departmentName}" has been successfully deleted.</p>
        </div>
        <div class="modal-footer div-dep-delete-popup" style="padding: 20px; margin-bottom:0px; justify-content: center; padding-top:0px;">
            <button class="delete-btn department-deleted-ok-btn" style="background-color:#00436C;">OK</button>
        </div>
    `;

    // Add to body
    document.body.appendChild(successPopup);

    // Add event listener to OK button
    const okButton = successPopup.querySelector('.department-deleted-ok-btn');
    okButton.addEventListener('click', () => {
        // Remove the popup
        successPopup.remove();

        // Hide the dark overlay
        if (darkOverlay) {
            darkOverlay.style.display = 'none';
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

// Optional: Error popup function
function showErrorPopup(message) {
    // Similar structure to success popup, but with error styling
    const errorPopup = document.createElement('div');
    errorPopup.className = 'modal-delete-system department-delete-error-popup';
    errorPopup.innerHTML = `
        <div class="modal-header-delete-system" style="display: flex; align-items: center; justify-content: center;">
            <h2 style="margin: 0; text-align: center; color: red;">Error</h2>
        </div>
        <div style="text-align: center; padding: 20px;">
            <p>${message}</p>
        </div>
        <div class="modal-footer div-dep-delete-popup" style="padding: 20px; justify-content: center;">
            <button class="delete-btn department-error-ok-btn">OK</button>
        </div>
    `;

    // Similar logic to success popup for displaying and closing
    document.body.appendChild(errorPopup);

    const okButton = errorPopup.querySelector('.department-error-ok-btn');
    okButton.addEventListener('click', () => {
        errorPopup.remove();
        const darkOverlay = document.getElementById('dark-overlay-dep2');
        if (darkOverlay) {
            darkOverlay.style.display = 'none';
        }
    });
}

// Modify the existing delete button click event
document.querySelector('.delete-btn').onclick = function () {
    softDeleteDepartment();
};

// In your existing event setup
document.querySelector('.delete-dep-button').onclick = function () {
    updateDeletePopupHeader();  // Add this line
    depDeleteopenPopup();
};

// If you have a custom dropdown, you might want to add a similar update
document.querySelector('.custom-dropdown-list').addEventListener('click', function (event) {
    // Check if a department is selected in the custom dropdown
    const selectedItem = event.target.closest('div[data-department-name]');
    if (selectedItem) {
        updateDeletePopupHeader();
    }
});




function checkForChanges() {
    const departmentNameInput = document.getElementById('department-name');
    const selectedDivision = document.querySelector('.division-selector');
    const saveChangesButton = document.querySelector('.edit-system-button');

    const originalName = originalDepartmentName;
    const originalDivision = originalDivisionName;

    // Get current values
    const currentName = departmentNameInput.value.trim();
    const currentDivision = selectedDivision.querySelector('span').innerText.trim();

    // Check if there are any changes
    const hasChanges = currentName !== originalName || currentDivision !== originalDivision;

    if (hasChanges) {
        // Enable the button
        saveChangesButton.style.backgroundColor = '#00436C';
        saveChangesButton.style.cursor = 'pointer';
        saveChangesButton.disabled = false;
    } else {
        // Disable the button
        saveChangesButton.style.backgroundColor = '#6c757d';
        saveChangesButton.style.cursor = 'not-allowed';
        saveChangesButton.disabled = true;
    }
}
document.getElementById('department-name').addEventListener('input', checkForChanges);

// Add event listener to division selector
document.querySelector('.division-selector').addEventListener('click', function () {
    // Use a small delay to ensure the division is updated
    setTimeout(checkForChanges, 100);
});

function saveChanges() {
    const saveChangesButton = document.querySelector('.edit-system-button');

    // Check if the button is disabled
    if (saveChangesButton.disabled) {
        return;
    }

    const selectedDepartment = document.querySelector('#systemList li[style*="background-color: rgb(187, 220, 249)"]');

    if (!selectedDepartment) {
        alert("Please select a department first.");
        return;
    }

    const departmentId = selectedDepartment.getAttribute('data-department-id');
    const departmentName = document.getElementById('department-name').value.trim();
    const divisionId = document.querySelector('.division-selector').getAttribute('data-division-id');

    // Get the selected division name
    const selectedDivisionName = document.getElementById('selected-division').innerText.trim();

    // Validate input fields
    if (!departmentId) {
        alert("Department ID is missing.");
        return;
    }

    if (!departmentName) {
        alert("Department name cannot be empty.");
        return;
    }

    if (!divisionId) {
        alert("Please select a division.");
        return;
    }

    fetch('/Departments/UpdateDepartment', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'  // Explicitly ask for JSON response
        },
        body: JSON.stringify({
            departmentId: parseInt(departmentId),
            departmentName: departmentName,
            divisionId: parseInt(divisionId)
        })
    })
        .then(response => {
            // Check if the response is OK
            if (!response.ok) {
                // Try to parse error response as JSON
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'An error occurred');
                });
            }
            // If response is OK, parse it as JSON
            return response.json();
        })
        .then(data => {
            // Update the data attributes of the selected department
            selectedDepartment.setAttribute('data-department-name', departmentName);
            selectedDepartment.setAttribute('data-division-id', divisionId);
            selectedDepartment.setAttribute('data-division-name', selectedDivisionName);

            // Update the text of the department
            selectedDepartment.textContent = departmentName;

            // Update the custom dropdown list
            const customDropdownList = document.querySelector('.custom-dropdown-list');
            const customDropdownItems = customDropdownList.querySelectorAll('div');

            customDropdownItems.forEach(item => {
                if (item.getAttribute('data-department-id') === departmentId.toString()) {
                    // Update the department name in the custom dropdown
                    item.textContent = departmentName;
                    item.setAttribute('data-department-name', departmentName);
                    item.setAttribute('data-division-id', divisionId);
                    item.setAttribute('data-division-name', selectedDivisionName);
                }
            });

            // Clear the custom search input
            const customSearchInput = document.getElementById('custom-search-input');
            if (customSearchInput) {
                customSearchInput.value = '';
                filterCustomOptions();
            }
            const selectedOptionSpan = document.getElementById('selected-option');

            if (selectedOptionSpan) {
                selectedOptionSpan.textContent = departmentName;
                selectedOptionSpan.style.color = '#333333';
            }

            // Update the systems name h2 element
            const systemsNameElement = document.querySelector('.systems-name');
            if (systemsNameElement) {
                systemsNameElement.textContent = departmentName;
            }

            // Update original values for reset functionality
            originalDepartmentName = departmentName;
            originalDivisionName = selectedDivisionName;

            // Disable the save changes button after successful update
            checkForChanges();

            // Call the success popup instead of alert
            showSuccessPopup();
        })
        .catch(error => {
            console.error('Error:', error);
            // Show a more user-friendly error message
            alert("Error: " + error.message);
        });
}

function updateDepartmentLists(newDepartmentName, departmentId, divisionId) {
    // Update the main system list
    const mainSystemList = document.getElementById('systemList');
    const mainListItem = mainSystemList.querySelector(`li[data-department-id="${departmentId}"]`);

    if (mainListItem) {
        // Update the text content directly
        mainListItem.textContent = newDepartmentName;

        // Update data attributes
        mainListItem.setAttribute('data-department-name', newDepartmentName);
        mainListItem.setAttribute('data-division-id', divisionId);
    }

    // Update the custom dropdown list
    const customDropdownList = document.querySelector('.custom-dropdown-list');
    const customDropdownItems = customDropdownList.querySelectorAll('div');

    customDropdownItems.forEach(item => {
        if (item.getAttribute('data-division-id') === departmentId.toString()) {
            // Update the department name in the custom dropdown
            item.textContent = newDepartmentName;
            item.setAttribute('data-division-id', divisionId);
        }
    });
}



document.querySelector('.reset-changes').addEventListener('click', function () {
    // Reset department name input to original value
    document.getElementById('department-name').value = originalDepartmentName;

    // Reset division name
    document.getElementById('selected-division').innerText = originalDivisionName;

    // Update division selector span if it exists
    const divisionSelectorSpan = document.querySelector('.division-selector span');
    if (divisionSelectorSpan) {
        divisionSelectorSpan.innerText = originalDivisionName;
    }

    // Disable the Save Changes button
    const saveChangesButton = document.querySelector('.edit-system-button');
    saveChangesButton.style.backgroundColor = '#6c757d';  // Disabled gray color
    saveChangesButton.style.cursor = 'not-allowed';
    saveChangesButton.disabled = true;
});

function showSuccessPopup() {
    const overlay = document.getElementById('overlay-edit-dep');
    const popup = document.getElementById('successPopup');

    // Show overlay and popup
    overlay.classList.add('show');
}

function closeSuccessPopup() {
    const overlay = document.getElementById('overlay-edit-dep');
    overlay.classList.remove('show');
}

// Optional: Add a click event to close the popup if needed
document.getElementById('overlay-edit-dep').addEventListener('click', function (event) {
    // Only close if clicking directly on the overlay (not the popup)
    if (event.target === this) {
        closeSuccessPopup();
    }
});


document.getElementById('overlay-edit-dep').addEventListener('click', function (event) {
    // Only close if clicking directly on the overlay (not the popup)
    if (event.target === this) {
        this.classList.remove('show');
    }
});