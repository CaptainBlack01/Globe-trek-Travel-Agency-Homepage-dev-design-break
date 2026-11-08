# GlobeTrek Travel Agency Website

A modern, responsive travel agency site for browsing destinations, comparing packages, and booking trips.

## Live Site

Deployed on Vercel from the `master` branch of this repository.

## Key Features

- **Responsive homepage** with hero, featured destinations, testimonials, packages, and contact sections.
- **Ticket booking page** (`ticket.html`) with real-time validation for name, email, destination, date, and ticket quantity.
- **Destination details modal** with keyboard support (focus trap, Escape to close).
- **Booking prefill**: "Book This Trip" and "Book Package" links pass the selected destination to the booking page via a query string.
- **Accessible markup**: skip link, semantic landmarks, labelled form fields, `aria-live` status messages, and visible focus styles.
- **Reduced-motion support** and a no-JavaScript fallback for scroll animations.
- **SEO basics**: meta description, Open Graph/Twitter tags, favicon, and `robots.txt`.

## Tech Stack

- **HTML5** — structure and semantics
- **CSS3** — custom properties, Flexbox, Grid, responsive design
- **JavaScript (vanilla)** — rendering, validation, modal, navigation, scroll-spy
- **Font Awesome** — icons
- **Poppins** — Google Fonts

## File Structure

- `index.html` — main landing page (Vercel root entry point)
- `ticket.html` — booking page
- `travel.css` — global styles and responsive rules
- `script.js` — navigation, rendering, modal, validation, and scroll interactions
- `vercel.json` — clean URL configuration
- `robots.txt` — crawler rules
- `globe.jpeg` — favicon
- `globe-34526_1280.webp` — social share image

## Run Locally

1. Clone the repository.
2. Open `index.html` in a browser, or serve the folder:
   ```bash
   npx serve .
   ```
3. Use "Book Now" to test the booking flow and destination prefill.

## Deploying to Vercel

1. Import the GitHub repository into Vercel.
2. Framework preset: **Other** (no build step required).
3. Root directory: repository root.
4. Deploy. Vercel serves `index.html` at `/`.

`vercel.json` enables clean URLs, so `ticket.html` is also reachable at `/ticket`.

## Known Limitations

- Contact and booking forms are front-end only (validation + confirmation alerts); no submissions are stored or emailed yet.
- Unsplash images and Font Awesome icons are loaded from CDNs, so an internet connection is required.

---

&copy; 2025 GlobeTrek. Happy traveling!
