// Random Anime Buddy with R/SR/SSR rarity
// Images: nekos.best (SFW, CORS-enabled)
// Quotes: Animechan
// Includes cache-bust + fallback quotes

const NEKOS_BASE = "https://nekos.best/api/v2";
const IMAGE_CATEGORIES = ["waifu", "husbando", "kitsune", "neko"];
const ANIMECHAN_RANDOM = "https://api.animechan.io/v1/quotes/random";

// Rarity settings (sum to 1.0)
const RARITIES = [
  { key: "SSR", prob: 0.05, className: "rarity-ssr", cheer: "🎉 SSR Pull! Legendary vibes unlocked." },
  { key: "SR",  prob: 0.20, className: "rarity-sr",  cheer: "" },
  { key: "R",   prob: 0.75, className: "rarity-r",   cheer: "" },
];

const FALLBACK_QUOTES = [
  { content: "Keep going. Small wins count.", character: "System", anime: "Your Homepage" },
  { content: "Uncertainty is information, not fear.", character: "System", anime: "Your Research Arc" },
  { content: "Today’s roll might be legendary.", character: "System", anime: "Gacha Life" },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollRarity() {
  const r = Math.random();
  let acc = 0;
  for (const item of RARITIES) {
    acc += item.prob;
    if (r < acc) return item;
  }
  return RARITIES[RARITIES.length - 1];
}

function formatRates() {
  return RARITIES.map(x => `${x.key}: ${(x.prob * 100).toFixed(0)}%`).join(" · ");
}

async function fetchImage() {
  const category = pick(IMAGE_CATEGORIES);
  const res = await fetch(`${NEKOS_BASE}/${category}?amount=1`, { cache: "no-store" });
  if (!res.ok) throw new Error("Image API error");
  const data = await res.json();
  const item = data.results?.[0];
  if (!item?.url) throw new Error("No image url");
  return {
    url: item.url,
    artist_name: item.artist_name,
    artist_href: item.artist_href,
    source_url: item.source_url,
    category,
  };
}

async function fetchQuote() {
  const res = await fetch(ANIMECHAN_RANDOM, { cache: "no-store" });
  if (!res.ok) throw new Error("Quote API error");
  const data = await res.json();

  const payload = data.data || data;
  const content = payload.content || payload.quote || "";
  const animeName = payload.anime?.name || payload.anime || "";
  const characterName = payload.character?.name || payload.character || "";

  if (!content) throw new Error("No quote content");
  return { content, anime: animeName, character: characterName };
}

// Force refresh image even if CDN caches
function setImageSrc(imgEl, url) {
  if (!imgEl) return;
  if (!url) {
    imgEl.removeAttribute("src");
    return;
  }
  const sep = url.includes("?") ? "&" : "?";
  imgEl.src = `${url}${sep}t=${Date.now()}`;
}

function render(image, quote, rarity) {
  const imgEl = document.getElementById("anime-buddy-img");
  const quoteEl = document.getElementById("anime-buddy-quote");
  const metaEl = document.getElementById("anime-buddy-meta");
  const creditEl = document.getElementById("anime-buddy-credit");

  const wrapEl = document.getElementById("anime-buddy-wrap");
  const badgeEl = document.getElementById("anime-buddy-rarity");
  const celebrateEl = document.getElementById("anime-buddy-celebrate");
  const ratesEl = document.getElementById("anime-buddy-rates");

  // image
  if (imgEl) {
    setImageSrc(imgEl, image?.url || "");
    imgEl.dataset.category = image?.category || "";
  }

  // quote
  if (quoteEl) quoteEl.textContent = `“${quote.content}”`;

  const metaParts = [];
  if (quote.character) metaParts.push(quote.character);
  if (quote.anime) metaParts.push(quote.anime);
  if (metaEl) metaEl.textContent = metaParts.length ? metaParts.join(" · ") : "";

  // credit (respectful)
  if (creditEl) {
    if (image?.artist_name || image?.source_url) {
      const artistLink = image.artist_href || image.source_url || "#";
      const artistHTML = image.artist_name
        ? `Art by <a href="${artistLink}" target="_blank" rel="noopener">${image.artist_name}</a>`
        : "";
      const sourceHTML = image.source_url
        ? `<a href="${image.source_url}" target="_blank" rel="noopener">Source</a>`
        : "";
      creditEl.innerHTML = [artistHTML, sourceHTML].filter(Boolean).join(" · ");
    } else {
      creditEl.textContent = "";
    }
  }

  // rarity class
  if (wrapEl) {
    wrapEl.classList.remove("rarity-r", "rarity-sr", "rarity-ssr");
    wrapEl.classList.add(rarity.className);
  }
  if (badgeEl) badgeEl.textContent = rarity.key;

  // SSR celebration
  if (celebrateEl) {
    if (rarity.key === "SSR" && rarity.cheer) {
      celebrateEl.hidden = false;
      celebrateEl.textContent = rarity.cheer;
    } else {
      celebrateEl.hidden = true;
      celebrateEl.textContent = "";
    }
  }

  // rates line
  if (ratesEl) {
    ratesEl.textContent = `Rates: ${formatRates()}`;
  }
}

async function loadBuddy() {
  const quoteEl = document.getElementById("anime-buddy-quote");
  if (quoteEl) quoteEl.textContent = "Loading...";

  const rarity = rollRarity();

  try {
    const [image, quote] = await Promise.all([fetchImage(), fetchQuote()]);
    render(image, quote, rarity);
  } catch (e) {
    let image;
    try {
      image = await fetchImage();
    } catch (_) {
      image = { url: "", category: "unknown" };
    }
    const quote = pick(FALLBACK_QUOTES);
    render(image, quote, rarity);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("anime-buddy-refresh");
  if (btn) btn.addEventListener("click", loadBuddy);
  loadBuddy();
});
