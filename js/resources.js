
function buildBookCard(book) {
  return `
    <div class="book-card">
      <div class="book-cover">ⳳ</div>
      <h3>${book.title}</h3>
      <p>${book.description}</p>
      ${book.file
        ? `<a class="btn btn-outline" href="${book.file}" target="_blank" rel="noopener">👁 مشاهدة</a>
        <br><br>
<a class="btn btn-outline" href="${book.file}" download>📥 تحميل</a>`
        : `<span class="btn btn-outline" style="opacity:.5;pointer-events:none">قريبًا</span>`}
    </div>`;
}

function renderBooks() {
  const wrap = document.getElementById("booksGrid");
  if (!wrap) return;
  if (!BOOKS.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="glyph">ⲡ</div><h3>لا توجد كتب بعد</h3><p>سيتم إضافة الكتب وملفات PDF قريبًا.</p></div>`;
    return;
  }
  wrap.innerHTML = BOOKS.map(buildBookCard).join("");
}

function renderGallery() {
  const wrap = document.getElementById("galleryGrid");
  if (!wrap) return;
  if (!GALLERY_IMAGES.length) {
    wrap.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="glyph">ⲓ</div><h3>لا توجد صور بعد</h3><p>سيتم إضافة معرض الصور قريبًا.</p></div>`;
    return;
  }
wrap.innerHTML = GALLERY_IMAGES
  .map((item) => `
    <div class="gallery-item">
      <img
        src="${item.src}"
        alt="${item.title}"
        data-lightbox="${item.src}"
      >
      <h4 class="gallery-title">${item.title}</h4>
    </div>
  `)
  .join("");
  wireLightboxResources();
}

function wireLightboxResources() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxDl = document.getElementById("lightboxDl");
  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.getAttribute("data-lightbox");
      lightboxDl.href = img.getAttribute("data-lightbox");
      lightbox.classList.add("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
  renderGallery();

  const tabs = document.querySelectorAll(".res-tab");
  const panels = {
    books: document.getElementById("booksPanel"),
    gallery: document.getElementById("galleryPanel")
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.getAttribute("data-tab");
      Object.entries(panels).forEach(([key, el]) => {
        if (!el) return;
        el.style.display = key === target ? "" : "none";
      });
      searchResources();
    });
  });



const searchInput = document.getElementById("searchInput");

function searchResources() {
  const value = searchInput.value.trim().toLowerCase();

  // لو تبويب الكتب مفتوح
  if (panels.books.style.display !== "none") {
    const filteredBooks = BOOKS.filter(book =>
      book.title.toLowerCase().includes(value) ||
      book.description.toLowerCase().includes(value)
    );

    document.getElementById("booksGrid").innerHTML =
      filteredBooks.length
        ? filteredBooks.map(buildBookCard).join("")
        : `
          <div class="empty-state" style="grid-column:1/-1">
            <div class="glyph">Ⲁ̣</div>
            <h3>لا توجد نتائج</h3>
          </div>
        `;
  }

  // لو تبويب الصور مفتوح
  if (panels.gallery.style.display !== "none") {
    const filteredImages = GALLERY_IMAGES.filter(img =>
      img.title.toLowerCase().includes(value)
    );

    const gallery = document.getElementById("galleryGrid");

    gallery.innerHTML =
      filteredImages.length
        ? filteredImages.map(item => `
            <div class="gallery-item">
              <img
                src="${item.src}"
                alt="${item.title}"
                data-lightbox="${item.src}">
              <h4 class="gallery-title">${item.title}</h4>
            </div>
          `).join("")
        : `
          <div class="empty-state" style="grid-column:1/-1">
            <div class="glyph">Ⲁ̣</div>
            <h3>لا توجد نتائج</h3>
          </div>
        `;

    wireLightboxResources();
  }
}

searchInput.addEventListener("input", searchResources);


  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  if (closeBtn) closeBtn.addEventListener("click", () => lightbox.classList.remove("open"));
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
  }
});
