import { API_BASE_URL } from "@/config";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Mail, Lock, Sparkles, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Toggles for Forgot Password & 2FA workflows
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  
  const [resetEmail, setResetEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback alerts
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const remembered = localStorage.getItem("rememberedEmail");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const showAlert = (message, type = "error") => {
    setAlert({ message, type });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        if (data.require2FA) {
          setRequire2FA(true);
          setTempUserId(data.tempUserId);
          setAlert({
            message: "We have sent a verification code to your email address.",
            type: "success",
          });
          setIsSubmitting(false);
          return;
        }
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        showAlert(data.message || "Invalid email or password.", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      showAlert("Network connection error. Is the backend running?", "error");
      setIsSubmitting(false);
    }
  };

  const handle2FAVerifySubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempUserId, code: twoFactorCode }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
        window.location.href = "/dashboard";
      } else {
        showAlert(data.message || "Invalid verification code.", "error");
        setIsSubmitting(false);
      }
    } catch (err) {
      showAlert("Network connection error. Is the backend running?", "error");
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await response.json();

      if (response.ok) {
        showAlert(data.message || "Password reset link has been successfully sent to your email inbox.", "success");
        setResetEmail("");
      } else {
        showAlert(data.message || "Failed to submit request.", "error");
      }
    } catch (err) {
      showAlert("Network connection error. Is the backend running?", "error");
    } finally {
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
          <h1 className="mb-2 text-4xl font-bold">
            {isForgotPassword ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isForgotPassword
              ? "Retrieve your password link to continue learning"
              : "Sign in to continue your learning journey"}
          </p>
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

          {isForgotPassword ? (
            /* Forgot Password Form */
            <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="reset-email"
                    type="email"
                    required
                    placeholder="alex@skillswap.com"
                    value={resetEmail}
                    disabled={isSubmitting}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 bg-input-background border-border"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending reset request..." : "Send Reset Link"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setAlert(null);
                }}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-foreground transition-colors w-full mt-2 cursor-pointer bg-transparent border-0"
              >
                <ArrowLeft size={12} />
                Back to login
              </button>
            </form>
          ) : require2FA ? (
            /* 2FA Verification Form */
            <form className="space-y-6" onSubmit={handle2FAVerifySubmit}>
              <div className="space-y-2">
                <Label htmlFor="2fa-code">Verification Code</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="2fa-code"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={twoFactorCode}
                    disabled={isSubmitting}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="pl-10 bg-input-background border-border text-center tracking-widest text-lg font-bold"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  We've sent a 6-digit verification code to your email. For testing, check the backend Node server console log.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequire2FA(false);
                  setTempUserId(null);
                  setTwoFactorCode("");
                  setAlert(null);
                }}
                className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-foreground transition-colors w-full mt-2 cursor-pointer bg-transparent border-0"
              >
                <ArrowLeft size={12} />
                Back to login
              </button>
            </form>
          ) : (
            /* Login Form */
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="alex@skillswap.com"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(val) => setRememberMe(val === true)}
                  />
                  <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setAlert(null);
                  }}
                  className="text-sm text-primary hover:underline bg-transparent border-0 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </form>
          )}
        </GlassCard>

        <p className="text-center text-xs text-muted-foreground mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
