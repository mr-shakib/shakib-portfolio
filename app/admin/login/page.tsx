import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { features } from "@/lib/env";
import { getAdmin } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getAdmin()) redirect("/admin");
  const { next } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="font-display text-4xl uppercase leading-none text-foreground">
          SH<span className="text-accent">—</span>
        </p>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Sign in to the admin</h1>
        <p className="mt-2 text-sm text-muted">Edit every section, project and publication on the site.</p>

        {features.admin ? (
          <LoginForm next={next?.startsWith("/admin") ? next : undefined} />
        ) : (
          <div className="mt-8 rounded-xl border border-[#ffd000]/30 bg-[#ffd000]/10 p-4 text-sm leading-relaxed text-foreground">
            The admin panel isn’t configured. Set <code className="text-warning">DATABASE_URL</code> and{" "}
            <code className="text-warning">AUTH_SECRET</code> (32+ characters) in the environment, then restart
            the server.
          </div>
        )}
      </div>
    </main>
  );
}
