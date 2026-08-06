/* =========== صفحة الدرس الفردية =================== */

function getLessonIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}


function getYoutubeEmbed(url) {
  try {
    const u = new URL(url);

    // رابط youtu.be
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }

    // رابط youtube.com/watch?v=
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    // رابط embed جاهز
    if (u.pathname.startsWith("/embed/")) {
      return url;
    }
  } catch (e) {
    console.error(e);
  }

  return "";
}

/* تحويل رابط Google Drive العادي إلى رابط preview قابل للعرض داخل iframe */
function getGoogleDriveEmbed(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("drive.google.com")) return "";

    // شكل: https://drive.google.com/file/d/FILE_ID/view
    const match = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    // شكل: https://drive.google.com/open?id=FILE_ID
    const idParam = u.searchParams.get("id");
    if (idParam) {
      return `https://drive.google.com/file/d/${idParam}/preview`;
    }

    // شكل جاهز بالفعل: .../preview
    if (u.pathname.includes("/preview")) {
      return url;
    }
  } catch (e) {
    console.error(e);
  }

  return "";
}

/* تحديد نوع مصدر الفيديو: يوتيوب / جوجل درايف / ملف محلي على السيرفر */
function resolveVideoSource(url) {
  if (!url) return null;

  // لو الرابط مش رابط كامل (http/https) هنعتبره ملف محلي على السيرفر
  const isFullUrl = /^https?:\/\//i.test(url);

  if (isFullUrl) {
    try {
      const u = new URL(url);

      if (u.hostname.includes("youtube.com") || u.hostname === "youtu.be") {
        const embed = getYoutubeEmbed(url);
        if (embed) return { type: "iframe", src: embed };
      }

      if (u.hostname.includes("drive.google.com")) {
        const embed = getGoogleDriveEmbed(url);
        if (embed) return { type: "iframe", src: embed };
      }
    } catch (e) {
      console.error(e);
    }

    // رابط فيديو مباشر (مثلاً ملف .mp4 مرفوع على سيرفر خارجي)
    return { type: "local", src: url };
  }

  // مسار محلي داخل المشروع (مثلاً videos/lesson1.mp4)
  return { type: "local", src: url };
}


function renderLesson() {
  const id = getLessonIdFromURL();
  const lesson = LESSONS.find((l) => l.id === id);
  const root = document.getElementById("lessonRoot");

  if (!lesson) {
    root.innerHTML = `
      <div class="empty-state">
        <div class="glyph">Ⲁ</div>
        <h3>لم يتم العثور على الدرس</h3>
        <p>الرابط غير صحيح أو تم حذف هذا الدرس.</p>
        <a class="btn btn-gold" style="margin-top:18px" href="videos.html">↩ العودة إلى كل الدروس</a>
      </div>`;
    return;
  }

  document.title = `${lesson.title} — اللغة القبطية`;

  /* ---------- الفيديو ---------- */
  const videoSource = resolveVideoSource(lesson.video);

  let videoFrame;
  if (!videoSource) {
    videoFrame = `<div class="video-placeholder">
         <div class="glyph">🎥</div>
         <p>سيتم إضافة فيديو هذا الدرس قريبًا</p>
       </div>`;
  } else if (videoSource.type === "iframe") {
    videoFrame = `<iframe
      width="100%"
      src="${videoSource.src}"
      title="${lesson.title}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>`;
  } else {
    videoFrame = `<video
      width="100%"
      src="${videoSource.src}"
      title="${lesson.title}"
      controls
      preload="metadata">
      متصفحك لا يدعم عرض الفيديو.
    </video>`;
  }

  const videoActions = lesson.video
    ? `<div class="video-actions">
         <a class="btn btn-outline" href="${lesson.video}" download>⬇ تحميل الفيديو</a>
       </div>`
    : "";

  /* ---------- قسم PDF (يُخفى تلقائيًا إن لم توجد ملفات) ---------- */
  const pdfSection = lesson.pdfs && lesson.pdfs.length
    ? `
    <div class="resource-block" id="pdfBlock">
      <div class="illum-title">
        <span class="illum-letter">Ⲡ̣</span>
        <div><h2>  ⁙ ملفات PDF الخاصة بالدرس ⁙</h2><p>حمّل ملفات المراجعة الخاصة بهذا الدرس</p></div>
      </div>
      <div class="pdf-list">
        ${lesson.pdfs.map((p) => `
          <div class="pdf-item">
  <div class="pdf-icon">📕</div>
  <div class="pdf-info">
    <strong>${p.title}</strong>
    <span>${p.size || ""}</span>
  </div>
  <a class="pdf-dl" href="${p.file}" target="_blank" rel="noopener">👁 مشاهدة</a>
  <a class="pdf-dl" href="${p.file}" download>⬇ تحميل</a>
</div>
          `).join("")}
      </div>
    </div>`
    : "";

  /* ---------- قسم الصور (يُخفى تلقائيًا إن لم توجد صور) ---------- */
  const imagesSection = lesson.images && lesson.images.length
    ? `
    <div class="resource-block" id="imagesBlock">
      <div class="illum-title">
        <span class="illum-letter">Ⲓ̣</span>
        <div><h2>⁙ صور ⁙</h2><p>اضغط على أي صورة لتكبيرها</p></div>
      </div>
      <div class="gallery-grid">
        ${lesson.images.map((src) => `<img src="${src}" alt="${lesson.title}" data-lightbox="${src}">`).join("")}
      </div>
    </div>`
    : "";

  root.innerHTML = `
    <div class="lesson-hero">
      <span class="lesson-num">${lesson.category} · درس رقم ${lesson.id}</span>
      <h1>${lesson.title}</h1>
    </div>

    <div class="video-frame">${videoFrame}</div>
    ${videoActions}

    <div class="divider-braid"></div>

    <div class="lesson-explain">
      <div class="illum-title">
        <span class="illum-letter">Ⲉ̣</span>
        <div><h2>⁙ شرح الدرس ⁙</h2></div>
      </div>
      <p>${lesson.explanation}</p>
    </div>

    ${pdfSection ? `<div class="divider-braid"></div>${pdfSection}` : ""}
    ${imagesSection ? `<div class="divider-braid"></div>${imagesSection}` : ""}
  `;

  wireLightbox();
  renderPager(id);
}

function renderPager(currentId) {
  const idx = LESSONS.findIndex((l) => l.id === currentId);
  const prev = LESSONS[idx - 1];
  const next = LESSONS[idx + 1];
  const pager = document.getElementById("lessonPager");

  pager.innerHTML = `
    ${prev
      ? `<a class="pager-btn prev" href="lesson.html?id=${prev.id}">
           <span>→</span>
           <span><span class="lbl">الدرس السابق</span><br><span class="ttl">${prev.title}</span></span>
         </a>`
      : `<span class="pager-btn disabled"><span class="lbl">لا يوجد درس سابق</span></span>`}
    ${next
      ? `<a class="pager-btn next" href="lesson.html?id=${next.id}">
           <span><span class="lbl">الدرس التالي</span><br><span class="ttl">${next.title}</span></span>
           <span>←</span>
         </a>`
      : `<span class="pager-btn disabled next"><span class="lbl">لا يوجد درس تالٍ</span></span>`}
  `;
}

function wireLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxDl = document.getElementById("lightboxDl");
  if (!lightbox) return;

  document.querySelectorAll("[data-lightbox]").forEach((img) => {
    img.addEventListener("click", () => {
      const src = img.getAttribute("data-lightbox");
      lightboxImg.src = src;
      lightboxDl.href = src;
      lightbox.classList.add("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderLesson();

  const lightbox = document.getElementById("lightbox");
  const closeBtn = document.getElementById("lightboxClose");
  if (closeBtn) closeBtn.addEventListener("click", () => lightbox.classList.remove("open"));
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.classList.remove("open");
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox) lightbox.classList.remove("open");
  });
});