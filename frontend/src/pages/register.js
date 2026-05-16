import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUserMd, FaLock, FaHeartbeat, FaEye, FaEyeSlash,
  FaArrowRight, FaUser, FaEnvelope, FaCheckCircle
} from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';

const Register = () => {
  const [lang, setLang] = useState('EN');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', role: 'user'
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const healthWords = [
    'Emergency Guidance', 'Verified Doctors', 'Drug Information',
    'AI Health Assistant', 'Health Education', 'Secure & Private',
    'Daily Health Tips', 'Bilingual Support', 'Offline Access',
    'First Aid Steps', 'Doctor Consultation', 'Health Reminders'
  ];

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem',
    border: '1.5px solid #e2e8f0', borderRadius: '12px',
    fontSize: '0.9rem', outline: 'none',
    transition: '0.2s', boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b', background: '#f8fafc'
  };

  const labelStyle = {
    display: 'block', fontSize: '0.85rem',
    fontWeight: 600, color: '#374151', marginBottom: '0.4rem'
  };

  const iconWrapStyle = {
    position: 'absolute', left: '14px', top: '50%',
    transform: 'translateY(-50%)', color: '#0d6efd'
  };

  const onFocus = e => {
    e.target.style.borderColor = '#0d6efd';
    e.target.style.background = 'white';
    e.target.style.boxShadow = '0 0 0 3px rgba(13,110,253,0.1)';
  };

  const onBlur = e => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.background = '#f8fafc';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ===== LEFT SIDE ===== */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0a192f 0%, #0d3b6e 50%, #065f46 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden',
        minWidth: 0
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images/landing.jpg')",
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15
        }} />
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(13,110,253,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(25,135,84,0.15)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '80px', height: '80px',
              background: 'linear-gradient(135deg, #0d6efd, #198754)',
              borderRadius: '24px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 20px 40px rgba(13,110,253,0.4)'
            }}>
              <MdLocalHospital size={42} color="white" />
            </div>
            <h1 style={{
              fontSize: '2rem', fontWeight: 800,
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              AnasHealthcare
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              {lang === 'EN'
                ? 'Join thousands of Cameroonians taking control of their health'
                : 'Rejoignez des milliers de Camerounais prenant en main leur santé'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '2rem' }}>
            {healthWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 * i }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px', fontSize: '0.78rem',
                  fontWeight: 500, backdropFilter: 'blur(8px)'
                }}>
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: 'left' }}>
            {[
              lang === 'EN' ? 'Free emergency first aid guidance 24/7' : 'Guide de premiers secours gratuit 24h/24',
              lang === 'EN' ? 'Connect with verified doctors instantly' : 'Connectez-vous avec des médecins vérifiés',
              lang === 'EN' ? 'AI-powered daily health tips' : "Conseils santé quotidiens par l'IA",
              lang === 'EN' ? 'Works offline in rural areas' : 'Fonctionne hors ligne dans les zones rurales',
            ].map((benefit, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.8rem' }}>
                <FaCheckCircle color="#34d399" size={14} style={{ flexShrink: 0 }} />
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.87rem' }}>{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Register Form ===== */}
      <div style={{
        width: '500px', flexShrink: 0,
        background: 'white',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '2.5rem 2.5rem',
        overflowY: 'auto'
      }}>
        {/* Lang toggle */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')}
            style={{
              background: 'transparent', border: '1.5px solid #0d6efd',
              color: '#0d6efd', borderRadius: '40px',
              padding: '0.3rem 1rem', fontWeight: 700,
              cursor: 'pointer', fontSize: '0.85rem'
            }}>
            {lang === 'EN' ? 'FR' : 'EN'}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: '400px' }}>

          {/* Header */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #198754, #20c997)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FaHeartbeat color="white" size={18} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {lang === 'EN' ? 'Create Account' : 'Créer un compte'}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {lang === 'EN'
                ? 'Join AnasHealthcare — free and takes less than 2 minutes'
                : "Rejoignez AnasHealthcare — gratuit et moins de 2 minutes"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Username */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                {lang === 'EN' ? 'Username' : "Nom d'utilisateur"}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapStyle}><FaUser size={15} /></div>
                <input
                  type="text" name="username"
                  value={formData.username} onChange={handleChange}
                  placeholder={lang === 'EN' ? 'Choose a username' : "Choisissez un nom d'utilisateur"}
                  required style={inputStyle}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                {lang === 'EN' ? 'Email address' : 'Adresse email'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapStyle}><FaEnvelope size={15} /></div>
                <input
                  type="email" name="email"
                  value={formData.email} onChange={handleChange}
                  placeholder={lang === 'EN' ? 'Enter your email' : 'Entrez votre email'}
                  required style={inputStyle}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                {lang === 'EN' ? 'Password' : 'Mot de passe'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapStyle}><FaLock size={15} /></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password} onChange={handleChange}
                  placeholder={lang === 'EN' ? 'Create a strong password' : 'Créez un mot de passe fort'}
                  required style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                {lang === 'EN' ? 'Confirm Password' : 'Confirmer le mot de passe'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapStyle}><FaLock size={15} /></div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder={lang === 'EN' ? 'Confirm your password' : 'Confirmez votre mot de passe'}
                  required style={{ ...inputStyle, paddingRight: '3rem' }}
                  onFocus={onFocus} onBlur={onBlur}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                  {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Role selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>
                {lang === 'EN' ? 'I am registering as' : 'Je m\'inscris en tant que'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                {[
                  { value: 'user', icon: <FaUser size={16} />, label: lang === 'EN' ? 'Patient / User' : 'Patient / Utilisateur', color: '#0d6efd' },
                  { value: 'doctor', icon: <FaUserMd size={16} />, label: lang === 'EN' ? 'Doctor' : 'Médecin', color: '#198754' },
                ].map((role) => (
                  <div
                    key={role.value}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    style={{
                      padding: '0.8rem',
                      border: `2px solid ${formData.role === role.value ? role.color : '#e2e8f0'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      background: formData.role === role.value ? `${role.color}10` : 'white',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      transition: '0.2s'
                    }}>
                    <span style={{ color: formData.role === role.value ? role.color : '#94a3b8' }}>
                      {role.icon}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: formData.role === role.value ? role.color : '#64748b' }}>
                      {role.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #198754, #20c997)',
                color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '1rem',
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(25,135,84,0.35)',
                transition: '0.2s', fontFamily: "'Inter', sans-serif"
              }}>
              {loading
                ? (lang === 'EN' ? 'Creating account...' : 'Création du compte...')
                : (lang === 'EN' ? 'Create My Account' : 'Créer mon compte')
              }
              {!loading && <FaArrowRight size={14} />}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
              {lang === 'EN' ? 'Already have an account?' : 'Vous avez déjà un compte?'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <Link to="/login" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '0.9rem',
            border: '1.5px solid #0d6efd', color: '#0d6efd',
            borderRadius: '12px', fontSize: '0.95rem',
            fontWeight: 600, textDecoration: 'none',
            boxSizing: 'border-box'
          }}>
            {lang === 'EN' ? 'Sign In Instead' : 'Se connecter'}
          </Link>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← {lang === 'EN' ? 'Back to Home' : "Retour à l'accueil"}
            </Link>
          </div>

          <div style={{
            marginTop: '1.5rem', padding: '0.8rem 1rem',
            background: '#f0fdf4', borderRadius: '10px',
            border: '1px solid #bbf7d0',
            display: 'flex', alignItems: 'flex-start', gap: '8px'
          }}>
            <FaHeartbeat color="#198754" size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#166534', lineHeight: 1.5 }}>
              {lang === 'EN'
                ? 'Your health data is protected with JWT encryption and never shared with third parties.'
                : 'Vos données de santé sont protégées par chiffrement JWT et jamais partagées avec des tiers.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;