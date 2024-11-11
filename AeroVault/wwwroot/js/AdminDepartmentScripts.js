function filterDeparments() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('departmentSearch');
    filter = input.value.toUpperCase();
    ul = document.getElementById("departmentList");
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

function highlightDepartment(selectedItem) {
    // Remove background and bold from all list items
    const listItems = document.querySelectorAll("#departmentList li");
    listItems.forEach(item => {
        item.style.backgroundColor = ""; // Reset background color
        item.style.fontWeight = ""; // Reset font weight
        item.style.padding = ""; // Reset padding
    });

    // Apply background, padding, and bold text to selected item
    selectedItem.style.backgroundColor = "#BBDCF9";
    selectedItem.style.fontWeight = "bold";

    // Get the name of the selected department
    const departmentName = selectedItem.innerText.trim();

    // Update the label for department name
    document.querySelector('#department-name').value = departmentName;
    document.querySelector('#selected-dep-name').innerText = departmentName;


    const deleteModalTitle = document.querySelector('#deletedepartment-popup h2');
    deleteModalTitle.innerText = `Delete ${departmentName} Division?`;

    // Hide the image container and show the system container
    document.querySelector('.department-image-container').style.display = 'none'; // Hide the image container
    document.querySelector('.department-container').style.display = 'block'; // Show the system container
}








function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    var dropdownToggle = document.querySelector('.dropdown-toggle');
    var divisionSelector = document.querySelector('.division-selector');

    if (dropdownContent.style.display === 'block') {
        // Hide the dropdown
        dropdownContent.style.display = 'none';
        dropdownToggle.classList.remove('open');

        // Reset the border and radius
        divisionSelector.style.borderBottomLeftRadius = '10px';
        divisionSelector.style.borderBottomRightRadius = '10px';
        divisionSelector.style.borderBottom = '1px solid #6D6D6D'; // Ensure the bottom border is set
    } else {
        // Show the dropdown
        dropdownContent.style.display = 'block';
        dropdownToggle.classList.add('open');

        // Change the border-radius of the division-selector
        divisionSelector.style.borderBottomLeftRadius = '0';
        divisionSelector.style.borderBottomRightRadius = '0';
        divisionSelector.style.borderBottom = 'none'; // Remove the bottom border
        document.getElementById('search-division').value = '';
        showAllDivisions();
    }
}

function filterDivisions() {
    var input, filter, div, i, txtValue;
    input = document.getElementById('search-division');
    filter = input.value.toUpperCase();
    div = document.querySelectorAll('.dropdown-list div');
    for (i = 0; i < div.length; i++) {
        txtValue = div[i].textContent || div[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            div[i].style.display = "";
        } else {
            div[i].style.display = "none";
        }
    }
}

function selectDivision(element) {
    var selectedDivision = element.textContent || element.innerText;
    document.getElementById('selected-division').textContent = selectedDivision;
    document.querySelector('.dropdown-content').style.display = 'none';
    document.querySelector('.dropdown-toggle').classList.remove('open');

    // Reset the styles of the division selector
    var divisionSelector = document.querySelector('.division-selector');
    divisionSelector.style.borderBottomLeftRadius = '10px';
    divisionSelector.style.borderBottomRightRadius = '10px';
    divisionSelector.style.borderBottom = '1px solid #6D6D6D'; // Ensure the bottom border is set

    var divs = document.querySelectorAll('.dropdown-list div');
    divs.forEach(function (div) {
        div.classList.remove('selected');
    });
    element.classList.add('selected');
}

function showAllDivisions() {
    var divs = document.querySelectorAll('.dropdown-list div');
    divs.forEach(function (div) {
        div.style.display = "";
    });
}

// Reset the styles when the input loses focus
document.getElementById('search-division').addEventListener('blur', function () {
    const divisionSelector = document.querySelector('.division-selector');

    // Reset the border-radius to original values
    divisionSelector.style.borderBottomLeftRadius = '10px';
    divisionSelector.style.borderBottomRightRadius = '10px';

    // Reset the bottom border to the original style
   
    divisionSelector.style.border = '1px solid #6D6D6D'; // Ensure the border is set
    divisionSelector.style.borderRadius = "10px";
});


window.onclick = function (event) {
    const dropdownContent = document.querySelector('.dropdown-content');
    const divisionSelector = document.querySelector('.division-selector');

    // Check if the clicked element is not the dropdown toggle or search input
    if (!event.target.matches('.dropdown-toggle') && !event.target.matches('.dropdown-toggle *') && !event.target.matches('#search-division')) {
        // If the dropdown is open, close it and reset styles
        if (dropdownContent.style.display === 'block') {
            dropdownContent.style.display = 'none';
            document.getElementById('search-division').value = '';
            filterDivisions();
            document.querySelector('.dropdown-toggle').classList.remove('open');

            // Reset the border and radius
            divisionSelector.style.borderBottomLeftRadius = '10px';
            divisionSelector.style.borderBottomRightRadius = '10px';
            divisionSelector.style.borderBottom = '1px solid #6D6D6D'; // Ensure the bottom border is set
        }
    }
};













// DEPARTMENT DELETE POPUP
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















// Function to handle the Add New System button click
function addNewDepartment() {
    // Close the add system popup
    depAddClosePopup(); // This will close the add system popup

    // Check if the notification popup and overlay exist before trying to access them
    var notificationPopup = document.getElementById('notification-popup2');
    var darkOverlay3 = document.getElementById('dark-overlay-dep3');

    if (darkOverlay3 && notificationPopup) {
        darkOverlay3.style.display = 'block'; // Show the overlay for notification
        notificationPopup.style.display = 'block'; // Show the notification popup
    } else {
        console.error("Notification popup or overlay not found.");
    }
}

// Attach the addNewSystem function to the save button
document.querySelector('.add-new-dep-popup-btn').onclick = addNewDepartment;


// Function to close the notification popup
function closeNotificationPopup() {
    document.getElementById('dark-overlay-dep3').style.display = 'none'; // Hide the overlay
    document.getElementById('notification-popup2').style.display = 'none'; // Hide the notification popup
}

// Attach the closeNotificationPopup function to the close icon and overlay
document.getElementById('close-icon-dep3').onclick = closeNotificationPopup;
document.getElementById('dark-overlay-dep3').onclick = closeNotificationPopup;


