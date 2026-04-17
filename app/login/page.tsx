import type { Route } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthConfigNotice } from "@/components/auth/auth-config-notice";
import { authOptions } from "@/auth";
import { hasConfiguredAuthSecret } from "@/lib/auth/config";

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
      <section className="section">
        <div className="page-shell">
          <AuthConfigNotice />
        </div>
      </section>
    );
  }

  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect(callbackUrl as Route);
  }

  return (
    <section className="section">
      <div className="page-shell">
        <AuthForm mode="login" callbackUrl={callbackUrl} />
      </div>
    </section>
  );
}
