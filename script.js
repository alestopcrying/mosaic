const CARTELLA   = "images/";
const BASE_NAME  = "fotosito";
const ESTENSIONE = "png";
const MAX_FOTO   = 500;

const masonry = document.getElementById("masonry");

function addImage(i) {
  const url = `${CARTELLA}${BASE_NAME}${i}.${ESTENSIONE}`;
  const img = new Image();
  img.loading = "lazy";
  img.src = url;

  img.onload = () => {
    const a = document.createElement("a");
    a.className = "card";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    a.appendChild(img);
    masonry.appendChild(a);
  };
  // se il file manca, lo salta
}

(function start() {
  for (let i = 1; i <= MAX_FOTO; i++) addImage(i);
})();
