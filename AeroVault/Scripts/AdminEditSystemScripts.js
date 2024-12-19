document.addEventListener('DOMContentLoaded', () => {
    console.log('AdminEditSystemScripts.js loaded'); // Confirm script is loaded

    // Add click event listeners to all division headers
    document.querySelectorAll('.division-header').forEach(header => {
        header.addEventListener('click', (event) => {
            console.log('Division header clicked!'); // Log when a header is clicked
            console.log('Clicked header:', header); // Log the clicked header

            // Log the text content of the division name
            const divisionName = header.querySelector('.division-name');
            if (divisionName) {
                console.log('Division Name:', divisionName.textContent.trim());
            }

            // Find the next sibling (division-content)
            const contentDiv = header.nextElementSibling;
            console.log('Content Div:', contentDiv);

            // Find the icon
            const icon = header.querySelector('i');
            console.log('Icon:', icon);

            // Log current display state
            console.log('Current display state:', contentDiv.style.display);

            // Toggle display
            if (contentDiv.style.display === 'none' || contentDiv.style.display === '') {
                console.log('Showing content');
                contentDiv.style.display = 'block';

                if (icon) {
                    icon.classList.replace('fa-chevron-right', 'fa-chevron-down');
                }
            } else {
                console.log('Hiding content');
                contentDiv.style.display = 'none';

                if (icon) {
                    icon.classList.replace('fa-chevron-down', 'fa-chevron-right');
                }
            }
        });
    });

    // Additional debug log to confirm script is running
    console.log('Division header event listeners added');
});