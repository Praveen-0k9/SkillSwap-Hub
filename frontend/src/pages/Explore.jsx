import { API_BASE_URL } from "@/config";
import { useState, useEffect } from "react";
import { Search, Star, Bookmark, BookmarkCheck, Filter } from "lucide-react";
import { skillCategories } from "../data/mockData";

const levelColors = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-blue-400 bg-blue-400/10",
  Advanced: "text-orange-400 bg-orange-400/10",
  Expert: "text-red-400 bg-red-400/10",
};

export function Explore({ skills, setSkills }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [searchSkills, setSearchSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch filtered skills from backend
  const fetchFilteredSkills = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (category && category !== "all") params.append("category", category);
      
      const response = await fetch(`${API_BASE_URL}/api/skills?${params.toString()}`);
      const data = await response.json();
      if (response.ok && data.skills) {
        setSearchSkills(data.skills);
      }
    } catch (err) {
      console.error("Failed to fetch skills:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search trigger
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchFilteredSkills();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, category]);

  // Toggle bookmark on backend and update states
  const toggleBookmark = async (skillId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/skills/${skillId}/bookmark`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        // Update local search list
        setSearchSkills((prev) =>
          prev.map((s) => (s._id === skillId || s.id === skillId ? { ...s, bookmarked: data.skill.bookmarked } : s))
        );
        // Sync with global skills list (used by Bookmarks page)
        setSkills((prev) =>
          prev.map((s) => (s._id === skillId || s.id === skillId ? { ...s, bookmarked: data.skill.bookmarked } : s))
        );
      }
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Explore Skills</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Discover new skills and connect with learners worldwide
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search skills or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="relative flex-shrink-0">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="appearance-none bg-card border border-border rounded-md pl-9 pr-8 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 transition-colors cursor-pointer w-full sm:w-52"
          >
            <option value="all">All Categories</option>
            {skillCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {isLoading ? "Searching..." : `${searchSkills.length} skill${searchSkills.length !== 1 ? "s" : ""} found`}
      </p>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-card border border-border rounded-lg p-5 flex flex-col h-48 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="w-24 h-5 bg-muted rounded-full" />
                <div className="w-6 h-6 bg-muted rounded" />
              </div>
              <div className="w-3/4 h-6 bg-muted rounded mb-2" />
              <div className="w-full h-12 bg-muted rounded mb-4" />
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted" />
                  <div className="w-16 h-3 bg-muted rounded" />
                </div>
                <div className="w-12 h-3 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : searchSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {searchSkills.map((skill) => {
            const isBookmarked = skill.bookmarked;
            const skillId = skill._id || skill.id;
            return (
              <div key={skillId} className="bg-card border border-border rounded-lg p-5 flex flex-col hover:border-border/80 transition-colors">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium truncate">
                    {skill.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(skillId)}
                    className="flex-shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110 cursor-pointer"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={19} className="text-primary" />
                    ) : (
                      <Bookmark size={19} />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-foreground mb-1.5 line-clamp-1">{skill.name}</h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 mb-4">
                  {skill.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium text-foreground">{skill.rating}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${levelColors[skill.level] ?? ""}`}>
                    {skill.level}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase">
                      {skill.userName ? skill.userName[0] : "?"}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{skill.userName || "Unknown User"}</span>
                  </div>
                  <button className="flex-shrink-0 text-xs font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap cursor-pointer">
                    View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <p className="text-sm text-muted-foreground">No skills found. Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
