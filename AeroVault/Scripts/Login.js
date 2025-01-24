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
        }
    });

    function createErrorPopup(message) {
        // Create dark overlay
        const darkOverlay = document.createElement('div');
        darkOverlay.classList.add('dark-overlay-error');
        darkOverlay.style.position = 'fixed';
        darkOverlay.style.top = '0';
        darkOverlay.style.left = '0';
        darkOverlay.style.width = '100%';
        darkOverlay.style.height = '100%';
        darkOverlay.style.background = 'linear-gradient(135deg, #B71C1C, #D32F2F, #FF5252)';
        darkOverlay.style.backgroundSize = '400% 400%';
        darkOverlay.style.zIndex = '1000';
        darkOverlay.style.display = 'flex';
        darkOverlay.style.justifyContent = 'center';
        darkOverlay.style.alignItems = 'center';
        darkOverlay.style.opacity = '0';
        darkOverlay.style.transition = 'opacity 0.5s ease';
        darkOverlay.style.animation = 'overlayAnimation 1s ease forwards';

        // Add custom keyframes for overlay
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes overlayAnimation {
                0% {
                    background-position: 0% 50%;
                    opacity: 0;
                }
                100% {
                    background-position: 100% 50%;
                    opacity: 0.4;
                }
            }
        `;
        document.head.appendChild(styleSheet);

        // Create popup
        const popup = document.createElement('div');
        popup.style.backgroundColor = 'white'; // Pure white background
        popup.style.padding = '30px';
        popup.style.borderRadius = '10px';
        popup.style.textAlign = 'center';
        popup.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        popup.style.maxWidth = '400px';
        popup.style.width = '90%';
        popup.style.position = 'relative';
        popup.style.zIndex = '1001';
        popup.style.opacity = '1'; // Full opacity for the popup
        popup.style.transform = 'scale(1)'; // Ensure no scaling

        // Error icon
        const icon = document.createElement('div');
        icon.innerHTML = '⚠️';
        icon.style.fontSize = '50px';
        icon.style.marginBottom = '15px';

        // Error message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.fontSize = '16px';
        messageElement.style.marginBottom = '20px';

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.backgroundColor = '#D32F2F';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '10px 20px';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        // Close popup when button is clicked
        closeButton.addEventListener('click', function () {
            darkOverlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(darkOverlay);
            }, 500);
        });

        // Assemble popup
        popup.appendChild(icon);
        popup.appendChild(messageElement);
        popup.appendChild(closeButton);
        darkOverlay.appendChild(popup);

        // Add to body and trigger animation
        document.body.appendChild(darkOverlay);

        // Ensure overlay is visible
        setTimeout(() => {
            darkOverlay.style.opacity = '1';
        }, 10);
    }
});