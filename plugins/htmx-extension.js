// src/plugins/htmx-extension.js
// Example htmx extension that logs requests.
(function () {
  htmx.defineExtension('logRequests', {
    onEvent: function (name, evt) {
      if (name === 'htmx:configRequest') {
        console.log('Request to:', evt.detail.path);
      }
    }
  });
})();
