/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd, FaLock, FaHeartbeat, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';
import { GoogleLogin } from '@react-oauth/google';
import { loginUser, googleLogin } from '../services/api';

const Login = () => {
  const [lang, setLang] = useState('EN');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const response = await loginUser(formData);
        const { access, refresh, user } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'doctor') {
            window.location.href = '/doctor/dashboard';
        } else if (user.role === 'admin') {
            window.location.href = '/admin/dashboard';
        } else {
            window.location.href = '/user/dashboard';
        }
    } catch (err) {
        setError(
            err.response?.data?.error ||
            (lang === 'EN' ? 'Invalid username or password.' : 'Nom d\'utilisateur ou mot de passe incorrect.')
        );
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await googleLogin({ credential: credentialResponse.credential });
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (user.role === 'doctor') {
          window.location.href = '/doctor/dashboard';
      } else if (user.role === 'admin') {
          window.location.href = '/admin/dashboard';
      } else {
          window.location.href = '/user/dashboard';
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        (lang === 'EN' ? 'Google Login failed.' : 'La connexion avec Google a échoué.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(lang === 'EN' ? 'Google Login failed.' : 'La connexion avec Google a échoué.');
  };

  const healthWords = [
    'Emergency Guidance', 'Verified Doctors', 'and more......',
    // 'AI Health Assistant', 'Health Education', 'Secure & Private',
    // 'Daily Health Tips', 'Bilingual Support', 'Offline Access',
    // 'First Aid Steps', 'Doctor Consultation', 'Health Reminders'
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ===== LEFT SIDE — Image + Health Words ===== */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0a192f 0%, #0d3b6e 50%, #065f46 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', position: 'relative', overflow: 'hidden',
        minWidth: 0
      }}>
        {/* Background health image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('/images/landing.jpg')",
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15
        
            
        }} />

        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(13,110,253,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(25,135,84,0.15)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
          {/* Logo */}
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
              fontSize: '2rem', fontWeight: 800, color: 'white',
              marginBottom: '0.5rem',
              background: 'linear-gradient(135deg, #60a5fa, #34d399)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              AnasHealthcare
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
              {lang === 'EN'
                ? 'Your trusted digital health companion'
                : 'Votre compagnon santé numérique de confiance'}
            </p>
          </motion.div>

          {/* Floating health words */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {healthWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(8px)'
                }}>
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {[
              { num: '24/7', label: lang === 'EN' ? 'Available' : 'Disponible' },
              { num: '100%', label: lang === 'EN' ? 'Secure' : 'Sécurisé' },
              { num: 'FR|EN', label: lang === 'EN' ? 'Bilingual' : 'Bilingue' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '0.8rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa' }}>{stat.num}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Login Form ===== */}
      <div style={{
        width: '480px', flexShrink: 0,
        background: 'white',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2.5rem',
        overflowY: 'auto'
      }}>
        {/* Lang toggle */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
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
          style={{ width: '100%', maxWidth: '380px' }}>

          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #0d6efd, #0099ff)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FaHeartbeat color="white" size={18} />
              </div>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                {lang === 'EN' ? 'Welcome Back' : 'Bon Retour'}
              </h2>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
              {lang === 'EN'
                ? 'Sign in to access your health dashboard'
                : 'Connectez-vous pour accéder à votre tableau de bord santé'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
    <div style={{
        background: '#fff5f5', border: '1px solid #feb2b2',
        borderRadius: '10px', padding: '0.75rem 1rem',
        marginBottom: '1rem', color: '#c53030',
        fontSize: '0.85rem', display: 'flex',
        alignItems: 'center', gap: '8px'
    }}>
        ⚠️ {error}
    </div>
)}

            {/* Username */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                {lang === 'EN' ? 'Username' : "Nom d'utilisateur"}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#0d6efd'
                }}>
                  <FaUserMd size={16} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={lang === 'EN' ? 'Enter your username' : "Entrez votre nom d'utilisateur"}
                  required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem',
                    border: '1.5px solid #e2e8f0', borderRadius: '12px',
                    fontSize: '0.9rem', outline: 'none',
                    transition: '0.2s', boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                    color: '#1e293b', background: '#f8fafc'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#0d6efd'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(13,110,253,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.8rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                {lang === 'EN' ? 'Password' : 'Mot de passe'}
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#0d6efd'
                }}>
                  <FaLock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={lang === 'EN' ? 'Enter your password' : 'Entrez votre mot de passe'}
                  required
                  style={{
                    width: '100%', padding: '0.85rem 3rem 0.85rem 2.8rem',
                    border: '1.5px solid #e2e8f0', borderRadius: '12px',
                    fontSize: '0.9rem', outline: 'none',
                    transition: '0.2s', boxSizing: 'border-box',
                    fontFamily: "'Inter', sans-serif",
                    color: '#1e293b', background: '#f8fafc'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#0d6efd'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(13,110,253,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#64748b', padding: 0
                  }}>
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
              <a href="#" style={{ fontSize: '0.82rem', color: '#0d6efd', textDecoration: 'none', fontWeight: 500 }}>
                {lang === 'EN' ? 'Forgot password?' : 'Mot de passe oublié?'}
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0d6efd, #0099ff)',
                color: 'white', border: 'none',
                borderRadius: '12px', fontSize: '1rem',
                fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(13,110,253,0.35)',
                transition: '0.2s', fontFamily: "'Inter', sans-serif"
              }}>
              {loading
                ? (lang === 'EN' ? 'Signing in...' : 'Connexion...')
                : (lang === 'EN' ? 'Sign In' : 'Se connecter')
              }
              {!loading && <FaArrowRight size={14} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
                {lang === 'EN' ? 'OR' : 'OU'}
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
            </div>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
              {lang === 'EN' ? 'New to AnasHealthcare?' : 'Nouveau sur AnasHealthcare?'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Register link */}
          <Link to="/register" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '0.9rem',
            border: '1.5px solid #0d6efd', color: '#0d6efd',
            borderRadius: '12px', fontSize: '0.95rem',
            fontWeight: 600, textDecoration: 'none',
            transition: '0.2s', boxSizing: 'border-box'
          }}>
            {lang === 'EN' ? 'Create an Account' : 'Créer un compte '}
          </Link>

          {/* Back to home */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ← {lang === 'EN' ? 'Back to Home' : "Retour à l'accueil"}
            </Link>
          </div>

          {/* Health disclaimer */}
          {/* <div style={{
            marginTop: '2rem', padding: '0.8rem 1rem',
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
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;