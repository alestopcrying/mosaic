// === IMPOSTAZIONI ===
const BASE_NAME   = "fotosito"; // prefisso
const ESTENSIONE  = "png";      // estensione
const CARTELLA    = "images/";  // cartella
const MAX_FOTO    = 500;        // tetto alto (modifichi solo se lo superi)
const BATCH_SIZE  = 12;         // quante immagini per volta
const INITIAL_LOAD = 24;        // quante all'inizio

// === VARIABILI ===
const masonry = document.getElementById("masonry");
const sentinel = document.getElementById("sentinel");

let nextIndex = 1;   // partirà da fotosito1.png
let finished  = false;

// Utility: costruisce l'URL per un indice
function urlFor(i) {
  return `${CARTELLA}${BASE_NAME}${i}.${ESTENSIONE}`;
}

// Crea il contenitore link + <img>
function createCardShell(href) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}

// Aggiunge fino a n immagini *valide* (conteggia solo onload riusciti)
function addBatch(n = BATCH_SIZE) {
  if (finished) return;

  let appended = 0;           // immagini effettivamente aggiunte
  let tries    = 0;           // tentativi in questo batch
  const MAX_TRIES_THIS_BATCH = n * 8; // margine per saltare eventuali buchi

  function tryNext() {
    if (appended >= n || finished || tries >= MAX_TRIES_THIS_BATCH) {
      // batch concluso: se siamo finiti, stacchiamo l'observer
      if (finished) io.disconnect?.();
      return;
    }

    if (nextIndex > MAX_FOTO) {
      finished = true;
      console.log("[mosaico] Fine: superato MAX_FOTO =", MAX_FOTO);
      if (appended === 0) showHelpIfEmpty();
      io.disconnect?.();
      return;
    }

    const i = nextIndex++;
    tries++;
    const url = urlFor(i);

    console.log("[mosaico] provo:", url);

    const img = new Image();
    img.loading  = "lazy";
    img.decoding = "async";
    img.src      = url;

    img.onload = () => {
      const card = createCardShell(url);
      img.alt = "";
      card.appendChild(img);
      masonry.appendChild(card);
      appended++;
      tryNext(); // continua finché non raggiungiamo n successi
    };

    img.onerror = () => {
      console.warn("[mosaico] 404 o errore su:", url);
      tryNext(); // non appendiamo, ma continuiamo a cercare
    };
  }

  // avvia catena di tentativi
  tryNext();
}

// Messaggio d’aiuto se non compare nessuna immagine
function showHelpIfEmpty() {
  if (masonry.children.length === 0) {
    const msg = document.createElement("div");
    msg.style.padding = "20px";
    msg.style.color = "#444";
    msg.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
    msg.innerHTML = `
      <p><strong>Non riesco a mostrare le immagini.</strong></p>
      <ul>
        <li>Controlla che i file esistano davvero come <code>${CARTELLA}${BASE_NAME}1.${ESTENSIONE}</code>, <code>${BASE_NAME}2.${ESTENSIONE}</code>…</li>
        <li>Nomina esatta (maiuscole/minuscole), estensione <code>.${ESTENSIONE}</code>.</li>
        <li>Se hai appena fatto commit, ricarica la pagina (Cmd+Shift+R / Ctrl+F5).</li>
      </ul>
    `;
    masonry.appendChild(msg);
  }
}

// Osservatore per scroll infinito
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !finished) addBatch();
    });
  },
  { rootMargin: "1000px 0px" }
);

// Mini-test iniziale: verifica i primi 5 URL e segnala in console
(function quickTest() {
  const testMax = Math.min(5, MAX_FOTO);
  const tests = [];
  for (let i = 1; i <= testMax; i++) {
    const url = urlFor(i);
    tests.push(new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ url, ok: true });
      img.onerror = () => resolve({ url, ok: false });
      img.src = url;
    }));
  }
  Promise.all(tests).then(results => {
    const ok = results.filter(r => r.ok).length;
    console.table(results);
    if (ok === 0) {
      console.error("[mosaico] Nessuna delle prime 5 immagini è raggiungibile. Controlla percorso/nomi/estensione.");
    }
  });
})();

// Avvio
addBatch(INITIAL_LOAD);
io.observe(sentinel);
