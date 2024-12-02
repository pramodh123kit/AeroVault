// Global variables to track state
var selectedFiles = [];
var selectedDepartments = [];
var selectedSystem = null;
var selectedCategory = null;

// function validateStep(currentStep) {
//     switch(currentStep) {
//         case 1:
//             // Validate department selection
//             selectedDepartments = Array.from(document.querySelectorAll('.department-list input[type="checkbox"]:checked'))
//                 .map(checkbox => checkbox.value);
//             return selectedDepartments.length > 0;
        
//         case 2:
//             // Validate system selection
//             selectedSystem = document.querySelector('input[name="system"]:checked');
//             return selectedSystem !== null;
        
//         case 3:
//             // Validate category selection
//             selectedCategory = document.querySelector('input[name="category"]:checked');
//             return selectedCategory !== null;
        
//         case 4:
//             // Validate file selection
//             return selectedFiles.length > 0;
        
//         default:
//             return false;
//     }
// }

function goToStep(step) {
    // Validate previous step before proceeding
    const currentStep = parseInt(document.querySelector('.step.active .number').textContent);
    
    if (step > currentStep && !validateStep(currentStep)) {
        alert(`Please complete step ${currentStep} before proceeding.`);
        return;
    }

    // Remove active and completed classes from all steps
    document.querySelectorAll(".step").forEach(function (el) {
        el.classList.remove("active");
        el.classList.remove("completed");
    });

    // Add active class to the current step
    document.querySelector(".step-" + step).classList.add("active");

    // Mark previous steps as completed
    for (var i = 1; i < step; i++) {
        document.querySelector(".step-" + i).classList.add("completed");
    }

    // Update content based on the step
    var contentUpload = document.querySelector(".uploadpop-up-content");
    if (step === 1) {
        contentUpload.innerHTML = `
            <h2>Select the Departments you want to upload your files</h2>
            <div class="search-box">
                <input type="text" placeholder="Search Department" onkeyup="filterDepartments(this.value)">
            </div>
            <ul class="department-list">
                <li>
                    <div class="department">
                        <label>
                            <input type="checkbox" name="department" value="Aviation College"> 
                            Aviation College
                        </label>
                    </div>
                </li>
                <li>
                    <div class="department">
                        <label>
                            <input type="checkbox" name="department" value="Cargo"> 
                            Cargo
                        </label>
                        <div class="sub-departments">
                            <label><input type="checkbox" name="sub-department" value="Cargo Operations"> Cargo Operations</label>
                            <label><input type="checkbox" name="sub-department" value="Cargo Sales"> Cargo Sales</label>
                            <label><input type="checkbox" name="sub-department" value="Cargo Customer Service"> Cargo Customer Service</label>
                            <label><input type="checkbox" name="sub-department" value="Cargo Network Planning"> Cargo Network Planning</label>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="department">
                        <label>
                            <input type="checkbox" name="department" value="Corporate Communications"> 
                            Corporate Communications
                        </label>
                    </div>
                </li>
            </ul>
            <div class="button-container">
                <button class="next-button" onclick="goToStep(2)">Next <i class="fas fa-chevron-right"></i></button>
            </div>
        `;
    } else if (step === 2) {
        contentUpload.innerHTML = `
            <h2>Select the System you want to upload your files</h2>
            <div class="system-selection">
                <label>
                    <input type="radio" name="system" value="System1"> 
                    System 1
                </label>
                <label>
                    <input type="radio" name="system" value="System2"> 
                    System 2
                </label>
                <label>
                    <input type="radio" name="system" value="System3"> 
                    System 3
                </label>
            </div>
            <div class="button-container">
                <button class="back-button" onclick="goToStep(1)">
                    <i class="fas fa-chevron-left"></i> Back
                </button>
                <button class="next-button" onclick="goToStep(3)">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    } else if (step === 3) {
        contentUpload.innerHTML = `
            <h2>Select the Category you want to upload your files</h2>
            <div class="category-selection">
                <label>
                    <input type="radio" name="category" value="Category1"> 
                    Category 1
                </label>
                <label>
                    <input type="radio" name="category" value="Category2"> 
                    Category 2
                </label>
                <label>
                    <input type="radio" name="category" value="Category3"> 
                    Category 3
                </label>
            </div>
            <div class="button-container">
                <button class="back-button" onclick="goToStep(2)">
                    <i class="fas fa-chevron-left"></i> Back
                </button>
                <button class="next-button" onclick="goToStep(4)">
                    Next <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
    } else if (step === 4) {
        contentUpload.innerHTML = `
            <h2>Upload your files</h2>
            <div id="drop-area" class="upload-area">
                <input type="file" id="fileElem" multiple accept="*/*" onchange="handleFiles(this.files)" style="display:none">
                <label for="fileElem" class="upload-label">
                    <img src="../Assets/uploadicn.svg" alt="Upload Icon">
                    <p>Drag and drop files here or</p>
                    <button type="button" onclick="document.getElementById('fileElem').click()">Browse Files</button>
                </label>
            </div>
            <p>Selected files</p>
            <div id="selected-files" class="selected-files">
                <p>No files selected</p>
            </div>
            <div class="button-container">
                <button class="back-button" onclick="goToStep(3)">
                    <i class="fas fa-chevron-left"></i> Back
                </button>
                <button class="reset-button" onclick="resetFiles()">Reset</button>
                <button class="next-button upload-final-button" onclick="uploadFiles()">
                    Upload <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;
        
        // Add drag and drop event listeners
        let dropArea = document.getElementById('drop-area');
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        dropArea.addEventListener('drop', handleDrop, false);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    // Convert FileList to Array and add to selectedFiles
    Array.from(files).forEach(file => {
        // Check for duplicate files
        if (!selectedFiles.some(existingFile => existingFile.name === file.name)) {
            selectedFiles.push(file);
        }
    });
    updateFileDisplay();
}

//new function 

function updateFileDisplay() {
    const selectedFilesContainer = document.getElementById('selected-files');
    
    // Clear previous content
    selectedFilesContainer.innerHTML = '';
    
    if (selectedFiles.length === 0) {
        selectedFilesContainer.innerHTML = '<p>No files selected</p>';
        return;
    }
    
    // Create a list of selected files
    const fileList = document.createElement('ul');
    selectedFiles.forEach((file, index) => {
        const listItem = document.createElement('li');
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
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

function uploadFiles() {
    // Validate all previous steps
    for (let step = 1; step < 4; step++) {
        if (!validateStep(step)) {
            alert(`Please complete step ${step} before uploading`);
            goToStep(step);
            return;
        }
    }

    if (selectedFiles.length === 0) {
        alert('Please select files to upload');
        return;
    }
    
    // Prepare upload data
    const uploadData = {
        departments: selectedDepartments,
        system: selectedSystem ? selectedSystem.value : null,
        category: selectedCategory ? selectedCategory.value : null,
        files: selectedFiles
    };

    // Here you would typically implement the actual file upload logic
    console.log('Preparing to upload:', uploadData);
    
    // Example of how you might implement file upload
    const formData = new FormData();
    formData.append('departments', JSON.stringify(uploadData.departments));
    formData.append('system', uploadData.system);
    formData.append('category', uploadData.category);
    
    selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
    });

    // Simulated upload process (replace with actual AJAX/fetch call)
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
    const departments = document.querySelectorAll('.department-list li');
    departments.forEach(dept => {
        const text = dept.textContent.toLowerCase();
        dept.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
    });
}