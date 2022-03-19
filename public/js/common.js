$(document).ajaxError(function (e, xhr, settings) {
  if (xhr.status == 401) {
     window.location.href = '/web/login';
  }
});