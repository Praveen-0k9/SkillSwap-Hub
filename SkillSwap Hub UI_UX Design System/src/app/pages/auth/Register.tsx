import { Link } from "react-router-dom";
import { User, Mail, Lock, Zap } from "lucide-react";

export function Register() {
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
            <h1 className="text-xl font-bold text-foreground mb-1">Create your account</h1>
            <p className="text-sm text-muted-foreground">Join thousands of students sharing skills</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  placeholder="Alex Morgan"
                  className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm" className="text-sm font-medium text-foreground">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="confirm"
                  type="password"
                  placeholder="Repeat your password"
                  className="w-full bg-muted border border-border rounded-md pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                className="w-4 h-4 rounded border border-border accent-primary mt-0.5"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                I agree to the{" "}
                <Link to="#" className="text-primary hover:text-primary/80">Terms of Service</Link>
                {" "}and{" "}
                <Link to="#" className="text-primary hover:text-primary/80">Privacy Policy</Link>
              </label>
            </div>

            <Link
              to="/dashboard"
              className="block w-full text-center bg-primary text-white font-medium py-2.5 rounded-md hover:bg-primary/90 transition-colors text-sm mt-2"
            >
              Create account
            </Link>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
