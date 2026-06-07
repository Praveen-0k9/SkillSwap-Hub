import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { Dashboard } from "./pages/Dashboard";
import { Explore } from "./pages/Explore";
import { Chat } from "./pages/Chat";
import { Notifications } from "./pages/Notifications";
import { Bookmarks } from "./pages/Bookmarks";
import { Connections } from "./pages/Connections";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Admin } from "./pages/Admin";
import { Profile } from "./pages/Profile";
import { mockNotifications, initialChatLogs, mockUsers, mockSkills } from "./data/mockData";

function AppLayout({ children, unreadNotifications, unreadMessages, user, onLogout }) {
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
          user={user}
          onLogout={onLogout}
        />
        <div className="flex-1 flex flex-col min-h-screen">
          {!isChat && <Navbar onMenuClick={() => setSidebarOpen(true)} user={user} />}
          <main className={`flex-1 ${isChat ? "p-0 lg:ml-60 h-screen" : "p-4 lg:p-6 lg:ml-60"}`}>
            <div className={isChat ? "h-full w-full" : "max-w-7xl mx-auto"}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [conversations, setConversations] = useState(initialChatLogs);
  const [selectedChatUserId, setSelectedChatUserId] = useState(mockUsers[0].id);
  const [skills, setSkills] = useState(mockSkills);
  const [socket, setSocket] = useState(null);

  // Manage global socket connection and notifications
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("newNotification", (notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === notification.id)) return prev;
        return [notification, ...prev];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Fetch explore skills from database on app load
  useEffect(() => {
    const fetchGlobalSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/skills");
        const data = await response.json();
        if (response.ok && data.skills && data.skills.length > 0) {
          setSkills(data.skills);
        }
      } catch (err) {
        console.error("Failed to load skills from DB:", err);
      }
    };
    fetchGlobalSkills();
  }, []);

  // Verify stored JWT session token on load
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoadingAuth(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          // Token expired or invalid
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuthToken();
  }, []);

  // Sync notifications with database
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const unreadNotifications = notifications.filter((n) => n.type !== "message" && !n.read).length;
  const unreadMessages = notifications.filter((n) => n.type === "message" && !n.read).length;

  // Display a premium loading loader while verifying active sessions
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#070C18] flex items-center justify-center flex-col gap-4 text-foreground">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-muted-foreground animate-pulse">
          Authenticating session...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Redirect to dashboard if already logged in */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Welcome />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/reset-password" element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />} />

        {/* Protected Dashboard/Platform Routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Dashboard user={user} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/explore"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Explore skills={skills} setSkills={setSkills} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/chat"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Chat
                  user={user}
                  socket={socket}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  selectedUserId={selectedChatUserId}
                  setSelectedUserId={setSelectedChatUserId}
                />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Notifications
                  notifications={notifications}
                  setNotifications={setNotifications}
                  setSelectedChatUserId={setSelectedChatUserId}
                />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/bookmarks"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Bookmarks skills={skills} setSkills={setSkills} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/connections"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Connections setSelectedChatUserId={setSelectedChatUserId} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/analytics"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Analytics user={user} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Settings user={user} setUser={setUser} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Admin />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <AppLayout
                unreadNotifications={unreadNotifications}
                unreadMessages={unreadMessages}
                user={user}
                onLogout={handleLogout}
              >
                <Profile user={user} />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
