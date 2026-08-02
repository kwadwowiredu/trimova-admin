import { MessageSquareWarning } from "lucide-react";
import { ModulePlaceholder } from "@/components/common/ModulePlaceholder";

export default function ModerationPage() {
  return (
    <ModulePlaceholder
      icon={MessageSquareWarning}
      title="Content Moderation Queue"
      description="The reported-reviews queue with Dismiss / Remove / Issue Warning actions will be built here."
    />
  );
}
