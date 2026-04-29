import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Users, 
  Video, 
  BarChart3, 
  ClipboardList, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Task Intelligence",
      description: "Organize your academic life with AI-ready task boards and smart prioritization.",
      icon: <Layout size={24} />,
      color: "primary"
    },
    {
      title: "Smart Assignments",
      description: "Teachers deploy, students conquer. A seamless bridge for academic excellence.",
      icon: <ClipboardList size={24} />,
      color: "secondary"
    },
    {
      title: "Live Virtual Hub",
      description: "One-click access to immersive live classes and collaborative study sessions.",
      icon: <Video size={24} />,
      color: "primary"
    },
    {
      title: "Data Analytics",
      description: "Visualize your growth with futuristic charts and deep productivity insights.",
      icon: <BarChart3 size={24} />,
      color: "secondary"
    },
    {
      title: "Secure Auth",
      description: "Next-gen security for your academic data with role-based precision.",
      icon: <ShieldCheck size={24} />,
      color: "primary"
    },
    {
      title: "Real-time Sync",
      description: "Always stay updated with instantaneous tracking and notification systems.",
      icon: <Sparkles size={24} />,
      color: "secondary"
    }
  ];

  return (
    <div className="home-page">
      {/* 🚀 FUTURISTIC HERO */}
      <section className="hero-section">
        <div className="home-container">
          <div className="hero-content">
            <NeonBadge className="mb-4">✨ v2.0 • AI-Powered Productivity</NeonBadge>
            <h1 className="hero-title animate-in">
              The Future of <GradientText>Academic Excellence</GradientText>
            </h1>
            <p className="hero-description animate-in" style={{ animationDelay: '0.2s' }}>
              FocusFlow is a high-end productivity engine for modern students and educators. 
              Experience a unified workspace where tasks, assignments, and live classes converge into a single, futuristic flow.
            </p>
            <div className="hero-btns animate-in" style={{ animationDelay: '0.4s' }}>
              <GlowButton onClick={() => navigate('/login')}>
                🚀 Launch App <ArrowRight size={20} />
              </GlowButton>
              <button className="btn-secondary-outline" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                Explore Core Features
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🧊 GLASS FEATURES */}
      <section id="features" className="features-section">
        <div className="home-container">
          <div className="section-header">
            <h2 className="section-title">Engineered for <GradientText>Performance</GradientText></h2>
            <p className="section-subtitle">
              Built on a foundation of speed and simplicity, our tools empower you to achieve more.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <GlassCard key={index} className="feature-card animate-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <div className="feature-icon" style={{ color: feature.color === 'primary' ? 'var(--primary)' : 'var(--secondary)' }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* 👨‍💻 ROLES GRID */}
      <section className="roles-section">
        <div className="home-container">
          <div className="roles-grid">
            <GlassCard className="role-card">
              <div className="role-header">
                <span className="role-emoji">🎓</span>
                <GradientText>For Students</GradientText>
              </div>
              <ul className="role-list">
                <li>Automated assignment tracking</li>
                <li>Immersive productivity dashboard</li>
                <li>One-tap class attendance</li>
                <li>Visual achievement milestones</li>
              </ul>
            </GlassCard>
            <GlassCard className="role-card">
              <div className="role-header">
                <span className="role-emoji">🧑‍🏫</span>
                <GradientText>For Teachers</GradientText>
              </div>
              <ul className="role-list">
                <li>Rapid assignment distribution</li>
                <li>Student engagement analytics</li>
                <li>Automated submission logging</li>
                <li>Class batch synchronization</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ⚡ WHY US */}
      <section className="why-section">
        <div className="home-container">
          <div className="section-header">
            <h2 className="section-title">The <GradientText>FocusFlow</GradientText> Advantage</h2>
          </div>
          <div className="why-grid">
            <div className="why-item">
              <Zap size={32} className="text-primary mb-4" />
              <h4>Unified OS</h4>
              <p>Everything you need, synchronized in one futuristic interface.</p>
            </div>
            <div className="why-item">
              <Clock size={32} className="text-secondary mb-4" />
              <h4>Zero Latency</h4>
              <p>Lightning-fast interactions designed for peak efficiency.</p>
            </div>
            <div className="why-item">
              <Sparkles size={32} className="text-primary mb-4" />
              <h4>Clean Vision</h4>
              <p>Minimalist, high-end UI/UX that keeps you focused on what matters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FINAL CTA */}
      <section className="cta-section">
        <div className="home-container">
          <GlassCard className="cta-card">
            <h2>Ready for the <GradientText>Next Level</GradientText>?</h2>
            <p>Join the next generation of educators and learners today.</p>
            <GlowButton onClick={() => navigate('/login')}>
              🚀 Join FocusFlow <ArrowRight size={20} />
            </GlowButton>
          </GlassCard>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} FocusFlow • Built for the future of education.</p>
      </footer>
    </div>
  );
};

export default Home;
