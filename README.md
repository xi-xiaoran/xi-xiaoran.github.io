# Lightweight Academic + Industry Personal Homepage (Jekyll, YAML-driven)

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ready-black)
![Jekyll](https://img.shields.io/badge/Jekyll-supported-CC0000)
![YAML-driven](https://img.shields.io/badge/Content-YAML--driven-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green)
![Minimal](https://img.shields.io/badge/Style-Minimal-lightgrey)

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

## Quickstart (60 seconds)

1) **Use this template** on GitHub.  
2) Rename the repo to: `YOUR_USERNAME.github.io`  
3) Edit `_config.yml`:
   - `title`
   - `description`
4) Replace your avatar:
   - `images/avatar.jpg` (or update the path in `_includes/custom-home.html`)
5) Update content by editing YAML:
   - `_data/home_academic.yml`
   - `_data/home_industry.yml`
   - `_data/home_publications.yml`
   - `_data/home_projects.yml`
   - `_data/home_life.yml`
   - `_data/home_cv.yml`
6) Push → GitHub Pages will build automatically.

Your site should be live at:
- `https://YOUR_USERNAME.github.io`

---

## Preview

![preview](images/preview.png)

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
│  ├─ papers/
│  └─ preview.png
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

This easter egg uses public SFW image + quote APIs and includes local fallback quotes.

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

MIT

---

## Contributing

PRs are welcome for UI polish, accessibility improvements, and optional widgets.

---

Enjoy building your homepage!
