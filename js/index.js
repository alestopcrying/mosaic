const MASONRY = document.getElementById("masonry");
const SENTINEL = document.getElementById("sentinel");
const BATCH = 16;        // quante card aggiungere per volta
const INITIAL = 32;      // all'inizio
let items = [];
let cursor = 0;

// shuffle in-place
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]= [a[j],a[i]]; } return a; }

// crea card
function cardFor(it){
  const a = document.createElement("a");
  a.className = "card";
  a.href = `product.html?id=${encodeURIComponent(it.id)}`;
  a.rel = "noopener";
  const img = new Image();
  img.src = it.image;
  img.loading = "lazy";
  img.alt = it.title || "";
  a.appendChild(img);
  return a;
}

function addBatch(n=BATCH){
  if(!items.length) return;
  const frag = document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const it = items[cursor];
    frag.appendChild(cardFor(it));
    cursor++;
    if(cursor >= items.length){ // finiti? ricomincia con nuovo shuffle (ripetizione)
      cursor = 0;
      shuffle(items);
    }
  }
  MASONRY.appendChild(frag);
}

async function start(){
  const res = await fetch("items.json",{cache:"no-store"});
  items = await res.json();
  shuffle(items);
  addBatch(INITIAL);
  io.observe(SENTINEL);
}

const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting) addBatch(); });
},{rootMargin:"1000px 0px"});

start();
