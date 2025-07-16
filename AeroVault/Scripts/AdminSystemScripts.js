var systemList;

$(document).ready(function () {
    $(".close").click(closeButton);
    $("#AddsysBtn").click(openAddSystemModal);
    $("#sysbtnSave").click(addSystem);
    $("#edit-btn-save").click(saveEditedSystem);
    getSystemList();
    loadDivisionDropdowns();  // Load division dropdowns on page load
   

    $("#edit-division-select").on("change", function () {
        const newDivID = $(this).val();
        loadDepartmentsWithPreSelection(null, newDivID); // Don't pre-select if changing
    });


});

function closeButton() {
    $("#addsystemModal").modal("hide");
    $("#editsystemModel").modal("hide");
}

function openAddSystemModal() {
    $("#addsystemModal").modal("show");

    // Clear previous inputs/selections
    $('#system-name').val('');
    $('#description').val('');
    $('#division-select').val('');
    $('#department-list').empty();
}

function getSystemList() {
    $.ajax({
        url: '/Systems/GetAllSystems',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log("Aaaaaa", data)
            assignSystemsToList(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            Notiflix.Report.warning("Warning", "Error fetching systems: " + (jqXHR.responseJSON?.message || errorThrown), "OK");
        }
    });
}

function assignSystemsToList(data) {
    console.log("bbbb", data)
    systemListTable.clear().rows.add(data).draw();
    systemList = data;
}

var systemListTable = $("#system-viewer").DataTable({
    scrollX: true,
    paging: true,
    pageLength: 10,
    order: [[0, 'desc']],
    columns: [
        { data: "systemID", title: 'System ID' },
        { data: "systemName", title: 'System Name' },
        { data: "addedDate", title: 'Date/Time' },
        {
            data: '', title: 'Edit', render: function (data, type, row) {
                return `<span class="view-status" onclick="openEditModal(${row.systemID})">Edit</span>`;
            }
        },
        {
            data: 'isDeleted',
            title: 'Action',
            render: function (data, type, row) {
                console.log(`System ID: ${row.systemID}, isDeleted: ${row.isDeleted}`);
                return row.isDeleted == 0
                    ? `<span class="disable-status" onclick="disableSystem(${row.systemID})">Disable</span>`
                    : `<span class="enable-status" onclick="enableSystem(${row.systemID})">Enable</span>`;
            }
        }
    ]
});




// Load divisions into Add and Edit modal dropdowns
function loadDivisionDropdowns() {
  

    $.ajax({
        url: '/Divisions/GetAllDivisions', // Using the same endpoint as in Divisions page
        type: 'GET',


        dataType: 'json',
        success: function (data) {
            //populateDivisionDropdown(data);
            resultgetAllDivisios(data)
            resultgetAllDivisionsEdit(data)
            console.log("AllDivision", data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching divisions:', errorThrown);
        }
    });
}

function resultgetAllDivisios(data) {
    var designations = data;

    console.log("Division dropdown", designations);
    /**sort the countries in alphebetical order**/
    designations.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

    /**Populate the dropdown of the countries of the add hotel modal**/
    var dropdown = $("#division-select");
    var defaultOption = $("<option></option>").val("").text("Select Division");
    dropdown.append(defaultOption);
    for (var i = 0; i < designations.length; i++) {

        if (designations[i].divisionName != null || designations[i].divisionName != "") {
            var option = $("<option></option>").val(designations[i].divisionID).text(designations[i].divisionName);
            dropdown.append(option);
        }
    }

}


function resultgetAllDivisionsEdit(data) {
    var designations = data;

    console.log("Division dropdown", designations);
    /**sort the countries in alphebetical order**/
    designations.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

    /**Populate the dropdown of the countries of the add hotel modal**/
    var dropdown = $("#edit-division-select");
    var defaultOption = $("<option></option>").val("").text("Select Division");
    dropdown.append(defaultOption);
    for (var i = 0; i < designations.length; i++) {

        if (designations[i].divisionName != null || designations[i].divisionName != "") {
            var option = $("<option></option>").val(designations[i].divisionID).text(designations[i].divisionName);
            dropdown.append(option);
        }
    }

}


// Load departments with checkboxes based on division selection in Edit modal

function selectDivision() {

    var DivisionID = $("#division-select").val();
    console.log("Selected Division ID:", DivisionID);

    if (DivisionID != "") {

        var putData = {
            divisionID: parseInt(DivisionID),

        };
        $.ajax({
            url: '/Departments/GetDivi',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(putData),
            success: function (data) {

                console.log("select division123:", data);
                appeardepartment(data)
                
            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log('Error Added', errorThrown);
            }
        });
    }
    //else {

    //    Notiflix.Report.warning("Warning", "Department name Cannot be Empty", "OK")

    //}

}
function appeardepartment(data) {
    console.log(data)
    console.log("DepartmentId", data[0].departmentID)
    console.log("DepartmentName", data[0].departmentName)

    
    const container = document.getElementById('department-list');
    container.innerHTML = ""; // Clear previous checkboxes

    for (let i = 0; i < data.length; i++) {
        const dept = data[i];

        const checkboxDiv = document.createElement("div");
        checkboxDiv.className = "form-check";

        checkboxDiv.innerHTML = `
        <input type="checkbox" class="form-check-input" id="dept-${dept.departmentID}" value="${dept.departmentID}">
        <label class="form-check-label" for="dept-${dept.departmentID}">${dept.departmentName}</label>
    `;

        container.appendChild(checkboxDiv);
    }


}


    function addSystem() {
    const systemName = $("#system-name").val().trim();
    const description = $("#description").val().trim();
    const selectedDepartments = Array.from(document.querySelectorAll('#department-list input[type="checkbox"]:checked')).map(c => c.value);

    if (!systemName) {
        Notiflix.Report.warning("Warning", "System name is required.", "OK");
        return;
    }
    if (!description) {
        Notiflix.Report.warning("Warning", "Description is required.", "OK");
        return;
    }
    if (selectedDepartments.length === 0) {
        Notiflix.Report.warning("Warning", "Select at least one department.", "OK");
        return;
    }

    const putData = {
        systemName,
        description,
        departmentIds: selectedDepartments,
    };

    $.ajax({
        url: '/Systems/AddSystem',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(putData),
        success: function () {
            Notiflix.Report.success("Success", "System added successfully!", "OK");
            closeButton();
            getSystemList();
        },
        error: function () {
            Notiflix.Report.warning("Warning", "Failed to add the system", "OK");
        }
    });
}

function disableSystem(systemID) {

    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });

    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to disable this system?',
        'Yes',
        'No',
        () => {
            var putData = { SystemID: systemID };
            $.ajax({
                url: '/Systems/disableSystem',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(putData),
                success: function (data) {

                    console.log("System Disabled:", data);
                    Notiflix.Report.success("Disable", "System Disabled Successfully", "OK")
                    getSystemList()
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.log('Error System Deleted', errorThrown);
                    Notiflix.Report.warning("Disable", "Failed to disable the System", "OK")
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

function enableSystem(systemID) {

    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });

    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to enable this system?',
        'Yes',
        'No',
        () => {
            var putData = {
                SystemID: systemID
            };
            $.ajax({
                url: '/Systems/enableSystem',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(putData),
                success: function (data) {

                    console.log("Enabled:", data);
                    Notiflix.Report.success("Enable", "System Enabled Successfully", "OK")
                    getSystemList()
                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.log('Error Enable', errorThrown);
                    Notiflix.Report.warning("Enable", "Failed to Enabled the System", "OK")
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


function openEditModal(systemID) {
    const system = systemList.find(s => s.systemID === systemID);
    if (system) {
        $("#system-edit-name").val(system.systemName);
        $("#edit-description").val(system.description);
        $("#edit-division-select").val(system.divisionID);
        $("#edit-system-id").val(systemID);

        loadDepartmentsWithPreSelection(systemID, system.divisionID); // Load with selection
        $("#editsystemModel").modal("show");
    }
}





////  Load Deartment  according to division : edit system   ////
function loadDepartmentsWithPreSelection(systemID, divisionID) {
    const container = document.getElementById('edit-department-list');
    container.innerHTML = "";

    $.ajax({
        url: '/Departments/GetSystemDepartmentIds',
        type: 'GET',
        data: { systemId: systemID },
        success: function (selectedDeptIds) {


            $.ajax({
                url: '/Departments/GetDivi',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ divisionID: parseInt(divisionID) }),
                success: function (departments) {
                    const activeDepartments = departments.filter(d => d.isDeleted === 0);

                    activeDepartments.forEach(dept => {
                        const checked = selectedDeptIds.includes(dept.departmentID) ? 'checked' : '';
                        const checkboxHTML = `
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="edit-dept-${dept.departmentID}" value="${dept.departmentID}" ${checked}>
                                <label class="form-check-label" for="edit-dept-${dept.departmentID}">${dept.departmentName}</label>
                            </div>
                        `;
                        container.insertAdjacentHTML('beforeend', checkboxHTML);
                    });
                }
            });
        }
    });
}




function saveEditedSystem() {
    const systemName = $("#system-edit-name").val().trim();
    const description = $("#edit-description").val().trim();
    const selectedDepartments = Array.from(document.querySelectorAll('#edit-department-list input[type="checkbox"]:checked')).map(c => c.value);
    const systemId = parseInt($("#edit-system-id").val());

    console.log("System Name:", systemName);
    console.log("Description:", description);
    console.log("Selected Departments:", selectedDepartments);

    if (!systemName || !description || selectedDepartments.length === 0) {
        Notiflix.Report.warning("Warning", "Please fill all fields and select departments.", "OK");
        return;
    }

    const putData = {
        systemID: systemId,
        systemName,
        description,
        departmentIds: selectedDepartments,
    };
    console.log("Put Data Sent to Server:", putData);

    $.ajax({
        url: '/Systems/UpdateSystem',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(putData),
        success: function () {
            console.log(" Check System update successful.");
            Notiflix.Report.success("Success", "System updated successfully!", "OK");
            closeButton();
            getSystemList();
        },
        //error: function () {
        //    console.log(" Check System update get error.");
        //    Notiflix.Report.warning("Warning", "Failed to update system", "OK");
        //}
    });
}

