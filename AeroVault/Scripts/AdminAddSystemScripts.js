function resetPopup(popupType) {
    const systemNameInput = document.getElementById('system-name');
    const descriptionInput = document.getElementById('description');
    const searchInput = document.getElementById('DepartmentsDivisionsSearch');

    // Reset input fields
    if (popupType === 'add') {
        systemNameInput.value = '';
        descriptionInput.value = '';
        searchInput.value = '';
    }

    // Remove any existing validation errors
    const existingErrors = document.querySelectorAll('.validation-error');
    existingErrors.forEach(error => error.remove());

    // Reset division checkboxes only if it's the add popup
    if (popupType === 'add') {
        const divisions = document.querySelectorAll('.division');

        divisions.forEach(division => {
            const selectAllCheckbox = division.querySelector('.select-all');
            const departmentCheckboxes = division.querySelectorAll('.department');
            const divisionHeader = division.querySelector('.division-header');

            if (divisionHeader) {
                divisionHeader.style.backgroundColor = '#E9E9EF';
            }

            // Explicitly uncheck the "Select All" checkbox
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            }

            // Uncheck all department checkboxes
            departmentCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Reset selected count
            const selectedCountElement = division.querySelector('.selected-count');
            if (selectedCountElement) selectedCountElement.textContent = '';

            // Reset division content visibility
            const contentDiv = division.querySelector('.division-content');
            if (contentDiv) contentDiv.style.display = 'none';

            // Reset division header icon
            const icon = division.querySelector('.division-header i');
            if (icon) {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            }
        });

        // Refilter to show all divisions
        filterDepartmentsDivisions();
    }
}

// Setup popup event listeners
function setupPopupEventListeners() {
    const closeIcon = document.getElementById('close-icon');
    const popup = document.getElementById('addsystem-popup');
    const darkOverlay = document.getElementById('dark-overlay');

    // Remove existing event listeners to prevent multiple bindings
    if (closeIcon) {
        closeIcon.removeEventListener('click', popupCloseHandler);
        closeIcon.addEventListener('click', popupCloseHandler);
    }

    if (darkOverlay) {
        darkOverlay.removeEventListener('click', popupCloseHandler);
        darkOverlay.addEventListener('click', popupCloseHandler);
    }
}

// Popup close handler
function popupCloseHandler() {
    resetPopup('add'); // Specify that we are resetting the add popup
    const popup = document.getElementById('addsystem-popup');
    const darkOverlay = document.getElementById('dark-overlay');

    if (popup) popup.style.display = 'none';
    if (darkOverlay) darkOverlay.style.display = 'none';
}

// Modified addNewSystem function
async function addNewSystem() {
    try {
        resetPopup('add'); // Specify that we are resetting the add popup

        const popup = document.getElementById('addsystem-popup');
        const darkOverlay = document.getElementById('dark-overlay');
        if (popup) popup.style.display = 'none';
        if (darkOverlay) darkOverlay.style.display = 'none';

        // Show success notification
        showSuccessNotification('System created successfully!');

        // Refresh systems list
        await refreshSystemsList();

    } catch (error) {
        console.error('Error creating system:', error);
        showCustomAlert(`Error: ${error.message}`);
    }
}

// Initial setup when page loads
document.addEventListener('DOMContentLoaded', function () {

    // Load divisions
    loadDivisions().then(() => {

        // Setup event listeners after divisions are loaded
        setupPopupEventListeners();
    });

    // Attach addNewSystem to window to make it globally accessible
    window.addNewSystem = addNewSystem;
});
;

async function loadDivisions() {
    const divisionContainer = document.getElementById('division-container');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorMessage = document.getElementById('error-message');

    try {
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        divisionContainer.innerHTML = '';

        const tokenElement = document.querySelector('input[name="__RequestVerificationToken"]');
        const csrfToken = tokenElement ? tokenElement.value : '';

        const response = await fetch('/Systems/GetDivisionsForPopup', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const divisionsData = await response.json();
        loadingIndicator.style.display = 'none';

        if (!Array.isArray(divisionsData) || divisionsData.length === 0) {
            errorMessage.textContent = 'No divisions found.';
            errorMessage.style.display = 'block';
            return;
        }

        divisionsData.forEach(division => {
            const divisionDiv = createDivisionElement(division);
            divisionContainer.appendChild(divisionDiv);
        });

    } catch (error) {
        console.error("Error loading divisions:", error);
        loadingIndicator.style.display = 'none';
        errorMessage.textContent = `Error: ${error.message}. Please try again.`;
        errorMessage.style.display = 'block';
    }
}

function createDivisionElement(division) {
    const divisionDiv = document.createElement('div');
    divisionDiv.classList.add('division');

    const header = document.createElement('div');
    header.classList.add('division-header');
    header.innerHTML = `
               <div>
                   <i class="fas fa-chevron-right"></i>
                   <span class="division-name">${division.divisionName}</span>
               </div>
               <span class="selected-count"></span>
           `;

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('division-content');
    contentDiv.style.display = 'none'; // Initially hidden

    const checkboxGroup = document.createElement('div');
    checkboxGroup.classList.add('checkbox-group');

    // Select All checkbox
    const selectAllLabel = createSelectAllCheckbox();
    checkboxGroup.appendChild(selectAllLabel);

    // Department checkboxes
    if (division.departments && division.departments.length > 0) {
        division.departments.forEach(department => {
            const departmentLabel = createDepartmentCheckbox(department);
            checkboxGroup.appendChild(departmentLabel);
        });
    } else {
        const noDepartmentsLabel = document.createElement('label');
        noDepartmentsLabel.textContent = "No departments available.";
        checkboxGroup.appendChild(noDepartmentsLabel);
    }

    contentDiv.appendChild(checkboxGroup);
    divisionDiv.appendChild(header);
    divisionDiv.appendChild(contentDiv);

    // Add event listener for toggling visibility
    header.addEventListener('click', () => {
        contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
        const icon = header.querySelector('i');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-right');
    });

    setupCheckboxListeners(divisionDiv);
    return divisionDiv;
}

function createDepartmentCheckbox(department) {
    const departmentLabel = document.createElement('label');
    const departmentCheckbox = document.createElement('input');
    departmentCheckbox.type = 'checkbox';
    departmentCheckbox.classList.add('department');
    departmentCheckbox.value = department.departmentID;
    departmentLabel.appendChild(departmentCheckbox);
    departmentLabel.appendChild(document.createTextNode(` ${department.departmentName}`));
    return departmentLabel;
}

function createSelectAllCheckbox() {
    const selectAllLabel = document.createElement('label');
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.classList.add('select-all');
    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.appendChild(document.createTextNode(' Select All'));
    return selectAllLabel;
}

function setupCheckboxListeners(divisionDiv) {
    const selectAllCheckbox = divisionDiv.querySelector('.select-all');
    const departmentCheckboxes = divisionDiv.querySelectorAll('.department');

    selectAllCheckbox.addEventListener('change', (event) => {
        departmentCheckboxes.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateSelectedCount(divisionDiv);
    });

    departmentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedCount(divisionDiv);
        });
    });
}

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

function preparePopupForDisplay() {
    // Reset input fields
    const systemNameInput = document.getElementById('system-name');
    const descriptionInput = document.getElementById('description');
    const searchInput = document.getElementById('DepartmentsDivisionsSearch');

    // Explicitly clear values
    if (systemNameInput) systemNameInput.value = '';
    if (descriptionInput) descriptionInput.value = '';
    if (searchInput) searchInput.value = '';

    // Reset divisions
    resetPopup();
}


function showAddSystemPopup() {
    preparePopupForDisplay();
    const popup = document.getElementById('addsystem-popup');
    const darkOverlay = document.getElementById('dark-overlay');

    if (popup) popup.style.display = 'block';
    if (darkOverlay) darkOverlay.style.display = 'block';
}