function qs(name){ return new URLSearchParams(location.search).get(name) }

async function start(){
  const id = qs("id");
  const res = await fetch("items.json",{cache:"no-store"});
  const items = await res.json();
  const it = items.find(x => x.id === id) || items[0];

  document.getElementById("prod-img").src = it.image;
  document.getElementById("prod-img").alt = it.title || "";
  document.getElementById("prod-title").textContent = it.title || "";
  document.getElementById("prod-desc").textContent = it.desc || "";
  const mail = document.getElementById("prod-mail");
  mail.href = it.mailto || "mailto:tuamail@example.com?subject=Info%20item";
}
start();
