import { API_BASE_URL } from "@/config";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GlassCard } from "../../components/GlassCard";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { User, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Please register with a valid email ending in @gmail.com");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and contain a mix of uppercase, lowercase, numbers, and symbols.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        // Force reload page to trigger auth state check in App.jsx
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Registration failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("Network connection error. Is the backend running?");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold">Join SkillSwap Hub</h1>
          <p className="text-muted-foreground">Start your collaborative learning journey today</p>
        </div>

        <GlassCard className="p-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 mb-5">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span className="leading-normal">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Alex Johnson"
                  value={name}
                  disabled={isSubmitting}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-input-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="alex@gmail.com"
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

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(val) => setTermsAccepted(!!val)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer select-none">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
