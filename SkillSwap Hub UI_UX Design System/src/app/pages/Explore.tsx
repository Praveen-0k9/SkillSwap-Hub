import { useState } from "react";
import { Search, Star, Bookmark, BookmarkCheck, Filter } from "lucide-react";
import { mockSkills, skillCategories } from "../data/mockData";

const levelColors: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-blue-400 bg-blue-400/10",
  Advanced: "text-orange-400 bg-orange-400/10",
  Expert: "text-red-400 bg-red-400/10",
};

export function Explore() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const filtered = mockSkills.filter((s) => {
    const matchCat = category === "all" || s.category === category;
    const matchQ =
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Explore Skills</h2>
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
        {filtered.length} skill{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((skill) => {
            const isBookmarked = bookmarked.has(skill.id) || skill.bookmarked;
            return (
              <div key={skill.id} className="bg-card border border-border rounded-lg p-5 flex flex-col hover:border-border/80 transition-colors">
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium truncate">
                    {skill.category}
                  </span>
                  <button
                    onClick={() => toggleBookmark(skill.id)}
                    className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck size={15} className="text-primary" />
                    ) : (
                      <Bookmark size={15} />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-1">{skill.name}</h3>

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
                <div className="flex items-center justify-between gap-2 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase">
                      {skill.userName[0]}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">{skill.userName}</span>
                  </div>
                  <button className="flex-shrink-0 text-xs font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap">
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
