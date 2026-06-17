import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUserMd, FaBell, FaSignOutAlt,
    FaSearch, FaCheckCircle,
    FaUsers, FaShieldAlt,
    FaSpinner, FaHospital, FaFlag, FaChartLine
} from 'react-icons/fa';
import {
    MdDashboard, MdLocalHospital,
    MdAdminPanelSettings,
    MdPendingActions
} from 'react-icons/md';
import {
    getDoctors, verifyDoctor, getAdminUsers, updateAdminUser,
    getEstablishments, createEstablishment, getReports, updateReport,
    getAdminAnalytics
} from '../services/api';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('FR');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Data lists
    const [doctors, setDoctors] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [reports, setReports] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Active tab in doctor validation (pending vs verified)
    const [activeDocTab, setActiveDocTab] = useState('pending');

    // Create establishment form state
    const [newEstName, setNewEstName] = useState('');
    const [newEstType, setNewEstType] = useState('clinic');
    const [newEstLocation, setNewEstLocation] = useState('');
    const [newEstAddress, setNewEstAddress] = useState('');
    const [newEstDesc, setNewEstDesc] = useState('');
    
    // Modal states
    const [selectedDoctorDiploma, setSelectedDoctorDiploma] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(null);

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
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const docRes = await getDoctors();
            setDoctors(docRes.data);

            const userRes = await getAdminUsers();
            setUsersList(userRes.data);

            const estRes = await getEstablishments();
            setEstablishments(estRes.data);

            const repRes = await getReports();
            setReports(repRes.data);

            const analyticsRes = await getAdminAnalytics();
            setAnalytics(analyticsRes.data);
        } catch (err) {
            console.error('Error fetching admin dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleVerifyDoctor = async (docProfileId, statusVal, reason = '') => {
        try {
            await verifyDoctor(docProfileId, statusVal, reason);
            setShowRejectionInput(null);
            setRejectionReason('');
            fetchData();
        } catch (err) {
            console.error('Error verifying doctor:', err);
        }
    };

    const handleToggleUserActive = async (userId, currentActiveState) => {
        try {
            await updateAdminUser({ id: userId, is_active: !currentActiveState });
            fetchData();
        } catch (err) {
            console.error('Error toggling user status:', err);
        }
    };

    const handleCreateEstablishment = async (e) => {
        e.preventDefault();
        if (!newEstName || !newEstLocation || !newEstAddress) return;

        try {
            await createEstablishment({
                name: newEstName,
                type: newEstType,
                location: newEstLocation,
                address: newEstAddress,
                description: newEstDesc
            });
            setNewEstName('');
            setNewEstLocation('');
            setNewEstAddress('');
            setNewEstDesc('');
            fetchData();
        } catch (err) {
            console.error('Error creating establishment:', err);
        }
    };

    const handleResolveReport = async (reportId, statusVal) => {
        try {
            await updateReport({ id: reportId, status: statusVal });
            fetchData();
        } catch (err) {
            console.error('Error updating report status:', err);
        }
    };

    // Filter rules
    const filteredUsers = usersList.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingDocs = doctors.filter(d => d.verification_status === 'pending');
    const verifiedDocs = doctors.filter(d => d.verification_status === 'approved');

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Overview' : "Vue d'ensemble", color: '#6366f1' },
        { id: 'doctors', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'Doctor Approval' : 'Validation Médecins', color: '#0d6efd' },
        { id: 'users', icon: <FaUsers size={18} />, label: lang === 'EN' ? 'User Directory' : 'Gestion Utilisateurs', color: '#10b981' },
        { id: 'establishments', icon: <FaHospital size={18} />, label: lang === 'EN' ? 'Establishments' : 'Établissements', color: '#f59e0b' },
        { id: 'reports', icon: <FaFlag size={18} />, label: lang === 'EN' ? 'Moderation' : 'Modération', color: '#ef4444' },
        { id: 'analytics', icon: <FaChartLine size={18} />, label: lang === 'EN' ? 'Platform Stats' : 'Analyses Avancées', color: '#8b5cf6' },
    ];

    const renderActiveContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
                    <FaSpinner className="spin" size={36} color="#6366f1" style={{ animation: 'spin 1.2s linear infinite' }} />
                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                        {lang === 'EN' ? 'Loading center of control...' : 'Chargement du centre de contrôle...'}
                    </span>
                </div>
            );
        }

        switch (activeMenu) {
            case 'doctors':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>
                                {lang === 'EN' ? 'Doctor Professional Validation' : 'Validation Professionnelle des Médecins'}
                            </h3>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => setActiveDocTab('pending')}
                                    style={{
                                        padding: '6px 12px',
                                        background: activeDocTab === 'pending' ? '#f59e0b' : '#f8fafc',
                                        color: activeDocTab === 'pending' ? 'white' : '#475569',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700
                                    }}
                                >
                                    {lang === 'EN' ? `Pending (${pendingDocs.length})` : `En attente (${pendingDocs.length})`}
                                </button>
                                <button
                                    onClick={() => setActiveDocTab('verified')}
                                    style={{
                                        padding: '6px 12px',
                                        background: activeDocTab === 'verified' ? '#10b981' : '#f8fafc',
                                        color: activeDocTab === 'verified' ? 'white' : '#475569',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700
                                    }}
                                >
                                    {lang === 'EN' ? `Verified (${verifiedDocs.length})` : `Vérifiés (${verifiedDocs.length})`}
                                </button>
                            </div>
                        </div>

                        {/* Documents validation list */}
                        {activeDocTab === 'pending' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {pendingDocs.length === 0 ? (
                                    <div style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>
                                        {lang === 'EN' ? 'No doctor profiles awaiting validation.' : 'Aucun médecin en attente de validation.'}
                                    </div>
                                ) : (
                                    pendingDocs.map(doc => (
                                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #fde68a', background: '#fffbeb', borderRadius: '12px', padding: '16px', flexWrap: 'wrap', gap: '10px' }}>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', fontWeight: 800 }}>Dr. {doc.user_detail.username}</h4>
                                                <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                                                    {doc.specialty} • {lang === 'EN' ? 'License:' : 'Licence :'} <strong>{doc.license_number}</strong>
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {doc.diploma && (
                                                    <button
                                                        onClick={() => setSelectedDoctorDiploma(doc.diploma)}
                                                        style={{ padding: '6px 10px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                                    >
                                                        {lang === 'EN' ? 'View Diploma' : 'Voir Diplôme'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleVerifyDoctor(doc.id, 'approved')}
                                                    style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                                >
                                                    {lang === 'EN' ? 'Approve' : 'Valider'}
                                                </button>
                                                <button
                                                    onClick={() => setShowRejectionInput(showRejectionInput === doc.id ? null : doc.id)}
                                                    style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                                >
                                                    {lang === 'EN' ? 'Reject' : 'Rejeter'}
                                                </button>
                                            </div>
                                            {showRejectionInput === doc.id && (
                                                <div style={{ width: '100%', marginTop: '10px', display: 'flex', gap: '8px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder={lang === 'EN' ? 'Enter rejection reason...' : 'Raison du rejet...'}
                                                        value={rejectionReason}
                                                        onChange={e => setRejectionReason(e.target.value)}
                                                        style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                                                    />
                                                    <button
                                                        onClick={() => handleVerifyDoctor(doc.id, 'rejected', rejectionReason)}
                                                        style={{ padding: '6px 12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                                    >
                                                        {lang === 'EN' ? 'Confirm Reject' : 'Confirmer Rejet'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {verifiedDocs.map(doc => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: '12px', padding: '16px' }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f766e', fontWeight: 800 }}>Dr. {doc.user_detail.username}</h4>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                                                {doc.specialty} • {doc.establishment_detail ? doc.establishment_detail.name : 'Cabinet Libéral'}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                                            <FaCheckCircle />
                                            {lang === 'EN' ? 'Verified' : 'Vérifié'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Diploma File Modal Viewer */}
                        {selectedDoctorDiploma && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0 }}>{lang === 'EN' ? 'Verification Document' : 'Document de Vérification'}</h3>
                                        <button onClick={() => setSelectedDoctorDiploma(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                                    </div>
                                    <div style={{ height: '300px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {selectedDoctorDiploma.toLowerCase().endsWith('.pdf') ? (
                                            <iframe src={selectedDoctorDiploma} title="Diploma Viewer" style={{ width: '100%', height: '100%', border: 'none' }} />
                                        ) : (
                                            <img src={selectedDoctorDiploma} alt="Doctor Diploma" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        )}
                                    </div>
                                    <a href={selectedDoctorDiploma} target="_blank" rel="noreferrer" style={{ padding: '10px', background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                                        {lang === 'EN' ? 'Download Document File' : 'Télécharger le document original'}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'users':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800 }}>
                            {lang === 'EN' ? 'System User Directory' : 'Annuaire Général des Utilisateurs'}
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>{lang === 'EN' ? 'Username' : 'Nom d\'utilisateur'}</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>Email</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>{lang === 'EN' ? 'Role' : 'Rôle'}</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>{lang === 'EN' ? 'Status' : 'Statut'}</th>
                                        <th style={{ padding: '8px 12px', textAlign: 'left' }}>{lang === 'EN' ? 'Actions' : 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.82rem', color: '#475569' }}>
                                            <td style={{ padding: '12px', fontWeight: 700, color: '#1e293b' }}>{u.username}</td>
                                            <td style={{ padding: '12px' }}>{u.email}</td>
                                            <td style={{ padding: '12px', textTransform: 'capitalize' }}>{u.role}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    background: u.is_active ? '#e6fffa' : '#fef2f2',
                                                    color: u.is_active ? '#0d9488' : '#ef4444',
                                                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700
                                                }}>
                                                    {u.is_active ? (lang === 'EN' ? 'Active' : 'Actif') : (lang === 'EN' ? 'Suspended' : 'Suspendu')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <button
                                                    onClick={() => handleToggleUserActive(u.id, u.is_active)}
                                                    style={{
                                                        padding: '4px 10px',
                                                        background: u.is_active ? '#fef2f2' : '#e6fffa',
                                                        color: u.is_active ? '#ef4444' : '#0d9488',
                                                        border: '1px solid currentColor',
                                                        borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700
                                                    }}
                                                >
                                                    {u.is_active ? (lang === 'EN' ? 'Suspend' : 'Suspendre') : (lang === 'EN' ? 'Activate' : 'Activer')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'establishments':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Create node form */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>
                                {lang === 'EN' ? 'Add Establishment' : 'Ajouter un Établissement'}
                            </h3>
                            <form onSubmit={handleCreateEstablishment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Name' : 'Nom'}</label>
                                    <input type="text" required value={newEstName} onChange={e => setNewEstName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Type</label>
                                    <select value={newEstType} onChange={e => setNewEstType(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}>
                                        <option value="hospital">{lang === 'EN' ? 'Hospital' : 'Hôpital'}</option>
                                        <option value="clinic">{lang === 'EN' ? 'Clinic' : 'Clinique'}</option>
                                        <option value="cabinet">{lang === 'EN' ? 'Cabinet Médical' : 'Cabinet Médical'}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Location (City)' : 'Localisation (Ville)'}</label>
                                    <input type="text" required value={newEstLocation} onChange={e => setNewEstLocation(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Address' : 'Adresse'}</label>
                                    <input type="text" required value={newEstAddress} onChange={e => setNewEstAddress(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Description</label>
                                    <textarea value={newEstDesc} onChange={e => setNewEstDesc(e.target.value)} style={{ width: '100%', height: '60px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontFamily: 'inherit' }} />
                                </div>
                                <button type="submit" style={{ padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                                    {lang === 'EN' ? 'Register node' : 'Enregistrer'}
                                </button>
                            </form>
                        </div>

                        {/* Establishments directory list */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', minHeight: '350px' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>
                                {lang === 'EN' ? 'Registered Nodes Directory' : 'Annuaire des Établissements'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {establishments.map(est => (
                                    <div key={est.id} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                                        <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: '#1e293b', fontWeight: 800 }}>{est.name}</h4>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                                            <strong>{est.type_display}</strong> • {est.address}, {est.location}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'reports':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800 }}>
                            {lang === 'EN' ? 'Moderation & Content Reports' : 'Modération & Signalements de Contenus'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {reports.length === 0 ? (
                                <div style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>
                                    {lang === 'EN' ? 'No open flagged items in queue.' : 'Aucun signalement en attente.'}
                                </div>
                            ) : (
                                reports.map(rep => (
                                    <div key={rep.id} style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: rep.status === 'pending' ? '#fef2f2' : '#f8fafc' }}>
                                        <div>
                                            <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                                {rep.content_type_display}
                                            </span>
                                            <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>{rep.description}</p>
                                            <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: '#94a3b8' }}>
                                                Reported by {rep.reported_by_detail.username} • {new Date(rep.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {rep.status === 'pending' && (
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button onClick={() => handleResolveReport(rep.id, 'resolved')} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                                                    Resolve
                                                </button>
                                                <button onClick={() => handleResolveReport(rep.id, 'ignored')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                                                    Ignore
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'analytics':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* KPI Metrics */}
                        {analytics && (
                            <>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800 }}>
                                        {lang === 'EN' ? 'Search specialty ranking' : 'Classement des spécialités recherchées'}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {analytics.specialties_searched.map((spec, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ width: '120px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{spec.name}</span>
                                                <div style={{ flex: 1, height: '14px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(spec.count / 142) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '10px' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{spec.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800 }}>
                                        {lang === 'EN' ? 'Emergency guide consultations volume' : 'Consultations des fiches de premiers secours'}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {analytics.emergency_consults.map((em, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ width: '120px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>{em.name}</span>
                                                <div style={{ flex: 1, height: '14px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${(em.count / 87) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #ec4899, #f43f5e)', borderRadius: '10px' }} />
                                                </div>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{em.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <>
                        {/* Hero banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #064e3b 100%)',
                            borderRadius: '16px', padding: '1.8rem 2rem',
                            marginBottom: '1.6rem', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', bottom: '-25px', right: '160px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', pointerEvents: 'none' }} />
                            <div style={{ relative: 'zIndex', zIndex: 1, display: 'flex', alignItems: 'center', justify: 'space-between', flexWrap: 'wrap', gap: '1.2rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            width: '24px', height: '24px',
                                            background: 'rgba(255,255,255,0.12)',
                                            borderRadius: '6px',
                                            display: 'flex', alignItems: 'center', justify: 'center'
                                        }}>
                                            <MdAdminPanelSettings color="#a5b4fc" size={16} />
                                        </div>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>
                                            {lang === 'EN' ? 'AnasHealthcare Control Center' : 'Centre de Contrôle AnasHealthcare'}
                                        </span>
                                    </div>
                                    <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
                                        {lang === 'EN' ? `${pendingDocs.length} doctor profiles await validation` : `${pendingDocs.length} profils de médecins en attente`}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                                        {lang === 'EN'
                                            ? 'Approve medical credentials, verify establishments, moderate incident reports, and view platform metrics.'
                                            : 'Approuvez les diplômes médicaux, gérez les établissements, modérez le contenu signalé et consultez les statistiques.'}
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
                                        {lang === 'EN' ? 'Approve Doctors' : 'Valider Praticiens'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats grid */}
                        {analytics && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.1rem', marginBottom: '1.6rem'
                            }}>
                                {[
                                    { icon: <FaUsers size={26} />, bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)', label: lang === 'EN' ? 'Active Users' : 'Utilisateurs Actifs', value: analytics.metrics.active_users, desc: lang === 'EN' ? 'Active accounts' : 'Comptes actifs', shadow: 'rgba(99,102,241,0.3)' },
                                    { icon: <FaUserMd size={26} />, bg: 'linear-gradient(135deg, #0d6efd, #3b82f6)', label: lang === 'EN' ? 'Verified Doctors' : 'Médecins Vérifiés', value: analytics.metrics.doctors, desc: lang === 'EN' ? 'Certified practitioners' : 'Praticiens certifiés', shadow: 'rgba(13,110,253,0.3)' },
                                    { icon: <FaHospital size={26} />, bg: 'linear-gradient(135deg, #f59e0b, #f97316)', label: lang === 'EN' ? 'Establishments' : 'Établissements', value: analytics.metrics.establishments, desc: lang === 'EN' ? 'Hospitals & clinics' : 'Hôpitaux & cliniques', shadow: 'rgba(245,158,11,0.3)' },
                                    { icon: <FaFlag size={26} />, bg: 'linear-gradient(135deg, #ef4444, #f43f5e)', label: lang === 'EN' ? 'Pending Reports' : 'Signalements en cours', value: analytics.metrics.pending_reports, desc: lang === 'EN' ? 'Awaiting moderation' : 'En attente de modération', shadow: 'rgba(239,68,68,0.3)' },
                                ].map((stat, i) => (
                                    <div key={i} style={{
                                        background: stat.bg, borderRadius: '14px', padding: '1.3rem',
                                        boxShadow: `0 5px 18px ${stat.shadow}`,
                                        position: 'relative', overflow: 'hidden'
                                    }}>
                                        <div style={{ position: 'absolute', top: '-12px', right: '-12px', width: '65px', height: '65px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
                                        <div style={{ relative: 'zIndex', zIndex: 1 }}>
                                            <div style={{ color: 'rgba(255,255,255,0.85)', marginBottom: '0.65rem' }}>{stat.icon}</div>
                                            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white', marginBottom: '0.12rem' }}>{stat.value}</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '0.12rem' }}>{stat.label}</div>
                                            <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.68)' }}>{stat.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recent users dashboard */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '2px' }} />
                                {lang === 'EN' ? 'Recent Users Registrations' : 'Inscriptions Utilisateurs Récentes'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {filteredUsers.slice(0, 4).map(u => (
                                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{u.username}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{u.email} • Joined on {new Date(u.date_joined).toLocaleDateString()}</div>
                                        </div>
                                        <button onClick={() => setActiveMenu('users')} style={{ padding: '4px 10px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                                            Manage
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );
        }
    };

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
                        display: 'flex', alignItems: 'center', justify: 'center',
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
                        display: 'flex', alignItems: 'center', justify: 'center',
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
                            onClick={() => {
                                setActiveMenu(item.id);
                                setSearchQuery('');
                            }}
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
            <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>

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
                            display: 'flex', alignItems: 'center', justify: 'center',
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
                                placeholder={lang === 'EN' ? 'Search users...' : 'Rechercher utilisateur...'}
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
                            display: 'flex', alignItems: 'center', justify: 'center',
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

                {/* Dashboard content */}
                <div style={{ padding: '1.6rem 2rem', flex: 1 }}>
                    {renderActiveContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;