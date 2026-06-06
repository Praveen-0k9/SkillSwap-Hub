import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { Explore } from "./pages/Explore";
import { Profile } from "./pages/Profile";
import { Chat } from "./pages/Chat";
import { Notifications } from "./pages/Notifications";
import { Admin } from "./pages/Admin";
import { Settings } from "./pages/Settings";
import { Bookmarks } from "./pages/Bookmarks";
import { Connections } from "./pages/Connections";
import { Analytics } from "./pages/Analytics";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-5 lg:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/explore" element={<AppLayout><Explore /></AppLayout>} />
        <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
        <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
        <Route path="/bookmarks" element={<AppLayout><Bookmarks /></AppLayout>} />
        <Route path="/connections" element={<AppLayout><Connections /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
