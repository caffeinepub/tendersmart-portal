import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Brain,
  Building,
  CheckCircle2,
  FileSearch,
  Loader2,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const features = [
  {
    icon: Brain,
    title: "AI Relevance Scoring",
    description:
      "Tenders ranked by your industry profile using NLP keyword matching. Get personalized relevance scores for every opportunity.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: AlertTriangle,
    title: "Risk Analyzer",
    description:
      "Automated HIGH / MEDIUM / LOW risk detection. Flags short deadlines, high EMD requirements, and strict penalty clauses.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Bell,
    title: "Urgency Alerts",
    description:
      "Live countdown timers and URGENT badges for closing tenders. Never miss a critical deadline again.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: FileSearch,
    title: "AI Summaries",
    description:
      "Key information extracted automatically — budget, eligibility, requirements. Skip reading full PDFs.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Company Fit Score",
    description:
      "Calculates your eligibility score based on turnover, experience, and category match.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: BarChart3,
    title: "Trend Analytics",
    description:
      "Department activity charts, category breakdowns, and monthly tender growth visualizations.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const stats = [
  { label: "Active Tenders", value: "1,200+" },
  { label: "Departments", value: "80+" },
  { label: "Categories", value: "15+" },
  { label: "Risk Alerts", value: "Real-time" },
];

export function LandingPage() {
  const { login, isLoggingIn, isLoginError, loginError } =
    useInternetIdentity();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden navy-bg">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              India's Smart Tender Discovery Platform
            </div>

            {/* Logo + Title */}
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-navy" />
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight">
                TenderSmart
              </h1>
            </div>

            <p className="text-xl text-white/75 mb-3 font-medium animate-fade-in">
              AI-Powered Government & Private Tender Portal
            </p>
            <p className="text-white/55 text-base leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in">
              Discover, analyze, and track tenders with intelligent risk
              assessment, personalized relevance scoring, and real-time deadline
              alerts.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
              <Button
                size="lg"
                onClick={login}
                disabled={isLoggingIn}
                className="gradient-gold text-navy font-bold hover:opacity-90 transition-opacity shadow-lg px-8 h-12 text-base"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Login / Sign Up
                  </>
                )}
              </Button>
            </div>

            {isLoginError && (
              <p className="mt-3 text-red-300 text-sm">
                {loginError?.message ?? "Login failed. Please try again."}
              </p>
            )}

            <p className="mt-4 text-white/40 text-xs">
              Secured by Internet Identity — no passwords required
            </p>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
            aria-hidden="true"
            role="presentation"
          >
            <path
              d="M0 48H1440V24C1200 0 960 0 720 24C480 48 240 48 0 24V48Z"
              fill="oklch(0.97 0.006 250)"
            />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-card shadow-card border border-border/50"
              >
                <div className="font-display text-2xl font-bold navy-text">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              Everything you need to win tenders
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Beyond simple listing — intelligent analysis, personalized
              scoring, and proactive alerts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-card rounded-xl p-5 border border-border/60 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${f.bg} flex items-center justify-center mb-3`}
                >
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-display font-semibold text-base text-foreground mb-1.5">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 navy-bg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Get started in minutes
          </h2>
          <p className="text-white/60 mb-10">
            No registration forms. No passwords. Secured by blockchain identity.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                step: "01",
                title: "Login Securely",
                desc: "Use Internet Identity — one click, no passwords, fully private.",
              },
              {
                step: "02",
                title: "Set Up Profile",
                desc: "Enter your industry, experience, and company details for personalized scoring.",
              },
              {
                step: "03",
                title: "Discover Tenders",
                desc: "Browse AI-ranked tenders with risk analysis, summaries, and deadline alerts.",
              },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full gradient-gold text-navy font-display font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-white mb-1.5">
                  {s.title}
                </h3>
                <p className="text-white/55 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="mt-10 gradient-gold text-navy font-bold hover:opacity-90 transition-opacity px-8 h-12 text-base"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>Get Started Free</>
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
