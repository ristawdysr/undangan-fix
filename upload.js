const SUPABASE_URL = "https://uazzbikvmhbdznywifey.supabase.co";
const SUPABASE_KEY = "ISI_SUPABASE_KEY_KAMU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const photoUpload = document.getElementById("photoUpload");
const uploadSubmitBtn = document.getElementById("uploadSubmitBtn");

const selectedFile = document.getElementById("selectedFile");
const uploadStatus = document.getElementById("uploadStatus");

let selectedPhoto = null;

photoUpload.addEventListener("change", (e) => {
  selectedPhoto = e.target.files[0];

  if (selectedPhoto) {
    selectedFile.textContent = selectedPhoto.name;
  }
});

uploadSubmitBtn.addEventListener("click", async () => {

  if (!selectedPhoto) {
    uploadStatus.textContent = "Pilih foto terlebih dahulu.";
    return;
  }

  uploadSubmitBtn.disabled = true;

  uploadStatus.textContent = "Mengupload foto...";

  const fileExt = selectedPhoto.name.split(".").pop();

  const fileName = `${Date.now()}.${fileExt}`;

  const filePath = `guest-photos/${fileName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("wedding-uploads")
    .upload(filePath, selectedPhoto);

  if (uploadError) {
    console.log(uploadError);

    uploadStatus.textContent = "Upload gagal.";

    uploadSubmitBtn.disabled = false;

    return;
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from("wedding-uploads")
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
    console.log(dbError);

    uploadStatus.textContent = "Foto terupload tapi gagal disimpan.";

    uploadSubmitBtn.disabled = false;

    return;
  }

  uploadStatus.textContent = "Foto berhasil dikirim.";

  selectedFile.textContent = "";

  photoUpload.value = "";

  selectedPhoto = null;

  uploadSubmitBtn.disabled = false;
});