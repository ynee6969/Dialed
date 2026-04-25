# Website Presentation Manuscript

## Project: Dialed - Phone Discovery Platform

**Presentation Duration:** 5 minutes  
**Team:** [Your Team Name]  
**Members:** [Your Names]

---

## OPENING (30 seconds)

> "Good morning/afternoon, Professor. Our team is [Team Name], and we're here to present our website project called 'Dialed' — a phone discovery and comparison platform."

---

## PROJECT OVERVIEW (45 seconds)

> "Dialed is a web application that helps users discover, compare, and track their favorite phones. We built it to solve a real problem: with so many phone models available, users need an easy way to compare specifications and find the right device for their needs."

**Key Features:**
- Phone catalog with detailed specifications
- Comparison tool to side-by-side evaluate devices
- Favorites system to save preferred phones
- Search and filtering capabilities
- Responsive design that works on all devices

---

## TECHNOLOGY STACK (1 minute) — *CRITICAL SECTION*

> "Now, I'd like to address the technology we used. Our project is built with **Next.js**, which is a React framework. I want to be clear about something important: **Next.js generates HTML**. It's not that we 'didn't use HTML' — we used a modern framework that compiles to HTML, just like how professional developers build websites in the real world."

**Key points to emphasize:**

> "Here's how it works: Our `.tsx` files contain JSX — which is a syntax extension that looks like HTML. When we build the project, Next.js compiles this JSX into actual HTML that the browser renders. Let me demonstrate..."

**Say this if asked about HTML:**
> "If you right-click on our live site and select 'View Page Source,' you will see pure HTML. The browser receives and renders HTML — that's what the user sees. Our code just makes it easier to write and maintain."

**Defense points:**
- Next.js is industry-standard (used by Netflix, Uber, Starbucks, etc.)
- The final output is HTML + CSS + JavaScript
- All the HTML elements are there: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<form>`, `<input>`, `<button>`, etc.
- We use semantic HTML throughout

---

## DESIGN & LAYOUT (1 minute)

> "For the design, we focused on meeting all your requirements:

**1. At Least 5 Pages**
- Home, About, Services, Gallery, Contact
- Plus: Dashboard, Favorites, Compare, Phone Details
- That's 9 pages total

**2. Responsive Design**
> "We used CSS Grid and Flexbox throughout. Here's an example from our code..."

```css
/* Grid layout */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

/* Flexbox for navigation */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

> "We also used **container queries** for responsive components — a modern technique that makes components responsive to their container, not just the viewport."

**3. Consistent Design System**
> "All colors, fonts, and spacing are defined as CSS variables in `globals.css`:"

```css
:root {
  --accent: #6366f1;
  --surface: #0f172a;
  --muted: #94a3b8;
  --radius-lg: 16px;
  --space-4: 1rem;
}
```

---

## FUNCTIONALITY (1 minute)

> "Our website isn't just static — it has real functionality:

**Navigation**
- Working links between all pages
- Mobile-responsive navigation with hamburger menu
- Active state indicators

**Interactive Features**
- Phone comparison tool that shows specs side-by-side
- Favorites system that persists data
- Search functionality
- Theme toggle (light/dark mode)

**Forms**
- Contact form with validation
- Login/Signup authentication forms

> "All of this is built with HTML forms and CSS — just enhanced with JavaScript for better user experience."

---

## CODE QUALITY (30 seconds)

> "We followed best practices:

- **Semantic HTML** — Using proper tags like `<header>`, `<nav>`, `<main>`, `<article>`
- **Modular CSS** — Each component has its own stylesheet
- **CSS Variables** — For consistent theming
- **Responsive-first** — Mobile design as a priority
- **Accessibility** — Proper contrast, focus states, and labels

---

## CLOSING (15 seconds)

> "In summary, Dialed meets all your requirements: 9 responsive pages, consistent design with CSS Grid and Flexbox, working navigation, rich content with images, and proper HTML/CSS code. We've also added functionality that goes beyond the basic requirements.

**Thank you for your time. We're ready for your questions."**

---

## ANTICIPATED QUESTIONS & ANSWERS

### Q: "Where is the HTML?"
**A:** "The HTML is generated from our JSX files. When you build the project with `npm run build`, Next.js creates HTML files in the `.next` folder. You can also see the HTML by viewing the page source in your browser."

### Q: "Can you show me the CSS?"
**A:** "Absolutely. We have CSS modules for each component. For example, the header styles are in `components/marketing/SiteHeader.module.css`. Let me show you..."

### Q: "What happens if you remove the JavaScript?"
**A:** "The site will still work for basic viewing. Next.js provides server-side rendering, so the HTML is generated on the server. JavaScript adds interactivity like the theme toggle and favorites, but the core content is visible without it."

### Q: "How do you handle mobile?"
**A:** "We use media queries and container queries. Here's an example from our code..."

```css
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## QUICK REFERENCE: Where Things Are

| What to show | File Location |
|-------------|---------------|
| CSS Variables | `app/globals.css` |
| Header styles | `components/marketing/SiteHeader.module.css` |
| Footer styles | `components/marketing/SiteFooter.module.css` |
| Page layouts | `app/*/page.module.css` |
| Card components | `components/phones/DeviceCard.module.css` |
| Navigation | `components/navigation/InstantNavLink.module.css` |
| Hero section | `components/marketing/hero-section.tsx` |

---

## PRACTICE TIPS

1. **Rehearse the technology defense** — Be confident explaining that Next.js generates HTML
2. **Know where your files are** — Be able to quickly open any CSS file
3. **Practice with DevTools** — Be comfortable making changes in the browser
4. **Keep it natural** — Don't memorize word-for-word, understand the concepts

---

*Good luck with your presentation! 🎉*