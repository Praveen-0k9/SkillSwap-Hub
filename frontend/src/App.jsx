import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { Explore } from "./pages/Explore";
import { Chat } from "./pages/Chat";
import { Notifications } from "./pages/Notifications";
import { Bookmarks } from "./pages/Bookmarks";
import { Connections } from "./pages/Connections";
import { Analytics } from "./pages/Analytics";
import { mockNotifications, initialChatLogs, mockUsers, mockSkills } from "./data/mockData";

function AppLayout({ children, unreadNotifications, unreadMessages }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isChat = location.pathname === "/chat";

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <div className="flex">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          unreadNotifications={unreadNotifications}
          unreadMessages={unreadMessages}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          {!isChat && <Navbar onMenuClick={() => setSidebarOpen(true)} />}
          <main className={`flex-1 ${isChat ? "p-0 lg:ml-60 h-screen" : "p-4 lg:p-6 lg:ml-60"}`}>
            <div className={isChat ? "h-full w-full" : "max-w-7xl mx-auto"}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [conversations, setConversations] = useState(initialChatLogs);
  const [selectedChatUserId, setSelectedChatUserId] = useState(mockUsers[0].id);
  const [skills, setSkills] = useState(mockSkills);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = Object.values(conversations).reduce((acc, msgs) => {
    return acc + msgs.filter((m) => m.senderId !== '1' && !m.read).length;
  }, 0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/explore"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Explore skills={skills} setSkills={setSkills} />
            </AppLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Chat
                conversations={conversations}
                setConversations={setConversations}
                setNotifications={setNotifications}
                selectedUserId={selectedChatUserId}
                setSelectedUserId={setSelectedChatUserId}
              />
            </AppLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Notifications
                notifications={notifications}
                setNotifications={setNotifications}
                setSelectedChatUserId={setSelectedChatUserId}
              />
            </AppLayout>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Bookmarks skills={skills} setSkills={setSkills} />
            </AppLayout>
          }
        />
        <Route
          path="/connections"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Connections setSelectedChatUserId={setSelectedChatUserId} />
            </AppLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <AppLayout unreadNotifications={unreadNotifications} unreadMessages={unreadMessages}>
              <Analytics />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
