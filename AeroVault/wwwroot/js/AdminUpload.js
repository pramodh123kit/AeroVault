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
    setupPagination();
    setupDepartmentPopup();
    setupFilters();
    updateTable();

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
