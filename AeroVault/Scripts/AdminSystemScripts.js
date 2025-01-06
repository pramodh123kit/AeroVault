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

async function highlightSystem(selectedItem) {

    const systemName = selectedItem.querySelector('a').textContent.trim();

    selectedSystemName = systemName;
    selectedSystemId = selectedItem.getAttribute('data-system-id'); // Ensure you have this attribute in your HTML

    try {

        // Fetch system departments

        const response = await fetch(`/Systems/GetSystemDepartments?systemName=${encodeURIComponent(systemName)}`);

        const departmentIds = await response.json();


        // Pre-select departments and set up listeners

        preDepartmentSelection(departmentIds);

    } catch (error) {

        console.error('Error fetching system departments:', error);

    }


    const listItems = document.querySelectorAll("#systemList li");

    listItems.forEach(item => {

        item.style.backgroundColor = "";

        item.style.fontWeight = "";

        item.style.padding = "";

    });


    selectedItem.style.backgroundColor = "#BBDCF9";

    selectedItem.style.fontWeight = "bold";


    // Capture system details from data attributes

    const systemDescription = selectedItem.getAttribute('data-system-description') || '';


    const descriptionElements = [

        document.getElementById('edit-description'),

        document.querySelector('#editsystem-popup textarea[id="edit-description"]')

    ];


    descriptionElements.forEach(element => {

        if (element) {

            element.value = '';

            element.value = systemDescription.trim();

        } else {

            console.warn('Description element not found');

        }

    });


    // Set system name in edit popup

    const systemEditNameElements = [

        document.getElementById('system-edit-name'),

        document.querySelector('#editsystem-popup input[id="system-edit-name"]')

    ];


    systemEditNameElements.forEach(element => {

        if (element) {

            element.value = systemName;

        }

    });


    document.querySelector('.systems-name').innerText = systemName;

    document.querySelector('.image-container').style.display = 'none';

    document.querySelector('.system-container').style.display = 'block';


    // Optional: Fetch description as a fallback

    if (!systemDescription) {

        try {

            const descriptionResponse = await fetchSystemDescription(systemName);

            descriptionElements.forEach(element => {

                if (element) {

                    element.value = descriptionResponse;

                }

            });

        } catch (error) {

            console.error('Error fetching system description:', error);

        }

    }

}

function filterFiles() {
    const input = document.getElementById('SystemfileSearch');
    const filter = input.value.toLowerCase(); 
    const table = document.querySelector('.file-table tbody');
    const rows = table.getElementsByTagName('tr'); 

    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName('td')[0]; 
        if (td) {
            const txtValue = td.textContent || td.innerText; 
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = ""; 
            } else {
                rows[i].style.display = "none"; 
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
//document.getElementById('dark-overlay').onclick = closePopup;



// SYSTEM EDIT POPUP
//document.addEventListener('DOMContentLoaded', () => {
//    console.log("Document loaded, setting up event listeners.");
//    document.getElementById('edit-save-btn').addEventListener('click', async function () {
//        await editSystem();
//    });
//});


//document.getElementById('edit-save-btn').addEventListener('click', async function () {
//    await editSystem();
//});


var originalSystemName = '';
var originalDescription = '';
var originalDepartmentIds = [];

// Function to open the edit system popup
function systemEditopenPopup() {

    document.getElementById('dark-overlay1').style.display = 'block';

    document.getElementById('editsystem-popup').style.display = 'block';


    // Reset the popup and disable the save button

    resetEditPopup();


    // Fetch the system details for the selected system

    fetch(`/Systems/GetSystemDetails?systemName=${encodeURIComponent(selectedSystemName)}`)

        .then(response => response.json())

        .then(systemDetails => {

            // Update the input fields with the fetched system details

            document.getElementById('system-edit-name').value = systemDetails.systemName;

            document.getElementById('edit-description').value = systemDetails.description;


            // Store original values

            originalSystemName = systemDetails.systemName;

            originalDescription = systemDetails.description;


            // Fetch the departments for the selected system

            return fetch(`/Systems/GetSystemDepartments?systemName=${encodeURIComponent(selectedSystemName)}`);

        })

        .then(response => response.json())

        .then(departmentIds => {

            preDepartmentSelection(departmentIds);

            originalDepartmentIds = departmentIds; // Store original department IDs

        })

        .catch(error => {

            console.error('Error fetching system details or departments:', error);

        });


    // Setup event listeners for edit division headers

    document.querySelectorAll('.edit-division-header').forEach(header => {

        header.addEventListener('click', () => {

            const contentDiv = header.nextElementSibling; // This should be the edit-division-content

            const icon = header.querySelector('i');


            // Toggle content visibility

            if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {

                contentDiv.style.display = 'block';

                icon.classList.replace('fa-chevron-right', 'fa-chevron-down');

            } else {

                contentDiv.style.display = 'none';

                icon.classList.replace('fa-chevron-down', 'fa-chevron-right');

            }

        });

    });


    // Setup edit division checkbox listeners

    setupEditDivisionCheckboxListeners();


    // Setup listeners for input fields and checkboxes

    setupEditPopupListeners();

}

function systemEditClosePopup() {
    document.getElementById('dark-overlay1').style.display = 'none'; 
    document.getElementById('editsystem-popup').style.display = 'none'; 
}

document.querySelector('.edit-system-button').onclick = systemEditopenPopup;

document.getElementById('close-icon-edit').onclick = systemEditClosePopup;
//document.getElementById('dark-overlay1').onclick = systemEditClosePopup;


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

function updateSelectedCount(divisionDiv) {

    const selectedCountElement = divisionDiv.querySelector('.selected-count');

    const departmentCheckboxes = divisionDiv.querySelectorAll('.department');

    const selectAllCheckbox = divisionDiv.querySelector('.select-all');



    const selectedCount = Array.from(departmentCheckboxes).filter(checkbox => checkbox.checked).length;


    // Update selected count display

    selectedCountElement.textContent = selectedCount > 0 ? selectedCount : '';


    // Update select all checkbox state

    if (selectedCount === departmentCheckboxes.length) {

        selectAllCheckbox.checked = true;

        selectAllCheckbox.indeterminate = false;

    } else if (selectedCount === 0) {

        selectAllCheckbox.checked = false;

        selectAllCheckbox.indeterminate = false;

    } else {

        selectAllCheckbox.checked = false;

        selectAllCheckbox.indeterminate = true;

    }


    // Change division header background

    const header = divisionDiv.querySelector('.division-header');

    header.style.backgroundColor = selectedCount > 0 ? '#D5EBFE' : '';

}

// Add event listeners to dynamically created checkboxes
document.querySelectorAll('.division').forEach(division => {
    const selectAllCheckbox = division.querySelector('.select-all');
    const departmentCheckboxes = division.querySelectorAll('.department');

    selectAllCheckbox.addEventListener('change', (event) => {
        departmentCheckboxes.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateSelectedCount(division);
    });

    departmentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedCount(division);
        });
    });

    // Initial count update
    updateSelectedCount(division);
});


document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.division').forEach(division => {

        setupDivisionListeners(division);

    });

});

function filterDepartmentsDivisions() {
    const input = document.getElementById('DepartmentsDivisionsSearch').value.toLowerCase();
    const divisions = document.querySelectorAll('.division');

    divisions.forEach(division => {
        const divisionName = division.querySelector('.division-header span').textContent.toLowerCase();
        const departmentLabels = division.querySelectorAll('.department');
        let hasVisibleDepartment = false;

        if (divisionName.includes(input)) {
            division.style.display = ''; 
        } else {
            departmentLabels.forEach(label => {
                const departmentName = label.textContent.toLowerCase();
                if (departmentName.includes(input)) {
                    hasVisibleDepartment = true; 
                }
            });
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

        if (divisionName.includes(input)) {
            division.style.display = ''; 
        } else {
            departmentLabels.forEach(label => {
                const departmentName = label.textContent.toLowerCase();
                if (departmentName.includes(input)) {
                    hasVisibleDepartment = true;
                }
            });
            division.style.display = hasVisibleDepartment ? '' : 'none';
        }
    });
}

async function addNewSystem() {
    // 1. Validate System Name
    const systemNameInput = document.getElementById('system-name');
    const systemName = systemNameInput.value.trim();

    // Validation 1: Check if system name is empty
    if (!systemName) {
        showValidationError(systemNameInput, 'Please enter a System Name');
        return;
    }

    // Validation 2: Check system name length
    if (systemName.length < 3 || systemName.length > 100) {
        showValidationError(systemNameInput, 'System name must be between 3 and 100 characters');
        return;
    }

    // Validation 3: Check for valid characters (optional, but recommended)
    const systemNameRegex = /^[a-zA-Z0-9\s\-_]+$/;
    if (!systemNameRegex.test(systemName)) {
        showValidationError(systemNameInput, 'System name can only contain letters, numbers, spaces, hyphens, and underscores');
        return;
    }

    // Validate Description
    const descriptionInput = document.getElementById('description');
    const description = descriptionInput.value.trim();

    // Validation 4: Check if description is empty
    if (!description) {
        showValidationError(descriptionInput, 'Please enter a Description');
        return;
    }

    // Validation 5: Description length check
    if (description.length < 10 || description.length > 500) {
        showValidationError(descriptionInput, 'Description must be between 10 and 500 characters');
        return;
    }

    // Collect selected departments
    const selectedDepartments = [];
    const divisions = document.querySelectorAll('.division');

    divisions.forEach(division => {
        const departmentCheckboxes = division.querySelectorAll('.department:checked');
        departmentCheckboxes.forEach(checkbox => {
            selectedDepartments.push(parseInt(checkbox.value));
        });
    });

    // Validation 6: Check if departments are selected
    if (selectedDepartments.length === 0) {
        showCustomAlert('Please select at least one department');
        return;
    }

    try {
        // Validation 7: Check if system name already exists
        const systemExistsResponse = await fetch('/Systems/CheckSystemExists', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'X-CSRF-TOKEN': document.querySelector('input[name="__RequestVerificationToken"]').value

            },

            body: JSON.stringify({ systemName: systemName })

        });

        const systemExistsResult = await systemExistsResponse.json();

        if (systemExistsResult.exists) {
            showValidationError(systemNameInput, 'A system with this name already exists');
            return;
        }

        // If all validations pass, proceed with system creation
        const systemData = {
            SystemName: systemName,
            Description: description,
            DepartmentIds: selectedDepartments
        };

        // Send system creation request
        const createSystemResponse = await fetch('/Systems/CreateSystem', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

                'X-CSRF-TOKEN': document.querySelector('input[name="__RequestVerificationToken"]').value

            },

            body: JSON.stringify(systemData)

        });

        // Check response
        if (!createSystemResponse.ok) {
            const errorData = await createSystemResponse.json();
            throw new Error(errorData.message || 'Failed to create system');
        }

        const result = await createSystemResponse.json();

        // Close the popup
        document.getElementById('addsystem-popup').style.display = 'none';
        document.getElementById('dark-overlay').style.display = 'none';


        // Show success notification
        showSuccessNotification('System created successfully!');

        // Refresh systems list
        await refreshSystemsList();

    } catch (error) {
        console.error('Error creating system:', error);
        showCustomAlert(`Error: ${error.message}`);
    }
}

// Helper function to show validation errors
function showValidationError(inputElement, message) {
    // Highlight the input field
    //inputElement.style.border = '2px solid red';

    // Create or update error message
    let errorElement = inputElement.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('validation-error')) {
        errorElement = document.createElement('div');
        errorElement.classList.add('validation-error');
        inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    }
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.8em';
    errorElement.style.marginTop = '5px';

    // Focus on the input
    inputElement.focus();
}

// Helper function to show custom alerts
function showCustomAlert(message) {
    // Create alert container if it doesn't exist
    let alertContainer = document.getElementById('custom-alert');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'custom-alert';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.left = '50%';
        alertContainer.style.transform = 'translateX(-50%)';
        alertContainer.style.backgroundColor = '#f44336';
        alertContainer.style.color = 'white';
        alertContainer.style.padding = '15px';
        alertContainer.style.borderRadius = '5px';
        alertContainer.style.zIndex = '1000';
        document.body.appendChild(alertContainer);
    }

    // Set alert message
    alertContainer.textContent = message;

    // Show alert
    alertContainer.style.display = 'block';

    // Automatically hide after 3 seconds
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 3000);
}

// Helper function to show success notification
function showSuccessNotification(message) {
    const notificationPopup = document.getElementById('notification-popup');
    const darkOverlay3 = document.getElementById('dark-overlay3');

    if (darkOverlay3 && notificationPopup) {
        // You might want to update the notification text
        const notificationText = notificationPopup.querySelector('.notification-text');
        if (notificationText) {
            notificationText.textContent = message;
        }

        darkOverlay3.style.display = 'block';
        notificationPopup.style.display = 'block';
    } else {
        console.error("Notification popup or overlay not found.");
    }
}


function showDeleteSuccessNotification(message) {
    const successPopup = document.getElementById('success-popup');
    const darkOverlay123 = document.getElementById('dark-overlay123');
    const successMessage = document.getElementById('success-message');
    const closeButton = document.getElementById('close-success-popup');
    const okButton = document.getElementById('ok-success-btn');

    successMessage.textContent = message;
    successPopup.style.display = 'block';
    darkOverlay123.style.display = 'block';

    // Close the popup when the close button is clicked
    closeButton.onclick = function () {
        successPopup.style.display = 'none';
        darkOverlay123.style.display = 'none';
    };

    // Close the popup when the OK button is clicked
    okButton.onclick = function () {
        successPopup.style.display = 'none';
        darkOverlay123.style.display = 'none';
    };

    darkOverlay123.onclick = function () {
        successPopup.style.display = 'none';
        darkOverlay123.style.display = 'none';
    };
}



window.onclick = function (event) {

    const successPopup = document.getElementById('success-popup');

    if (event.target === successPopup) {

        successPopup.style.display = 'none';

    }

};

// Function to refresh systems list
async function refreshSystemsList() {
    try {
        const response = await fetch('/Systems/GetAllSystems');
        const systems = await response.json();

        // Update the systems list in the UI
        const systemList = document.getElementById('systemList');
        systemList.innerHTML = ''; // Clear existing list

        systems.forEach(system => {
            const li = document.createElement('li');
            li.setAttribute('data-system-description', system.description || '');
            li.innerHTML = `
                <a href="#">
                    <img src="/Content/Assets/folder-icon.svg" alt="Folder icon" class="folder-icon" />
                    ${system.systemName}
                </a>
            `;
            li.onclick = () => highlightSystem(li);
            systemList.appendChild(li);
        });

        // Refresh the custom dropdown
        populateCustomDropdown();
    } catch (error) {
        console.error('Error refreshing systems list:', error);
    }
}


document.querySelector('.save-btn').onclick = addNewSystem;


function closeNotificationPopup() {
    document.getElementById('dark-overlay3').style.display = 'none'; 
    document.getElementById('notification-popup').style.display = 'none'; 
}

document.getElementById('close-icon3').onclick = closeNotificationPopup;
document.getElementById('dark-overlay3').onclick = closeNotificationPopup;

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
            highlightSystem(item);
        }
    });
}

window.addEventListener('load', toggleSystemList);
window.addEventListener('resize', toggleSystemList);


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


function preDepartmentSelection(departmentIds) {
    const allDivisions = document.querySelectorAll('.edit-division');

    allDivisions.forEach(division => {
        const selectAllCheckbox = division.querySelector('.edit-select-all');
        const departmentCheckboxes = division.querySelectorAll('.edit-department');
        const contentDiv = division.querySelector('.edit-division-content');
        const headerIcon = division.querySelector('.edit-division-header i');

        // Reset first
        if (selectAllCheckbox) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        }

        // Check if there are department checkboxes
        if (departmentCheckboxes.length > 0) {
            departmentCheckboxes.forEach(checkbox => {
                checkbox.checked = departmentIds.includes(parseInt(checkbox.value));
            });

            // Manage content visibility and icon
            const selectedCount = Array.from(departmentCheckboxes).filter(checkbox => checkbox.checked).length;
            if (selectedCount > 0) {
                contentDiv.style.display = 'block';
                headerIcon.classList.remove('fa-chevron-right');
                headerIcon.classList.add('fa-chevron-down');
            } else {
                contentDiv.style.display = 'none';
                headerIcon.classList.remove('fa-chevron-down');
                headerIcon.classList.add('fa-chevron-right');
            }

            // Update selected count
            updateEditSelectedCount(division);
        } else {
            // If no departments, show the message and hide the content
            contentDiv.style.display = 'none';
            headerIcon.classList.remove('fa-chevron-down');
            headerIcon.classList.add('fa-chevron-right');
        }
    });
}

function selectAllHandler(event) {

    const divisionDiv = event.target.closest('.division');

    const departmentCheckboxes = divisionDiv.querySelectorAll('.department');



    departmentCheckboxes.forEach(checkbox => {

        checkbox.checked = event.target.checked;

    });



    updateSelectedCount(divisionDiv);

}


function departmentHandler() {

    const divisionDiv = this.closest('.division');

    updateSelectedCount(divisionDiv);

}

function setupDivisionListeners(divisionDiv) {

    const selectAllCheckbox = divisionDiv.querySelector('.select-all');

    const departmentCheckboxes = divisionDiv.querySelectorAll('.department');


    // Remove existing listeners to prevent multiple bindings

    selectAllCheckbox.removeEventListener('change', selectAllHandler);

    selectAllCheckbox.addEventListener('change', selectAllHandler);


    departmentCheckboxes.forEach(checkbox => {

        checkbox.removeEventListener('change', departmentHandler);

        checkbox.addEventListener('change', departmentHandler);

    });


    // Initial update of selected count

    updateSelectedCount(divisionDiv);

}



var selectedSystemName = ''; // Variable to store the selected system name

async function selectCustomOption(element) {
    const systemName = element.textContent.trim();
    selectedSystemName = systemName; // Store the selected system name

    try {
        // Fetch system departments
        const response = await fetch(`/Systems/GetSystemDepartments?systemName=${encodeURIComponent(systemName)}`);
        const departmentIds = await response.json();

        // Pre-select departments and set up listeners
        preDepartmentSelection(departmentIds);
    } catch (error) {
        console.error('Error fetching system departments:', error);
    }

    var systemDescription = element.getAttribute('data-system-description') || '';

    // Update UI elements
    document.getElementById('selected-option').textContent = systemName;
    document.getElementById('system-edit-name').value = systemName;

    // Update other UI elements
    document.querySelector('.systems-name').innerText = systemName;
    document.querySelector('.image-container').style.display = 'none';
    document.querySelector('.system-container').style.display = 'block';

    // Dropdown UI management
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => div.classList.remove('active'));
    element.classList.add('active');
}


function showAllCustomOptions() {
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => div.style.display = "");
}

window.addEventListener('click', function (event) {
    var dropdownContent = document.querySelector('.custom-dropdown-content');
    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    var selector = document.querySelector('.custom-selector');

    if (!dropdownToggle.contains(event.target) && dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');
        selector.style.borderBottomLeftRadius = '10px';
        selector.style.borderBottomRightRadius = '10px';
        selector.style.borderBottom = '1px solid #6D6D6D';
    }
});


function populateCustomDropdown() {

    var dropdownList = document.querySelector('.custom-dropdown-list');

    dropdownList.innerHTML = '';

    var systemListItems = document.querySelectorAll('#systemList li');


    systemListItems.forEach(function (item) {

        var systemName = item.innerText.trim();

        var systemDescription = item.getAttribute('data-system-description') || '';


        var dropdownItem = document.createElement('div');

        dropdownItem.textContent = systemName;

        dropdownItem.setAttribute('data-system-description', systemDescription);


        dropdownItem.onclick = function () {

            selectCustomOption(dropdownItem);

        };


        dropdownList.appendChild(dropdownItem);

    });


    if (dropdownList.children.length === 0) {

        console.log("No items found to populate the dropdown.");

    }

}

window.addEventListener('load', function () {
    //console.log("Window loaded, populating dropdown...");
    populateCustomDropdown();
});

document.querySelector('.add-system-button').addEventListener('click', function () {
    document.getElementById('addsystem-popup').style.display = 'block';
    loadDivisions();
    showAddSystemPopup()
});

async function editSystem() {
    const systemNameInput = document.getElementById('system-edit-name');
    const systemName = systemNameInput.value.trim();
    const descriptionInput = document.getElementById('edit-description');
    const description = descriptionInput.value.trim();

    // Get the SystemID from the selected system
    const systemId = selectedSystemId;

    console.log('Edit System Details:', {
        systemId: systemId,
        systemName: systemName,
        description: description
    });

    // Validate inputs
    if (!systemId) {
        console.error('No system ID selected');
        showCustomAlert('Please select a system to edit');
        return;
    }

    if (!systemName || systemName.length < 3 || systemName.length > 100) {
        showValidationError(systemNameInput, 'Invalid System Name');
        return;
    }
    if (!description || description.length < 10 || description.length > 500) {
        showValidationError(descriptionInput, 'Invalid Description');
        return;
    }

    // Collect selected departments
    const selectedDepartments = Array.from(document.querySelectorAll('.edit-department:checked')).map(checkbox => parseInt(checkbox.value));

    const systemUpdateData = {
        SystemID: systemId, // Explicitly include the SystemID
        SystemName: systemName,
        Description: description,
        DepartmentIds: selectedDepartments
    };

    console.log('Sending system update data:', systemUpdateData);

    try {
        const updateSystemResponse = await fetch('/Systems/UpdateSystem', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('input[name="__RequestVerificationToken"]').value
            },
            body: JSON.stringify(systemUpdateData)
        });

        // Log the raw response
        console.log('Update System Raw Response:', updateSystemResponse);

        if (!updateSystemResponse.ok) {
            const errorData = await updateSystemResponse.json();
            console.error('Update System Error:', errorData);
            throw new Error(errorData.message || 'Failed to update system');
        }

        const result = await updateSystemResponse.json();
        console.log('System Update Result:', result);

        // Close the popup
        document.getElementById('editsystem-popup').style.display = 'none';
        document.getElementById('dark-overlay1').style.display = 'none';
        showSuccessNotification('System updated successfully!');

        // Refresh systems list
        await refreshSystemsList();

    } catch (error) {
        console.error('Error updating system:', error);
        showCustomAlert(`Error: ${error.message}`);
    }
}

// Function to update the system list and dropdown
function updateSystemList(systemId, systemName, description) {
    // Update the system list
    const systemList = document.getElementById('systemList');
    const systemItems = systemList.getElementsByTagName('li');

    for (let item of systemItems) {
        if (item.getAttribute('data-system-id') == systemId) {
            item.querySelector('a').textContent = systemName; // Update the system name
            item.setAttribute('data-system-description', description); // Update the description
            break;
        }
    }

    // Update the custom dropdown list
    const customDropdownList = document.querySelector('.custom-dropdown-list');
    const dropdownItems = customDropdownList.getElementsByTagName('div');

    for (let dropdownItem of dropdownItems) {
        if (dropdownItem.textContent.trim() === systemName) {
            dropdownItem.setAttribute('data-system-description', description); // Update the description
            break;
        }
    }
}

async function fetchSystemDescription(systemName) {
    try {
        const response = await fetch(`/Systems/GetSystemDescription?systemName=${encodeURIComponent(systemName)}`);
        const data = await response.json();
        return data.description || '';
    } catch (error) {
        console.error('Error fetching system description:', error);
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const descriptionElement = document.getElementById('description');
    if (descriptionElement) {
        descriptionElement.addEventListener('input', (event) => {
            console.log('Description changed:', event.target.value);
        });
    } else {
        console.warn('Description element not found on page load');
    }
    document.querySelectorAll('.division').forEach(division => {
        setupDivisionListeners(division);
    });
});



document.getElementById('delete-system-button').onclick = async function () {
    if (!selectedSystemName) {
        alert("Please select a system to delete.");
        return;
    }

    try {
        const response = await fetch('/Systems/SoftDeleteSystem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ systemName: selectedSystemName })
        });

        const data = await response.json();
        console.log("Response from server:", data); // Log the server response
        if (data.message === "System soft deleted successfully") {
            // Refresh the systems list to reflect the deletion immediately
            await refreshSystemsList();

            // Reset the selected option in the dropdown
            document.querySelector('#selected-option').textContent = 'Select a system';
            document.querySelector('.system-container').style.display = 'none';
            document.querySelector('.image-container').style.display = 'flex';

            // Show success notification
            showDeleteSuccessNotification(`System "${selectedSystemName}" has been successfully deleted.`);

            // Close the delete popup
            closeDeletePopup();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the system.');
    }
};

function closeDeletePopup() {
    document.getElementById('deletesystem-popup').style.display = 'none';
    document.getElementById('dark-overlay2').style.display = 'none';
}

document.querySelector('.delete-system-button').onclick = function () {
    if (!selectedSystemName) {
        alert("Please select a system to delete.");
        return;
    }

    // Set the system name in the delete confirmation popup
    document.getElementById('system-name-to-delete').textContent = selectedSystemName;

    // Show the delete confirmation popup
    document.getElementById('deletesystem-popup').style.display = 'block';
    document.getElementById('dark-overlay2').style.display = 'block';
};


























// EDIT SYSTEM NEW JAVASCRIPTS

// Function to open the edit system popup
function openEditSystemPopup() {
    document.getElementById('editsystem-popup').style.display = 'block';

    // Setup event listeners for edit division headers
    document.querySelectorAll('.edit-division-header').forEach(header => {
        header.addEventListener('click', () => {
            console.log('Division clicked:', header.querySelector('.edit-division-name').textContent); // Log the division name
            const contentDiv = header.nextElementSibling; // This should be the edit-division-content
            const icon = header.querySelector('i');

            // Toggle content visibility
            if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
                contentDiv.style.display = 'block';
                icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
            } else {
                contentDiv.style.display = 'none';
                icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
            }
        });
    });

    // Setup edit division checkbox listeners
    setupEditDivisionCheckboxListeners();
}

function setupEditDivisionCheckboxListeners() {

    document.querySelectorAll('.edit-division').forEach(division => {

        const selectAllCheckbox = division.querySelector('.edit-select-all');

        const departmentCheckboxes = division.querySelectorAll('.edit-department');


        // Select All checkbox functionality

        if (selectAllCheckbox) {

            selectAllCheckbox.addEventListener('change', (event) => {

                departmentCheckboxes.forEach(checkbox => {

                    checkbox.checked = event.target.checked;

                });

                updateEditSelectedCount(division);

            });

        }


        // Individual department checkbox listeners

        departmentCheckboxes.forEach(checkbox => {

            checkbox.addEventListener('change', () => {

                updateEditSelectedCount(division);

            });

        });


        // Initial count update

        updateEditSelectedCount(division);

    });

}

function updateEditSelectedCount(divisionDiv) {
    const selectedCountElement = divisionDiv.querySelector('.edit-selected-count');
    const departmentCheckboxes = divisionDiv.querySelectorAll('.edit-department');
    const selectAllCheckbox = divisionDiv.querySelector('.edit-select-all');

    // Only proceed if there are department checkboxes
    if (departmentCheckboxes.length > 0) {
        const selectedCount = Array.from(departmentCheckboxes).filter(checkbox => checkbox.checked).length;

        // Update selected count display
        selectedCountElement.textContent = selectedCount > 0 ? selectedCount : '';

        // Update select all checkbox state
        if (selectedCount === departmentCheckboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }

        // Change division header background
        const header = divisionDiv.querySelector('.edit-division-header');
        header.style.backgroundColor = selectedCount > 0 ? '#D5EBFE' : '';
    } else {
        // If no department checkboxes, clear the selected count
        selectedCountElement.textContent = '';
    }
}


// Function to filter edit departments and divisions
function filterEditDepartmentsDivisions() {

    const input = document.getElementById('EditDepartmentsDivisionsSearch').value.toLowerCase();

    const divisions = document.querySelectorAll('.edit-division');


    divisions.forEach(division => {

        const divisionName = division.querySelector('.edit-division-header span').textContent.toLowerCase();

        const departmentLabels = division.querySelectorAll('.edit-department');

        let hasVisibleDepartment = false;


        if (divisionName.includes(input)) {

            division.style.display = '';

        } else {

            departmentLabels.forEach(label => {

                const departmentName = label.textContent.toLowerCase();

                if (departmentName.includes(input)) {

                    hasVisibleDepartment = true;

                }

            });

            division.style.display = hasVisibleDepartment ? '' : 'none';

        }

    });

}

// Event listener for the close icon
document.getElementById('close-icon-edit').onclick = function () {

    document.getElementById('editsystem-popup').style.display = 'none';

    document.getElementById('dark-overlay1').style.display = 'none';

};

// Ensure the functions are available when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Any additional initialization can go here
});


// Function to reset the popup and disable the save button

function resetEditPopup() {

    const saveButton = document.getElementById('edit-save-btn');

    saveButton.disabled = true; // Disable the save button by default

}


// Function to enable the save button

function enableSaveButton() {

    const saveButton = document.getElementById('edit-save-btn');

    saveButton.disabled = false; // Enable the save button

}


// Function to check for changes in the input fields and checkboxes

function setupEditPopupListeners() {

    const systemNameInput = document.getElementById('system-edit-name');

    const descriptionInput = document.getElementById('edit-description');

    const departmentCheckboxes = document.querySelectorAll('.edit-department');


    // Add event listeners to input fields

    systemNameInput.addEventListener('input', checkForChanges);

    descriptionInput.addEventListener('input', checkForChanges);


    // Add event listeners to department checkboxes

    departmentCheckboxes.forEach(checkbox => {

        checkbox.addEventListener('change', checkForChanges);

    });

}



// Function to check for changes

function checkForChanges() {

    const currentSystemName = document.getElementById('system-edit-name').value;

    const currentDescription = document.getElementById('edit-description').value;

    const currentDepartmentIds = Array.from(document.querySelectorAll('.edit-department:checked')).map(checkbox => parseInt(checkbox.value));


    const saveButton = document.getElementById('edit-save-btn');


    // Check if any of the values have changed

    const isChanged = currentSystemName !== originalSystemName ||

        currentDescription !== originalDescription ||

        !arraysEqual(currentDepartmentIds, originalDepartmentIds);


    saveButton.disabled = !isChanged; // Enable or disable the save button based on changes

}

// Helper function to compare two arrays

function arraysEqual(arr1, arr2) {

    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {

        if (arr1[i] !== arr2[i]) return false;

    }

    return true;

}


function resetEditPopupToOriginalValues() {

    // Restore original values to input fields

    document.getElementById('system-edit-name').value = originalSystemName;

    document.getElementById('edit-description').value = originalDescription;


    // Restore original department selections

    const departmentCheckboxes = document.querySelectorAll('.edit-department');

    departmentCheckboxes.forEach(checkbox => {

        checkbox.checked = originalDepartmentIds.includes(parseInt(checkbox.value));

    });


    // Disable the save button since we are resetting to original values

    document.getElementById('edit-save-btn').disabled = true;

}

document.getElementById('edit-reset-btn').addEventListener('click', resetEditPopupToOriginalValues);

