import { useState } from "react";
import { Eye, Users, Star, MessageSquare, TrendingUp, TrendingDown, Calendar } from "lucide-react";

const activityData = [
  { day: "Mon", views: 124, x: 40, y: 77 },
  { day: "Tue", views: 156, x: 113.3, y: 53 },
  { day: "Wed", views: 189, x: 186.7, y: 28.25 },
  { day: "Thu", views: 142, x: 260.0, y: 63.5 },
  { day: "Fri", views: 178, x: 333.3, y: 36.5 },
  { day: "Sat", views: 98, x: 406.7, y: 96.5 },
  { day: "Sun", views: 87, x: 480.0, y: 104.75 },
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

export function Analytics() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * 500;

    let closestIdx = 0;
    let minDiff = Infinity;
    activityData.forEach((d, idx) => {
      const diff = Math.abs(d.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });

    if (svgX >= 20 && svgX <= 495) {
      setHoveredIdx(closestIdx);
    } else {
      setHoveredIdx(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIdx(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Analytics</h2>
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
        {/* Weekly Profile Views Line Chart */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col relative select-none">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Profile Views</h3>
          <div className="relative w-full h-52">
            <svg
              viewBox="0 0 500 200"
              width="100%"
              height="100%"
              className="overflow-visible cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <defs>
                <linearGradient id="views-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 50, 100, 150, 200].map((v) => {
                const y = 170 - (v / 200) * 150;
                return (
                  <g key={v}>
                    <line
                      x1="40"
                      y1={y}
                      x2="480"
                      y2={y}
                      stroke="#1A2332"
                      strokeWidth={1}
                      strokeDasharray={v === 0 ? "none" : "3 3"}
                    />
                    <text x="10" y={y + 4} fill="#64748B" fontSize="10" textAnchor="start">
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area Fill */}
              <path
                d="M 40,77 C 76.6,77 76.6,53 113.3,53 C 150,53 150,28.25 186.7,28.25 C 223.4,28.25 223.4,63.5 260,63.5 C 296.7,63.5 296.7,36.5 333.3,36.5 C 370,36.5 370,96.5 406.7,96.5 C 443.4,96.5 443.4,104.75 480,104.75 L 480,170 L 40,170 Z"
                fill="url(#views-gradient)"
              />

              {/* Chart Curved Line */}
              <path
                d="M 40,77 C 76.6,77 76.6,53 113.3,53 C 150,53 150,28.25 186.7,28.25 C 223.4,28.25 223.4,63.5 260,63.5 C 296.7,63.5 296.7,36.5 333.3,36.5 C 370,36.5 370,96.5 406.7,96.5 C 443.4,96.5 443.4,104.75 480,104.75"
                fill="none"
                stroke="#6366F1"
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              {/* X Axis Labels */}
              {activityData.map((d, i) => (
                <text key={i} x={d.x} y="192" fill="#64748B" fontSize="10" textAnchor="middle">
                  {d.day}
                </text>
              ))}

              {/* Hover Interaction Indicators */}
              {activityData.map((d, i) => {
                const isHovered = hoveredIdx === i;
                return (
                  <g key={i}>
                    {/* Hover vertical dash line */}
                    {isHovered && (
                      <line
                        x1={d.x}
                        y1="20"
                        x2={d.x}
                        y2="170"
                        stroke="#6366F1"
                        strokeWidth={1.2}
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Point circle */}
                    <circle
                      cx={d.x}
                      cy={d.y}
                      r={isHovered ? 5 : 3.5}
                      fill={isHovered ? "#6366F1" : "#0D1424"}
                      stroke="#6366F1"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all duration-150 pointer-events-none"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Custom Tooltip Card */}
            {hoveredIdx !== null && (
              <div
                className="absolute z-10 bg-[#0D1424] border border-[#1A2332] rounded-md px-3 py-1.5 text-xs text-slate-200 pointer-events-none shadow-lg transition-all duration-100"
                style={{
                  left: `${(activityData[hoveredIdx].x / 500) * 100}%`,
                  top: `${(activityData[hoveredIdx].y / 200) * 100 - 30}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="font-semibold text-[10px] text-slate-400">{activityData[hoveredIdx].day}</div>
                <div>Views: <span className="font-bold text-primary">{activityData[hoveredIdx].views}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Skill Demand Score Horizontal Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col justify-between select-none">
          <h3 className="text-sm font-semibold text-foreground mb-4">Skill Demand Score</h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            {skillData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-16 text-xs font-semibold text-slate-300 text-right truncate">{item.name}</span>
                <div className="flex-1 h-3.5 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-primary rounded transition-all duration-500 ease-out"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="w-8 text-xs font-bold text-slate-400 text-left">{item.pct}</span>
              </div>
            ))}
          </div>
          {/* Axis indicators */}
          <div className="flex items-center justify-between pl-19 pr-8 pt-3 border-t border-[#1A2332] text-[10px] text-[#64748B]">
            <span>0</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
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
              <div key={i} className="px-5 py-4.5 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.skill}</p>
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
        <div className="bg-card border border-border rounded-lg flex flex-col justify-between">
          <div>
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Milestones</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              {milestones.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="flex items-center gap-3 hover:bg-muted/15 p-1 rounded transition-colors">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${m.color}`}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
