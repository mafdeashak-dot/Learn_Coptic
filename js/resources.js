function renderGallery() {
  const wrap = document.getElementById("galleryGrid");

  if (!wrap) return;

  if (!GALLERY_IMAGES.length) {
    wrap.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="glyph">ⲓ</div>
        <h3>لا توجد صور بعد</h3>
        <p>سيتم إضافة معرض الصور قريبًا.</p>
      </div>
    `;
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

  if (!lightbox || !lightboxImg || !lightboxDl) return;

  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("data-lightbox");

      lightboxImg.src = src;
      lightboxDl.href = src;

      lightbox.classList.add("open");
    });
  });
}


function searchResources() {
  const searchInput = document.getElementById("searchInput");
  const gallery = document.getElementById("galleryGrid");

  if (!searchInput || !gallery) return;

  const value = searchInput.value.trim().toLowerCase();

  const filteredImages = GALLERY_IMAGES.filter(img =>
    img.title.toLowerCase().includes(value)
  );

  gallery.innerHTML = filteredImages.length
    ? filteredImages
        .map(item => `
          <div class="gallery-item">
            <img
              src="${item.src}"
              alt="${item.title}"
              data-lightbox="${item.src}"
            >
            <h4 class="gallery-title">${item.title}</h4>
          </div>
        `)
        .join("")
    : `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="glyph">Ⲁ̣</div>
        <h3>لا توجد نتائج</h3>
      </div>
    `;

  wireLightboxResources();
}


document.addEventListener("DOMContentLoaded", () => {

  renderGallery();

  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", searchResources);
  }


  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");

  if (closeBtn && lightbox) {
    closeBtn.addEventListener("click", () => {
      lightbox.classList.remove("open");
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("open");
      }
    });
  }

});
