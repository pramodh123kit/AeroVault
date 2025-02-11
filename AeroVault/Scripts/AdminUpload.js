var selectedCategory = "All";
var filteredRows = [];
var currentPage = 1;
var rowsPerPage = 10;
var selectedSystem = "All";
var selectedDepartment = "All";

document.getElementById('SystemfileSearch').addEventListener('keyup', filterTable);
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

    currentPage = 1;
    updateTable();
    setupPagination();
}

function updateTable() {
    const rows = document.querySelectorAll(".file-table tbody tr");
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.forEach(row => {
        row.style.display = "none";
    });

    filteredRows.slice(start, end).forEach(row => {
        row.style.display = "";
    });
}
function setupPagination() {
    const totalRows = filteredRows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const paginationContainer = document.querySelector(".page-numbers");
    paginationContainer.innerHTML = "";

    const prevButton = document.querySelector(".prev");
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            setupPagination();
        }
    };

    const nextButton = document.querySelector(".next");
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            updateTable();
            setupPagination();
        }
    };

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

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
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

    currentPage = 1;
    setupPagination();
}

filterTable();
setupPagination();

window.onclick = function (event) {
    const statusDropdownContent = document.querySelector('.status-dropdown-content');
    const statusSelector = document.querySelector('.status-selector');
    const statusDropdownToggle = document.querySelector('.status-dropdown-toggle');

    const systemDropdownContent = document.querySelector('.system-dropdown-content');
    const systemSelector = document.querySelector('.system-selector');
    const systemDropdownToggle = document.querySelector('.system-dropdown-toggle');

    const categoryDropdownContent = document.querySelector('.category-dropdown-content');
    const categorySelector = document.querySelector('.category-selector');
    const categoryDropdownToggle = document.querySelector('.category-dropdown-toggle');

    function resetDropdown(dropdownContent, selector, dropdownToggle) {
        if (dropdownContent && dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            dropdownToggle.classList.remove('open');

            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }

    const isStatusDropdownToggle = event.target.closest('.status-dropdown-toggle');
    const isSystemDropdownToggle = event.target.closest('.system-dropdown-toggle');
    const isCategoryDropdownToggle = event.target.closest('.category-dropdown-toggle');

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

        document.getElementById('system-search-input').value = '';
        filtersystemOptions();
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';

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

        document.getElementById('category-search-input').value = '';
        filtercategoryOptions();
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';

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

    filterTable();
}


function showDepartmentTooltip(event, departmentNames) {
    const tooltip = document.getElementById('departmentTooltip');
    const departments = departmentNames.split(', ');

    tooltip.innerHTML = "<ul>" + departments.map(dept => `<li>${dept}</li>`).join('') + "</ul>";

    tooltip.style.display = "block";
    tooltip.style.position = "absolute";
    tooltip.style.top = `${event.clientY}px`;
    tooltip.style.left = `${event.clientX + 10}px`;


    function closeTooltipOnOutsideClick(e) {
        if (!tooltip.contains(e.target) &&
            !event.target.classList.contains('multi-departmental')) {
            tooltip.style.display = 'none';
            document.removeEventListener('click', closeTooltipOnOutsideClick);
        }
    }

    setTimeout(() => {
        document.addEventListener('click', closeTooltipOnOutsideClick);
    }, 0);

    event.stopPropagation();
}

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

    persistentSelectedDepartments = [];

    document.querySelectorAll(".department").forEach(checkbox => {
        checkbox.checked = false;
    });

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
    console.log("Attempting to view file:", fileName); 
    const overlayPdf = document.getElementById('overlay-pdf');
    const pdfFrame = document.getElementById('pdf-frame');
    const closePdfButton = document.getElementById('close-pdf-button');
    const darkOverlay = document.getElementById('dark-overlay8');
    const loadingIndicator = document.getElementById('pdf-loading-indicator');
    const fileNameDisplay = document.getElementById('file-name-display');

    fileNameDisplay.textContent = fileName;
    fileName = fileName.replace(/\.[^/.]+$/, "");

    fetch(`/Upload/FindFile?fileName=${encodeURIComponent(fileName)}&uniqueIdentifier=${encodeURIComponent(uniqueIdentifier)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.foundFileName) {
                const fileUrl = `/Upload/ViewFile?fileName=${encodeURIComponent(data.foundFileName)}`;

                loadingIndicator.style.display = 'block';
                pdfFrame.style.display = 'none';

                pdfFrame.src = fileUrl;

                pdfFrame.onload = function () {
                    loadingIndicator.style.display = 'none';
                    pdfFrame.style.display = 'block';
                };

                pdfFrame.onerror = function () {
                    loadingIndicator.style.display = 'none';
                    alert('Error loading document. Please try again.');
                };

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

    const closePdfButtonHandler = function () {
        overlayPdf.style.display = 'none';
        darkOverlay.style.display = 'none';
        pdfFrame.src = ''; 
        loadingIndicator.style.display = 'none';

        closePdfButton.removeEventListener('click', closePdfButtonHandler);
    };

    closePdfButton.addEventListener('click', closePdfButtonHandler);

    const darkOverlayHandler = function (event) {
        if (event.target === darkOverlay) {
            overlayPdf.style.display = 'none';
            darkOverlay.style.display = 'none';
            pdfFrame.src = '';
            loadingIndicator.style.display = 'none';
        }
    };

    darkOverlay.onclick = darkOverlayHandler;
}