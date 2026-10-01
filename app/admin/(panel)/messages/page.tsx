import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { setMessageStatus } from "@/lib/admin/actions";
import { DeleteMessageButton } from "@/components/admin/DeleteMessageButton";
import { AdminHeader, Badge } from "@/components/admin/ui";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Messages" };

const stamp = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const archived = (await searchParams).view === "archived";
  const messages = await prisma.contactMessage.findMany({
    where: archived ? { status: "ARCHIVED" } : { status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <>
      <AdminHeader eyebrow="Inbox" title="Messages" description="Submissions from the contact form." />

      <nav aria-label="Folder" className="mb-6 inline-flex rounded-lg border border-white/10 p-1">
        {[
          { label: "Inbox", href: "/admin/messages", on: !archived },
          { label: "Archived", href: "/admin/messages?view=archived", on: archived },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={tab.on ? "true" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs transition-colors",
              tab.on ? "bg-white/10 font-semibold text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-muted">
          {archived ? "Nothing archived." : "No messages yet."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => {
            const unread = m.status === "UNREAD";
            return (
              <li
                key={m.id}
                id={m.id}
                className={cn(
                  "scroll-mt-6 rounded-2xl border bg-surface p-5",
                  unread ? "border-volt/40" : "border-white/10",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2">
                      {unread && <Badge tone="accent">New</Badge>}
                      <span className="font-medium text-foreground">{m.subject}</span>
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {m.name} ·{" "}
                      <a href={`mailto:${m.email}`} className="text-white/80 hover:text-accent">
                        {m.email}
                      </a>
                    </p>
                  </div>
                  <time className="text-xs text-muted" dateTime={m.createdAt.toISOString()}>
                    {stamp.format(m.createdAt)}
                  </time>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/90">{m.message}</p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
                  >
                    Reply
                  </a>
                  <form action={setMessageStatus.bind(null, m.id, unread ? "READ" : "UNREAD")}>
                    <SmallButton>{unread ? "Mark read" : "Mark unread"}</SmallButton>
                  </form>
                  <form action={setMessageStatus.bind(null, m.id, archived ? "READ" : "ARCHIVED")}>
                    <SmallButton>{archived ? "Move to inbox" : "Archive"}</SmallButton>
                  </form>
                  <DeleteMessageButton id={m.id} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function SmallButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </button>
  );
}
