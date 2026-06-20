# RSMC Website – Rukhsana Shafqat Memorial Charity

A complete, lightweight, static website built in plain **HTML / CSS / JavaScript** — no backend, no database, no build step. Designed to be hosted for free or near-free, and updated by non-technical staff.

---

## 📁 Project structure

```
rsmc/
├── index.html              ← Home
├── about.html              ← About Us
├── programs.html           ← Our Programs
├── get-involved.html       ← Volunteer / Partner
├── donate.html             ← Donation page
├── news.html               ← News & Stories (auto-populated from data/news.json)
├── gallery.html            ← Photo gallery (with lightbox)
├── faq.html                ← FAQ accordion
├── contact.html            ← Contact form + map
├── 404.html                ← Not-found page
├── robots.txt              ← For search engines
├── sitemap.xml             ← For SEO
├── css/styles.css          ← All styles (single file, well-commented)
├── js/main.js              ← All interactions (single file, no libraries)
├── data/news.json          ← News content (edit this to add/remove stories)
└── images/                 ← All photographs and logo
```

---

## 🚀 How to publish (3 free options)

### Option 1 — Netlify (recommended, easiest)
1. Go to https://app.netlify.com/drop
2. Drag the entire `rsmc` folder onto the page.
3. You'll receive a live URL within seconds (e.g. `rsmc-charity.netlify.app`).
4. To use your own domain (`rsmc.org.pk`), follow Netlify's **Domain settings → Add custom domain** wizard.

### Option 2 — GitHub Pages
1. Create a free GitHub account.
2. Create a new repository named `rsmc-website`.
3. Upload all files in this folder.
4. Settings → Pages → Source = `main` branch → Save.
5. Your site is live at `https://<username>.github.io/rsmc-website/`.

### Option 3 — Any web host with cPanel / FTP
Upload all files to the `public_html` folder of any shared host (Bluehost, Hostinger, etc.).

> ✅ No PHP, Node, or database needed. Any static host works.

---

## ✏️ How to update content (non-technical guide)

### To change text on a page
1. Open the HTML file in any text editor (Notepad, TextEdit, VS Code).
2. Find the text you want to change.
3. Edit it.
4. Save. Re-upload that single file to your host (or just drop the whole folder on Netlify again).

### To add a news story
1. Open `data/news.json`.
2. Copy one of the existing items (everything inside the curly braces `{ ... }`).
3. Paste it at the top of the list, separating with a comma.
4. Change the `title`, `date`, `category`, `excerpt`, and `image` fields.
5. Save. The Home and News pages will automatically show the new story.

Example:
```json
[
  {
    "title": "New school opens in Lahore!",
    "date": "20 Jun 2026",
    "category": "Education",
    "excerpt": "Short summary here…",
    "image": "images/program-education.jpg"
  },
  …existing stories…
]
```

### To replace an image
1. Save your new image into the `images/` folder using the **same filename** as the old one (e.g. `hero.jpg`). Recommended size: max 1600 px wide, JPEG, under 300 KB.
2. Save and re-upload.

### To change colors
1. Open `css/styles.css`.
2. The first section (`:root { … }`) holds every color variable used site-wide.
3. Change a value (e.g. `--teal-700: #136a64;`) and the whole site updates.

### To add a new team member
Edit `about.html`. Find the `<!-- TEAM -->` block, copy one `<div class="team-card">…</div>` block, and update the initials, name, role and bio.

---

## 💳 Wiring up real donations

The donation widget currently displays an alert when "Donate" is clicked. To make it process real payments, choose one of:

| Method | Effort | Notes |
|---|---|---|
| **Stripe Payment Links** | 5 min | Easiest — generate a link from Stripe dashboard, paste it into the button's `onclick`. |
| **PayPal Donate Button** | 5 min | Copy the HTML snippet from PayPal Business and replace the widget. |
| **Donorbox / GiveButter** | 15 min | Drop-in form with recurring giving. Free plan available. |
| **JazzCash / EasyPaisa Business** | 1 hr | Local mobile-wallet integration; needs business account & API key. |

Open `js/main.js` and replace the `alert(…)` block inside the donation widget section with your chosen redirect.

---

## ✉️ Wiring up the contact / volunteer forms

The forms currently show a success message but do not actually send anywhere. To make them email your team:

1. **Formspree** (free, easiest) — sign up at https://formspree.io, get your form ID, then in each `<form>` tag add:
   ```html
   <form action="https://formspree.io/f/YOUR_ID" method="POST">
   ```
   Remove the `data-validate` attribute (or keep it — both will work).

2. **Netlify Forms** (free if hosted on Netlify) — add `netlify` attribute to each form:
   ```html
   <form name="contact" netlify>
   ```

3. **Web3Forms** — alternative to Formspree, similarly easy.

---

## 🛠️ Recommended future upgrades

| Need | Recommendation |
|---|---|
| You want a real CMS so staff don't touch HTML | Migrate to **Decap CMS** (formerly Netlify CMS) — free, runs on top of Git, gives a friendly admin UI. |
| You want multi-language (Urdu/English) | Add `lang/ur/` subfolder copies, or migrate to **Astro** + i18n. |
| You want analytics | Add **Plausible** (privacy-friendly) or **Google Analytics 4** — single `<script>` tag in `<head>`. |
| Want to grow past 9 pages | Consider **Eleventy** or **Astro** — same HTML output but with reusable header/footer "includes". |

---

## ♿ Accessibility

The site is built to **WCAG 2.1 AA** standards:
- Skip-to-content link
- Semantic HTML (`<header>`, `<main>`, `<nav>`, `<footer>`)
- ARIA labels on icons & toggle buttons
- Visible focus outlines
- Sufficient color contrast
- Respects `prefers-reduced-motion`
- All images have descriptive `alt` text
- Keyboard navigable (Tab, Enter, Escape for lightbox/modal)

---

## 🔎 SEO

- Unique `<title>` and meta description on every page
- Open Graph tags for social sharing
- Structured data (JSON-LD) for NGO + FAQPage
- `sitemap.xml` and `robots.txt` included
- Semantic headings, descriptive image alts
- Fast loading (< 1 MB total per page, no external JS)

---

## 📞 Support

This codebase was created as a turnkey website. For modifications, any web developer comfortable with HTML/CSS can maintain it. We recommend keeping a backup of the entire folder before making major changes.

— Built with care for RSMC and the families it serves.
