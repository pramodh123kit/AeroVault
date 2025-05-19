var departmentList;
var DepartmentIDEdit;

$(document).ready(function () {
    $(".close").click(closeButton);
    getDepartmentList();
    loadDivisions();
    $("#openAddDepartmentBtn").click(openAddDepartmentModal);
    $("#btnSave").click(addDepartment);
    $("#btnUpdate").click(saveUpdate);
});

function getDepartmentList() {
    $.ajax({
        url: '/Departments/GetAllDepartments',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            assignDepartmentsToList(data);
            console.log("Fetched Data:", data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching data:', errorThrown);
        }
    });
}

// Table
function assignDepartmentsToList(data) {
    departmentListTable.clear().rows.add(data).draw();
    console.log("Table Data:", data);
    departmentList = data;
}

var departmentListTable = $("#department-viewer").DataTable({
    scrollX: true,
    order: [[0, 'desc']],
    columns: [
        { data: "departmentID", title: 'Department ID' },
        { data: "departmentName", title: 'Department Name' },
        { data: "addedDate", title: 'Date/Time' },
        {
            data: null,
            title: 'Edit',
            width: '10%',
            render: function (data, type, row) {
                return '<span class="view-status" onclick="openEditModal(' + row.departmentID + ')">Edit</span>';
            }
        },
        {
            data: 'IsDeleted',
            title: 'Action',
            width: '10%',
            render: function (data, type, row) {
                return row.isDeleted == 0
                    ? '<span class="disable-status" onclick="disableDepartment(' + row.departmentID + ')">Disable</span>'
                    : '<span class="enable-status" onclick="enableDepartment(' + row.departmentID + ')">Enable</span>';
            }
        }
    ],
});

function closeButton() {
    $("#addepartmentModal").modal("hide");
    $("#editDepartmentModal").modal("hide");
    console.log("Modal hidden");
}

function openAddDepartmentModal() {
    $("#addepartmentModal").modal("show");
    console.log("Add department modal opened");
}

function loadDivisions() {
    $.ajax({
        url: '/Divisions/GetAllDivisions',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            resultgetAllDivisions(data);
            console.log("All Divisions:", data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching divisions:', errorThrown);
        }
    });
}

function resultgetAllDivisions(data) {
    var divisions = data;
    console.log("Division dropdown", divisions);
    divisions.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

    var dropdown = $("#edit-department-category"); 
    dropdown.empty();
    dropdown.append($("<option></option>").val("").text("Select Division"));

    divisions.forEach(function (division) {
        if (division.divisionName) {
            var option = $("<option></option>").val(division.divisionID).text(division.divisionName);
            dropdown.append(option);
        }
    });
}

function openEditModal(departmentID) {
    const department = departmentList.find(d => d.departmentID === departmentID);
    if (!department) {
        console.error("Department not found for ID:", departmentID);
        return;
    }

    DepartmentIDEdit = departmentID;
    $("#edit-department-name").val(department.departmentName);

    // Current status
    const statusText = department.isDeleted === 0 
    $("#edit-department-status").text(statusText);

    loadDivisions(); 
    $("#edit-department-category").val(department.divisionID); 

    
    const divisionStatusText = department.divisionStatus === 0 ? "Active" : "Disabled";
    $("#edit-division-status").text(divisionStatusText); 

    $("#editDepartmentModal").modal("show");
}

// Disable department
function disableDepartment(departmentID) {
    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to disable this department?',
        'Yes',
        'No',
        () => {
            $.ajax({
                url: '/Department/disableDepartment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ DepartmentID: departmentID }),
                success: function () {
                    Notiflix.Report.success("Disabled", "Department Disabled Successfully", "OK");
                    getDepartmentList();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Error disabling department:', errorThrown);
                    Notiflix.Report.warning("Disable", "Failed to disable the department", "OK");
                }
            });
        }
    );
}

// Enable department
function enableDepartment(departmentID) {
    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to enable this department?',
        'Yes',
        'No',
        () => {
            $.ajax({
                url: '/Department/enableDepartment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ DepartmentID: departmentID }),
                success: function () {
                    Notiflix.Report.success("Enabled", "Department Enabled Successfully", "OK");
                    getDepartmentList();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log('Error enabling department:', errorThrown);
                    Notiflix.Report.warning("Enable", "Failed to enable the department", "OK");
                }
            });
        }
    );
}

// Save updates to the department
function saveUpdate() {
    var departmentName = $("#edit-department-name").val().trim();
    var divisionID = $("#edit-department-category").val();
    const isDuplicate = departmentList.some(d => d.departmentName === departmentName && d.departmentID !== DepartmentIDEdit);

    if (isDuplicate) {
        Notiflix.Report.warning("Duplicate", "A department with this name already exists.", "OK");
        return;
    }

    var putData = {
        DepartmentID: DepartmentIDEdit,
        DepartmentName: departmentName,
        DivisionID: divisionID
    };

    $.ajax({
        url: '/Department/UpdateDepartment',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(putData),
        success: function () {
            Notiflix.Report.success("Update", "Department Updated Successfully", "OK");
            closeButton();
            getDepartmentList();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error updating:', errorThrown);
            Notiflix.Report.warning("Update", "Failed to Update the Department", "OK");
        }
    });
}

// Add new department
function addDepartment() {
    var departmentName = $("#add-department-name").val().trim();
    var divisionID = $("#department-category").val();
    const isDuplicate = departmentList.some(d => d.departmentName === departmentName);

    if (isDuplicate) {
        Notiflix.Report.warning("Duplicate", "A department with this name already exists.", "OK");
        return;
    }

    if (departmentName) {
        var putData = {
            DepartmentName: departmentName,
            DivisionId: divisionID
        };

        $.ajax({
            url: '/Departments/AddDepartment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(putData),
            success: function () {
                Notiflix.Report.success("Added", "Department Added Successfully", "OK");
                closeButton();
                getDepartmentList();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error adding:', errorThrown);
                Notiflix.Report.warning("Warning", "Failed to Add the Department", "OK");
            }
        });
    } else {
        Notiflix.Report.warning("Warning", "Department name cannot be empty", "OK");
    }
}