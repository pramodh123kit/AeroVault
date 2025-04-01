document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const dropdownIcon = document.getElementById('dropdown-icon');

    const profileInfo = document.querySelector('.profile-info');
    const originalContent = profileInfo.innerHTML;

    const newContent = `
        <div class="profile-info" style="margin-top:0px; border:none; display: flex; flex-direction: column; align-items: center; padding-top:0px; padding-bottom:0px;">
            <span class="name" style="padding: 5px 0;">${staffNo}</span>
            <span class="name" style="padding: 5px 0;">${staffName}</span>
            <span class="name" style="padding-bottom:0px">${department}</span>
        </div>
    `;

    profileInfo.addEventListener('click', function () {
        if (profileInfo.innerHTML === originalContent) {
            profileInfo.innerHTML = newContent;
        } else {
            profileInfo.innerHTML = originalContent;
        }
    });
});