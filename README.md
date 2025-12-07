# Lightweight Academic + Industry Personal Homepage (Jekyll, YAML-driven)

A clean, minimal, and highly editable GitHub Pages personal homepage template for:

- Academic experience  
- Industry experience  
- Publications  
- Projects (with live GitHub stars)  
- Life updates  
- Latest CV (EN/CN) with last-updated display  
- A tasteful “Random Anime Buddy” gacha easter egg (R/SR/SSR)

This template is designed to be **easy to maintain**: you mostly edit YAML data files and drop logos/figures into folders.

---

## Preview

- Live demo: https://xi-xiaoran.github.io

---

## Key Features

- **Fully English, minimal, no template leftovers**
- **YAML-driven content**  
  Add/update entries without touching HTML.
- **Expandable abstracts & project details**
- **GitHub Stars**  
  Live star count for listed repos.
- **Latest CV section**  
  EN/CN links + last updated date controlled by YAML.
- **Fun Zone**  
  Random Anime Buddy (SFW images + random quotes + rarity + rates display).

---

## Tech Stack

- GitHub Pages + Jekyll
- Vanilla HTML/CSS/JS
- Data: YAML under `_data/`

---

## Quick Start

### Use this template
1. Click **Use this template** on GitHub.
2. Name your repo: `YOUR_USERNAME.github.io`
3. Set it to Public.
4. Push your edits.

### Or fork
1. Fork this repo.
2. Rename it to `YOUR_USERNAME.github.io`.

---

## Deploy on GitHub Pages

1. **Settings → Pages**
2. **Source**: Deploy from a branch  
3. **Branch**: `main`  
4. **Folder**: `/(root)`

Your site will be available at:
- `https://YOUR_USERNAME.github.io`

---

## Project Structure

```
.
├─ _config.yml
├─ index.md
├─ _layouts/
│  └─ default.html
├─ _includes/
│  └─ custom-home.html
├─ _data/
│  ├─ navigation.yml
│  ├─ home_academic.yml
│  ├─ home_industry.yml
│  ├─ home_publications.yml
│  ├─ home_projects.yml
│  ├─ home_life.yml
│  └─ home_cv.yml
├─ assets/
│  ├─ css/
│  │  └─ main.scss
│  └─ js/
│     ├─ github-stars.js
│     └─ anime-buddy.js
├─ images/
│  ├─ avatar.jpg (or .png/.JPG)
│  ├─ logos/
│  └─ papers/
└─ files/
   ├─ CV_English.pdf
   └─ CV_Chinese.pdf
```

---

## Important Note About SCSS

`assets/css/main.scss` must include Jekyll front matter:

```scss
---
---
```

Otherwise GitHub Pages will not compile SCSS into `main.css`, and your site may appear unstyled.

---

## Customize Your Identity

Edit `_config.yml`:

```yml
title: "Your Name"
description: "One-line tagline about your research/engineering focus."
```

Place your avatar at:

```
/images/avatar.jpg
```

---

## Navigation

Edit `_data/navigation.yml`:

```yml
items:
  - title: "Academic"
    url: "/#academic-experience"
  - title: "Industry"
    url: "/#industry-experience"
  - title: "Publications"
    url: "/#publications"
  - title: "Projects"
    url: "/#projects"
  - title: "Life"
    url: "/#life-updates"
  - title: "CV"
    url: "/#latest-cv"
```

---

## Content Editing (YAML-driven)

- Academic: `_data/home_academic.yml`
- Industry: `_data/home_industry.yml`
- Publications: `_data/home_publications.yml`
- Projects: `_data/home_projects.yml`
- Life: `_data/home_life.yml`
- CV: `_data/home_cv.yml`

Order in YAML = order on the page.

---

## Projects with GitHub Stars

In `_data/home_projects.yml`:

```yml
github_repo: "owner/repo"
```

Stars are fetched by `assets/js/github-stars.js`.

---

## Latest CV (EN/CN + Last Updated)

Put PDFs:

```
/files/CV_English.pdf
/files/CV_Chinese.pdf
```

Edit `_data/home_cv.yml`:

```yml
english:
  file: "/files/CV_English.pdf"
  updated: "2025-12-07"
  label: "English CV (PDF)"

chinese:
  file: "/files/CV_Chinese.pdf"
  updated: "2025-12-07"
  label: "中文简历 (PDF)"
```

---

## Random Anime Buddy

Rarity probabilities are defined in:

```js
const RARITIES = [
  { key: "SSR", prob: 0.05, ... },
  { key: "SR",  prob: 0.20, ... },
  { key: "R",   prob: 0.75, ... },
];
```

Adjust as you like as long as they sum to 1.0.

---

## License

Add a `LICENSE` file (MIT is common for templates).

---

## Contributing

PRs are welcome for UI polish, accessibility improvements, and optional widgets.

---

Enjoy building your homepage!
