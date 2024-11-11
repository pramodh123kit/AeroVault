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
    const itemLists = document.querySelectorAll(".item-list");

    itemLists.forEach((item, index) => {
        const titleElement = item.querySelector(".item-title");
        if (titleElement) {
            titleElement.textContent = `${index + 1}. ${titleElement.textContent}`;
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const statusFilter = document.querySelector('.filter-options select:nth-of-type(1)');
    const itemList = document.querySelectorAll('.item-list');

    // Function to filter items based on the selected status
    function filterItems() {
        const filterValue = statusFilter.value;

        itemList.forEach(item => {
            const iconSrc = item.querySelector('.read-icon').getAttribute('src');

            if (filterValue === "Read" && iconSrc.includes("readIcon.svg")) {
                item.style.display = "block"; // Show read items
            } else if (filterValue === "Unread" && iconSrc.includes("unread.svg")) {
                item.style.display = "block"; // Show unread items
            } else if (filterValue === "All") {
                item.style.display = "block"; // Show both read and unread items
            } else {
                item.style.display = "none"; // Hide items that don't match the filter
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
        item.addEventListener("click", function () {
            const itemName = item.querySelector(".upload-name-all").textContent.trim();

            // Retrieve and sum "Videos" and "Docs" values
            const videosCount = parseInt(item.querySelector(".upload-video b").textContent) || 0;
            const docsCount = parseInt(item.querySelector(".upload-doc b").textContent) || 0;
            const totalCount = videosCount + docsCount;

            // Update the title with item name and total count
            titleElement.textContent = `${itemName} (Recent ${totalCount})`;
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