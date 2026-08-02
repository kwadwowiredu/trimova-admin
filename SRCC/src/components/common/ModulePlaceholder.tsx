import { Hammer, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

/**
 * Temporary stand-in for modules scheduled after auth + dashboard
 * (Users, Finance, Security, Moderation, Settings). Keeps the persistent
 * sidebar navigation functional. Replace each route's page.tsx as the module
 * is built out per the AGENTS.md spec.
 */
export function ModulePlaceholder({
  title,
  description,
  icon: Icon = Hammer,
}: ModulePlaceholderProps) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon size={26} />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-text">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      <span className="mt-5 rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-text-muted">
        Module in progress
      </span>
    </Card>
  );
}
