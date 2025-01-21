document.getElementById('sidebar-toggle').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('sidebar-visible');
    document.getElementById('overlay').classList.toggle('overlay-visible');
});

document.getElementById('overlay').addEventListener('click', function () {
    document.getElementById('sidebar').classList.remove('sidebar-visible');
    this.classList.remove('overlay-visible');
});

function loadContent(controllerName, pageTitle) {
    document.querySelector('.page-title-name').textContent = pageTitle;

    // Map view names to controllers
    const controllerMap = {
        'Index': 'Overview',
        '_Upload': 'Upload',
        '_Systems': 'Systems',
        '_Departments': 'Departments',
        '_Divisions': 'Divisions',
        '_Review': 'Review'
    };

    // Get the corresponding controller name
    const controller = controllerMap[controllerName] || 'Overview';

    $.ajax({
        url: `/${controller}/Index`,
        type: 'GET',
        success: function (result) {
            $('#main-content').html(result);
        },
        error: function (xhr, status, error) {
            console.error("Error loading content:", error);
            $('#main-content').html('<p class="text-danger">Failed to load content. Please try again later.</p>');
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    loadContent('Index', 'Overview');
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");
    const dropdownIcon = document.getElementById('dropdown-icon');

    const profileInfo = document.querySelector('.profile-info');
    const profileDetails = document.querySelector('.profile-details');

    
    profileInfo.addEventListener('click', function () {
        if (profileInfo.innerHTML === originalContent) {
            profileInfo.innerHTML = newContent;
        } else {
            profileInfo.innerHTML = originalContent;
        }
    });

    profileInfo.addEventListener('click', function () {
        // Toggle the visibility of profile details
        if (profileDetails.style.display === 'none' || profileDetails.style.display === '') {
            profileDetails.style.display = 'block';
        } else {
            profileDetails.style.display = 'none';
        }
    });


    sidebarToggle.addEventListener("click", function () {
        if (window.innerWidth >= 1024) {
            sidebar.classList.toggle("hidden");
        } else {
            sidebar.classList.remove("hidden");
        }
    });

    document.getElementById('manage-toggle').addEventListener('click', function () {
        const subMenu = document.getElementById('manage-sub-menu');
        const isVisible = subMenu.classList.contains('visible');
        const manageLink = this;

        if (!isVisible) {
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";
            subMenu.classList.add('visible');
            dropdownIcon.classList.add('rotate');
            manageLink.classList.add('manage-active');
        } else {
            subMenu.style.maxHeight = null;
            subMenu.classList.remove('visible');
            dropdownIcon.classList.remove('rotate');
            manageLink.classList.remove('manage-active');
        }
    });

    function handleNavLinkClick(event) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const icon = link.querySelector('img');
            if (icon) {
                icon.src = icon.getAttribute('data-original');
            }
        });

        event.currentTarget.classList.add('active');

        const clickedIcon = event.currentTarget.querySelector('img');
        const newIconSrc = event.currentTarget.getAttribute('data-icon');
        if (clickedIcon) {
            clickedIcon.src = newIconSrc;
        }

        event.currentTarget.classList.add('active');

        if (event.currentTarget.closest('#manage-sub-menu')) {
            const manageLink = document.getElementById('manage-toggle');
            manageLink.classList.add('active');
        } else {
            const manageLink = document.getElementById('manage-toggle');
            manageLink.classList.remove('active');
        }

        const onclickAttribute = event.currentTarget.getAttribute('onclick');

        if (window.innerWidth < 1024) {
            document.getElementById('sidebar').classList.remove('sidebar-visible');
            document.getElementById('overlay').classList.remove('overlay-visible');
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavLinkClick);

        const icon = link.querySelector('img');
        if (icon) {
            icon.setAttribute('data-original', icon.src);
        }

        link.addEventListener('mouseover', function () {
            const hoverIcon = this.getAttribute('data-icon');
            if (icon && hoverIcon) {
                icon.src = hoverIcon;
            }
        });

        link.addEventListener('mouseout', function () {
            if (!link.classList.contains('active')) {
                const originalIcon = icon.getAttribute('data-original');
                if (icon) {
                    icon.src = originalIcon;
                }
            }
        });
    });
});

function fileEditopenPopup() {
    document.getElementById('dark-overlay6').style.display = 'block';
    document.getElementById('editfile-popup2').style.display = 'block';
}

function fileEditClosePopup() {
    document.getElementById('dark-overlay6').style.display = 'none';
    document.getElementById('editfile-popup2').style.display = 'none';
}

document.querySelectorAll(".logout-icon").forEach(function (icon) {
    icon.onclick = fileEditopenPopup;
});

document.getElementById('dark-overlay6').onclick = fileEditClosePopup;
document.getElementById('close-logout').onclick = fileEditClosePopup;

document.getElementById('sidebar-toggle').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    // Toggle sidebar visibility
    sidebar.classList.toggle('sidebar-visible');

    // If the sidebar is visible, show the overlay; otherwise, hide it
    if (sidebar.classList.contains('sidebar-visible')) {
        overlay.classList.add('overlay-visible');
    } else {
        overlay.classList.remove('overlay-visible');
    }
});

// Hide sidebar and overlay when overlay is clicked
document.getElementById('overlay').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('sidebar-visible');
    overlay.classList.remove('overlay-visible');
});
document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.getElementById("sidebar");

    sidebarToggle.addEventListener("click", function () {
        if (window.innerWidth < 1024) {
            sidebar.classList.toggle("sidebar-visible");
            const overlay = document.getElementById('overlay');
            if (sidebar.classList.contains('sidebar-visible')) {
                overlay.classList.add('overlay-visible');
            } else {
                overlay.classList.remove('overlay-visible');
            }
        }
    });
});