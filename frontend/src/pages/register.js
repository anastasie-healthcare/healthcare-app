import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaUserMd, FaLock, FaHeartbeat, FaEye, FaEyeSlash,
    FaArrowRight, FaUser, FaEnvelope, FaCheckCircle,
    FaAmbulance, FaPills, FaShieldAlt
} from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';
import { registerUser } from '../services/api';

const Register = () => {
    const [lang, setLang] = useState('EN');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: '', role: 'user'
    });
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError(lang === 'EN' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            const response = await registerUser(formData);
            const { access, refresh, user } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            if (user.role === 'doctor') {
                window.location.href = '/doctor/dashboard';
            } else if (user.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/user/dashboard';
            }
        } catch (err) {
            setError(
                err.response?.data?.username?.[0] ||
                err.response?.data?.email?.[0] ||
                err.response?.data?.error ||
                (lang === 'EN' ? 'Registration failed. Please try again.' : 'Inscription échouée. Veuillez réessayer.')
            );
        } finally {
            setLoading(false);
        }
    };
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

    const features = [
        {
            icon: <FaAmbulance size={15} color="#ff6b6b" />,
            bg: 'rgba(255,107,107,0.15)',
            title: lang === 'EN' ? 'Emergency First Aid' : 'Premiers Secours',
            desc: lang === 'EN' ? '24/7 guidance, even offline' : 'Disponible 24h/24, hors ligne'
        },
        {
            icon: <FaUserMd size={15} color="#60a5fa" />,
            bg: 'rgba(96,165,250,0.15)',
            title: lang === 'EN' ? 'Verified Doctors' : 'Médecins Vérifiés',
            desc: lang === 'EN' ? 'Consult certified professionals' : 'Consultez des professionnels certifiés'
        },
        {
            icon: <FaPills size={15} color="#34d399" />,
            bg: 'rgba(52,211,153,0.15)',
            title: lang === 'EN' ? 'Drug Information' : 'Informations Médicaments',
            desc: lang === 'EN' ? 'Dosages, uses and precautions' : 'Dosages, utilisations et précautions'
        },
        {
            icon: <FaShieldAlt size={15} color="#a78bfa" />,
            bg: 'rgba(167,139,250,0.15)',
            title: lang === 'EN' ? 'Secure & Private' : 'Sécurisé & Privé',
            desc: lang === 'EN' ? 'JWT encrypted health data' : 'Données de santé chiffrées JWT'
        },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

            {/* ===== LEFT SIDE ===== */}
            <div style={{
                flex: 0.75,
                position: 'relative',
                overflow: 'hidden',
                minWidth: 0
            }}>
                {/* Background image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: "url('/images/user4.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 10%',
                }} />

                {/* Dark overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(160deg, rgba(10,25,47,0.86) 0%, rgba(6,95,70,0.80) 100%)',
                }} />

                {/* Content — split into top, middle, bottom */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    height: '100%', minHeight: '100vh',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '2.5rem 2rem',
                }}>
                    {/* TOP — Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{
                            width: '64px', height: '64px',
                            background: 'linear-gradient(135deg, #0d6efd, #198754)',
                            borderRadius: '18px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 0.8rem',
                            boxShadow: '0 12px 30px rgba(13,110,253,0.35)'
                        }}>
                            <MdLocalHospital size={32} color="white" />
                        </div>
                        <h2 style={{
                            fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.3rem',
                            background: 'linear-gradient(135deg, #60a5fa, #34d399)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            AnasHealthcare
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', margin: 0 }}>
                            {lang === 'EN'
                                ? 'Your Trusted Digital Health Companion'
                                : 'Votre Compagnon Santé Numérique de Confiance'}
                        </p>
                        <div style={{
                            width: '40px', height: '3px',
                            background: 'linear-gradient(90deg, #0d6efd, #198754)',
                            borderRadius: '3px', margin: '1rem auto 0'
                        }} />
                    </motion.div>

                    {/* MIDDLE — Feature cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{ width: '100%', maxWidth: '300px' }}>
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 + i * 0.1 }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px', padding: '0.8rem 1rem',
                                    marginBottom: '0.6rem',
                                    backdropFilter: 'blur(8px)',
                                }}>
                                <div style={{
                                    width: '34px', height: '34px',
                                    background: feature.bg,
                                    borderRadius: '9px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <div style={{
                                        color: 'white', fontSize: '0.82rem',
                                        fontWeight: 600, marginBottom: '1px'
                                    }}>
                                        {feature.title}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
                                        {feature.desc}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* BOTTOM — Badge */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '40px', padding: '0.5rem 1.2rem'
                        }}>
                        <FaCheckCircle color="#34d399" size={12} />
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.78rem', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Free · Bilingual · Works Offline' : 'Gratuit · Bilingue · Hors Ligne'}
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* ===== RIGHT SIDE — Form ===== */}
            <div style={{
                width: '480px', flexShrink: 0,
                background: 'white',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '2rem 2.5rem',
                minHeight: '100vh',
                overflowY: 'auto'
            }}>
                {/* Lang toggle */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
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
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            gap: '10px', marginBottom: '0.4rem'
                        }}>
                            <div style={{
                                width: '34px', height: '34px',
                                background: 'linear-gradient(135deg, #198754, #20c997)',
                                borderRadius: '10px',

                            }}>
                                <FaHeartbeat color="white" size={16} />
                            </div>
                            <h2 style={{
                                fontSize: '1.5rem', fontWeight: 800,
                                color: '#1e293b', margin: 0,
                                display: 'flex', flexDirection: 'column',

                                // 
                            }}>
                                {lang === 'EN' ? 'Create Account' : 'Créer un compte'}
                            </h2>
                        </div>
                        <p style={{
                            color: '#64748b', fontSize: '0.87rem', margin: 0, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                        }}>
                            {lang === 'EN'
                                ? 'Join AnasHealthcare now and safe lives'
                                : "Rejoignez AnasHealthcare et sauvez des vies"}
                        </p>
                    </div>

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
                        <div style={{ marginBottom: '0.9rem' }}>
                            <label style={labelStyle}>
                                {lang === 'EN' ? 'Username' : "Nom d'utilisateur"}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconWrapStyle}><FaUser size={14} /></div>
                                <input
                                    type="text" name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder={lang === 'EN' ? 'Choose a username' : "Choisissez un nom d'utilisateur"}
                                    required style={inputStyle}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '0.9rem' }}>
                            <label style={labelStyle}>
                                {lang === 'EN' ? 'Email address' : 'Adresse email'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconWrapStyle}><FaEnvelope size={14} /></div>
                                <input
                                    type="email" name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={lang === 'EN' ? 'Enter your email' : 'Entrez votre email'}
                                    required style={inputStyle}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '0.9rem' }}>
                            <label style={labelStyle}>
                                {lang === 'EN' ? 'Password' : 'Mot de passe'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconWrapStyle}><FaLock size={14} /></div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={lang === 'EN' ? 'Create a strong password' : 'Créez un mot de passe fort'}
                                    required
                                    style={{ ...inputStyle, paddingRight: '3rem' }}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                                <button type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', color: '#64748b', padding: 0
                                    }}>
                                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '0.9rem' }}>
                            <label style={labelStyle}>
                                {lang === 'EN' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconWrapStyle}><FaLock size={14} /></div>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder={lang === 'EN' ? 'Confirm your password' : 'Confirmez votre mot de passe'}
                                    required
                                    style={{ ...inputStyle, paddingRight: '3rem' }}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                                <button type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', color: '#64748b', padding: 0
                                    }}>
                                    {showConfirm ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Role — clean dropdown scroll */}
                        <div style={{ marginBottom: '1.3rem' }}>
                            <label style={labelStyle}>
                                {lang === 'EN' ? 'Role' : 'Rôle'}
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={iconWrapStyle}>
                                    <FaUserMd size={14} />
                                </div>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 2.5rem 0.8rem 2.8rem',
                                        border: '1.5px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '0.9rem', outline: 'none',
                                        transition: '0.2s', boxSizing: 'border-box',
                                        fontFamily: "'Inter', sans-serif",
                                        color: '#1e293b', background: '#f8fafc',
                                        cursor: 'pointer',
                                        appearance: 'none',
                                        WebkitAppearance: 'none',
                                    }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}>
                                    <option value="user">
                                        {lang === 'EN' ? '👤 Patient / User' : '👤 Patient / Utilisateur'}
                                    </option>
                                    <option value="doctor">
                                        {lang === 'EN' ? '👨‍⚕️ Doctor' : '👨‍⚕️ Médecin'}
                                    </option>
                                </select>
                                <div style={{
                                    position: 'absolute', right: '14px', top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#64748b', pointerEvents: 'none',
                                    fontSize: '0.7rem'
                                }}>▼</div>
                            </div>
                        </div>
                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.9rem',
                                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #198754, #20c997)',
                                color: 'white', border: 'none',
                                borderRadius: '12px', fontSize: '1rem',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: '8px',
                                boxShadow: loading ? 'none' : '0 8px 25px rgba(25,135,84,0.35)',
                                transition: '0.2s',
                                fontFamily: "'Inter', sans-serif"
                            }}>
                            {loading
                                ? (lang === 'EN' ? 'Creating account...' : 'Création du compte...')
                                : (lang === 'EN' ? 'Create My Account' : 'Créer mon compte')
                            }
                            {!loading && <FaArrowRight size={14} />}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.2rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Already have an account?' : 'Vous avez déjà un compte?'}
                        </span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </div>

                    {/* Sign in link */}
                    <Link to="/login" style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px',
                        width: '100%', padding: '0.85rem',
                        border: '1.5px solid #0d6efd', color: '#0d6efd',
                        borderRadius: '12px', fontSize: '0.95rem',
                        fontWeight: 600, textDecoration: 'none',
                        boxSizing: 'border-box', transition: '0.2s'
                    }}>
                        {lang === 'EN' ? 'Sign In Instead' : 'Se connecter'}
                    </Link>

                    {/* Back to home */}
                    <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                        <Link to="/" style={{
                            color: '#64748b', fontSize: '0.85rem',
                            textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: '4px'
                        }}>
                            ← {lang === 'EN' ? 'Back to Home' : "Retour à l'accueil"}
                        </Link>
                    </div>

                    {/* Security note */}
                    {/* <div style={{
                        marginTop: '1.2rem', padding: '0.75rem 1rem',
                        background: '#f0fdf4', borderRadius: '10px',
                        border: '1px solid #bbf7d0',
                        display: 'flex', alignItems: 'flex-start', gap: '8px'
                    }}> */}
                    {/* <FaHeartbeat color="#198754" size={13} style={{ marginTop: '2px', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.77rem', color: '#166534', lineHeight: 1.5 }}>
                            {lang === 'EN'
                                ? 'Your health data is protected with JWT encryption and never shared with third parties.'
                                : 'Vos données de santé sont protégées par chiffrement JWT et jamais partagées avec des tiers.'}
                        </p> */}
                    {/* </div> */}
                </motion.div>
            </div>
        </div>
    );
};

export default Register;