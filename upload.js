const SUPABASE_URL = "https://uazzbikvmhbdznywifey.supabase.co";
const SUPABASE_KEY = "sb_publishable_xoIyGqBfkzXsFPSVGF2E4A_zDWKQnMz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const photoUpload = document.getElementById("photoUpload");
const cameraUpload = document.getElementById("cameraUpload");
const uploadSubmitBtn = document.getElementById("uploadSubmitBtn");
const selectedFile = document.getElementById("selectedFile");
const uploadStatus = document.getElementById("uploadStatus");

const pageMusic = document.getElementById("pageMusic");
const pageMusicBtn = document.getElementById("pageMusicBtn");

let selectedPhoto = null;

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

function setSelectedPhoto(file) {
  selectedPhoto = file;

  if (selectedPhoto) {
    selectedFile.textContent = `Foto dipilih: ${selectedPhoto.name}`;
    uploadStatus.textContent = "";
  }
}

photoUpload.addEventListener("change", (e) => {
  setSelectedPhoto(e.target.files[0]);
});

cameraUpload.addEventListener("change", (e) => {
  setSelectedPhoto(e.target.files[0]);
});

/* COMPRESS FOTO */
function compressImage(file, maxWidth = 1600, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          const compressedFile = new File(
            [blob],
            `photo-${Date.now()}.jpg`,
            { type: "image/jpeg" }
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

uploadSubmitBtn.addEventListener("click", async () => {
  if (!selectedPhoto) {
    uploadStatus.textContent = "Pilih foto terlebih dahulu.";
    return;
  }

  if (selectedPhoto.size > 12 * 1024 * 1024) {
    uploadStatus.textContent = "Ukuran foto maksimal 12MB.";
    return;
  }

  uploadSubmitBtn.disabled = true;
  uploadStatus.textContent = "Mengompres foto...";

  const finalPhoto = await compressImage(selectedPhoto);

  uploadStatus.textContent = "Mengupload foto...";

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
  const filePath = fileName;

  const { error: uploadError } = await supabaseClient.storage
    .from("weddingphotos")
    .upload(filePath, finalPhoto, {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    console.log("UPLOAD ERROR:", uploadError);
    uploadStatus.textContent = uploadError.message || "Upload gagal.";
    uploadSubmitBtn.disabled = false;
    return;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from("weddingphotos")
    .getPublicUrl(filePath);

  const imageUrl = publicUrlData.publicUrl;

  const { error: dbError } = await supabaseClient
    .from("wedding_uploads")
    .insert([
      {
        image_url: imageUrl,
        file_name: fileName
      }
    ]);

  if (dbError) {
    console.log("DB ERROR:", dbError);
    uploadStatus.textContent = dbError.message || "Foto terupload, tapi gagal tersimpan.";
    uploadSubmitBtn.disabled = false;
    return;
  }

  uploadStatus.textContent = "Foto berhasil dikirim.";
  selectedFile.textContent = "";

  photoUpload.value = "";
  cameraUpload.value = "";
  selectedPhoto = null;

  uploadSubmitBtn.disabled = false;
});