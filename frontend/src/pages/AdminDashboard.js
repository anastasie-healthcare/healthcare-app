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

    const [doctors, setDoctors] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [reports, setReports] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeDocTab, setActiveDocTab] = useState('pending');
    const [newEstName, setNewEstName] = useState('');
    const [newEstType, setNewEstType] = useState('clinic');
    const [newEstLocation, setNewEstLocation] = useState('');
    const [newEstAddress, setNewEstAddress] = useState('');
    const [newEstDesc, setNewEstDesc] = useState('');
    const [selectedDoctorDiploma, setSelectedDoctorDiploma] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'admin') { navigate('/user/dashboard'); return; }
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
            console.error('Error fetching admin data:', err);
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
            console.error('Error toggling user:', err);
        }
    };

    const handleCreateEstablishment = async (e) => {
        e.preventDefault();
        if (!newEstName || !newEstLocation || !newEstAddress) return;
        try {
            await createEstablishment({ name: newEstName, type: newEstType, location: newEstLocation, address: newEstAddress, description: newEstDesc });
            setNewEstName(''); setNewEstLocation(''); setNewEstAddress(''); setNewEstDesc('');
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
            console.error('Error updating report:', err);
        }
    };

    const filteredUsers = usersList.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingDocs = doctors.filter(d => d.verification_status === 'en_attente');
    const verifiedDocs = doctors.filter(d => d.verification_status === 'approved');

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Overview' : "Vue d'ensemble", color: '#6366f1' },
        { id: 'doctors', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'Doctor Approval' : 'Validation Médecins', color: '#3b82f6' },
        { id: 'users', icon: <FaUsers size={18} />, label: lang === 'EN' ? 'User Directory' : 'Gestion Utilisateurs', color: '#10b981' },
        { id: 'establishments', icon: <FaHospital size={18} />, label: lang === 'EN' ? 'Establishments' : 'Établissements', color: '#f59e0b' },
        { id: 'reports', icon: <FaFlag size={18} />, label: lang === 'EN' ? 'Moderation' : 'Modération', color: '#ef4444' },
        { id: 'analytics', icon: <FaChartLine size={18} />, label: lang === 'EN' ? 'Platform Stats' : 'Statistiques', color: '#8b5cf6' },
    ];

    const inputStyle = {
        width: '100%', padding: '9px 12px', borderRadius: '8px',
        border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.84rem',
        fontFamily: 'Poppins, sans-serif', boxSizing: 'border-box', color: '#1e293b', background: 'white'
    };

    const renderActiveContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
                    <FaSpinner size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>
                        {lang === 'EN' ? 'Loading...' : 'Chargement...'}
                    </span>
                </div>
            );
        }

        switch (activeMenu) {
            case 'doctors':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                                {lang === 'EN' ? 'Doctor Validation' : 'Validation des Médecins'}
                            </h3>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => setActiveDocTab('pending')} style={{ padding: '6px 14px', background: activeDocTab === 'pending' ? '#f59e0b' : '#f8fafc', color: activeDocTab === 'pending' ? 'white' : '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                    {lang === 'EN' ? 'Pending (' + pendingDocs.length + ')' : 'En attente (' + pendingDocs.length + ')'}
                                </button>
                                <button onClick={() => setActiveDocTab('verified')} style={{ padding: '6px 14px', background: activeDocTab === 'verified' ? '#10b981' : '#f8fafc', color: activeDocTab === 'verified' ? 'white' : '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                    {lang === 'EN' ? 'Verified (' + verifiedDocs.length + ')' : 'Vérifiés (' + verifiedDocs.length + ')'}
                                </button>
                            </div>
                        </div>
                        {activeDocTab === 'pending' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {pendingDocs.length === 0 ? (
                                    <div style={{ color: '#64748b', textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                                        {lang === 'EN' ? 'No doctors awaiting validation.' : 'Aucun médecin en attente.'}
                                    </div>
                                ) : pendingDocs.map(doc => (
                                    <div key={doc.id} style={{ border: '1px solid #fde68a', background: '#fffbeb', borderRadius: '12px', padding: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>Dr. {doc.user_detail.username}</div>
                                                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>{doc.specialty} • {lang === 'EN' ? 'License: ' : 'Licence : '}<strong>{doc.license_number}</strong></div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {doc.diploma && (
                                                    <button onClick={() => setSelectedDoctorDiploma(doc.diploma)} style={{ padding: '6px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                                        {lang === 'EN' ? 'View Diploma' : 'Voir Diplôme'}
                                                    </button>
                                                )}
                                                <button onClick={() => handleVerifyDoctor(doc.id, 'approved')} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                                    {lang === 'EN' ? 'Approve' : 'Valider'}
                                                </button>
                                                <button onClick={() => setShowRejectionInput(showRejectionInput === doc.id ? null : doc.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                                    {lang === 'EN' ? 'Reject' : 'Rejeter'}
                                                </button>
                                            </div>
                                        </div>
                                        {showRejectionInput === doc.id && (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                                <input type="text" placeholder={lang === 'EN' ? 'Rejection reason...' : 'Raison du rejet...'} value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                                                <button onClick={() => handleVerifyDoctor(doc.id, 'rejected', rejectionReason)} style={{ padding: '6px 14px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                                    {lang === 'EN' ? 'Confirm' : 'Confirmer'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {verifiedDocs.map(doc => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #bbf7d0', background: '#f0fdf4', borderRadius: '10px', padding: '14px 16px' }}>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f766e' }}>Dr. {doc.user_detail.username}</div>
                                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{doc.specialty} • {doc.establishment_detail ? doc.establishment_detail.name : (lang === 'EN' ? 'Private Practice' : 'Cabinet Libéral')}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                                            <FaCheckCircle />{lang === 'EN' ? 'Verified' : 'Vérifié'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedDoctorDiploma && (
                            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150 }}>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>{lang === 'EN' ? 'Verification Document' : 'Document de Vérification'}</h3>
                                        <button onClick={() => setSelectedDoctorDiploma(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#64748b' }}>×</button>
                                    </div>
                                    <div style={{ height: '300px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {selectedDoctorDiploma.toLowerCase().endsWith('.pdf') ? (
                                            <iframe src={selectedDoctorDiploma} title="Diploma" style={{ width: '100%', height: '100%', border: 'none' }} />
                                        ) : (
                                            <img src={selectedDoctorDiploma} alt="Diploma" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        )}
                                    </div>
                                    <a href={selectedDoctorDiploma} target="_blank" rel="noreferrer" style={{ padding: '10px', background: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '8px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                                        {lang === 'EN' ? 'Download Document' : 'Télécharger le document'}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'users':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 18px', color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                            {lang === 'EN' ? 'User Directory' : 'Annuaire des Utilisateurs'}
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                        {[lang === 'EN' ? 'Username' : 'Utilisateur', 'Email', lang === 'EN' ? 'Role' : 'Rôle', 'Status', 'Actions'].map((h, i) => (
                                            <th key={i} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px', fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>{u.username}</td>
                                            <td style={{ padding: '12px', fontSize: '0.82rem', color: '#475569' }}>{u.email}</td>
                                            <td style={{ padding: '12px', fontSize: '0.82rem', color: '#475569', textTransform: 'capitalize' }}>{u.role}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ background: u.is_active ? '#f0fdf4' : '#fef2f2', color: u.is_active ? '#10b981' : '#ef4444', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                                                    {u.is_active ? (lang === 'EN' ? 'Active' : 'Actif') : (lang === 'EN' ? 'Suspended' : 'Suspendu')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <button onClick={() => handleToggleUserActive(u.id, u.is_active)} style={{ padding: '4px 12px', background: u.is_active ? '#fef2f2' : '#f0fdf4', color: u.is_active ? '#ef4444' : '#10b981', border: '1px solid currentColor', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.95rem' }}>
                                {lang === 'EN' ? 'Add Establishment' : 'Ajouter un Établissement'}
                            </h3>
                            <form onSubmit={handleCreateEstablishment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {[
                                    { label: lang === 'EN' ? 'Name' : 'Nom', value: newEstName, setter: setNewEstName, required: true },
                                    { label: lang === 'EN' ? 'Location (City)' : 'Ville', value: newEstLocation, setter: setNewEstLocation, required: true },
                                    { label: lang === 'EN' ? 'Address' : 'Adresse', value: newEstAddress, setter: setNewEstAddress, required: true },
                                ].map((field, i) => (
                                    <div key={i}>
                                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{field.label}</label>
                                        <input type="text" required={field.required} value={field.value} onChange={e => field.setter(e.target.value)} style={inputStyle} />
                                    </div>
                                ))}
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Type</label>
                                    <select value={newEstType} onChange={e => setNewEstType(e.target.value)} style={{ ...inputStyle }}>
                                        <option value="hospital">{lang === 'EN' ? 'Hospital' : 'Hôpital'}</option>
                                        <option value="clinic">{lang === 'EN' ? 'Clinic' : 'Clinique'}</option>
                                        <option value="cabinet">{lang === 'EN' ? 'Medical Cabinet' : 'Cabinet Médical'}</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Description</label>
                                    <textarea value={newEstDesc} onChange={e => setNewEstDesc(e.target.value)} style={{ ...inputStyle, height: '60px', resize: 'none' }} />
                                </div>
                                <button type="submit" style={{ padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem', fontFamily: 'Poppins, sans-serif' }}>
                                    {lang === 'EN' ? 'Add Establishment' : 'Ajouter'}
                                </button>
                            </form>
                        </div>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', minHeight: '350px' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.95rem' }}>
                                {lang === 'EN' ? 'Registered Establishments' : 'Établissements Enregistrés'}
                            </h3>
                            {establishments.length === 0 ? (
                                <div style={{ color: '#64748b', textAlign: 'center', padding: '30px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
                                    {lang === 'EN' ? 'No establishments registered yet.' : 'Aucun établissement enregistré.'}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {establishments.map(est => (
                                        <div key={est.id} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e293b' }}>{est.name}</div>
                                            <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                                                <strong>{est.type_display}</strong> • {est.address}, {est.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'reports':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 18px', color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                            {lang === 'EN' ? 'Moderation & Reports' : 'Modération & Signalements'}
                        </h3>
                        {reports.length === 0 ? (
                            <div style={{ color: '#64748b', textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                                {lang === 'EN' ? 'No pending reports.' : 'Aucun signalement en attente.'}
                            </div>
                        ) : reports.map(rep => (
                            <div key={rep.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: rep.status === 'pending' ? '#fef2f2' : '#f8fafc', marginBottom: '10px' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{rep.content_type_display}</span>
                                    <div style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 600, marginTop: '6px' }}>{rep.description}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                                        {lang === 'EN' ? 'Reported by ' : 'Signalé par '}{rep.reported_by_detail.username} • {new Date(rep.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                {rep.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <button onClick={() => handleResolveReport(rep.id, 'resolved')} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                            {lang === 'EN' ? 'Resolve' : 'Résoudre'}
                                        </button>
                                        <button onClick={() => handleResolveReport(rep.id, 'ignored')} style={{ padding: '6px 12px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>
                                            {lang === 'EN' ? 'Ignore' : 'Ignorer'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            case 'analytics':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {analytics && (
                            <>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                                        {lang === 'EN' ? 'Most Searched Specialties' : 'Spécialités les plus recherchées'}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {analytics.specialties_searched.map((spec, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ width: '140px', fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>{spec.name}</span>
                                                <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: ((spec.count / 142) * 100) + '%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '10px' }} />
                                                </div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', minWidth: '30px' }}>{spec.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                                        {lang === 'EN' ? 'Emergency Guide Consultations' : 'Consultations des guides d\'urgence'}
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {analytics.emergency_consults.map((em, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ width: '140px', fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>{em.name}</span>
                                                <div style={{ flex: 1, height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{ width: ((em.count / 87) * 100) + '%', height: '100%', background: 'linear-gradient(90deg, #ec4899, #f43f5e)', borderRadius: '10px' }} />
                                                </div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', minWidth: '30px' }}>{em.count}</span>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Banner */}
                        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #064e3b 100%)', borderRadius: '16px', padding: '28px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px' }}>
                                        {lang === 'EN'
                                            ? pendingDocs.length + ' doctor profile(s) await validation'
                                            : pendingDocs.length + ' profil(s) de médecins en attente'}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', margin: 0, maxWidth: '380px', lineHeight: 1.6 }}>
                                        {lang === 'EN'
                                            ? 'Approve medical credentials, manage establishments and monitor platform activity.'
                                            : 'Approuvez les diplômes médicaux, gérez les établissements et surveillez l\'activité de la plateforme.'}
                                    </p>
                                </div>
                                <button onClick={() => setActiveMenu('doctors')} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Poppins, sans-serif' }}>
                                    <MdPendingActions size={16} />{lang === 'EN' ? 'Approve Doctors' : 'Valider Médecins'}
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        {analytics && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                                {[
                                    { icon: <FaUsers size={20} />, color: '#6366f1', bg: '#f5f3ff', border: '#ddd6fe', label: lang === 'EN' ? 'Active Users' : 'Utilisateurs', value: analytics.metrics.active_users },
                                    { icon: <FaUserMd size={18} />, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: lang === 'EN' ? 'Verified Doctors' : 'Médecins Vérifiés', value: analytics.metrics.doctors },
                                    { icon: <FaHospital size={18} />, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: lang === 'EN' ? 'Establishments' : 'Établissements', value: analytics.metrics.establishments },
                                    { icon: <FaFlag size={18} />, color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: lang === 'EN' ? 'Pending Reports' : 'Signalements', value: analytics.metrics.pending_reports },
                                ].map((stat, i) => (
                                    <div key={i} style={{ background: stat.bg, border: '1px solid ' + stat.border, borderRadius: '12px', padding: '16px 18px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                                <span style={{ color: stat.color }}>{stat.icon}</span>
                                            </div>
                                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.label}</span>
                                        </div>
                                        <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Recent users */}
                        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '3px', height: '14px', background: 'linear-gradient(135deg, #10b981, #3b82f6)', borderRadius: '2px' }} />
                                {lang === 'EN' ? 'Recent Registrations' : 'Inscriptions Récentes'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {filteredUsers.slice(0, 5).map(u => (
                                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>{u.username}</div>
                                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{u.email} • {new Date(u.date_joined).toLocaleDateString()}</div>
                                        </div>
                                        <button onClick={() => setActiveMenu('users')} style={{ padding: '4px 12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', color: '#475569', fontFamily: 'Poppins, sans-serif' }}>
                                            {lang === 'EN' ? 'Manage' : 'Gérer'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Poppins, sans-serif', background: '#f8fafc' }}>

            {/* SIDEBAR */}
            <div style={{ width: '240px', flexShrink: 0, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>

                {/* Logo */}
                <div style={{ padding: '18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdLocalHospital size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AnasHealthcare</div>
                        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 500 }}>{lang === 'EN' ? 'Admin Panel' : 'Panneau Admin'}</div>
                    </div>
                </div>

                {/* Admin info */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MdAdminPanelSettings size={18} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username || 'Admin'}</div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '20px', padding: '1px 7px', fontSize: '0.6rem', color: '#6366f1', fontWeight: 700, marginTop: '2px' }}>
                            <FaShieldAlt size={8} />Super Admin
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                    {menuItems.map((item) => (
                        <div key={item.id}
                            onClick={() => { setActiveMenu(item.id); setSearchQuery(''); }}
                            onMouseEnter={e => { if (activeMenu !== item.id) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderLeft = '3px solid ' + item.color; } }}
                            onMouseLeave={e => { if (activeMenu !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '3px solid transparent'; } }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', cursor: 'pointer', background: activeMenu === item.id ? (item.color + '15') : 'transparent', borderRadius: '9px', marginBottom: '3px', borderLeft: activeMenu === item.id ? ('3px solid ' + item.color) : '3px solid transparent', transition: 'all 0.15s' }}>
                            <span style={{ color: activeMenu === item.id ? item.color : '#334155', display: 'flex' }}>{item.icon}</span>
                            <span style={{ fontSize: '0.86rem', fontWeight: activeMenu === item.id ? 700 : 600, color: activeMenu === item.id ? item.color : '#1e293b' }}>{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '0.84rem', fontFamily: 'Poppins, sans-serif' }}>
                        <FaSignOutAlt size={13} />{lang === 'EN' ? 'Logout' : 'Déconnexion'}
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', paddingBottom: '40px', boxSizing: 'border-box' }}>

                {/* Header */}
                <div style={{ background: 'white', padding: '14px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                            {lang === 'EN' ? 'Admin Panel — ' : 'Panneau Admin — '}
                            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {user?.username || 'Admin'}
                            </span>
                        </h1>
                        <p style={{ color: '#475569', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Manage doctors, users and platform settings' : 'Gérez les médecins, utilisateurs et paramètres'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch size={12} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" placeholder={lang === 'EN' ? 'Search users...' : 'Rechercher...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 30px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', width: '180px', fontFamily: 'Poppins, sans-serif', background: '#f8fafc', color: '#1e293b' }} />
                        </div>
                        <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                            <FaBell size={14} color="#475569" />
                            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
                        </div>
                        <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{ background: 'white', border: '1.5px solid #6366f1', color: '#6366f1', borderRadius: '20px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>
                            {lang === 'EN' ? 'FR' : 'EN'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px 28px' }}>
                    {renderActiveContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;