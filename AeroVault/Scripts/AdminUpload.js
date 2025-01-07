// Modify the window.onclick function to handle all dropdowns
// For AdminUpload.js
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
    function resetDropdown(dropdownContent, selector, dropdownToggle, searchInput) {
        if (dropdownContent && dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            dropdownToggle.classList.remove('open');

            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';

            if (searchInput) {
                searchInput.value = '';
                // Call the respective filter function
                if (searchInput.id === 'status-search-input') filterStatusOptions();
                if (searchInput.id === 'system-search-input') filtersystemOptions();
                if (searchInput.id === 'category-search-input') filtercategoryOptions();
            }
        }
    }

    // Check if a dropdown is being opened
    const isStatusDropdownToggle = event.target.closest('.status-dropdown-toggle');
    const isSystemDropdownToggle = event.target.closest('.system-dropdown-toggle');
    const isCategoryDropdownToggle = event.target.closest('.category-dropdown-toggle');

    // Reset other dropdowns if a new one is being opened
    if (isStatusDropdownToggle) {
        resetDropdown(systemDropdownContent, systemSelector, systemDropdownToggle, document.getElementById('system-search-input'));
        resetDropdown(categoryDropdownContent, categorySelector, categoryDropdownToggle, document.getElementById('category-search-input'));
    } else if (isSystemDropdownToggle) {
        resetDropdown(statusDropdownContent, statusSelector, statusDropdownToggle, document.getElementById('status-search-input'));
        resetDropdown(categoryDropdownContent, categorySelector, categoryDropdownToggle, document.getElementById('category-search-input'));
    } else if (isCategoryDropdownToggle) {
        resetDropdown(statusDropdownContent, statusSelector, statusDropdownToggle, document.getElementById('status-search-input'));
        resetDropdown(systemDropdownContent, systemSelector, systemDropdownToggle, document.getElementById('system-search-input'));
    }
    // Close all if clicked outside
    else if (!event.target.closest('.status-dropdown') &&
        !event.target.closest('.system-dropdown') &&
        !event.target.closest('.category-dropdown')) {
        resetDropdown(statusDropdownContent, statusSelector, statusDropdownToggle, document.getElementById('status-search-input'));
        resetDropdown(systemDropdownContent, systemSelector, systemDropdownToggle, document.getElementById('system-search-input'));
        resetDropdown(categoryDropdownContent, categorySelector, categoryDropdownToggle, document.getElementById('category-search-input'));
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
        document.getElementById('status-search-input').value = '';
        showAllStatusOptions();
    }
}

function filterStatusOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('status-search-input');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.status-dropdown-list div');
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
    var divs = document.querySelectorAll('.status-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('status-search-input').addEventListener('blur', function () {
    const selector = document.querySelector('.status-selector');

    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';

    selector.style.border = '1px solid #6D6D6D';
});










//////


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
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';
        document.getElementById('system-search-input').value = '';
        showAllsystemOptions();
    }
}

function filtersystemOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('system-search-input');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.system-dropdown-list div');
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

function selectsystemOption(element) {
    var selectedsystem = element.textContent || element.innerText;
    document.getElementById('selected-system').textContent = selectedsystem;

    // Handle "All" selection
    if (selectedsystem === "All") {
        // Logic for when "All" is selected (if needed)
    }

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
}

function showAllsystemOptions() {
    var divs = document.querySelectorAll('.system-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('system-search-input').addEventListener('blur', function () {
    const selector = document.querySelector('.system-selector');

    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';

    selector.style.border = '1px solid #6D6D6D';
});






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
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        selector.style.borderBottomLeftRadius = '0';
        selector.style.borderBottomRightRadius = '0';
        selector.style.borderBottom = 'none';
        document.getElementById('category-search-input').value = '';
        showAllcategoryOptions();
    }
}

function filtercategoryOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('category-search-input');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.category-dropdown-list div');
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

function selectcategoryOption(element) {
    var selectedcategory = element.textContent || element.innerText;
    document.getElementById('selected-category').textContent = selectedcategory;
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
}

function showAllcategoryOptions() {
    var divs = document.querySelectorAll('.category-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('category-search-input').addEventListener('blur', function () {
    const selector = document.querySelector('.category-selector');

    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';

    selector.style.border = '1px solid #6D6D6D';
});













function setupPagination() {
  const totalRows = document.querySelectorAll(".file-table tbody tr").length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const paginationContainer = document.querySelector(".page-numbers");
  paginationContainer.innerHTML = "";

  // Previous button
  document.querySelector(".prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
      updatePaginationUI();
    }
  });

  // Next button
  document.querySelector(".next").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
      updatePaginationUI();
    }
  });

  // Generate page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      const pageNum = document.createElement("span");
      pageNum.className = `page-number ${i === currentPage ? "active" : ""}`;
      pageNum.textContent = i;
      pageNum.addEventListener("click", () => {
        currentPage = i;
        updateTable();
        updatePaginationUI();
      });
      paginationContainer.appendChild(pageNum);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "page-number";
      ellipsis.textContent = "...";
      paginationContainer.appendChild(ellipsis);
    }
  }
}

// Search functionality
function filterFiles() {
  const searchInput = document.getElementById("SystemfileSearch");
  const filter = searchInput.value.toLowerCase();
  const rows = document.querySelectorAll(".file-table tbody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });

  // Reset pagination after search
  currentPage = 1;
  setupPagination();
  updateTable();
}
// Variables
var currentPage = 1;
var rowsPerPage = 10;

function updateTable() {
  const rows = document.querySelectorAll(".file-table tbody tr");
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  rows.forEach((row, index) => {
    row.style.display = index >= start && index < end ? "" : "none";
  });
}
(function () {
  // Popup functions
  function fileEditopenPopup8() {
    document.getElementById("dark-overlay8").style.display = "block";
    document.getElementById("editfile-popup8").style.display = "block";
    goToStep(1);
  }

  function fileEditClosePopup8() {
    document.getElementById("dark-overlay8").style.display = "none";
    document.getElementById("editfile-popup8").style.display = "none";
  }

  document.querySelectorAll(".upload-btn").forEach(function (icon) {
    icon.onclick = fileEditopenPopup8;
  });

  document.getElementById("close-logout8").onclick = fileEditClosePopup8;

  // Pagination functions

  // Department popup
  function setupDepartmentPopup() {
    const departmentCells = document.querySelectorAll(".department-cell");
    const popup = document.getElementById("departmentPopup");
    const departmentList = [
        "Information Technology",
        "Human Resources",
        "Ground Handling",
        "Finance",
        "Engineering & Maintenance",
        "Cargo"
    ];

    departmentCells.forEach((cell) => {
        if (cell.textContent.trim() === "Multiple Departments") {
            cell.addEventListener("click", (e) => {
                const rect = cell.getBoundingClientRect();
                popup.style.top = `${rect.bottom + window.scrollY}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
                popup.style.display = "block";

                // Populate the popup with department names
                const ul = document.createElement("ul");
                departmentList.forEach(department => {
                    const li = document.createElement("li");
                    li.textContent = department;
                    ul.appendChild(li);
                });
                popup.innerHTML = ""; // Clear previous content
                popup.appendChild(ul);
                e.stopPropagation();
            });
        }
    });

    // Close popup when clicking outside
    document.addEventListener("click", (e) => {
        if (!popup.contains(e.target) && !Array.from(departmentCells).includes(e.target)) {
            popup.style.display = "none";
        }
    });
}

  // Dropdown filters
  function setupFilters() {
    const dropdowns = document.querySelectorAll(".filter-dropdown");

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("change", () => {
        applyFilters();
      });
    });
  }

  function applyFilters() {
    const department = document.querySelector('[name="department"]').value;
    const system = document.querySelector('[name="system"]').value;
    const category = document.querySelector('[name="category"]').value;

    const rows = document.querySelectorAll(".file-table tbody tr");

    rows.forEach((row) => {
      const departmentMatch =
        department === "all" ||
        row.querySelector(".department-cell").textContent.includes(department);
      const systemMatch =
        system === "all" ||
        row.querySelector(".system-cell").textContent.includes(system);
      const categoryMatch =
        category === "all" ||
        row.querySelector(".category-cell").textContent.includes(category);

      row.style.display =
        departmentMatch && systemMatch && categoryMatch ? "" : "none";
    });

    // Reset pagination after filtering
    currentPage = 1;
    setupPagination();
    updateTable();
  }

  // Initialize everything
    document.addEventListener("DOMContentLoaded", () => {
        updateTable(); // Ensure the table is updated first
        setupPagination(); // Then set up pagination
        setupDepartmentPopup();
        setupFilters();

        // Add view functionality to eye icons
        document.querySelectorAll(".view-icon").forEach((icon) => {
            icon.addEventListener("click", () => {
                // Implement view functionality here
                console.log(
                    "Viewing file:",
                    icon.closest("tr").querySelector("td:first-child").textContent
                );
            });
        });
    });
})();


document.querySelectorAll(".Multi_Dp").forEach(function (element) {
    element.addEventListener("click", function (e) {
        const tooltip = document.querySelector(".tooltip");
        const tooltipContent = this.getAttribute("data-tooltip"); // Get the tooltip content from the data attribute
        tooltip.innerHTML = tooltipContent; // Set the tooltip content
        const rect = this.getBoundingClientRect(); // Get the position of the clicked element

        // Set the position of the tooltip
        tooltip.style.top = `${rect.bottom + window.scrollY}px`; // Position below the element
        tooltip.style.left = `${rect.left + window.scrollX}px`; // Align with the left of the element
        tooltip.style.display = "block"; // Show the tooltip

        e.stopPropagation(); // Prevent the click event from bubbling up
    });
});

// Hide the tooltip when clicking outside
document.addEventListener("click", function () {
    const tooltip = document.querySelector(".tooltip");
    tooltip.style.display = "none"; // Hide the tooltip
});