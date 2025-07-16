var departmentList;
$(document).ready(function () {

    $(".close").click(closeButton);
    getDepartmentList();
    loadDivisions();
    $("#openAddDepartmentBtn").click(openAddDepartmentModal)
    $("#depbtnSave").click(addDepartment)
    $("#btnUpdate").click(saveUpdate);

});

function getDepartmentList() {

    $.ajax({
        url: '/Departments/GetAllDepartments',
        type: 'GET',
        dataType: 'json',
        success: function (data) {

            assignDepartmentsToList(data)
            console.log("Fetched Data-2 :", data);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching data:', errorThrown);
        }
    });

}

function assignDepartmentsToList(data) {

    departmentListTable.clear().rows.add(data).draw()
    console.log("tabledata", data)
    departmentList = data
}

var departmentListTable = $("#department-viewer").DataTable({
    //pageLength: 5,
    scrollX: true,
    order: [[0, 'desc']], // Sort by RequestID column (index 0) in descending order
    columns: [
        { data: "departmentID", title: 'Department ID' },
        { data: "departmentName", title: 'Department Name' },
        // { data: "isDeleted", title: 'Disable/Enable' },
        { data: "addedDate", title: 'Date/Time' },

        {
            data: '', title: 'Edit', width: '10%', render: function (data, type, row, meta) {

                return '<span class="view-status" onclick = "openEditModal(' + row.departmentID + ')">Edit</span>'

            }
        },

        {
            data: 'IsDeleted',
            title: 'Action',
            width: '10%',
            render: function (data, type, row, meta) {
                if (row.isDeleted == 0) {

                    return '<span class="disable-status" onclick="disableDepartment(' + row.departmentID + ')">Disable</span>';

                } else {

                    return '<span class="enable-status" onclick="enableDepartment(' + row.departmentID + ')">Enable</span>';

                }
            }
        }
    ],
});




function closeButton() {
    $("#addepartmentModal").modal("hide")
    $("#editDepartmentModal").modal("hide");
    console.log("hide")
}

function openAddDepartmentModal() {
    $("#addepartmentModal").modal("show")
    console.log("abc")

}

// Add this new function to fetch divisions
function loadDivisions() {
    $.ajax({
        url: '/Divisions/GetAllDivisions', // Using the same endpoint as in Divisions page
        type: 'GET',


        dataType: 'json',
        success: function (data) {
            //populateDivisionDropdown(data);
            resultgetAllDesignations(data)
            resultgetAllDesignationsEdit(data)
            console.log("AllDivision", data)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error fetching divisions:', errorThrown);
        }
    });
}



function resultgetAllDesignations(data) {
    var designations = data;

    console.log("Division dropdown", designations);
    /**sort the countries in alphebetical order**/
    designations.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

    /**Populate the dropdown of the countries of the add hotel modal**/
    var dropdown = $("#department-category");
    var defaultOption = $("<option></option>").val("").text("Select Division");
    dropdown.append(defaultOption);
    for (var i = 0; i < designations.length; i++) {

        if (designations[i].divisionName != null || designations[i].divisionName != "") {
            var option = $("<option></option>").val(designations[i].divisionID).text(designations[i].divisionName);
            dropdown.append(option);
        }
    }

}


function resultgetAllDesignationsEdit(data) {
    var designations = data;

    console.log("Division dropdown", designations);
    /**sort the countries in alphebetical order**/
    designations.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

    /**Populate the dropdown of the countries of the add hotel modal**/
    var dropdown = $("#edit-department-category");
    var defaultOption = $("<option></option>").val("").text("Select Division");
    dropdown.append(defaultOption);
    for (var i = 0; i < designations.length; i++) {

        if (designations[i].divisionName != null || designations[i].divisionName != "") {
            var option = $("<option></option>").val(designations[i].divisionID).text(designations[i].divisionName);
            dropdown.append(option);
        }
    }

}



//function resultgetAllDesignations(data) {
//    const departments = data;
//    divisionName

//    const divisionNames = [];
//    departments.forEach(dept => {
//        if (dept.division && dept.division.divisionName) {
//            divisionNames.push(dept.division.divisionName);
//        }
//    });


//    const uniqueDivisionNames = [...new Set(divisionNames)].sort((a, b) => a.localeCompare(b));

//    const dropdown = $("#department-category");
//    dropdown.empty(); // Clear any existing options
//    const defaultOption = $("<option></option>").val("").text("Select Division");
//    dropdown.append(defaultOption);

//    uniqueDivisionNames.forEach(name => {
//        const option = $("<option></option>").val(name).text(name);
//        dropdown.append(option);
//    });
//}


//add department
function addDepartment() {


    var DepartmentName = $("#add-department-name").val().trim();
    var DivisionIDNew = $("#department-category").val();

    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });


    console.log("ABC", DivisionIDNew)


    const isDuplicate = departmentList.some(d => d.DepartmentName === DepartmentName);

    if (isDuplicate) {
        Notiflix.Report.warning("Duplicate", "A department with this name already exists.", "OK");
        return;
    }

    if (DepartmentName != "") {

        var putData = {
            departmentName: DepartmentName,
            divisionId: parseInt(DivisionIDNew),

        };
        $.ajax({
            url: '/Departments/AddDepartment',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(putData),
            success: function (data) {

                console.log("Added:", data);
                Notiflix.Report.success("Added", "Department Added Successfully", "OK");
                closeButton();
                getDepartmentList()
            },
            error: function (jqXHR, textStatus, errorThrown) {

                console.log('Error Added', errorThrown);
                Notiflix.Report.warning("Warning", "Failed to Added the Department", "OK")
            }
        });
    } else {

        Notiflix.Report.warning("Warning", "Department name Cannot be Empty", "OK")

    }
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


    const divisionStatusText = department.divisionStatus === 0
    $("#edit-division-status").text(divisionStatusText);

    $("#editDepartmentModal").modal("show");
}


// Disable Department
function disableDepartment(departmentID) {
    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to disable this department?',
        'Yes',
        'No',
        () => {
            $.ajax({
                url: '/Departments/disableDepartment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ DepartmentID: departmentID }),
                success: function () {
                    Notiflix.Report.success("Disabled", "Department Disabled Successfully", "OK");
                    getDepartmentList();
                },
                error: function (jqXHR) {
                    console.error('Error disabling department:', jqXHR.responseText);
                    Notiflix.Report.warning("Disable", "Failed to disable the department", "OK");
                }
            });
        }
    );
}

// Enable Department
function enableDepartment(departmentID) {
    Notiflix.Confirm.show(
        'Confirm',
        'Are you sure you want to enable this department?',
        'Yes',
        'No',
        () => {
            $.ajax({
                url: '/Departments/enableDepartment',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ DepartmentID: departmentID }),
                success: function () {
                    Notiflix.Report.success("Enabled", "Department Enabled Successfully", "OK");
                    getDepartmentList();
                },
                error: function (jqXHR) {
                    console.error('Error enabling department:', jqXHR.responseText);
                    Notiflix.Report.warning("Enable", "Failed to enable the department", "OK");
                }
            });
        }
    );
}




// Save updates to the department

function saveUpdate() {
    Notiflix.Report.init({
        success: {
            buttonBackground: '#00436C',
            buttonColor: '#ffffff',
            svgColor: '#00436C',
        }
    });

    var departmentName = $("#edit-department-name").val().trim();
    var divisionID = $("#edit-department-category").val();

    const isDuplicate = departmentList.some(d =>
        d.departmentName === departmentName && d.departmentID !== DepartmentIDEdit
    );

    if (isDuplicate) {
        Notiflix.Report.warning("Duplicate", "A department with this name already exists.", "OK");
        return;
    }

    var putData = {
        DepartmentId: DepartmentIDEdit,
        DepartmentName: departmentName,
        DivisionId: parseInt(divisionID),
    };

    $.ajax({
        url: '/Departments/UpdateDepartment',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(putData),
        success: function (data) {
            console.log("Response Data:", data);
            if (data.success) {
                Notiflix.Report.success("Update", "Department Updated Successfully", "OK");
                closeButton();
                getDepartmentList();
            } else {
                Notiflix.Report.failure("Update", data.message || "Failed to update the department.", "OK");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error updating:', errorThrown);
            Notiflix.Report.failure("Update", jqXHR.responseText || "Failed to update the department.", "OK");
        }
    });
}



