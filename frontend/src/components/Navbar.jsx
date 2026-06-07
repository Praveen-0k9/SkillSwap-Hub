import { Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar({ onMenuClick, user }) {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      <div className="ml-auto flex items-center gap-2 min-w-0">
        <div className="hidden sm:flex items-center gap-2 bg-muted border border-border rounded-md px-3 py-1.5 w-48 focus-within:border-primary/40 transition-colors flex-shrink-0">
          <Search size={13} className="text-muted-foreground flex-shrink-0" />
          <input
            placeholder="Search..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>

        <Link to="/profile" className="flex-shrink-0 ml-1">
          {user && user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-primary/30 hover:border-primary/50 transition-colors"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/25 transition-colors select-none uppercase">
              {user && user.name ? user.name[0] : "A"}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
