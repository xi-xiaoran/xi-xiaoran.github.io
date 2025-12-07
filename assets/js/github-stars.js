async function fetchStars(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}`);
  if (!res.ok) throw new Error("GitHub API error");
  const data = await res.json();
  return data.stargazers_count;
}

async function initStars() {
  const nodes = document.querySelectorAll(".github-stars[data-repo]");
  for (const node of nodes) {
    const repo = node.getAttribute("data-repo");
    const countSpan = node.querySelector(".github-stars__count");
    try {
      const stars = await fetchStars(repo);
      countSpan.textContent = stars;
    } catch {
      countSpan.textContent = "—";
    }
  }
}

document.addEventListener("DOMContentLoaded", initStars);
