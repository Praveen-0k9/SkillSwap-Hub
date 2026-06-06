import { useState, useRef, useEffect } from "react";
import { Users, BookOpen, AlertTriangle, Ban, TrendingUp, MoreVertical, Check, X, ShieldAlert, ShieldCheck } from "lucide-react";
import { mockUsers, mockSkills } from "../data/mockData";

const tabs = ["Users", "Skills", "Reports"];

const initialReports = [
  { id: 1, type: "Inappropriate Content", reporter: "Sarah Chen", reported: "John Doe", reason: "Spam messages in chat", date: "2 hours ago" },
  { id: 2, type: "Fake Skill", reporter: "Marcus Thompson", reported: "Jane Smith", reason: "Skill description does not match content", date: "5 hours ago" },
  { id: 3, type: "Harassment", reporter: "Emily Rodriguez", reported: "Bob Wilson", reason: "Rude behavior during collaboration", date: "1 day ago" },
];

export function Admin() {
  const [tab, setTab] = useState("Users");
  
  // Stateful Data Lists
  const [users, setUsers] = useState(() => 
    mockUsers.map(u => ({ ...u, status: u.online ? "online" : "offline" }))
  );
  const [skills, setSkills] = useState(mockSkills);
  const [reports, setReports] = useState(initialReports);

  // Dropdown states
  const [activeUserMenuId, setActiveUserMenuId] = useState(null);
  const [activeSkillMenuId, setActiveSkillMenuId] = useState(null);

  // Feedback Toast state
  const [toast, setToast] = useState(null);
  
  // Count derived stats
  const totalUsersCount = users.length + 1240; // mock base + dynamic items
  const totalSkillsCount = skills.length + 3835; // mock base + dynamic items
  const pendingReportsCount = reports.length;
  const blockedUsersCount = users.filter(u => u.status === "banned").length + 8;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveUserMenuId(null);
      setActiveSkillMenuId(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Moderation Actions
  const handleResolveReport = (id, reporter, reported) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast(`Report against ${reported} resolved. Reporter ${reporter} notified!`, "success");
  };

  const handleDismissReport = (id, reported) => {
    setReports(prev => prev.filter(r => r.id !== id));
    showToast(`Report against ${reported} dismissed.`, "info");
  };

  const handleToggleUserBan = (userId, name) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === "banned" ? "offline" : "banned";
        showToast(`${name} has been ${newStatus === "banned" ? "suspended" : "reactivated"}.`, newStatus === "banned" ? "error" : "success");
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const handleToggleUserVerify = (userId, name, isCurrentlyVerified) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        showToast(`${name}'s verification status ${!isCurrentlyVerified ? "granted" : "revoked"}.`, "success");
        return { ...u, verified: !isCurrentlyVerified };
      }
      return u;
    }));
  };

  const handleToggleSkillStatus = (skillId, name, isDeactivated) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        showToast(`Skill "${name}" ${!isDeactivated ? "deactivated" : "reactivated"}.`, !isDeactivated ? "error" : "success");
        return { ...s, deactivated: !isDeactivated };
      }
      return s;
    }));
  };

  return (
    <div className="relative space-y-6">
      {/* Dynamic Feedback Toast Banner */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 animate-slide-in ${
            toast.type === "success"
              ? "bg-slate-900 border-success/30 text-success-foreground"
              : toast.type === "error"
              ? "bg-slate-900 border-destructive/30 text-destructive-foreground"
              : "bg-slate-900 border-primary/30 text-primary-foreground"
          }`}
        >
          {toast.type === "success" ? (
            <ShieldCheck size={18} className="text-success" />
          ) : toast.type === "error" ? (
            <ShieldAlert size={18} className="text-destructive" />
          ) : (
            <AlertTriangle size={18} className="text-primary" />
          )}
          <span className="text-sm font-medium text-slate-200">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-0.5 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage users, skills, and platform moderation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: totalUsersCount.toLocaleString(), delta: "+48 this week", icon: Users, color: "text-primary" },
          { label: "Total Skills", value: totalSkillsCount.toLocaleString(), delta: "+120 this week", icon: BookOpen, color: "text-blue-400" },
          { label: "Pending Reports", value: pendingReportsCount, delta: pendingReportsCount > 0 ? `${pendingReportsCount} needs review` : "all caught up", icon: AlertTriangle, color: pendingReportsCount > 0 ? "text-yellow-500 animate-pulse" : "text-slate-400" },
          { label: "Blocked Users", value: blockedUsersCount, delta: "+2 this week", icon: Ban, color: "text-red-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={s.color} />
                <TrendingUp size={14} className="text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground tracking-tight">{s.value}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">{s.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.delta}</div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "Reports" && pendingReportsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-red-500 text-white">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Users Tab Content */}
      {tab === "Users" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-bold text-foreground tracking-wide">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-950/20 text-slate-400">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider">User</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider hidden md:table-cell">Skills count</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider hidden md:table-cell">Rating</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 uppercase select-none">
                          {user.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                          {user.verified && (
                            <p className="text-[10px] text-primary font-medium tracking-wide">Verified Exchange Partner</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-slate-400 truncate block max-w-[220px]">{user.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        user.status === "online"
                          ? "bg-green-500/10 text-green-400"
                          : user.status === "banned"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.status === "online"
                            ? "bg-green-400"
                            : user.status === "banned"
                            ? "bg-red-400"
                            : "bg-slate-500"
                        }`} />
                        {user.status === "online" ? "Online" : user.status === "banned" ? "Suspended" : "Offline"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-slate-400 font-semibold">{user.skills.length}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-foreground font-semibold">{user.rating}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveUserMenuId(activeUserMenuId === user.id ? null : user.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-foreground transition-all cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Action Overlay Menu */}
                      {activeUserMenuId === user.id && (
                        <div className="absolute right-5 mt-1 w-44 bg-slate-900 border border-border rounded-lg shadow-xl py-1 z-10 text-left">
                          <button
                            type="button"
                            onClick={() => handleToggleUserVerify(user.id, user.name, user.verified)}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-foreground transition-colors"
                          >
                            {user.verified ? "Revoke Verification" : "Verify User"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleUserBan(user.id, user.name)}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                              user.status === "banned"
                                ? "text-green-400 hover:bg-slate-800"
                                : "text-red-400 hover:bg-red-950/20 hover:text-red-300"
                            }`}
                          >
                            {user.status === "banned" ? "Reactivate Account" : "Suspend Account"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skills Tab Content */}
      {tab === "Skills" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-bold text-foreground tracking-wide">Skills Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-950/20 text-slate-400">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider">Skill</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider hidden md:table-cell">Author</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider">Level</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold tracking-wider hidden md:table-cell">Rating</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="min-w-0">
                        <span className={`text-sm font-semibold truncate block ${skill.deactivated ? "text-slate-500 line-through" : "text-foreground"}`}>
                          {skill.name}
                        </span>
                        {skill.deactivated && (
                          <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider bg-red-400/10 px-1.5 py-0.5 rounded">
                            Deactivated
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/20">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-slate-400 font-semibold">{skill.userName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded border border-border text-xs font-medium text-slate-400 bg-slate-950/20">
                        {skill.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-foreground font-semibold">{skill.rating}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSkillMenuId(activeSkillMenuId === skill.id ? null : skill.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-foreground transition-all cursor-pointer"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Action Overlay Menu */}
                      {activeSkillMenuId === skill.id && (
                        <div className="absolute right-5 mt-1 w-44 bg-slate-900 border border-border rounded-lg shadow-xl py-1 z-10 text-left">
                          <button
                            type="button"
                            onClick={() => handleToggleSkillStatus(skill.id, skill.name, skill.deactivated)}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors ${
                              skill.deactivated
                                ? "text-green-400 hover:bg-slate-800"
                                : "text-red-400 hover:bg-red-950/20 hover:text-red-300"
                            }`}
                          >
                            {skill.deactivated ? "Reactivate Skill" : "Deactivate Skill"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports Tab Content */}
      {tab === "Reports" && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-card border border-border rounded-xl px-5 py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-sm font-bold text-foreground">All reports cleared</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-normal">
                There are no pending moderation reports. Platform is fully verified.
              </p>
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-xl px-5 py-4 shadow-sm hover:border-border/80 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-semibold">
                        {r.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{r.date}</span>
                    </div>
                    <p className="text-sm text-foreground mb-1 font-semibold leading-relaxed">
                      <span>{r.reporter}</span>
                      <span className="text-slate-400 font-normal"> reported </span>
                      <span>{r.reported}</span>
                    </p>
                    <p className="text-sm text-muted-foreground leading-normal">{r.reason}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleResolveReport(r.id, r.reporter, r.reported)}
                      title="Resolve and Close Report"
                      className="p-2 border border-green-500/30 text-green-400 rounded-lg hover:bg-green-500/10 transition-all cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => handleDismissReport(r.id, r.reported)}
                      title="Dismiss Report"
                      className="p-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
