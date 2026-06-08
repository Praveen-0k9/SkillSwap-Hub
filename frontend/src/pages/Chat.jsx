import { API_BASE_URL } from "@/config";
import { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { io } from "socket.io-client";

export function Chat({ user, socket, notifications = [], setNotifications, selectedUserId, setSelectedUserId }) {
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [connections, setConnections] = useState([]);
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [activePartner, setActivePartner] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Mark chat notifications as read helper
  const markChatNotificationsAsRead = async (senderId) => {
    if (!senderId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/read-chat/${senderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.type === "message" && n.senderId === senderId
              ? { ...n, read: true }
              : n
          )
        );
      }
    } catch (err) {
      console.error("Failed to mark chat notifications as read:", err);
    }
  };

  // Fetch all chat rooms
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRooms(data);
      }
    } catch (err) {
      console.error("Failed to load chat rooms:", err);
    }
  };

  // Fetch all connections
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
      }
    } catch (err) {
      console.error("Failed to load connections:", err);
    }
  };

  // Fetch messages for active chat
  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/room/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchRooms();
    fetchConnections();
  }, []);

  // Handle selectedUserId transitions (redirects or clicking on sidebar items)
  useEffect(() => {
    if (!selectedUserId) {
      // If no selected user but we have active chat rooms, default to the first one
      if (rooms.length > 0 && !activeChatId) {
        const firstRoom = rooms[0];
        setActiveChatId(firstRoom.chatId);
        setActivePartner(firstRoom.otherUser);
        setSelectedUserId(firstRoom.otherUser?.id || firstRoom.otherUser?._id);
        fetchMessages(firstRoom.chatId);
      }
      return;
    }

    const existingRoom = rooms.find(
      (r) => (r.otherUser?.id || r.otherUser?._id) === selectedUserId
    );

    if (existingRoom) {
      if (activeChatId !== existingRoom.chatId) {
        setActiveChatId(existingRoom.chatId);
        setActivePartner(existingRoom.otherUser);
        fetchMessages(existingRoom.chatId);
      }
    } else {
      // Create a room if not exists
      const startChat = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/chat/room`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ otherUserId: selectedUserId }),
          });
          const data = await response.json();
          if (response.ok) {
            setActiveChatId(data.chatId);
            setActivePartner(data.otherUser);
            fetchMessages(data.chatId);
            fetchRooms(); // refresh list
          }
        } catch (err) {
          console.error("Failed to start chat with selected user:", err);
        }
      };

      if (rooms.length >= 0) {
        startChat();
      }
    }
  }, [selectedUserId, rooms]);

  // Mark chat messages from the selected user as read
  useEffect(() => {
    if (selectedUserId && notifications.some((n) => n.type === "message" && !n.read && n.senderId === selectedUserId)) {
      markChatNotificationsAsRead(selectedUserId);
    }
  }, [selectedUserId, notifications]);

  // Subscribe to real-time socket events
  useEffect(() => {
    if (!socket || !activeChatId) return;

    socket.emit("joinRoom", activeChatId);

    const handleNewMessage = (msg) => {
      console.log("Received socket message:", msg);
      if (msg.roomId === activeChatId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }

      // Update room list's last message
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.chatId === msg.roomId
            ? { ...room, lastMessage: msg }
            : room
        )
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, activeChatId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !socket || !activeChatId) return;

    socket.emit("sendMessage", {
      roomId: activeChatId,
      content: message.trim(),
    });

    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Generate sidebar item list: active rooms matching search, and connections matching search
  const sidebarItems = rooms.map((room) => ({
    id: room.otherUser?.id || room.otherUser?._id,
    name: room.otherUser?.name || "Unknown User",
    avatar: room.otherUser?.avatar || "",
    online: room.otherUser?.online || false,
    chatId: room.chatId,
    lastMessage: room.lastMessage,
  }));

  const matchingConnections = connections.filter((conn) => {
    const nameMatch = conn.name.toLowerCase().includes(searchQuery.toLowerCase());
    const alreadyInRooms = rooms.some(
      (room) => (room.otherUser?.id || room.otherUser?._id) === conn.id
    );
    return nameMatch && !alreadyInRooms;
  });

  const allSidebarItems = [
    ...sidebarItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    ...matchingConnections.map((conn) => ({
      id: conn.id,
      name: conn.name,
      avatar: conn.avatar,
      online: conn.online,
      chatId: null,
      lastMessage: null,
    })),
  ];

  const handleSelectSidebarItem = async (item) => {
    setSelectedUserId(item.id);
    if (item.chatId) {
      setActiveChatId(item.chatId);
      setActivePartner(rooms.find((r) => r.chatId === item.chatId)?.otherUser);
      fetchMessages(item.chatId);
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ otherUserId: item.id }),
        });
        const data = await response.json();
        if (response.ok) {
          setActiveChatId(data.chatId);
          setActivePartner(data.otherUser);
          fetchMessages(data.chatId);
          fetchRooms();
        }
      } catch (err) {
        console.error("Failed to create chat room from sidebar:", err);
      }
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
          {allSidebarItems.map((item) => {
            const isActive = item.id === selectedUserId;
            const lastMsg = item.lastMessage;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectSidebarItem(item)}
                className={`w-full px-4 py-3.5 flex items-start gap-3 text-left transition-colors border-b border-border/50 hover:bg-muted/60 cursor-pointer ${
                  isActive ? "bg-primary/8 border-l-2 border-l-primary" : ""
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground uppercase select-none">
                    {item.name[0]}
                  </div>
                  {item.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {item.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {lastMsg ? lastMsg.timestamp : ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate leading-relaxed">
                    {lastMsg ? lastMsg.content : "Start a new conversation..."}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070C18]">
        {activePartner ? (
          <>
            {/* Chat header */}
            <div className="h-14 px-5 flex items-center justify-between gap-3 border-b border-border bg-card flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground uppercase select-none">
                    {activePartner.name[0]}
                  </div>
                  {activePartner.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{activePartner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activePartner.online ? "Online" : "Offline"}
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
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id || msg.senderId === user?._id;
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0 uppercase self-end select-none">
                      {isMe ? (user?.name?.[0] || "U") : (msg.senderName?.[0] || activePartner.name[0])}
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
              <div ref={messagesEndRef} />
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
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <Video size={48} className="mb-4 text-muted-foreground/30 animate-pulse" />
            <p className="text-sm font-semibold">Select a connection to start swapping skills!</p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Search for your accepted connections or select one from the sidebar list.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
