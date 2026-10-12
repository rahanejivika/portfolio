/* theme.js — light/dark toggle (remembers choice) + mobile menu toggle */
(function () {
  var root = document.documentElement;
  var KEY = "theme";

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function current() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  // apply saved theme as early as possible
  var s = saved();
  if (s) root.setAttribute("data-theme", s);

  document.addEventListener("DOMContentLoaded", function () {
    // ----- theme toggle -----
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "theme-toggle";

    function paint() {
      var dark = current() === "dark";
      btn.textContent = dark ? "☀ Light" : "🌙 Dark";
      btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
    }
    paint();

    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint();
    });

    var header = document.querySelector("body > header");
    if (header) header.appendChild(btn);

    // ----- mobile menu (works with your existing "☰ Menu" button) -----
    var menuBtn = document.querySelector("header button[aria-controls], header .menu-toggle");
    var nav = document.querySelector("header nav");
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
    }
  });
})();
