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
    const items = document.querySelectorAll("#upload-list-container .upload-list-new");

    items.forEach(item => {
        // Find the name element within the upload item
        const nameElement = item.querySelector(".upload-name-all");
        if (nameElement) { // Check if the element exists
            const name = nameElement.textContent.toLowerCase();
            // Show or hide based on the filter
            item.style.display = name.includes(input) ? "" : "none";
        } else {
            // If the name element is not found, hide the item
            item.style.display = "none";
        }
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
        const titleElement = item.querySelector(".item-title1");
        if (titleElement) {
            titleElement.textContent = `${index + 1}. ${titleElement.textContent}`;
        }
    });
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
    const searchBox1 = document.querySelector('.search-box1 input');
    const itemList1 = document.querySelectorAll('.item-list1');

    // Function to filter items based on search input
    function filterItems() {
        const searchQuery = searchBox1.value.toLowerCase();

        itemList1.forEach(item => {
            const itemTitleElement = item.querySelector('.item-title1');
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
    searchBox1.addEventListener("input", filterItems);
});














document.addEventListener("DOMContentLoaded", function () {
    const uploadItems = document.querySelectorAll("#upload-list-container .upload-item");
    const documentContainer = document.querySelector(".scrollable-item-list.content-container.Document");
    const videoContainer = document.querySelector(".scrollable-item-list.content-container.Video");

    uploadItems.forEach(item => {
        item.addEventListener("click", function (event) {
            // Ensure the click is not on the tooltip or its icon
            const isTooltipOrIcon = event.target.classList.contains("systemIcon") ||
                event.target.classList.contains("tooltip-des");
            if (isTooltipOrIcon) return;

            // Retrieve the system name
            const systemName = item.querySelector(".upload-name-all").childNodes[0].textContent.trim();

            // Find the system ID (you might need to modify this based on how you store system IDs)
            const systemId = item.closest('.upload-list-new').getAttribute('data-system-id');

            // Fetch files for the selected system
            fetch(`/UserFileRepository/GetFilesBySystem?systemId=${systemId}`)
                .then(response => response.json())
                .then(files => {
                    // Clear existing files
                    documentContainer.innerHTML = '';
                    videoContainer.innerHTML = '';

                    // Count documents and videos
                    let documentCount = 0;
                    let videoCount = 0;

                    // Populate files
                    files.forEach(file => {
                        const itemList = document.createElement('div');
                        itemList.className = 'item-list';

                        let containerToUse, titleClass;
                        if (file.fileType.toLowerCase() === 'document') {
                            containerToUse = documentContainer;
                            titleClass = 'item-title';
                            documentCount++;
                        } else if (file.fileType.toLowerCase() === 'video') {
                            containerToUse = videoContainer;
                            titleClass = 'item-title1';
                            videoCount++;
                        } else {
                            return; // Skip files that are neither documents nor videos
                        }

                        itemList.innerHTML = `
                            <div class="item-info">
                                <img class="read-icon" src="/Content/Assets/readIcon.svg" alt="read Icon" />
                                <span class="${titleClass}">${file.fileName}</span>
                                <span class="item-meta">${file.fileCategory || 'Uncategorized'}</span>
                                <span class="item-date">${new Date(file.addedDate).toLocaleDateString()}</span>
                                <button class="action-button">View</button>
                            </div>
                        `;

                        containerToUse.appendChild(itemList);
                    });

                    // Update document and video counts
                    document.querySelector('.tab-button.document-btn').textContent = `Documents (${documentCount})`;
                    document.querySelector('.tab-button.video-btn').textContent = `Videos (${videoCount})`;

                    // Update the system name in the title
                    document.querySelector(".upload-title").textContent = systemName;

                    // Update upload info for the clicked system
                    item.querySelector('.upload-video b').textContent = videoCount;
                    item.querySelector('.upload-doc b').textContent = documentCount;

                    // Ensure the document section is shown
                    showDocuments();
                })
                .catch(error => {
                    console.error('Error fetching files:', error);
                });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Get video and document counts
    const videoCount = parseInt(document.querySelector(".upload-item .upload-video b").textContent, 10);
    const docCount = parseInt(document.querySelector(".upload-item .upload-doc b").textContent, 10);

    // Calculate the total count (recent count)
    const recentCount = videoCount + docCount;

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

















function toggleCustomDropdown() {
    var dropdownContent = document.querySelector('.custom-dropdown-content');
    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    var selector = document.querySelector('.custom-selector');

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
        document.getElementById('custom-search-input').value = '';
        showAllCustomOptions();
    }
}

function filterCustomOptions() {
    var input = document.getElementById('custom-search-input');
    var filter = input.value.toLowerCase();
    var div = document.querySelectorAll('.custom-dropdown-list div');
    // Filter the dropdown options
    div.forEach(function (item) {
        var txtValue = item.textContent || item.innerText;
        item.style.display = txtValue.toLowerCase().indexOf(filter) > -1 ? "" : "none";
    });
    // Call the function to filter the upload list
    filterUploadList(filter);
}






function filterUploadList(filter) {
    const uploadItems = document.querySelectorAll("#upload-list-container .upload-list-new");

    uploadItems.forEach(item => {
        // Find the name element within the upload item
        const nameElement = item.querySelector(".upload-name-all");
        if (nameElement) { // Check if the element exists
            const name = nameElement.textContent.toLowerCase();
            // Show or hide based on the filter
            item.style.display = name.includes(filter) ? "" : "none";
        } else {
            // If the name element is not found, you can choose to hide the item or keep it visible
            item.style.display = "none"; // Hide the item if the name element is not found
        }
    });
}

//function selectCustomOption(element) {
//    var selectedDepartment = element.textContent || element.innerText;
//    var selectedOption = document.getElementById('selected-option');
//    var selectedDepartmentElement = document.getElementById('selected-department');

//    // Update dropdown display
//    selectedOption.textContent = selectedDepartment;
//    selectedDepartmentElement.textContent = selectedDepartment;

//    // Close dropdown
//    document.querySelector('.custom-dropdown-content').style.display = 'none';
//    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

//    // Find the department ID
//    var departmentId = element.getAttribute('data-department-id');

//    // AJAX call to fetch systems for the selected department
//    fetch(`/UserFileRepository/GetSystemsByDepartment?departmentId=${departmentId}`)
//        .then(response => response.json())
//        .then(systems => {
//            // Clear existing systems
//            var uploadListContainer = document.getElementById('upload-list-container');
//            uploadListContainer.innerHTML = '';

//            // Populate systems
//            if (systems && systems.length > 0) {
//                systems.forEach(system => {
//                    var systemDiv = document.createElement('div');
//                    systemDiv.className = 'upload-list-new';
//                    systemDiv.id = system.systemName;
//                    systemDiv.innerHTML = `
//                        <div class="upload-item">
//                            <div class="upload-name-all name">
//                                ${system.systemName}
//                                <img class="systemIcon" src="/Content/Assets/systemIcon.svg" alt="System Icon" />
//                                <div class="tooltip-des">${system.description}</div>
//                            </div>
//                            <div class="upload-info">
//                                <span class="upload-video">Videos: <b>0</b></span>
//                                <span class="upload-doc">Docs: <b>0</b></span>
//                            </div>
//                        </div>
//                    `;
//                    uploadListContainer.appendChild(systemDiv);
//                });
//            } else {
//                uploadListContainer.innerHTML = `
//                    <div class="upload-list-new">
//                        <div class="upload-item">
//                            <div class="upload-name-all name">
//                                No Systems Available
//                            </div>
//                        </div>
//                    </div>
//                `;
//            }
//        })
//        .catch(error => {
//            console.error('Error fetching systems:', error);
//        });
//}

document.addEventListener("DOMContentLoaded", function () {
    var defaultDepartment = document.getElementById('selected-option').textContent;
    document.getElementById('selected-department').textContent = defaultDepartment;
});

function showAllCustomOptions() {
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

document.getElementById('custom-search-input').addEventListener('blur', function () {
    const selector = document.querySelector('.custom-selector');

    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';

    selector.style.border = '1px solid #6D6D6D';
});


document.addEventListener("DOMContentLoaded", function () {
    const customSearchInput = document.getElementById('custom-search-input');
    if (customSearchInput) {
        customSearchInput.addEventListener('blur', function () {
            const selector = document.querySelector('.custom-selector');
            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.border = '1px solid #6D6D6D';
        });
    }
});


window.onclick = function (event) {
    const dropdownContent = document.querySelector('.filter-category-status-dropdown-content');
    const selector = document.querySelector('.filter-category-status-selector');
    const customDropdownContent = document.querySelector('.custom-dropdown-content');
    const customSelector = document.querySelector('.custom-selector');
    const dropdownListContainer = document.querySelector('.category-dropdown-list-container');
    const dropdownButton = document.querySelector('.category-dropdown-button');
    const dropdownSelector = document.querySelector('.category-dropdown-selector');



    const overlay = document.getElementById('pdf-overlay');
    if (event.target === overlay) {
        overlay.style.display = 'none';
        document.getElementById('pdf-frame').src = ''; // Clear the src to stop the PDF from loading
    }



    // Check if the click is outside the filter-category dropdown
    if (!event.target.matches('.filter-category-status-dropdown-toggle') && !event.target.matches('.filter-category-status-dropdown-toggle *')) {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            document.querySelector('.filter-category-status-dropdown-toggle').classList.remove('open');
            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }

    // Check if the click is outside the custom dropdown
    if (!event.target.matches('.custom-dropdown-toggle') && !event.target.matches('.custom-dropdown-toggle *') && !event.target.matches('#custom-search-input')) {
        if (customDropdownContent.style.display === 'block') {
            customDropdownContent.style.display = 'none';
            document.querySelector('.custom-dropdown-toggle').classList.remove('open');
            customSelector.style.borderBottomLeftRadius = '10px';
            customSelector.style.borderBottomRightRadius = '10px';
            customSelector.style.borderBottom = '1px solid #6D6D6D';
        }
    }

    // Check if the click is outside the category dropdown
    if (!event.target.matches('.category-dropdown-button') && !event.target.matches('.category-dropdown-button *')) {
        if (dropdownListContainer.style.display === 'block') {
            dropdownListContainer.style.display = 'none';
            dropdownButton.classList.remove('open');
            dropdownSelector.style.borderBottomLeftRadius = '10px';
            dropdownSelector.style.borderBottomRightRadius = '10px';
            dropdownSelector.style.borderBottom = '1px solid #6D6D6D';
        }
    }








    const dropdownContent1 = document.querySelector('.filter-category-status-dropdown-content1');
    const selector1 = document.querySelector('.filter-category-status-selector1');
    const dropdownListContainer1 = document.querySelector('.category-dropdown-list-container1');
    const dropdownButton1 = document.querySelector('.category-dropdown-button1');
    const dropdownSelector1 = document.querySelector('.category-dropdown-selector1');


    // Check if the click is outside the filter-category dropdown
    if (!event.target.matches('.filter-category-status-dropdown-toggle1') && !event.target.matches('.filter-category-status-dropdown-toggle1 *')) {
        if (dropdownContent1.style.display === 'block') {
            dropdownContent1.style.display = 'none';
            document.querySelector('.filter-category-status-dropdown-toggle1').classList.remove('open');
            selector1.style.borderBottomLeftRadius = '10px';
            selector1.style.borderBottomRightRadius = '10px';
            selector1.style.borderBottom = '1px solid #6D6D6D';
        }
    }

    // Check if the click is outside the category dropdown
    if (!event.target.matches('.category-dropdown-button1') && !event.target.matches('.category-dropdown-button1 *')) {
        if (dropdownListContainer1.style.display === 'block') {
            dropdownListContainer1.style.display = 'none';
            dropdownButton1.classList.remove('open');
            dropdownSelector1.style.borderBottomLeftRadius = '10px';
            dropdownSelector1.style.borderBottomRightRadius = '10px';
            dropdownSelector1.style.borderBottom = '1px solid #6D6D6D';
        }
    }
};



document.addEventListener("DOMContentLoaded", function () {
    const uploadItems = document.querySelectorAll(".upload-list-new");
    uploadItems.forEach(item => {
        item.addEventListener("click", function () {
            uploadItems.forEach(uploadItem => {
                uploadItem.style.backgroundColor = "white";
                uploadItem.querySelector(".upload-name-all").style.fontWeight = "normal";
            });

            item.style.backgroundColor = "#CFE5F2";
            item.querySelector(".upload-name-all").style.fontWeight = "bold";

            const itemName = item.querySelector(".upload-name-all").childNodes[0].textContent.trim();
        });
    });


});








function filterCategoryToggleStatusDropdown() {
    var dropdownContent = document.querySelector('.filter-category-status-dropdown-content');
    var dropdownToggle = document.querySelector('.filter-category-status-dropdown-toggle');
    var selector = document.querySelector('.filter-category-status-selector');

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

function filterDocumentsByStatus(status) {
    const documentItems = document.querySelectorAll(".content-container.Document .item-list");

    documentItems.forEach(item => {
        const iconSrc = item.querySelector('.read-icon').getAttribute('src');

        if (status === "All (Read / Unread)") {
            item.style.display = "block"; // Show all items
        } else if (status === "Read" && iconSrc.includes("readIcon.svg")) {
            item.style.display = "block"; // Show only read items
        } else if (status === "Pending" && iconSrc.includes("unread.svg")) {
            item.style.display = "block"; // Show only pending items
        } else {
            item.style.display = "none"; // Hide other items
        }
    });
}

function filterCategorySelectStatusOption(element) {
    var selectedStatus = element.textContent || element.innerText;
    document.getElementById('filter-category-selected-status').textContent = selectedStatus;

    // Close the dropdown
    document.querySelector('.filter-category-status-dropdown-content').style.display = 'none';
    document.querySelector('.filter-category-status-dropdown-toggle').classList.remove('open');

    // Reset styles
    var selector = document.querySelector('.filter-category-status-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    // Remove active class from all options
    var divs = document.querySelectorAll('.filter-category-status-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    // Call the filtering function
    filterDocumentsByStatus(selectedStatus);
}




function toggleFilterCategoryDropdown() {

    var dropdownContent = document.querySelector('.filter-category-dropdown-content');

    var dropdownToggle = document.querySelector('.filter-category-dropdown-toggle');

    var selector = document.querySelector('.filter-category-selector');


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

        document.getElementById('filter-category-search-input').value = '';

        showAllFilterCategoryOptions();

    }

}


function filterCategoryOptions() {

    var input, filter, div, i, txtValue;

    input = document.getElementById('filter-category-search-input');

    filter = input.value.toUpperCase();

    div = document.querySelectorAll('.filter-category-dropdown-list div');

    for (i = 0; i < div.length; i++) {

        txtValue = div[i].textContent || div[i].innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {

            div[i].style.display = "";

        } else {

            div[i].style.display = "none";

        }

    }

}

function selectFilterCategoryOption(element) {

    var selectedCategory = element.textContent || element.innerText;

    document.getElementById('selected-filter-category').textContent = selectedCategory;

    document.querySelector('.filter-category-dropdown-content').style.display = 'none';

    document.querySelector('.filter-category-dropdown-toggle').classList.remove('open');


    var selector = document.querySelector('.filter-category-selector');

    selector.style.borderBottomLeftRadius = '10px';

    selector.style.borderBottomRightRadius = '10px';

    selector.style.borderBottom = '1px solid #6D6D6D';


    var divs = document.querySelectorAll('.filter-category-dropdown-list div');

    divs.forEach(function (div) {

        div.classList.remove('active');

    });

    element.classList.add('active');

}


function showAllFilterCategoryOptions() {

    var divs = document.querySelectorAll('.filter-category-dropdown-list div');

    divs.forEach(function (div) {

        div.style.display = "";

    });

}




















function toggleCategoryDropdownUnique() {
    var dropdownListContainer = document.querySelector('.category-dropdown-list-container');
    var dropdownButton = document.querySelector('.category-dropdown-button');
    var dropdownSelector = document.querySelector('.category-dropdown-selector');

    // Toggle dropdown visibility
    if (dropdownListContainer.style.display === 'block') {
        dropdownListContainer.style.display = 'none';
        dropdownButton.classList.remove('open');

        dropdownSelector.style.borderBottomLeftRadius = '10px';
        dropdownSelector.style.borderBottomRightRadius = '10px';
        dropdownSelector.style.borderBottom = '1px solid #6D6D6D';
    } else {
        dropdownListContainer.style.display = 'block';
        dropdownButton.classList.add('open');

        dropdownSelector.style.borderBottomLeftRadius = '0';
        dropdownSelector.style.borderBottomRightRadius = '0';
        dropdownSelector.style.borderBottom = 'none';

        // Do not reset the selected category when opening the dropdown
        showAllCategoryOptionsUnique();
    }
}


function filterDocumentsByCategory(category) {
    const documentItems = document.querySelectorAll(".content-container.Document .item-list");

    documentItems.forEach(item => {
        const categoryMeta = item.querySelector('.item-meta').textContent.trim();

        if (category === "All Categories") {
            item.style.display = "block"; // Show all items
        } else if (category === categoryMeta) {
            item.style.display = "block"; // Show only items that match the selected category
        } else {
            item.style.display = "none"; // Hide other items
        }
    });
}

function selectCategoryOptionUnique(element) {
    var selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category-unique').textContent = selectedCategory;

    // Close the dropdown
    document.querySelector('.category-dropdown-list-container').style.display = 'none';
    document.querySelector('.category-dropdown-button').classList.remove('open');

    // Reset styles
    var dropdownSelector = document.querySelector('.category-dropdown-selector');
    dropdownSelector.style.borderBottomLeftRadius = '10px';
    dropdownSelector.style.borderBottomRightRadius = '10px';
    dropdownSelector.style.borderBottom = '1px solid #6D6D6D';

    // Remove active class from all options
    var divs = document.querySelectorAll('.category-list div');
    divs.forEach(function (div) {
        div.classList.remove('active-category');
    });
    element.classList.add('active-category');

    // Call the filtering function
    filterDocumentsByCategory(selectedCategory);
}


function showAllCategoryOptionsUnique() {

    var categoryItems = document.querySelectorAll('.category-list div');

    categoryItems.forEach(function (item) {

        item.style.display = "";

    });

}
























// VIDEO I THINK 




function filterCategoryToggleStatusDropdown1() {

    var dropdownContent = document.querySelector('.filter-category-status-dropdown-content1');

    var dropdownToggle = document.querySelector('.filter-category-status-dropdown-toggle1');

    var selector = document.querySelector('.filter-category-status-selector1');


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


function toggleCategoryDropdownUnique1() {
    var dropdownListContainer = document.querySelector('.category-dropdown-list-container1');
    var dropdownButton = document.querySelector('.category-dropdown-button1');
    var dropdownSelector = document.querySelector('.category-dropdown-selector1');

    // Toggle dropdown visibility
    if (dropdownListContainer.style.display === 'block') {
        dropdownListContainer.style.display = 'none';
        dropdownButton.classList.remove('open');

        dropdownSelector.style.borderBottomLeftRadius = '10px';
        dropdownSelector.style.borderBottomRightRadius = '10px';
        dropdownSelector.style.borderBottom = '1px solid #6D6D6D';
    } else {
        dropdownListContainer.style.display = 'block';
        dropdownButton.classList.add('open');

        dropdownSelector.style.borderBottomLeftRadius = '0';
        dropdownSelector.style.borderBottomRightRadius = '0';
        dropdownSelector.style.borderBottom = 'none';

        // Do not reset the selected category when opening the dropdown
        showAllCategoryOptionsUnique();
    }
}

function filterCategorySelectStatusOption1(element) {

    var selectedStatus = element.textContent || element.innerText;

    document.getElementById('filter-category-selected-status1').textContent = selectedStatus;


    // Close the dropdown

    document.querySelector('.filter-category-status-dropdown-content1').style.display = 'none';

    document.querySelector('.filter-category-status-dropdown-toggle1').classList.remove('open');


    // Reset styles

    var selector = document.querySelector('.filter-category-status-selector1');

    selector.style.borderBottomLeftRadius = '10px';

    selector.style.borderBottomRightRadius = '10px';

    selector.style.borderBottom = '1px solid #6D6D6D';


    // Remove active class from all options

    var divs = document.querySelectorAll('.filter-category-status-dropdown-list1 div');

    divs.forEach(function (div) {

        div.classList.remove('active');

    });

    element.classList.add('active');


    // Call the filtering function

    filterVideosByStatus(selectedStatus);

}




function selectCategoryOptionUnique1(element) {
    var selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category-unique1').textContent = selectedCategory;

    // Close the dropdown
    document.querySelector('.category-dropdown-list-container1').style.display = 'none';
    document.querySelector('.category-dropdown-button1').classList.remove('open');

    // Reset styles
    var dropdownSelector = document.querySelector('.category-dropdown-selector1');
    dropdownSelector.style.borderBottomLeftRadius = '10px';
    dropdownSelector.style.borderBottomRightRadius = '10px';
    dropdownSelector.style.borderBottom = '1px solid #6D6D6D';

    // Remove active class from all options
    var divs = document.querySelectorAll('.category-list1 div');
    divs.forEach(function (div) {
        div.classList.remove('active-category');
    });
    element.classList.add('active-category');

    // Call the filtering function
    filterDocumentsByCategory(selectedCategory);
}







// VIDEO FUNCTIONS


function filterCategoryToggleStatusDropdown1() {
    var dropdownContent = document.querySelector('.filter-category-status-dropdown-content1');
    var dropdownToggle = document.querySelector('.filter-category-status-dropdown-toggle1');
    var selector = document.querySelector('.filter-category-status-selector1');

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

function filterCategorySelectStatusOption1(element) {
    var selectedStatus = element.textContent || element.innerText;
    document.getElementById('filter-category-selected-status1').textContent = selectedStatus;

    // Close the dropdown
    document.querySelector('.filter-category-status-dropdown-content1').style.display = 'none';
    document.querySelector('.filter-category-status-dropdown-toggle1').classList.remove('open');

    // Reset styles
    var selector = document.querySelector('.filter-category-status-selector1');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    // Remove active class from all options
    var divs = document.querySelectorAll('.filter-category-status-dropdown-list1 div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    // Call the filtering function
    filterVideosByStatus(selectedStatus);
}

function toggleCategoryDropdownUnique1() {

    var dropdownListContainer = document.querySelector('.category-dropdown-list-container1');

    var dropdownButton = document.querySelector('.category-dropdown-button1');

    var dropdownSelector = document.querySelector('.category-dropdown-selector1');


    // Toggle dropdown visibility

    if (dropdownListContainer.style.display === 'block') {

        dropdownListContainer.style.display = 'none';

        dropdownButton.classList.remove('open');


        dropdownSelector.style.borderBottomLeftRadius = '10px';

        dropdownSelector.style.borderBottomRightRadius = '10px';

        dropdownSelector.style.borderBottom = '1px solid #6D6D6D';

    } else {

        dropdownListContainer.style.display = 'block';

        dropdownButton.classList.add('open');


        dropdownSelector.style.borderBottomLeftRadius = '0';

        dropdownSelector.style.borderBottomRightRadius = '0';

        dropdownSelector.style.borderBottom = 'none';


        // Do not reset the selected category when opening the dropdown

        showAllCategoryOptionsUnique1();

    }

}

function selectCategoryOptionUnique1(element) {

    var selectedCategory = element.textContent || element.innerText;

    document.getElementById('selected-category-unique1').textContent = selectedCategory;


    // Close the dropdown

    document.querySelector('.category-dropdown-list-container1').style.display = 'none';

    document.querySelector('.category-dropdown-button1').classList.remove('open');


    // Reset styles

    var dropdownSelector = document.querySelector('.category-dropdown-selector1');

    dropdownSelector.style.borderBottomLeftRadius = '10px';

    dropdownSelector.style.borderBottomRightRadius = '10px';

    dropdownSelector.style.borderBottom = '1px solid #6D6D6D';


    // Remove active class from all options

    var divs = document.querySelectorAll('.category-list1 div');

    divs.forEach(function (div) {

        div.classList.remove('active-category');

    });

    element.classList.add('active-category');


    // Call the filtering function

    filterVideosByCategory(selectedCategory);

}

function filterVideosByStatus(status) {

    const videoItems = document.querySelectorAll(".content-container.Video .item-list");


    videoItems.forEach(item => {

        const iconSrc = item.querySelector('.read-icon').getAttribute('src');


        if (status === "All (Read / Unread)") {

            item.style.display = "block"; // Show all items

        } else if (status === "Read" && iconSrc.includes("readIcon.svg")) {

            item.style.display = "block"; // Show only read items

        } else if (status === "Pending" && iconSrc.includes("unread.svg")) {

            item.style.display = "block"; // Show only pending items

        } else {

            item.style.display = "none"; // Hide other items

        }

    });

}

function filterVideosByCategory(category) {

    const videoItems = document.querySelectorAll(".content-container.Video .item-list");


    videoItems.forEach(item => {

        const categoryMeta = item.querySelector('.item-meta').textContent.trim();


        if (category === "All Categories") {

            item.style.display = "block"; // Show all items

        } else if (category === categoryMeta) {

            item.style.display = "block"; // Show only items that match the selected category

        } else {

            item.style.display = "none"; // Hide other items

        }

    });

}


function showAllCategoryOptionsUnique1() {

    var categoryItems = document.querySelectorAll('.category-list1 div');


    categoryItems.forEach(function (item) {

        item.style.display = "";

    });

}



function filterVideoItems() {

    const searchBox = document.getElementById('file-search-video');

    const searchQuery = searchBox.value.toLowerCase();

    const videoItems = document.querySelectorAll('.content-container.Video .item-list');


    videoItems.forEach(item => {

        const titleElement = item.querySelector('.item-title1');

        const title = titleElement.textContent.toLowerCase();

        item.style.display = title.includes(searchQuery) ? 'block' : 'none';

    });

}










document.addEventListener("DOMContentLoaded", function () {
    // Select all view buttons
    const viewButtons = document.querySelectorAll(".action-button");

    viewButtons.forEach(button => {
        button.addEventListener("click", function () {
            const pdfPath = this.getAttribute("data-pdf"); // Get the PDF path from the button's data attribute
            const overlay = document.getElementById("overlay-pdf");
            const pdfFrame = document.getElementById("pdf-frame");

            // Set the iframe source to the PDF path
            pdfFrame.src = pdfPath;

            // Show the overlay
            overlay.style.display = "flex";
        });
    });

    // Close button logic
    document.getElementById("close-button").addEventListener("click", function () {
        const overlay = document.getElementById("overlay-pdf");
        overlay.style.display = "none"; // Hide the overlay
        const pdfFrame = document.getElementById("pdf-frame");
        pdfFrame.src = ""; // Clear the src to stop the PDF from loading
    });
});







document.addEventListener("DOMContentLoaded", function () {
    // Event delegation for upload items
    const uploadListContainer = document.getElementById("upload-list-container");
    uploadListContainer.addEventListener("click", function (event) {
        const item = event.target.closest(".upload-item");
        if (item) {
            // Handle the click on the upload item
            const itemName = item.querySelector(".upload-name-all").childNodes[0].textContent.trim();
            const titleElement = document.querySelector(".upload-title");
            titleElement.textContent = itemName; // Update the title with the selected name

            // Highlight the selected item
            const uploadItems = document.querySelectorAll(".upload-item");
            uploadItems.forEach(uploadItem => {
                uploadItem.style.backgroundColor = "white";
                uploadItem.querySelector(".upload-name-all").style.fontWeight = "normal";
            });
            item.style.backgroundColor = "#CFE5F2";
            item.querySelector(".upload-name-all").style.fontWeight = "bold";
        }
    });

    // Event delegation for view buttons
    const viewButtons = document.querySelectorAll(".action-button, .action-button1");
    viewButtons.forEach(button => {
        button.addEventListener("click", function () {
            const pdfPath = this.getAttribute("data-pdf");
            const overlayId = this.classList.contains("action-button") ? "overlay-pdf" : "overlay-pdf1";
            const pdfFrameId = this.classList.contains("action-button") ? "pdf-frame" : "pdf-frame1";

            const overlay = document.getElementById(overlayId);
            const pdfFrame = document.getElementById(pdfFrameId);
            pdfFrame.src = pdfPath;
            overlay.style.display = "flex";
        });
    });

    // Close button logic for overlays
    document.querySelectorAll(".close-button, .close-button1").forEach(button => {
        button.addEventListener("click", function () {
            const overlayId = this.classList.contains("close-button") ? "overlay-pdf" : "overlay-pdf1";
            const pdfFrameId = this.classList.contains("close-button") ? "pdf-frame" : "pdf-frame1";

            const overlay = document.getElementById(overlayId);
            overlay.style.display = "none";
            const pdfFrame = document.getElementById(pdfFrameId);
            pdfFrame.src = ""; // Clear the src to stop the PDF from loading
        });
    });
});

function selectCustomOption(element) {
    var selectedDepartment = element.textContent || element.innerText;
    var selectedOption = document.getElementById('selected-option');
    var selectedDepartmentElement = document.getElementById('selected-department');
    var selector = document.querySelector('.custom-selector');

    // Update dropdown display
    selectedOption.textContent = selectedDepartment;
    selectedDepartmentElement.textContent = selectedDepartment;

    // Close dropdown
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    // Reset the border styles when a department is selected
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D'; // Restore the bottom border

    // Highlight the selected department
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active'); // Remove active class from all options
        div.style.fontWeight = 'normal'; // Reset font weight
        div.style.color = ''; // Reset color
    });

    // Add active class to the selected department
    element.classList.add('active');
    element.style.fontWeight = 'bold'; // Make the selected option bold
    element.style.color = 'black'; // Change the color to black

    // Find the department ID
    var departmentId = element.getAttribute('data-department-id');

    // AJAX call to fetch systems for the selected department
    fetch(`/User FileRepository/GetSystemsByDepartment?departmentId=${departmentId}`)
        .then(response => response.json())
        .then(systems => {
            // Clear existing systems
            var uploadListContainer = document.getElementById('upload-list-container');
            uploadListContainer.innerHTML = '';

            // Populate systems
            if (systems && systems.length > 0) {
                systems.forEach(system => {
                    var systemDiv = document.createElement('div');
                    systemDiv.className = 'upload-list-new';
                    systemDiv.id = system.systemName;
                    systemDiv.innerHTML = `
                    <div class="upload-item">
                        <div class="upload-name-all name">
                            ${system.systemName}
                            <img class="systemIcon" src="/Content/Assets/systemIcon.svg" alt="System Icon" />
                            <div class="tooltip-des">${system.description}</div>
                        </div>
                        <div class="upload-info">
                            <span class="upload-video">Videos: <b>0</b></span>
                            <span class="upload-doc">Docs: <b>0</b></span>
                        </div>
                    </div>
                `;
                    uploadListContainer.appendChild(systemDiv);
                });
            } else {
                // Display "No Systems Available"
                uploadListContainer.innerHTML = `
                <div class="upload-list-new">
                    <div class="upload-item">
                        <div class="upload-name-all name no-click"> <!-- Add the no-click class here -->
                            No Systems Available
                        </div>
                    </div>
                </div>
            `;
            }
        })
        .catch(error => {
            console.error('Error fetching systems:', error);
            // Handle error - maybe show an error message
        });
}


