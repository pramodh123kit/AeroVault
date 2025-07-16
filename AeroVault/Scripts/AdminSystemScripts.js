////var systemList;
////$(document).ready(function () {

////    $(".close").click(closeButton);
////    getSystemList();
////    loadDivisions();
////    $("#openAddSystemBtn").click(openAddSystemModal)
////    $("#sysbtnSave").click(addSystem)
////    $("#btnUpdate").click(saveSysUpdate);

////});

////function getSystemList() {

////    $.ajax({
////        url: '/SystemsController/GetAllSystems',
////        type: 'GET',
////        dataType: 'json',
////        success: function (data) {

////            assignSystemsToList(data)
////            console.log("Fetched Data-2 :", data);

////        },
////        error: function (jqXHR, textStatus, errorThrown) {
////            console.log('Error fetching data:', errorThrown);
////        }
////    });

////}

////function assignSystemsToList(data) {

////    systemListTable.clear().rows.add(data).draw()
////    console.log("tabledata", data)
////    systemList = data
////}

////var systemListTable = $("#system-viewer").DataTable({
////    //pageLength: 5,
////    scrollX: true,
////    order: [[0, 'desc']], // Sort by RequestID column (index 0) in descending order
////    columns: [
////        { data: "systemID", title: 'System ID' },
////        { data: "systemName", title: 'System Name' },
////        // { data: "isDeleted", title: 'Disable/Enable' },
////        { data: "addedDate", title: 'Date/Time' },

////        {
////            data: '', title: 'Edit', width: '10%', render: function (data, type, row, meta) {

////                return '<span class="view-status" onclick = "openEditModal(' + row.systemID + ')">Edit</span>'

////            }
////        },

////        {
////            data: 'IsDeleted',
////            title: 'Action',
////            width: '10%',
////            render: function (data, type, row, meta) {
////                if (row.isDeleted == 0) {

////                    return '<span class="disable-status" onclick="disableSystem(' + row.systemID + ')">Disable</span>';

////                } else {

////                    return '<span class="enable-status" onclick="enableSystem(' + row.systemID + ')">Enable</span>';

////                }
////            }
////        }
////    ],
////});




////function closeButton() {
////    $("#addsystemModal").modal("hide")
////    $("#editSystemModal").modal("hide");
////    console.log("hide")
////}

////function openAddSystemModal() {
////    $("#addsystemModal").modal("show")
////    console.log("abc")

////}

////// Add this new function to fetch divisions
////function loadDivisions() {
////    $.ajax({
////        url: '/Divisions/GetAllDivisions', // Using the same endpoint as in Divisions page
////        type: 'GET',


////        dataType: 'json',
////        success: function (data) {
////            //populateDivisionDropdown(data);
////            resultgetAllDesignations(data)
////            resultgetAllDesignationsEdit(data)
////            console.log("AllDivision", data)
////        },
////        error: function (jqXHR, textStatus, errorThrown) {
////            console.log('Error fetching divisions:', errorThrown);
////        }
////    });
////}




////function resultgetAllDesignations(data) {
////    var designations = data;

////    console.log("Division dropdown", designations);
////    /**sort the countries in alphebetical order**/
////    designations.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

////    /**Populate the dropdown of the countries of the add hotel modal**/
////    var dropdown = $("#system-category");
////    var defaultOption = $("<option></option>").val("").text("Select Division");
////    dropdown.append(defaultOption);
////    for (var i = 0; i < designations.length; i++) {

////        if (designations[i].divisionName != null || designations[i].divisionName != "") {
////            var option = $("<option></option>").val(designations[i].divisionID).text(designations[i].divisionName);
////            dropdown.append(option);
////        }
////    }

////}


////function resultgetAllDesignationsEdit(data) {
////    var designations = data;

////    console.log("Division dropdown", designations);
////    /**sort the countries in alphebetical order**/
////    designations.sort((a, b) => a.divisionName.localeCompare(b.divisionName));

////    /**Populate the dropdown of the countries of the add hotel modal**/
////    var dropdown = $("#edit-system-category");
////    var defaultOption = $("<option></option>").val("").text("Select Division");
////    dropdown.append(defaultOption);
////    for (var i = 0; i < designations.length; i++) {

////        if (designations[i].divisionName != null || designations[i].divisionName != "") {
////            var option = $("<option></option>").val(designations[i].divisionID).text(designations[i].divisionName);
////            dropdown.append(option);
////        }
////    }

////}

//////add department
////function addSystem() {


////    var SystemName = $("#add-system-name").val().trim();
////    var DivisionIDNew = $("#system-category").val();

////    Notiflix.Report.init({
////        success: {
////            buttonBackground: '#00436C',
////            buttonColor: '#ffffff',
////            svgColor: '#00436C',
////        }
////    });


////    console.log("PQR", DivisionIDNew)


////    const isDuplicate = systemList.some(s => s.SystemName === SystemName);

////    if (isDuplicate) {
////        Notiflix.Report.warning("Duplicate", "A system with this name already exists.", "OK");
////        return;
////    }

////    if (SystemName != "") {

////        var putData = {
////            systemName: SystemName,
////            divisionId: parseInt(DivisionIDNew),

////        };
////        $.ajax({
////            url: '/Systems/AddSystem',
////            type: 'POST',
////            contentType: 'application/json',
////            data: JSON.stringify(putData),
////            success: function (data) {

////                console.log("Added:", data);
////                Notiflix.Report.success("Added", "System Added Successfully", "OK");
////                closeButton();
////                getSystemList()
////            },
////            error: function (jqXHR, textStatus, errorThrown) {

////                console.log('Error Added', errorThrown);
////                Notiflix.Report.warning("Warning", "Failed to Added the System", "OK")
////            }
////        });
////    } else {

////        Notiflix.Report.warning("Warning", "System name Cannot be Empty", "OK")

////    }
////}

////function saveSysUpdate() {
////    Notiflix.Report.init({
////        success: {
////            buttonBackground: '#00436C',
////            buttonColor: '#ffffff',
////            svgColor: '#00436C',
////        }
////    });

////    var systemName = $("#edit-system-name").val().trim();
////    var divisionID = $("#edit-system-category").val();

////    const isDuplicate = systemList.some(d =>
////        s.systemName === systemName && s.systemID !== SystemIDEdit
////    );

////    if (isDuplicate) {
////        Notiflix.Report.warning("Duplicate", "A system with this name already exists.", "OK");
////        return;
////    }

////    var putData = {
////        SystemId: SystemIDEdit,
////        SystemName: systemName,
////        DivisionId: parseInt(divisionID),
////    };

////    $.ajax({
////        url: '/Systems/UpdateSystem',
////        type: 'POST',
////        contentType: 'application/json',
////        data: JSON.stringify(putData),
////        success: function (data) {
////            console.log("Response Data:", data);
////            if (data.success) {
////                Notiflix.Report.success("Update", "System Updated Successfully", "OK");
////                closeButton();
////                getSystemList();
////            } else {
////                Notiflix.Report.failure("Update", data.message || "Failed to update the system.", "OK");
////            }
////        },
////        error: function (jqXHR, textStatus, errorThrown) {
////            console.log('Error updating:', errorThrown);
////            Notiflix.Report.failure("Update", jqXHR.responseText || "Failed to update the system.", "OK");
////        }
////    });

////}


//var systemList;

//$(document).ready(function () {
//    $(".close").click(closeButton);
//    $("#AddsysBtn").click(openAddSystemModal);
//    $("#sysbtnSave").click(addSystem);
//    $("#edit-btn-save").click(saveEditedSystem);
//    getSystemList();
//});

//function closeButton() {
//    $("#addsystemModal").modal("hide");
//    $("#editsystemModel").modal("hide");
//}

//function openAddSystemModal() {
//    $("#addsystemModal").modal("show");
//    populateDepartments(); // Show nested dropdown
//}

//function getSystemList() {
//    $.ajax({
//        url: '/Systems/GetAllSystems',
//        type: 'GET',
//        dataType: 'json',
//        success: function (data) {
//            assignSystemsToList(data);
//        },
//        error: function (jqXHR, textStatus, errorThrown) {
//            Notiflix.Report.warning("Warning", "Error fetching systems: " + (jqXHR.responseJSON?.message || errorThrown), "OK");
//        }
//    });
//}

//function assignSystemsToList(data) {
//    systemListTable.clear().rows.add(data).draw();
//    systemList = data;
//}

//var systemListTable = $("#system-viewer").DataTable({
//    scrollX: true,
//    paging: true, // Enable pagination
//    pageLength: 10, // Set default number of entries per page
//    order: [[0, 'desc']],
//    columns: [
//        { data: "systemID", title: 'System ID' },
//        { data: "systemName", title: 'System Name' },
//        { data: "addedDate", title: 'Date/Time' },
//        {
//            data: '', title: 'Edit', render: function (data, type, row) {
//                return `<span class="view-status" onclick="openEditModal(${row.systemID})">Edit</span>`;
//            }
//        },
//        {
//            data: 'isDeleted',
//            title: 'Action',
//            render: function (data, type, row) {
//                return row.isDeleted == 0
//                    ? `<span class="disable-status" onclick="disableSystem(${row.systemID})">Disable</span>`
//                    : `<span class="enable-status" onclick="enableSystem(${row.systemID})">Enable</span>`;
//            }
//        }
//    ]
//});

//function populateDepartments() {
//    const container = $('#department-list');
//    container.empty();

//    $.ajax({
//        url: '/Divisions/GetAllDivisions',
//        type: 'GET',
//        dataType: 'json',
//        success: function (divisions) {
//            divisions.forEach(division => {
//                const collapseId = `collapse-${division.id}`;
//                const checkAllId = `selectAll-${division.id}`;
//                const deptContainerId = `departments-${division.id}`;

//                const html = `
//                    <div class="card mb-1">
//                        <div class="card-header" id="heading-${division.id}">
//                            <h5 class="mb-0">
//                                <button class="btn btn-link" data-toggle="collapse" data-target="#${collapseId}" aria-expanded="false">
//                                    ${division.name}
//                                </button>
//                            </h5>
//                        </div>
//                        <div id="${collapseId}" class="collapse" aria-labelledby="heading-${division.id}">
//                            <div class="card-body">
//                                <div class="form-check">
//                                    <input type="checkbox" class="form-check-input select-all" id="${checkAllId}" data-target="${deptContainerId}">
//                                    <label class="form-check-label" for="${checkAllId}">Select All</label>
//                                </div>
//                                <div id="${deptContainerId}" class="pl-3"></div>
//                            </div>
//                        </div>
//                    </div>
//                `;
//                container.append(html);

//                // Load departments for that division
//                $.ajax({
//                    url: `/Departments/GetDepartmentsByDivision/${division.id}`,
//                    type: 'GET',
//                    dataType: 'json',
//                    success: function (departments) {
//                        const deptContainer = $(`#${deptContainerId}`);
//                        departments.forEach(dept => {
//                            const checkbox = `
//                                <div class="form-check">
//                                    <input type="checkbox" class="form-check-input department-checkbox" id="dept-${dept.id}" value="${dept.id}">
//                                    <label class="form-check-label" for="dept-${dept.id}">${dept.name}</label>
//                                </div>
//                            `;
//                            deptContainer.append(checkbox);
//                        });
//                    }
//                });
//            });

//            // Delegate select all functionality
//            container.on('change', '.select-all', function () {
//                const target = $(this).data('target');
//                $(`#${target} input[type="checkbox"]`).prop('checked', this.checked);
//            });
//        }
//    });
//}

//function addSystem() {
//    const systemName = $("#system-name").val().trim();
//    const description = $("#description").val().trim();
//    const selectedDepartments = Array.from(document.querySelectorAll('#department-list input:checked')).map(c => c.value);

//    if (!systemName) {
//        Notiflix.Report.warning("Warning", "System name is required.", "OK");
//        return;
//    }
//    if (!description) {
//        Notiflix.Report.warning("Warning", "Description is required.", "OK");
//        return;
//    }
//    if (selectedDepartments.length === 0) {
//        Notiflix.Report.warning("Warning", "Select at least one department.", "OK");
//        return;
//    }

//    const putData = {
//        systemName,
//        description,
//        departmentIds: selectedDepartments,
//    };

//    $.ajax({
//        url: '/Systems/AddSystem',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify(putData),
//        success: function () {
//            Notiflix.Report.success("Success", "System added successfully!", "OK");
//            closeButton();
//            getSystemList();
//        },
//        error: function () {
//            Notiflix.Report.warning("Warning", "Failed to add the system", "OK");
//        }
//    });
//}

//function openEditModal(systemID) {
//    const system = systemList.find(s => s.systemID === systemID);
//    if (system) {
//        $("#system-edit-name").val(system.systemName);
//        $("#edit-description").val(system.description);
//        $("#edit-division-select").val(system.divisionId);
//        populateEditDepartments(system.divisionId);
//        $("#editsystemModel").modal("show");
//    }
//}

//function populateEditDepartments(divisionId) {
//    const departmentList = $('#edit-department-list');
//    departmentList.empty();

//    if (divisionId) {
//        $.ajax({
//            url: `/Departments/GetDepartmentsByDivision/${divisionId}`,
//            type: 'GET',
//            dataType: 'json',
//            success: function (departments) {
//                if (departments.length > 0) {
//                    departments.forEach(department => {
//                        const checkbox = `
//                            <div>
//                                <input type="checkbox" class="edit-department" id="edit-department-${department.id}" value="${department.id}">
//                                <label for="edit-department-${department.id}">${department.name}</label>
//                            </div>
//                        `;
//                        departmentList.append(checkbox);
//                    });
//                } else {
//                    departmentList.append('<p>No departments available.</p>');
//                }
//            }
//        });
//    }
//}

//function saveEditedSystem() {
//    const systemName = $("#system-edit-name").val().trim();
//    const description = $("#edit-description").val().trim();
//    const selectedDepartments = Array.from(document.querySelectorAll('#edit-department-list input:checked')).map(c => c.value);

//    if (!systemName || !description || selectedDepartments.length === 0) {
//        Notiflix.Report.warning("Warning", "Please fill all fields and select departments.", "OK");
//        return;
//    }

//    const putData = {
//        systemName,
//        description,
//        departmentIds: selectedDepartments,
//    };

//    $.ajax({
//        url: '/Systems/EditSystem',
//        type: 'POST',
//        contentType: 'application/json',
//        data: JSON.stringify(putData),
//        success: function () {
//            Notiflix.Report.success("Success", "System updated successfully!", "OK");
//            closeButton();
//            getSystemList();
//        },
//        error: function () {
//            Notiflix.Report.warning("Warning", "Failed to update system", "OK");
//        }
//    });
//}