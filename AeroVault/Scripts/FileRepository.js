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
        const nameElement = item.querySelector(".upload-name-all");
        if (nameElement) {
            const name = nameElement.textContent.toLowerCase();
            item.style.display = name.includes(input) ? "" : "none";
        } else {
            item.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const documentItems = document.querySelectorAll(".content-container.Document .item-list");
    documentItems.forEach((item, index) => {
        const titleElement = item.querySelector(".item-title");
        if (titleElement) {
            titleElement.textContent = `${index + 1}. ${titleElement.textContent}`;
        }
    });

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

    function filterItems() {
        const searchQuery = searchBox.value.toLowerCase();

        itemList.forEach(item => {
            const itemTitleElement = item.querySelector('.item-title');
            const itemTitle = itemTitleElement.textContent.toLowerCase();

            if (itemTitle.includes(searchQuery)) {
                item.style.display = "block"; 
            } else {
                item.style.display = "none"; 
            }
        });
    }

    searchBox.addEventListener("input", filterItems);
});


document.addEventListener("DOMContentLoaded", function () {
    const searchBox1 = document.querySelector('.search-box1 input');
    const itemList1 = document.querySelectorAll('.item-list1');

    function filterItems() {
        const searchQuery = searchBox1.value.toLowerCase();

        itemList1.forEach(item => {
            const itemTitleElement = item.querySelector('.item-title1');
            const itemTitle = itemTitleElement.textContent.toLowerCase();

            if (itemTitle.includes(searchQuery)) {
                item.style.display = "block"; 
            } else {
                item.style.display = "none"; 
            }
        });
    }

    searchBox1.addEventListener("input", filterItems);
});


document.addEventListener("DOMContentLoaded", function () {
    const uploadItems = document.querySelectorAll("#upload-list-container .upload-list-new");

    uploadItems.forEach(item => {
        const videosCount = parseInt(item.querySelector(".upload-video b").textContent) || 0;
        const docsCount = parseInt(item.querySelector(".upload-doc b").textContent) || 0;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const uploadItems = document.querySelectorAll("#upload-list-container .upload-item");
    const titleElement = document.querySelector(".upload-title");

    uploadItems.forEach(item => {
        item.addEventListener("click", function (event) {
            const isTooltipOrIcon = event.target.classList.contains("systemIcon") ||
                event.target.classList.contains("tooltip-des");
            if (isTooltipOrIcon) return;

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


            };
            const videosCount = parseInt(item.querySelector(".upload-video b").textContent) || 0;
            const docsCount = parseInt(item.querySelector(".upload-doc b").textContent) || 0;
            const totalCount = videosCount + docsCount;

            titleElement.textContent = `${itemName}`;
        });
    });

    const icons = document.querySelectorAll('.systemIcon');
    icons.forEach((icon) => {
        const tooltip = icon.nextElementSibling;
        icon.addEventListener("mouseenter", () => {
            if (tooltip && tooltip.classList.contains("tooltip-des")) {
                tooltip.style.display = "block"; 
            }
        });

        icon.addEventListener("mouseleave", () => {
            if (tooltip && tooltip.classList.contains("tooltip-des")) {
                tooltip.style.display = "none"; 
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const videoCount = parseInt(document.querySelector(".upload-item .upload-video b").textContent, 10);
    const docCount = parseInt(document.querySelector(".upload-item .upload-doc b").textContent, 10);

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
        tooltipPersistent = true; 
    }
}

function showTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'block';
    tooltipPersistent = false; 
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (!tooltipPersistent) { 
        tooltip.style.display = 'none';
    }
}

function forceHideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
    tooltipPersistent = false; 
}

const icons = document.querySelectorAll('.systemIcon');

icons.forEach((icon) => {
    icon.addEventListener('mouseenter', () => {
        const tooltip = icon.nextElementSibling; 
        if (tooltip && tooltip.classList.contains('tooltip-des')) {
            tooltip.style.display = 'block'; 
        }
    });

    icon.addEventListener('mouseleave', () => {
        const tooltip = icon.nextElementSibling; 
        if (tooltip && tooltip.classList.contains('tooltip-des')) {
            tooltip.style.display = 'none'; 
        }
    });
});

function showDocuments() {
    document.getElementById("documentsSection").style.display = "block";
    document.getElementById("videosSection").style.display = "none";

    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-container button:first-child").classList.add("active");
}

function showVideos() {
    document.getElementById("documentsSection").style.display = "none";
    document.getElementById("videosSection").style.display = "block";

    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-container button:last-child").classList.add("active");
}

document.addEventListener("DOMContentLoaded", showDocuments);

function showImage() {
    document.getElementById("popup-image-container").style.display = "block";
}

function closeImagePopup() {
    document.getElementById("popup-image-container").style.display = "none";
}

function resetFilters(sectionId) {
    const section = document.getElementById(sectionId);

    const dropdowns = section.querySelectorAll("select");
    dropdowns.forEach(dropdown => {
        dropdown.selectedIndex = 0; 
    });

    const searchInputs = section.querySelectorAll("input[type='text']");
    searchInputs.forEach(input => {
        input.value = ""; 
    });
}

function showDocuments() {
    document.getElementById("documentsSection").style.display = "block";
    document.getElementById("videosSection").style.display = "none";

    resetFilters("documentsSection");

    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button.video-btn").classList.remove("active");
    document.querySelector(".tab-button:nth-child(1)").classList.add("active");
}

function showVideos() {
    document.getElementById("documentsSection").style.display = "none";
    document.getElementById("videosSection").style.display = "block";

    resetFilters("videosSection");

    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button.video-btn").classList.add("active");
}
function resetFilters(sectionId) {
    const section = document.getElementById(sectionId);

    const dropdowns = section.querySelectorAll("select");
    dropdowns.forEach(dropdown => {
        dropdown.selectedIndex = 0; 
    });

    const searchInputs = section.querySelectorAll("input[type='text']");
    searchInputs.forEach(input => {
        input.value = ""; 
    });

    const items = section.querySelectorAll(".item-list");
    items.forEach(item => {
        item.style.display = "block"; 
    });
}

function showDocuments() {
    document.getElementById("documentsSection").style.display = "block";
    document.getElementById("videosSection").style.display = "none";

    resetFilters("documentsSection");

    document.querySelector(".tab-button.active").classList.remove("active");
    document.querySelector(".tab-button:nth-child(1)").classList.add("active");
}

function showVideos() {
    document.getElementById("videosSection").style.display = "block";
    document.getElementById("documentsSection").style.display = "none";

    resetFilters("videosSection");

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
    div.forEach(function (item) {
        var txtValue = item.textContent || item.innerText;
        item.style.display = txtValue.toLowerCase().indexOf(filter) > -1 ? "" : "none";
    });
    filterUploadList(filter);
}

function filterUploadList(filter) {
    const uploadItems = document.querySelectorAll("#upload-list-container .upload-list-new");

    uploadItems.forEach(item => {
        const nameElement = item.querySelector(".upload-name-all");
        if (nameElement) { 
            const name = nameElement.textContent.toLowerCase();
            item.style.display = name.includes(filter) ? "" : "none";
        } else {
            item.style.display = "none"; 
        }
    });
}

let previouslySelectedItem = null; 

function selectCustomOption(element) {
    var selectedOption = element.textContent || element.innerText;
    document.getElementById('selected-option').textContent = selectedOption;
    document.getElementById('selected-department').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.custom-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    const uploadItems = document.querySelectorAll(".upload-list-new");
    uploadItems.forEach(uploadItem => {
        uploadItem.style.backgroundColor = "white";
        uploadItem.querySelector(".upload-name-all").style.fontWeight = "normal";
    });

    var departmentId = element.getAttribute('data-department-id');

    fetch(`/UserFileRepository/GetSystemsByDepartment?departmentId=${departmentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(systems => {
            const uploadListContainer = document.getElementById("upload-list-container");
            uploadListContainer.innerHTML = "";

            document.getElementById("system-selection-image").style.display = "block";
            document.querySelector(".content-hidden").style.display = "none";

            if (systems.length === 0) {
                // If no systems are found, display a message
                const noSystemsMessage = document.createElement("div");
                noSystemsMessage.className = "no-systems-found";
                noSystemsMessage.textContent = "No Systems Found";
                uploadListContainer.appendChild(noSystemsMessage);
            } else {
                systems.forEach(system => {
                    const uploadItem = document.createElement("div");
                    uploadItem.className = "upload-list-new";
                    uploadItem.innerHTML = `
                        <div class="upload-item">
                            <div class="upload-name-all name">
                                ${system.systemName} <!-- Ensure correct casing -->
                                <img class="systemIcon" src="/Content/Assets/systemIcon.svg" alt="System Icon" />
                                <div class="tooltip-des">${system.description}</div> <!-- Ensure correct casing -->
                            </div>
                            <div class="upload-info">
                                <span class="upload-video">Videos: <b>${system.videoCount}</b></span>
                                <span class="upload-doc">Docs: <b>${system.docCount}</b></span>
                            </div>
                        </div>
                    `;
                    uploadListContainer.appendChild(uploadItem);

                    uploadItem.addEventListener("click", function () {
                        if (previouslySelectedItem) {
                            previouslySelectedItem.style.backgroundColor = "white";
                            previouslySelectedItem.querySelector(".upload-name-all").style.fontWeight = "normal";
                        }

                        this.style.backgroundColor = "#CFE5F2";
                        this.querySelector(".upload-name-all").style.fontWeight = "bold";

                        previouslySelectedItem = this;

                        document.querySelector(".upload-title").textContent = system.systemName;

                        const documentCountElement = document.querySelector(".document-btn .count");
                        const videoCountElement = document.querySelector(".video-btn .count");

                        if (documentCountElement && videoCountElement) {
                            documentCountElement.textContent = system.docCount;
                            videoCountElement.textContent = system.videoCount;
                        }

                        // Log the SystemID to the console
                        console.log("Selected SystemID:", system.systemID);

                        // Check if the selected system belongs to the logged-in user's department
                        fetch(`/UserFileRepository/CheckSystemBelongsToDepartment?systemId=${system.systemID}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.belongsToDepartment) {
                                    console.log("The selected system belongs to the logged-in user's department.");
                                } else {
                                    console.log("The selected system does NOT belong to the logged-in user's department.");
                                }
                            })
                            .catch(error => {
                                console.error("Error checking system department:", error);
                            });

                        loadDocumentsAndVideos(system.systemID);

                        document.getElementById("system-selection-image").style.display = "none";
                        document.querySelector(".content-hidden").style.display = "block";
                    });
                });
            }
        })
        .catch(error => {
            console.error("Error fetching systems:", error);
        });
}

function loadDocumentsAndVideos(systemID) {

    // Check if the system belongs to the logged-in user's department

    fetch(`/UserFileRepository/CheckSystemBelongsToDepartment?systemId=${systemID}`)

        .then(response => response.json())

        .then(data => {

            const belongsToDepartment = data.belongsToDepartment;


            // Fetch documents

            fetch(`/UserFileRepository/GetDocumentsBySystem?systemId=${systemID}`)

                .then(response => response.json())

                .then(documents => {

                    const documentContainer = document.querySelector(".scrollable-item-list.content-container.Document");

                    documentContainer.innerHTML = "";


                    if (documents.length === 0) {

                        const noDocumentsMessage = document.createElement("div");

                        noDocumentsMessage.className = "no-documents-found";

                        noDocumentsMessage.textContent = "No Documents Found";

                        documentContainer.appendChild(noDocumentsMessage);

                    } else {

                        documents.forEach(doc => {

                            const fileNameWithoutExtension = doc.fileName.split('.').slice(0, -1).join('.');

                            const docItem = document.createElement("div");

                            docItem.className = "item-list";

                            docItem.setAttribute("data-unique-identifier", doc.uniqueFileIdentifier);

                            docItem.innerHTML = `

                                <div class="item-info">

                                    ${belongsToDepartment ? '<img src="/Content/Assets/pending-icon.svg" alt="Pending" class="pending-icon" />' : ''}

                                    <span class="item-title">${fileNameWithoutExtension}</span>

                                    <span class="item-meta">${doc.fileCategory}</span>

                                    <span class="item-date">${new Date(doc.addedDate).toLocaleDateString()}</span>

                                    <button class="action-button" onclick="viewFile('${doc.fileName}', '${doc.uniqueFileIdentifier}')">View</button>

                                </div>

                            `;

                            documentContainer.appendChild(docItem);


                            // Check if the file has been viewed by the current user

                            checkFileViewed(doc.uniqueFileIdentifier, docItem);

                        });

                    }

                });


            // Fetch videos

            fetch(`/UserFileRepository/GetVideosBySystem?systemId=${systemID}`)

                .then(response => response.json())

                .then(videos => {

                    const videoContainer = document.querySelector(".scrollable-item-list.content-container.Video");

                    videoContainer.innerHTML = "";


                    if (videos.length === 0) {

                        const noVideosMessage = document.createElement("div");

                        noVideosMessage.className = "no-videos-found";

                        noVideosMessage.textContent = "No Videos Found";

                        videoContainer.appendChild(noVideosMessage);

                    } else {

                        videos.forEach(video => {

                            const fileNameWithoutExtension = video.fileName.split('.').slice(0, -1).join('.');

                            const videoItem = document.createElement("div");

                            videoItem.className = "item-list";

                            videoItem.setAttribute("data-unique-identifier", video.uniqueFileIdentifier);

                            videoItem.innerHTML = `

                                <div class="item-info">

                                    ${belongsToDepartment ? '<img src="/Content/Assets/pending-icon.svg" alt="Pending" class="pending-icon" />' : ''}

                                    <span class="item-title1">${fileNameWithoutExtension}</span> 

                                    <span class="item-meta">${video.fileCategory}</span> 

                                    <span class="item-date">${new Date(video.addedDate).toLocaleDateString()}</span>

                                    <button class="action-button1" onclick="viewFile('${video.fileName}', '${video.uniqueFileIdentifier}')">View</button>

                                </div>

                            `;

                            videoContainer.appendChild(videoItem);


                            // Check if the video has been viewed by the current user

                            checkFileViewed(video.uniqueFileIdentifier, videoItem);

                        });

                    }

                });

        });

}



function checkFileViewed(uniqueIdentifier, docItem) {

    const staffNo = document.getElementById('staffNo').value; // Get the logged-in user's StaffNo


    fetch(`/UserFileRepository/CheckFileViewed?staffNo=${staffNo}&uniqueIdentifier=${uniqueIdentifier}`)

        .then(response => response.json())

        .then(data => {

            if (data.viewed) {

                const icon = docItem.querySelector('.pending-icon');

                if (icon) {

                    icon.src = '/Content/Assets/read-icon.svg'; // Change to read icon if viewed

                }

            }

        })

        .catch(error => {

            console.error('Error checking file viewed status:', error);

        });

}

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

    if (!event.target.matches('.filter-category-status-dropdown-toggle') && !event.target.matches('.filter-category-status-dropdown-toggle *')) {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            document.querySelector('.filter-category-status-dropdown-toggle').classList.remove('open');
            selector.style.borderBottomLeftRadius = '10px';
            selector.style.borderBottomRightRadius = '10px';
            selector.style.borderBottom = '1px solid #6D6D6D';
        }
    }

    if (!event.target.matches('.custom-dropdown-toggle') && !event.target.matches('.custom-dropdown-toggle *') && !event.target.matches('#custom-search-input')) {
        if (customDropdownContent.style.display === 'block') {
            customDropdownContent.style.display = 'none';
            document.querySelector('.custom-dropdown-toggle').classList.remove('open');
            customSelector.style.borderBottomLeftRadius = '10px';
            customSelector.style.borderBottomRightRadius = '10px';
            customSelector.style.borderBottom = '1px solid #6D6D6D';
        }
    }

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

    if (!event.target.matches('.filter-category-status-dropdown-toggle1') && !event.target.matches('.filter-category-status-dropdown-toggle1 *')) {
        if (dropdownContent1.style.display === 'block') {
            dropdownContent1.style.display = 'none';
            document.querySelector('.filter-category-status-dropdown-toggle1').classList.remove('open');
            selector1.style.borderBottomLeftRadius = '10px';
            selector1.style.borderBottomRightRadius = '10px';
            selector1.style.borderBottom = '1px solid #6D6D6D';
        }
    }

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
            item.style.display = "block"; 
        } else if (status === "Read" && iconSrc.includes("readIcon.svg")) {
            item.style.display = "block"; 
        } else if (status === "Pending" && iconSrc.includes("unread.svg")) {
            item.style.display = "block";
        } else {
            item.style.display = "none"; 
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

        showAllCategoryOptionsUnique();
    }
}

function filterDocumentsByCategory(category) {
    const documentItems = document.querySelectorAll(".content-container.Document .item-list");

    documentItems.forEach(item => {
        const categoryMeta = item.querySelector('.item-meta').textContent.trim();

        if (category === "All Categories") {
            item.style.display = "block"; 
        } else if (category === categoryMeta) {
            item.style.display = "block"; 
        } else {
            item.style.display = "none"; 
        }
    });
}

function selectCategoryOptionUnique(element) {
    var selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category-unique').textContent = selectedCategory;

    document.querySelector('.category-dropdown-list-container').style.display = 'none';
    document.querySelector('.category-dropdown-button').classList.remove('open');

    var dropdownSelector = document.querySelector('.category-dropdown-selector');
    dropdownSelector.style.borderBottomLeftRadius = '10px';
    dropdownSelector.style.borderBottomRightRadius = '10px';
    dropdownSelector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.category-list div');
    divs.forEach(function (div) {
        div.classList.remove('active-category');
    });
    element.classList.add('active-category');

    filterDocumentsByCategory(selectedCategory);
}

function showAllCategoryOptionsUnique() {
    var categoryItems = document.querySelectorAll('.category-list div');
    categoryItems.forEach(function (item) {
        item.style.display = "";
    });
}

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

        showAllCategoryOptionsUnique();
    }
}

function filterCategorySelectStatusOption1(element) {
    var selectedStatus = element.textContent || element.innerText;
    document.getElementById('filter-category-selected-status1').textContent = selectedStatus;

    document.querySelector('.filter-category-status-dropdown-content1').style.display = 'none';
    document.querySelector('.filter-category-status-dropdown-toggle1').classList.remove('open');

    var selector = document.querySelector('.filter-category-status-selector1');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.filter-category-status-dropdown-list1 div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');
    filterVideosByStatus(selectedStatus);
}

function selectCategoryOptionUnique1(element) {
    var selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category-unique1').textContent = selectedCategory;

    document.querySelector('.category-dropdown-list-container1').style.display = 'none';
    document.querySelector('.category-dropdown-button1').classList.remove('open');

    var dropdownSelector = document.querySelector('.category-dropdown-selector1');
    dropdownSelector.style.borderBottomLeftRadius = '10px';
    dropdownSelector.style.borderBottomRightRadius = '10px';
    dropdownSelector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.category-list1 div');
    divs.forEach(function (div) {
        div.classList.remove('active-category');
    });
    element.classList.add('active-category');

    filterDocumentsByCategory(selectedCategory);
}
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

    document.querySelector('.filter-category-status-dropdown-content1').style.display = 'none';
    document.querySelector('.filter-category-status-dropdown-toggle1').classList.remove('open');

    var selector = document.querySelector('.filter-category-status-selector1');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.filter-category-status-dropdown-list1 div');
    divs.forEach(function (div) {
        div.classList.remove('active');
    });
    element.classList.add('active');

    filterVideosByStatus(selectedStatus);
}
function toggleCategoryDropdownUnique1() {
    var dropdownListContainer = document.querySelector('.category-dropdown-list-container1');
    var dropdownButton = document.querySelector('.category-dropdown-button1');
    var dropdownSelector = document.querySelector('.category-dropdown-selector1');

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
        showAllCategoryOptionsUnique1();
    }
}

function selectCategoryOptionUnique1(element) {
    var selectedCategory = element.textContent || element.innerText;
    document.getElementById('selected-category-unique1').textContent = selectedCategory;

    document.querySelector('.category-dropdown-list-container1').style.display = 'none';
    document.querySelector('.category-dropdown-button1').classList.remove('open');

    var dropdownSelector = document.querySelector('.category-dropdown-selector1');
    dropdownSelector.style.borderBottomLeftRadius = '10px';
    dropdownSelector.style.borderBottomRightRadius = '10px';
    dropdownSelector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.category-list1 div');
    divs.forEach(function (div) {
        div.classList.remove('active-category');
    });
    element.classList.add('active-category');
    filterVideosByCategory(selectedCategory);
}

function filterVideosByStatus(status) {
    const videoItems = document.querySelectorAll(".content-container.Video .item-list");
    videoItems.forEach(item => {
        const iconSrc = item.querySelector('.read-icon').getAttribute('src');
        if (status === "All (Read / Unread)") {
            item.style.display = "block"; 
        } else if (status === "Read" && iconSrc.includes("readIcon.svg")) {
            item.style.display = "block"; 
        } else if (status === "Pending" && iconSrc.includes("unread.svg")) {
            item.style.display = "block"; 
        } else {
            item.style.display = "none"; 
        }
    });
}

function filterVideosByCategory(category) {
    const videoItems = document.querySelectorAll(".content-container.Video .item-list");
    videoItems.forEach(item => {
        const categoryMeta = item.querySelector('.item-meta').textContent.trim();

        if (category === "All Categories") {
            item.style.display = "block"; 
        } else if (category === categoryMeta) {
            item.style.display = "block"; 
        } else {
            item.style.display = "none"; 
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

function filterDocumentItems() {
    const searchBox = document.getElementById('file-search');
    const searchQuery = searchBox.value.toLowerCase();
    const videoItems = document.querySelectorAll('.content-container.Document .item-list');

    videoItems.forEach(item => {
        const titleElement = item.querySelector('.item-title');
        const title = titleElement.textContent.toLowerCase();
        item.style.display = title.includes(searchQuery) ? 'block' : 'none';
    });
}

function viewFile(fileName, uniqueIdentifier) {

    const overlayPdf = document.getElementById('overlay-pdf');

    const pdfFrame = document.getElementById('pdf-frame');

    const closePdfButton = document.getElementById('close-pdf-button-filerepo');

    const darkOverlay = document.getElementById('dark-overlay8');

    const loadingIndicator = document.getElementById('pdf-loading-indicator');

    const fileNameDisplay = document.getElementById('file-name-display');


    // Display the file name in the overlay

    fileNameDisplay.textContent = fileName;


    // Fetch the file details

    fetch(`/UserFileRepository/FindFile?fileName=${encodeURIComponent(fileName)}&uniqueIdentifier=${encodeURIComponent(uniqueIdentifier)}`)

        .then(response => {

            if (!response.ok) {

                throw new Error('Network response was not ok');

            }

            return response.json();

        })

        .then(data => {

            if (data.foundFileName) {

                const fileUrl = `/UserFileRepository/ViewFile?fileName=${encodeURIComponent(data.foundFileName)}`;


                // Show loading indicator while the file is being loaded

                loadingIndicator.style.display = 'block';

                pdfFrame.style.display = 'none';


                // Set the source of the PDF frame to the file URL

                pdfFrame.src = fileUrl;


                // When the PDF is loaded, hide the loading indicator

                pdfFrame.onload = function () {

                    loadingIndicator.style.display = 'none';

                    pdfFrame.style.display = 'block';

                };


                // Show the overlay and dark background

                overlayPdf.style.display = 'flex';

                darkOverlay.style.display = 'block';


                // Record the file view

                recordFileView(uniqueIdentifier);

            } else {

                alert('File not found. Please check the file name.');

            }

        })

        .catch(error => {

            console.error('Error:', error);

            alert('An error occurred while trying to view the file.');

        });


    // Close button handler to hide the overlay

    const closePdfButtonHandler = function () {

        overlayPdf.style.display = 'none';

        darkOverlay.style.display = 'none';

        pdfFrame.src = ''; // Clear the PDF frame source

        loadingIndicator.style.display = 'none'; // Hide loading indicator

    };


    // Add event listener to the close button

    closePdfButton.addEventListener('click', closePdfButtonHandler);


    // Close the overlay when clicking on the dark overlay

    darkOverlay.onclick = function (event) {

        if (event.target === darkOverlay) {

            closePdfButtonHandler();

        }

    };

}

function recordFileView(uniqueIdentifier) {

    const staffNo = document.getElementById('staffNo').value; // Get the logged-in user's StaffNo from a hidden input


    fetch('/UserFileRepository/RecordFileView', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

        },

        body: JSON.stringify({ staffNo, uniqueIdentifier }),

    })

        .then(response => {

            if (!response.ok) {

                throw new Error('Network response was not ok');

            }

            return response.json();

        })

        .then(data => {

            if (data.success) {

                // Change the icon to "read-icon.svg"

                const fileItem = document.querySelector(`.item-list[data-unique-identifier="${uniqueIdentifier}"]`);

                if (fileItem) {

                    const icon = fileItem.querySelector('.pending-icon');

                    if (icon) {

                        icon.src = '/Content/Assets/read-icon.svg'; // Update the icon to read

                    }

                }

            } else {

                console.error('Failed to record file view:', data.error);

            }

        })

        .catch(error => {

            console.error('Error:', error);

        });

}
