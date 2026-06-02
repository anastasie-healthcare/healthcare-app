import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaHeartbeat, FaAmbulance, FaUserMd,
    FaRobot, FaUser, FaBell, FaSignOutAlt,
    FaChevronRight, FaSearch, FaFileMedical,
    FaNotesMedical, FaStethoscope, FaCapsules
} from 'react-icons/fa';
import {
    MdDashboard, MdLocalHospital,
    MdHealthAndSafety, MdMedication,
    MdOutlineEmergency, MdPsychology
} from 'react-icons/md';
import { RiMentalHealthLine, RiHospitalLine } from 'react-icons/ri';
import { GiMedicalPack } from 'react-icons/gi';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('EN');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Dashboard' : 'Tableau de bord', color: '#6366f1' },
        { id: 'emergency', icon: <FaAmbulance size={18} />, label: lang === 'EN' ? 'Emergency Steps' : "Étapes d'urgence", color: '#ef4444' },
        { id: 'drugs', icon: <FaCapsules size={18} />, label: lang === 'EN' ? 'Drug Information' : 'Médicaments', color: '#10b981' },
        { id: 'consultation', icon: <FaStethoscope size={18} />, label: lang === 'EN' ? 'Consult a Doctor' : 'Consulter un Médecin', color: '#3b82f6' },
        { id: 'ai', icon: <MdPsychology size={22} />, label: lang === 'EN' ? 'AI Health Assistant' : 'Assistant IA Santé', color: '#8b5cf6' },
        { id: 'education', icon: <FaNotesMedical size={18} />, label: lang === 'EN' ? 'Health Education' : 'Éducation Sanitaire', color: '#f59e0b' },
        { id: 'profile', icon: <FaUser size={18} />, label: lang === 'EN' ? 'My Profile' : 'Mon Profil', color: '#14b8a6' },
    ];

    const quickStats = [
        {
            icon: <FaAmbulance size={26} />,
            bg: 'linear-gradient(135deg, #ef4444, #f97316)',
            label: lang === 'EN' ? 'Emergency Guidance' : "Guide d'urgence",
            value: '24/7',
            desc: lang === 'EN' ? 'Always available offline' : 'Toujours disponible hors ligne',
            shadow: 'rgba(239,68,68,0.3)'
        },
        {
            icon: <FaCapsules size={26} />,
            bg: 'linear-gradient(135deg, #10b981, #34d399)',
            label: lang === 'EN' ? 'Drug Database' : 'Base Médicaments',
            value: lang === 'EN' ? 'Search' : 'Chercher',
            desc: lang === 'EN' ? 'Dosages & precautions' : 'Dosages et précautions',
            shadow: 'rgba(16,185,129,0.3)'
        },
        {
            icon: <FaStethoscope size={26} />,
            bg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            label: lang === 'EN' ? 'Verified Doctors' : 'Médecins Vérifiés',
            value: lang === 'EN' ? 'Connect' : 'Connecter',
            desc: lang === 'EN' ? 'Admin verified professionals' : 'Professionnels vérifiés',
            shadow: 'rgba(59,130,246,0.3)'
        },
        {
            icon: <MdPsychology size={30} />,
            bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            label: lang === 'EN' ? 'AI Assistant' : 'Assistant IA',
            value: 'AI',
            desc: lang === 'EN' ? 'Daily health tips' : 'Conseils santé quotidiens',
            shadow: 'rgba(139,92,246,0.3)'
        },
    ];

    const quickActions = [
        { icon: <FaAmbulance size={20} />, color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: lang === 'EN' ? 'View Emergency First Aid Steps' : "Voir les étapes de premiers secours", id: 'emergency' },
        { icon: <FaCapsules size={20} />, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', label: lang === 'EN' ? 'Search Drug Information & Dosages' : 'Rechercher médicaments et dosages', id: 'drugs' },
        { icon: <FaStethoscope size={20} />, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: lang === 'EN' ? 'Request a Doctor Consultation' : 'Demander une consultation médicale', id: 'consultation' },
        { icon: <MdPsychology size={22} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', label: lang === 'EN' ? 'Chat with AI Health Assistant' : "Discuter avec l'assistant IA santé", id: 'ai' },
        { icon: <FaNotesMedical size={20} />, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: lang === 'EN' ? 'Browse Health Education Articles' : "Parcourir les articles d'éducation santé", id: 'education' },
    ];

    const recentActivities = [
        { icon: <FaAmbulance size={14} />, color: '#ef4444', bg: '#fef2f2', text: lang === 'EN' ? 'Viewed emergency steps for high fever' : "Consulté les étapes d'urgence pour la fièvre", time: lang === 'EN' ? '2 hours ago' : 'Il y a 2 heures' },
        { icon: <FaCapsules size={14} />, color: '#10b981', bg: '#f0fdf4', text: lang === 'EN' ? 'Searched Paracetamol — dosage and uses' : 'Recherché Paracétamol — dosage et utilisations', time: lang === 'EN' ? '5 hours ago' : 'Il y a 5 heures' },
        { icon: <FaStethoscope size={14} />, color: '#3b82f6', bg: '#eff6ff', text: lang === 'EN' ? 'Consultation request sent to Dr. Mbeki' : 'Demande envoyée au Dr. Mbeki', time: lang === 'EN' ? '1 day ago' : 'Il y a 1 jour' },
        { icon: <MdPsychology size={16} />, color: '#8b5cf6', bg: '#f5f3ff', text: lang === 'EN' ? 'Asked AI about malaria prevention tips' : "Demandé à l'IA des conseils sur la prévention du paludisme", time: lang === 'EN' ? '2 days ago' : 'Il y a 2 jours' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>

            {/* ===== SIDEBAR — clean white professional ===== */}
            <div style={{
                width: '260px', flexShrink: 0,
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column',
                position: 'fixed', top: 0, left: 0,
                height: '100vh', zIndex: 100,
                boxShadow: '2px 0 12px rgba(0,0,0,0.06)'
            }}>
                {/* Logo */}
                <div style={{
                    padding: '1.4rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, #6366f1, #10b981)',
                        borderRadius: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.35)'
                    }}>
                        <MdLocalHospital size={22} color="white" />
                    </div>
                    <div>
                        <div style={{
                            fontWeight: 800, fontSize: '0.92rem',
                            background: 'linear-gradient(135deg, #6366f1, #10b981)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            AnasHealthcare
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Patient Portal' : 'Portail Patient'}
                        </div>
                    </div>
                </div>

                {/* User info */}
                <div style={{
                    padding: '1.2rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', gap: '11px'
                }}>
                    <div style={{
                        width: '42px', height: '42px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 3px 10px rgba(99,102,241,0.3)'
                    }}>
                        <FaUser size={16} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                            {user?.username || 'User'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '3px' }}>
                            {user?.email || ''}
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '20px', padding: '1px 8px',
                            fontSize: '0.6rem', color: '#10b981', fontWeight: 700
                        }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                            {lang === 'EN' ? 'Patient' : 'Patient'}
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
                    <p style={{
                        fontSize: '0.62rem', color: '#94a3b8',
                        fontWeight: 700, letterSpacing: '0.1em',
                        textTransform: 'uppercase', padding: '0 0.75rem',
                        marginBottom: '0.5rem', marginTop: 0
                    }}>
                        {lang === 'EN' ? 'Main Menu' : 'Menu Principal'}
                    </p>
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '11px',
                                padding: '0.68rem 0.85rem',
                                cursor: 'pointer',
                                background: activeMenu === item.id ? `${item.color}12` : 'transparent',
                                borderRadius: '10px', marginBottom: '2px',
                                borderLeft: activeMenu === item.id ? `3px solid ${item.color}` : '3px solid transparent',
                                transition: 'all 0.15s'
                            }}>
                            <span style={{ color: activeMenu === item.id ? item.color : '#94a3b8', display: 'flex' }}>
                                {item.icon}
                            </span>
                            <span style={{
                                fontSize: '0.87rem',
                                fontWeight: activeMenu === item.id ? 700 : 500,
                                color: activeMenu === item.id ? item.color : '#475569'
                            }}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', padding: '0.75rem',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '10px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px',
                            color: '#ef4444', fontWeight: 600,
                            fontSize: '0.87rem', transition: 'all 0.2s',
                            fontFamily: "'Inter', sans-serif"
                        }}>
                        <FaSignOutAlt size={14} />
                        {lang === 'EN' ? 'Logout' : 'Déconnexion'}
                    </button>
                </div>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div style={{ marginLeft: '260px', flex: 1 }}>

                {/* Top header */}
                <div style={{
                    background: 'white',
                    padding: '1rem 2rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 50,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
                }}>
                    <div>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                            {lang === 'EN' ? `Good day, ${user?.username || 'User'} 👋` : `Bonjour, ${user?.username || 'User'} 👋`}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.15rem 0 0' }}>
                            {lang === 'EN' ? 'Welcome to your personal health dashboard' : 'Bienvenue sur votre tableau de bord santé personnel'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch size={13} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder={lang === 'EN' ? 'Search health info...' : 'Rechercher...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '0.58rem 1rem 0.58rem 2.2rem',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: '9px', fontSize: '0.83rem',
                                    outline: 'none', width: '190px',
                                    fontFamily: "'Inter', sans-serif",
                                    background: '#f8fafc', color: '#0f172a'
                                }}
                            />
                        </div>
                        <div style={{
                            width: '38px', height: '38px',
                            background: '#f8fafc', borderRadius: '9px',
                            border: '1.5px solid #e2e8f0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', position: 'relative'
                        }}>
                            <FaBell size={15} color="#475569" />
                            <div style={{
                                position: 'absolute', top: '6px', right: '6px',
                                width: '8px', height: '8px',
                                background: '#ef4444', borderRadius: '50%',
                                border: '2px solid white'
                            }} />
                        </div>
                        <button
                            onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')}
                            style={{
                                background: 'transparent',
                                border: '1.5px solid #6366f1',
                                color: '#6366f1', borderRadius: '40px',
                                padding: '0.36rem 0.9rem', fontWeight: 700,
                                cursor: 'pointer', fontSize: '0.82rem'
                            }}>
                            {lang === 'EN' ? 'FR' : 'EN'}
                        </button>
                    </div>
                </div>

                <div style={{ padding: '1.6rem 2rem' }}>

                    {/* Hero banner */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #065f46 100%)',
                        borderRadius: '16px', padding: '1.8rem 2rem',
                        marginBottom: '1.6rem', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '-25px', right: '160px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.2rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.5rem' }}>
                                    <FaHeartbeat color="#f87171" size={15} />
                                    <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', fontWeight: 500 }}>
                                        {lang === 'EN' ? 'AnasHealthcare Patient Portal' : 'Portail Patient AnasHealthcare'}
                                    </span>
                                </div>
                                <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                                    {lang === 'EN' ? 'How are you feeling today?' : "Comment vous sentez-vous aujourd'hui?"}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                                    {lang === 'EN'
                                        ? 'Access emergency guidance, consult verified doctors, or ask our AI health assistant anytime.'
                                        : "Accédez aux conseils d'urgence, consultez des médecins vérifiés ou posez des questions à notre assistant IA."}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setActiveMenu('emergency')} style={{
                                    padding: '0.7rem 1.3rem',
                                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem',
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    boxShadow: '0 5px 15px rgba(239,68,68,0.4)',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    <FaAmbulance size={14} />
                                    {lang === 'EN' ? 'Emergency' : 'Urgence'}
                                </button>
                                <button onClick={() => setActiveMenu('ai')} style={{
                                    padding: '0.7rem 1.3rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white', border: '1.5px solid rgba(255,255,255,0.18)',
                                    borderRadius: '10px', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.86rem',
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    <MdPsychology size={17} />
                                    {lang === 'EN' ? 'Ask AI' : "Demander à l'IA"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.1rem', marginBottom: '1.6rem'
                    }}>
                        {quickStats.map((stat, i) => (
                            <div key={i} style={{
                                background: stat.bg,
                                borderRadius: '14px', padding: '1.3rem',
                                boxShadow: `0 5px 18px ${stat.shadow}`,
                                cursor: 'pointer', position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.65rem' }}>{stat.icon}</div>
                                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', marginBottom: '0.12rem' }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '0.12rem' }}>{stat.label}</div>
                                    <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.68)' }}>{stat.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Two columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.4rem', marginBottom: '1.6rem' }}>

                        {/* Quick actions */}
                        <div style={{
                            background: 'white', borderRadius: '16px',
                            padding: '1.5rem', border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                        }}>
                            <h3 style={{
                                fontSize: '0.95rem', fontWeight: 800, color: '#0f172a',
                                marginBottom: '1.1rem', marginTop: 0,
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #6366f1, #10b981)', borderRadius: '2px' }} />
                                {lang === 'EN' ? 'Quick Actions' : 'Actions Rapides'}
                            </h3>
                            {quickActions.map((action, i) => (
                                <div key={i} onClick={() => setActiveMenu(action.id)} style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.85rem 1rem',
                                    background: action.bg,
                                    border: `1px solid ${action.border}`,
                                    borderRadius: '11px', marginBottom: '0.55rem',
                                    cursor: 'pointer', transition: 'all 0.15s'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', background: 'white',
                                            borderRadius: '9px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 1px 6px rgba(0,0,0,0.07)'
                                        }}>
                                            <span style={{ color: action.color }}>{action.icon}</span>
                                        </div>
                                        <span style={{ fontSize: '0.87rem', fontWeight: 600, color: '#0f172a' }}>
                                            {action.label}
                                        </span>
                                    </div>
                                    <FaChevronRight size={11} color="#cbd5e1" />
                                </div>
                            ))}
                        </div>

                        {/* Right column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                            {/* Health tip */}
                            <div style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                borderRadius: '16px', padding: '1.3rem',
                                boxShadow: '0 5px 18px rgba(99,102,241,0.3)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '0.65rem' }}>
                                    <FaHeartbeat color="rgba(255,255,255,0.75)" size={14} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {lang === 'EN' ? "Today's Health Tip" : "Conseil du Jour"}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: 'white', lineHeight: 1.7, fontWeight: 500 }}>
                                    {lang === 'EN'
                                        ? "💧 Drink at least 1.5L of water daily — especially important in Cameroon's warm climate."
                                        : "💧 Buvez au moins 1,5L d'eau par jour — important dans le climat chaud du Cameroun."}
                                </p>
                            </div>

                            {/* Recent activity */}
                            <div style={{
                                background: 'white', borderRadius: '16px',
                                padding: '1.3rem', border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)', flex: 1
                            }}>
                                <h3 style={{
                                    fontSize: '0.92rem', fontWeight: 800, color: '#0f172a',
                                    marginBottom: '0.9rem', marginTop: 0,
                                    display: 'flex', alignItems: 'center', gap: '7px'
                                }}>
                                    <div style={{ width: '3px', height: '15px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', borderRadius: '2px' }} />
                                    {lang === 'EN' ? 'Recent Activity' : 'Activité Récente'}
                                </h3>
                                {recentActivities.map((activity, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: '9px',
                                        padding: '0.5rem 0',
                                        borderBottom: i < recentActivities.length - 1 ? '1px solid #f8fafc' : 'none'
                                    }}>
                                        <div style={{
                                            width: '28px', height: '28px',
                                            background: activity.bg, borderRadius: '7px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <span style={{ color: activity.color }}>{activity.icon}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.5 }}>
                                                {activity.text}
                                            </p>
                                            <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500 }}>
                                                {activity.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Health Notifications */}
                    <div style={{
                        background: 'white', borderRadius: '16px',
                        padding: '1.5rem', border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                    }}>
                        <h3 style={{
                            fontSize: '0.95rem', fontWeight: 800, color: '#0f172a',
                            marginBottom: '1.2rem', marginTop: 0,
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: '2px' }} />
                            {lang === 'EN' ? 'Health Reminders & Notifications' : 'Rappels Santé & Notifications'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                            {[
                                {
                                    icon: <FaAmbulance size={18} />, color: '#ef4444', bg: '#fef2f2', border: '#fecaca',
                                    title: lang === 'EN' ? '🚨 Emergency Reminder' : '🚨 Rappel Urgence',
                                    desc: lang === 'EN' ? 'Save emergency contacts and first aid steps for offline access.' : "Sauvegardez les contacts d'urgence et les étapes de premiers secours hors ligne."
                                },
                                {
                                    icon: <FaCapsules size={18} />, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0',
                                    title: lang === 'EN' ? '💊 Medication Tip' : '💊 Conseil Médicament',
                                    desc: lang === 'EN' ? 'Never take medications without checking dosage and precautions first.' : 'Ne prenez jamais de médicaments sans vérifier le dosage et les précautions.'
                                },
                                {
                                    icon: <MdPsychology size={20} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
                                    title: lang === 'EN' ? '🤖 AI Health Tip' : '🤖 Conseil IA Santé',
                                    desc: lang === 'EN' ? 'Ask our AI assistant about malaria prevention during the rainy season in Cameroon.' : "Demandez à notre assistant IA des conseils sur la prévention du paludisme."
                                },
                            ].map((notif, i) => (
                                <div key={i} style={{
                                    background: notif.bg,
                                    border: `1px solid ${notif.border}`,
                                    borderRadius: '12px', padding: '1rem 1.1rem',
                                    display: 'flex', alignItems: 'flex-start', gap: '10px'
                                }}>
                                    <div style={{
                                        width: '36px', height: '36px', background: 'white',
                                        borderRadius: '9px', flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 1px 6px rgba(0,0,0,0.06)'
                                    }}>
                                        <span style={{ color: notif.color }}>{notif.icon}</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>
                                            {notif.title}
                                        </div>
                                        <div style={{ fontSize: '0.77rem', color: '#475569', lineHeight: 1.5 }}>
                                            {notif.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;