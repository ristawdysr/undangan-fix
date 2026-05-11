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
document.body.appendChild(guestPopup);

// =======================
// AMBIL NAMA TAMU DARI URL
// contoh: index.html?to=Bapak%20Andi&ket=Keluarga
// =======================

const params = new URLSearchParams(window.location.search);
const guest = params.get("to") || "Tamu Undangan";
const ket = params.get("ket") || "";

document.getElementById("guestName").textContent = guest;
document.getElementById("popupGuestName").textContent = guest;

// =======================
// BUKA UNDANGAN
// =======================

let popupHasShown = false;
let invitationOpened = false;

function showGuestPopup() {
  if (popupHasShown) return;

  guestPopup.classList.remove("hidden");
  guestPopup.classList.remove("fade-out");
  popupHasShown = true;
}

function triggerPopupOnScroll() {
  if (!invitationOpened) return;
  showGuestPopup();
}

window.addEventListener("wheel", triggerPopupOnScroll, { passive: true });
window.addEventListener("touchmove", triggerPopupOnScroll, { passive: true });
window.addEventListener("scroll", triggerPopupOnScroll, { passive: true });

openBtn.addEventListener("click", () => {
  cover.classList.add("cover-up");

  setTimeout(() => {
    cover.style.display = "none";

    mainContent.classList.remove("hidden");
    mainContent.classList.add("main-show");

    musicBtn.classList.remove("hidden");

    window.scrollTo(0, 0);

    invitationOpened = true;

    bgMusic.play().catch(() => {
      console.log("Autoplay musik diblokir browser");
    });

    AOS.refresh();
  }, 900);
});

window.addEventListener("scroll", () => {
  if (!invitationOpened) return;
  if (popupHasShown) return;

  if (window.scrollY > 40) {
    showGuestPopup();
  }
});


// =======================
// MUSIC
// =======================

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

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sideMenu.classList.add("active");
  menuBtn.classList.add("hide");
});

closeMenu.addEventListener("click", (e) => {
  e.stopPropagation();
  sideMenu.classList.remove("active");
  menuBtn.classList.remove("hide");
});

document.querySelectorAll(".side-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    menuBtn.classList.remove("hide");
  });
});

document.addEventListener("click", (e) => {
  const isMenuOpen = sideMenu.classList.contains("active");

  if (
    isMenuOpen &&
    !sideMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    sideMenu.classList.remove("active");
    menuBtn.classList.remove("hide");
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

  wishForm.reset();
  attendanceInput.value = "Hadir";

  attendanceButtons.forEach((item) => item.classList.remove("active"));
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