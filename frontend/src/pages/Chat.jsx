import { useState, useEffect } from "react";
import { Search, Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { mockUsers, currentUser } from "../data/mockData";

export function Chat({ conversations, setConversations, setNotifications, selectedUserId, setSelectedUserId }) {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedUser = mockUsers.find((u) => u.id === selectedUserId) ?? mockUsers[0];
  const activeMessages = conversations[selectedUserId] || [];

  useEffect(() => {
    // 1. Mark messages as read in conversation logs
    setConversations((prev) => {
      const msgs = prev[selectedUserId] || [];
      if (!msgs.some((m) => m.senderId !== currentUser.id && !m.read)) return prev;
      return {
        ...prev,
        [selectedUserId]: msgs.map((m) =>
          m.senderId !== currentUser.id ? { ...m, read: true } : m
        ),
      };
    });

    // 2. Also mark corresponding message notification as read
    const activeUser = mockUsers.find((u) => u.id === selectedUserId);
    if (activeUser && setNotifications) {
      setNotifications((prev) => {
        const hasUnreadNotification = prev.some(
          (n) => n.type === "message" && !n.read && n.message.includes(activeUser.name)
        );
        if (!hasUnreadNotification) return prev;
        return prev.map((n) =>
          n.type === "message" && n.message.includes(activeUser.name)
            ? { ...n, read: true }
            : n
        );
      });
    }
  }, [selectedUserId, setConversations, setNotifications]);

  const filteredUsers = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    setConversations((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMsg]
    }));
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex bg-card overflow-hidden">
      {/* Sidebar - Contacts */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-border bg-card">
        {/* Search */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => {
            const isActive = user.id === selectedUserId;
            const messages = conversations[user.id] || [];
            const lastMsg = messages[messages.length - 1];
            const unreadCount = messages.filter((m) => m.senderId !== currentUser.id && !m.read).length;

            return (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full px-4 py-3.5 flex items-start gap-3 text-left transition-colors border-b border-border/50 hover:bg-muted/60 cursor-pointer ${
                  isActive ? "bg-primary/8 border-l-2 border-l-primary" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground uppercase">
                    {user.name[0]}
                  </div>
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {lastMsg ? lastMsg.timestamp : "10:30"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {lastMsg ? lastMsg.content : "Hey! I saw your React project..."}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <span className="flex-shrink-0 w-4.5 h-4.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070C18]">
        {/* Chat header */}
        <div className="h-14 px-5 flex items-center justify-between gap-3 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground uppercase">
                {selectedUser.name[0]}
              </div>
              {selectedUser.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{selectedUser.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedUser.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
              <Phone size={16} />
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
              <Video size={16} />
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase self-end select-none">
                  {isMe ? currentUser.name[0] : msg.senderName[0]}
                </div>
                <div className={`flex flex-col gap-1 max-w-sm ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
          {selectedUser.id === '2' && activeMessages.length <= 3 && (
            <p className="text-xs text-muted-foreground text-center italic py-2">
              Sarah Chen is typing...
            </p>
          )}
        </div>

        {/* Message Input Panel */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-2">
            <button className="flex-shrink-0 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer">
              <Paperclip size={16} />
            </button>
            <input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 bg-muted border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              className="flex-shrink-0 w-9 h-9 bg-primary text-white rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
