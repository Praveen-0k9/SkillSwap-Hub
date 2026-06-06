import { Eye, Users, Star, MessageSquare, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const activityData = [
  { day: "Mon", views: 124, connections: 3 },
  { day: "Tue", views: 156, connections: 5 },
  { day: "Wed", views: 189, connections: 2 },
  { day: "Thu", views: 142, connections: 7 },
  { day: "Fri", views: 178, connections: 4 },
  { day: "Sat", views: 98, connections: 1 },
  { day: "Sun", views: 87, connections: 2 },
];

const skillData = [
  { name: "React", pct: 92 },
  { name: "TypeScript", pct: 78 },
  { name: "Node.js", pct: 65 },
  { name: "Python", pct: 54 },
  { name: "UI/UX", pct: 48 },
];

const metrics = [
  { label: "Profile Views", value: "2,847", delta: "+12%", up: true, icon: Eye, color: "text-primary" },
  { label: "New Connections", value: "142", delta: "+8%", up: true, icon: Users, color: "text-green-400" },
  { label: "Avg Rating", value: "4.8", delta: "+15%", up: true, icon: Star, color: "text-yellow-400" },
  { label: "Messages Sent", value: "68", delta: "-3%", up: false, icon: MessageSquare, color: "text-blue-400" },
];

const skills = [
  { skill: "React Advanced Patterns", views: 342, rating: 4.9, engagement: 85 },
  { skill: "TypeScript Best Practices", views: 267, rating: 4.6, engagement: 72 },
  { skill: "Node.js Development", views: 198, rating: 4.7, engagement: 68 },
  { skill: "Python for Data Analysis", views: 156, rating: 4.8, engagement: 61 },
];

const milestones = [
  { icon: Star, label: "Top Rated", sub: "Reached 4.8+ rating", color: "text-yellow-400 bg-yellow-400/10" },
  { icon: Users, label: "100 Connections", sub: "Network milestone", color: "text-primary bg-primary/10" },
  { icon: MessageSquare, label: "Active Communicator", sub: "500+ messages sent", color: "text-blue-400 bg-blue-400/10" },
  { icon: Calendar, label: "6 Month Streak", sub: "Consistent activity", color: "text-green-400 bg-green-400/10" },
];

const tooltipStyle = {
  contentStyle: { background: "#0D1424", border: "1px solid #1A2332", borderRadius: 6, fontSize: 12, color: "#E2E8F0" },
  cursor: { fill: "rgba(99,102,241,0.08)" },
};

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Track your performance over the last 30 days</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={m.color} />
                <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${m.up ? "text-green-400" : "text-red-400"}`}>
                  {m.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {m.delta}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity line chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Profile Views</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2332" />
              <XAxis dataKey="day" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#6366F1" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Skill bar chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Skill Demand Score</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={skillData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2332" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={60} tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="pct" fill="#6366F1" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Skills performance */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Skills Performance</h3>
          </div>
          <div className="divide-y divide-border">
            {skills.map((item, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.skill}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye size={11} />{item.views} views</span>
                      <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" />{item.rating}</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 text-sm font-semibold text-foreground">{item.engagement}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.engagement}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Milestones</h3>
          </div>
          <div className="px-5 py-4 space-y-4">
            {milestones.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${m.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
