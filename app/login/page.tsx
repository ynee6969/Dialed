/**
 * ===================================
 * LOGIN PAGE
 * ===================================
 * 
 * Purpose: Authenticates users with email/password.
 * Accessible only if auth is configured (environment variables set).
 * 
 * Features:
 * - Form submission with email/password validation
 * - Callback URL support (returns to previous page after login)
 * - Auto-redirects already-logged-in users
 * - Shows auth config notice if secrets not set up
 * 
 * User Journey: New users sign up via /signup, existing users log in here.
 * After successful login, redirected to callback URL or dashboard.
 * 
 * Security: Requires NEXTAUTH_SECRET environment variable to function.
 * If not set, shows configuration notice instead of form.
 */

import type { Route } from "next";
import { redirect } from "next/navigation"; /* Server-side redirect */

import { AuthForm } from "@/components/auth/auth-form";
import { AuthConfigNotice } from "@/components/auth/auth-config-notice";
import { getOptionalSession } from "@/lib/auth/session";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";
import styles from "./page.module.css";

/* force-dynamic: Don't cache this page
   Auth state changes frequently; always check current session */
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

  if (!hasConfiguredAuthSecret()) {
    return (
      <section className={`section ${styles.page}`}>
        <div className="page-shell">
          <AuthConfigNotice />
        </div>
      </section>
    );
  }

  /* Get current user session
     If user is already logged in, no need to show login form */
  const session = await getOptionalSession();

  /* Auto-redirect already-logged-in users
     This prevents confusion and unnecessary form display
     Redirects to callbackUrl (original destination) or dashboard */
  if (session?.user?.id) {
    redirect(callbackUrl as Route);
  }

  return (
    <section className={`section ${styles.page}`}>
      <div className="page-shell">
        <AuthForm mode="login" callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
