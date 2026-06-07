import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Star, CheckCheck, UserPlus, Check, X } from "lucide-react";
import { mockUsers } from "../data/mockData";

const typeConfig = {
  request: { icon: UserPlus, color: "text-primary bg-primary/10" },
  message: { icon: MessageSquare, color: "text-blue-400 bg-blue-400/10" },
  review: { icon: Star, color: "text-yellow-400 bg-yellow-400/10" },
  system: { icon: Bell, color: "text-green-400 bg-green-400/10" },
};

const filterTabs = ["all", "requests", "messages", "reviews"];

export function Notifications({ notifications, setNotifications, setSelectedChatUserId }) {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visibleNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "requests") return n.type === "request";
    if (filter === "messages") return n.type === "message";
    if (filter === "reviews") return n.type === "review";
    return true;
  });

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleAcceptRequest = async (notification) => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/${notification.referenceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true, status: "accepted" } : n
          )
        );
      }
    } catch (err) {
      console.error("Failed to accept request:", err);
    }
  };

  const handleDeclineRequest = async (notification) => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/${notification.referenceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "declined" }),
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true, status: "declined" } : n
          )
        );
      }
    } catch (err) {
      console.error("Failed to decline request:", err);
    }
  };

  const handleMarkOneRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleNotificationClick = (n) => {
    if (!n.read) {
      handleMarkOneRead(n.id);
    }
    if (n.type === "message") {
      const user = mockUsers.find((u) => n.message.includes(u.name));
      if (user && setSelectedChatUserId) {
        setSelectedChatUserId(user.id);
        navigate("/chat");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-2 border border-border rounded-md px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
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
              className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px cursor-pointer ${
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
      <div className="space-y-3">
        {visibleNotifications.map((n) => {
          const cfg = typeConfig[n.type] || typeConfig.system;
          const Icon = cfg.icon;
          return (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`bg-card border rounded-lg px-5 py-4.5 flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                !n.read
                  ? "border-primary/25 bg-primary/4 shadow-sm shadow-primary/2"
                  : "border-border hover:bg-muted/30"
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
                  <div className="mt-3">
                    {n.status === "accepted" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-500 font-semibold bg-green-500/10 px-2.5 py-1 rounded-md">
                        <Check size={12} /> Accepted
                      </span>
                    ) : n.status === "declined" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold bg-red-500/10 px-2.5 py-1 rounded-md">
                        <X size={12} /> Declined
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptRequest(n);
                          }}
                          className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineRequest(n);
                          }}
                          className="px-3.5 py-1.5 border border-border text-xs font-semibold rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visibleNotifications.length === 0 && (
          <div className="bg-card border border-border rounded-lg py-16 text-center">
            <p className="text-sm text-muted-foreground">No notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
