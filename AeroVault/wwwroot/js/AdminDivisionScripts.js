function toggleCustomDropdown(event) {
    event.stopPropagation(); 
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
    var filter = input.value.toUpperCase();
    var divs = document.querySelectorAll('.custom-dropdown-list div');

    divs.forEach(function (div) {
        var txtValue = div.textContent || div.innerText;
        div.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
    });
}

function selectCustomOption(element) {
    var selectedOption = element.textContent || element.innerText;
    document.getElementById('selected-option').textContent = selectedOption;
    document.querySelector('.custom-dropdown-content').style.display = 'none';
    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

    var selector = document.querySelector('.custom-selector');
    selector.style.borderBottomLeftRadius = '10px';
    selector.style.borderBottomRightRadius = '10px';
    selector.style.borderBottom = '1px solid #6D6D6D';

    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => div.classList.remove('active'));
    element.classList.add('active');

    document.querySelector('.systems-name').innerText = selectedOption;
    document.querySelector('.image-container').style.display = 'none'; 
    document.querySelector('.system-container').style.display = 'block'; 
}

function showAllCustomOptions() {
    var divs = document.querySelectorAll('.custom-dropdown-list div');
    divs.forEach(div => div.style.display = "");
}

window.addEventListener('click', function (event) {

    var dropdownContent = document.querySelector('.custom-dropdown-content');
    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
    var selector = document.querySelector('.custom-selector');

    if (!dropdownToggle.contains(event.target) && !dropdownContent.contains(event.target) && dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');
        selector.style.borderBottomLeftRadius = '10px';
        selector.style.borderBottomRightRadius = '10px';
        selector.style.borderBottom = '1px solid #6D6D6D';
    }
});

function depDeleteopenPopup() {
    document.getElementById('dark-overlay-dep2').style.display = 'block';
    document.getElementById('deletedepartment-popup').style.display = 'block';
}

function depDeleteClosePopup() {
    document.getElementById('dark-overlay-dep2').style.display = 'none';
    document.getElementById('deletedepartment-popup').style.display = 'none';
}


document.querySelector('.delete-dep-button').onclick = depDeleteopenPopup;

document.getElementById('close-icon-dep2').onclick = depDeleteClosePopup;
document.getElementById('dark-overlay-dep2').onclick = depDeleteClosePopup;




// DEPARTMENT ADD POPUP
function depAddopenPopup() {
    document.getElementById('dark-overlay-dep1').style.display = 'block';
    document.getElementById('adddepartment-popup').style.display = 'block';
}

function depAddClosePopup() {
    document.getElementById('dark-overlay-dep1').style.display = 'none';
    document.getElementById('adddepartment-popup').style.display = 'none';
}


document.querySelector('.add-dep-button').onclick = depAddopenPopup;

document.getElementById('close-icon-dep1').onclick = depAddClosePopup;
document.getElementById('dark-overlay-dep1').onclick = depAddClosePopup;

function addNewDepartment() {
    depAddClosePopup(); 

    var notificationPopup = document.getElementById('notification-popup2');
    var darkOverlay3 = document.getElementById('dark-overlay-dep3');

    if (darkOverlay3 && notificationPopup) {
        darkOverlay3.style.display = 'block'; 
        notificationPopup.style.display = 'block';
    } else {
        console.error("Notification popup or overlay not found.");
    }
}

document.querySelector('.add-new-dep-popup-btn').onclick = addNewDepartment;


// Function to close the notification popup
function closeNotificationPopup() {
    document.getElementById('dark-overlay-dep3').style.display = 'none'; 
    document.getElementById('notification-popup2').style.display = 'none'; 
}

document.getElementById('close-icon-dep3').onclick = closeNotificationPopup;
document.getElementById('dark-overlay-dep3').onclick = closeNotificationPopup;


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