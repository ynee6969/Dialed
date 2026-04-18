/**
 * ===================================
 * SIGNUP PAGE
 * ===================================
 * 
 * Purpose: New user registration with email/password.
 * Nearly identical to login page but with mode="signup" passed to form.
 * 
 * Features:
 * - Email + password form with validation
 * - Automatic login after successful signup
 * - Callback URL support (returns to previous page after signup)
 * - Auto-redirects already-logged-in users
 * - Shows auth config notice if secrets not set up
 * 
 * User Journey: New visitors click "Sign up" → Fill form → Auto-login → Redirect to dashboard.
 * Existing users can use login page instead.
 * 
 * Security: Requires NEXTAUTH_SECRET environment variable.
 * All passwords are hashed on the server before database storage.
 */

import type { Route } from "next";
import { redirect } from "next/navigation"; /* Server-side redirect */

import { AuthForm } from "@/components/auth/auth-form";
import { AuthConfigNotice } from "@/components/auth/auth-config-notice";
import { getOptionalSession } from "@/lib/auth/session";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";

/* force-dynamic: Don't cache this page
   Auth state changes; always check current session */
export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

  if (!hasConfiguredAuthSecret()) {
    return (
      <section className="section">
        <div className="page-shell">
          <AuthConfigNotice />
        </div>
      </section>
    );
  }

  const session = await getOptionalSession();

  if (session?.user?.id) {
    redirect(callbackUrl as Route);
  }

  return (
    <section className="section">
      <div className="page-shell">
        <AuthForm mode="signup" callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
