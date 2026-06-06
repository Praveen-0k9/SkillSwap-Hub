import { useState } from "react";
import { Star, Mail, Calendar, Edit, BookOpen, Users, Award, MessageSquare, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { currentUser, mockSkills } from "../data/mockData";

const tabs = ["Skills", "Reviews", "Activity"] as const;
type Tab = typeof tabs[number];

const reviews = [
  {
    name: "Sarah Chen",
    initials: "SC",
    rating: 5,
    comment: "Excellent teacher — very patient and knowledgeable about React.",
    skill: "React Advanced Patterns",
    date: "2 days ago",
  },
  {
    name: "Marcus Thompson",
    initials: "MT",
    rating: 5,
    comment: "Great collaboration. Learned a lot about TypeScript in just one session.",
    skill: "TypeScript Best Practices",
    date: "1 week ago",
  },
  {
    name: "Emily Rodriguez",
    initials: "ER",
    rating: 4,
    comment: "Very helpful and responsive. Would definitely collaborate again.",
    skill: "Node.js Development",
    date: "2 weeks ago",
  },
];

const activityLog = [
  { icon: BookOpen, text: "Started teaching Advanced React Patterns", time: "2 hours ago", color: "text-primary bg-primary/10" },
  { icon: Users, text: "Connected with Sarah Chen", time: "1 day ago", color: "text-green-400 bg-green-400/10" },
  { icon: Award, text: "Received 5-star review for TypeScript skill", time: "2 days ago", color: "text-yellow-400 bg-yellow-400/10" },
  { icon: MessageSquare, text: "Completed collaboration with Marcus Thompson", time: "3 days ago", color: "text-blue-400 bg-blue-400/10" },
];

export function Profile() {
  const [tab, setTab] = useState<Tab>("Skills");
  const userSkills = currentUser.skills;

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-2xl font-bold text-primary select-none">
                {currentUser.name[0]}
              </div>
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground truncate">{currentUser.name}</h2>
                  {currentUser.verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium flex-shrink-0">
                      <CheckCircle size={11} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    <span className="truncate">{currentUser.email}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Joined {new Date(currentUser.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              <Link
                to="/settings"
                className="inline-flex items-center gap-2 border border-border text-sm font-medium px-3 py-1.5 rounded-md text-foreground hover:bg-muted transition-colors flex-shrink-0 whitespace-nowrap"
              >
                <Edit size={14} />
                Edit profile
              </Link>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{currentUser.bio}</p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Rating", value: String(currentUser.rating), icon: <Star size={14} className="text-yellow-400" /> },
                { label: "Reviews", value: String(currentUser.reviewCount), icon: null },
                { label: "Skills", value: String(currentUser.skills.length), icon: null },
                { label: "Collaborations", value: "31", icon: null },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 text-sm">
                  {s.icon}
                  <span className="font-bold text-foreground">{s.value}</span>
                  <span className="text-muted-foreground">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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

      {/* Tab content */}
      {tab === "Skills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{userSkills.length} skills listed</p>
            <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              + Add skill
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userSkills.map((skill, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium truncate">
                    {i % 2 === 0 ? "Web Dev" : "Design"}
                  </span>
                  <button className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors">
                    <Edit size={13} />
                  </button>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-2 truncate">{skill}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" />
                    4.8
                  </span>
                  <span>·</span>
                  <span>15 learners</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="space-y-3">
          {reviews.map((r, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                  {r.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div>
                      <span className="text-sm font-semibold text-foreground">{r.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{r.skill}</span>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">{r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Activity" && (
        <div className="space-y-3">
          {activityLog.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-card border border-border rounded-lg px-5 py-4 flex items-center gap-4">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground truncate">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
