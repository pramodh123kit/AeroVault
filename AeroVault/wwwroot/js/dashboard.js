$(document).ready(function () {
    // Load the Overview section by default
    loadContent('/Admin/Overview');

    // Handle click on all nav links
    $('.nav-link').on('click', function (event) {
        event.preventDefault();
        const url = $(this).data('url');
        loadContent(url);
    });

    // Function to load content into #main-content container
    function loadContent(url) {
        $.ajax({
            url: url,
            method: 'GET',
            success: function (response) {
                $('#main-content').html(response);
            },
            error: function (xhr, status, error) {
                console.error("Error loading content: ", error);
                $('#main-content').html("<p>Error loading content. Please try again.</p>");
            }
        });
    }
});
