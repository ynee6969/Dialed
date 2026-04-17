# Website Defense Package

## 1. Project HTML + CSS Analysis

### Project overview

This project is a multi-page product discovery website called **Dialed**. From an HTML and CSS perspective, its purpose is to present a clean, structured, and responsive interface for browsing, comparing, and reviewing phone information. The design direction is modern and app-like, with reusable layout blocks, card-based presentation, a sticky navigation shell, and a dual-theme visual system.

One important note: this project does **not** use Tailwind. Its styling layer is built with **custom global CSS classes and CSS variables** inside `app/globals.css`. So for defense purposes, the styling system should be explained as a **custom design system made with reusable CSS classes**, not a utility-first framework.

### HTML / JSX structure

#### A. Global page hierarchy

The root structure is consistent across the website:

- `html`
- `body`
- `header`
- `main`
- `footer`
- mobile navigation bar

This is strong because it creates one shared shell for the entire site. Instead of rebuilding the same navigation and footer on every page, the project places them in the root layout so every route inherits the same structure automatically.

#### B. Shared layout components

The shared layout is built from reusable components:

- `SiteHeader`
- `SiteFooter`
- `MobileTabBar`
- `BrandLockup`
- `ThemeToggle`

This makes the structure maintainable. If the header, footer, or branding changes, it only needs to be updated once.

#### C. Main pages in the site

The project contains these visual pages:

- Home page
- About page
- Services page
- Gallery page
- Contact page
- Dashboard page
- Dynamic phone detail page

Each page follows a consistent pattern:

- outer `section`
- inner `page-shell` container
- headings and supporting text
- cards or grids for content

That consistency is good for both users and developers because the layout feels familiar as people move from one page to another.

#### D. Semantic structure

The semantic HTML choices are mostly strong:

- `header` is used for the site top bar
- `nav` is used for desktop and mobile navigation
- `main` wraps page content globally
- `section` is used for major content blocks
- `article` is used for repeatable card items like services and device cards
- `aside` is used in the dashboard for filters and quick-match tools
- `footer` is used for the closing site section
- `ul` and `li` are used for grouped text lists
- `label` is used with form controls on the contact page and dashboard inputs

This makes the project easier to explain in a defense because the structure is not just visual. It also reflects the purpose of each area.

#### E. Heading structure

The heading hierarchy is also well organized:

- Each main page has a primary heading such as `h1`
- Supporting sections on the homepage use `h2`
- Card titles and smaller feature headings use `h3`

That creates a readable content hierarchy and helps the layout feel professional.

#### F. Reusable content blocks

The project reuses several HTML patterns across pages:

- glass-style panels
- section labels
- card blocks
- metric blocks
- pill and chip rows
- button rows
- phone cards

This is an important defense point: the site is component-based, so the HTML is not random per page. It is a system of repeatable building blocks.

### CSS / styling system

#### A. Design tokens with CSS variables

The project uses CSS custom properties for core design values:

- colors
- surfaces
- borders
- text colors
- accent color
- border radius
- shadows

This is a professional approach because it centralizes design decisions. Instead of hardcoding values repeatedly, the project stores them in variables and reuses them across the interface.

#### B. Theme system

The interface supports both dark mode and light mode through:

- `:root` default tokens
- `html[data-theme="dark"]`
- `html[data-theme="light"]`

This is a strong design choice because the same class structure can render in two visual themes without rebuilding the layout.

#### C. Layout system

The site uses both **CSS Grid** and **Flexbox**, and each is used for the right reason:

- **Grid** handles major page structure and card layouts
- **Flexbox** handles one-dimensional alignment such as navigation rows, pill rows, chip rows, and button groups

Examples of Grid usage:

- hero split layout
- two-column marketing sections
- three-column feature card area
- auto-fill phone gallery
- dashboard two-column layout
- comparison grid
- detail summary grid
- spec table sections

Examples of Flexbox usage:

- header row
- footer row
- nav row
- phone card top row
- buttons and chips

This is one of the best parts of the project. The layout system is not overcomplicated, and the use of Grid versus Flexbox is easy to justify.

#### D. Spacing system

Spacing is handled consistently through:

- shared classes like `section`, `card`, `stack`, `field`
- repeating gaps such as `18px`, `20px`, and `24px`
- responsive spacing with `clamp(...)`
- consistent inner padding on cards and containers

This gives the interface rhythm. The design does not feel cramped, and content blocks are clearly separated.

#### E. Typography

The project uses two fonts with distinct roles:

- **Space Grotesk** for major headings and display text
- **Manrope** for body text

This improves visual hierarchy because headings feel bold and expressive while body text remains readable.

Typography is also responsive through:

- large `clamp(...)` values for headings
- tighter letter spacing on major titles
- longer line height for paragraph text

#### F. Visual style

The visual identity is built around:

- glassmorphism-inspired panels
- large rounded corners
- subtle shadows
- layered surfaces
- green accent color for actions and emphasis

This makes the site feel modern and slightly app-like, which fits a dashboard-oriented product.

#### G. UI consistency

Consistency is strong across the site because the same classes are reused for:

- buttons
- cards
- panels
- labels
- metrics
- form fields
- layout containers

That consistency improves usability because users do not need to relearn the interface from page to page.

### Responsiveness analysis

The project has three key responsive breakpoints:

- `1180px`
- `960px`
- `768px`

#### At 1180px and below

- the hero becomes single-column
- the marketing two-column layout stacks vertically
- the feature card area reduces from three columns to two

#### At 960px and below

- the dashboard changes from sidebar + content into one column
- the desktop sidebar is hidden
- mobile action buttons appear
- comparison and card layouts become single-column
- the phone detail hero stacks vertically

#### At 768px and below

- the bottom mobile tab bar appears
- the desktop navigation is hidden
- the footer note is hidden
- major grids collapse to one column
- section spacing becomes tighter
- brand subtitle and theme text are simplified
- spec sections stack for easier reading on narrow screens

This is a solid responsive strategy because the site does not simply shrink. It **reorganizes** itself depending on screen size.

### UI / UX decisions you can defend

#### Why a sidebar is used on the dashboard

The sidebar is used because filters and quick actions are secondary controls, while phone results are the main content. On desktop, placing controls in an `aside` keeps them always available without interrupting the main browsing flow.

#### Why cards are used

Cards make repeated content easier to scan. Each device card separates image, score, price, and summary details into a predictable unit. This is better than presenting everything in long paragraphs or dense tables.

#### Why spacing improves usability

The project uses generous padding, grouped content, and repeated gaps so users can visually separate actions, information, and categories. Good spacing reduces cognitive load and makes the interface easier to understand quickly.

#### Why the design feels app-like on mobile

On smaller screens, the interface switches from desktop navigation and sidebars to:

- a bottom mobile tab bar
- simplified top bar content
- stacked layouts
- sheet-style mobile panels for tools

This creates a more native mobile feel because controls become thumb-friendly and content is prioritized vertically.

### Strongest defense points

If you need the strongest points to emphasize, use these:

1. The website has a **shared semantic layout** with `header`, `main`, `footer`, and route-based sections.
2. The interface is built from **reusable components**, not repeated static markup.
3. The styling is based on a **central CSS design system** using variables, shared classes, and repeatable layout patterns.
4. The project uses **Grid for structure** and **Flexbox for alignment**, which is a strong front-end design choice.
5. Responsiveness is thoughtful because layouts **reorganize**, not just resize.
6. The design maintains **visual consistency** through repeated cards, labels, buttons, spacing, and typography.

### Honest improvement notes

If your teacher asks what can still be improved, you can answer professionally:

- The contact inputs are well labeled, but wrapping them in a formal `<form>` element would strengthen semantics even more.
- Some spacing is applied inline in JSX, so moving more of those values into named CSS classes would make the styling system even cleaner.

Those are good answers because they show awareness without weakening the overall design.

---

## 2. Full Presentation Script

### 1. Introduction

Good day. I will be presenting the front-end structure and design of my website, which is called **Dialed**. The main purpose of this website is to help users browse phone options in a cleaner and more organized way. Instead of showing information in a crowded or confusing format, the website focuses on clear layout, reusable page sections, card-based content, and responsive design.

For this defense, I will focus only on the HTML structure and the CSS styling system. In this project, the HTML is represented by the JSX layout inside the pages and components, while the CSS is handled through a custom global styling system using reusable class names and CSS variables.

### 2. HTML Structure

The first thing I want to highlight is the overall page hierarchy. At the root level, the website uses a shared layout with an `html` element, a `body`, a top `header`, a global `main` content area, a `footer`, and a mobile navigation bar. This structure is important because it keeps the website consistent across all pages.

The header contains the brand identity, the primary navigation links, and the theme toggle. The main element is where each page is rendered. The footer closes the page with supporting brand information, and on smaller screens there is also a mobile tab bar for easier navigation.

Inside the pages, the site uses semantic sections to divide content into meaningful blocks. For example, the homepage is not just one long container. It is divided into a hero section, a feature section, an information section, a gallery preview section, and a closing call-to-action section. This makes the content easier to scan and easier to explain.

The project also uses reusable components heavily. Instead of rewriting the same HTML on different pages, it separates shared parts like the header, footer, hero, and device cards into individual components. This improves maintainability because changes only need to be made once.

Another important part of the structure is semantics. The project uses `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer` in meaningful ways. For example, the dashboard uses an `aside` for filters and tools, while the phone cards are built as `article` elements because each one represents a standalone content unit. Lists use `ul` and `li`, and form controls use `label` elements, which improves clarity and accessibility.

### 3. CSS Design System

Now I will discuss the styling system. This project does not rely on random one-off CSS rules. Instead, it uses a small design system based on reusable classes and CSS variables. The CSS variables define colors, surfaces, borders, radii, shadows, and accent colors. Because of that, the interface stays visually consistent and easier to maintain.

The layout system combines CSS Grid and Flexbox. Grid is used for larger structural layouts such as the hero section, the dashboard layout, the card areas, the gallery grid, the comparison area, and the phone detail summary area. Flexbox is used for smaller horizontal alignments such as the navigation row, button rows, chip rows, and pill rows.

This combination is intentional. Grid is stronger for arranging complete sections and columns, while Flexbox is better for aligning items in a single direction. Using both correctly makes the interface flexible and organized.

Spacing is also handled consistently. The site uses shared spacing classes like `section`, `card`, `stack`, and `field`, along with repeated gap values and responsive padding. This creates a clean visual rhythm and prevents the layout from feeling crowded.

Typography also supports the design. The project uses one display font for titles and one body font for readable content. The headings use larger, bolder styles with tighter spacing, while paragraph text uses more comfortable line height. This creates strong hierarchy without needing too many colors or decorative elements.

### 4. Responsiveness

One of the strengths of the project is that the layout changes properly across screen sizes. On desktop, the dashboard uses a two-column layout with a sidebar on the left and the main results on the right. This works well because larger screens have enough horizontal space for persistent controls.

On tablet-size screens, the layout begins to simplify. Some multi-column areas stack vertically, and the dashboard removes the fixed desktop sidebar. This prevents the page from becoming compressed.

On mobile, the design becomes much more app-like. The desktop navigation is hidden, and a bottom mobile tab bar appears. Large grids collapse into one column. The phone detail page stacks the image and text content vertically. The spec table also becomes easier to read because section labels and rows no longer compete for width.

So the responsive strategy is not just shrinking elements. It is restructuring the interface so each device gets a layout that matches its available space.

### 5. UI/UX Decisions

There are several design decisions that improve usability. First, the dashboard uses a sidebar because filtering tools should stay organized and separate from the main content. This keeps the results area focused while still making the controls easy to access.

Second, the design uses cards for repeated content like phones, services, and summary items. Cards are helpful because they break large amounts of information into manageable pieces. Users can compare one card to another quickly without reading long paragraphs.

Third, spacing and grouping are used carefully. Related items are placed close together, while different sections are separated with larger spacing. This helps users understand the page visually before they even start reading the text.

Fourth, the dark and light theme system improves flexibility. The layout stays the same, but the visual tokens change. This means the interface keeps its structure while adapting to different viewing preferences.

Finally, the mobile layout feels more natural because navigation becomes bottom-based, layouts stack vertically, and dense areas are simplified. That makes the interface feel closer to a native mobile app experience.

### 6. Conclusion

In conclusion, the strength of this project is not only in how it looks, but in how well the structure and styling work together. The HTML side is organized, semantic, and component-based. The CSS side is consistent, responsive, and maintainable because it uses a clear design system.

Overall, the project demonstrates good front-end practice by combining semantic structure, reusable layout patterns, responsive design, and consistent visual styling. That results in a website that is easier to maintain for developers and easier to use for end users.

---

## 3. Presentation Plan (Slides)

### Slide 1: Title / Introduction

**What to say**

Introduce the website as Dialed and explain that it is a responsive multi-page front-end project for browsing and comparing phones.

**Key points**

- Project name and purpose
- Scope of defense: HTML and CSS only
- Goal: clean, responsive, user-friendly interface

**Flow**

Start broad and set expectations.

### Slide 2: Website Overview

**What to say**

Explain the pages included in the project: home, about, services, gallery, contact, dashboard, and phone detail.

**Key points**

- Multi-page structure
- Shared global layout
- Consistent shell across the site

**Flow**

Move from project purpose into project structure.

### Slide 3: Global HTML Structure

**What to say**

Describe the shared root layout: header, main, footer, and mobile navigation. Mention that the structure is reusable across routes.

**Key points**

- `header`, `main`, `footer`
- shared navigation
- reusable layout component

**Flow**

From whole site structure into semantic layout.

### Slide 4: Component Breakdown

**What to say**

Explain the major reusable components like the header, hero, footer, device cards, gallery grid, dashboard layout, and phone detail page.

**Key points**

- reusability
- component-based structure
- easier maintenance

**Flow**

Show that the layout is modular, not static.

### Slide 5: CSS Design System

**What to say**

Discuss CSS variables, shared classes, typography, buttons, cards, colors, and the glass-panel visual style.

**Key points**

- design tokens
- reusable style classes
- consistent visual identity

**Flow**

Transition from HTML structure into styling logic.

### Slide 6: Layout Techniques

**What to say**

Explain where Grid and Flexbox are used and why each one was chosen.

**Key points**

- Grid for sections and page layout
- Flexbox for rows and alignment
- spacing and grouping

**Flow**

Move from styling system into layout mechanics.

### Slide 7: Responsiveness

**What to say**

Explain the desktop, tablet, and mobile layouts, especially the dashboard sidebar, stacked mobile sections, and bottom mobile tab bar.

**Key points**

- breakpoints
- adaptive layout
- mobile-friendly navigation

**Flow**

From general layout into responsive behavior.

### Slide 8: UI/UX Decisions and Conclusion

**What to say**

Summarize why the sidebar, cards, spacing, and theme system improve usability, then end with the maintainability and user experience strengths.

**Key points**

- why sidebar works
- why cards help scanning
- why spacing improves clarity
- maintainable front-end structure

**Flow**

End with design reasoning and overall quality.

---

## 4. 50 Possible Questions with Model Answers

1. **[Easy] Why did you use a shared layout for the whole website?**  
   **Answer:** I used a shared layout so the header, main content area, footer, and mobile navigation stay consistent across all pages. It also reduces repeated HTML and improves maintainability.

2. **[Easy] Why is semantic HTML important in your project?**  
   **Answer:** Semantic HTML makes the structure clearer for both users and developers. It also improves readability, accessibility, and maintainability because each element reflects its real purpose.

3. **[Easy] Why did you use `header`, `main`, and `footer` instead of only `div` elements?**  
   **Answer:** Those semantic elements describe the role of each page area more clearly than generic `div` tags. They make the layout easier to understand and more professional.

4. **[Easy] Why do you use `section` elements so often?**  
   **Answer:** I use `section` to divide the page into meaningful content blocks, such as the hero, feature area, and gallery preview. It creates a cleaner structure than placing everything in one container.

5. **[Easy] Why are phone cards built as `article` elements?**  
   **Answer:** Each phone card is a standalone content unit with its own title, image, summary, and actions. That fits the purpose of an `article`.

6. **[Easy] Why is the dashboard control area an `aside`?**  
   **Answer:** The filter and quick-match panel supports the main content, but it is not the primary content itself. That is why `aside` is a suitable semantic choice.

7. **[Easy] How is your navigation structured?**  
   **Answer:** The desktop layout uses a top navigation inside the header, while the mobile layout uses a bottom tab bar. Both are wrapped in `nav` elements for clear semantic structure.

8. **[Easy] Why are labels important for your inputs?**  
   **Answer:** Labels clearly connect the text description to each input field. That improves usability and accessibility because users understand what each control is for.

9. **[Easy] Why did you separate the website into components?**  
   **Answer:** Components make the HTML reusable and easier to maintain. For example, the same card pattern or header can be used in multiple places without rewriting markup.

10. **[Easy] What makes your homepage structure effective?**  
    **Answer:** The homepage is divided into clear content sections: hero, features, information, gallery preview, and closing CTA. That creates a logical reading flow from introduction to action.

11. **[Medium] Why did you choose CSS Grid for major layouts?**  
    **Answer:** CSS Grid is better for controlling rows and columns at the section level. It works well for the hero split layout, dashboard layout, gallery, comparison area, and summary sections.

12. **[Medium] Why did you still use Flexbox if you already used Grid?**  
    **Answer:** Flexbox is better for one-dimensional alignment, like horizontal navigation, button rows, chip rows, and card header alignment. Grid and Flexbox solve different layout problems.

13. **[Medium] Can you give one example where Grid was the better choice than Flexbox?**  
    **Answer:** The dashboard layout is a good example because it needs a stable two-column structure with a sidebar and a content area. Grid handles that more cleanly than Flexbox.

14. **[Medium] Can you give one example where Flexbox was the better choice than Grid?**  
    **Answer:** The navigation row is a good example because it only needs horizontal alignment and spacing between links. Flexbox is simpler and more suitable there.

15. **[Medium] How do you keep spacing consistent throughout the site?**  
    **Answer:** I use shared classes like `section`, `card`, `stack`, and `field`, along with repeated gap and padding values. That creates a consistent rhythm instead of random spacing per page.

16. **[Medium] Why did you use `clamp()` in your CSS?**  
    **Answer:** I used `clamp()` so spacing and typography can scale smoothly between smaller and larger screens. It helps the design stay balanced without needing too many custom overrides.

17. **[Medium] How did you make the cards visually consistent?**  
    **Answer:** The cards reuse the same panel styling, spacing, border radius, shadow, and surface colors. This repeated styling creates a unified visual system.

18. **[Medium] What is the role of CSS variables in your design?**  
    **Answer:** CSS variables centralize the visual tokens like colors, borders, surfaces, radius, and shadows. That makes the styling easier to maintain and easier to theme.

19. **[Medium] Why did you use two fonts instead of one?**  
    **Answer:** I used one display font for strong headings and one body font for readability. This creates clearer hierarchy and gives the interface more personality.

20. **[Medium] How does your heading hierarchy help the layout?**  
    **Answer:** It guides the user’s attention from major titles to supporting sections and then to smaller card headings. That makes the content easier to scan and understand.

21. **[Medium] What makes your color system defendable?**  
    **Answer:** The colors are controlled through theme tokens instead of scattered hardcoded values. The palette uses a clear background, surface, text, muted, and accent structure, which keeps the UI consistent.

22. **[Medium] Why did you use a green accent color?**  
    **Answer:** The green accent stands out clearly against both dark and light surfaces and works well for actions, scores, and emphasis. It helps important elements become visible without overusing bright colors.

23. **[Medium] Why is the header sticky?**  
    **Answer:** A sticky header keeps navigation accessible while users scroll. That improves usability, especially on longer pages or content-heavy screens.

24. **[Medium] Why is the sidebar sticky on desktop?**  
    **Answer:** It keeps filters and tools available while the user browses the results. That reduces unnecessary scrolling back and makes the browsing process more efficient.

25. **[Medium] Why are phone details shown in cards instead of one large table?**  
    **Answer:** Cards are easier to scan for repeated content. A large table would be more rigid and harder to read quickly, especially on smaller screens.

26. **[Medium] Why do you use pills and chips in the interface?**  
    **Answer:** Pills and chips help highlight short pieces of information like categories, scores, or quick labels. They separate key metadata from longer text.

27. **[Medium] Why did you create a dedicated phone detail page instead of placing everything on the card?**  
    **Answer:** The card is meant for quick scanning, while the detail page is meant for full reading. Separating them keeps the browsing experience clean and avoids overcrowding the card layout.

28. **[Medium] How does your gallery page differ structurally from the dashboard?**  
    **Answer:** The gallery focuses on a simple grid of repeated cards, while the dashboard adds a more complex layout with an `aside`, top area, recommendations, comparison area, and result grid.

29. **[Medium] Why is the contact page split into two columns?**  
    **Answer:** One side presents contact information, while the other side presents the user input area. This creates a balanced layout and separates reading content from action content.

30. **[Medium] Why is the spec sheet on the detail page designed like grouped sections?**  
    **Answer:** Grouped sections make long technical information easier to scan. Instead of one continuous block, the content is divided into labeled categories.

31. **[Hard] How does your responsive strategy go beyond simply resizing elements?**  
    **Answer:** The design actually reorganizes layout behavior. For example, the dashboard removes the desktop sidebar on smaller screens, shows mobile action buttons, and switches to a more vertical mobile structure.

32. **[Hard] Why do you think the mobile tab bar improves UX on small screens?**  
    **Answer:** On mobile, bottom navigation is easier to reach with the thumb and keeps the main routes visible without occupying too much top space. It feels more natural for phone users.

33. **[Hard] Why does the dashboard hide the desktop sidebar on tablet and mobile?**  
    **Answer:** A fixed sidebar would take too much horizontal space on smaller screens. Hiding it prevents a cramped layout and allows the main content to remain readable.

34. **[Hard] How does your card grid stay flexible with different numbers of items?**  
    **Answer:** The card and phone grids use responsive column rules like `repeat(auto-fill, minmax(...))` or breakpoint-based template changes. That lets the layout adapt without manually redefining every card position.

35. **[Hard] Why is your detail page split into a hero area and a spec table area?**  
    **Answer:** The hero area gives users the summary first: image, name, score chips, and key specs. The table area then provides deeper information. This supports progressive disclosure in the layout.

36. **[Hard] How does your design system improve maintainability?**  
    **Answer:** Shared classes and tokens reduce repetition. If I update a button style, card surface, border radius, or accent color, that change can propagate across the whole interface consistently.

37. **[Hard] What makes your design consistent even though different pages serve different purposes?**  
    **Answer:** The pages all reuse the same shell, spacing rules, card treatment, button styles, labels, typography, and color tokens. So even when page content changes, the visual language stays the same.

38. **[Hard] Why is the mobile version not just a smaller desktop version?**  
    **Answer:** Mobile users need a different layout priority. The design changes navigation placement, stacks columns, reduces clutter, and simplifies dense areas so the interface remains usable on narrow screens.

39. **[Hard] Why did you choose a glass-panel style instead of flat boxes?**  
    **Answer:** The glass-panel style adds depth and separation between content areas without using heavy borders or harsh contrast. It supports the modern app-like identity of the site.

40. **[Hard] How do your CSS choices support content scanning?**  
    **Answer:** Clear headings, muted supporting text, card separation, metric blocks, pills, and repeated spacing all help users identify important information quickly instead of reading everything line by line.

41. **[Trick] Is your styling system Tailwind?**  
    **Answer:** No. The project is styled with custom global CSS classes and CSS variables, not Tailwind utilities. The styling is still systematic, but it is built in standard CSS.

42. **[Trick] If you already have semantic tags, do you still need good CSS?**  
    **Answer:** Yes. Semantic HTML gives the page structure and meaning, but CSS is what makes the layout readable, balanced, responsive, and visually consistent.

43. **[Trick] Why not use only `div` and style everything with classes?**  
    **Answer:** That would work visually, but it would weaken the structure. Semantic elements communicate purpose more clearly and make the HTML easier to understand and defend.

44. **[Trick] Does responsive design only mean using media queries?**  
    **Answer:** No. Media queries are part of it, but responsive design also includes flexible layouts, scalable typography, spacing choices, and content reorganization across screen sizes.

45. **[Trick] Is a visually attractive interface automatically a good UI/UX design?**  
    **Answer:** No. Good UI/UX also depends on clarity, consistency, readability, spacing, hierarchy, and ease of navigation. Visual style helps, but structure and usability matter more.

46. **[Follow-up] Why did you keep the homepage sections separate instead of combining them into one long card?**  
    **Answer:** Separate sections improve scanning and create a clearer information flow. Each block has its own purpose, so giving it its own section makes the page easier to understand.

47. **[Follow-up] Why are the quick stats on the hero shown in metric boxes?**  
    **Answer:** Metric boxes make short facts easier to compare visually. They also break dense information into smaller chunks that users can read quickly.

48. **[Follow-up] How would you justify the use of repeated buttons with three visual styles?**  
    **Answer:** Different button styles help communicate priority. The primary button draws attention to the main action, the secondary button supports common actions, and the ghost style handles less dominant actions.

49. **[Follow-up] If you had to improve one HTML detail, what would it be?**  
    **Answer:** I would wrap the contact inputs inside a formal `<form>` element. The labels are already present, so adding the form wrapper would strengthen the semantics even more.

50. **[Follow-up] If you had to improve one CSS detail, what would it be?**  
    **Answer:** I would move more inline spacing values into named CSS classes. That would make the styling system even cleaner and more centralized.
