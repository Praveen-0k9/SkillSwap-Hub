import { Link } from "react-router-dom";
import { Mail, Lock, Zap } from "lucide-react";

export function Login() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <span className="text-sm font-bold text-foreground">SkillSwap Hub</span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-foreground mb-1">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="alex@university.edu"
                  className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border border-border accent-primary"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Keep me signed in
              </label>
            </div>

            <Link
              to="/dashboard"
              className="block w-full text-center bg-primary text-white font-medium py-2.5 rounded-md hover:bg-primary/90 transition-colors text-sm mt-2"
            >
              Sign in
            </Link>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {"Don't have an account? "}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link to="#" className="underline hover:text-foreground">Terms</Link>
          {" "}and{" "}
          <Link to="#" className="underline hover:text-foreground">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
