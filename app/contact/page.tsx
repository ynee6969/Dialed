/**
 * ===================================
 * CONTACT PAGE
 * ===================================
 * 
 * Purpose: Provides contact information and allows users to send feedback.
 * Two-column layout: Contact info + message form.
 * 
 * Features:
 * - Display email address for direct contact
 * - List partnership opportunities (retail, listings, data)
 * - Outline focus areas (catalog fixes, compare tools, scoring)
 * - Contact form for feedback/bug reports/suggestions
 * 
 * User Journey: Users with questions or improvements reach out here.
 * Form allows them to describe issues without leaving the app.
 * 
 * Note: Form is a UI-only placeholder in current version.
 * Full backend integration would handle form submission to email service.
 */

import { site } from "@/lib/site"; /* Contains site.email config */

export default function ContactPage() {
  return (
    <section className="section">
      <div className="page-shell marketing-grid">
        <div className="glass-panel card">
          <span className="section-label">Contact</span>
          <h1 className="section-title">Questions or suggestions?</h1>
          <p className="section-copy">
            Use this page for feedback, bug reports, partnership ideas, or data corrections.
          </p>
          {/* Contact information stack - 3 key items */}
          <div className="stack" style={{ marginTop: 22 }}>
            {/* Contact method 1: Direct email */}
            <div className="metric">
              <span>Email</span>
              {site.email}
            </div>
            <div className="metric">
              <span>Partnerships</span>
              retail, listings, and device data
            </div>
            <div className="metric">
              <span>Focus</span>
              catalog fixes, compare tools, and scoring updates
            </div>
          </div>
        </div>

        <div className="glass-panel card">
          <div className="stack">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" className="input" placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" placeholder="name@company.com" />
            </div>
            <div className="field">
              <label htmlFor="message">What do you need?</label>
              <textarea id="message" className="textarea" placeholder="Tell us what you want fixed, added, or improved." />
            </div>
            <button className="button" type="button">
              Send message
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
