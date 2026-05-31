import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-display-lg text-gradient-accent">404</p>
      <h1 className="font-display text-heading">This page drifted out of orbit.</h1>
      <p className="max-w-md text-muted">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <div className="flex gap-3">
        <Button href="/">Back home</Button>
        <Button href="/projects" variant="outline">
          View projects
        </Button>
      </div>
      <Link href="/contact" className="text-sm text-muted underline-offset-4 hover:underline">
        Or get in touch
      </Link>
    </main>
  );
}
