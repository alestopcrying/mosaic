// === Impostazioni da cambiare se serve ===
const MAX_FOTO = 500;         // metti un numero "grande" (es. 500)
const BASE_NAME = "fotosito";  // prefisso dei file
const ESTENSIONE = "png";      // "png" oppure "jpg"
const CARTELLA = "images/";    // dove sono i file

const BATCH_SIZE = 12;         // quante immagini caricare per volta
const INITIAL_LOAD = 24;       // quante immagini iniziali

// === Variabili interne ===
const masonry = document.getElementById("masonry");
const sentinel = document.getElementById("sentinel");
let nextIndex = 1;             // iniziamo da fotosito1
let finished = false;          // diventa true quando arriviamo oltre MAX_FOTO

function urlFor(i) {
  return `${CARTELLA}${BASE_NAME}${i}.${ESTENSIONE}`;
}

function createCardShell(href) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

// Prova ad aggiungere fino a n immagini valide (se un file manca, viene saltato)
function addBatch(n = BATCH_SIZE) {
  if (finished) return;

  let tries = 0;      // quante immagini proviamo in totale in questa batch
  let appended = 0;   // quante sono effettivamente andate a buon fine

  // Proviamo un po' di indici in più nel caso qualche file non esista
  const MAX_TRIES_THIS_BATCH = n * 4; // margine per saltare file mancanti

  while (appended < n && !finished && tries < MAX_TRIES_THIS_BATCH) {
    const i = nextIndex++;
    tries++;

    if (i > MAX_FOTO) {
      finished = true;
      break;
    }

    const url = urlFor(i);
    const img = new Image();
    img.loading = "lazy";
    img.decoding = "async";
    img.src = url;

    img.onload = () => {
      const card = createCardShell(url);
      img.alt = "";
      card.appendChild(img);
      masonry.appendChild(card);
    };

    img.onerror = () => {
      // File mancante? Non succede nulla: lo saltiamo.
    };

    appended++;
  }

  // Se abbiamo esaurito gli indici, disattiva l'osservatore
  if (finished) {
    io.disconnect?.();
  }
}

// Scroll infinito: quando la sentinella entra in vista, carica altre immagini
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !finished) addBatch();
    });
  },
  { rootMargin: "1000px 0px" }
);

// Avvio
addBatch(INITIAL_LOAD);
io.observe(sentinel);
