const SUPABASE_URL = "https://uazzbikvmhbdznywifey.supabase.co";
const SUPABASE_KEY = "sb_publishable_xoIyGqBfkzXsFPSVGF2E4A_zDWKQnMz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const photosGrid = document.getElementById("photosGrid");
const pageMusic = document.getElementById("pageMusic");
const pageMusicBtn = document.getElementById("pageMusicBtn");

/* MUSIC SAVE */
const MUSIC_TIME = "wedding_music_time";
const MUSIC_PLAYING = "wedding_music_playing";

window.addEventListener("DOMContentLoaded", () => {
  const savedTime = localStorage.getItem(MUSIC_TIME);
  const wasPlaying = localStorage.getItem(MUSIC_PLAYING) === "true";

  if (savedTime) pageMusic.currentTime = Number(savedTime);

  if (wasPlaying) {
    pageMusic.play().catch(() => {});
  }

  loadPhotos();
});

pageMusic.addEventListener("timeupdate", () => {
  localStorage.setItem(MUSIC_TIME, pageMusic.currentTime);
});

pageMusicBtn.addEventListener("click", () => {
  if (pageMusic.paused) {
    pageMusic.play();
    localStorage.setItem(MUSIC_PLAYING, "true");
    pageMusicBtn.classList.remove("pause");
  } else {
    pageMusic.pause();
    localStorage.setItem(MUSIC_PLAYING, "false");
    pageMusicBtn.classList.add("pause");
  }
});

async function loadPhotos() {
  const { data, error } = await supabaseClient
    .from("wedding_uploads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log("PHOTO LOAD ERROR:", error);
    photosGrid.innerHTML = `<p class="upload-status">${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    photosGrid.innerHTML = `<p class="upload-status">Belum ada foto yang diupload.</p>`;
    return;
  }

  photosGrid.innerHTML = "";

  data.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "photo-item";
    div.style.animationDelay = `${index * 0.06}s`;

    div.innerHTML = `
      <img src="${item.image_url}" alt="Wedding Photo" loading="lazy">
    `;

    photosGrid.appendChild(div);
  });
}