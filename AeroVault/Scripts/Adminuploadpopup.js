// Global variables to track state

var selectedFiles = [];

var selectedDepartments = [];

var selectedSystem = null;

var selectedCategory = null;


function validateStep(currentStep) {

    switch (currentStep) {

        case 1:

            selectedDepartments = Array.from(

                document.querySelectorAll(".division-content .department:checked")

            ).map((checkbox) => checkbox.nextSibling.textContent.trim());

            return selectedDepartments.length > 0;


        case 2:

            selectedSystems = Array.from(

                document.querySelectorAll(".division-content .system:checked")

            ).map((checkbox) => checkbox.nextSibling.textContent.trim());

            return selectedSystems.length > 0;


        case 3:

            selectedCategory = document.getElementById("selected-status");

            return (

                selectedCategory && selectedCategory.textContent !== "Select a type"

            );


        case 4:

            return selectedFiles.length > 0;


        default:

            return false;

    }

}


// Function to save selected departments

function saveSelectedDepartments() {

    selectedDepartments = Array.from(document.querySelectorAll(".department:checked")).map(checkbox => {

        return {

            id: checkbox.getAttribute('data-department-id'),

            name: checkbox.nextSibling.textContent.trim()

        };

    });

}


// Function to restore selected departments

function restoreSelectedDepartments() {

    selectedDepartments.forEach(department => {

        const checkbox = document.querySelector(`.department[data-department-id="${department.id}"]`);

        if (checkbox) {

            checkbox.checked = true;

            updateDivisionHeaderStyle(checkbox.closest('.division'));

            updateSelectedCount(checkbox.closest('.division'));

        }

    });

}

var persistentSelectedDepartments = [];
function goToStep(step) {

    const currentStep = parseInt(

        document.querySelector(".step.active .number").textContent

    );


    // Validate the current step before proceeding

    if (step > currentStep && !validateStep(currentStep)) {

        alert(`Please complete step ${currentStep} before proceeding.`);

        return;

    }


    // Save selected departments and their systems when moving to Step 2

    if (currentStep === 1) {

        // Clear previous persistent selections

        persistentSelectedDepartments = [];


        // Collect currently selected departments

        const selectedDepartmentCheckboxes = document.querySelectorAll(".department:checked");



        selectedDepartmentCheckboxes.forEach(checkbox => {

            const departmentEntry = {

                id: checkbox.getAttribute('data-department-id'),

                name: checkbox.getAttribute('data-department-name'),

                divisionId: checkbox.getAttribute('data-division-id'),

                selectedSystems: [] // Will be populated in the next step

            };

            persistentSelectedDepartments.push(departmentEntry);

        });

    }


    // Handle the transition to Step 2

    if (step === 2) {

        const systemsContainer = document.querySelector('.step-2-content .division-container');

        systemsContainer.innerHTML = ''; // Clear previous systems


        // Restore or fetch systems for previously selected departments

        persistentSelectedDepartments.forEach(department => {

            const departmentCheckbox = document.querySelector(`.department[data-department-id="${department.id}"]`);



            if (departmentCheckbox) {

                departmentCheckbox.checked = true;

                fetchSystems(departmentCheckbox);

            }

        });

    }


    // Rest of the existing goToStep logic...

    // (Update active steps, show/hide contents, etc.)

    document.querySelectorAll(".step").forEach(function (el) {

        el.classList.remove("active");

        el.classList.remove("completed");

    });


    document.querySelector(".step-" + step).classList.add("active");


    for (var i = 1; i < step; i++) {

        document.querySelector(".step-" + i).classList.add("completed");

    }


    // Hide all step contents

    document.querySelectorAll(".step-content").forEach((content) => {

        content.style.display = "none";

    });


    // Show the current step content

    document.querySelector(".step-" + step + "-content").style.display = "block";

}


// Function to toggle division visibility

function toggleDivision(header) {

    const divisionContent = header.nextElementSibling; // Get the corresponding division content

    const icon = header.querySelector("i"); // Get the icon for toggling


    // Toggle the display of the division content

    if (divisionContent.style.display === "block") {

        divisionContent.style.display = "none";

        icon.classList.replace("fa-chevron-down", "fa-chevron-right");

    } else {

        divisionContent.style.display = "block";

        icon.classList.replace("fa-chevron-right", "fa-chevron-down");

    }


    // Add event listeners for subsystem details

    const systemItems = divisionContent.querySelectorAll('.system-item');

    systemItems.forEach(item => {

        const label = item.querySelector('label');

        const details = item.querySelector('.subsystem-details');


        label.addEventListener('click', () => {

            if (details.style.display === "block") {

                details.style.display = "none";

                label.querySelector("input").checked = false; // Uncheck if collapsing

            } else {

                details.style.display = "block";

                label.querySelector("input").checked = true; // Check if expanding

            }

        });

    });

}


// Add event listeners for the step 2 division headers

document.querySelectorAll(".step2-division-header").forEach((header) => {

    header.addEventListener("click", () => {

        toggleDivision(header);

    });

});


// Add event listeners for drag-and-drop functionality

var dropArea = document.getElementById("drop-area");


dropArea.addEventListener("dragover", preventDefaults, false);

dropArea.addEventListener("dragleave", preventDefaults, false);

dropArea.addEventListener("drop", handleDrop, false);


function preventDefaults(e) {

    e.preventDefault();

    e.stopPropagation();

}


function handleDrop(e) {

    preventDefaults(e); // Ensure default behavior is prevented

    let dt = e.dataTransfer;

    let files = dt.files;

    handleFiles(files);

}

    function handleFiles(files) {
        Array.from(files).forEach((file) => {
            if (
                !selectedFiles.some((existingFile) => existingFile.name === file.name)
            ) {
                selectedFiles.push(file);
            }
        });
        updateFileDisplay();
    }

    function updateFileDisplay() {
        const selectedFilesContainer = document.getElementById("selected-files");
        selectedFilesContainer.innerHTML = "";

        if (selectedFiles.length === 0) {
            selectedFilesContainer.innerHTML = "<p>No files selected</p>";
            return;
        }

        const fileList = document.createElement("ul");
        selectedFiles.forEach((file, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
            <div class="file-info">
                <span>${file.name}</span>
                <span>${formatFileSize(file.size)}</span>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
            fileList.appendChild(listItem);
        });

        selectedFilesContainer.appendChild(fileList);
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileDisplay();
    }

    function resetFiles() {
        selectedFiles = [];
        updateFileDisplay();
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        else return (bytes / 1048576).toFixed(1) + " MB";
    }

    function uploadFiles() {
        for (let step = 1; step < 4; step++) {
            if (!validateStep(step)) {
                alert(`Please complete step ${step} before uploading`);
                goToStep(step);
                return;
            }
        }

        if (selectedFiles.length === 0) {
            alert("Please select files to upload");
            return;
        }

        const uploadData = {
            departments: selectedDepartments,
            system: selectedSystem ? selectedSystem.value : null,
            category: selectedCategory ? selectedCategory.value : null,
            files: selectedFiles,
        };

        console.log("Preparing to upload:", uploadData);

        const formData = new FormData();
        formData.append("departments", JSON.stringify(uploadData.departments));
        formData.append("system", uploadData.system);
        formData.append("category", uploadData.category);

        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        alert(`Uploading ${selectedFiles.length} file(s)`);

        // Uncomment and modify the following for actual upload
        // fetch('/your-upload-endpoint', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(result => {
        //     alert('Upload successful');
        //     resetFiles();
        // })
        // .catch(error => {
        //     alert('Upload failed');
        //     console.error('Error:', error);
        // });
    }

    function filterDepartments(searchTerm) {
        const departments = document.querySelectorAll(".department-list li");
        departments.forEach((dept) => {
            const text = dept.textContent.toLowerCase();
            dept.style.display = text.includes(searchTerm.toLowerCase()) ? "" : "none";
        });
    }

    // NEW JSSSSSSSSSSS

    function filterDepartmentsDivisions() {
        const input = document
            .getElementById("DepartmentsDivisionsSearch")
            .value.toLowerCase();
        const divisions = document.querySelectorAll(".division");

        divisions.forEach((division) => {
            const divisionName = division
                .querySelector(".division-header span")
                .textContent.toLowerCase();
            const departmentLabels = division.querySelectorAll(".department");
            let hasVisibleDepartment = false;

            if (divisionName.includes(input)) {
                division.style.display = "";
            } else {
                departmentLabels.forEach((label) => {
                    const departmentName = label.textContent.toLowerCase();
                    if (departmentName.includes(input)) {
                        hasVisibleDepartment = true;
                    }
                });
                division.style.display = hasVisibleDepartment ? "" : "none";
            }
        });
    }

    document.querySelectorAll(".division-header").forEach((header) => {
        header.addEventListener("click", () => {
            const activeHeader = document.querySelector(".division-header.active");
            if (activeHeader && activeHeader !== header) {
                activeHeader.classList.remove("active");
                activeHeader.nextElementSibling.classList.remove("active");
                activeHeader
                    .querySelector("i")
                    .classList.replace("fa-chevron-down", "fa-chevron-right");
            }
            header.classList.toggle("active");
            header.nextElementSibling.classList.toggle("active");
            const icon = header.querySelector("i");
            if (header.classList.contains("active")) {
                icon.classList.replace("fa-chevron-right", "fa-chevron-down");
            } else {
                icon.classList.replace("fa-chevron-down", "fa-chevron-right");
            }
        });
    });

    document.querySelectorAll(".select-all").forEach((selectAllCheckbox) => {

        selectAllCheckbox.addEventListener("change", (event) => {

            const division = event.target.closest(".division");

            const checkboxGroup = division.querySelectorAll(".department");



            checkboxGroup.forEach((checkbox) => {

                checkbox.checked = event.target.checked;

            });



            updateDivisionHeaderStyle(division);

            updateSelectedCount(division);

        });

    });

    document.querySelectorAll(".department").forEach((departmentCheckbox) => {

        departmentCheckbox.addEventListener("change", (event) => {

            updateSelectAll(event.target);

        });

    });

function updateDivisionHeaderStyle(division) {
    // Use the correct class name for the header
    const divisionHeader = division.querySelector(".step1-division-header") || division.querySelector(".step2-division-header");
    const departmentCheckboxes = division.querySelectorAll(".department");

    // Check if any department in this division is checked
    const hasSelectedDepartments = Array.from(departmentCheckboxes).some(
        (checkbox) => checkbox.checked
    );

    // Check if the divisionHeader exists before trying to set its style
    if (divisionHeader) {
        if (hasSelectedDepartments) {
            divisionHeader.style.backgroundColor = "#d5ebfe";
        } else {
            divisionHeader.style.backgroundColor = "#e9e9ef";
        }
    }
}

    function updateSelectedCount(division) {
        const selectedCountElement = division.querySelector(".selected-count");
        const departmentCheckboxes = division.querySelectorAll(".department");
        const selectedCount = Array.from(departmentCheckboxes).filter(
            (checkbox) => checkbox.checked
        ).length;
        selectedCountElement.textContent = selectedCount;

        selectedCountElement.textContent = selectedCount > 0 ? selectedCount : "";

        if (selectedCount > 0) {
            division.querySelector(".step1-division-header").classList.add("selected");
        } else {
            division.querySelector(".step1-division-header").classList.remove("selected");
        }
}




    document.querySelectorAll(".division").forEach((division) => {
        updateSelectedCount(division);
    });



    // searchable dropdown js

    function toggleStatusDropdown() {
        var dropdownContent = document.querySelector(".status-dropdown-content");
        var dropdownToggle = document.querySelector(".status-dropdown-toggle");
        var selector = document.querySelector(".status-selector");

        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
            dropdownToggle.classList.remove("open");

            selector.style.borderBottomLeftRadius = "10px";
            selector.style.borderBottomRightRadius = "10px";
            selector.style.borderBottom = "1px solid #6D6D6D";
        } else {
            dropdownContent.style.display = "block";
            dropdownToggle.classList.add("open");

            selector.style.borderBottomLeftRadius = "0";
            selector.style.borderBottomRightRadius = "0";
            selector.style.borderBottom = "none";
            document.getElementById("status-search-input").value = "";
            showAllStatusOptions();
        }
    }

    function filterStatusOptions() {
        var input, filter, div, i, txtValue;
        input = document.getElementById("status-search-input");
        filter = input.value.toUpperCase();
        div = document.querySelectorAll(".status-dropdown-list div");
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

        // Handle "All" selection
        if (selectedStatus === "All") {
            // Logic for when "All" is selected (if needed)
        }

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
        var divs = document.querySelectorAll(".status-dropdown-list div");
        divs.forEach(function (div) {
            div.style.display = "";
        });
    }

    document
        .getElementById("status-search-input")
        .addEventListener("blur", function () {
            const selector = document.querySelector(".status-selector");

            selector.style.borderBottomLeftRadius = "10px";
            selector.style.borderBottomRightRadius = "10px";

            selector.style.border = "1px solid #6D6D6D";
        });

    window.onclick = function (event) {
        const dropdownContent = document.querySelector(".status-dropdown-content");
        const selector = document.querySelector(".status-selector");

        if (
            !event.target.matches(".status-dropdown-toggle") &&
            !event.target.matches(".status-dropdown-toggle *") &&
            !event.target.matches("#status-search-input")
        ) {
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
                document.getElementById("status-search-input").value = "";
                filterStatusOptions();
                document
                    .querySelector(".status-dropdown-toggle")
                    .classList.remove("open");

                selector.style.borderBottomLeftRadius = "10px";
                selector.style.borderBottomRightRadius = "10px";
                selector.style.borderBottom = "1px solid #6D6D6D";
            }
        }
    };


    document.addEventListener("DOMContentLoaded", () => {

        document.querySelectorAll(".division").forEach((division) => {

            const selectAllCheckbox = division.querySelector('.select-all');

            const departmentCheckboxes = division.querySelectorAll('.department');


            // Set the "Select All" checkbox based on the state of department checkboxes

            const allChecked = Array.from(departmentCheckboxes).every((checkbox) => checkbox.checked);

            selectAllCheckbox.checked = allChecked;


            updateDivisionHeaderStyle(division);

            updateSelectedCount(division);

        });

    });


    // Add these functions to your Adminuploadpopup.js file

function updateSystemDivisionHeaderStyle(division) {
    if (!division) {
        console.error("No division element provided to updateSystemDivisionHeaderStyle.");
        return; // Exit if division is null
    }

    const divisionHeader = division.querySelector(".step2-division-header");
    const systemCheckboxes = division.querySelectorAll(".system");
    const selectedCountElement = division.querySelector(".selected-count-sys");

    // Check if any system in this division is checked
    const hasSelectedSystems = Array.from(systemCheckboxes).some(checkbox => checkbox.checked);

    // Log the state of the systems
    console.log(`Division: ${divisionHeader.querySelector('.division-name').textContent}`);
    console.log(`Has selected systems: ${hasSelectedSystems}`);

    // Update background color based on system selection only
    if (hasSelectedSystems) {
        divisionHeader.style.backgroundColor = "#d5ebfe"; // Set background color if any system is checked
        divisionHeader.classList.add('active');
    } else {
        divisionHeader.style.backgroundColor = "#e9e9ef"; // Reset background color if no systems are checked
        divisionHeader.classList.remove('active');
    }

    // Update selected count
    const selectedCount = Array.from(systemCheckboxes).filter(checkbox => checkbox.checked).length;
    selectedCountElement.textContent = selectedCount > 0 ? selectedCount : "";
}

    function updateSystemSelectedCount(division) {
        const selectedCountElement = division.querySelector(".selected-count");
        const systemCheckboxes = division.querySelectorAll(".system");
        const selectedCount = Array.from(systemCheckboxes).filter(
            (checkbox) => checkbox.checked
        ).length;

        selectedCountElement.textContent = selectedCount > 0 ? selectedCount : "";

        if (selectedCount > 0) {
            division.querySelector(".division-header").classList.add("selected");
        } else {
            division.querySelector(".division-header").classList.remove("selected");
        }



    }

    // Add event listeners for system checkboxes
    document.querySelectorAll(".system").forEach((systemCheckbox) => {
        systemCheckbox.addEventListener("change", (event) => {
            const division = event.target.closest(".division");
            updateSystemDivisionHeaderStyle(division);
            updateSystemSelectedCount(division);
        });
    });

    // Update "Select All" logic for systems
    document.querySelectorAll(".step-2-content .select-all").forEach((selectAllCheckbox) => {
        selectAllCheckbox.addEventListener("change", (event) => {
            const division = event.target.closest(".division");
            const checkboxGroup = division.querySelectorAll(".system");

            checkboxGroup.forEach((checkbox) => {
                checkbox.checked = event.target.checked;
            });

            updateSystemDivisionHeaderStyle(division);
            updateSystemSelectedCount(division);
        });
    });

document.addEventListener("DOMContentLoaded", () => {
    const step2Content = document.querySelector(".step-2-content");
    if (step2Content) {
        step2Content.querySelectorAll(".division1").forEach((division) => {
            updateSystemDivisionHeaderStyle(division);
        });
        attachSystemCheckboxListeners(); // Attach listeners for existing checkboxes
    }
});


    function toggleSelectAll(selectAllCheckbox) {

        const division = selectAllCheckbox.closest('.division');

        const departmentCheckboxes = division.querySelectorAll('.department');


        departmentCheckboxes.forEach((checkbox) => {

            checkbox.checked = selectAllCheckbox.checked;

            updateDivisionHeaderStyle(division);

            updateSelectedCount(division);

        });


        const departmentDiv = selectAllCheckbox.closest('.system-list');

        const systemCheckboxes = departmentDiv.querySelectorAll('.system input[type="checkbox"]');


        systemCheckboxes.forEach(checkbox => {

            checkbox.checked = selectAllCheckbox.checked; // Check or uncheck based on the Select All checkbox

        });

    }

    function updateSelectAll(departmentCheckbox) {

        const division = departmentCheckbox.closest('.division');

        const selectAllCheckbox = division.querySelector('.select-all');

        const departmentCheckboxes = division.querySelectorAll('.department');


        // Check if all department checkboxes are checked

        const allChecked = Array.from(departmentCheckboxes).every((checkbox) => checkbox.checked);

        selectAllCheckbox.checked = allChecked;


        updateDivisionHeaderStyle(division);

        updateSelectedCount(division);

    }


function fetchSystems(departmentCheckbox) {

    const departmentId = departmentCheckbox.getAttribute('data-department-id');

    const systemsContainer = document.querySelector('.step-2-content .division-container');


    if (departmentCheckbox.checked) {

        fetch(`/Upload/GetSystemsByDepartment?departmentId=${departmentId}`)

            .then(response => response.json())

            .then(systems => {

                console.log(`Fetched systems for department ID ${departmentId}:`, systems);


                // Check if a division for this department already exists

                let departmentDiv = systemsContainer.querySelector(`.division1[data-department-id="${departmentId}"]`);


                // If department div doesn't exist, create it

                if (!departmentDiv) {

                    departmentDiv = document.createElement('div');

                    departmentDiv.classList.add('division1');

                    departmentDiv.setAttribute('data-department-id', departmentId);

                    departmentDiv.innerHTML = `

                        <div class="step2-division-header" onclick="toggleDivision(this)">

                            <div>

                                <i class="fas fa-chevron-right division-name"></i>

                                <span class="division-name">${departmentCheckbox.getAttribute('data-department-name')}</span>

                            </div>

                            <span class="selected-count-sys"></span>

                        </div>

                        <div class="division-content" style="display: none;">

                            <div class="system-list" data-department-id="${departmentId}">

                                <label>

                                    <input type="checkbox" class="select-all-sys" onclick="toggleSelectAll(this)"> Select All

                                </label>

                            </div>

                        </div>

                    `;

                    systemsContainer.appendChild(departmentDiv);

                }


                const systemList = departmentDiv.querySelector('.system-list');


                if (systems.length > 0) {

                    systems.forEach(system => {

                        // Check if system already exists to prevent duplicates

                        const existingSystem = systemList.querySelector(`.system-item[data-system-id="${system.systemID}"]`);



                        if (!existingSystem) {

                            const systemDiv = document.createElement('div');

                            systemDiv.classList.add('system-item');

                            systemDiv.setAttribute('data-system-id', system.systemID);

                            systemDiv.innerHTML = `

                                <label>

                                    <input type="checkbox" class="system" data-system-id="${system.systemID}"> ${system.systemName}

                                </label>

                            `;

                            systemList.appendChild(systemDiv);

                        }

                    });


                    // Attach event listeners for the newly created system checkboxes

                    attachSystemCheckboxListeners();

                } else {

                    // If no systems, show a message

                    const noSystemsSpan = systemList.querySelector('span.no-systems');

                    if (!noSystemsSpan) {

                        const noSystemsMessage = document.createElement('span');

                        noSystemsMessage.classList.add('no-systems');

                        noSystemsMessage.textContent = 'No systems available';

                        systemList.appendChild(noSystemsMessage);

                    }

                }


                // Restore previously selected systems if any

                const selectedSystems = persistentSelectedDepartments.find(

                    dept => dept.id === departmentId

                )?.selectedSystems || [];


                selectedSystems.forEach(systemId => {

                    const systemCheckbox = systemList.querySelector(`.system[data-system-id="${systemId}"]`);

                    if (systemCheckbox) {

                        systemCheckbox.checked = true;

                    }

                });


                // Update division styling

                updateSystemDivisionHeaderStyle(departmentDiv);

            })

            .catch(error => {

                console.error('Error fetching systems:', error);

                const systemList = systemsContainer.querySelector(`.system-list[data-department-id="${departmentId}"]`);

                if (systemList) {

                    systemList.innerHTML = '<span>Error fetching systems</span>';

                }

            });

    } else {

        // Remove the department's systems when unchecked

        const departmentDiv = systemsContainer.querySelector(`.division1[data-department-id="${departmentId}"]`);

        if (departmentDiv) {

            systemsContainer.removeChild(departmentDiv);

        }

    }

}
function toggleDivision(header) {

    const divisionContent = header.nextElementSibling; // Get the corresponding division content

    const icon = header.querySelector("i"); // Get the icon for toggling


    // Toggle the display of the division content

    if (divisionContent.style.display === "block") {

        divisionContent.style.display = "none";

        icon.classList.replace("fa-chevron-down", "fa-chevron-right");

    } else {

        divisionContent.style.display = "block";

        icon.classList.replace("fa-chevron-right", "fa-chevron-down");

    }


    // Update the style based on system selections only

    const division = header.closest('.division1');

    if (division) {

        updateSystemDivisionHeaderStyle(division);

    }

}


// Ensure the toggle functionality for Step 1 uses the new class name

document.querySelectorAll(".step1-division-header").forEach((header) => {

    header.addEventListener("click", () => {

        const divisionContent = header.nextElementSibling; // Get the corresponding division content

        const icon = header.querySelector("i"); // Get the icon for toggling


        // Toggle the display of the division content

        if (divisionContent.style.display === "block") {

            divisionContent.style.display = "none";

            icon.classList.replace("fa-chevron-down", "fa-chevron-right");

        } else {

            divisionContent.style.display = "block";

            icon.classList.replace("fa-chevron-right", "fa-chevron-down");

        }

    });

});


function updateSelectedCount1(division1) {
    const selectedCountElement = division1.querySelector(".selected-count-sys"); // Use the new class name
    const systemCheckboxes = division1.querySelectorAll(".system");
    const selectedCount = Array.from(systemCheckboxes).filter(
        (checkbox) => checkbox.checked
    ).length;

    // Update the count display
    if (selectedCountElement) {
        selectedCountElement.textContent = selectedCount > 0 ? selectedCount : "";
    }

    // Update the header background color based on the selected count
    const header = division1.querySelector(".step2-division-header");
    if (header) {
        if (selectedCount > 0) {
            header.style.backgroundColor = "#d5ebfe"; // Set background color if any system is checked
        } else {
            header.style.backgroundColor = ""; // Reset background color if no systems are checked
        }
    }
}


document.querySelectorAll(".step-2-content .system").forEach((systemCheckbox) => {
    systemCheckbox.addEventListener("change", (event) => {
        const division = event.target.closest(".division1");
        console.log(`Checkbox changed: ${event.target.dataset.systemId}, Checked: ${event.target.checked}`); // Log checkbox state
        console.log("Checkbox parent hierarchy:", event.target.parentElement); // Log the immediate parent
        console.log("Division found:", division); // Log the division element

        if (division) {
            updateSystemDivisionHeaderStyle(division);
        } else {
            console.error("Division not found for the checkbox.");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {

    const step2Content = document.querySelector(".step-2-content");

    if (step2Content) {

        step2Content.querySelectorAll(".division1").forEach((division) => {

            updateSystemDivisionHeaderStyle(division);

        });

    }

});


function attachSystemCheckboxListeners() {

    document.querySelectorAll(".step-2-content .system").forEach((systemCheckbox) => {

        systemCheckbox.addEventListener("change", (event) => {

            const division = event.target.closest('.division1');

            const departmentId = division.getAttribute('data-department-id');

            const systemId = event.target.getAttribute('data-system-id');


            // Update persistent selected systems

            const departmentIndex = persistentSelectedDepartments.findIndex(

                dept => dept.id === departmentId

            );


            if (departmentIndex !== -1) {

                const selectedSystems = persistentSelectedDepartments[departmentIndex].selectedSystems;



                if (event.target.checked) {

                    if (!selectedSystems.includes(systemId)) {

                        selectedSystems.push(systemId);

                    }

                } else {

                    const systemIndex = selectedSystems.indexOf(systemId);

                    if (systemIndex !== -1) {

                        selectedSystems.splice(systemIndex, 1);

                    }

                }

            }


            // Update the division header style

            updateSystemDivisionHeaderStyle(division);

        });

    });

} 
