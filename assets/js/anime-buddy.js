// Random Anime Buddy with R/SR/SSR rarity
// Primary images: Waifu.im (SFW, browser-friendly)
// Secondary images: nekos.best (SFW fallback)
// Quotes: Animechan with local fallback quotes

const WAIFU_API = "https://api.waifu.im/images?IncludedTags=waifu&IsNsfw=False";
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

const FALLBACK_IMAGE_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="640" height="820" viewBox="0 0 640 820">
    <rect width="640" height="820" rx="36" fill="#f4f4f5"/>
    <circle cx="320" cy="330" r="112" fill="#e4e4e7"/>
    <path d="M250 330l45 45 95-105" fill="none" stroke="#a1a1aa" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="320" y="520" text-anchor="middle" font-family="system-ui, sans-serif" font-size="42" font-weight="700" fill="#52525b">Anime Buddy</text>
    <text x="320" y="580" text-anchor="middle" font-family="system-ui, sans-serif" font-size="25" fill="#71717a">image source temporarily unavailable</text>
  </svg>
`)}`;

const FALLBACK_IMAGE = {
  url: FALLBACK_IMAGE_URL,
  artist_name: "",
  artist_href: "",
  source_url: "",
  category: "fallback",
  provider: "local fallback",
};

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

async function fetchWaifuImage() {
  const res = await fetch(WAIFU_API, { cache: "no-store" });
  if (!res.ok) throw new Error(`Waifu.im error: ${res.status}`);

  const data = await res.json();
  const item = data.items?.[0];
  if (!item?.url) throw new Error("Waifu.im returned no image URL");

  const artist = item.artists?.[0] || {};
  const artistHref = artist.pixiv || artist.twitter || artist.deviantArt || item.source || "";

  return {
    url: item.url,
    artist_name: artist.name || "",
    artist_href: artistHref,
    source_url: item.source || "",
    category: "waifu",
    provider: "Waifu.im",
  };
}

async function fetchNekosBestImage() {
  const category = pick(IMAGE_CATEGORIES);
  const res = await fetch(`${NEKOS_BASE}/${category}?amount=1`, { cache: "no-store" });
  if (!res.ok) throw new Error(`nekos.best error: ${res.status}`);

  const data = await res.json();
  const item = data.results?.[0];
  if (!item?.url) throw new Error("nekos.best returned no image URL");

  return {
    url: item.url,
    artist_name: item.artist_name || "",
    artist_href: item.artist_href || item.source_url || "",
    source_url: item.source_url || "",
    category,
    provider: "nekos.best",
  };
}

async function fetchImage() {
  try {
    return await fetchWaifuImage();
  } catch (primaryError) {
    console.warn("Primary anime image source failed; trying fallback.", primaryError);
  }

  try {
    return await fetchNekosBestImage();
  } catch (fallbackError) {
    console.warn("Fallback anime image source failed; using local placeholder.", fallbackError);
    return FALLBACK_IMAGE;
  }
}

async function fetchQuote() {
  const res = await fetch(ANIMECHAN_RANDOM, { cache: "no-store" });
  if (!res.ok) throw new Error(`Quote API error: ${res.status}`);
  const data = await res.json();

  const payload = data.data || data;
  const content = payload.content || payload.quote || "";
  const animeName = payload.anime?.name || payload.anime || "";
  const characterName = payload.character?.name || payload.character || "";

  if (!content) throw new Error("No quote content");
  return { content, anime: animeName, character: characterName };
}

function setImageSrc(imgEl, image) {
  if (!imgEl) return;

  imgEl.onerror = () => {
    // The API request can succeed while the returned CDN URL itself fails.
    // Never leave a broken image on the homepage.
    imgEl.onerror = null;
    imgEl.src = FALLBACK_IMAGE_URL;
    imgEl.dataset.category = "fallback";
  };

  imgEl.src = image?.url || FALLBACK_IMAGE_URL;
  imgEl.dataset.category = image?.category || "fallback";
}

function appendLink(parent, text, href) {
  if (!href) return;
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = text;
  parent.appendChild(link);
}

function renderCredit(creditEl, image) {
  if (!creditEl) return;
  creditEl.replaceChildren();

  if (!image || image.category === "fallback") {
    creditEl.textContent = "Image source temporarily unavailable";
    return;
  }

  let hasPart = false;

  if (image.artist_name) {
    creditEl.append("Art by ");
    if (image.artist_href) {
      appendLink(creditEl, image.artist_name, image.artist_href);
    } else {
      creditEl.append(image.artist_name);
    }
    hasPart = true;
  }

  if (image.source_url) {
    if (hasPart) creditEl.append(" · ");
    appendLink(creditEl, "Source", image.source_url);
    hasPart = true;
  }

  if (image.provider) {
    if (hasPart) creditEl.append(" · ");
    creditEl.append(`via ${image.provider}`);
  }
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

  setImageSrc(imgEl, image);

  if (quoteEl) quoteEl.textContent = `“${quote.content}”`;

  const metaParts = [];
  if (quote.character) metaParts.push(quote.character);
  if (quote.anime) metaParts.push(quote.anime);
  if (metaEl) metaEl.textContent = metaParts.length ? metaParts.join(" · ") : "";

  renderCredit(creditEl, image);

  if (wrapEl) {
    wrapEl.classList.remove("rarity-r", "rarity-sr", "rarity-ssr");
    wrapEl.classList.add(rarity.className);
  }
  if (badgeEl) badgeEl.textContent = rarity.key;

  if (celebrateEl) {
    if (rarity.key === "SSR" && rarity.cheer) {
      celebrateEl.hidden = false;
      celebrateEl.textContent = rarity.cheer;
    } else {
      celebrateEl.hidden = true;
      celebrateEl.textContent = "";
    }
  }

  if (ratesEl) {
    ratesEl.textContent = `Rates: ${formatRates()}`;
  }
}

async function loadBuddy() {
  const quoteEl = document.getElementById("anime-buddy-quote");
  const btn = document.getElementById("anime-buddy-refresh");

  if (quoteEl) quoteEl.textContent = "Loading...";
  if (btn) btn.disabled = true;

  const rarity = rollRarity();

  // Image and quote are independent: one service failing should not discard
  // the successful result from the other service.
  const [imageResult, quoteResult] = await Promise.allSettled([
    fetchImage(),
    fetchQuote(),
  ]);

  const image = imageResult.status === "fulfilled" ? imageResult.value : FALLBACK_IMAGE;
  const quote = quoteResult.status === "fulfilled" ? quoteResult.value : pick(FALLBACK_QUOTES);

  render(image, quote, rarity);

  if (btn) btn.disabled = false;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("anime-buddy-refresh");
  if (btn) btn.addEventListener("click", loadBuddy);
  loadBuddy();
});
