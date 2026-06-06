import { Bell, Search, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/explore": "Explore",
  "/chat": "Messages",
  "/notifications": "Notifications",
  "/bookmarks": "Bookmarks",
  "/connections": "Connections",
  "/analytics": "Analytics",
  "/settings": "Settings",
  "/admin": "Admin Panel",
  "/profile": "Profile",
};

export function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "SkillSwap Hub";

  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      <span className="text-sm font-semibold text-foreground truncate">{title}</span>

      <div className="ml-auto flex items-center gap-2 min-w-0">
        <div className="hidden sm:flex items-center gap-2 bg-muted border border-border rounded-md px-3 py-1.5 w-48 focus-within:border-primary/40 transition-colors flex-shrink-0">
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>

        <Link
          to="/notifications"
          className="relative p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full" />
        </Link>

        <Link to="/profile" className="flex-shrink-0 ml-1">
          <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/25 transition-colors select-none">
            A
          </div>
        </Link>
      </div>
    </header>
  );
}
