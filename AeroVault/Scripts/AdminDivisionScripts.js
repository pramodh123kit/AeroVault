var divisionList;
var DivisionIDEdit;
$(document).ready(function () {

    getDivisionList()

    $("#add_divisionBtn").click(openmodal)
    $(".close").click(closeModal)
    $("#btnUpdate").click(saveUpdate)
    $("#btnSave").click(addDivision)
   
});

function getDivisionList() {
  
    $.ajax({
        url: '/Divisions/GetAllDivisionsNew',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            assignDivisionsToList(data)
            console.log("Fetched Data-2 :", data);          

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching data:', errorThrown);
        }
    });

}


function assignDivisionsToList(data) {

    divisionListTable.clear().rows.add(data).draw()
    console.log("tabledata",data)
    divisionList = data
}

var divisionListTable = $("#division-viewer").DataTable({
    //pageLength: 5,
    scrollX: true,
    order: [[0, 'desc']], // Sort by RequestID column (index 0) in descending order
    columns: [
        { data: "divisionID", title: 'Division ID' },
        { data: "divisionName", title: 'Division Name' },
       // { data: "isDeleted", title: 'Disable/Enable' },
        { data: "addedDate", title: 'Date/Time' },
        
        {
            data: '', title: 'Edit', width: '10%', render: function (data, type, row, meta) {

                return '<span class="view-status" onclick = "openEditModal(' + row.divisionID + ')">Edit</span>'

            }
        },

        {
            data: 'IsDeleted',
            title: 'Action',
            width: '10%',
            render: function (data, type, row, meta) {
                if (row.isDeleted ==0) {

                    return '<span class="disable-status" onclick="disableDivision(' + row.divisionID + ')">Disable</span>';

                } else {

                    return '<span class="enable-status" onclick="enableDivision(' + row.divisionID + ')">Enable</span>';

                }
            }
        }
    ],
});


function openEditModal(divisionID) {
  
 const division = divisionList.find(d => d.divisionID === divisionID);
    if (!division) return;
   
    $("#edit-department-name").val(division.divisionName);

    DivisionIDEdit = division.divisionID

    $("#editDivisionModal").modal("show");
}

function disableDivision(divisionID) {

    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });

    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to disable this division?',
        'Yes',
        'No',
        () => {
            var putData = { DivisionID: divisionID };
            $.ajax({
                url: '/Divisions/disableDivision',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(putData),
                success: function (data) {

                    console.log("Division Disabled:", data);
                    Notiflix.Report.success("Disable", "Division Disabled Successfully", "OK")
                    getDivisionList()
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.log('Error Division Deleted', errorThrown);
                    Notiflix.Report.warning("Disable", "Failed to disable the Division", "OK")
                }
            });
        },
        () => {

        }, {
            titleColor: '#00436C', 
            okButtonBackground: '#00436C', 
        }

    );

}

function enableDivision(divisionID) {

    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });

    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to enable this division?',
        'Yes',
        'No',
        () => {
            var putData = {
                DivisionID: divisionID
            };
            $.ajax({
                url: '/Divisions/enableDivision',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(putData),
                success: function (data) {

                    console.log("Enabled:", data);
                    Notiflix.Report.success("Enable", "Division Enabled Successfully", "OK")
                    getDivisionList()
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.log('Error Enable', errorThrown);
                    Notiflix.Report.warning("Enable", "Failed to Enabled the Division", "OK")
                }
            });
        },
        () => {

        }, {
        titleColor: '#00436C',
        okButtonBackground: '#00436C',
    }

    );

}


function saveUpdate() {
    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });

    var divisionName = $("#edit-department-name").val().trim();

    const isDuplicate = divisionList.some(d => d.divisionName === divisionName);

    if (isDuplicate) {
        Notiflix.Report.warning("Duplicate", "A division with this name already exists.", "OK");
        return;
    }

    var putData = {
        DivisionID: DivisionIDEdit,
        DivisionName: divisionName
    };
    $.ajax({
        url: '/Divisions/UpdateeDivisionByID',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(putData),
        success: function (data) {

            console.log("Enabled:", data);
            Notiflix.Report.success("Update", "Division Update Successfully", "OK");
            closeModal()
            getDivisionList()
        },
        error: function (jqXHR, textStatus, errorThrown) {

            console.log('Error Enable', errorThrown);
            Notiflix.Report.warning("Update", "Failed to Update the Division", "OK")
        }
    });
}

function addDivision() {

    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });
    var divisionName = $("#add-department-name").val().trim();

    const isDuplicate = divisionList.some(d => d.divisionName === divisionName);

    if (isDuplicate) {
        Notiflix.Report.warning("Duplicate", "A division with this name already exists.", "OK");
        return;
    }

    if (divisionName != "") {

        var putData = {
            DivisionName: divisionName
        };
        $.ajax({
            url: '/Divisions/AddDivision',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(putData),
            success: function (data) {

                console.log("Added:", data);
                Notiflix.Report.success("Added", "Division Added Successfully", "OK");
                closeModal()
                getDivisionList()
            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log('Error Added', errorThrown);
                Notiflix.Report.warning("Warning", "Failed to Added the Division", "OK")
            }
        });
    } else {
               
        Notiflix.Report.warning("Warning", "Division name Cannot be Empty", "OK")

    }
}


function openmodal() {
    $("#addDivisionModal").modal("show")
}

function closeModal() {
    $("#addDivisionModal").modal("hide")
    $("#editDivisionModal").modal("hide")
}
//function assignDivisionsToList(divisions) {


//    var list = $('#systemList');
//    list.empty(); // Clear any existing items

//    divisions.forEach(function (division) {

//        var listItem = `
//            <li onclick="highlightSystem(this); setDivisionName('${division.divisionName}')" 
//                class="department-li" 
//                data-division-id="${division.divisionID}">
//                <a href="#">${division.divisionName}</a>
//            </li>
//        `;
//        //var listItem = `<li>
//        //    ${division.divisionName} (ID: ${division.divisionID})
//        //</li>`;
//        list.append(listItem);
//    });
//}

//var currentSelectedDivisionName = null;
//function toggleCustomDropdown(event) {
//    event.stopPropagation();
//    var dropdownContent = document.querySelector('.custom-dropdown-content');
//    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
//    var selector = document.querySelector('.custom-selector');

//    if (dropdownContent.style.display === 'block') {
//        dropdownContent.style.display = 'none';
//        dropdownToggle.classList.remove('open');
//        selector.style.borderBottomLeftRadius = '10px';
//        selector.style.borderBottomRightRadius = '10px';
//        selector.style.borderBottom = '1px solid #6D6D6D';
//    } else {
//        dropdownContent.style.display = 'block';
//        dropdownToggle.classList.add('open');
//        selector.style.borderBottomLeftRadius = '0';
//        selector.style.borderBottomRightRadius = '0';
//        selector.style.borderBottom = 'none';
//        document.getElementById('custom-search-input').value = '';
//        showAllCustomOptions();
//    }
//}

//function filterCustomOptions() {
//    var input = document.getElementById('custom-search-input');
//    var filter = input.value.toUpperCase();
//    var divs = document.querySelectorAll('.custom-dropdown-list div');

//    divs.forEach(function (div) {
//        var txtValue = div.textContent || div.innerText;
//        div.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
//    });
//}

//function selectCustomOption(element) {
//    var selectedOption = (element.textContent || element.innerText).trim();
//    var divisionId = element.getAttribute('data-division-id');

//    document.getElementById('selected-option').textContent = selectedOption;
//    document.querySelector('.custom-dropdown-content').style.display = 'none';
//    document.querySelector('.custom-dropdown-toggle').classList.remove('open');

//    var selector = document.querySelector('.custom-selector');
//    selector.style.borderBottomLeftRadius = '10px';
//    selector.style.borderBottomRightRadius = '10px';
//    selector.style.borderBottom = '1px solid #6D6D6D';

//    var departmentNameInput = document.getElementById('department-name');

//    departmentNameInput.value = selectedOption;
//    departmentNameInput.setAttribute('data-original-name', selectedOption);

//    currentSelectedDivisionId = divisionId;
//    currentSelectedDivisionName = selectedOption;

//    departmentNameInput.style.textAlign = 'left';

//    var divs = document.querySelectorAll('.custom-dropdown-list div');
//    divs.forEach(div => {
//        div.classList.remove('active');
//        div.style.backgroundColor = '';
//        div.style.fontWeight = '';
//    });
//    element.classList.add('active');
//    element.style.backgroundColor = "#BBDCF9";
//    element.style.fontWeight = "bold";

//    document.querySelector('.systems-name').innerText = selectedOption;

//    document.querySelector('.image-container').style.display = 'none';
//    document.querySelector('.system-container').style.display = 'block';

//    setDivisionName(selectedOption);
//}

//function showAllCustomOptions() {
//    var divs = document.querySelectorAll('.custom-dropdown-list div');
//    divs.forEach(div => div.style.display = "");
//}

//window.addEventListener('click', function (event) {

//    var dropdownContent = document.querySelector('.custom-dropdown-content');
//    var dropdownToggle = document.querySelector('.custom-dropdown-toggle');
//    var selector = document.querySelector('.custom-selector');

//    if (!dropdownToggle.contains(event.target) && !dropdownContent.contains(event.target) && dropdownContent.style.display === 'block') {
//        dropdownContent.style.display = 'none';
//        dropdownToggle.classList.remove('open');
//        selector.style.borderBottomLeftRadius = '10px';
//        selector.style.borderBottomRightRadius = '10px';
//        selector.style.borderBottom = '1px solid #6D6D6D';
//    }
//});

//function depDeleteopenPopup() {
//    if (!currentSelectedDivisionId) {
//        alert('Please select a division to delete');
//        return;
//    }

//    updateDeletePopupHeader();

//    fetch(`/Divisions/GetDepartmentsByDivision?divisionId=${currentSelectedDivisionId}`)
//        .then(response => response.json())
//        .then(departments => {
//            const fileList = document.querySelector('.file-list');
//            fileList.innerHTML = '';

//            if (departments.length === 0) {
//                fileList.innerHTML = '<div>No departments available.</div>';
//            } else {
//                departments.forEach(department => {
//                    const fileItem = document.createElement('div');
//                    fileItem.className = 'file-item';
//                    fileItem.textContent = department.departmentName;
//                    fileList.appendChild(fileItem);
//                });
//            }

//            document.getElementById('dark-overlay-dep2').style.display = 'block';
//            document.getElementById('deletedepartment-popup').style.display = 'block';
//        })
//        .catch(error => {
//            console.error('Error fetching departments:', error);
//            alert('Failed to fetch departments for the selected division.');
//        });
//}

//function depDeleteClosePopup() {
//    document.getElementById('dark-overlay-dep2').style.display = 'none';
//    document.getElementById('deletedepartment-popup').style.display = 'none';

//}


//document.querySelector('.delete-dep-button').onclick = depDeleteopenPopup;

//document.getElementById('close-icon-dep2').onclick = depDeleteClosePopup;
//document.getElementById('cancel-btn').onclick = depDeleteClosePopup;




//function depAddopenPopup() {
//    document.getElementById('dark-overlay-dep1').style.display = 'block';
//    document.getElementById('adddepartment-popup').style.display = 'block';
//}

//function depAddClosePopup() {
//    document.getElementById('dark-overlay-dep1').style.display = 'none';
//    document.getElementById('dark-overlay-dep3').style.display = 'none';
//    document.getElementById('adddepartment-popup').style.display = 'none';
//}


//document.querySelector('.add-dep-button').onclick = depAddopenPopup;

//document.getElementById('close-icon-dep1').onclick = depAddClosePopup;

//function addNewDepartment() {
//    var divisionName = document.getElementById('new-department-name').value.trim();

//    if (divisionName) {
//        depAddClosePopup();

//        var notificationPopup = document.getElementById('notification-popup2');
//        var darkOverlay3 = document.getElementById('dark-overlay-dep3');

//        if (darkOverlay3 && notificationPopup) {
//            darkOverlay3.style.display = 'block';
//            notificationPopup.style.display = 'block';
//        } else {
//            console.error("Notification popup or overlay not found.");
//        }
//    } else {
//        var errorSpan = document.getElementById('division-name-error');
//        if (errorSpan) {
//            errorSpan.style.display = 'block';
//        }
//    }
//}

//document.querySelector('.add-new-dep-popup-btn').onclick = addNewDepartment;


//function closeNotificationPopup() {
//    document.getElementById('dark-overlay-dep3').style.display = 'none';
//    document.getElementById('notification-popup2').style.display = 'none';
//}

//document.getElementById('close-icon-dep3').addEventListener('click', closeNotificationPopup);
//document.getElementById('dark-overlay-dep3').addEventListener('click', closeNotificationPopup);


//function highlightSystem(selectedItem) {
//    const systemName = selectedItem.textContent.trim();
//    currentSelectedDivisionName = systemName; // Store the selected division name

//    const divisionId = $('#data-division-id');
//    currentSelectedDivisionId = divisionId;

//    const listItems = $(".systemList li");
//    listItems.each(item => {
//        this.style.backgroundColor = "";
//        this.style.fontWeight = "";
//        this.style.padding = "";
//    });

//    selectedItem.style.backgroundColor = "#BBDCF9";
//    selectedItem.style.fontWeight = "bold";

//    document.querySelector('.systems-name').innerText = systemName;

//    document.getElementById('department-name').value = systemName;

//    document.getElementById('department-name').setAttribute('data-original-name', systemName);
//    document.querySelector('.image-container').style.display = 'none';
//    document.querySelector('.system-container').style.display = 'block';

//    setDivisionName(systemName);
//}

//function setDivisionName(divisionName) {
//    const departmentNameInput = document.getElementById('department-name');

//    const trimmedDivisionName = divisionName.trim();

//    departmentNameInput.value = trimmedDivisionName;
//    departmentNameInput.setAttribute('data-original-name', trimmedDivisionName);

//    originalDivisionName = trimmedDivisionName;

//    const saveChangesButton = document.querySelector('.div-edit');
//    saveChangesButton.disabled = true;
//    saveChangesButton.classList.add('disabled-button');
//}





//function filterSystems() {
//    var searchInput = document.getElementById('systemSearch').value.toUpperCase();
//    var listItems = document.querySelectorAll('#systemList li');
//    listItems.forEach(function (item) {
//        var txtValue = item.textContent || item.innerText;
//        if (txtValue.toUpperCase().indexOf(searchInput) > -1) {
//            item.style.display = '';
//        } else {
//            item.style.display = 'none';
//        }
//    });
//}

//var originalDivisionName = '';

//function setDivisionName(divisionName) {
//    document.getElementById('department-name').value = divisionName;

//    originalDivisionName = divisionName;

//    const saveChangesButton = document.querySelector('.div-edit');
//    saveChangesButton.disabled = true;
//    saveChangesButton.classList.add('disabled-button');
//}

//document.getElementById('department-name').addEventListener('input', function () {
//    const saveChangesButton = document.querySelector('.div-edit');
//    const originalName = this.getAttribute('data-original-name');
//    const currentDivisionName = this.value.trim();

//    if (currentDivisionName !== '') {
//        saveChangesButton.disabled = false;
//        saveChangesButton.classList.remove('disabled-button');
//    } else {
//        saveChangesButton.disabled = true;
//        saveChangesButton.classList.add('disabled-button');
//    }
//});

//function saveChanges() {
//    const newDivisionName = document.getElementById('department-name').value.trim();

//    if (newDivisionName === '' || newDivisionName === originalDivisionName) {
//        return;
//    }


//    $.ajax({
//        type: 'POST',
//        url: '/Divisions/UpdateDivision',
//        data: {
//            originalName: originalDivisionName,
//            newDivisionName: newDivisionName
//        },
//        success: function (response) {


//            const listItems = document.querySelectorAll('#systemList li');
//            listItems.forEach(item => {
//                if (item.textContent.trim() === originalDivisionName) {
//                    item.textContent = newDivisionName;
//                }
//            });


//            const dropdownItems = document.querySelectorAll('.custom-dropdown-list div');
//            dropdownItems.forEach(item => {
//                if (item.textContent.trim() === originalDivisionName) {
//                    item.textContent = newDivisionName;
//                }
//            });


//            const selectedOptionSpan = document.getElementById('selected-option');
//            if (selectedOptionSpan) {
//                selectedOptionSpan.textContent = newDivisionName;
//            }

//            const systemsNameElement = document.querySelector('.systems-name');
//            if (systemsNameElement) {
//                systemsNameElement.textContent = newDivisionName;
//            }

//            originalDivisionName = newDivisionName;


//            const saveChangesButton = document.querySelector('.edit-system-button');
//            saveChangesButton.disabled = true;
//            saveChangesButton.classList.add('disabled-button');


//            showDivisionUpdatedPopup();
//        },
//        error: function (xhr, status, error) {
//            console.error('Error updating division:', error);
//            alert('Failed to update division name');
//        }
//    });
//}
//function showDivisionUpdatedPopup() {
//    const darkOverlay = document.getElementById('dark-overlay-dep9');
//    const popup = document.getElementById('division-updated-popup');

//    if (darkOverlay && popup) {
//        darkOverlay.style.display = 'block';
//        popup.style.display = 'block';


//        setupDivisionUpdatedPopupListeners();
//    }
//}

//function closeDivisionUpdatedPopup() {
//    console.log('Attempting to close popup');
//    const darkOverlay = document.getElementById('dark-overlay-dep9');
//    const popup = document.getElementById('division-updated-popup');
//    const error = document.getElementById('division-name-error');

//    if (darkOverlay && popup) {
//        console.log('Closing popup and overlay');
//        darkOverlay.style.display = 'none';
//        popup.style.display = 'none';
//        error.style.display = 'none';
//    } else {
//        console.error('Dark overlay or popup not found', { darkOverlay, popup });
//    }
//}

//function setupDivisionUpdatedPopupListeners() {
//    const closeIcon = document.getElementById('close-icon-dep9');
//    const closeButton = document.getElementById('close-division-updated-btn9');
//    const darkOverlay = document.getElementById('dark-overlay-dep9');

//    if (closeIcon) {
//        closeIcon.removeEventListener('click', closeDivisionUpdatedPopup);
//        closeIcon.addEventListener('click', closeDivisionUpdatedPopup);
//    }

//    if (closeButton) {
//        closeButton.removeEventListener('click', closeDivisionUpdatedPopup);
//        closeButton.addEventListener('click', closeDivisionUpdatedPopup);
//    }

//    if (darkOverlay) {
//        darkOverlay.removeEventListener('click', closeDivisionUpdatedPopup);
//        darkOverlay.addEventListener('click', closeDivisionUpdatedPopup);
//    }
//}

//document.querySelector('.reset-changes').addEventListener('click', function () {
//    document.getElementById('department-name').value = originalDivisionName;


//    const saveChangesButton = document.querySelector('.div-edit');
//    saveChangesButton.disabled = true;
//    saveChangesButton.classList.add('disabled-button');
//});

//document.querySelector('.div-edit').addEventListener('click', saveChanges);
//document.addEventListener('DOMContentLoaded', setupDivisionUpdatedPopupListeners);


//var currentSelectedDivisionId = null;
//var currentSelectedDivisionName = null;



//function showDivisionDeletedSuccessPopup(divisionName) {



//    depDeleteClosePopup();



//    const darkOverlay = document.getElementById('dark-overlay-dep2');

//    if (darkOverlay) {

//        darkOverlay.style.display = 'block';

//    }



//    const successPopup = document.createElement('div');

//    successPopup.className = 'modal-delete-system division-deleted-success-popup del-div-pop';

//    successPopup.innerHTML = `

//        <div class="modal-header-delete-system" style="display: flex; align-items: center; justify-content: center; width:auto;">

//            <h2 style="margin: 0; text-align: center;">Division Deleted</h2>

//            <button class="popup-close" id="close-icon-success-popup" style="margin-left: auto; cursor: pointer; font-size: 38px;">&times;</button>

//        </div>

//        <div style="text-align: center; padding: 20px;">

//            <img src="Content/Assets/system-added-successfully.svg" alt="Success" style="max-width: 100px; margin-bottom: 15px;">

//            <p>Division "${divisionName}" and its associated departments have been successfully deleted.</p>

//        </div>

//        <div class="modal-footer div-div-delete-popup" style="padding: 20px; margin-bottom:0px; justify-content: center; padding-top:0px;">

//            <button class="delete-btn division-deleted-ok-btn" style="background-color:#00436C;">OK</button>

//        </div>

//    `;



//    document.body.appendChild(successPopup);



//    const okButton = successPopup.querySelector('.division-deleted-ok-btn');

//    okButton.addEventListener('click', closeSuccessPopup);



//    const closeButton = successPopup.querySelector('#close-icon-success-popup');

//    closeButton.addEventListener('click', closeSuccessPopup);



//    darkOverlay.addEventListener('click', closeSuccessPopup);

//}


//function closeSuccessPopup() {

//    const successPopup = document.querySelector('.division-deleted-success-popup');

//    if (successPopup) {

//        successPopup.remove();

//    }


//    const darkOverlay = document.getElementById('dark-overlay-dep2');

//    if (darkOverlay) {

//        darkOverlay.style.display = 'none';

//    }



//    currentSelectedDivisionId = null;

//    currentSelectedDivisionName = null;



//    const systemContainer = document.querySelector('.system-container');

//    if (systemContainer) {

//        systemContainer.style.display = 'none';

//    }



//    const imageContainer = document.querySelector('.image-container');

//    if (imageContainer) {

//        imageContainer.style.display = 'block';

//    }

//}

//function confirmDeleteDivision() {
//    if (!currentSelectedDivisionId) {
//        alert('Please select a division to delete');
//        return;
//    }

//    const departmentNameInput = document.getElementById('department-name');
//    if (departmentNameInput) {
//        departmentNameInput.value = '';
//    }

//    $.ajax({
//        type: 'POST',
//        url: '/Divisions/SoftDeleteDivision',
//        contentType: 'application/json',
//        data: JSON.stringify({
//            DivisionId: parseInt(currentSelectedDivisionId)
//        }),
//        success: function (response) {
//            const listItems = document.querySelectorAll('#systemList li');
//            listItems.forEach(item => {
//                if (item.textContent.trim() === currentSelectedDivisionName) {
//                    item.remove();
//                }
//            });

//            const dropdownItems = document.querySelectorAll('.custom-dropdown-list div');
//            dropdownItems.forEach(item => {
//                if (item.textContent.trim() === currentSelectedDivisionName) {
//                    item.remove();
//                }
//            });

//            depDeleteClosePopup();

//            showDivisionDeletedSuccessPopup(currentSelectedDivisionName);

//            currentSelectedDivisionId = null;
//            currentSelectedDivisionName = null;

//            const systemContainer = document.querySelector('.system-container');
//            if (systemContainer) {
//                systemContainer.style.display = 'none';
//            }

//            const imageContainer = document.querySelector('.image-container');
//            if (imageContainer) {
//                imageContainer.style.display = 'block';
//            }

//            const selectedOptionSpan = document.getElementById('selected-option');
//            selectedOptionSpan.textContent = "Select a division";
//        },
//        error: function (xhr, status, error) {
//            console.error('Error deleting division:', error);
//            alert('Failed to delete division');
//        }
//    });
//}

//function updateDeletePopupHeader() {
//    document.querySelector('#deletedepartment-popup h2').textContent = `Delete ${currentSelectedDivisionName} Division?`;
//}

//document.querySelector('.delete-btn').addEventListener('click', confirmDeleteDivision);