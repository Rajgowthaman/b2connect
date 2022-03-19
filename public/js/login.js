$(document).ready(function () {
  $('#loginBtn').click(function (e) {
    $.ajax({
      type: "POST",
      url: "/core/login",
      data: {
        "email": $('#email').val(),
        "password": $('#password').val()
      },
      beforeSend: function () {
        //showOverlay();
      },
      success: function (data) {
        window.location.href = "/web/home";
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