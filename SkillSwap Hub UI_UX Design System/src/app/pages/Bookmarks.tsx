import { useState } from "react";
import { Star, Trash2, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { mockSkills } from "../data/mockData";

const levelColors: Record<string, string> = {
  Beginner: "text-green-400 bg-green-400/10",
  Intermediate: "text-blue-400 bg-blue-400/10",
  Advanced: "text-orange-400 bg-orange-400/10",
  Expert: "text-red-400 bg-red-400/10",
};

export function Bookmarks() {
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const visible = mockSkills.filter((s) => s.bookmarked && !removed.has(s.id));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-foreground">Bookmarks</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {visible.length} saved skill{visible.length !== 1 ? "s" : ""}
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="bg-card border border-border rounded-lg py-16 flex flex-col items-center text-center px-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookmarkCheck size={20} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No bookmarks yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Save skills you are interested in and find them here for quick access.
          </p>
          <Link
            to="/explore"
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Browse skills
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((skill) => (
            <div key={skill.id} className="bg-card border border-border rounded-lg p-5 flex flex-col">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium truncate">
                  {skill.category}
                </span>
                <button
                  onClick={() => setRemoved((prev) => new Set([...prev, skill.id]))}
                  className="flex-shrink-0 p-1 rounded text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
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
                <Link
                  to={`/explore`}
                  className="flex-shrink-0 text-xs font-medium text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
                >
                  View skill
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
