document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorUsername = document.getElementById('error');
    const errorPassword = document.getElementById('error2');

    const errorMessage = document.querySelector('script[data-error-message]')?.getAttribute('data-error-message');

    if (errorMessage) {
        createErrorPopup(errorMessage);
    }

    form.addEventListener('submit', function (event) {
        errorUsername.textContent = '';
        errorPassword.textContent = '';

        let isValid = true;

        if (usernameInput.value.trim() === '') {
            errorUsername.textContent = 'Staff ID is required';
            isValid = false;
        }

        if (passwordInput.value.trim() === '') {
            errorPassword.textContent = 'Password is required';
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        } else {
            // Show loading screen
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.display = 'flex'; // Show loading screen
        }
    });

    function createErrorPopup(message) {
        // Create dark overlay
        const darkOverlay = document.createElement('div');
        darkOverlay.id = 'dark-overlay-error';
        darkOverlay.classList.add('dark-overlay');
        darkOverlay.style.position = 'fixed';
        darkOverlay.style.top = '0';
        darkOverlay.style.left = '0';
        darkOverlay.style.width = '100%';
        darkOverlay.style.height = '100%';
        darkOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        darkOverlay.style.display = 'flex';
        darkOverlay.style.justifyContent = 'center';
        darkOverlay.style.alignItems = 'center';
        darkOverlay.style.opacity = '0';
        darkOverlay.style.transition = 'opacity 0.5s ease';

        // Create popup
        const popup = document.createElement('div');
        popup.id = 'error-notification-popup';
        popup.classList.add('modal-notification-edit');
        popup.style.backgroundColor = 'white';
        popup.style.borderRadius = '10px';
        popup.style.textAlign = 'center';
        popup.style.maxWidth = '400px';
        popup.style.width = '90%';
        popup.style.position = 'relative';
        popup.style.zIndex = '1001';
        popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';

        // Popup header with close button
        const popupHeader = document.createElement('div');
        popupHeader.classList.add('div-edit-header');
        const closeButton = document.createElement('button');
        closeButton.classList.add('popup-close');
        closeButton.innerHTML = '&times;';
        popupHeader.appendChild(closeButton);

        // Popup body
        const popupBody = document.createElement('div');
        popupBody.classList.add('modal-body');

        // Error icon
        const icon = document.createElement('div');
        icon.innerHTML = '⚠️'; // You can replace this with an image if needed
        icon.style.fontSize = '50px';
        icon.style.marginBottom = '15px';

        // Error message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.fontSize = '16px';
        messageElement.style.marginBottom = '20px';

        // Assemble popup
        popupBody.appendChild(icon);
        popupBody.appendChild(messageElement);

        popup.appendChild(popupHeader);
        popup.appendChild(popupBody);

        // Add close functionality
        closeButton.addEventListener('click', function () {
            darkOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(darkOverlay);
            }, 500);
        });

        // Add elements to overlay
        darkOverlay.appendChild(popup);

        // Add to body
        document.body.appendChild(darkOverlay);

        // Trigger display
        setTimeout(() => {
            darkOverlay.style.opacity = '1';
        }, 10);
    }
});