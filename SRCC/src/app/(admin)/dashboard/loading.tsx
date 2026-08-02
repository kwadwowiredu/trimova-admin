import { Card } from "@/components/ui/Card";

/** Skeleton shown while the server fetches the dashboard snapshot. */
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="skeleton h-3 w-20 rounded" />
            <div className="skeleton mt-3 h-7 w-24 rounded" />
            <div className="skeleton mt-3 h-3 w-16 rounded" />
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="skeleton h-4 w-40 rounded" />
        <div className="skeleton mt-5 h-64 w-full rounded" />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton h-12 w-full rounded" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
