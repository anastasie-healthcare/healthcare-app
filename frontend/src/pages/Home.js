/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaAmbulance, FaUserMd, FaPills, FaBookMedical,
  FaRobot, FaShieldAlt, FaBell, FaGlobe,
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar,
  FaCheckCircle, FaHeartbeat, FaLock, FaArrowRight
} from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lang, setLang] = useState('EN');

  const images = [
    "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1600&q=80",
    "/images/image1.jpg",
    "/images/landing.jpg",
    "/images/user1.png",
    "/images/user2.jpg",
    "/images/user4.png",
  ];

  const services = [
    { icon: <FaAmbulance size={28} color="white" />, iconBg: 'linear-gradient(135deg, #ff4d4d, #ff8533)', border: '#ff4d4d', bg: '#fff5f5', title: lang === 'EN' ? "Emergency First Aid" : "Premiers Secours", desc: lang === 'EN' ? "Step-by-step emergency instructions available 24/7 even without internet." : "Instructions d'urgence disponibles 24h/24 même sans internet." },
    { icon: <FaUserMd size={28} color="white" />, iconBg: 'linear-gradient(135deg, #0d6efd, #0099ff)', border: '#0d6efd', bg: '#f0f7ff', title: lang === 'EN' ? "Verified Doctors" : "Médecins Vérifiés", desc: lang === 'EN' ? "Connect with admin-verified medical professionals from anywhere." : "Connectez-vous avec des médecins vérifiés depuis n'importe où." },
    { icon: <FaPills size={28} color="white" />, iconBg: 'linear-gradient(135deg, #198754, #20c997)', border: '#198754', bg: '#f0fff8', title: lang === 'EN' ? "Drug Information" : "Informations Médicaments", desc: lang === 'EN' ? "Search drug uses, dosages, precautions and interactions instantly." : "Recherchez utilisations, dosages et précautions des médicaments." },
    { icon: <FaBookMedical size={28} color="white" />, iconBg: 'linear-gradient(135deg, #fd7e14, #ffc107)', border: '#fd7e14', bg: '#fff8f0', title: lang === 'EN' ? "Health Education" : "Éducation Sanitaire", desc: lang === 'EN' ? "Learn about illnesses, prevention and healthy daily practices." : "Apprenez les maladies, la prévention et les pratiques saines." },
    { icon: <FaRobot size={28} color="white" />, iconBg: 'linear-gradient(135deg, #6f42c1, #d63af9)', border: '#6f42c1', bg: '#f8f0ff', title: lang === 'EN' ? "AI Health Assistant" : "Assistant IA Santé", desc: lang === 'EN' ? "Get instant AI-powered answers to your health questions daily." : "Obtenez des réponses IA instantanées à vos questions de santé." },
    { icon: <FaShieldAlt size={28} color="white" />, iconBg: 'linear-gradient(135deg, #0dcaf0, #0d6efd)', border: '#0dcaf0', bg: '#f0fffe', title: lang === 'EN' ? "Secure & Private" : "Sécurisé & Privé", desc: lang === 'EN' ? "Your medical data is encrypted and fully confidential." : "Vos données médicales sont chiffrées et totalement confidentielles." },
    { icon: <FaBell size={28} color="white" />, iconBg: 'linear-gradient(135deg, #ffc107, #ff8533)', border: '#ffc107', bg: '#fffbf0', title: lang === 'EN' ? "Health Reminders" : "Rappels Santé", desc: lang === 'EN' ? "Personalized daily health notifications sent to your device." : "Notifications santé quotidiennes personnalisées sur votre appareil." },
    { icon: <FaGlobe size={28} color="white" />, iconBg: 'linear-gradient(135deg, #20c997, #198754)', border: '#20c997', bg: '#f0fff9', title: lang === 'EN' ? "Bilingual Platform" : "Plateforme Bilingue", desc: lang === 'EN' ? "Fully available in English and French for all Cameroonians." : "Entièrement disponible en anglais et français pour tous." },
  ];

  const whyUs = [
    { icon: <FaHeartbeat size={32} color="white" />, iconBg: 'linear-gradient(135deg, #ff4d4d, #ff8533)', border: '#ff4d4d', bg: '#fff5f5', title: lang === 'EN' ? "24/7 Emergency Access" : "Accès Urgence 24h/24", desc: lang === 'EN' ? "Life-saving first aid guidance available around the clock, even offline in rural Cameroon." : "Guide de premiers secours disponible 24h/24, même hors ligne dans les zones rurales." },
    { icon: <FaUserMd size={32} color="white" />, iconBg: 'linear-gradient(135deg, #0d6efd, #0099ff)', border: '#0d6efd', bg: '#f0f7ff', title: lang === 'EN' ? "Admin-Verified Doctors" : "Médecins Vérifiés par Admin", desc: lang === 'EN' ? "Every doctor on our platform is manually verified and credentialed by our admin team." : "Chaque médecin est manuellement vérifié et accrédité par notre équipe admin." },
    { icon: <FaLock size={32} color="white" />, iconBg: 'linear-gradient(135deg, #198754, #20c997)', border: '#198754', bg: '#f0fff8', title: lang === 'EN' ? "100% Secure & Private" : "100% Sécurisé & Privé", desc: lang === 'EN' ? "Your health data is encrypted with JWT security and never shared with third parties." : "Vos données sont chiffrées avec sécurité JWT et jamais partagées." },
    { icon: <FaGlobe size={32} color="white" />, iconBg: 'linear-gradient(135deg, #6f42c1, #d63af9)', border: '#6f42c1', bg: '#f8f0ff', title: lang === 'EN' ? "Works Offline Too" : "Fonctionne Hors Ligne", desc: lang === 'EN' ? "Core features like emergency guidance and drug info work without internet — built for rural Cameroon." : "Les fonctionnalités principales fonctionnent sans internet — conçu pour le Cameroun rural." },
  ];

  const steps = [
    { num: "01", icon: <MdHealthAndSafety size={36} color="white" />, iconBg: 'linear-gradient(135deg, #0d6efd, #0099ff)', border: '#0d6efd', bg: '#f0f7ff', title: lang === 'EN' ? "Browse the App" : "Parcourir l'App", desc: lang === 'EN' ? "Visit our home, services and about pages to discover everything AnasHealthcare offers." : "Visitez nos pages accueil, services et à propos pour découvrir tout ce qu'offre AnasHealthcare." },
    { num: "02", icon: <FaUserMd size={36} color="white" />, iconBg: 'linear-gradient(135deg, #198754, #20c997)', border: '#198754', bg: '#f0fff8', title: lang === 'EN' ? "Create Your Account" : "Créer Votre Compte", desc: lang === 'EN' ? "Sign up for free in less than 2 minutes and set up your health profile." : "Inscrivez-vous gratuitement en moins de 2 minutes et configurez votre profil santé." },
    { num: "03", icon: <FaPills size={36} color="white" />, iconBg: 'linear-gradient(135deg, #fd7e14, #ffc107)', border: '#fd7e14', bg: '#fff8f0', title: lang === 'EN' ? "Access All Features" : "Accéder à Tout", desc: lang === 'EN' ? "Explore drugs, emergency steps, health info and connect with verified doctors." : "Explorez médicaments, urgences, infos santé et connectez-vous avec des médecins." },
    { num: "04", icon: <FaHeartbeat size={36} color="white" />, iconBg: 'linear-gradient(135deg, #6f42c1, #d63af9)', border: '#6f42c1', bg: '#f8f0ff', title: lang === 'EN' ? "Stay Healthy Daily" : "Rester en Santé", desc: lang === 'EN' ? "Receive personalized daily health tips from our AI and stay on top of your wellness." : "Recevez des conseils santé quotidiens personnalisés de notre IA." },
  ];

  const testimonials = [
    { img: "/images/imgg.jpg", name: "Michelle F.", city: "Douala", rating: 5, role: lang === 'EN' ? "Patient" : "Patient", text: lang === 'EN' ? "AnasHealthcare guided me during a late-night emergency. The first aid steps were clear and truly lifesaving. I couldn't have managed without it." : "AnasHealthcare m'a guidée lors d'une urgence nocturne. Les étapes de premiers secours étaient claires et vraiment vitales.", gradient: 'linear-gradient(135deg, #0d6efd, #0099ff)' },
    { img: "/images/userr.jpg", name: "Samson S.", city: "Yaoundé", rating: 5, role: lang === 'EN' ? "Teacher" : "Enseignant", text: lang === 'EN' ? "The verified doctor consultation helped me avoid dangerous self-medication and get proper treatment. This platform is a game changer for Cameroon." : "La consultation médicale vérifiée m'a aidé à éviter l'automédication dangereuse et obtenir un traitement approprié.", gradient: 'linear-gradient(135deg, #198754, #20c997)' },
    { img: "/images/imgs.jpg", name: "Katrine M.", city: "Bafoussam", rating: 5, role: lang === 'EN' ? "Nurse" : "Infirmière", text: lang === 'EN' ? "The drug information section is incredibly detailed and easy to understand. Even as a nurse I use it daily to double-check prescriptions." : "La section médicaments est incroyablement détaillée et facile à comprendre. Même en tant qu'infirmière je l'utilise quotidiennement.", gradient: 'linear-gradient(135deg, #6f42c1, #d63af9)' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b', background: '#f8fafc' }}>

      {/* ========== NAVBAR ========== */}
      <nav style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 15px rgba(0,0,0,0.06)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0.75rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(135deg, #0d6efd, #198754)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          + AnasHealthcare
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {[{ en: 'Home', fr: 'Accueil', href: '#home' }, { en: 'About', fr: 'À propos', href: '#about' }, { en: 'Service', fr: 'Service', href: '#services' }].map((item, i) => (
            <a key={i} href={item.href} style={{ fontWeight: 500, color: '#1e293b', textDecoration: 'none', fontSize: '0.95rem', borderBottom: '2px solid transparent', paddingBottom: '2px', transition: '0.2s' }}
              onMouseOver={e => { e.target.style.color = '#0d6efd'; e.target.style.borderBottomColor = '#0d6efd'; }}
              onMouseOut={e => { e.target.style.color = '#1e293b'; e.target.style.borderBottomColor = 'transparent'; }}>
              {lang === 'EN' ? item.en : item.fr}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{ background: 'transparent', border: '1.5px solid #0d6efd', color: '#0d6efd', borderRadius: '40px', padding: '0.3rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            {lang === 'EN' ? 'FR' : 'EN'}
          </button>
          <Link to="/register" style={{ border: '1.5px solid #0d6efd', color: '#0d6efd', borderRadius: '40px', padding: '0.4rem 1.4rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
            {lang === 'EN' ? 'Sign up' : "S'inscrire"}
          </Link>
          <Link to="/login" style={{ background: 'linear-gradient(135deg, #0d6efd, #0099ff)', color: 'white', borderRadius: '40px', padding: '0.4rem 1.4rem', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(13,110,253,0.3)' }}>
            {lang === 'EN' ? 'Login' : 'Connexion'}
          </Link>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section id="home" style={{ marginTop: '60px', minHeight: '88vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ position: 'absolute', inset: 0, backgroundImage: `url('${images[currentSlide]}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(5,10,30,0.82) 0%, rgba(5,10,30,0.55) 55%, rgba(5,10,30,0.15) 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '0 5rem', maxWidth: '700px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, color: 'white', marginBottom: '1.2rem', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            {lang === 'EN'
              ? <>Welcome to AnasHealthcare<br /><span style={{ color: '#60a5fa' }}>Your Trusted Digital</span><br />Health Companion</>
              : <>Bienvenue sur AnasHealthcare<br /><span style={{ color: '#60a5fa' }}>Votre Compagnon Santé</span><br />Numérique de Confiance</>
            }
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderLeft: '4px solid #0d6efd', borderRadius: '12px', padding: '1.2rem 1.5rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.92)', margin: 0, lineHeight: 1.8 }}>
              {lang === 'EN'
                ? 'Access emergency guidance, connect with verified doctors, and learn about safe drug usage through our secure and modern digital platform — available online and offline across Cameroon.'
                : "Accédez aux conseils d'urgence, connectez-vous avec des médecins vérifiés et apprenez l'utilisation sécurisée des médicaments — disponible en ligne et hors ligne au Cameroun."
              }
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0d6efd, #0099ff)', color: 'white', padding: '0.85rem 2rem', borderRadius: '40px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 25px rgba(13,110,253,0.45)', fontSize: '1rem' }}>
              {lang === 'EN' ? 'Get Started Free' : 'Commencer Gratuitement'}<FaArrowRight size={14} />
            </Link>
            <a href="#services" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: 'white', padding: '0.85rem 2rem', borderRadius: '40px', fontWeight: 600, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)', fontSize: '1rem' }}>
              {lang === 'EN' ? 'Explore Services' : 'Explorer les Services'}
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { icon: <FaCheckCircle color="#4ade80" size={14} />, text: lang === 'EN' ? 'Free to use' : 'Gratuit' },
              { icon: <FaCheckCircle color="#4ade80" size={14} />, text: lang === 'EN' ? 'Works offline' : 'Hors ligne' },
              { icon: <FaCheckCircle color="#4ade80" size={14} />, text: 'FR & EN' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {b.icon}
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', fontWeight: 500 }}>{b.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== SERVICES AUTO SCROLL ========== */}
      <section id="services" style={{ padding: '5rem 0', background: '#f0f4ff', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 4rem' }}>
          <p style={{ color: '#0d6efd', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {lang === 'EN' ? 'What We Offer' : 'Ce que nous offrons'}
          </p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            {lang === 'EN' ? 'Our Services' : 'Nos Services'}
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #0d6efd, #198754)', borderRadius: '4px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
            {lang === 'EN' ? 'Comprehensive digital healthcare solutions designed to educate, support, and connect every Cameroonian.' : 'Solutions de santé numérique complètes conçues pour éduquer, soutenir et connecter chaque Camerounais.'}
          </p>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: '1.5rem', width: 'max-content', padding: '1rem 1.5rem' }}>
            {[...services, ...services].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1.5px solid ${s.border}30`, borderTop: `4px solid ${s.border}`, borderRadius: '16px', padding: '1.8rem 1.5rem', textAlign: 'center', width: '240px', flexShrink: 0, boxShadow: `0 8px 25px ${s.border}15` }}>
                <div style={{ width: '64px', height: '64px', background: s.iconBg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: `0 8px 20px ${s.border}40` }}>
                  {s.icon}
                </div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.6rem', fontSize: '0.95rem', color: '#1e293b' }}>{s.title}</h5>
                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section id="about" style={{ padding: '6rem 4rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#198754', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {lang === 'EN' ? 'Why Choose Us' : 'Pourquoi nous choisir'}
            </p>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>
              {lang === 'EN' ? 'Why Choose AnasHealthcare?' : 'Pourquoi choisir AnasHealthcare?'}
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #0d6efd, #198754)', borderRadius: '4px', margin: '0 auto 1rem' }} />
            <p style={{ color: '#475569', maxWidth: '700px', margin: '0 auto', lineHeight: 1.8 }}>
              {lang === 'EN'
                ? 'Built specifically for the Cameroonian context — combining emergency readiness, verified doctors, and AI-powered health guidance.'
                : "Conçu spécifiquement pour le contexte camerounais — combinant préparation aux urgences, médecins vérifiés et conseils santé IA."
              }
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            {whyUs.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{ borderRadius: '20px', padding: '2rem', background: w.bg, border: `1.5px solid ${w.border}30`, borderTop: `4px solid ${w.border}`, boxShadow: `0 8px 25px ${w.border}15`, transition: '0.3s' }}>
                <div style={{ width: '64px', height: '64px', background: w.iconBg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem', boxShadow: `0 8px 20px ${w.border}40` }}>
                  {w.icon}
                </div>
                <h5 style={{ fontWeight: 700, marginBottom: '0.6rem', color: '#1e293b', fontSize: '1rem' }}>{w.title}</h5>
                <p style={{ color: '#475569', fontSize: '0.87rem', lineHeight: 1.7, margin: 0 }}>{w.desc}</p>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #0d6efd, #0099ff)', color: 'white', padding: '0.9rem 2.5rem', borderRadius: '40px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 25px rgba(13,110,253,0.3)' }}>
              {lang === 'EN' ? 'Join Now for Free' : 'Rejoindre Gratuitement'}
              <FaArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section style={{ padding: '6rem 4rem', background: '#f0f9ff' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#0d6efd', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {lang === 'EN' ? 'Simple Process' : 'Processus Simple'}
          </p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>
            {lang === 'EN' ? 'How It Works' : 'Comment ça marche'}
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #0d6efd, #198754)', borderRadius: '4px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto', fontWeight: 400 }}>
            {lang === 'EN' ? 'Getting started with AnasHealthcare is simple and fast' : 'Commencer avec AnasHealthcare est simple et rapide'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              style={{ background: s.bg, borderRadius: '20px', padding: '2rem', textAlign: 'center', border: `1.5px solid ${s.border}30`, borderTop: `4px solid ${s.border}`, position: 'relative', overflow: 'hidden', boxShadow: `0 8px 25px ${s.border}15` }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1.2rem', fontSize: '3.5rem', fontWeight: 900, color: `${s.border}15`, lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ width: '72px', height: '72px', background: s.iconBg, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: `0 8px 25px ${s.border}40` }}>
                {s.icon}
              </div>
              <h5 style={{ fontWeight: 700, marginBottom: '0.6rem', fontSize: '1rem', color: '#1e293b' }}>{s.title}</h5>
              <p style={{ color: '#64748b', fontSize: '0.87rem', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section style={{ padding: '6rem 4rem', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: '#0d6efd', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {lang === 'EN' ? 'User Reviews' : 'Avis Utilisateurs'}
          </p>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1rem', color: '#1e293b' }}>
            {lang === 'EN' ? 'What Our Users Say' : 'Ce que disent nos utilisateurs'}
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #0d6efd, #198754)', borderRadius: '4px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#475569' }}>
            {lang === 'EN' ? 'Trusted by individuals and families across Cameroon' : 'Approuvé par des individus et des familles à travers le Cameroun'}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
              <div style={{ height: '6px', background: t.gradient }} />
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, j) => (<FaStar key={j} color="#fbbf24" size={16} />))}
                </div>
                <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <img src={t.img} alt={t.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{t.name}</div>
                    <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section style={{ padding: '4rem', background: 'linear-gradient(135deg, #203a1e 0%, #3da574 50%, #065f46 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.6rem', lineHeight: 1.2 }}>
              {lang === 'EN' ? 'Ready to take control of your health?' : 'Prêt à prendre en main votre santé?'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', margin: 0 }}>
              {lang === 'EN' ? 'Join thousands of Cameroonians already using AnasHealthcare.' : 'Rejoignez des milliers de Camerounais qui utilisent déjà AnasHealthcare.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#0d6efd', padding: '0.85rem 2rem', borderRadius: '40px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
              {lang === 'EN' ? 'Create Free Account' : 'Créer un compte gratuit'}
              <FaArrowRight size={13} />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: 'white', padding: '0.85rem 2rem', borderRadius: '40px', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.35)' }}>
              {lang === 'EN' ? 'Login' : 'Connexion'}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ background: '#0a0f1e', color: '#94a3b8', padding: '4rem 4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', maxWidth: '1100px', margin: '0 auto 2.5rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white', marginBottom: '1rem' }}>+ AnasHealthcare</div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {lang === 'EN' ? 'A trusted digital healthcare platform providing emergency guidance, verified doctor connectivity, drug information, and AI-powered health support across Cameroon.' : "Une plateforme de santé numérique de confiance fournissant des conseils d'urgence et un support IA au Cameroun."}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[{ icon: <FaFacebookF size={16} />, color: '#1877f2' }, { icon: <FaTwitter size={16} />, color: '#1da1f2' }, { icon: <FaLinkedinIn size={16} />, color: '#0a66c2' }, { icon: <FaInstagram size={16} />, color: '#e4405f' }].map((s, i) => (
                <a key={i} href="#" style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: '0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background = s.color}
                  onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h6 style={{ color: 'white', fontWeight: 700, marginBottom: '1.2rem', fontSize: '0.95rem' }}>{lang === 'EN' ? 'Quick Links' : 'Liens rapides'}</h6>
            {[{ en: 'Home', fr: 'Accueil', href: '#home' }, { en: 'About', fr: 'À propos', href: '#about' }, { en: 'Services', fr: 'Services', href: '#services' }, { en: 'Doctors', fr: 'Médecins', href: '#' }].map((item, i) => (
              <div key={i} style={{ marginBottom: '0.7rem' }}>
                <a href={item.href} style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseOver={e => e.currentTarget.style.color = 'white'}
                  onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                  <FaArrowRight size={10} color="#0d6efd" />
                  {lang === 'EN' ? item.en : item.fr}
                </a>
              </div>
            ))}
          </div>
          <div>
            <h6 style={{ color: 'white', fontWeight: 700, marginBottom: '1.2rem', fontSize: '0.95rem' }}>{lang === 'EN' ? 'Our Services' : 'Nos Services'}</h6>
            {['Emergency Guidance', 'Doctor Consultation', 'Drug Information', 'Health Education', 'AI Assistant'].map((item, i) => (
              <div key={i} style={{ marginBottom: '0.7rem' }}>
                <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onMouseOver={e => e.currentTarget.style.color = 'white'}
                  onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}>
                  <FaArrowRight size={10} color="#198754" />
                  {item}
                </a>
              </div>
            ))}
          </div>
          <div>
            <h6 style={{ color: 'white', fontWeight: 700, marginBottom: '1.2rem', fontSize: '0.95rem' }}>{lang === 'EN' ? 'Contact Us' : 'Contactez-nous'}</h6>
            {[
              { icon: <FaMapMarkerAlt size={14} color="#0d6efd" />, text: 'Douala, Cameroon' },
              { icon: <FaEnvelope size={14} color="#0d6efd" />, text: 'annastasietchoutcha@gmail.com' },
              { icon: <FaPhone size={14} color="#0d6efd" />, text: '+237 653 09 67 94' },
              { icon: <FaPhone size={14} color="#0d6efd" />, text: '+237 692 26 91 09' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '0.8rem' }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>{c.icon}</div>
                <span style={{ fontSize: '0.87rem', lineHeight: 1.5 }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>© 2026 AnasHealthcare. {lang === 'EN' ? 'All Rights Reserved.' : 'Tous droits réservés.'}</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{lang === 'EN' ? 'Designed for BTECH Project · Douala, Cameroon' : 'Conçu pour le projet BTECH · Douala, Cameroun'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;