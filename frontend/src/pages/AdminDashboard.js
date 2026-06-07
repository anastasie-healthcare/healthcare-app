import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserMd, FaUser, FaBell, FaSignOutAlt,
    FaSearch, FaCheckCircle, FaTimesCircle,
    FaUsers, FaUserCheck, FaUserTimes,
    FaChartBar, FaShieldAlt, FaCog,
    FaTrash, FaEdit, FaEye
} from 'react-icons/fa';
import {
    MdDashboard, MdLocalHospital,
    MdHealthAndSafety, MdAdminPanelSettings,
    MdVerified, MdPendingActions
} from 'react-icons/md';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('EN');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') {
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
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Dashboard' : 'Tableau de bord', color: '#6366f1' },
        { id: 'doctors', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'Manage Doctors' : 'Gérer Médecins', color: '#0d6efd', badge: 3 },
        { id: 'users', icon: <FaUsers size={18} />, label: lang === 'EN' ? 'Manage Users' : 'Gérer Utilisateurs', color: '#10b981' },
        { id: 'consultations', icon: <MdPendingActions size={22} />, label: lang === 'EN' ? 'Consultations' : 'Consultations', color: '#f59e0b' },
        { id: 'reports', icon: <FaChartBar size={18} />, label: lang === 'EN' ? 'Reports' : 'Rapports', color: '#8b5cf6' },
        { id: 'settings', icon: <FaCog size={18} />, label: lang === 'EN' ? 'Settings' : 'Paramètres', color: '#14b8a6' },
    ];

    const stats = [
        {
            icon: <FaUsers size={26} />,
            bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            label: lang === 'EN' ? 'Total Users' : 'Total Utilisateurs',
            value: '124',
            desc: lang === 'EN' ? 'Registered patients' : 'Patients enregistrés',
            shadow: 'rgba(99,102,241,0.3)'
        },
        {
            icon: <FaUserMd size={26} />,
            bg: 'linear-gradient(135deg, #0d6efd, #3b82f6)',
            label: lang === 'EN' ? 'Total Doctors' : 'Total Médecins',
            value: '18',
            desc: lang === 'EN' ? 'Verified professionals' : 'Professionnels vérifiés',
            shadow: 'rgba(13,110,253,0.3)'
        },
        {
            icon: <MdPendingActions size={28} />,
            bg: 'linear-gradient(135deg, #f59e0b, #f97316)',
            label: lang === 'EN' ? 'Pending Approvals' : 'Approbations en attente',
            value: '3',
            desc: lang === 'EN' ? 'Doctors awaiting verification' : 'Médecins en attente de vérification',
            shadow: 'rgba(245,158,11,0.3)'
        },
        {
            icon: <FaCheckCircle size={26} />,
            bg: 'linear-gradient(135deg, #10b981, #34d399)',
            label: lang === 'EN' ? 'Consultations Today' : 'Consultations Aujourd\'hui',
            value: '47',
            desc: lang === 'EN' ? 'Completed today' : 'Complétées aujourd\'hui',
            shadow: 'rgba(16,185,129,0.3)'
        },
    ];

    const pendingDoctors = [
        { name: 'Dr. Emmanuel Fouda', specialty: lang === 'EN' ? 'General Medicine' : 'Médecine Générale', email: 'fouda@gmail.com', phone: '+237 677 123 456', location: 'Douala', avatar: 'EF', time: lang === 'EN' ? '2 hours ago' : 'Il y a 2 heures' },
        { name: 'Dr. Ngozi Adaeze', specialty: lang === 'EN' ? 'Pediatrics' : 'Pédiatrie', email: 'ngozi@gmail.com', phone: '+237 655 789 012', location: 'Yaoundé', avatar: 'NA', time: lang === 'EN' ? '5 hours ago' : 'Il y a 5 heures' },
        { name: 'Dr. Serge Mbarga', specialty: lang === 'EN' ? 'Cardiology' : 'Cardiologie', email: 'mbarga@gmail.com', phone: '+237 699 345 678', location: 'Bafoussam', avatar: 'SM', time: lang === 'EN' ? '1 day ago' : 'Il y a 1 jour' },
    ];

    const verifiedDoctors = [
        { name: 'Dr. Marie Tchoupo', specialty: lang === 'EN' ? 'Dermatology' : 'Dermatologie', email: 'tchoupo@gmail.com', location: 'Douala', avatar: 'MT', status: 'active', patients: 45 },
        { name: 'Dr. Paul Essomba', specialty: lang === 'EN' ? 'General Medicine' : 'Médecine Générale', email: 'essomba@gmail.com', location: 'Yaoundé', avatar: 'PE', status: 'active', patients: 62 },
        { name: 'Dr. Alice Nkeng', specialty: lang === 'EN' ? 'Gynecology' : 'Gynécologie', email: 'nkeng@gmail.com', location: 'Douala', avatar: 'AN', status: 'inactive', patients: 28 },
    ];

    const recentUsers = [
        { name: 'Jean Kamga', email: 'kamga@gmail.com', location: 'Douala', avatar: 'JK', joined: lang === 'EN' ? '1 hour ago' : 'Il y a 1 heure', status: 'active' },
        { name: 'Fatima Oumarou', email: 'fatima@gmail.com', location: 'Garoua', avatar: 'FO', joined: lang === 'EN' ? '3 hours ago' : 'Il y a 3 heures', status: 'active' },
        { name: 'Michel Bello', email: 'bello@gmail.com', location: 'Bafoussam', avatar: 'MB', joined: lang === 'EN' ? '6 hours ago' : 'Il y a 6 heures', status: 'active' },
        { name: 'Sophie Atanga', email: 'atanga@gmail.com', location: 'Kribi', avatar: 'SA', joined: lang === 'EN' ? '1 day ago' : 'Il y a 1 jour', status: 'active' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>

            {/* ===== SIDEBAR ===== */}
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
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99,102,241,0.35)'
                    }}>
                        <MdLocalHospital size={22} color="white" />
                    </div>
                    <div>
                        <div style={{
                            fontWeight: 800, fontSize: '0.92rem',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            AnasHealthcare
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Admin Panel' : 'Panneau Admin'}
                        </div>
                    </div>
                </div>

                {/* Admin info */}
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
                        <MdAdminPanelSettings size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                            {user?.username || 'Admin'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '3px' }}>
                            {user?.email || ''}
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            background: '#f5f3ff', border: '1px solid #ddd6fe',
                            borderRadius: '20px', padding: '1px 8px',
                            fontSize: '0.6rem', color: '#6366f1', fontWeight: 700
                        }}>
                            <FaShieldAlt size={8} />
                            {lang === 'EN' ? 'Super Admin' : 'Super Admin'}
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
            <div style={{ marginLeft: '260px', flex: 1 }}>

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
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 3px 10px rgba(99,102,241,0.3)'
                        }}>
                            <MdAdminPanelSettings size={22} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                {lang === 'EN'
                                    ? `Admin Panel — ${user?.username || 'Admin'}`
                                    : `Panneau Admin — ${user?.username || 'Admin'}`}
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.1rem 0 0' }}>
                                {lang === 'EN' ? 'Manage doctors, users and platform settings' : 'Gérez les médecins, utilisateurs et paramètres de la plateforme'}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch size={13} color="#94a3b8" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder={lang === 'EN' ? 'Search users, doctors...' : 'Rechercher...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '0.58rem 1rem 0.58rem 2.2rem',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: '9px', fontSize: '0.83rem',
                                    outline: 'none', width: '200px',
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
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #064e3b 100%)',
                        borderRadius: '16px', padding: '1.8rem 2rem',
                        marginBottom: '1.6rem', position: 'relative', overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none' }} />
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
                                        <MdAdminPanelSettings color="#a5b4fc" size={16} />
                                    </div>
                                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>
                                        {lang === 'EN' ? 'AnasHealthcare Admin Panel' : 'Panneau Admin AnasHealthcare'}
                                    </span>
                                </div>
                                <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                                    {lang === 'EN' ? '3 doctors waiting for verification' : '3 médecins en attente de vérification'}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                                    {lang === 'EN'
                                        ? 'Review and verify doctor accounts, manage users and monitor platform activity.'
                                        : 'Examinez et vérifiez les comptes médecins, gérez les utilisateurs et surveillez l\'activité de la plateforme.'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                                <button onClick={() => setActiveMenu('doctors')} style={{
                                    padding: '0.7rem 1.3rem',
                                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                                    color: 'white', border: 'none', borderRadius: '10px',
                                    fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem',
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    boxShadow: '0 5px 15px rgba(245,158,11,0.4)',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    <MdPendingActions size={16} />
                                    {lang === 'EN' ? 'Verify Doctors' : 'Vérifier Médecins'}
                                </button>
                                <button onClick={() => setActiveMenu('users')} style={{
                                    padding: '0.7rem 1.3rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(8px)',
                                    color: 'white', border: '1.5px solid rgba(255,255,255,0.18)',
                                    borderRadius: '10px', fontWeight: 600,
                                    cursor: 'pointer', fontSize: '0.86rem',
                                    display: 'flex', alignItems: 'center', gap: '7px',
                                    fontFamily: "'Inter', sans-serif"
                                }}>
                                    <FaUsers size={14} />
                                    {lang === 'EN' ? 'Manage Users' : 'Gérer Utilisateurs'}
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

                    {/* Doctor Management */}
                    <div style={{
                        background: 'white', borderRadius: '16px',
                        padding: '1.5rem', border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                            <h3 style={{
                                fontSize: '0.95rem', fontWeight: 800, color: '#0f172a',
                                margin: 0, display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #0d6efd, #6366f1)', borderRadius: '2px' }} />
                                {lang === 'EN' ? 'Doctor Management' : 'Gestion des Médecins'}
                            </h3>
                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[
                                    { id: 'pending', label: lang === 'EN' ? 'Pending (3)' : 'En attente (3)', color: '#f59e0b' },
                                    { id: 'verified', label: lang === 'EN' ? 'Verified' : 'Vérifiés', color: '#10b981' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            padding: '0.4rem 0.9rem',
                                            background: activeTab === tab.id ? tab.color : '#f8fafc',
                                            color: activeTab === tab.id ? 'white' : '#475569',
                                            border: `1px solid ${activeTab === tab.id ? tab.color : '#e2e8f0'}`,
                                            borderRadius: '8px', cursor: 'pointer',
                                            fontSize: '0.78rem', fontWeight: 600,
                                            fontFamily: "'Inter', sans-serif"
                                        }}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pending doctors */}
                        {activeTab === 'pending' && (
                            <div>
                                {pendingDoctors.map((doc, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem',
                                        background: '#fffbeb',
                                        border: '1px solid #fde68a',
                                        borderRadius: '12px', marginBottom: '0.7rem',
                                        flexWrap: 'wrap', gap: '0.8rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '44px', height: '44px',
                                                background: 'linear-gradient(135deg, #0d6efd, #6366f1)',
                                                borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.8rem', fontWeight: 700, color: 'white',
                                                flexShrink: 0
                                            }}>
                                                {doc.avatar}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{doc.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.specialty} • {doc.location}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.email} • {doc.phone}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.time}</span>
                                            <button style={{
                                                padding: '0.45rem 1rem',
                                                background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                color: 'white', border: 'none',
                                                borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.78rem', fontWeight: 700,
                                                display: 'flex', alignItems: 'center', gap: '5px',
                                                fontFamily: "'Inter', sans-serif",
                                                boxShadow: '0 3px 10px rgba(16,185,129,0.3)'
                                            }}>
                                                <MdVerified size={13} />
                                                {lang === 'EN' ? 'Verify' : 'Vérifier'}
                                            </button>
                                            <button style={{
                                                padding: '0.45rem 1rem',
                                                background: 'white', color: '#ef4444',
                                                border: '1px solid #fecaca',
                                                borderRadius: '8px', cursor: 'pointer',
                                                fontSize: '0.78rem', fontWeight: 700,
                                                display: 'flex', alignItems: 'center', gap: '5px',
                                                fontFamily: "'Inter', sans-serif"
                                            }}>
                                                <FaTimesCircle size={12} />
                                                {lang === 'EN' ? 'Reject' : 'Rejeter'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Verified doctors */}
                        {activeTab === 'verified' && (
                            <div>
                                {verifiedDoctors.map((doc, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem',
                                        background: '#f0fdf4',
                                        border: '1px solid #bbf7d0',
                                        borderRadius: '12px', marginBottom: '0.7rem',
                                        flexWrap: 'wrap', gap: '0.8rem'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '44px', height: '44px',
                                                background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.8rem', fontWeight: 700, color: 'white',
                                                flexShrink: 0
                                            }}>
                                                {doc.avatar}
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{doc.name}</span>
                                                    <MdVerified size={14} color="#10b981" />
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.specialty} • {doc.location}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.patients} {lang === 'EN' ? 'patients' : 'patients'}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{
                                                background: doc.status === 'active' ? '#f0fdf4' : '#f8fafc',
                                                border: `1px solid ${doc.status === 'active' ? '#bbf7d0' : '#e2e8f0'}`,
                                                color: doc.status === 'active' ? '#10b981' : '#94a3b8',
                                                borderRadius: '20px', padding: '2px 10px',
                                                fontSize: '0.68rem', fontWeight: 700
                                            }}>
                                                {doc.status === 'active'
                                                    ? (lang === 'EN' ? 'Active' : 'Actif')
                                                    : (lang === 'EN' ? 'Inactive' : 'Inactif')}
                                            </div>
                                            <button style={{
                                                width: '30px', height: '30px',
                                                background: '#eff6ff', border: '1px solid #bfdbfe',
                                                borderRadius: '8px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#3b82f6'
                                            }}>
                                                <FaEye size={12} />
                                            </button>
                                            <button style={{
                                                width: '30px', height: '30px',
                                                background: '#fef2f2', border: '1px solid #fecaca',
                                                borderRadius: '8px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#ef4444'
                                            }}>
                                                <FaTrash size={11} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Users */}
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
                            <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '2px' }} />
                            {lang === 'EN' ? 'Recently Registered Users' : 'Utilisateurs Récemment Enregistrés'}
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {[
                                            lang === 'EN' ? 'User' : 'Utilisateur',
                                            lang === 'EN' ? 'Email' : 'Email',
                                            lang === 'EN' ? 'Location' : 'Localisation',
                                            lang === 'EN' ? 'Joined' : 'Inscrit',
                                            lang === 'EN' ? 'Status' : 'Statut',
                                            lang === 'EN' ? 'Actions' : 'Actions'
                                        ].map((h, i) => (
                                            <th key={i} style={{
                                                padding: '0.7rem 1rem', textAlign: 'left',
                                                fontSize: '0.75rem', fontWeight: 700,
                                                color: '#94a3b8', textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((u, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '34px', height: '34px',
                                                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                        borderRadius: '50%',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.7rem', fontWeight: 700, color: 'white'
                                                    }}>
                                                        {u.avatar}
                                                    </div>
                                                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{u.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#64748b' }}>{u.email}</td>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#64748b' }}>{u.location}</td>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: '#94a3b8' }}>{u.joined}</td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                                                    borderRadius: '20px', padding: '2px 8px',
                                                    fontSize: '0.65rem', color: '#10b981', fontWeight: 700
                                                }}>
                                                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }} />
                                                    {lang === 'EN' ? 'Active' : 'Actif'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button style={{
                                                        width: '28px', height: '28px',
                                                        background: '#eff6ff', border: '1px solid #bfdbfe',
                                                        borderRadius: '7px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#3b82f6'
                                                    }}>
                                                        <FaEye size={11} />
                                                    </button>
                                                    <button style={{
                                                        width: '28px', height: '28px',
                                                        background: '#fef2f2', border: '1px solid #fecaca',
                                                        borderRadius: '7px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        color: '#ef4444'
                                                    }}>
                                                        <FaTrash size={10} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;