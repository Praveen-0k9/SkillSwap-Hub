import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Lock, Sparkles, AlertCircle, CheckCircle2, X } from "lucide-react";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback alerts
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "error") => {
    setAlert({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showAlert("Invalid session token. Reset link is invalid or expired.", "error");
      return;
    }
    if (password.length < 6) {
      showAlert("Password must be at least 6 characters long.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Password confirmation does not match.", "error");
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (response.ok) {
        showAlert("Password reset completed successfully! Redirecting to login...", "success");
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else {
        showAlert(data.message || "Failed to reset password. Link may be expired.", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      showAlert("Network error. Make sure backend service is running.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">Enter a secure new password for your account</p>
        </div>

        <GlassCard className="p-8">
          {alert && (
            <div
              className={`flex items-start gap-2.5 p-3 rounded-lg text-xs font-semibold mb-5 border ${
                alert.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-400"
              }`}
            >
              {alert.type === "success" ? (
                <CheckCircle2 size={14} className="mt-0.5" />
              ) : (
                <AlertCircle size={14} className="mt-0.5" />
              )}
              <span className="flex-1 leading-normal">{alert.message}</span>
            </div>
          )}

          {!token ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-400">
                Reset token is missing from the link. Make sure you copy the exact URL from the backend console.
              </p>
              <Link
                to="/login"
                className="inline-block w-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold py-2.5 rounded-lg transition-all"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    disabled={isSubmitting}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-input-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    disabled={isSubmitting}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 bg-input-background border-border"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
