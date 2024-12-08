function fileEditopenPopup() {
    document.getElementById('dark-overlay5').style.display = 'block';
    document.getElementById('editfile-popup5').style.display = 'block';
}

function fileEditClosePopup() {
    document.getElementById('dark-overlay5').style.display = 'none';
    document.getElementById('editfile-popup5').style.display = 'none';
}



document.querySelectorAll(".logout-icon").forEach(function (icon) {
    icon.onclick = fileEditopenPopup;
});

document.getElementById('dark-overlay5').onclick = fileEditClosePopup;
document.getElementById('close-logout').onclick = fileEditClosePopup;








function fileEditopenPopup5() {
    document.getElementById('dark-overlay5').style.display = 'block';
    document.getElementById('editfile-popup5').style.display = 'block';
}

function fileEditClosePopup5() {
    document.getElementById('dark-overlay5').style.display = 'none';
    document.getElementById('editfile-popup5').style.display = 'none';
}



document.querySelectorAll(".logout-icon2").forEach(function (icon) {
    icon.onclick = fileEditopenPopup5;
});

document.getElementById('dark-overlay5').onclick = fileEditClosePopup5;
document.getElementById('close-logout').onclick = fileEditClosePopup5;














function fileEditopenPopup2() {
    document.getElementById('dark-overlay6').style.display = 'block';
    document.getElementById('editfile-popup6').style.display = 'block';
}

function fileEditClosePopup2() {
    document.getElementById('dark-overlay6').style.display = 'none';
    document.getElementById('editfile-popup6').style.display = 'none';
}



document.querySelectorAll(".rounded-circle").forEach(function (icon) {
    icon.onclick = fileEditopenPopup2;
});

document.getElementById('dark-overlay6').onclick = fileEditClosePopup2;
document.getElementById('close-icon6').onclick = fileEditClosePopup2;







function fileEditopenPopup3() {
    document.getElementById('dark-overlay7').style.display = 'block';
    document.getElementById('editfile-popup7').style.display = 'block';
}

function fileEditClosePopup3() {
    document.getElementById('dark-overlay7').style.display = 'none';
    document.getElementById('editfile-popup7').style.display = 'none';
}

document.querySelectorAll(".user-sidebar-toggle").forEach(function (icon) {
    icon.onclick = fileEditopenPopup3;
});

document.getElementById('dark-overlay7').onclick = fileEditClosePopup3;

function checkScreenSize() {
    if (window.innerWidth > 576) {
        fileEditClosePopup3();
    }
}

window.addEventListener('resize', checkScreenSize);

checkScreenSize();    