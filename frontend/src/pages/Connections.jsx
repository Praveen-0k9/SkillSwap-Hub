import { API_BASE_URL } from "@/config";
import { useState, useEffect } from "react";
import { Search, MessageSquare, UserPlus, UserMinus, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tabs = ["All", "Online", "Suggestions"];

export function Connections({ setSelectedChatUserId }) {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [connections, setConnections] = useState([]);
  const [suggestedList, setSuggestedList] = useState([]);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setConnections(data.connections);
        setSuggestedList(data.suggestions);
      } else {
        console.error("Failed to load connections:", data);
      }
    } catch (err) {
      console.error("Failed to load connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filtered = connections.filter((u) =>
    !query || u.name.toLowerCase().includes(query.toLowerCase())
  );
  const online = filtered.filter((u) => u.online);

  const handleMessageUser = (userId) => {
    if (setSelectedChatUserId) {
      setSelectedChatUserId(userId);
    }
    navigate("/chat");
  };

  const handleConnect = async (user) => {
    try {
      console.log("Sending connection request to", user);
      const response = await fetch(`${API_BASE_URL}/api/connections/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          receiverId: user.id || user._id,
          skillName: user.skills?.[0] || "skills",
          message: "Let's connect and swap skills!",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuggestedList((prev) => prev.filter((s) => s.id !== user.id));
        await fetchConnections();
        alert(data.message || "Collaboration request sent successfully!");
      } else {
        console.error("Connection request error:", data);
        alert(data.message || "Failed to send request.");
      }
    } catch (err) {
      console.error("Failed to send connect request:", err);
      alert("An error occurred while sending the request.");
    }
  };

  const handleDisconnect = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/${user.connectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setConnections((prev) => prev.filter((c) => c.id !== user.id));
      } else {
        const data = await response.json();
        alert(data.message || "Failed to disconnect.");
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Connections</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {connections.length} connection{connections.length !== 1 ? "s" : ""} in your network
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search connections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px cursor-pointer ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {t === "Online" && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500/15 text-green-400 text-[10px] font-bold">
                  {online.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* All / Online */}
      {(tab === "All" || tab === "Online") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {(tab === "All" ? filtered : online).map((user) => (
            <div key={user.id} className="bg-card border border-border rounded-lg p-5 hover:border-border/80 transition-colors">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary uppercase select-none">
                    {user.name[0]}
                  </div>
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{user.name}</span>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-muted-foreground">{user.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                    {user.bio}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {user.skills && user.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="inline-block px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium truncate">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMessageUser(user.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 border border-border rounded-md py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <MessageSquare size={12} />
                      Message
                    </button>
                    <button
                      onClick={() => handleDisconnect(user)}
                      className="p-1.5 border border-border rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/30 transition-colors flex-shrink-0 cursor-pointer"
                    >
                      <UserMinus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(tab === "All" ? filtered : online).length === 0 && (
            <div className="col-span-full bg-card border border-border rounded-lg py-16 text-center">
              <p className="text-sm text-muted-foreground">No connections found in this tab.</p>
            </div>
          )}
        </div>
      )}

      {/* Suggestions */}
      {tab === "Suggestions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {suggestedList.map((user) => (
            <div key={user.id} className="bg-card border border-border rounded-lg p-5 hover:border-border/80 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground flex-shrink-0 uppercase select-none">
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground mb-1">{user.mutual} mutual connections</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">{user.bio}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {user.skills.map((s) => (
                      <span key={s} className="inline-block px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium truncate">{s}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleConnect(user)}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-primary text-white rounded-md py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    <UserPlus size={12} />
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}

          {suggestedList.length === 0 && (
            <div className="col-span-full bg-card border border-border rounded-lg py-16 text-center">
              <p className="text-sm text-muted-foreground">All caught up on suggestions!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
