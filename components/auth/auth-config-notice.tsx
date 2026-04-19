/**
 * ===================================
 * AUTH CONFIG NOTICE
 * ===================================
 *
 * Purpose:
 * Shows a friendly setup message when auth secrets are missing in the environment.
 *
 * Why this matters:
 * Instead of crashing the page, the app explains what is missing and gives the user
 * a safe way back to the public dashboard.
 */
import Link from "next/link";

import { authConfigurationMessage } from "@/lib/auth/config";
import styles from "./AuthForm.module.css";

export function AuthConfigNotice() {
  return (
    <div className={`auth-shell ${styles.scope}`}>
      <div className="glass-panel auth-card">
        <span className="section-label">Auth Setup Needed</span>
        <h1 className="feature-title">Authentication is not configured yet.</h1>
        <p className="section-copy" style={{ maxWidth: "none" }}>
          {authConfigurationMessage}
        </p>
        <p className="muted" style={{ marginBottom: 0 }}>
          Add the secret in Vercel, redeploy, and the login/signup flow will start working.
        </p>
        <div className="button-row" style={{ marginTop: 20 }}>
          <Link href="/dashboard" className="button-secondary">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
