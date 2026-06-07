import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserMd, FaUser, FaBell, FaSignOutAlt,
    FaChevronRight, FaSearch, FaStethoscope,
    FaCapsules, FaCheckCircle, FaTimesCircle,
    FaClock, FaComments, FaCalendarAlt,
    FaFileMedical, FaToggleOn, FaToggleOff
} from 'react-icons/fa';
import {
    MdDashboard, MdLocalHospital,
    MdHealthAndSafety, MdPsychology,
    MdOutlineTipsAndUpdates, MdPendingActions
} from 'react-icons/md';
import { RiMentalHealthFill } from 'react-icons/ri';

const DoctorDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('EN');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'doctor') {
            navigate('/user/dashboard');
            return;
        }
        setUser(parsedUser);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Dashboard' : 'Tableau de bord', color: '#0d6efd' },
        { id: 'requests', icon: <MdPendingActions size={22} />, label: lang === 'EN' ? 'Consultation Requests' : 'Demandes de Consultation', color: '#ef4444', badge: 3 },
        { id: 'chats', icon: <FaComments size={18} />, label: lang === 'EN' ? 'Patient Chats' : 'Discussions Patients', color: '#10b981', badge: 2 },
        { id: 'appointments', icon: <FaCalendarAlt size={18} />, label: lang === 'EN' ? 'Appointments' : 'Rendez-vous', color: '#f59e0b' },
        { id: 'records', icon: <FaFileMedical size={18} />, label: lang === 'EN' ? 'Medical Records' : 'Dossiers Médicaux', color: '#8b5cf6' },
        { id: 'profile', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'My Profile' : 'Mon Profil', color: '#14b8a6' },
    ];

    const stats = [
        {
            icon: <MdPendingActions size={26} />,
            bg: 'linear-gradient(135deg, #ef4444, #f97316)',
            label: lang === 'EN' ? 'Pending Requests' : 'Demandes en attente',
            value: '3',
            desc: lang === 'EN' ? 'Awaiting your response' : 'En attente de votre réponse',
            shadow: 'rgba(239,68,68,0.3)'
        },
        {
            icon: <FaComments size={24} />,
            bg: 'linear-gradient(135deg, #10b981, #34d399)',
            label: lang === 'EN' ? 'Active Chats' : 'Discussions Actives',
            value: '2',
            desc: lang === 'EN' ? 'Ongoing consultations' : 'Consultations en cours',
            shadow: 'rgba(16,185,129,0.3)'
        },
        {
            icon: <FaCalendarAlt size={24} />,
            bg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            label: lang === 'EN' ? 'Today\'s Appointments' : 'Rendez-vous du jour',
            value: '5',
            desc: lang === 'EN' ? 'Scheduled for today' : 'Programmés pour aujourd\'hui',
            shadow: 'rgba(59,130,246,0.3)'
        },
        {
            icon: <FaCheckCircle size={24} />,
            bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            label: lang === 'EN' ? 'Completed' : 'Complétées',
            value: '28',
            desc: lang === 'EN' ? 'Total consultations' : 'Consultations totales',
            shadow: 'rgba(139,92,246,0.3)'
        },
    ];

    const consultationRequests = [
        {
            name: 'Marie Nguemo',
            age: 34,
            issue: lang === 'EN' ? 'High fever and headache for 3 days' : 'Fièvre élevée et maux de tête depuis 3 jours',
            time: lang === 'EN' ? '10 minutes ago' : 'Il y a 10 minutes',
            urgency: 'high',
            avatar: 'MN'
        },
        {
            name: 'Paul Biya Jr.',
            age: 45,
            issue: lang === 'EN' ? 'Chest pain and shortness of breath' : 'Douleur thoracique et essoufflement',
            time: lang === 'EN' ? '25 minutes ago' : 'Il y a 25 minutes',
            urgency: 'high',
            avatar: 'PB'
        },
        {
            name: 'Fatima Oumarou',
            age: 28,
            issue: lang === 'EN' ? 'Malaria symptoms — need prescription' : 'Symptômes de paludisme — besoin d\'ordonnance',
            time: lang === 'EN' ? '1 hour ago' : 'Il y a 1 heure',
            urgency: 'medium',
            avatar: 'FO'
        },
    ];

    const activeChats = [
        {
            name: 'Jean Kamga',
            lastMessage: lang === 'EN' ? 'Thank you doctor, I will take the medication' : 'Merci docteur, je vais prendre le médicament',
            time: lang === 'EN' ? '5 min ago' : 'Il y a 5 min',
            unread: 0,
            avatar: 'JK',
            color: '#10b981'
        },
        {
            name: 'Sylvie Mballa',
            lastMessage: lang === 'EN' ? 'Doctor, my condition is getting worse' : 'Docteur, mon état s\'aggrave',
            time: lang === 'EN' ? '12 min ago' : 'Il y a 12 min',
            unread: 2,
            avatar: 'SM',
            color: '#ef4444'
        },
    ];

    const urgencyColor = (urgency) => {
        if (urgency === 'high') return { bg: '#fef2f2', border: '#fecaca', text: '#ef4444', label: lang === 'EN' ? 'Urgent' : 'Urgent' };
        if (urgency === 'medium') return { bg: '#fffbeb', border: '#fde68a', text: '#f59e0b', label: lang === 'EN' ? 'Moderate' : 'Modéré' };
        return { bg: '#f0fdf4', border: '#bbf7d0', text: '#10b981', label: lang === 'EN' ? 'Normal' : 'Normal' };
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>

            {/* ===== SIDEBAR ===== */}
            <div style={{
                width: '265px', flexShrink: 0,
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
                        background: 'linear-gradient(135deg, #0d6efd, #10b981)',
                        borderRadius: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(13,110,253,0.35)'
                    }}>
                        <MdLocalHospital size={22} color="white" />
                    </div>
                    <div>
                        <div style={{
                            fontWeight: 800, fontSize: '0.92rem',
                            background: 'linear-gradient(135deg, #0d6efd, #10b981)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            AnasHealthcare
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Doctor Portal' : 'Portail Médecin'}
                        </div>
                    </div>
                </div>

                {/* Doctor info */}
                <div style={{
                    padding: '1.2rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '0.8rem' }}>
                        <div style={{
                            width: '44px', height: '44px',
                            background: 'linear-gradient(135deg, #0d6efd, #3b82f6)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 3px 10px rgba(13,110,253,0.3)'
                        }}>
                            <FaUserMd size={18} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                                Dr. {user?.username || 'Doctor'}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '3px' }}>
                                {user?.email || ''}
                            </div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                background: '#eff6ff', border: '1px solid #bfdbfe',
                                borderRadius: '20px', padding: '1px 8px',
                                fontSize: '0.6rem', color: '#0d6efd', fontWeight: 700
                            }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0d6efd' }} />
                                {lang === 'EN' ? 'Verified Doctor' : 'Médecin Vérifié'}
                            </div>
                        </div>
                    </div>

                    {/* Availability toggle */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: isAvailable ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${isAvailable ? '#bbf7d0' : '#fecaca'}`,
                        borderRadius: '10px', padding: '0.6rem 0.8rem'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isAvailable ? '#10b981' : '#ef4444' }}>
                                {isAvailable
                                    ? (lang === 'EN' ? 'Available' : 'Disponible')
                                    : (lang === 'EN' ? 'Unavailable' : 'Indisponible')}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                                {lang === 'EN' ? 'Toggle availability' : 'Changer disponibilité'}
                            </div>
                        </div>
                        <div
                            onClick={() => setIsAvailable(!isAvailable)}
                            style={{ cursor: 'pointer', color: isAvailable ? '#10b981' : '#ef4444' }}>
                            {isAvailable
                                ? <FaToggleOn size={28} />
                                : <FaToggleOff size={28} />}
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto' }}>
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
                                flex: 1, fontSize: '0.87rem',
                                fontWeight: activeMenu === item.id ? 700 : 500,
                                color: activeMenu === item.id ? item.color : '#475569'
                            }}>
                                {item.label}
                            </span>
                            {item.badge && (
                                <div style={{
                                    background: item.color, color: 'white',
                                    borderRadius: '20px', padding: '1px 7px',
                                    fontSize: '0.65rem', fontWeight: 700
                                }}>
                                    {item.badge}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleLogout} style={{
                        width: '100%', padding: '0.75rem',
                        background: '#fef2f2', border: '1px solid #fecaca',
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
            <div style={{ marginLeft: '265px', flex: 1 }}>

                {/* Top header */}
                <div style={{
                    background: 'white', padding: '1rem 2rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky', top: 0, zIndex: 50,
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '42px', height: '42px',
                            background: 'linear-gradient(135deg, #0d6efd, #3b82f6)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 3px 10px rgba(13,110,253,0.3)'
                        }}>
                            <FaStethoscope size={20} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                {lang === 'EN'
                                    ? `Good day, Dr. ${user?.username || 'Doctor'}`
                                    : `Bonjour, Dr. ${user?.username || 'Doctor'}`}
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.1rem 0 0' }}>
                                {lang === 'EN' ? 'Manage your consultations and patient requests' : 'Gérez vos consultations et demandes de patients'}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch size={13} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder={lang === 'EN' ? 'Search patients...' : 'Rechercher patients...'}
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
                                border: '1.5px solid #0d6efd',
                                color: '#0d6efd', borderRadius: '40px',
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
                        background: 'linear-gradient(135deg, #0c1445 0%, #1e3a5f 50%, #064e3b 100%)',
                        borderRadius: '16px', padding: '1.8rem 2rem',
                        marginBottom: '1.6rem', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(13,110,253,0.15)', pointerEvents: 'none' }} />
                        <div style={{ position: 'absolute', bottom: '-25px', right: '160px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.2rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                    <div style={{
                                        width: '24px', height: '24px',
                                        background: 'rgba(255,255,255,0.12)',
                                        borderRadius: '6px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <FaStethoscope color="#93c5fd" size={14} />
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>
                                        {lang === 'EN' ? 'Doctor Portal — AnasHealthcare' : 'Portail Médecin — AnasHealthcare'}
                                    </span>
                                </div>
                                <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                                    {lang === 'EN' ? 'You have 3 pending consultation requests' : 'Vous avez 3 demandes de consultation en attente'}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                                    {lang === 'EN'
                                        ? 'Review patient requests, manage your chats and update your availability status.'
                                        : 'Examinez les demandes des patients, gérez vos discussions et mettez à jour votre disponibilité.'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setActiveMenu('requests')} style={{
                                    padding: '0.7rem 1.3rem',
                                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem',
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    boxShadow: '0 5px 15px rgba(239,68,68,0.4)',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    <MdPendingActions size={16} />
                                    {lang === 'EN' ? 'View Requests' : 'Voir Demandes'}
                                </button>
                                <button onClick={() => setActiveMenu('chats')} style={{
                                    padding: '0.7rem 1.3rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white', border: '1.5px solid rgba(255,255,255,0.18)',
                                    borderRadius: '10px', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.86rem',
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    <FaComments size={15} />
                                    {lang === 'EN' ? 'Open Chats' : 'Ouvrir Discussions'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.1rem', marginBottom: '1.6rem'
                    }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{
                                background: stat.bg, borderRadius: '14px', padding: '1.3rem',
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.4rem' }}>

                        {/* Consultation Requests */}
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
                                <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: '2px' }} />
                                {lang === 'EN' ? 'Consultation Requests' : 'Demandes de Consultation'}
                                <div style={{
                                    background: '#ef4444', color: 'white',
                                    borderRadius: '20px', padding: '1px 8px',
                                    fontSize: '0.65rem', fontWeight: 700, marginLeft: 'auto'
                                }}>3</div>
                            </h3>
                            {consultationRequests.map((req, i) => {
                                const urgency = urgencyColor(req.urgency);
                                return (
                                    <div key={i} style={{
                                        border: `1px solid ${urgency.border}`,
                                        background: urgency.bg,
                                        borderRadius: '12px', padding: '1rem',
                                        marginBottom: '0.7rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '38px', height: '38px',
                                                    background: 'linear-gradient(135deg, #0d6efd, #6366f1)',
                                                    borderRadius: '50%',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.75rem', fontWeight: 700, color: 'white'
                                                }}>
                                                    {req.avatar}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.87rem', color: '#0f172a' }}>{req.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                                        {lang === 'EN' ? `Age ${req.age}` : `${req.age} ans`} • {req.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{
                                                background: urgency.bg, border: `1px solid ${urgency.border}`,
                                                color: urgency.text, borderRadius: '20px',
                                                padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700
                                            }}>
                                                {urgency.label}
                                            </div>
                                        </div>
                                        <p style={{ margin: '0 0 0.8rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                                            {req.issue}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                                            <button style={{
                                                flex: 1, padding: '0.5rem',
                                                background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                color: 'white', border: 'none',
                                                borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.78rem', fontWeight: 700,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                fontFamily: "'Inter', sans-serif",
                                                boxShadow: '0 3px 10px rgba(16,185,129,0.3)'
                                            }}>
                                                <FaCheckCircle size={12} />
                                                {lang === 'EN' ? 'Accept' : 'Accepter'}
                                            </button>
                                            <button style={{
                                                flex: 1, padding: '0.5rem',
                                                background: 'white',
                                                color: '#ef4444',
                                                border: '1px solid #fecaca',
                                                borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.78rem', fontWeight: 700,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                fontFamily: "'Inter', sans-serif"
                                            }}>
                                                <FaTimesCircle size={12} />
                                                {lang === 'EN' ? 'Decline' : 'Refuser'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                            {/* Active chats */}
                            <div style={{
                                background: 'white', borderRadius: '16px',
                                padding: '1.3rem', border: '1px solid #e2e8f0',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                            }}>
                                <h3 style={{
                                    fontSize: '0.92rem', fontWeight: 800, color: '#0f172a',
                                    marginBottom: '1rem', marginTop: 0,
                                    display: 'flex', alignItems: 'center', gap: '7px'
                                }}>
                                    <div style={{ width: '3px', height: '15px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '2px' }} />
                                    {lang === 'EN' ? 'Active Patient Chats' : 'Discussions Patients Actives'}
                                </h3>
                                {activeChats.map((chat, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '0.75rem',
                                        background: '#f8fafc',
                                        borderRadius: '11px', marginBottom: '0.6rem',
                                        cursor: 'pointer', border: '1px solid #e2e8f0'
                                    }}>
                                        <div style={{
                                            width: '38px', height: '38px',
                                            background: `linear-gradient(135deg, ${chat.color}, ${chat.color}99)`,
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.72rem', fontWeight: 700, color: 'white',
                                            flexShrink: 0
                                        }}>
                                            {chat.avatar}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{chat.name}</span>
                                                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{chat.time}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {chat.lastMessage}
                                            </div>
                                        </div>
                                        {chat.unread > 0 && (
                                            <div style={{
                                                background: '#ef4444', color: 'white',
                                                borderRadius: '50%', width: '18px', height: '18px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.6rem', fontWeight: 700, flexShrink: 0
                                            }}>
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button onClick={() => setActiveMenu('chats')} style={{
                                    width: '100%', padding: '0.65rem',
                                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                                    color: 'white', border: 'none',
                                    borderRadius: '10px', cursor: 'pointer',
                                    fontSize: '0.82rem', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    fontFamily: "'Inter', sans-serif",
                                    boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                                }}>
                                    <FaComments size={13} />
                                    {lang === 'EN' ? 'View All Chats' : 'Voir Toutes les Discussions'}
                                </button>
                            </div>

                            {/* Daily tip for doctor */}
                            <div style={{
                                background: 'linear-gradient(135deg, #0d6efd, #3b82f6)',
                                borderRadius: '16px', padding: '1.3rem',
                                boxShadow: '0 5px 18px rgba(13,110,253,0.3)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.65rem' }}>
                                    <div style={{
                                        width: '26px', height: '26px',
                                        background: 'rgba(255,255,255,0.15)',
                                        borderRadius: '7px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <MdOutlineTipsAndUpdates color="white" size={16} />
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                        {lang === 'EN' ? 'Medical Reminder' : 'Rappel Médical'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.87rem', color: 'white', lineHeight: 1.7, fontWeight: 500 }}>
                                    {lang === 'EN'
                                        ? 'Malaria cases are rising in Douala this season. Remind patients to use treated mosquito nets and seek care early.'
                                        : 'Les cas de paludisme augmentent à Douala cette saison. Rappeler aux patients d\'utiliser des moustiquaires traitées.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;