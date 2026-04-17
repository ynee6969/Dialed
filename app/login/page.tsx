import type { Route } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AuthForm } from "@/components/auth/auth-form";
import { authOptions } from "@/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/dashboard";

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
