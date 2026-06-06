import { useState } from "react";
import { BookOpen, Users, Star, TrendingUp, Clock, MessageSquare, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { currentUser, mockUsers, mockSkills } from "../data/mockData";

const stats = [
  { label: "Skills Listed", value: "8", delta: "+2 this month", icon: BookOpen, color: "text-primary" },
  { label: "Connections", value: "248", delta: "+12 this week", icon: Users, color: "text-green-400" },
  { label: "Collaborations", value: "31", delta: "4 active now", icon: TrendingUp, color: "text-yellow-400" },
  { label: "Avg Rating", value: "4.8", delta: "from 24 reviews", icon: Star, color: "text-orange-400" },
];

const activity = [
  { user: mockUsers[0], action: "started collaborating on", subject: "Advanced React Patterns", time: "2h ago" },
  { user: mockUsers[1], action: "left a review for", subject: "TypeScript Best Practices", time: "5h ago" },
  { user: mockUsers[2], action: "sent you a connection request", subject: "", time: "1d ago" },
  { user: mockUsers[0], action: "bookmarked your skill", subject: "Node.js API Development", time: "2d ago" },
];

const progress = [
  { skill: "React Advanced", pct: 75 },
  { skill: "TypeScript", pct: 60 },
  { skill: "UI/UX Design", pct: 45 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Good morning, {currentUser.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus size={15} />
          Discover skills
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon size={18} className={stat.color} />
                <span className="text-xs text-muted-foreground truncate ml-2">{stat.delta}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            <Link to="/register" className="text-xs text-primary hover:text-primary/80 transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase">
                  {item.user.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-medium">{item.user.name}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                    {item.subject && (
                      <>
                        {" "}
                        <span className="text-primary font-medium">{item.subject}</span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock size={11} />
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Learning Progress */}
          <div className="bg-card border border-border rounded-lg">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Learning Progress</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              {progress.map((item) => (
                <div key={item.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground">{item.skill}</span>
                    <span className="text-xs text-muted-foreground">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Connections */}
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Active Connections</h3>
              <Link to="/register" className="text-xs text-primary hover:text-primary/80">
                See all
              </Link>
            </div>
            <div className="px-5 py-3 space-y-1">
              {mockUsers.slice(0, 4).map((user) => (
                <div key={user.id} className="flex items-center gap-3 py-2 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                      {user.name[0]}
                    </div>
                    {user.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.skills[0]}</p>
                  </div>
                  <Link
                    to="/register"
                    className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <MessageSquare size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trending skills */}
      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Trending Skills</h3>
          <Link to="/explore" className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80">
            Explore all
            <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {mockSkills.slice(0, 4).map((skill) => (
            <div key={skill.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium truncate max-w-[80%]">
                  {skill.category}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-muted-foreground">{skill.rating}</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1 truncate">{skill.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{skill.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                  {skill.userName[0]}
                </div>
                <span className="text-xs text-muted-foreground truncate">{skill.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
