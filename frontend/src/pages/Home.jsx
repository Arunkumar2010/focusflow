import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Sparkles,
  Rocket,
  GraduationCap,
  Shield
} from 'lucide-react';
import { GlassCard, GlowButton, GradientText, NeonBadge } from '../components/ui/FuturisticUI';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="home-page-v2">
      {/* 🚀 PREMIUM HERO SECTION */}
      <section className="hero-section">
        <motion.div 
          className="home-container"
          style={{ opacity, scale }}
        >
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <NeonBadge className="mb-4">✨ v2.0 • The Future of Learning</NeonBadge>
            </motion.div>
            
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Master Your <br />
              <motion.span 
                className="gradient-text-animated"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Academic Flow
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="hero-description"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Experience the unified OS for education. FocusFlow bridges the gap between students and teachers through high-velocity task management and immersive live synchronization.
            </motion.p>
            
            <motion.div 
              className="hero-btns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <GlowButton onClick={() => navigate('/login')} className="hero-primary-btn">
                <Rocket size={20} /> Launch Application
              </GlowButton>
              <motion.button 
                className="btn-glass-secondary" 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Modules <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="hero-orb"></div>
            <div className="hero-orb secondary"></div>
            <GlassCard className="hero-preview-card">
              <div className="preview-header">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
              <div className="preview-content">
                <div className="skeleton-line long"></div>
                <div className="skeleton-grid">
                  <div className="skeleton-box"></div>
                  <div className="skeleton-box"></div>
                </div>
                <div className="skeleton-line short"></div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </section>

      {/* 🧊 FEATURES SECTION */}
      <section id="features" className="features-section">
        <div className="home-container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              High-Velocity <GradientText>Modules</GradientText>
            </motion.h2>
            <motion.p className="section-subtitle" variants={itemVariants}>
              Precision tools engineered for peak academic performance and seamless collaboration.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="features-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard className="feature-card-v2 glass-hover">
                  <div className="feature-glow" style={{ background: feature.color === 'primary' ? 'var(--primary-glow)' : 'var(--secondary-glow)' }}></div>
                  <div className="feature-icon-v2">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 👥 ROLE SELECTOR SECTION */}
      <section className="roles-section">
        <div className="home-container">
          <div className="roles-layout">
            <motion.div 
              className="role-v2-card student"
              whileHover={{ y: -10 }}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="role-v2-icon"><GraduationCap size={40} /></div>
              <h2>Students 🎓</h2>
              <p>Crush assignments, track progress, and never miss a live session with your personalized dashboard.</p>
              <div className="role-features">
                <span>✨ Smart Tracking</span>
                <span>✨ Peer Sync</span>
                <span>✨ Focus Engine</span>
              </div>
            </motion.div>

            <motion.div 
              className="role-v2-card teacher"
              whileHover={{ y: -10 }}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="role-v2-icon"><Users size={40} /></div>
              <h2>Teachers 🧑‍🏫</h2>
              <p>Deploy curriculum, analyze engagement, and synchronize with your batches in real-time.</p>
              <div className="role-features">
                <span>✨ Batch Deployment</span>
                <span>✨ Analytics Core</span>
                <span>✨ Live Sync</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ⚡ INFRASTRUCTURE SECTION */}
      <section className="infra-section">
        <div className="home-container">
          <GlassCard className="cta-v2-card">
            <div className="cta-v2-content">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                Ready to Enter the <br />
                <GradientText>Next Generation?</GradientText>
              </motion.h2>
              <p>Join thousands of users building the future of education on FocusFlow.</p>
              <GlowButton onClick={() => navigate('/register')} className="cta-btn">
                Initialize Account 🚀
              </GlowButton>
            </div>
            <div className="cta-v2-visual">
               <Shield size={120} className="cta-shield-icon" />
            </div>
          </GlassCard>
        </div>
      </section>

      <footer className="footer-v2">
        <div className="home-container">
          <div className="footer-content">
             <div className="footer-brand">
               <h3>⚡ FocusFlow</h3>
               <p>The Academic Unified Operating System.</p>
             </div>
             <div className="footer-links">
               <span>Documentation</span>
               <span>Privacy</span>
               <span>Security</span>
             </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} FocusFlow Matrix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
