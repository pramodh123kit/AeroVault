function showDepartmentList() {
    document.getElementById("department-list").style.display = "block";
}


function filterDepartments() {
    let input = document.getElementById("search-department");
    let filter = input.value.toLowerCase();
    let departmentList = document.getElementById("department-list");
    let items = departmentList.getElementsByTagName("div");

    for (let i = 0; i < items.length; i++) {
        let txtValue = items[i].textContent || items[i].innerText;
        items[i].style.display = txtValue.toLowerCase().indexOf(filter) > -1 ? "" : "none";
    }
}

function selectDepartment(element) {
    document.getElementById("search-department").value = element.textContent;
    document.getElementById("department-list").style.display = "none";
}
function filterUploads() {
    const input = document.getElementById("system-search").value.toLowerCase();

    const items = document.querySelectorAll("#upload-list-container .upload-item");

    items.forEach(item => {
        const name = item.querySelector(".upload-name-all").textContent.toLowerCase();
        item.parentElement.style.display = name.includes(input) ? "" : "none";
    });
}
document.addEventListener("DOMContentLoaded", () => {
    // Update Document List
    const documentItems = document.querySelectorAll(".content-container.Document .item-list");
    documentItems.forEach((item, index) => {
        const titleElement = item.querySelector(".item-title");
        if (titleElement) {
            titleElement.textContent = `${index + 1}. ${titleElement.textContent}`;
        }
    });

    // Update Video List
    const videoItems = document.querySelectorAll(".content-container.Video .item-list");
    videoItems.forEach((item, index) => {
        const titleElement = item.querySelector(".item-title");
        if (titleElement) {
            titleElement.textContent = `${index + 1}. ${titleElement.textContent}`;
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const statusFilter = document.querySelector('.filter-options select:nth-of-type(1)');
    const itemList = document.querySelectorAll('.item-list');

   
    function filterItems() {
        const filterValue = statusFilter.value;

        itemList.forEach(item => {
            const iconSrc = item.querySelector('.read-icon').getAttribute('src');

            if (filterValue === "Read" && iconSrc.includes("readIcon.svg")) {
                item.style.display = "block"; // Show read items
            } else if (filterValue === "Unread" && iconSrc.includes("unread.svg")) {
                item.style.display = "block"; 
            } else if (filterValue === "All") {
                item.style.display = "block"; 
            } else {
                item.style.display = "none"; 
            }
        });
    }

    // Listen for changes in the status filter dropdown
    statusFilter.addEventListener("change", filterItems);

    // Initial filter on page load
    filterItems();
});
document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.querySelector('.search-box input');
    const itemList = document.querySelectorAll('.item-list');

    // Function to filter items based on search input
    function filterItems() {
        const searchQuery = searchBox.value.toLowerCase();

        itemList.forEach(item => {
            const itemTitleElement = item.querySelector('.item-title');
            const itemTitle = itemTitleElement.textContent.toLowerCase();

            // Check if the item title includes the search query
            if (itemTitle.includes(searchQuery)) {
                item.style.display = "block"; // Show item if it matches
            } else {
                item.style.display = "none"; // Hide item if it doesn't match
            }
        });
    }

    // Listen for input in the search box
    searchBox.addEventListener("input", filterItems);
});
document.addEventListener("DOMContentLoaded", function () {
    const uploadItems = document.querySelectorAll("#upload-list-container .upload-item");
    const titleElement = document.querySelector(".upload-title");

    uploadItems.forEach(item => {
        item.addEventListener("click", function (event) {
            // Ensure the click is not on the tooltip or its icon
            const isTooltipOrIcon = event.target.classList.contains("systemIcon") ||
                event.target.classList.contains("tooltip-des");
            if (isTooltipOrIcon) return;

            // Retrieve the item name
            const itemName = item.querySelector(".upload-name-all").childNodes[0].textContent.trim();
            const updateAllUploadsCount = () => {
                let totalVideos = 0;
                let totalDocs = 0;

                uploadItems.forEach(item => {
                    const videosCount = parseInt(item.querySelector(".upload-video b").textContent) || 0;
                    const docsCount = parseInt(item.querySelector(".upload-doc b").textContent) || 0;

                    totalVideos += videosCount;
                    totalDocs += docsCount;
                });

                // Update "All Uploads" with the total count
                const totalCount = totalVideos + totalDocs;
                allUploadsElement.textContent = `All Uploads (Recent ${totalCount})`;
            };
            // Retrieve and sum "Videos" and "Docs" values
            const videosCount = parseInt(item.querySelector(".upload-video b").textContent) || 0;
            const docsCount = parseInt(item.querySelector(".upload-doc b").textContent) || 0;
            const totalCount = videosCount + docsCount;

            // Update the title with item name and total count
            titleElement.textContent = `${itemName}`;
        });
    });

    // Tooltip hover logic
    const icons = document.querySelectorAll('.systemIcon');
    icons.forEach((icon) => {
        const tooltip = icon.nextElementSibling; // Get the sibling tooltip
        icon.addEventListener("mouseenter", () => {
            if (tooltip && tooltip.classList.contains("tooltip-des")) {
                tooltip.style.display = "block"; // Show tooltip
            }
        });

        icon.addEventListener("mouseleave", () => {
            if (tooltip && tooltip.classList.contains("tooltip-des")) {
                tooltip.style.display = "none"; // Hide tooltip
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Get video and document counts
    const videoCount = parseInt(document.querySelector(".upload-item .upload-video b").textContent, 10);
    const docCount = parseInt(document.querySelector(".upload-item .upload-doc b").textContent, 10);

    // Calculate the total count (recent count)
    const recentCount = videoCount + docCount;

    // Update the title with "All Uploads" and recent count
    document.querySelector(".upload-title").textContent = `All Uploads (Recent ${recentCount})`;
});

function selectDepartment(element) {
    document.getElementById("search-department").value = element.textContent;
    document.getElementById("department-list").style.display = "none";
    document.getElementById("selected-department").textContent = element.textContent;
}
let tooltipPersistent = false;

function updateTooltip(listName, message) {
    const tooltipText = document.getElementById('tooltip-text');
    tooltipText.textContent = message;
    showTooltip();
}

function toggleTooltipOnClick() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip.style.display === 'block' && tooltipPersistent) {
        hideTooltip();
    } else {
        showTooltip();
        tooltipPersistent = true; // Set persistent to true on click
    }
}

function showTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'block';
    tooltipPersistent = false; // Set to false to allow hover behavior
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltipPersistent) { // Only hide if not in persistent mode
        tooltip.style.display = 'none';
    }
}

function forceHideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
    tooltipPersistent = false; // Reset persistent mode
}




// Select all the icons with the class "systemIcon"
const icons = document.querySelectorAll('.systemIcon');

// Add hover event listeners to each icon
icons.forEach((icon) => {
    // Show tooltip on mouseenter
    icon.addEventListener('mouseenter', () => {
        const tooltip = icon.nextElementSibling; // Get the tooltip element (sibling of the icon)
        if (tooltip && tooltip.classList.contains('tooltip-des')) {
            tooltip.style.display = 'block'; // Show the tooltip
        }
    });

    // Hide tooltip on mouseleave
    icon.addEventListener('mouseleave', () => {
        const tooltip = icon.nextElementSibling; // Get the tooltip element (sibling of the icon)
        if (tooltip && tooltip.classList.contains('tooltip-des')) {
            tooltip.style.display = 'none'; // Hide the tooltip
        }
    });
});



// Get all system icons


function showDocuments() {
    document.getElementById("documentsSection").style.display = "block";
    document.getElementById("videosSection").style.display = "none";

    // Set active button style
    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-container button:first-child").classList.add("active");
}

function showVideos() {
    document.getElementById("documentsSection").style.display = "none";
    document.getElementById("videosSection").style.display = "block";

    // Set active button style
    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-container button:last-child").classList.add("active");
}

// Show documents section by default on page load
document.addEventListener("DOMContentLoaded", showDocuments);

function showImage() {
    document.getElementById("popup-image-container").style.display = "block";
}

function closeImagePopup() {
    document.getElementById("popup-image-container").style.display = "none";
}
document.getElementById("search-input").addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase(); // Convert search input to lowercase
    const items = document.querySelectorAll(".item-list"); // Select all list items

    items.forEach(item => {
        const title = item.querySelector(".item-title").textContent.toLowerCase(); // Get item title
        const meta = item.querySelector(".item-meta").textContent.toLowerCase();   // Get item meta

        // Check if search query matches the title or meta
        if (title.includes(searchQuery) || meta.includes(searchQuery)) {
            item.style.display = ""; // Keep item visible (default display)
        } else {
            item.style.display = "none"; // Hide item if no match
        }
    });
});
function resetFilters(sectionId) {
    // Get the section to reset (Documents or Videos)
    const section = document.getElementById(sectionId);

    // Reset all dropdowns within the section
    const dropdowns = section.querySelectorAll("select");
    dropdowns.forEach(dropdown => {
        dropdown.selectedIndex = 0; // Reset to the first option (default)
    });

    // Clear all search boxes within the section
    const searchInputs = section.querySelectorAll("input[type='text']");
    searchInputs.forEach(input => {
        input.value = ""; // Clear the input field
    });
}

function showDocuments() {
    // Show the documents section and hide the videos section
    document.getElementById("documentsSection").style.display = "block";
    document.getElementById("videosSection").style.display = "none";

    // Reset filters for the documents section
    resetFilters("documentsSection");

    // Update button states
    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button.video-btn").classList.remove("active");
    document.querySelector(".tab-button:nth-child(1)").classList.add("active");
}

function showVideos() {
    // Show the videos section and hide the documents section
    document.getElementById("documentsSection").style.display = "none";
    document.getElementById("videosSection").style.display = "block";

    // Reset filters for the videos section
    resetFilters("videosSection");

    // Update button states
    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button.video-btn").classList.add("active");
}
function resetFilters(sectionId) {
    // Get the section to reset (Documents or Videos)
    const section = document.getElementById(sectionId);

    // Reset all dropdowns within the section
    const dropdowns = section.querySelectorAll("select");
    dropdowns.forEach(dropdown => {
        dropdown.selectedIndex = 0; // Reset to the first option (default)
    });

    // Clear all search boxes within the section
    const searchInputs = section.querySelectorAll("input[type='text']");
    searchInputs.forEach(input => {
        input.value = ""; // Clear the input field
    });

    // Show all items in the list
    const items = section.querySelectorAll(".item-list");
    items.forEach(item => {
        item.style.display = "block"; // Make sure all items are visible
    });
}

function showDocuments() {
    // Show the documents section and hide the videos section
    document.getElementById("documentsSection").style.display = "block";
    document.getElementById("videosSection").style.display = "none";

    // Reset filters for the documents section
    resetFilters("documentsSection");

    // Update button states
    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button:nth-child(1)").classList.add("active");
}

function showVideos() {
    // Show the videos section and hide the documents section
    document.getElementById("videosSection").style.display = "block";
    document.getElementById("documentsSection").style.display = "none";

    // Reset filters for the videos section
    resetFilters("videosSection");

    // Update button states
    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button.video-btn").classList.add("active");
}
document.addEventListener("DOMContentLoaded", function () {
    const statusFilter = document.querySelector('.filter-options-video select:nth-of-type(1)');
    const itemList = document.querySelectorAll('.item-list');


    function filterItems() {
        const filterValue = statusFilter.value;

        itemList.forEach(item => {
            const iconSrc = item.querySelector('.read-icon').getAttribute('src');

            if (filterValue === "Read" && iconSrc.includes("readIcon.svg")) {
                item.style.display = "block"; // Show read items
            } else if (filterValue === "Unread" && iconSrc.includes("unread.svg")) {
                item.style.display = "block";
            } else if (filterValue === "All") {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }

    // Listen for changes in the status filter dropdown
    statusFilter.addEventListener("change", filterItems);

    // Initial filter on page load
    filterItems();
});

document.addEventListener("DOMContentLoaded", () => {
    // Get the dropdown filter for categories
    const categoryDropdown = document.querySelector(".filter-options select:nth-child(2)"); // Target the second dropdown

    categoryDropdown.addEventListener("change", function () {
        const selectedCategory = this.value; // Get the selected category
        const itemList = document.querySelectorAll("#documentsSection .item-list"); // Get all items in the documents section

        itemList.forEach(item => {
            const itemCategory = item.querySelector(".item-meta").textContent.trim(); // Get the category of the item

            if (selectedCategory === "All Categories") {
                // Show all items
                item.style.display = "block";
            } else if (itemCategory === selectedCategory) {
                // Show items matching the selected category
                item.style.display = "block";
            } else {
                // Hide items not matching the selected category
                item.style.display = "none";
            }
        });
    });
});
