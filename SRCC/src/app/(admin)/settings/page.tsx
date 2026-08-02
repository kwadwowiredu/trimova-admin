import { Settings } from "lucide-react";
import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      icon={Settings}
      title="Settings Configuration Engine"
      description="Commission tiers (Starter / Regular / Pro), cancellation deadline, auto-release timing, and booking constraints will be configured here."
    />
  );
}
