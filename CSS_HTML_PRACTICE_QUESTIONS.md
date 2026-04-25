# CSS & HTML Practice Questions for Presentation

## How to Use This Guide

1. **Practice with DevTools** — Open your site, right-click → Inspect, and try each modification
2. **Know Your Files** — Be able to quickly locate:
   - `app/globals.css` — global styles & CSS variables
   - `app/**/*.module.css` — page-specific styles
   - `components/**/*.module.css` — component styles

---

## LAYOUT & STRUCTURE

### Q1: Add a border around the header
**Answer:**
```css
header {
  border: 2px solid var(--accent);
}
```
**Location:** Find header styles in `components/marketing/SiteHeader.module.css`

---

### Q2: Make the navigation links display horizontally
**Answer:**
```css
nav {
  display: flex;
  flex-direction: row;
}
```
**Location:** Check `components/navigation/InstantNavLink.module.css`

---

### Q3: Center the content in the hero section
**Answer:**
```css
.hero-section {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
```

---

### Q4: Add padding around the main content area
**Answer:**
```css
main {
  padding: 2rem;
}
```

---

### Q5: Make the footer stick to the bottom
**Answer:**
```css
body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
footer {
  margin-top: auto;
}
```

---

### Q6: Create a 2-column layout for the services page
**Answer:**
```css
.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
```

---

### Q7: Make the gallery images display in a grid
**Answer:**
```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}
```

---

### Q8: Add spacing between navigation items
**Answer:**
```css
nav a, nav button {
  margin: 0 12px;
}
```

---

### Q9: Make the contact form display in a single column
**Answer:**
```css
form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

---

### Q10: Create a card layout with equal-height columns
**Answer:**
```css
.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.card {
  height: 100%;
}
```

---

## COLORS & VISUALS

### Q11: Change the primary color to blue
**Answer:**
```css
:root {
  --accent: #3b82f6;
  --accent-rgb: 59, 130, 246;
}
```
**Location:** `app/globals.css` — CSS variables at the top

---

### Q12: Add a background color to the body
**Answer:**
```css
body {
  background-color: var(--surface);
}
```

---

### Q13: Make the heading text red
**Answer:**
```css
h1, h2, h3 {
  color: #ef4444;
}
```

---

### Q14: Add a subtle shadow to all cards
**Answer:**
```css
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

### Q15: Change the button background color
**Answer:**
```css
button {
  background-color: var(--accent);
}
```

---

### Q16: Make the links a different color on hover
**Answer:**
```css
a:hover {
  color: var(--accent);
}
```

---

### Q17: Add a gradient background to the hero
**Answer:**
```css
.hero {
  background: linear-gradient(135deg, var(--surface) 0%, var(--surface-soft) 100%);
}
```

---

### Q18: Make the text lighter (muted)
**Answer:**
```css
p {
  color: var(--muted);
}
```

---

### Q19: Add a border radius to images
**Answer:**
```css
img {
  border-radius: 8px;
}
```

---

### Q20: Change the focus outline color
**Answer:**
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

---

## TYPOGRAPHY

### Q21: Increase the font size of headings
**Answer:**
```css
h1 { font-size: 3rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
```

---

### Q22: Change the font family
**Answer:**
```css
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

---

### Q23: Make the text bold
**Answer:**
```css
strong, b {
  font-weight: 700;
}
```

---

### Q24: Add line height to paragraphs
**Answer:**
```css
p {
  line-height: 1.6;
}
```

---

### Q25: Center align the text
**Answer:**
```css
.text-center {
  text-align: center;
}
```

---

### Q26: Make all links uppercase
**Answer:**
```css
a {
  text-transform: uppercase;
}
```

---

### Q27: Add letter spacing to headings
**Answer:**
```css
h1, h2, h3 {
  letter-spacing: -0.02em;
}
```

---

### Q28: Make the navigation links smaller
**Answer:**
```css
nav a {
  font-size: 0.875rem;
}
```

---

## SPACING & SIZING

### Q29: Add margin between sections
**Answer:**
```css
section {
  margin-bottom: 3rem;
}
```

---

### Q30: Make the container narrower
**Answer:**
```css
.container {
  max-width: 800px;
  margin: 0 auto;
}
```

---

### Q31: Add gap between grid items
**Answer:**
```css
.grid {
  gap: 24px;
}
```

---

### Q32: Make the images smaller
**Answer:**
```css
img {
  max-width: 100%;
  height: auto;
}
```

---

### Q33: Add padding inside cards
**Answer:**
```css
.card {
  padding: 24px;
}
```

---

### Q34: Make the header taller
**Answer:**
```css
header {
  height: 80px;
}
```

---

### Q35: Add space between form fields
**Answer:**
```css
.form-group {
  margin-bottom: 16px;
}
```

---

## RESPONSIVE DESIGN

### Q36: Make it stack vertically on mobile
**Answer:**
```css
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
}
```

---

### Q37: Hide something on mobile
**Answer:**
```css
@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
}
```

---

### Q38: Change layout from 3 columns to 1 on mobile
**Answer:**
```css
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

### Q39: Make the font smaller on mobile
**Answer:**
```css
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
```

---

### Q40: Add padding only on mobile
**Answer:**
```css
@media (max-width: 768px) {
  main {
    padding: 16px;
  }
}
```

---

## INTERACTIVITY & ANIMATION

### Q41: Add hover effect to buttons
**Answer:**
```css
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

### Q42: Add transition to color changes
**Answer:**
```css
a {
  transition: color 0.2s ease;
}
```

---

### Q43: Make cards lift on hover
**Answer:**
```css
.card:hover {
  transform: translateY(-4px);
}
```

---

### Q44: Add fade-in animation
**Answer:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.element {
  animation: fadeIn 0.5s ease;
}
```

---

### Q45: Add slide-in animation
**Answer:**
```css
@keyframes slideIn {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

---

### Q46: Make the cursor a pointer on buttons
**Answer:**
```css
button, a.button {
  cursor: pointer;
}
```

---

### Q47: Add loading spinner
**Answer:**
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## HTML STRUCTURE

### Q48: Add a new section to the page
**Answer:**
```html
<section>
  <h2>Section Title</h2>
  <p>Section content goes here.</p>
</section>
```

---

### Q49: Create a navigation menu
**Answer:**
```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/services">Services</a>
  <a href="/contact">Contact</a>
</nav>
```

---

### Q50: Create a form with input fields
**Answer:**
```html
<form>
  <div class="form-group">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div class="form-group">
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
  </div>
  <button type="submit">Submit</button>
</form>
```

---

## Quick Reference: Finding Styles Fast

| What you need to change | Where to look |
|------------------------|---------------|
| Colors | `app/globals.css` → `:root` variables |
| Header | `components/marketing/SiteHeader.module.css` |
| Footer | `components/marketing/SiteFooter.module.css` |
| Hero | `components/marketing/hero-section.tsx` + CSS |
| Cards | `components/phones/DeviceCard.module.css` |
| Page layout | `app/*/page.module.css` |
| Forms | Check individual form components |

---

## Pro Tips for the Exam

1. **Use Inspect Element** — Right-click → Inspect to find the exact CSS rule
2. **Use Computed tab** — See all applied styles in order
3. **Add new rules** — Click "+" in Styles panel to add temporary changes
4. **Toggle checkboxes** — Quick way to test enabling/disabling properties
5. **Know your CSS variables** — Most colors use `var(--accent)`, `var(--surface)`, etc.

Good luck! 🎉