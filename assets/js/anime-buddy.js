// Random Anime Buddy
// Images: nekos.best (SFW, CORS-enabled)
// Quotes: Animechan v1

const NEKOS_BASE = "https://nekos.best/api/v2";
const IMAGE_CATEGORIES = ["waifu", "husbando", "kitsune", "neko"];

const ANIMECHAN_RANDOM = "https://api.animechan.io/v1/quotes/random";

// Tiny local fallback to avoid empty UI if quote API rate-limits
const FALLBACK_QUOTES = [
  { content: "Keep going. Small wins count.", character: "System", anime: "Your Homepage" },
  { content: "Uncertainty is information, not fear.", character: "System", anime: "Your Research Arc" },
  { content: "Today’s roll might be legendary.", character: "System", anime: "Gacha Life" },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchImage() {
  const category = pick(IMAGE_CATEGORIES);
  const res = await fetch(`${NEKOS_BASE}/${category}?amount=1`);
  if (!res.ok) throw new Error("Image API error");
  const data = await res.json();
  const item = data.results?.[0];
  if (!item?.url) throw new Error("No image");
  return {
    url: item.url,
    artist_name: item.artist_name,
    artist_href: item.artist_href,
    source_url: item.source_url,
    category,
  };
}

async function fetchQuote() {
  const res = await fetch(ANIMECHAN_RANDOM);
  if (!res.ok) throw new Error("Quote API error");
  const data = await res.json();

  // Animechan returns a { status, data } style payload in examples
  const payload = data.data || data;
  const content = payload.content || payload.quote || "";
  const animeName = payload.anime?.name || payload.anime || "";
  const characterName = payload.character?.name || payload.character || "";

  if (!content) throw new Error("No quote content");
  return { content, anime: animeName, character: characterName };
}

function render(image, quote) {
  const imgEl = document.getElementById("anime-buddy-img");
  const quoteEl = document.getElementById("anime-buddy-quote");
  const metaEl = document.getElementById("anime-buddy-meta");
  const creditEl = document.getElementById("anime-buddy-credit");

  if (imgEl) {
    imgEl.src = image.url;
    imgEl.dataset.category = image.category;
  }

  if (quoteEl) quoteEl.textContent = `“${quote.content}”`;

  const metaParts = [];
  if (quote.character) metaParts.push(quote.character);
  if (quote.anime) metaParts.push(quote.anime);
  metaEl.textContent = metaParts.length ? metaParts.join(" · ") : "";

  // Optional credit for images (nice touch + respectful)
  const creditParts = [];
  if (image.artist_name) creditParts.push(`Art by ${image.artist_name}`);
  if (image.source_url) creditParts.push("Source");
  if (creditEl) {
    if (creditParts.length === 0) {
      creditEl.textContent = "";
    } else if (image.source_url) {
      creditEl.innerHTML =
        `${image.artist_name ? `Art by <a href="${image.artist_href || image.source_url}" target="_blank" rel="noopener">` +
        `${image.artist_name}</a>` : ""}` +
        `${image.artist_name ? " · " : ""}` +
        `<a href="${image.source_url}" target="_blank" rel="noopener">Source</a>`;
    } else {
      creditEl.textContent = creditParts.join(" · ");
    }
  }
}

async function loadBuddy() {
  const quoteEl = document.getElementById("anime-buddy-quote");
  if (quoteEl) quoteEl.textContent = "Loading...";

  try {
    const [image, quote] = await Promise.all([
      fetchImage(),
      fetchQuote(),
    ]);
    render(image, quote);
  } catch (e) {
    // fallback quote; still try to show image if possible
    let image;
    try {
      image = await fetchImage();
    } catch (_) {
      image = { url: "", category: "unknown" };
    }
    const quote = pick(FALLBACK_QUOTES);
    render(image, quote);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("anime-buddy-refresh");
  if (btn) btn.addEventListener("click", loadBuddy);
  loadBuddy();
});
