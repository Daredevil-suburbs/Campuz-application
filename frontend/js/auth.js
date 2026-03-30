// Minimal placeholder to prevent 404s on the marketing page.
// Login flow is implemented inside other frontend pages/scripts.
(function () {
  try {
    const token = localStorage.getItem("access_token");
    if (token) window.location.href = "/dashboard.html";
  } catch (e) {
    // Ignore browser storage errors.
  }
})();

