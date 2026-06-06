import { useState } from "react";
import { Search, Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { mockUsers, mockChatMessages, currentUser } from "../data/mockData";

export function Chat() {
  const [selectedUserId, setSelectedUserId] = useState(mockUsers[0].id);
  const [message, setMessage] = useState("");
  const selectedUser = mockUsers.find((u) => u.id === selectedUserId) ?? mockUsers[0];

  return (
    <div className="h-[calc(100vh-6rem)] flex bg-card border border-border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-border">
        {/* Search */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search conversations..."
              className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {mockUsers.map((user) => {
            const isActive = user.id === selectedUserId;
            return (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full px-4 py-3.5 flex items-start gap-3 text-left transition-colors border-b border-border/50 hover:bg-muted ${
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
                    <span className={`text-sm font-medium truncate ${isActive ? "text-foreground" : "text-foreground"}`}>
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">10:30</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    Hey! I saw your React project...
                  </p>
                </div>

                {user.id === mockUsers[0].id && (
                  <span className="flex-shrink-0 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-xs text-white font-bold">
                    2
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-14 px-5 flex items-center justify-between gap-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground uppercase">
                {selectedUser.name[0]}
              </div>
              {selectedUser.online && (
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-card" />
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
            <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Phone size={16} />
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Video size={16} />
            </button>
            <button className="p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {mockChatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase self-end">
                  {msg.senderName[0]}
                </div>
                <div className={`flex flex-col gap-1 max-w-sm ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground text-center italic">
            {selectedUser.name} is typing...
          </p>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <button className="flex-shrink-0 p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Paperclip size={16} />
            </button>
            <input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setMessage("")}
              className="flex-1 min-w-0 bg-muted border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
            <button
              onClick={() => setMessage("")}
              className="flex-shrink-0 w-9 h-9 bg-primary text-white rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
