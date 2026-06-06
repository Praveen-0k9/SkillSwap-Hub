import { useState } from "react";
import { User, Lock, Bell, Shield, Camera } from "lucide-react";
import { currentUser } from "../data/mockData";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
] as const;

type Section = typeof sections[number]["id"];

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? "bg-primary" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? "translate-x-4" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function Field({ label, id, type = "text", defaultValue = "" }: { label: string; id: string; type?: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <input
        id={id}
        type={type}
        defaultValue={defaultValue}
        className="w-full bg-muted border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

export function Settings() {
  const [section, setSection] = useState<Section>("profile");

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h2 className="text-lg font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Sidebar nav */}
        <div className="sm:w-48 flex-shrink-0">
          <nav className="bg-card border border-border rounded-lg p-2 flex sm:flex-col gap-1">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm w-full text-left transition-colors ${
                    section === s.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-card border border-border rounded-lg p-6">
          {section === "profile" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/30 flex items-center justify-center text-xl font-bold text-primary select-none">
                    {currentUser.name[0]}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-card hover:bg-primary/90 transition-colors">
                    <Camera size={11} className="text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Profile photo</p>
                  <p className="text-xs text-muted-foreground">JPG or PNG. Max 2 MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name" id="firstName" defaultValue="Alex" />
                <Field label="Last name" id="lastName" defaultValue="Johnson" />
              </div>
              <Field label="Email address" id="email" type="email" defaultValue={currentUser.email} />
              <div className="space-y-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-foreground">Bio</label>
                <textarea
                  id="bio"
                  rows={3}
                  defaultValue={currentUser.bio}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Save changes
                </button>
              </div>
            </div>
          )}

          {section === "security" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
              <div className="space-y-4 max-w-md">
                <Field label="Current password" id="current" type="password" />
                <Field label="New password" id="new" type="password" />
                <Field label="Confirm new password" id="confirm" type="password" />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between max-w-md">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-foreground">Enable 2FA</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Add extra security to your account</p>
                  </div>
                  <Toggle />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Update security
                </button>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: "Collaboration requests", desc: "When someone sends you a request", on: true },
                  { label: "New messages", desc: "When you receive a direct message", on: true },
                  { label: "Reviews & ratings", desc: "When someone reviews your skills", on: true },
                  { label: "Weekly digest", desc: "A summary of your week's activity", on: false },
                  { label: "Marketing emails", desc: "Product updates and promotions", on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle defaultOn={item.on} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-border">
                <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                  Save preferences
                </button>
              </div>
            </div>
          )}

          {section === "privacy" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Privacy Settings</h3>
              <div className="space-y-4">
                {[
                  { label: "Profile visibility", desc: "Make your profile visible to all users", on: true },
                  { label: "Show online status", desc: "Let others see when you are active", on: true },
                  { label: "Allow direct messages", desc: "Allow users to message you directly", on: true },
                  { label: "Show email address", desc: "Display your email on your public profile", on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle defaultOn={item.on} />
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm font-semibold text-red-400 mb-1">Danger zone</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 border border-red-500/30 text-red-400 rounded-md text-sm font-medium hover:bg-red-400/10 transition-colors">
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
