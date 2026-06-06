import { Link } from "react-router-dom";
import { Zap, Users, MessageSquare, TrendingUp, Shield, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Find Your Community",
    description: "Connect with students who share your interests and want to grow together.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    description: "Chat, plan, and build projects with your network through instant messaging.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Growth",
    description: "Detailed analytics to see how your skills and network expand over time.",
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "All users are verified students — learn and collaborate with confidence.",
  },
];

const stats = [
  { value: "12,400+", label: "Active Students" },
  { value: "8,200+", label: "Skills Shared" },
  { value: "64,000+", label: "Collaborations" },
  { value: "4.9 / 5", label: "Avg Rating" },
];

export function Welcome() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="text-sm font-bold text-foreground">SkillSwap Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-primary text-white px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex items-center px-6 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Now in open beta — join 12,400+ students
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Share skills.
              <br />
              <span className="text-primary">Build together.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
              SkillSwap Hub connects students who want to learn from each other, collaborate on projects, and grow their network — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                Create free account
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-medium px-6 py-3 rounded-md hover:bg-muted transition-colors text-sm"
              >
                Browse skills
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10">
              {["Free to join", "No credit card", "Students only"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-border px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Everything you need to learn together</h2>
            <p className="text-muted-foreground max-w-xl">
              A complete platform built for students who want to learn, teach, and collaborate with peers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-card border border-border rounded-lg p-5">
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">Ready to start learning together?</h2>
              <p className="text-sm text-muted-foreground">Join thousands of students already on the platform.</p>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-md hover:bg-primary/90 transition-colors text-sm whitespace-nowrap flex-shrink-0"
            >
              Get started free
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Zap size={12} className="text-white" fill="white" />
            </div>
            <span className="text-xs font-bold text-foreground">SkillSwap Hub</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SkillSwap Hub. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
