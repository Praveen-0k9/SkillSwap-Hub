import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { GlassCard } from "../components/GlassCard";
import {
  Sparkles,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

export function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-success/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">SkillSwap Hub</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hover:bg-primary/10" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </nav>

        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">Welcome to the future of collaborative learning</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Share Skills,
              <br />
              Build Together
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Connect with learners worldwide, share your expertise, and collaborate on projects
              that matter. Your journey to collaborative learning starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-14 px-8"
                asChild
              >
                <Link to="/register">
                  Start Learning Free
                  <Sparkles className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-primary/10 text-lg h-14 px-8"
                asChild
              >
                <Link to="/register">Explore Skills</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { value: "10K+", label: "Active Learners" },
                { value: "5K+", label: "Skills Shared" },
                { value: "50K+", label: "Collaborations" },
                { value: "4.9", label: "Avg Rating" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: "Connect & Collaborate",
                description:
                  "Find like-minded learners and build meaningful connections through shared interests",
                color: "from-primary to-primary/50",
              },
              {
                icon: MessageSquare,
                title: "Real-time Communication",
                description:
                  "Chat instantly with your learning partners and collaborate seamlessly",
                color: "from-secondary to-secondary/50",
              },
              {
                icon: Star,
                title: "Skill Marketplace",
                description:
                  "Discover thousands of skills across various categories and expertise levels",
                color: "from-yellow-500 to-yellow-500/50",
              },
              {
                icon: Shield,
                title: "Verified Profiles",
                description:
                  "Learn with confidence from verified experts in their respective fields",
                color: "from-success to-success/50",
              },
              {
                icon: TrendingUp,
                title: "Track Progress",
                description:
                  "Monitor your learning journey with detailed analytics and insights",
                color: "from-blue-500 to-blue-500/50",
              },
              {
                icon: Zap,
                title: "Fast & Intuitive",
                description:
                  "Modern, responsive interface designed for seamless learning experience",
                color: "from-purple-500 to-purple-500/50",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="p-6" hover>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <GlassCard className="p-12 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
            <Globe className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="mb-4 text-3xl font-bold">Ready to Start Your Learning Journey?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are already collaborating, sharing skills, and building
              amazing projects together.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg h-14 px-8"
              asChild
            >
              <Link to="/register">
                Create Your Free Account
                <Sparkles className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </GlassCard>
        </section>

        <footer className="container mx-auto px-4 py-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">SkillSwap Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 SkillSwap Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link to="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
