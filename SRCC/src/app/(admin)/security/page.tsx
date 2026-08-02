import { ShieldCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";

export default function SecurityPage() {
  return (
    <ModulePlaceholder
      icon={ShieldCheck}
      title="Suspicious Activity Control Panel"
      description="The flagged-entity workspace with Pending / Cleared / Action Taken statuses and the collusion filter engine will live here."
    />
  );
}
