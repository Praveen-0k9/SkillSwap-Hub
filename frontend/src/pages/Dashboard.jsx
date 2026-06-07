import { useState, useEffect } from "react";
import { BookOpen, Users, Star, TrendingUp, Clock, MessageSquare, ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { mockUsers, mockSkills } from "../data/mockData";

export function Dashboard({ user }) {
  const [skills, setSkills] = useState([]);
  const [connections, setConnections] = useState([]);
  const [activities, setActivities] = useState([]);
  const [globalSkills, setGlobalSkills] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");

        // 1. Fetch user's skills
        const skillsRes = await fetch(`http://localhost:5000/api/skills?userId=${user.id || user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const skillsData = await skillsRes.json();
        
        // 2. Fetch connections
        const connRes = await fetch("http://localhost:5000/api/connections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const connData = await connRes.json();

        // 3. Fetch activities
        const actRes = await fetch(`http://localhost:5000/api/activities?userId=${user.id || user._id}`);
        const actData = await actRes.json();

        // 4. Fetch global trending skills
        const globalRes = await fetch("http://localhost:5000/api/skills");
        const globalData = await globalRes.json();

        // 5. Fetch active chat rooms
        const chatRoomsRes = await fetch("http://localhost:5000/api/chat/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const chatRoomsData = await chatRoomsRes.json();

        if (skillsRes.ok) setSkills(skillsData.skills);
        if (connRes.ok) setConnections(connData.connections);
        if (actRes.ok) setActivities(actData.activities);
        if (globalRes.ok) setGlobalSkills(globalData.skills);
        if (chatRoomsRes.ok) setChatRooms(chatRoomsData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading profile details...</p>
      </div>
    );
  }

  // Dynamic stats calculation
  const skillsThisMonth = skills.filter(s => s.createdAt && new Date(s.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
  const skillsDelta = skillsThisMonth > 0 ? `+${skillsThisMonth} this month` : "No new skills";

  const connectionsThisWeek = connections.filter(c => c.connectedAt && new Date(c.connectedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const connectionsDelta = connectionsThisWeek > 0 ? `+${connectionsThisWeek} this week` : "Stable count";

  const activeChats = chatRooms.filter(room => room.lastMessage).length;
  const chatsDelta = activeChats > 0 ? `${activeChats} active conversation${activeChats > 1 ? 's' : ''}` : "Start a chat";

  const sortedTrendingSkills = [...globalSkills].sort((a, b) => {
    const scoreA = (a.rating || 5.0) * 10 + (a.learners || 0);
    const scoreB = (b.rating || 5.0) * 10 + (b.learners || 0);
    return scoreB - scoreA;
  });

  const computedStats = [
    { label: "Skills Listed", value: String(skills.length), delta: skillsDelta, icon: BookOpen, color: "text-primary" },
    { label: "Connections", value: String(connections.length), delta: connectionsDelta, icon: Users, color: "text-green-400" },
    { label: "Collaborations", value: String(chatRooms.length), delta: chatsDelta, icon: TrendingUp, color: "text-yellow-400" },
    { label: "Avg Rating", value: String(user.rating || 5.0), delta: `from ${user.reviewCount || 0} reviews`, icon: Star, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Good morning, {user.name ? user.name.split(" ")[0] : "User"}
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
        {computedStats.map((stat) => {
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
            <Link to="/profile" className="text-xs text-primary hover:text-primary/80 transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No recent activities. Add your first skill to get started!
              </div>
            ) : (
              activities.slice(0, 5).map((item, i) => {
                const initials = user.name ? user.name[0] : "U";
                const formattedTime = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "just now";
                return (
                  <div key={item._id || i} className="flex items-start gap-3 px-5 py-4">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground leading-snug">
                        <span className="font-semibold text-slate-200">{user.name}</span>{" "}
                        <span className="text-muted-foreground">{item.text}</span>
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock size={11} />
                        <span>{formattedTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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
              {skills.length === 0 ? (
                <div className="text-center text-muted-foreground text-xs py-4">
                  Add skills to track your learning progress.
                </div>
              ) : (
                skills.slice(0, 3).map((item) => {
                  const pctMap = { Beginner: 35, Intermediate: 65, Advanced: 85, Expert: 100 };
                  const pct = pctMap[item.level] || 65;
                  return (
                    <div key={item._id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-foreground">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.level || "Intermediate"} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Connections */}
          <div className="bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Active Connections</h3>
              <Link to="/connections" className="text-xs text-primary hover:text-primary/80">
                See all
              </Link>
            </div>
            <div className="px-5 py-3 space-y-1">
              {connections.length === 0 ? (
                <div className="text-center text-muted-foreground text-xs py-6">
                  No active connections yet. Explore and send requests!
                </div>
              ) : (
                connections.slice(0, 4).map((connUser) => (
                  <div key={connUser.id} className="flex items-center gap-3 py-2 min-w-0">
                    <div className="relative flex-shrink-0">
                      {connUser.avatar ? (
                        <img
                          src={connUser.avatar}
                          alt={connUser.name}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                          {connUser.name[0]}
                        </div>
                      )}
                      {connUser.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{connUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{connUser.skills[0] || "Collaborator"}</p>
                    </div>
                    <Link
                      to="/chat"
                      className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <MessageSquare size={14} />
                    </Link>
                  </div>
                ))
              )}
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
          {(sortedTrendingSkills.length > 0 ? sortedTrendingSkills : mockSkills).slice(0, 4).map((skill) => (
            <div key={skill._id || skill.id} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium truncate max-w-[80%]">
                  {skill.category}
                </span>
                <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-muted-foreground">{skill.rating || "5.0"}</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1 truncate">{skill.name}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{skill.description}</p>
              <div className="flex items-center gap-2 mt-3">
                {skill.userAvatar ? (
                  <img
                    src={skill.userAvatar}
                    alt={skill.userName}
                    className="w-5 h-5 rounded-full object-cover border border-border flex-shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
                    {skill.userName ? skill.userName[0] : "U"}
                  </div>
                )}
                <span className="text-xs text-muted-foreground truncate">{skill.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
