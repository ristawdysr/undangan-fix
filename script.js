AOS.init({
  duration: 1000,
  once: true
});

// =======================
// ELEMENT
// =======================

const openBtn = document.getElementById("openBtn");
const cover = document.getElementById("cover");
const mainContent = document.getElementById("mainContent");

const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

const guestPopup = document.getElementById("guestPopup");
const closePopup = document.getElementById("closePopup");

// pindahkan tombol ke body agar sticky
document.body.appendChild(menuBtn);
document.body.appendChild(sideMenu);
document.body.appendChild(musicBtn);
document.body.appendChild(guestPopup);

// sembunyikan hamburger & music saat masih cover
menuBtn.classList.add("hidden");
sideMenu.classList.add("hidden");
musicBtn.classList.add("hidden");

// =======================
// AMBIL NAMA TAMU DARI URL
// contoh: index.html?to=Rista&ket=Istri
// =======================

const params = new URLSearchParams(window.location.search);
const guest = params.get("to") || "Tamu Undangan";
const ket = params.get("ket") || "";

document.getElementById("guestName").textContent = guest;
document.getElementById("popupGuestName").textContent = guest;

const guestKet = document.getElementById("guestKet");

if (guestKet) {
  guestKet.textContent = ket;
}
// =======================
// BUKA UNDANGAN
// =======================

let popupHasShown = false;
let invitationOpened = false;

function showGuestPopup() {
  if (popupHasShown) return;

  guestPopup.classList.remove("hidden");
  guestPopup.classList.remove("fade-out");

  lockScroll();

  // sembunyikan hamburger saat popup Hi muncul
  menuBtn.classList.add("hidden");

  popupHasShown = true;
}

function triggerPopupOnScroll() {
  if (!invitationOpened) return;
  showGuestPopup();
}

/*
window.addEventListener("wheel", triggerPopupOnScroll, { passive: true });
window.addEventListener("touchmove", triggerPopupOnScroll, { passive: true });
window.addEventListener("scroll", triggerPopupOnScroll, { passive: true });


window.addEventListener("scroll", () => {
  if (!invitationOpened) return;
  if (popupHasShown) return;

  if (window.scrollY > 40) {
    showGuestPopup();
  }
});

*/

// POPUP TAMU SEMENTARA DINONAKTIFKAN
if (guestPopup) {
  guestPopup.classList.add("hidden");
}


// =======================
// MUSIC MULAI DARI AWAL
// =======================

openBtn.addEventListener("click", () => {
  cover.classList.add("cover-up");

  setTimeout(() => {
    cover.style.display = "none";

    mainContent.classList.remove("hidden");
    mainContent.classList.add("main-show");

    musicBtn.classList.remove("hidden");
    menuBtn.classList.remove("hidden");
    sideMenu.classList.remove("hidden");

    window.scrollTo(0, 0);

    invitationOpened = true;


    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {
      console.log("Autoplay musik diblokir browser");
    });

    musicBtn.classList.remove("pause");

    AOS.refresh();
  }, 900);
});

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.remove("pause");
  } else {
    bgMusic.pause();
    musicBtn.classList.add("pause");
  }
});

// =======================
// MENU HAMBURGER
// =======================

let lockedScrollY = 0;

function lockScroll() {
  lockedScrollY = window.scrollY;

  document.documentElement.classList.add("scroll-locked");
  document.body.classList.add("scroll-locked");

  document.body.style.top = `-${lockedScrollY}px`;
}

function unlockScroll() {
  document.documentElement.classList.remove("scroll-locked");
  document.body.classList.remove("scroll-locked");

  document.body.style.top = "";

  window.scrollTo(0, lockedScrollY);
}

function lockPageScroll() {

  lockedScrollY = window.scrollY;

  document.body.classList.add("menu-open");

  document.body.style.top =
    `-${lockedScrollY}px`;
}

function unlockPageScroll() {

  document.body.classList.remove("menu-open");

  document.body.style.top = "";

  window.scrollTo(0, lockedScrollY);
}

menuBtn.addEventListener("click", (e) => {

  e.stopPropagation();

  sideMenu.classList.add("active");
  menuBtn.classList.add("hide");

  lockScroll();
});

closeMenu.addEventListener("click", (e) => {

  e.stopPropagation();

  sideMenu.classList.remove("active");
  menuBtn.classList.remove("hide");

  unlockScroll();
});

document.querySelectorAll(".side-menu a").forEach((link) => {

  link.addEventListener("click", () => {

    sideMenu.classList.remove("active");
    menuBtn.classList.remove("hide");

    unlockScroll();

  });

});

document.addEventListener("click", (e) => {

  const isMenuOpen =
    sideMenu.classList.contains("active");

  if (
    isMenuOpen &&
    !sideMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {

    sideMenu.classList.remove("active");
    menuBtn.classList.remove("hide");

    unlockPageScroll();

  }

});

sideMenu.addEventListener("click", (e) => {
  e.stopPropagation();
});

// =======================
// POPUP TAMU
// =======================

function hidePopup() {
  if (guestPopup.classList.contains("hidden")) return;

  guestPopup.classList.add("fade-out");

  setTimeout(() => {
    guestPopup.classList.add("hidden");
    guestPopup.classList.remove("fade-out");

    unlockScroll();

    // tampilkan hamburger lagi setelah popup ditutup
    menuBtn.classList.remove("hidden");

  }, 400);
}

closePopup.addEventListener("click", hidePopup);

guestPopup.addEventListener("click", (e) => {
  if (e.target === guestPopup) {
    hidePopup();
  }
});

// =======================
// COUNTDOWN
// =======================

function updateCountdown() {
  const target = new Date("May 31, 2026 10:00:00").getTime();
  const now = new Date().getTime();
  const distance = target - now;

  if (distance <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  document.getElementById("days").textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent = Math.floor((distance / (1000 * 60 * 60)) % 24);
  document.getElementById("minutes").textContent = Math.floor((distance / (1000 * 60)) % 60);
  document.getElementById("seconds").textContent = Math.floor((distance / 1000) % 60);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// =======================
// RSVP OPTION BUTTON
// =======================

const attendanceButtons = document.querySelectorAll(".attendance-btn");
const attendanceInput = document.getElementById("attendanceStatus");

attendanceButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    attendanceButtons.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    attendanceInput.value = btn.dataset.value;
  });
});

// =======================
// GALLERY FADE DARI TENGAH
// =======================

const galleryImages = document.querySelectorAll(".gallery-grid img");

const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

galleryImages.forEach((img) => {
  galleryObserver.observe(img);
});

// =======================
// COPY TO CLIPBOARD
// =======================

const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const text = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(text);

      const originalIcon = button.innerHTML;
      button.innerHTML = '<i class="ri-check-line"></i>';

      setTimeout(() => {
        button.innerHTML = originalIcon;
      }, 1200);
    } catch (error) {
      alert("Gagal menyalin.");
    }
  });
});

// =======================
// SUPABASE SETUP
// =======================

const SUPABASE_URL = "https://uazzbikvmhbdznywifey.supabase.co";
const SUPABASE_KEY = "sb_publishable_xoIyGqBfkzXsFPSVGF2E4A_zDWKQnMz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const wishForm = document.getElementById("wishForm");
const wishList = document.getElementById("wishList");

const successPopup =
  document.getElementById("successPopup");

const closeSuccessPopup =
  document.getElementById("closeSuccessPopup");

// =======================
// LOAD WISHES
// =======================

async function loadWishes() {
  const { data, error } = await supabaseClient
    .from("wedding_wishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("Gagal mengambil ucapan:", error);
    return;
  }

  wishList.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "wish-item";

    div.innerHTML = `
      <strong>${escapeHTML(item.name)}</strong>
      <small>${escapeHTML(item.attendance)}</small>
      <p>${escapeHTML(item.message)}</p>
    `;

    wishList.appendChild(div);
  });

  // duplicate isi supaya animasi scroll ke atas terlihat loop
  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "wish-item";

    div.innerHTML = `
      <strong>${escapeHTML(item.name)}</strong>
      <small>${escapeHTML(item.attendance)}</small>
      <p>${escapeHTML(item.message)}</p>
    `;

    wishList.appendChild(div);
  });
}

// =======================
// SUBMIT RSVP
// =======================

wishForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("nameInput").value.trim();
  const attendance = document.getElementById("attendanceStatus").value;
  const message = document.getElementById("messageInput").value.trim();

  if (!name || !attendance || !message) {
    alert("Mohon lengkapi semua data.");
    return;
  }

  const { error } = await supabaseClient
    .from("wedding_wishes")
    .insert([
      {
        name,
        attendance,
        message,
        guest_name: guest || null,
        guest_note: ket || null
      }
    ]);

    if (error) {
        alert("Ucapan gagal dikirim.");
        console.log("Gagal mengirim ucapan:", error);
        return;
    }

    successPopup.classList.remove("hidden");

    wishForm.reset();

    attendanceInput.value = "Hadir";

    attendanceButtons.forEach((item) =>
        item.classList.remove("active")
    );

    attendanceButtons[0].classList.add("active");

    loadWishes();
});

loadWishes();

// =======================
// PROTEKSI HTML SEDERHANA
// =======================

function escapeHTML(text) {
  if (!text) return "";

  return text
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const fadeItems = document.querySelectorAll(".fade-scroll");

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.25
});

fadeItems.forEach((item) => {
  fadeObserver.observe(item);
});

const fadeLines = document.querySelectorAll(".fade-line");

const fadeLineObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.25
});

fadeLines.forEach((item) => {
  fadeLineObserver.observe(item);
});

// =======================
// REFRESH BALIK KE COVER
// =======================

if (
  performance.getEntriesByType("navigation")[0]?.type === "reload"
) {
  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );
}

// =======================
// UPLOAD + PHOTOS
// =======================

const photoUpload =
  document.getElementById("photoUpload");

const cameraUpload =
  document.getElementById("cameraUpload");

const uploadSubmitBtn =
  document.getElementById("uploadSubmitBtn");

const selectedFile =
  document.getElementById("selectedFile");

const uploadStatus =
  document.getElementById("uploadStatus");

const photosGrid =
  document.getElementById("photosGrid");

let selectedPhoto = null;

function setSelectedPhoto(file) {

  selectedPhoto = file;

  if (selectedPhoto) {

    selectedFile.textContent =
      `Foto dipilih: ${selectedPhoto.name}`;

    uploadStatus.textContent = "";
  }
}

if (photoUpload) {

  photoUpload.addEventListener("change", (e) => {

    setSelectedPhoto(e.target.files[0]);

  });
}

if (cameraUpload) {

  cameraUpload.addEventListener("change", (e) => {

    setSelectedPhoto(e.target.files[0]);

  });
}

// =======================
// COMPRESS FOTO
// =======================

function compressImage(
  file,
  maxWidth = 1600,
  quality = 0.75
) {

  return new Promise((resolve) => {

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {

      const canvas =
        document.createElement("canvas");

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {

        height = Math.round(
          (height * maxWidth) / width
        );

        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx =
        canvas.getContext("2d");

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(
        (blob) => {

          if (!blob) {
            resolve(file);
            return;
          }

          const compressedFile =
            new File(
              [blob],
              `photo-${Date.now()}.jpg`,
              {
                type: "image/jpeg"
              }
            );

          resolve(compressedFile);

        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
}

// =======================
// GOOGLE DRIVE RAW UPLOAD
// =======================

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzXsNlOSX5EufUPgQjrVgnCksZtC0GKZgCbp_MPRx-yNnBk8_jCA-NKwgSQISNnKY0/exec";

function fileToBase64(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = () => {

      const base64 =
        reader.result.split(",")[1];

      resolve(base64);

    };

    reader.onerror = reject;

    reader.readAsDataURL(file);

  });

}

async function uploadRawToGoogleDrive(file) {
  const base64 = await fileToBase64(file);

  const formData = new FormData();
  const cleanGuestName =
    (guest || "tamu")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

  const cleanKet =
    (ket || "guest")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();

  const uploadNumber =
    String(
      Math.floor(Math.random() * 999) + 1
    ).padStart(3, "0");

  const finalFileName =
    `${cleanKet}-${cleanGuestName}-${uploadNumber}.jpg`;
  formData.append("mimeType", file.type);
  formData.append("base64", base64);

  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    body: formData
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Upload RAW gagal");
  }

  return result;
}

// =======================
// UPLOAD FOTO
// =======================

if (uploadSubmitBtn) {

  uploadSubmitBtn.addEventListener(
    "click",
    async () => {

      if (!selectedPhoto) {

        uploadStatus.textContent =
          "Pilih foto terlebih dahulu.";

        return;
      }

      if (
        selectedPhoto.size >
        12 * 1024 * 1024
      ) {

        uploadStatus.textContent =
          "Ukuran foto maksimal 12MB.";

        return;
      }

      uploadSubmitBtn.disabled = true;

      uploadStatus.textContent =
        "Mengupload file asli...";

      await uploadRawToGoogleDrive(
        selectedPhoto
      );

      uploadStatus.textContent =
        "Mengompres foto...";

      const compressedPhoto =
        await compressImage(selectedPhoto);

      const finalPhoto =
        compressedPhoto;

      uploadStatus.textContent =
        "Mengupload foto...";

      const fileName =
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.jpg`;

      const filePath = fileName;

      const { error: uploadError } =
        await supabaseClient.storage
          .from("weddingphotos")
          .upload(filePath, finalPhoto, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: false
          });

      if (uploadError) {

        console.log(
          "UPLOAD ERROR:",
          uploadError
        );

        uploadStatus.textContent =
          uploadError.message ||
          "Upload gagal.";

        uploadSubmitBtn.disabled = false;

        return;
      }

      const {
        data: publicUrlData
      } = supabaseClient.storage
        .from("weddingphotos")
        .getPublicUrl(filePath);

      const imageUrl =
        publicUrlData.publicUrl;

      const { error: dbError } =
        await supabaseClient
          .from("wedding_uploads")
          .insert([
            {
              image_url: imageUrl,
              file_name: fileName
            }
          ]);

      if (dbError) {

        console.log(
          "DB ERROR:",
          dbError
        );

        uploadStatus.textContent =
          dbError.message ||
          "Foto terupload, tapi gagal tersimpan.";

        uploadSubmitBtn.disabled = false;

        return;
      }

      uploadStatus.textContent =
        "Foto berhasil dikirim.";

      selectedFile.textContent = "";

      photoUpload.value = "";
      cameraUpload.value = "";

      selectedPhoto = null;

      uploadSubmitBtn.disabled = false;

      loadPhotos();

        uploadStatus.innerHTML = `
          <div class="upload-success-box">
            <div class="success-icon">
              <i class="ri-check-line"></i>
            </div>

            <h4>Foto Berhasil Dikirim</h4>

            <p>
              Terima kasih sudah membagikan
              momen indah bersama kami.
            </p>

            <button
              id="openGalleryAfterUpload"
              class="main-btn"
              type="button"
            >
              Lihat Gallery
            </button>
          </div>
        `;

        document
          .getElementById("openGalleryAfterUpload")
          ?.addEventListener("click", () => {

            hideUploadPopup();
            showPhotosPopup();

          });
    }
  );
}

// =======================
// LOAD PHOTO
// =======================

async function loadPhotos() {

  if (!photosGrid) return;

  const { data, error } =
    await supabaseClient
      .from("wedding_uploads")
      .select("*")
      .order("created_at", {
        ascending: false
      });

  if (error) {

    console.log(
      "PHOTO LOAD ERROR:",
      error
    );

    photosGrid.innerHTML =
      `<p class="upload-status">${error.message}</p>`;

    return;
  }

  if (!data || data.length === 0) {

    photosGrid.innerHTML =
      `<p class="upload-status">Belum ada foto yang diupload.</p>`;

    return;
  }

  photosGrid.innerHTML = "";

  data.forEach((item, index) => {

    const div =
      document.createElement("div");

    div.className = "photo-item";

    div.style.animationDelay =
      `${index * 0.06}s`;

    div.innerHTML = `
      <img
        src="${item.image_url}"
        alt="Wedding Photo"
        loading="lazy"
      >
    `;

    photosGrid.appendChild(div);

  });
}

loadPhotos();


// =======================
// POPUP UPLOAD + PHOTOS
// =======================

const openUploadPopup =
  document.getElementById("openUploadPopup");

const openPhotosPopup =
  document.getElementById("openPhotosPopup");

const uploadPopup =
  document.getElementById("uploadPopup");

const photosPopup =
  document.getElementById("photosPopup");

if (uploadPopup) {
  document.body.appendChild(uploadPopup);
}

if (photosPopup) {
  document.body.appendChild(photosPopup);
}

const closeUploadPopup =
  document.getElementById("closeUploadPopup");

const closePhotosPopup =
  document.getElementById("closePhotosPopup");

const openPhotosFromUpload =
  document.getElementById("openPhotosFromUpload");

const openUploadFromPhotos =
  document.getElementById("openUploadFromPhotos");

function showUploadPopup() {
  if (!uploadPopup) return;

  document.body.classList.add("modal-open");
  uploadPopup.classList.remove("hidden");
}

function hideUploadPopup() {
  if (!uploadPopup) return;

  uploadPopup.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

function showPhotosPopup() {
  if (!photosPopup) return;

  document.body.classList.add("modal-open");
  photosPopup.classList.remove("hidden");
  loadPhotos();
}

function hidePhotosPopup() {
  if (!photosPopup) return;

  photosPopup.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

if (openUploadPopup) {
  openUploadPopup.addEventListener("click", showUploadPopup);
}

if (openPhotosPopup) {
  openPhotosPopup.addEventListener("click", showPhotosPopup);
}

if (closeUploadPopup) {
  closeUploadPopup.addEventListener("click", hideUploadPopup);
}

if (closePhotosPopup) {
  closePhotosPopup.addEventListener("click", hidePhotosPopup);
}

if (openPhotosFromUpload) {
  openPhotosFromUpload.addEventListener("click", () => {
    hideUploadPopup();
    showPhotosPopup();
  });
}

if (openUploadFromPhotos) {
  openUploadFromPhotos.addEventListener("click", () => {
    hidePhotosPopup();
    showUploadPopup();
  });
}

if (uploadPopup) {
  uploadPopup.addEventListener("click", (e) => {
    if (e.target === uploadPopup) {
      hideUploadPopup();
    }
  });
}

if (photosPopup) {
  photosPopup.addEventListener("click", (e) => {
    if (e.target === photosPopup) {
      hidePhotosPopup();
    }
  });
}


// =======================
// GLOBAL FADE IN OBSERVER
// =======================

const globalFadeItems = document.querySelectorAll(`
  .section-inner,
  .couple-text,
  .story-text,
  .event-card,
  .rundown-title,
  .frame-img,
  .frame-buttons,
  .rsvp-form,
  .wish-ticker,
  .gift-card,
  .ending-content
`);

const globalFadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.18
});

globalFadeItems.forEach((item) => {
  globalFadeObserver.observe(item);
});

// =====================================================
// AUTO FADE SEMUA ELEMEN
// =====================================================

const autoFadeSelectors = `
section h1,
section h2,
section h3,
section h4,
section h5,
section p,
section a,
section img,
section .event-card,
section .gift-card,
section .gallery-grid img,
section .countdown-box,
section .rsvp-form,
section .wish-ticker,
section .frame-buttons,
section .journey-images,
section .line,
section .verse,
section .intro-ornament,
section .signature,
section .story-text,
section .photos-grid,
section .photo-item
`;

const autoFadeElements =
  document.querySelectorAll(autoFadeSelectors);

autoFadeElements.forEach((el) => {
  el.classList.add("fade-auto");
});

const autoFadeObserver =
  new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

      }

    });

  }, {
    threshold: 0.12
  });

autoFadeElements.forEach((el) => {
  autoFadeObserver.observe(el);
});

// =======================
// SUCCESS POPUP
// =======================

if (closeSuccessPopup) {

  closeSuccessPopup.addEventListener(
    "click",
    () => {

      successPopup.classList.add("hidden");

    }
  );
}

if (successPopup) {

  successPopup.addEventListener(
    "click",
    (e) => {

      if (e.target === successPopup) {

        successPopup.classList.add("hidden");

      }

    }
  );
}

// =======================
// SAVE DATE
// =======================

const saveDateBtn = document.getElementById("saveDateBtn");

if (saveDateBtn) {
  saveDateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const title = encodeURIComponent("Wedding Pedro & Rista");
    const details = encodeURIComponent(
      "Pemberkatan dan resepsi pernikahan Pedro & Rista"
    );
    const location = encodeURIComponent("Gereja St. Theresia Sedayu");

    const googleCalendarUrl =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${title}` +
      `&dates=20260531T030000Z/20260531T100000Z` +
      `&details=${details}` +
      `&location=${location}`;

    window.location.href = googleCalendarUrl;
  });
}


// =======================
// OPEN MAP APP MOBILE
// =======================

document.querySelectorAll(".map-link").forEach((link) => {

  link.addEventListener("click", (e) => {

    e.preventDefault();

    const query =
      encodeURIComponent(link.dataset.query);

    const isAndroid =
      /Android/i.test(navigator.userAgent);

    const isiPhone =
      /iPhone|iPad|iPod/i.test(navigator.userAgent);

    // ANDROID → buka app maps langsung
    if (isAndroid) {

      window.location.href =
        `geo:0,0?q=${query}`;

      return;
    }

    // IPHONE → buka apple/google maps
    if (isiPhone) {

      window.location.href =
        `https://maps.apple.com/?q=${query}`;

      return;
    }

    // DESKTOP
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );

  });

});

// =======================
// HERO TO INTRO VIA ARROW ONLY
// =======================

const introSection = document.getElementById("intro");

let allowArrowMove = false;

function getIntroY() {
  return introSection.offsetTop;
}

document.querySelector(".down-arrow")?.addEventListener("click", (e) => {
  e.preventDefault();

  allowArrowMove = true;

  window.scrollTo({
    top: getIntroY(),
    behavior: "smooth"
  });

  setTimeout(() => {
    allowArrowMove = false;
  }, 900);
});

window.addEventListener(
  "wheel",
  (e) => {
    if (!invitationOpened || allowArrowMove) return;

    const introY = getIntroY();
    const y = window.scrollY;

    // HERO tidak bisa scroll ke bawah
    if (y < introY && e.deltaY > 0) {
      e.preventDefault();
    }
  },
  { passive: false }
);

let touchStartY = 0;

window.addEventListener(
  "touchstart",
  (e) => {
    touchStartY = e.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  (e) => {
    if (!invitationOpened || allowArrowMove) return;

    const introY = getIntroY();
    const y = window.scrollY;
    const nowY = e.touches[0].clientY;

    const swipeUp = touchStartY - nowY > 6;

    // HERO tidak bisa swipe ke bawah
    if (y < introY && swipeUp) {
      e.preventDefault();
    }
  },
  { passive: false }
);