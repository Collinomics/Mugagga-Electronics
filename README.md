# Mugagga Electronics

A responsive static business website for Mugagga Electronics, showcasing
electrical products, services, testimonials, company information, and contact
details.

## Features

- Multi-page catalogue and company information pages.
- Responsive navigation with a mobile hamburger menu.
- Scroll-aware navigation and scroll-to-top control.
- Intersection Observer reveal animations and animated statistics.
- Client-side contact-form validation with accessible feedback states.
- Local image and brand assets in `Resources/`.

## Technologies

HTML5, CSS3, and vanilla JavaScript. No server or build step is required.

## Run locally

Open `index.html` directly in a browser, or serve the directory with any static
server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

The contact form currently validates and simulates submission in the browser;
connect it to a trusted backend before using it for production enquiries.
