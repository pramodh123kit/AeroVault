function fileEditopenPopup8() {
    document.getElementById('dark-overlay8').style.display = 'block';
    document.getElementById('editfile-popup8').style.display = 'block';
}

function fileEditClosePopup8() {
    document.getElementById('dark-overlay8').style.display = 'none';
    document.getElementById('editfile-popup8').style.display = 'none';
}

document.querySelectorAll(".upload-btn").forEach(function (icon) {
    icon.onclick = fileEditopenPopup8;
});

document.getElementById('dark-overlay8').onclick = fileEditClosePopup8;
document.getElementById('close-logout8').onclick = fileEditClosePopup8;