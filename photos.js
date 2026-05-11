const SUPABASE_URL = "https://uazzbikvmhbdznywifey.supabase.co";
const SUPABASE_KEY = "ISI_SUPABASE_KEY_KAMU";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const photosGrid = document.getElementById("photosGrid");

async function loadPhotos() {

  const { data, error } = await supabaseClient
    .from("wedding_uploads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  photosGrid.innerHTML = "";

  data.forEach((item) => {

    const div = document.createElement("div");

    div.className = "photo-item";

    div.innerHTML = `
      <img src="${item.image_url}" alt="Wedding Photo">
    `;

    photosGrid.appendChild(div);

  });
}

loadPhotos();