$(document).ready(function () {
    $('#add-department-btn').on('click', function () {
        var departmentName = $('#new-department-name').val().trim();
        var selectedDivisionId = $('.unique-dropdown-list .active').data('division-id');
        var selectedDivisionName = $('.unique-dropdown-list .active').text().trim();

        // Reset error messages
        $('#department-name-error').hide();
        $('#division-error').hide();

        let hasError = false;

        // Check for department name
        if (!departmentName) {
            $('#department-name-error').show();
            hasError = true;
        }

        // Check for selected division
        if (!selectedDivisionId) {
            $('#division-error').show();
            hasError = true;
        }

        // If there are errors, do not proceed
        if (hasError) {

            // Optionally, you can add visual indication for the button

            $('#add-department-btn').prop('disabled', true);

            return;

        }

        // If no errors, proceed with AJAX request
        $.ajax({
            type: 'POST',
            url: '/Departments/AddDepartment',
            data: {
                departmentName: departmentName,
                divisionId: selectedDivisionId
            },
            success: function (response) {
                // Close the add department popup
                $('#adddepartment-popup').hide();

                // Reset input fields
                $('#new-department-name').val('');
                $('#unique-selected-option').text('Select a Division');
                $('#add-department-btn').prop('disabled', true);

                // Dynamically add the new department to the system list
                const newListItem = `
                        <li onclick="highlightSystem(this)"
                            data-department-id="${response.departmentId}"
                            data-department-name="${response.departmentName}"
                            data-division-id="${response.divisionId}"
                            data-division-name="${response.divisionName}">
                            ${response.departmentName}
                        </li>
                    `;

                // Add to system list
                if ($('#systemList li:first').text() === 'No Departments available.') {
                    $('#systemList').empty(); // Remove 'No Departments available' message
                }
                $('#systemList').append(newListItem);

                // Dynamically add to custom dropdown list
                const newDropdownItem = `
                        <div onclick="selectCustomOption(this); highlightSystem(this)"
                             data-department-id="${response.departmentId}"
                             data-department-name="${response.departmentName}"
                             data-division-id="${response.divisionId}"
                             data-division-name="${response.divisionName}">
                            ${response.departmentName}
                        </div>
                    `;
                $('.custom-dropdown-list').append(newDropdownItem);

                // Show notification popup
                $('#notification-popup2').show();
                $('#dark-overlay-dep3').show();
            },
            error: function (xhr, status, error) {
                // Check for specific error message about duplicate department
                if (xhr.status === 400) {
                    // Show the error message in the department name error span
                    $('#department-name-error')
                        .text('Department name already in use')
                        .show();
                } else {
                    // For other types of errors
                    console.log("An error occurred: " + xhr.responseText);
                }
            }
        });
    });
});

document.getElementById('new-department-name').addEventListener('input', function () {
    // Hide department name error when user starts typing
    if (this.value.trim()) {
        document.getElementById('department-name-error').style.display = 'none';
    }

    // Enable/disable button based on inputs
    const departmentName = this.value.trim();
    const selectedDivision = document.getElementById('unique-selected-option').innerText;
    const addButton = document.getElementById('add-department-btn');

    addButton.disabled = !(departmentName && selectedDivision !== 'Select a Division');
});


document.querySelector('.unique-dropdown-list').addEventListener('click', function () {
    // Hide division error when a division is selected
    const selectedDivision = document.getElementById('unique-selected-option').innerText;
    if (selectedDivision !== 'Select a Division') {
        document.getElementById('division-error').style.display = 'none';
    }

    // Enable/disable button based on inputs
    const departmentName = document.getElementById('new-department-name').value.trim();
    const addButton = document.getElementById('add-department-btn');

    addButton.disabled = !(departmentName && selectedDivision !== 'Select a Division');
});


function selectUniqueOption(element) {
    var selectedOption = element.textContent || element.innerText;
    document.getElementById('unique-selected-option').textContent = selectedOption;
    document.querySelector('.unique-dropdown-content').style.display = 'none';
    document.querySelector('.unique-dropdown-toggle').classList.remove('open');

    // Hide division error when a division is selected
    document.getElementById('division-error').style.display = 'none';

    // Enable/disable button based on inputs
    const departmentName = document.getElementById('new-department-name').value.trim();
    const addButton = document.getElementById('add-department-btn');

    addButton.disabled = !(departmentName && selectedOption !== 'Select a Division');

    var divs = document.querySelectorAll('.unique-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');
}

function toggleUniqueDropdown() {
    var dropdownContent = document.querySelector('.unique-dropdown-content');
    var dropdownToggle = document.querySelector('.unique-dropdown-toggle');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');
    }
}

function filterUniqueOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('unique-search-input');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.unique-dropdown-list div');

    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        div[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
}

document.getElementById('close-icon-dep1').onclick = function () {
    resetForm();
    document.getElementById('adddepartment-popup').style.display = 'none';
};

function resetForm() {
    document.getElementById('new-department-name').value = '';
    document.getElementById('unique-selected-option').innerText = 'Select a Division';
    document.getElementById('add-department-btn').disabled = true;

    // Reset error messages
    document.getElementById('department-name-error').style.display = 'none';
    document.getElementById('division-error').style.display = 'none';
}

function loadDepartments() {
    $.ajax({
        type: 'GET',
        url: '/Departments/GetAllDepartments',
        success: function (departments) {
            $('#systemList').empty();
            $('.custom-dropdown-list').empty();

            if (departments.length === 0) {
                $('#systemList').append('<li>No Departments available.</li>');
                $('.custom-dropdown-list').append('<div>No Departments available.</div>');
            } else {
                departments.forEach(function (department) {
                    $('#systemList').append(
                        `<li onclick="highlightSystem(this); setDepartmentName('${department.departmentName}')"
                            class="department-li"
                            data-division-id="${department.divisionID}"
                            data-division-name="${department.divisionName}">
                            <a href="#">${department.departmentName}</a>
                        </li>`
                    );

                    $('.custom-dropdown-list').append(
                        `<div onclick="selectCustomOption(this); setDepartmentName('${department.departmentName}')"
                             data-division-id="${department.divisionID}"
                             data-division-name="${department.divisionName}">
                            ${department.departmentName}
                        </div>`
                    );
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Error loading departments:", xhr.responseText);

            // Optional: Show an error message to the user
            $('#systemList').empty();
            $('.custom-dropdown-list').empty();
            $('#systemList').append('<li>Failed to load departments. Please try again.</li>');
            $('.custom-dropdown-list').append('<div>Failed to load departments. Please try again.</div>');
        }
    });
}