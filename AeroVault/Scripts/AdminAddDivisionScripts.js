$(document).ready(function () {
    var addDivisionUrl = $('#adddepartment-popup').data('add-url');
    var getAllDivisionsUrl = $('#adddepartment-popup').data('get-url');


    // Reset error span when closing popup

    $('#close-icon-dep1').on('click', function () {

        $('#adddepartment-popup').hide();

        $('#dark-overlay-dep1').hide();



        // Reset error span

        $('#division-name-error')

            .text('Please enter a division name')

            .hide();



        // Clear input

        $('#new-department-name').val('');

    });


    // Also reset error span for dark overlay click (if applicable)

    $('#dark-overlay-dep1').on('click', function () {

        $('#adddepartment-popup').hide();

        $('#dark-overlay-dep1').hide();



        // Reset error span

        $('#division-name-error')

            .text('Please enter a division name')

            .hide();



        // Clear input

        $('#new-department-name').val('');

    });

    // Extensive logging function
    function logError(context, xhr, status, error) {
        console.error(`${context} Error:`, {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            error: error
        });
    }

    // Input validation
    $('#new-department-name').on('input', function () {
        $('#division-name-error').hide();
    });

    // Attach submission to button click
    $('#add-new-division-btn').on('click', function (e) {
        e.preventDefault(); // Prevent default form submission

        var divisionName = $('#new-department-name').val().trim();

        // Validate input
        if (!divisionName) {
            $('#division-name-error')
                .text('Please enter a division name')
                .attr('style', 'display: inline-block !important; color: red; margin-left: 10px;');
            return;
        }

        // Proceed with AJAX submission
        $.ajax({
            type: 'POST',
            url: addDivisionUrl,
            data: { divisionName: divisionName }, // Change back to form data
            contentType: 'application/x-www-form-urlencoded', // Use form-urlencoded
            dataType: 'json',
            success: function (response) {
                console.log('Division added successfully:', response);

                // Hide error message and popup
                $('#division-name-error').hide();
                $('#adddepartment-popup').hide();
                $('#dark-overlay-dep1').hide();

                // Clear input
                $('#new-department-name').val('');

                // Fetch updated divisions list
                $.ajax({
                    type: 'GET',
                    url: getAllDivisionsUrl,
                    dataType: 'json',
                    success: function (divisions) {
                        console.log('Fetched divisions:', divisions);

                        // Clear existing list
                        $('#systemList').empty();

                        // Repopulate the list
                        if (!divisions || divisions.length === 0) {
                            $('#systemList').append('<li>No Divisions available.</li>');
                        } else {
                            divisions.forEach(function (division) {
                                // Ensure division has a name
                                if (division.divisionName) {
                                    var listItem = $('<li>', {
                                        'class': 'department-li',
                                        'onclick': `highlightSystem(this); setDivisionName('${division.divisionName}')`
                                    }).append(
                                        $('<a>', {
                                            'href': '#',
                                            'text': division.divisionName
                                        })
                                    );

                                    $('#systemList').append(listItem);
                                }
                            });
                        }

                        // Open notification popup
                        $('#dark-overlay-dep3').show();
                        $('#notification-popup2').show();
                    },
                    error: function (xhr, status, error) {
                        logError('Fetching Divisions', xhr, status, error);
                        alert('Could not refresh divisions list. Please reload the page.');
                    }
                });
            },
            error: function (xhr, status, error) {
                logError('Adding Division', xhr, status, error);

                // Display error message
                $('#division-name-error')
                    .text(xhr.responseJSON?.Message || xhr.responseText || 'An error occurred while adding the division')
                    .attr('style', 'display: inline-block !important; color: red;');
            }
        });
    });

    // Debug logging for URL
    console.log('Add Division URL:', addDivisionUrl);
    console.log('Get All Divisions URL:', getAllDivisionsUrl);
});