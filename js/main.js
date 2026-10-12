/* main.js — theme toggle, mobile menu, contact form validation */
(function () {
  var root = document.documentElement;

  function currentTheme() {
    return root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }

  /* ----- Theme toggle ----- */
  var themeBtn = document.querySelector(".theme-toggle");
  function paintTheme() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    themeBtn.innerHTML = dark ? "&#9728;&#65039; Light" : "&#127769; Dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  if (themeBtn) {
    paintTheme();
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintTheme();
    });
  }

  /* ----- Mobile menu ----- */
  var menuBtn = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.focus();
      }
    });
  }

  /* ----- Contact form ----- */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");

  function setError(field, msg) {
    var err = document.getElementById(field.id + "-err");
    err.textContent = msg;
    if (msg) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
    return !msg;
  }
  function validate(field) {
    var v = field.value.trim();
    if (!v) return setError(field, "Please fill in this field.");
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return setError(field, "Please enter a valid email address.");
    if (field.id === "message" && v.length < 10)
      return setError(field, "Message must be at least 10 characters.");
    return setError(field, "");
  }
  var fields = ["name", "email", "subject", "message"].map(function (id) {
    return document.getElementById(id);
  });
  fields.forEach(function (f) {
    f.addEventListener("blur", function () { validate(f); });
    f.addEventListener("input", function () { if (f.getAttribute("aria-invalid")) validate(f); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "";
    if (form.elements.website && form.elements.website.value) return; // honeypot
    var firstBad = null;
    fields.forEach(function (f) { if (!validate(f) && !firstBad) firstBad = f; });
    if (firstBad) {
      firstBad.focus();
      status.textContent = "Please fix the highlighted fields and try again.";
      return;
    }
    var body = "Name: " + fields[0].value.trim() + "\nEmail: " + fields[1].value.trim() +
               "\n\n" + fields[3].value.trim();
    window.location.href = "mailto:jivikarahane2208@gmail.com?subject=" +
      encodeURIComponent(fields[2].value.trim()) + "&body=" + encodeURIComponent(body);
    status.textContent = "Thanks! Your email app should open with your message ready to send.";
    form.reset();
  });
})();
