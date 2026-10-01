import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/AdminNav";

/** Signed-in admin shell. Everything under it is per-request and never cached. */
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const unread = await prisma.contactMessage.count({ where: { status: "UNREAD" } });

  return (
    <div className="min-h-svh lg:flex">
      <AdminNav email={admin.email} unread={unread} />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
