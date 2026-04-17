import { site } from "@/lib/site";

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
          <div className="stack" style={{ marginTop: 22 }}>
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
