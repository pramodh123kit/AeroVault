

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const dropdownIcon = document.getElementById('dropdown-icon');

    const profileInfo = document.querySelector('.profile-info');
    const originalContent = profileInfo.innerHTML;
    const newContent = `
            <div class="profile-info" style="margin-top:0px; border:none; display: flex; flex-direction: column; align-items: center; padding-top:0px; padding-bottom:0px;">
                <img src="/Assets/UserProfilePic.svg" alt="New Profile Picture" style="width: 50px; height: 50px; margin-bottom: 10px; padding-top:0px;">
                <span class="name" style="padding: 5px 0;">IN1955</span>
                <span class="name" style="padding: 5px 0;">Rusith Manorathna</span>
                <span class="name" style="padding-bottom:0px">Information Technology</span>
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