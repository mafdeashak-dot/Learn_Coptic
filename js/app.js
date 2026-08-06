
(function () {
  // ---------- الوضع الليلي ----------
  const root = document.documentElement;
  const THEME_KEY = "coptic-academy-theme";

  function applyTheme(theme) {
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }

  const savedTheme = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
        themeToggle.textContent = isDark ? "☀️" : "🌙";
      });
    }

    // ---------- قائمة الهاتف ----------
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        mainNav.classList.toggle("open");
      });
    }

    // ---------- تمييز رابط الصفحة الحالية ----------
    const current = document.body.getAttribute("data-page");
    if (current) {
      document.querySelectorAll(".main-nav a[data-page]").forEach((link) => {
        if (link.getAttribute("data-page") === current) {
          link.classList.add("active");
        }
      });
    }

    // ---------- سنة التذييل ----------
    const yearEl = document.getElementById("footerYear");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });

  // ---------- أدوات مشتركة للمفضلة (localStorage) ----------
  window.CopticFavorites = {
    KEY: "coptic-academy-favorites",
    getAll() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY)) || [];
      } catch {
        return [];
      }
    },
    isFav(id) {
      return this.getAll().includes(id);
    },
    toggle(id) {
      let favs = this.getAll();
      if (favs.includes(id)) favs = favs.filter((f) => f !== id);
      else favs.push(id);
      localStorage.setItem(this.KEY, JSON.stringify(favs));
      return favs.includes(id);
    }
  };
})();
