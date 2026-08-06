

const COPTIC_GLYPHS = ["ⲁ", "ⲃ", "ⲅ", "ⲇ", "ⲉ", "ⲍ", "ⲏ", "ⲑ", "ⲓ", "ⲕ"];

function glyphFor(id) {
  return COPTIC_GLYPHS[id % COPTIC_GLYPHS.length];
}

function buildLessonCard(lesson) {
  const isFav = window.CopticFavorites ? window.CopticFavorites.isFav(lesson.id) : false;
  const thumbInner = lesson.thumbnail
    ? `<img src="${lesson.thumbnail}" alt="${lesson.title}">`
    : `<div class="thumb-glyph">${glyphFor(lesson.id)}</div>`;

  return `
  <article class="lesson-card" data-category="${lesson.category.join(',')}" data-title="${lesson.title}">
    <div class="thumb-wrap">
      ${thumbInner}
      ${lesson.duration ? `<span class="duration-badge">⏱ ${lesson.duration}</span>` : ""}
      <button class="fav-btn ${isFav ? "active" : ""}" data-fav-id="${lesson.id}" title="إضافة إلى المفضلة" aria-label="إضافة إلى المفضلة">
        ${isFav ? "❤️" : "🤍"}
      </button>
    </div>
    <div class="lesson-body">
<span class="lesson-num">${lesson.category.join(" • ")}</span>
      <h3 class="lesson-title">${lesson.title}</h3>
      <p class="lesson-desc">${lesson.description}</p>
      <a class="watch-btn" href="lesson.html?id=${lesson.id}">▶ مشاهدة الدرس</a>
    </div>
  </article>`;
}

function renderEmptyState(container, message) {
  container.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <div class="glyph">Ⲁ̣</div>
      <h3>لا توجد نتائج</h3>
      <p>${message}</p>
    </div>`;
}

function wireFavButtons(container) {
  container.querySelectorAll("[data-fav-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(btn.getAttribute("data-fav-id"));
      const active = window.CopticFavorites.toggle(id);
      btn.classList.toggle("active", active);
      btn.textContent = active ? "❤️" : "🤍";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- أحدث الدروس في الصفحة الرئيسية ---------- */
  const latestWrap = document.getElementById("latestLessons");
  if (latestWrap) {
    // آخر 3 دروس، بنفس ترتيب ظهورها في صفحة الفيديوهات
  const latest = LESSONS.slice(-3).reverse();
latestWrap.innerHTML = latest.map(buildLessonCard).join("");
wireFavButtons(latestWrap);
  }

  /* ---------- شبكة كل الفيديوهات ---------- */
  const grid = document.getElementById("videoGrid");
  if (!grid) return;

  const searchInput = document.getElementById("searchInput");
  const chips = document.querySelectorAll(".chip[data-category]");
  let activeCategory = "all";

  function currentQuery() {
    return (searchInput && searchInput.value.trim()) || "";
  }

  function render() {
  const q = currentQuery().toLowerCase();

  const filtered = LESSONS.filter((l) => {
    const matchesCategory =
      activeCategory === "all" || l.category.includes(activeCategory);

    const matchesQuery =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    renderEmptyState(grid, "جرّب كلمة بحث مختلفة أو اختر تصنيفًا آخر.");
    return;
  }

  grid.innerHTML = filtered.map(buildLessonCard).join("");
  wireFavButtons(grid);
}

  if (searchInput) searchInput.addEventListener("input", render);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.getAttribute("data-category");
      render();
    });
  });

  render();
});
