function filterSystems() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('systemSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("systemList");
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function highlightSystem(selectedItem) {
    const listItems = document.querySelectorAll("#systemList li");
    listItems.forEach(item => {
        item.style.backgroundColor = ""; 
        item.style.fontWeight = ""; 
        item.style.padding = "";
    });

    selectedItem.style.backgroundColor = "#BBDCF9";
    selectedItem.style.fontWeight = "bold";

    const systemName = selectedItem.innerText.trim();

    document.querySelector('.systems-name').innerText = systemName;

    document.querySelector('.image-container').style.display = 'none'; 
    document.querySelector('.system-container').style.display = 'block'; 
}

function filterFiles() {
    const input = document.getElementById('SystemfileSearch');
    const filter = input.value.toLowerCase(); 
    const table = document.querySelector('.file-table tbody');
    const rows = table.getElementsByTagName('tr'); 

    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName('td')[0]; 
        if (td) {
            const txtValue = td.textContent || td.innerText; 
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                rows[i].style.display = ""; 
            } else {
                rows[i].style.display = "none"; 
            }
        }
    }
}



// SYSTEM ADD POPUP
function openPopup() {
    document.getElementById('dark-overlay').style.display = 'block';
    document.getElementById('addsystem-popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('dark-overlay').style.display = 'none'; 
    document.getElementById('addsystem-popup').style.display = 'none';
}

document.querySelector('.add-system-button').onclick = openPopup;
document.getElementById('close-icon').onclick = closePopup;
document.getElementById('dark-overlay').onclick = closePopup;



// SYSTEM EDIT POPUP
function systemEditopenPopup() {
    document.getElementById('dark-overlay1').style.display = 'block'; 
    document.getElementById('editsystem-popup').style.display = 'block'; 
}

function systemEditClosePopup() {
    document.getElementById('dark-overlay1').style.display = 'none'; 
    document.getElementById('editsystem-popup').style.display = 'none'; 
}

document.querySelector('.edit-system-button').onclick = systemEditopenPopup;

document.getElementById('close-icon1').onclick = systemEditClosePopup;
document.getElementById('dark-overlay1').onclick = systemEditClosePopup;


// SYSTEM DELETE POPUP
function systemDeleteopenPopup() {
    document.getElementById('dark-overlay2').style.display = 'block'; 
    document.getElementById('deletesystem-popup').style.display = 'block'; 
}

function systemDeleteClosePopup() {
    document.getElementById('dark-overlay2').style.display = 'none'; 
    document.getElementById('deletesystem-popup').style.display = 'none'; 
}


document.querySelector('.delete-system-button').onclick = systemDeleteopenPopup;

document.getElementById('close-icon2').onclick = systemDeleteClosePopup;
document.getElementById('dark-overlay2').onclick = systemDeleteClosePopup;


// FILE DELETE POPUP
function fileDeleteopenPopup() {
    document.getElementById('dark-overlay4').style.display = 'block'; 
    document.getElementById('deletefile-popup').style.display = 'block'; 
}

function fileDeleteClosePopup() {
    document.getElementById('dark-overlay4').style.display = 'none'; 
    document.getElementById('deletefile-popup').style.display = 'none'; 
}

document.querySelectorAll(".file-delete-icon").forEach(function (icon) {
    icon.onclick = fileDeleteopenPopup; 
});

document.getElementById('close-icon4').onclick = fileDeleteClosePopup;
document.getElementById('dark-overlay4').onclick = fileDeleteClosePopup;



// FILE EDIT POPUP
function fileEditopenPopup() {
    document.getElementById('dark-overlay5').style.display = 'block';
    document.getElementById('editfile-popup').style.display = 'block';
}

function fileEditClosePopup() {
    document.getElementById('dark-overlay5').style.display = 'none';
    document.getElementById('editfile-popup').style.display = 'none';
}


document.querySelectorAll(".file-edit-icon").forEach(function (icon) {
    icon.onclick = fileEditopenPopup;
});

document.getElementById('close-icon5').onclick = fileEditClosePopup;
document.getElementById('dark-overlay5').onclick = fileEditClosePopup;

document.querySelectorAll('.division-header').forEach(header => {
    header.addEventListener('click', () => {
        const activeHeader = document.querySelector('.division-header.active');
        if (activeHeader && activeHeader !== header) {
            activeHeader.classList.remove('active');
            activeHeader.nextElementSibling.classList.remove('active');
            activeHeader.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-right');
        }
        header.classList.toggle('active');
        header.nextElementSibling.classList.toggle('active');
        const icon = header.querySelector('i');
        if (header.classList.contains('active')) {
            icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
        } else {
            icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
        }
    });
});

document.querySelectorAll('.select-all').forEach(selectAllCheckbox => {
    selectAllCheckbox.addEventListener('change', (event) => {
        const checkboxGroup = event.target.closest('.division-content').querySelectorAll('.department');
        checkboxGroup.forEach(checkbox => {
            checkbox.checked = event.target.checked;
        });
        updateSelectedCount(event.target.closest('.division'));
    });
});

document.querySelectorAll('.department').forEach(departmentCheckbox => {
    departmentCheckbox.addEventListener('change', (event) => {
        updateSelectedCount(event.target.closest('.division'));
    });
});

function updateSelectedCount(division) {
    const selectedCountElement = division.querySelector('.selected-count');
    const departmentCheckboxes = division.querySelectorAll('.department');
    const selectedCount = Array.from(departmentCheckboxes).filter(checkbox => checkbox.checked).length;
    selectedCountElement.textContent = selectedCount;

    selectedCountElement.textContent = selectedCount > 0 ? selectedCount : '';

    if (selectedCount > 0) {
        division.querySelector('.division-header').classList.add('selected');
    } else {
        division.querySelector('.division-header').classList.remove('selected');
    }
}

document.querySelectorAll('.division').forEach(division => {
    updateSelectedCount(division);
});


function filterDepartmentsDivisions() {
    const input = document.getElementById('DepartmentsDivisionsSearch').value.toLowerCase();
    const divisions = document.querySelectorAll('.division');

    divisions.forEach(division => {
        const divisionName = division.querySelector('.division-header span').textContent.toLowerCase();
        const departmentLabels = division.querySelectorAll('.department');
        let hasVisibleDepartment = false;

        if (divisionName.includes(input)) {
            division.style.display = ''; 
        } else {
            departmentLabels.forEach(label => {
                const departmentName = label.textContent.toLowerCase();
                if (departmentName.includes(input)) {
                    hasVisibleDepartment = true; 
                }
            });
            division.style.display = hasVisibleDepartment ? '' : 'none';
        }
    });
}


function filterDepartmentsDivisions1() {
    const input = document.getElementById('DepartmentsDivisionsSearch1').value.toLowerCase();
    const divisions = document.querySelectorAll('.division');

    divisions.forEach(division => {
        const divisionName = division.querySelector('.division-header span').textContent.toLowerCase();
        const departmentLabels = division.querySelectorAll('.department');
        let hasVisibleDepartment = false;

        if (divisionName.includes(input)) {
            division.style.display = ''; 
        } else {
            departmentLabels.forEach(label => {
                const departmentName = label.textContent.toLowerCase();
                if (departmentName.includes(input)) {
                    hasVisibleDepartment = true;
                }
            });
            division.style.display = hasVisibleDepartment ? '' : 'none';
        }
    });
}


function addNewSystem() {
    closePopup(); 

    var notificationPopup = document.getElementById('notification-popup');
    var darkOverlay3 = document.getElementById('dark-overlay3');

    if (darkOverlay3 && notificationPopup) {
        darkOverlay3.style.display = 'block'; 
        notificationPopup.style.display = 'block'; 
    } else {
        console.error("Notification popup or overlay not found.");
    }
}

document.querySelector('.save-btn').onclick = addNewSystem;


function closeNotificationPopup() {
    document.getElementById('dark-overlay3').style.display = 'none'; 
    document.getElementById('notification-popup').style.display = 'none'; 
}

document.getElementById('close-icon3').onclick = closeNotificationPopup;
document.getElementById('dark-overlay3').onclick = closeNotificationPopup;

function filterDivisionOptions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('division-search'); 
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.division-dropdown-list div'); 
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none"; 
        }
    }
}

function selectDivisionOption(element) {
    var selectedDivision = element.textContent || element.innerText;
    document.getElementById('selected-division-option').textContent = selectedDivision; 
    document.querySelector('.division-dropdown-content').style.display = 'none'; 
    document.querySelector('.division-dropdown-toggle').classList.remove('open'); 

    var divs = document.querySelectorAll('.division-dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('selected');
    });
    element.classList.add('selected'); 
}

function toggleDivisionDropdown() {
    var dropdownContent = document.querySelector('.division-dropdown-content');
    var dropdownToggle = document.querySelector('.division-dropdown-toggle');

    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none'; 
        dropdownToggle.classList.remove('open'); 
    } else {
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open'); 
        document.getElementById('division-search').value = ''; 
        showAllDivisionOptions(); 
    }
}

function showAllDivisionOptions() {
    var divs = document.querySelectorAll('.division-dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = ""; 
    });
}

window.onclick = function (event) {
    const dropdownContent = document.querySelector('.division-dropdown-content');
    const dropdownToggle = document.querySelector('.division-dropdown-toggle');

    if (!event.target.matches('.division-dropdown-toggle') && !event.target.matches('.division-dropdown-toggle *') && !event.target.matches('#division-search')) {
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none'; 
            dropdownToggle.classList.remove('open'); 
        }
    }
};

function toggleSystemList() {
    const systemList = document.getElementById('systemList');
    const systemDropdown = document.getElementById('systemDropdown');

    if (window.innerWidth <= 768) {
        systemList.style.display = 'none';
        systemDropdown.style.display = 'block';

        const listItems = systemList.querySelectorAll('li');
        systemDropdown.innerHTML = '<option value="">Select a System</option>'; 
        listItems.forEach(item => {
            const systemName = item.textContent.trim();
            const option = document.createElement('option');
            option.value = systemName;
            option.textContent = systemName;
            systemDropdown.appendChild(option);
        });
    } else {
        systemList.style.display = 'block';
        systemDropdown.style.display = 'none';
    }
}

function selectSystem(dropdown) {
    const selectedValue = dropdown.value;
    const items = document.querySelectorAll('#systemList li');

    items.forEach(item => {
        if (item.textContent.trim() === selectedValue) {
            highlightSystem(item);
        }
    });
}

window.addEventListener('load', toggleSystemList);
window.addEventListener('resize', toggleSystemList);