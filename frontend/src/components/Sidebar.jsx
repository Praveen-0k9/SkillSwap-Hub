import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Compass, MessageSquare, Bell, Bookmark,
  Users, BarChart2, Settings, Shield, X, Zap, LogOut
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Compass, label: "Explore", path: "/explore" },
  { icon: MessageSquare, label: "Messages", path: "/chat" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
  { icon: Users, label: "Connections", path: "/connections" },
  { icon: BarChart2, label: "Analytics", path: "/analytics" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Shield, label: "Admin", path: "/admin" },
];

function NavItem({ icon: Icon, label, path, badge, isActive, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="truncate flex-1">{label}</span>
      {badge ? (
        <span className="flex-shrink-0 ml-auto bg-primary text-primary-foreground text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

export function Sidebar({ isOpen, onClose, unreadNotifications = 0, unreadMessages = 0, user, onLogout }) {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-card border-r border-border z-50 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0" onClick={onClose}>
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-bold text-foreground truncate">SkillSwap Hub</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            let badge = undefined;
            if (item.path === "/notifications") {
              badge = unreadNotifications;
            } else if (item.path === "/chat") {
              badge = unreadMessages;
            }
            return (
              <NavItem
                key={item.path}
                {...item}
                badge={badge}
                isActive={location.pathname === item.path}
                onClick={onClose}
              />
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-border space-y-0.5 flex-shrink-0">
          {bottomItems
            .filter((item) => item.path !== "/admin" || (user && user.role === "admin"))
            .map((item) => (
              <NavItem
                key={item.path}
                {...item}
              isActive={location.pathname === item.path}
              onClick={onClose}
            />
          ))}

          {/* User row */}
          {user && (
            <div className="flex items-center justify-between gap-2 mt-2 p-1.5 rounded-md hover:bg-muted/40 transition-colors">
              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 flex-1"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-primary/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 select-none uppercase">
                    {user.name ? user.name[0] : "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    @{user.email ? user.email.split("@")[0] : "user"}
                  </p>
                </div>
              </Link>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all cursor-pointer flex-shrink-0"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
