// Global variables to store the selected category and filtered rows
var selectedCategory = "All";
var filteredRows = [];
var currentPage = 1;
var rowsPerPage = 10;
var selectedSystem = "All";
var selectedDepartment = "All";

document.getElementById('SystemfileSearch').addEventListener('keyup', filterTable);
// Function to filter the table based on the selected category
function filterTable() {
    const rows = document.querySelectorAll(".file-table tbody tr");
    const searchInput = document.getElementById('SystemfileSearch');
    const searchFilter = searchInput.value.toUpperCase();

    filteredRows = [];

    rows.forEach(row => {
        const categoryCell = row.querySelector(".category-cell");
        const systemCell = row.querySelector(".system-cell");
        const departmentCell = row.querySelector(".department-cell");
        const category = categoryCell ? categoryCell.textContent.trim() : "N/A";
        const system = systemCell ? systemCell.textContent.trim() : "N/A";
        const department = departmentCell ? departmentCell.textContent.trim() : "N/A";
        const cells = row.querySelectorAll("td");
        let matchSearch = true;

        if (searchFilter) {
            matchSearch = false;
            cells.forEach(cell => {
                if (cell.textContent.toUpperCase().indexOf(searchFilter) > -1) {
                    matchSearch = true;
                }
            });
        }

        if ((selectedCategory === "All" || category === selectedCategory) &&
            (selectedSystem === "All" || system === selectedSystem) &&
            (selectedDepartment === "All" || department === selectedDepartment) &&
            matchSearch) {
            filteredRows.push(row);
        }
    });

    currentPage = 1; // Reset to the first page after filtering
    updateTable();
    setupPagination();
}



// Modify the updateTable function to show only filtered rows
function updateTable() {
    const rows = document.querySelectorAll(".file-table tbody tr");
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Hide all rows first
    rows.forEach(row => {
        row.style.display = "none";
    });

    // Show only the filtered rows for the current page
    filteredRows.slice(start, end).forEach(row => {
        row.style.display = "";
    });
}

// Modify the setupPagination function to use filteredRows
function setupPagination() {
    const totalRows = filteredRows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginationContainer = document.querySelector(".page-numbers");
    paginationContainer.innerHTML = "";

    // Previous button
    const prevButton = document.querySelector(".prev");
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            setupPagination();
        }
    };

    // Next button
    const nextButton = document.querySelector(".next");
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
            setupPagination();
        }
    };

    // Determine the range of page numbers to show
    let startPage, endPage;
    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // Generate page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageNum = document.createElement("span");
        pageNum.className = `page-number ${i === currentPage ? "active" : ""}`;
        pageNum.textContent = i;
        pageNum.addEventListener("click", () => {
            currentPage = i;
            updateTable();
            setupPagination();
        });
        paginationContainer.appendChild(pageNum);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
        const firstPage = document.createElement("span");
        firstPage.className = "page-number";
        firstPage.textContent = "1";
        firstPage.addEventListener("click", () => {
            currentPage = 1;
            updateTable();
            setupPagination();
        });
        paginationContainer.insertBefore(firstPage, paginationContainer.firstChild);

        if (startPage > 2) {
            const startEllipsis = document.createElement("span");
            startEllipsis.className = "page-number ellipsis";
            startEllipsis.textContent = "...";
            paginationContainer.insertBefore(startEllipsis, paginationContainer.firstChild.nextSibling);
        }
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const endEllipsis = document.createElement("span");
            endEllipsis.className = "page-number ellipsis";
            endEllipsis.textContent = "...";
            paginationContainer.appendChild(endEllipsis);
        }

        const lastPage = document.createElement("span");
        lastPage.className = "page-number";
        lastPage.textContent = totalPages;
        lastPage.addEventListener("click", () => {
            currentPage = totalPages;
            updateTable();
            setupPagination();
        });
        paginationContainer.appendChild(lastPage);
    }

    // Disable/enable prev and next buttons
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

// Modify the selectcategoryOption function to filter the table
function selectcategoryOption(element) {
    selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category').textContent = selectedCategory;
    document.querySelector('.category-dropdown-content').style.display = 'none';
    document.querySelector('.category-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.category-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.category-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    // Filter the rows based on the selected category
    filterTable();
}
function filtersystemOptions() {
    const input = document.getElementById('system-search-input');
    const filter = input.value.toUpperCase();
    const systemDropdownList = document.querySelector('.system-dropdown-list');
    const systemOptions = systemDropdownList.getElementsByTagName('div');

    for (let i = 0; i < systemOptions.length; i++) {
        const option = systemOptions[i];
        const text = option.textContent || option.innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    }
}

function filtercategoryOptions() {
    const input = document.getElementById('category-search-input');
    const filter = input.value.toUpperCase();
    const categoryDropdownList = document.querySelector('.category-dropdown-list');
    const categoryOptions = categoryDropdownList.getElementsByTagName('div');

    for (let i = 0; i < categoryOptions.length; i++) {
        const option = categoryOptions[i];
        const text = option.textContent || option.innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    }
}

function filterFiles() {
    const input = document.getElementById('SystemfileSearch');
    const filter = input.value.toUpperCase();
    const rows = document.querySelectorAll(".file-table tbody tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        let match = false;

        cells.forEach(cell => {
            if (cell.textContent.toUpperCase().indexOf(filter) > -1) {
                match = true;
            }
        });

        if (match) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });

    // Update pagination after filtering
    currentPage = 1;
    setupPagination();
}

// Initial setup
filterTable();
setupPagination();

// Your existing functions below (unchanged)
// Modify the window.onclick function to handle all dropdowns
window.onclick = function (event) {
    // Status Dropdown
    const statusDropdownContent = document.querySelector('.status-dropdown-content');
    const statusSelector = document.querySelector('.status-selector');
    const statusDropdownToggle = document.querySelector('.status-dropdown-toggle');

    // System Dropdown
    const systemDropdownContent = document.querySelector('.system-dropdown-content');
    const systemSelector = document.querySelector('.system-selector');
    const systemDropdownToggle = document.querySelector('.system-dropdown-toggle');

    // Category Dropdown
    const categoryDropdownContent = document.querySelector('.category-dropdown-content');
    const categorySelector = document.querySelector('.category-selector');
    const categoryDropdownToggle = document.querySelector('.category-dropdown-toggle');

    // Function to reset a dropdown
    function resetDropdown(dropdownContent, selector, dropdownToggle) {
        if (dropdownContent && dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            dropdownToggle.classList.remove('open');

            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }

    // Check if a dropdown is being opened
    const isStatusDropdownToggle = event.target.closest('.status-dropdown-toggle');
    const isSystemDropdownToggle = event.target.closest('.system-dropdown-toggle');
    const isCategoryDropdownToggle = event.target.closest('.category-dropdown-toggle');

    // Reset other dropdowns if a new one is being opened
    if (isStatusDropdownToggle) {
        resetDropdown(systemDropdownContent, systemSelector, systemDropdownToggle);
        resetDropdown(categoryDropdownContent, categorySelector, categoryDropdownToggle);
    } else if (isSystemDropdownToggle) {
        resetDropdown(statusDropdownContent, statusSelector, statusDropdownToggle);
        resetDropdown(categoryDropdownContent, categorySelector, categoryDropdownToggle);
    } else if (isCategoryDropdownToggle) {
        resetDropdown(statusDropdownContent, statusSelector, statusDropdownToggle);
        resetDropdown(systemDropdownContent, systemSelector, systemDropdownToggle);
    }
    // Close all if clicked outside
    else if (!event.target.closest('.status-dropdown') &&
        !event.target.closest('.system-dropdown') &&
        !event.target.closest('.category-dropdown')) {
        resetDropdown(statusDropdownContent, statusSelector, statusDropdownToggle);
        resetDropdown(systemDropdownContent, systemSelector, systemDropdownToggle);
        resetDropdown(categoryDropdownContent, categorySelector, categoryDropdownToggle);
    }
};

function toggleStatusDropdown() {
    var dropdownContent = document.querySelector('.status-dropdown-content');
    var dropdownToggle = document.querySelector('.status-dropdown-toggle');
    var selector = document.querySelector('.status-selector');

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
    }
}

function selectStatusOption(element) {
    selectedDepartment = element.textContent || element.innerText;
    document.getElementById('selected-status').textContent = selectedDepartment;
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

    // Filter the rows based on the selected department
    filterTable();
}

function togglesystemDropdown() {
    var dropdownContent = document.querySelector('.system-dropdown-content');
    var dropdownToggle = document.querySelector('.system-dropdown-toggle');
    var selector = document.querySelector('.system-selector');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');

        selector.style.borderBottomLeftRadius = '10px';
        selector.style.borderBottomRightRadius = '10px';
        selector.style.borderBottom = '1px solid #6D6D6D';

        // Reset the search input and show all options
        document.getElementById('system-search-input').value = '';
        filtersystemOptions();
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';

        // Ensure all options are visible when the dropdown is opened
        const systemOptions = document.querySelectorAll('.system-dropdown-list div');
        systemOptions.forEach(option => {
            option.style.display = "";
        });
    }
}

function selectsystemOption(element) {
    selectedSystem = element.textContent || element.innerText;
    document.getElementById('selected-system').textContent = selectedSystem;

    document.querySelector('.system-dropdown-content').style.display = 'none';
    document.querySelector('.system-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.system-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.system-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    // Filter the rows based on the selected system
    filterTable();
}

function togglecategoryDropdown() {
    var dropdownContent = document.querySelector('.category-dropdown-content');
    var dropdownToggle = document.querySelector('.category-dropdown-toggle');
    var selector = document.querySelector('.category-selector');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');

        selector.style.borderBottomLeftRadius = '10px';
        selector.style.borderBottomRightRadius = '10px';
        selector.style.borderBottom = '1px solid #6D6D6D';

        // Reset the search input and show all options
        document.getElementById('category-search-input').value = '';
        filtercategoryOptions();
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';

        // Ensure all options are visible when the dropdown is opened
        const categoryOptions = document.querySelectorAll('.category-dropdown-list div');
        categoryOptions.forEach(option => {
            option.style.display = "";
        });
    }
}

function selectcategoryOption(element) {
    selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category').textContent = selectedCategory;
    document.querySelector('.category-dropdown-content').style.display = 'none';
    document.querySelector('.category-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.category-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.category-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    // Filter the rows based on the selected category
    filterTable();
}

// Your existing functions continue below...

function showDepartmentTooltip(event, departmentNames) {
    const tooltip = document.getElementById('departmentTooltip');
    const departments = departmentNames.split(', ');

    // Populate the tooltip with department names
    tooltip.innerHTML = "<ul>" + departments.map(dept => `<li>${dept}</li>`).join('') + "</ul>";

    // Position the tooltip
    tooltip.style.display = "block";
    tooltip.style.position = "absolute";
    tooltip.style.top = `${event.clientY}px`;
    tooltip.style.left = `${event.clientX + 10}px`; // Adjust position as needed

    // Add click event listener to document to close tooltip
    function closeTooltipOnOutsideClick(e) {
        // Check if the click is outside the tooltip and not on the multi-departmental element
        if (!tooltip.contains(e.target) &&
            !event.target.classList.contains('multi-departmental')) {
            tooltip.style.display = 'none';
            // Remove the event listener after closing
            document.removeEventListener('click', closeTooltipOnOutsideClick);
        }
    }

    // Add a small delay to prevent immediate closure
    setTimeout(() => {
        document.addEventListener('click', closeTooltipOnOutsideClick);
    }, 0);

    // Stop the original event from propagating
    event.stopPropagation();
}

// Optional: Remove the separate click event listener if you're using the above function
document.addEventListener('click', function (event) {
    const tooltip = document.getElementById('departmentTooltip');

    if (tooltip &&
        tooltip.style.display === 'block' &&
        !tooltip.contains(event.target) &&
        !event.target.classList.contains('multi-departmental')) {
        tooltip.style.display = 'none';
    }
});

function fileEditopenPopup8() {
    document.getElementById("dark-overlay8").style.display = "block";
    document.getElementById("editfile-popup8").style.display = "block";

    goToStep(1);
}

function fileEditClosePopup8() {
    document.getElementById("dark-overlay8").style.display = "none";
    document.getElementById("editfile-popup8").style.display = "none";

    // Reset persistent selections
    persistentSelectedDepartments = [];

    // Uncheck all department checkboxes
    document.querySelectorAll(".department").forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset division styles
    document.querySelectorAll(".division").forEach(division => {
        updateDivisionHeaderStyle(division);
        updateSelectedCount(division);
    });
}

document.querySelectorAll(".upload-btn").forEach(function (icon) {
    icon.onclick = fileEditopenPopup8;
});

document.getElementById("close-logout8").onclick = fileEditClosePopup8;

function viewFile(fileName, uniqueIdentifier) {
    console.log("Attempting to view file:", fileName); // Log the file name
    const overlayPdf = document.getElementById('overlay-pdf');
    const pdfFrame = document.getElementById('pdf-frame');
    const closePdfButton = document.getElementById('close-pdf-button');
    const darkOverlay = document.getElementById('dark-overlay8');
    const loadingIndicator = document.getElementById('pdf-loading-indicator');

    // Remove file extension if present
    fileName = fileName.replace(/\.[^/.]+$/, "");

    // Find the file with the correct extension
    fetch(`/Upload/FindFile?fileName=${encodeURIComponent(fileName)}&uniqueIdentifier=${encodeURIComponent(uniqueIdentifier)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.foundFileName) {
                // Construct the URL to view the file
                const fileUrl = `/Upload/ViewFile?fileName=${encodeURIComponent(data.foundFileName)}`;

                // Show loading indicator
                loadingIndicator.style.display = 'block';
                pdfFrame.style.display = 'none';

                // Set the iframe source
                pdfFrame.src = fileUrl;

                // Handle iframe load
                pdfFrame.onload = function () {
                    loadingIndicator.style.display = 'none';
                    pdfFrame.style.display = 'block';
                };

                // Handle iframe error
                pdfFrame.onerror = function () {
                    loadingIndicator.style.display = 'none';
                    alert('Error loading document. Please try again.');
                };

                // Show the overlay and dark background
                overlayPdf.style.display = 'flex';
                darkOverlay.style.display = 'block';
            } else {
                alert('File not found. Please check the file name.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while trying to view the file.');
        });

    // Close button functionality
    const closePdfButtonHandler = function () {
        overlayPdf.style.display = 'none';
        darkOverlay.style.display = 'none';
        pdfFrame.src = ''; // Clear the source
        loadingIndicator.style.display = 'none';

        // Remove the event listener to prevent multiple bindings
        closePdfButton.removeEventListener('click', closePdfButtonHandler);
    };

    // Add event listener to close button
    closePdfButton.addEventListener('click', closePdfButtonHandler);

    // Optional: Close when clicking outside the PDF viewer
    const darkOverlayHandler = function (event) {
        if (event.target === darkOverlay) {
            overlayPdf.style.display = 'none';
            darkOverlay.style.display = 'none';
            pdfFrame.src = ''; // Clear the source
            loadingIndicator.style.display = 'none';
        }
    };

    darkOverlay.onclick = darkOverlayHandler;
}