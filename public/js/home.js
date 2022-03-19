$(document).ready(function () {
    $('#ipSearchBtn').click(function (e) {
        $.ajax({
            type: "POST",
            url: "/core/iplookup",
            data: {
                "ip": $('#ipSearchBox').val()
            },
            beforeSend: function () {
                //showOverlay();
            },
            success: function (data) {
                $('#searchResultDiv').html('<br><br><div class="table-responsive-sm shadow-soft rounded"><table class="table table-striped"><tbody>'+
                '<tr><th class="border-0" scope="col" id="class2">Country</th><th class="border-0" scope="col" id="teacher2">'+data.country+'</th></tr>'+
                '<tr><th class="border-0" scope="col" id="class2">City</th><th class="border-0" scope="col" id="teacher2">'+data.city+'</th></tr>'+
                '<tr><th class="border-0" scope="col" id="class2">Latitude</th><th class="border-0" scope="col" id="teacher2">'+data.ll[0]+'</th></tr>'+
                '<tr><th class="border-0" scope="col" id="class2">Longitude</th><th class="border-0" scope="col" id="teacher2">'+data.ll[1]+'</th></tr>'+
                '</tbody></table></div>');
            },
            error: function (e) {
                alert('Something went wrong: ' + JSON.stringify(e));
            },
            complete: function () {
                //hideOverlay();
            },
        });
    })
});