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

    const items = document.querySelectorAll("#upload-list-container .upload-item");

    items.forEach(item => {
        const name = item.querySelector(".upload-name-all").textContent.toLowerCase();
        item.parentElement.style.display = name.includes(input) ? "" : "none";
    });
}
