"use client";

import type { Route } from "next";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { LoaderCircle } from "lucide-react";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  callbackUrl: string;
}

const authContent = {
  login: {
    title: "Welcome back",
    copy: "Sign in to save phones, keep favorites synced, and pick up your shortlist anywhere.",
    submitLabel: "Log in",
    alternateLabel: "Need an account?",
    alternateHref: "/signup",
    alternateAction: "Create one"
  },
  signup: {
    title: "Create your Dialed account",
    copy: "Save standout phones, keep your shortlist attached to your account, and compare with context later.",
    submitLabel: "Create account",
    alternateLabel: "Already have an account?",
    alternateHref: "/login",
    alternateAction: "Log in"
  }
} as const;

const sessionVerificationRetries = 4;
const sessionVerificationDelayMs = 150;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readAuthenticatedSession() {
  for (let attempt = 0; attempt < sessionVerificationRetries; attempt += 1) {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      const session = (await response.json()) as {
        user?: {
          id?: string;
          email?: string | null;
        } | null;
      };

      if (session?.user?.id) {
        return session;
      }
    }

    await wait(sessionVerificationDelayMs);
  }

  return null;
}

export function AuthForm({ mode, callbackUrl }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const content = authContent[mode];
  const alternateHref = `${content.alternateHref}?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    startTransition(async () => {
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({ error: "Could not create your account." }));
          setError(data.error ?? "Could not create your account.");
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (result?.error || !result?.ok) {
        setError(
          mode === "login"
            ? "We couldn't sign you in with that email and password."
            : "Your account was created, but the automatic sign in failed. Please try logging in."
        );
        return;
      }

      const session = await readAuthenticatedSession();

      if (!session?.user?.id) {
        setError(
          mode === "login"
            ? "We could not confirm your session after signing in. Please try again."
            : "Your account was created, but we could not confirm the new session yet. Please log in once to continue."
        );
        return;
      }

      window.location.assign(callbackUrl);
    });
  }

  return (
    <div className="auth-shell">
      <div className="glass-panel auth-card">
        <span className="section-label">{mode === "login" ? "Log In" : "Sign Up"}</span>
        <h1 className="feature-title">{content.title}</h1>
        <p className="section-copy" style={{ maxWidth: "none" }}>
          {content.copy}
        </p>

        <form className="stack" style={{ marginTop: 20 }} onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" className="input" placeholder="Wayne" autoComplete="name" required />
            </div>
          ) : null}

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className="input"
              type="password"
              placeholder="At least 8 characters"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={8}
              required
            />
          </div>

          {error ? (
            <div className="auth-message auth-message-error" role="alert">
              {error}
            </div>
          ) : null}

          <button type="submit" className="button auth-submit" disabled={isPending}>
            {isPending ? <LoaderCircle size={16} className="spin" /> : null}
            <span>{content.submitLabel}</span>
          </button>
        </form>

        <p className="muted" style={{ marginBottom: 0, marginTop: 18 }}>
          {content.alternateLabel}{" "}
          <Link href={alternateHref as Route} className="inline-link">
            {content.alternateAction}
          </Link>
        </p>
      </div>
    </div>
  );
}
