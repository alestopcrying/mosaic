// METTI QUI LE TUE FOTO.
// Caricale nella cartella "images" (vedi passo 4) e usa percorsi tipo "images/foto1.jpg".
const IMAGES = [
  // esempi temporanei (sostituiscili con le tue immagini in /images)
  "images/foto1.jpg",
  "images/foto2.jpg",
  "images/foto3.jpg",
];

const BATCH_SIZE = 12;
const masonry = document.getElementById("masonry");
const sentinel = document.getElementById("sentinel");

function createCard(url) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";

  const img = new Image();
  img.src = url;
  img.loading = "lazy";
  img.alt = "";
  a.appendChild(img);

  return a;
}

function addBatch(n = BATCH_SIZE) {
  if (!IMAGES.length) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const url = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    frag.appendChild(createCard(url));
  }
  masonry.appendChild(frag);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) addBatch(); });
  },
  { rootMargin: "1000px 0px" }
);

addBatch(24);
io.observe(sentinel);
