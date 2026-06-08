import { API_BASE_URL } from "@/config";
import { useState, useEffect, useRef } from "react";
import { User, Lock, Bell, Shield, Camera, CheckCircle2, AlertCircle, X } from "lucide-react";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
];

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out flex-shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed ${
        checked
          ? "bg-primary shadow-[0_0_12px_rgba(99,102,241,0.5)] border border-primary"
          : "bg-slate-800 border border-slate-700 hover:border-slate-600"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Field({ label, id, type = "text", value, onChange, placeholder, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-300 tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950/40 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

export function Settings({ user, setUser }) {
  const [section, setSection] = useState("profile");

  // State values for forms
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const fileInputRef = useRef(null);

  // Sync inputs with user prop on mount or update
  useEffect(() => {
    if (user) {
      const parts = user.name ? user.name.split(" ") : [];
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || "");
      
      // Sync security
      setEnable2FA(user.twoFactorEnabled || false);
      
      // Sync notifications
      if (user.notifications) {
        setNotifications({
          collabRequests: user.notifications.collabRequests ?? true,
          newMessages: user.notifications.newMessages ?? true,
          reviews: user.notifications.reviews ?? true,
          weeklyDigest: user.notifications.weeklyDigest ?? false,
          marketing: user.notifications.marketing ?? false,
        });
      }
      
      // Sync privacy
      if (user.privacy) {
        setPrivacy({
          profileVisibility: user.privacy.profileVisibility ?? true,
          showOnlineStatus: user.privacy.showOnlineStatus ?? true,
          allowDMs: user.privacy.allowDMs ?? true,
          showEmail: user.privacy.showEmail ?? false,
        });
      }
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("File is too large. Max size is 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Security tab states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [enable2FA, setEnable2FA] = useState(false);

  // Notifications toggles
  const [notifications, setNotifications] = useState({
    collabRequests: true,
    newMessages: true,
    reviews: true,
    weeklyDigest: false,
    marketing: false,
  });

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    showOnlineStatus: true,
    allowDMs: true,
    showEmail: false,
  });

  // Saving states to manage non-clickable submit operations
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (isSavingProfile) return;

    setIsSavingProfile(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email: email.trim(),
          bio: bio.trim(),
          avatar: avatarPreview,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        showToast("Profile settings saved successfully!");
      } else {
        showToast(data.message || "Failed to save profile settings", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    if (user) {
      const parts = user.name ? user.name.split(" ") : [];
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatarPreview(user.avatar || "");
    }
  };

  const handleSecuritySave = async (e) => {
    e.preventDefault();
    if (isSavingSecurity) return;

    if (newPassword && !currentPassword) {
      showToast("Please enter your current password to proceed with password change.", "error");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showToast("New password confirmation does not match.", "error");
      return;
    }

    setIsSavingSecurity(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/auth/settings/security`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          enable2FA,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        showToast(data.message || "Security settings updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.message || "Failed to update security settings", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSavingSecurity(false);
    }
  };

  const handleNotificationsSave = async (e) => {
    e.preventDefault();
    if (isSavingNotifications) return;

    setIsSavingNotifications(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/auth/settings/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notifications,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        showToast(data.message || "Notification preferences updated successfully!");
      } else {
        showToast(data.message || "Failed to save notifications settings", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handlePrivacySave = async (e) => {
    e.preventDefault();
    if (isSavingPrivacy) return;

    setIsSavingPrivacy(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/auth/settings/privacy`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          privacy,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        showToast(data.message || "Privacy settings updated successfully!");
      } else {
        showToast(data.message || "Failed to save privacy settings", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    } finally {
      setIsSavingPrivacy(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem("token");
        setUser(null);
        showToast("Account deleted successfully.");
        window.location.href = "/";
      } else {
        showToast(data.message || "Failed to delete account.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error. Please try again.", "error");
    }
  };

  const globalSaving = isSavingProfile || isSavingSecurity || isSavingNotifications || isSavingPrivacy;

  return (
    <div className="relative max-w-4xl space-y-6">
      {/* Toast Alert Banner */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl transition-all duration-300 animate-slide-in ${
            toast.type === "success"
              ? "bg-slate-900 border-success/30 text-success-foreground"
              : "bg-slate-900 border-destructive/30 text-destructive-foreground"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={18} className="text-success" />
          ) : (
            <AlertCircle size={18} className="text-destructive" />
          )}
          <span className="text-sm font-medium text-slate-200">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-0.5 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="bg-card border border-border rounded-xl p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  disabled={globalSaving}
                  onClick={() => setSection(s.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm w-full text-left transition-all duration-200 flex-shrink-0 md:flex-shrink disabled:opacity-50 disabled:cursor-not-allowed ${
                    section === s.id
                      ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-inner"
                      : "text-muted-foreground border border-transparent hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Panel */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl p-6 shadow-sm">
          {section === "profile" && (
            <form onSubmit={handleProfileSave} className="space-y-6">
              <h3 className="text-base font-semibold text-foreground tracking-wide">Profile Information</h3>

              {/* Avatar Photo */}
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile Preview"
                      className="w-18 h-18 rounded-full object-cover border border-primary/30"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-2xl font-bold text-primary select-none">
                      {firstName ? firstName[0] : "A"}
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={isSavingProfile}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-card hover:bg-primary/90 transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera size={12} className="text-white" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile photo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">JPG or PNG. Max 2 MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="First name" id="firstName" value={firstName} onChange={setFirstName} disabled={isSavingProfile} />
                <Field label="Last name" id="lastName" value={lastName} onChange={setLastName} disabled={isSavingProfile} />
              </div>

              <Field label="Email address" id="email" type="email" value={email} onChange={setEmail} disabled={isSavingProfile} />

              <div className="flex flex-col gap-2">
                <label htmlFor="bio" className="text-sm font-semibold text-slate-300 tracking-wide">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  value={bio}
                  disabled={isSavingProfile}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-950/40 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  disabled={isSavingProfile}
                  onClick={handleCancelProfile}
                  className="px-4 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingProfile ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}

          {section === "security" && (
            <form onSubmit={handleSecuritySave} className="space-y-6">
              <h3 className="text-base font-semibold text-foreground tracking-wide">Change Password</h3>
              
              {/* Spaced vertical layout with clear margins */}
              <div className="space-y-5 max-w-md">
                <Field
                  label="Current password"
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="••••••••"
                  disabled={isSavingSecurity}
                />
                <Field
                  label="New password"
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="••••••••"
                  disabled={isSavingSecurity}
                />
                <Field
                  label="Confirm new password"
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="••••••••"
                  disabled={isSavingSecurity}
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between max-w-md bg-slate-950/30 p-4 rounded-xl border border-border">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-semibold text-foreground">Enable 2FA</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-normal">
                      Add extra security to your account
                    </p>
                  </div>
                  <Toggle checked={enable2FA} onChange={setEnable2FA} disabled={isSavingSecurity} />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingSecurity ? "Updating..." : "Update security"}
                </button>
              </div>
            </form>
          )}

          {section === "notifications" && (
            <form onSubmit={handleNotificationsSave} className="space-y-6">
              <h3 className="text-base font-semibold text-foreground tracking-wide">Email Notifications</h3>
              <div className="divide-y divide-border border-y border-border">
                {[
                  { key: "collabRequests", label: "Collaboration requests", desc: "When someone sends you a request" },
                  { key: "newMessages", label: "New messages", desc: "When you receive a direct message" },
                  { key: "reviews", label: "Reviews & ratings", desc: "When someone reviews your skills" },
                  { key: "weeklyDigest", label: "Weekly digest", desc: "A summary of your week's activity" },
                  { key: "marketing", label: "Marketing emails", desc: "Product updates and promotions" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-normal">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[item.key]}
                      disabled={isSavingNotifications}
                      onChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSavingNotifications}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingNotifications ? "Saving..." : "Save preferences"}
                </button>
              </div>
            </form>
          )}

          {section === "privacy" && (
            <form onSubmit={handlePrivacySave} className="space-y-6">
              <h3 className="text-base font-semibold text-foreground tracking-wide">Privacy Settings</h3>
              <div className="divide-y divide-border border-y border-border">
                {[
                  { key: "profileVisibility", label: "Profile visibility", desc: "Make your profile visible to all users" },
                  { key: "showOnlineStatus", label: "Show online status", desc: "Let others see when you are active" },
                  { key: "allowDMs", label: "Allow direct messages", desc: "Allow users to message you directly" },
                  { key: "showEmail", label: "Show email address", desc: "Display your email on your public profile" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-4 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-normal">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={privacy[item.key]}
                      disabled={isSavingPrivacy}
                      onChange={(val) => setPrivacy({ ...privacy, [item.key]: val })}
                    />
                  </div>
                ))}
              </div>

              <div className="border border-red-500/20 bg-red-500/5 p-5 rounded-xl space-y-4">
                <div>
                  <p className="text-sm font-bold text-red-400">Danger zone</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-normal">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isSavingPrivacy}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-white rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete account
                </button>
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button
                  type="submit"
                  disabled={isSavingPrivacy}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-200 hover:shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingPrivacy ? "Saving..." : "Save settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
