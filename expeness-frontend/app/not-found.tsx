import { FileQuestion } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-6">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="text-muted-foreground mt-2 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <ButtonLink href="/" className="mt-8">
        Back to Dashboard
      </ButtonLink>
    </div>
  );
}
