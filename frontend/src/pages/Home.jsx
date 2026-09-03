import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  FolderKanban, 
  CheckSquare, 
  FileUp, 
  BrainCircuit, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Users,
  BellRing
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: FolderKanban,
      title: 'Lifecycle Project Monitoring',
      description: 'End-to-end oversight across all partner NGOs and grassroots centers with bi-annual cycle tracking (January & July cycles).',
      accent: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      icon: BrainCircuit,
      title: 'ML Attention Intelligence',
      description: 'Predictive machine learning algorithms analyze milestone deadlines and status in real-time, computing empirical attention scores.',
      accent: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      icon: CheckSquare,
      title: 'Action Item Tracking',
      description: 'Actionable milestone workflows for Frontliners and Partner NGOs with proactive urgency indicators and overdue detection.',
      accent: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      icon: FileUp,
      title: 'Verified Document Submissions',
      description: 'Direct multi-format upload portal for field visit reports, financial utilization certificates, and photographic evidence.',
      accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto pt-6 pb-12">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-8 shadow-glow-blue animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Intelligent Child Welfare Governance</span>
        </div>

        {/* Hero headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Empowering Grassroots Impact with{' '}
          <span className="gradient-text">Predictive Intelligence</span>
        </h1>

        {/* Hero subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          A dedicated monitoring ecosystem for <strong className="text-white font-semibold">CRY (Child Rights and You)</strong> Frontliners and Partner NGOs to track critical milestones, verify compliance documents, and prevent project delays.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-glow-blue transition-all group"
            >
              <span>Go to Monitoring Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-glow-blue transition-all group w-full sm:w-auto justify-center"
              >
                <span>Get Started / Register</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all w-full sm:w-auto justify-center"
              >
                <span>Existing User Login</span>
              </Link>
            </>
          )}
        </div>

        {/* Live system preview bar */}
        <div className="mt-16 p-6 rounded-2xl glass-card max-w-3xl mx-auto border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-300">Live System Status</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Express + ML Model Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl font-bold text-white">5</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Partner NGOs</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl font-bold text-blue-400">100%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time ML Sync</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl font-bold text-emerald-400">2 Cycles</span>
              <p className="text-[11px] text-slate-400 mt-0.5">JAN / JULY Monitoring</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-xl font-bold text-purple-400">Encrypted</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Secure JWT Auth</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Engineered for Ground-Level Accountability
          </h2>
          <p className="text-sm text-slate-400">
            A specialized toolkit tailored for CRY field coordinators and partner organizations working towards child welfare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="glass-card glass-card-hover rounded-2xl p-8 border border-slate-800 relative overflow-hidden"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.accent} border flex items-center justify-center mb-6`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stakeholder Callout */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto border border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to monitor and advance project deliverables?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8">
          Sign up with your organization role to view assigned project tracks, upload deliverables, and receive predictive attention notices.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-glow-blue transition-all"
          >
            Create Your Account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            Sign In Now
          </Link>
        </div>
      </section>
    </div>
  );
};

