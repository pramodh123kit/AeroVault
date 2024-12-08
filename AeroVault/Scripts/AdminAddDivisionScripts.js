$(document).ready(function () {
    $('#add-new-division-btn').on('click', function () {
        var divisionName = $('#new-department-name').val();

        if (!divisionName) {
            alert("Please enter a division name.");
            return;
        }

        $.ajax({
            type: 'POST',
            url: '@Url.Action("AddDivision", "Divisions")',
            data: { divisionName: divisionName },
            success: function (response) {
                alert(response.message);
                $('#adddepartment-popup').hide();
                $('#new-department-name').val('');

                // Fetch the updated list of divisions
                $.ajax({
                    type: 'GET',
                    url: '@Url.Action("GetAllDivisions", "Divisions")',
                    success: function (divisions) {
                        $('#systemList').empty();
                        if (divisions.length === 0) {
                            $('#systemList').append('<li>No Divisions available.</li>');
                        } else {

                            $.each(divisions, function (index, division) {
                                $('#systemList').append('<li onclick="highlightSystem(this)" class="department-li"><a href="#">' + division.divisionName + '</a></li>');

                            });
                        }
                    },

                    error: function (xhr, status, error) {
                        alert("An error occurred while fetching divisions: " + xhr.responseText);
                    }
                });
            },

            error: function (xhr, status, error) {
                alert("An error occurred: " + xhr.responseText);
            }
        });
    });
});