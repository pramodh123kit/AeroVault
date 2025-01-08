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

// Global variable to track selected departments



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

    function goToStep(step) {
        const currentStep = parseInt(
            document.querySelector(".step.active .number").textContent
        );

        // Validate the current step before proceeding
        if (step > currentStep && !validateStep(currentStep)) {
            alert(`Please complete step ${currentStep} before proceeding.`);
            return;
        }

        // Save selected departments when moving to Step 2
        if (currentStep === 1) {
            saveSelectedDepartments();
        }

        // Clear inputs for forward steps
        if (step < currentStep) {
            if (step === 1) {
                // Clear selections for steps 2, 3, and 4
                selectedDepartments = [];
                document.querySelectorAll(".department").forEach(department => {
                    department.checked = false;
                });
            } else if (step === 2) {
                // Clear selections for steps 3 and 4
                selectedCategory = null;
                selectedFiles = [];
                updateFileDisplay(); // Update file display
                document.querySelectorAll('.category-selection input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
            } else if (step === 3) {
                // Clear selection for step 4
                selectedFiles = [];
                updateFileDisplay(); // Update file display
            }
        }

        // Handle the transition to Step 2
        if (step === 2) {
            const selectedDepartmentCheckboxes = document.querySelectorAll(".department:checked");
            const systemsContainer = document.querySelector('.step-2-content .division-container');
            systemsContainer.innerHTML = ''; // Clear previous systems

            selectedDepartmentCheckboxes.forEach(departmentCheckbox => {
                const departmentId = departmentCheckbox.getAttribute('data-department-id');
                const departmentName = departmentCheckbox.nextSibling.textContent.trim();

                // Create a new division for the selected department
                const departmentDiv = document.createElement('div');
                departmentDiv.classList.add('division');
                departmentDiv.innerHTML = `
                <div class="division-header">
                    <div>
                        <i class="fas fa-chevron-right division-name"></i>
                        <span class="division-name">${departmentName}</span>
                    </div>
                    <span class="selected-count"></span>
                </div>
                <div class="division-content">
                    <div class="system-list" data-department-id="${departmentId}">
                        <span>Loading systems...</span> <!-- Placeholder while loading -->
                    </div>
                </div>
            `;
                systemsContainer.appendChild(departmentDiv);

                // Fetch systems for the selected department
                fetchSystems(departmentCheckbox);
            });
        }

        // Restore selected departments when going back to Step 1
        if (step === 1) {
            restoreSelectedDepartments();
        }

        // Update the active step
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

        const divisionHeader = division.querySelector(".division-header");

        const departmentCheckboxes = division.querySelectorAll(".department");



        // Check if any department in this division is checked

        const hasSelectedDepartments = Array.from(departmentCheckboxes).some(

            (checkbox) => checkbox.checked

        );


        if (hasSelectedDepartments) {

            divisionHeader.style.backgroundColor = "#d5ebfe";

        } else {

            divisionHeader.style.backgroundColor = "#e9e9ef";

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
            division.querySelector(".division-header").classList.add("selected");
        } else {
            division.querySelector(".division-header").classList.remove("selected");
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
        const divisionHeader = division.querySelector(".division-header");
        const systemCheckboxes = division.querySelectorAll(".system");

        // Check if any system in this division is checked
        const hasSelectedSystems = Array.from(systemCheckboxes).some(
            (checkbox) => checkbox.checked
        );

        if (hasSelectedSystems) {
            divisionHeader.style.backgroundColor = "#d5ebfe";
        } else {
            divisionHeader.style.backgroundColor = "#e9e9ef";
        }
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

    // Initialize system division styles on page load for step 2
    document.addEventListener("DOMContentLoaded", () => {
        const step2Content = document.querySelector(".step-2-content");
        if (step2Content) {
            step2Content.querySelectorAll(".division").forEach((division) => {
                updateSystemDivisionHeaderStyle(division);
                updateSystemSelectedCount(division);
            });
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
                    // Clear previous systems
                    const departmentDiv = systemsContainer.querySelector(`.system-list[data-department-id="${departmentId}"]`);
                    departmentDiv.innerHTML = ''; // Clear previous content

                    if (systems.length > 0) {
                        systems.forEach(system => {
                            const systemDiv = document.createElement('div');
                            systemDiv.classList.add('system');
                            systemDiv.innerHTML = `
                            <label>
                                <input type="checkbox" class="system" data-system-id="${system.SystemID}"> ${system.SystemName}
                            </label>
                        `;
                            departmentDiv.appendChild(systemDiv);
                        });
                    } else {
                        // If no systems are available, show a message
                        departmentDiv.innerHTML = '<span>No systems available</span>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching systems:', error);
                    const departmentDiv = systemsContainer.querySelector(`.system-list[data-department-id="${departmentId}"]`);
                    departmentDiv.innerHTML = '<span>Error fetching systems</span>';
                });
        } else {
            // If unchecked, clear the systems display
            const departmentDiv = systemsContainer.querySelector(`.system-list[data-department-id="${departmentId}"]`);
            departmentDiv.innerHTML = '<span>No systems available</span>'; // Reset to default message
        }
    }




