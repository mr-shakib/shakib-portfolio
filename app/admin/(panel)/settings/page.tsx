import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { AdminHeader, Panel } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const admin = await requireAdmin();
  return (
    <>
      <AdminHeader eyebrow="Account" title="Settings" />
      <Panel className="max-w-xl">
        <h2 className="font-medium text-foreground">Change password</h2>
        <p className="mt-1 text-sm text-muted">
          Signed in as <span className="text-foreground">{admin.email}</span>. Changing your password signs out
          every other browser.
        </p>
        <PasswordForm />
      </Panel>
    </>
  );
}
