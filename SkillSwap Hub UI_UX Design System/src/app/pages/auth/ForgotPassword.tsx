import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Zap } from "lucide-react";

export function ForgotPassword() {
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
            <h1 className="text-xl font-bold text-foreground mb-1">Reset your password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we will send you a link to reset your password.
            </p>
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

            <button
              type="submit"
              className="w-full bg-primary text-white font-medium py-2.5 rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              Send reset link
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
