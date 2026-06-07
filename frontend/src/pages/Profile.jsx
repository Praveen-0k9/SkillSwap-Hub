import { useState, useEffect } from "react";
import { Star, Mail, Calendar, Edit, BookOpen, Users, Award, MessageSquare, CheckCircle, X, CheckCircle2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { skillCategories } from "../data/mockData";

const tabs = ["Skills", "Reviews", "Activity"];

const getIconComponent = (iconName) => {
  const map = { Star, Mail, Calendar, Edit, BookOpen, Users, Award, MessageSquare, CheckCircle, X, CheckCircle2, Trash2 };
  return map[iconName] || BookOpen;
};

const initialReviews = [
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

const initialActivityLog = [
  { icon: BookOpen, text: "Started teaching Advanced React Patterns", time: "2 hours ago", color: "text-primary bg-primary/10" },
  { icon: Users, text: "Connected with Sarah Chen", time: "1 day ago", color: "text-green-400 bg-green-400/10" },
  { icon: Award, text: "Received 5-star review for TypeScript skill", time: "2 days ago", color: "text-yellow-400 bg-yellow-400/10" },
  { icon: MessageSquare, text: "Completed collaboration with Marcus Thompson", time: "3 days ago", color: "text-blue-400 bg-blue-400/10" },
];

const initialSkills = [
  { name: "React", category: "Web Dev", rating: 4.8, learners: 15 },
  { name: "Node.js", category: "Design", rating: 4.8, learners: 15 },
  { name: "TypeScript", category: "Web Dev", rating: 4.8, learners: 15 },
  { name: "Python", category: "Design", rating: 4.8, learners: 15 },
  { name: "UI/UX Design", category: "Design", rating: 4.8, learners: 15 },
];

export function Profile({ user }) {
  const [tab, setTab] = useState("Skills");
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Stateful forms for adding a skill
  const [isAdding, setIsAdding] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState(skillCategories[0] || "Web Development");

  // Editing skill states
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [editSkillName, setEditSkillName] = useState("");
  const [editSkillCategory, setEditSkillCategory] = useState("");
  const [editSkillLevel, setEditSkillLevel] = useState("Intermediate");
  const [editSkillDescription, setEditSkillDescription] = useState("");
  
  // Feedback Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const startEditing = (skill) => {
    setEditingSkillId(skill._id);
    setEditSkillName(skill.name);
    setEditSkillCategory(skill.category);
    setEditSkillLevel(skill.level || "Intermediate");
    setEditSkillDescription(skill.description || "");
  };

  const fetchUserSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/skills?userId=${user.id || user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSkills(data.skills);
      }
    } catch (err) {
      console.error("Failed to fetch user skills:", err);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews?userId=${user.id || user._id}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error("Failed to fetch user reviews:", err);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/activities?userId=${user.id || user._id}`);
      const data = await response.json();
      if (response.ok) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.error("Failed to fetch user activities:", err);
    }
  };

  const handleUpdateSkill = async (e, id) => {
    e.preventDefault();
    if (!editSkillName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editSkillName.trim(),
          category: editSkillCategory,
          level: editSkillLevel,
          description: editSkillDescription.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSkills(prev => prev.map(s => s._id === id ? data.skill : s));
        showToast(`Skill "${editSkillName.trim()}" updated successfully!`);
        setEditingSkillId(null);
        fetchUserActivities();
      } else {
        showToast(data.message || "Failed to update skill");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.");
    }
  };

  const handleDeleteSkill = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the skill "${name}"?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSkills(prev => prev.filter(s => s._id !== id));
        showToast(`Skill "${name}" deleted successfully.`);
        fetchUserActivities();
      } else {
        showToast(data.message || "Failed to delete skill");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserSkills();
      fetchUserReviews();
      fetchUserActivities();
    }
  }, [user]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newSkillName.trim(),
          category: newSkillCategory,
          description: `Learn ${newSkillName.trim()} with me!`,
          level: "Intermediate",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSkills(prev => [data.skill, ...prev]);
        showToast(`Skill "${newSkillName.trim()}" added to your profile!`);
        // Reset form
        setNewSkillName("");
        setNewSkillCategory(skillCategories[0] || "Web Development");
        setIsAdding(false);
        fetchUserActivities();
      } else {
        showToast(data.message || "Failed to add skill");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-5">
      {/* Dynamic Toast Feedback */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-success/30 text-success-foreground px-4 py-3 rounded-lg shadow-xl animate-slide-in">
          <CheckCircle2 size={18} className="text-success" />
          <span className="text-sm font-medium text-slate-200">{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="p-0.5 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Avatar Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 mx-auto sm:mx-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-3xl font-bold text-primary select-none">
                  {user.name ? user.name[0] : "A"}
                </div>
              )}
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-foreground truncate">{user.name}</h2>
                  {user.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold tracking-wide flex-shrink-0">
                      <CheckCircle size={10} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail size={12} />
                    <span className="truncate">{user.email}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                  </span>
                </div>
              </div>

              <Link
                to="/settings"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-slate-600 text-sm font-semibold px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-all flex-shrink-0 self-center sm:self-start cursor-pointer"
              >
                <Edit size={14} />
                Edit profile
              </Link>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-4">{user.bio}</p>

            {/* Stats row */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-5 pt-3 border-t border-border/60">
              {[
                { label: "Rating", value: String(user.rating), icon: <Star size={14} className="text-yellow-400 fill-yellow-400" /> },
                { label: "Reviews", value: String(user.reviewCount), icon: null },
                { label: "Skills", value: String(skills.length), icon: null },
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
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {tab === "Skills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400 font-medium">{skills.length} skills listed</p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isAdding ? "Cancel" : "+ Add skill"}
            </button>
          </div>

          {/* Slide down form for adding a skill */}
          {isAdding && (
            <form onSubmit={handleAddSkill} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 animate-slide-in shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-foreground">Add New Skill</h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-foreground hover:bg-slate-800 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js, Figma, Rust"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="bg-slate-950/40 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="bg-slate-900 border border-border rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                  >
                    {skillCategories.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-slate-200">{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="self-end px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-all hover:shadow-lg shadow-primary/20 cursor-pointer"
              >
                Save Skill
              </button>
            </form>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((skill, i) => (
              editingSkillId === skill._id ? (
                <form
                  key={skill._id || i}
                  onSubmit={(e) => handleUpdateSkill(e, skill._id)}
                  className="bg-card border border-primary/30 rounded-xl p-4 shadow-sm flex flex-col gap-3 transition-all"
                >
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span className="text-xs font-bold text-primary">Edit Skill</span>
                    <button
                      type="button"
                      onClick={() => setEditingSkillId(null)}
                      className="p-1 rounded-md text-slate-400 hover:text-foreground hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skill Name</label>
                    <input
                      type="text"
                      required
                      value={editSkillName}
                      onChange={(e) => setEditSkillName(e.target.value)}
                      className="bg-slate-950/40 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                      <select
                        value={editSkillCategory}
                        onChange={(e) => setEditSkillCategory(e.target.value)}
                        className="bg-slate-900 border border-border rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                      >
                        {skillCategories.map((c) => (
                          <option key={c} value={c} className="bg-slate-900 text-slate-200">{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level</label>
                      <select
                        value={editSkillLevel}
                        onChange={(e) => setEditSkillLevel(e.target.value)}
                        className="bg-slate-900 border border-border rounded-lg px-2 py-1.5 text-xs text-slate-200 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                      >
                        {["Beginner", "Intermediate", "Advanced", "Expert"].map((l) => (
                          <option key={l} value={l} className="bg-slate-900 text-slate-200">{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea
                      value={editSkillDescription}
                      onChange={(e) => setEditSkillDescription(e.target.value)}
                      rows={2}
                      className="bg-slate-950/40 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill._id, skill.name)}
                      className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSkillId(null)}
                        className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div key={skill._id || i} className="bg-card border border-border rounded-xl p-4 shadow-sm hover:border-border/80 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex gap-1.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold border border-primary/20 truncate">
                          {skill.category}
                        </span>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-border truncate">
                          {skill.level || "Intermediate"}
                        </span>
                      </div>
                      <button
                        onClick={() => startEditing(skill)}
                        className="flex-shrink-0 p-1 rounded-lg text-slate-500 hover:text-foreground hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Edit size={12} />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-foreground truncate">{skill.name}</h4>
                    {skill.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {skill.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3 pt-2 border-t border-border/40">
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      {skill.rating || "5.0"}
                    </span>
                    <span>·</span>
                    <span>{skill.learners || 0} learners</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {tab === "Reviews" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              No reviews yet.
            </div>
          ) : (
            reviews.map((r, i) => {
              const initials = r.reviewerName ? r.reviewerName.split(" ").map(n => n[0]).join("") : "U";
              const formattedDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "just now";
              return (
                <div key={r._id || i} className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    {r.reviewerAvatar ? (
                      <img
                        src={r.reviewerAvatar}
                        alt={r.reviewerName}
                        className="w-9 h-9 rounded-full object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-800 border border-border flex items-center justify-center text-xs font-bold text-slate-300 flex-shrink-0 select-none uppercase">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <div>
                          <span className="text-sm font-semibold text-foreground">{r.reviewerName}</span>
                          <span className="text-xs text-muted-foreground ml-2 font-medium bg-slate-950/40 px-2 py-0.5 rounded border border-border/40">{r.skillName}</span>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{r.comment}</p>
                      <p className="text-[10px] text-muted-foreground mt-2 font-medium">{formattedDate}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {tab === "Activity" && (
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
              No recent activity.
            </div>
          ) : (
            activities.map((item, i) => {
              const Icon = getIconComponent(item.icon);
              const formattedTime = item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "just now";
              return (
                <div key={item._id || i} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm hover:border-border/80 transition-all">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color || "text-primary bg-primary/10"}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">{formattedTime}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
