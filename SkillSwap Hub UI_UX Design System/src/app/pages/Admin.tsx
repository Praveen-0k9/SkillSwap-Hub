import { useState } from "react";
import { Users, BookOpen, AlertTriangle, Ban, TrendingUp, MoreVertical, Check, X } from "lucide-react";
import { mockUsers, mockSkills } from "../data/mockData";

const tabs = ["Users", "Skills", "Reports"] as const;
type Tab = typeof tabs[number];

const reports = [
  { id: 1, type: "Inappropriate Content", reporter: "Sarah Chen", reported: "John Doe", reason: "Spam messages in chat", date: "2 hours ago" },
  { id: 2, type: "Fake Skill", reporter: "Marcus Thompson", reported: "Jane Smith", reason: "Skill description does not match content", date: "5 hours ago" },
  { id: 3, type: "Harassment", reporter: "Emily Rodriguez", reported: "Bob Wilson", reason: "Rude behavior during collaboration", date: "1 day ago" },
];

export function Admin() {
  const [tab, setTab] = useState<Tab>("Users");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage users, skills, and platform moderation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "1,247", delta: "+48 this week", icon: Users, color: "text-primary" },
          { label: "Total Skills", value: "3,842", delta: "+120 this week", icon: BookOpen, color: "text-blue-400" },
          { label: "Pending Reports", value: "12", delta: "3 critical", icon: AlertTriangle, color: "text-yellow-400" },
          { label: "Blocked Users", value: "8", delta: "+2 this week", icon: Ban, color: "text-red-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={s.color} />
                <TrendingUp size={14} className="text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.delta}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Users tab */}
      {tab === "Users" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Skills</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Rating</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 uppercase">
                          {user.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                          {user.verified && (
                            <p className="text-xs text-primary">Verified</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-muted-foreground truncate block max-w-[200px]">{user.email}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.online ? "bg-green-400/10 text-green-400" : "bg-muted text-muted-foreground"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.online ? "bg-green-400" : "bg-muted-foreground"}`} />
                        {user.online ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{user.skills.length}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-foreground">{user.rating}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skills tab */}
      {tab === "Skills" && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Skills Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Skill</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Author</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">Level</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground hidden md:table-cell">Rating</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{skill.userName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded border border-border text-xs text-muted-foreground">
                        {skill.level}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-foreground">{skill.rating}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports tab */}
      {tab === "Reports" && (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-lg px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 text-xs font-medium">
                      {r.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">
                    <span className="font-medium">{r.reporter}</span>
                    <span className="text-muted-foreground"> reported </span>
                    <span className="font-medium">{r.reported}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{r.reason}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="p-2 border border-green-500/30 text-green-400 rounded-md hover:bg-green-400/10 transition-colors">
                    <Check size={14} />
                  </button>
                  <button className="p-2 border border-red-500/30 text-red-400 rounded-md hover:bg-red-400/10 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
