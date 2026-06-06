import { useState } from "react";
import { Bell, MessageSquare, Star, CheckCheck, UserPlus } from "lucide-react";
import { mockNotifications } from "../data/mockData";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  request: { icon: UserPlus, color: "text-primary bg-primary/10" },
  message: { icon: MessageSquare, color: "text-blue-400 bg-blue-400/10" },
  review: { icon: Star, color: "text-yellow-400 bg-yellow-400/10" },
  system: { icon: Bell, color: "text-green-400 bg-green-400/10" },
};

const filterTabs = ["all", "requests", "messages", "reviews"] as const;
type Filter = typeof filterTabs[number];

export function Notifications() {
  const [filter, setFilter] = useState<Filter>("all");
  const unread = mockNotifications.filter((n) => !n.read).length;

  const visible = mockNotifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "requests") return n.type === "request";
    if (filter === "messages") return n.type === "message";
    if (filter === "reviews") return n.type === "review";
    return true;
  });

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 border border-border rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0">
          <CheckCheck size={14} />
          Mark all read
        </button>
      </div>

      {/* Filter tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {filterTabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                filter === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {visible.map((n) => {
          const cfg = typeConfig[n.type] ?? typeConfig.system;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              className={`bg-card border rounded-lg px-5 py-4 flex items-start gap-4 transition-colors ${
                !n.read ? "border-primary/25 bg-primary/3" : "border-border"
              }`}
            >
              <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                <Icon size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-foreground">{n.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{n.timestamp}</span>
                    {!n.read && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>

                {n.type === "request" && (
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors">
                      Accept
                    </button>
                    <button className="px-3 py-1.5 border border-border text-xs font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="bg-card border border-border rounded-lg py-12 text-center">
            <p className="text-sm text-muted-foreground">No notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
