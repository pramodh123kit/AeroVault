function showSystemView() {
    document.getElementById('system-view').style.display = 'flex';
    document.getElementById('staff-view').style.display = 'none';
    document.getElementById('system-reviewtab').classList.add('active');
    document.getElementById('staff-reviewtab').classList.remove('active');
}

function showStaffView() {
    document.getElementById('system-view').style.display = 'none';
    document.getElementById('staff-view').style.display = 'flex';
    document.getElementById('system-reviewtab').classList.remove('active');
    document.getElementById('staff-reviewtab').classList.add('active');
}

function filterDepartments() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById('departmentList');
    li = ul.getElementsByTagName('li');
    for (i = 0; i < li.length; i++) {
        a = li[i];
        txtValue = a.textReviewContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function toggleReviewDropdown(event) {
    var reviewdropdown = event.currentTarget.querySelector('.reviewdropdown');
    var icon = event.currentTarget.querySelector('.icon');
    var allReviewDropdowns = document.querySelectorAll('.reviewdropdown');
    var allIcons = document.querySelectorAll('.icon');

    allReviewDropdowns.forEach(function (dd) {
        if (dd !== reviewdropdown) {
            dd.style.display = 'none';
        }
    });

    allIcons.forEach(function (ic) {
        if (ic !== icon) {
            ic.classList.remove('rotate');
        }
    });

    if (reviewdropdown.style.display === 'block') {
        reviewdropdown.style.display = 'none';
        icon.classList.remove('rotate');
    } else {
        reviewdropdown.style.display = 'block';
        icon.classList.add('rotate');
    }
}

function loadReviewContent(url, department, system) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById('system-view-reviewcontent').innerHTML = data;
        })
        .catch(error => console.error('Error loading reviewcontent:', error));

    var departments = document.querySelectorAll('.department-list li');
    departments.forEach(function (dept) {
        dept.classList.remove('active');
    });
    department.classList.add('active');

    var systems = department.querySelectorAll('.reviewdropdown li');
    systems.forEach(function (sys) {
        sys.classList.remove('active');
    });
    system.classList.add('active');
}



function openReadModalUnique() {
    
    document.getElementById("readModalUnique").style.display = "block";
}

function closeReadModalUnique() {
    
    document.getElementById("readModalUnique").style.display = "none";
}

function openPendingModalUnique() {
    
    document.getElementById("pendingModalUnique").style.display = "block";
}

function closePendingModalUnique() {
    
    document.getElementById("pendingModalUnique").style.display = "none";
}

window.onclick = function (event) {
    if (event.target == document.getElementById("readModalUnique")) {
        closeReadModalUnique();
    }
    if (event.target == document.getElementById("pendingModalUnique")) {
        closePendingModalUnique();
    }
}

function searchTableUnique() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInputUnique");
    filter = input.value.toLowerCase();
    table = document.getElementById("fileTableUnique");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        tr[i].style.display = "none";
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                }
            }
        }
    }
}