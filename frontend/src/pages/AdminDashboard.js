import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    FaUsers, FaUserMd, FaHospital, FaFlag,
    FaCheckCircle, FaTimesCircle, FaSignOutAlt,
    FaChartBar, FaChartPie, FaSearch,
    FaBell, FaShieldAlt, FaSpinner,
    FaTrash, FaUserPlus
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import {
    getAdminAnalytics, getAdminUsers, updateAdminUser,
    getDoctors, verifyDoctor, getEstablishments
} from '../services/api';

const AdminDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('EN');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [users, setUsers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [verifyingId, setVerifyingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [message, setMessage] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    // Establishment form
    const [showEstabForm, setShowEstabForm] = useState(false);
    const [estabName, setEstabName] = useState('');
    const [estabType, setEstabType] = useState('Hospital');
    const [estabLocation, setEstabLocation] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsed = JSON.parse(storedUser);
        if (parsed.role !== 'admin') { navigate('/login'); return; }
        setUser(parsed);
        fetchAll();
    }, [navigate]);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [usersRes, doctorsRes, estabRes] = await Promise.all([
                getAdminUsers(),
                getDoctors(),
                getEstablishments()
            ]);
            setUsers(usersRes.data);
            setDoctors(doctorsRes.data);
            setEstablishments(estabRes.data);
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        setVerifyingId(id);
        try {
            await verifyDoctor(id, status);
            showMsg('success', lang === 'EN' ? `Doctor ${status} successfully!` : `Médecin ${status === 'approved' ? 'approuvé' : 'rejeté'} avec succès !`);
            fetchAll();
        } catch (err) {
            showMsg('error', lang === 'EN' ? 'Action failed.' : 'Action échouée.');
        } finally {
            setVerifyingId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
    setDeletingId(userId);
    try {
        await API.delete('/users/admin-users/', { data: { id: userId } });
        showMsg('success', lang === 'EN' ? 'User deleted successfully.' : 'Utilisateur supprimé avec succès.');
        setConfirmDelete(null);
        setUsers(prev => prev.filter(u => u.id !== userId));
        setDoctors(prev => prev.filter(d => d.user_detail?.id !== userId));
    } catch (err) {
        showMsg('error', lang === 'EN' ? 'Failed to delete user.' : 'Échec de la suppression.');
    } finally {
        setDeletingId(null);
    }
};

    const showMsg = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const pendingDoctors = doctors.filter(d => d.verification_status === 'pending' || d.verification_status === 'en_attente');
    const approvedDoctors = doctors.filter(d => d.verification_status === 'approved');
    const patientUsers = users.filter(u => u.role === 'user');

    // Chart data
    const userRoleData = [
        { name: lang === 'EN' ? 'Patients' : 'Patients', value: patientUsers.length, color: '#10b981' },
        { name: lang === 'EN' ? 'Doctors' : 'Médecins', value: approvedDoctors.length, color: '#3b82f6' },
        { name: lang === 'EN' ? 'Admins' : 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#ef4444' },
    ];

    const doctorStatusData = [
        { name: lang === 'EN' ? 'Approved' : 'Approuvés', value: approvedDoctors.length, color: '#10b981' },
        { name: lang === 'EN' ? 'Pending' : 'En attente', value: pendingDoctors.length, color: '#f59e0b' },
        { name: lang === 'EN' ? 'Rejected' : 'Rejetés', value: doctors.filter(d => d.verification_status === 'rejected').length, color: '#ef4444' },
    ];

    const weeklyData = [
        { day: 'Mon', users: 3, appointments: 5 },
        { day: 'Tue', users: 5, appointments: 8 },
        { day: 'Wed', users: 2, appointments: 6 },
        { day: 'Thu', users: 7, appointments: 12 },
        { day: 'Fri', users: 4, appointments: 9 },
        { day: 'Sat', users: 6, appointments: 4 },
        { day: 'Sun', users: 1, appointments: 2 },
    ];

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Overview' : 'Vue d\'ensemble', color: '#6366f1' },
        { id: 'doctors', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'Doctor Approval' : 'Approbation Médecins', color: '#3b82f6', badge: pendingDoctors.length },
        { id: 'users', icon: <FaUsers size={18} />, label: lang === 'EN' ? 'User Directory' : 'Répertoire Utilisateurs', color: '#10b981' },
        { id: 'establishments', icon: <FaHospital size={18} />, label: lang === 'EN' ? 'Establishments' : 'Établissements', color: '#8b5cf6' },
        { id: 'stats', icon: <FaChartBar size={18} />, label: lang === 'EN' ? 'Platform Stats' : 'Statistiques', color: '#f59e0b' },
    ];

    // Shared message component
    const MessageBanner = () => message ? (
        <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: message.type === 'success' ? '#f0fdf4' : '#fef2f2', border: '1px solid ' + (message.type === 'success' ? '#bbf7d0' : '#fecaca'), fontSize: '0.82rem', fontWeight: 600, color: message.type === 'success' ? '#166534' : '#991b1b' }}>
            {message.text}
        </div>
    ) : null;

    // Delete confirmation modal
    const DeleteModal = () => confirmDelete ? (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', maxWidth: '380px', width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <FaTrash color="#ef4444" size={22} />
                </div>
                <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontWeight: 800 }}>
                    {lang === 'EN' ? 'Delete User?' : 'Supprimer l\'utilisateur ?'}
                </h3>
                <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '0.84rem', lineHeight: 1.5 }}>
                    {lang === 'EN'
                        ? `Are you sure you want to delete "${confirmDelete.username}"? This action cannot be undone.`
                        : `Êtes-vous sûr de vouloir supprimer "${confirmDelete.username}" ? Cette action est irréversible.`}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', fontFamily: 'Inter, sans-serif' }}>
                        {lang === 'EN' ? 'Cancel' : 'Annuler'}
                    </button>
                    <button onClick={() => handleDeleteUser(confirmDelete.id)} disabled={deletingId === confirmDelete.id} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {deletingId === confirmDelete.id ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaTrash size={12} />}
                        {lang === 'EN' ? 'Delete' : 'Supprimer'}
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    const renderContent = () => {
        switch (activeMenu) {

            case 'doctors':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaUserMd color="#3b82f6" />
                            {lang === 'EN' ? 'Doctor Verification' : 'Vérification des Médecins'}
                            {pendingDoctors.length > 0 && (
                                <span style={{ background: '#fef3c7', color: '#d97706', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px' }}>
                                    {pendingDoctors.length} {lang === 'EN' ? 'pending' : 'en attente'}
                                </span>
                            )}
                        </h3>
                        <MessageBanner />
                        {doctors.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                {lang === 'EN' ? 'No doctor profiles found.' : 'Aucun profil médecin.'}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {doctors.map(doc => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', flexWrap: 'wrap', gap: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                                                {doc.user_detail?.username?.charAt(0).toUpperCase() || 'D'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Dr. {doc.user_detail?.username}</div>
                                                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{doc.specialty} • {doc.license_number}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.user_detail?.email}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
    {/* Status badge */}
    <span style={{
        padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
        background: doc.verification_status === 'approved' ? '#f0fdf4' : doc.verification_status === 'rejected' ? '#fef2f2' : '#fffbeb',
        color: doc.verification_status === 'approved' ? '#16a34a' : doc.verification_status === 'rejected' ? '#dc2626' : '#d97706',
        border: '1px solid ' + (doc.verification_status === 'approved' ? '#bbf7d0' : doc.verification_status === 'rejected' ? '#fecaca' : '#fde68a')
    }}>
        {doc.verification_status === 'approved' ? (lang === 'EN' ? 'Approved' : 'Approuvé')
        : doc.verification_status === 'rejected' ? (lang === 'EN' ? 'Rejected' : 'Rejeté')
        : (lang === 'EN' ? 'Pending' : 'En attente')}
    </span>

    {/* Show Approve only for Pending or Rejected */}
    {(doc.verification_status === 'pending' || doc.verification_status === 'en_attente' || doc.verification_status === 'rejected') && (
        <button onClick={() => handleVerify(doc.id, 'approved')}
            disabled={verifyingId === doc.id}
            style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
            {verifyingId === doc.id ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaCheckCircle size={11} />}
            {lang === 'EN' ? 'Approve' : 'Approuver'}
        </button>
    )}

    {/* Delete always visible */}
    <button onClick={() => setConfirmDelete({ id: doc.user_detail?.id, username: doc.user_detail?.username })}
        style={{ padding: '6px 10px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 700, fontSize: '0.74rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
        <FaTrash size={11} />
    </button>
</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'users':
                const filteredUsers = users.filter(u =>
                    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                                {lang === 'EN' ? 'All Users' : 'Tous les Utilisateurs'} ({users.length})
                            </h3>
                            <div style={{ position: 'relative' }}>
                                <FaSearch size={12} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input type="text" placeholder={lang === 'EN' ? 'Search...' : 'Rechercher...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    style={{ padding: '8px 12px 8px 28px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', width: '180px', fontFamily: 'Inter, sans-serif' }} />
                            </div>
                        </div>
                        <MessageBanner />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {filteredUsers.map(u => (
                                <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid #f1f5f9', borderRadius: '10px', background: '#f8fafc' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.role === 'doctor' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : u.role === 'admin' ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'linear-gradient(135deg, #10b981, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.86rem' }}>
                                            {u.username?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>{u.username}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{u.email}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 700, background: u.role === 'doctor' ? '#eff6ff' : u.role === 'admin' ? '#fef2f2' : '#f0fdf4', color: u.role === 'doctor' ? '#2563eb' : u.role === 'admin' ? '#dc2626' : '#16a34a' }}>
                                            {u.role}
                                        </span>
                                        {u.role !== 'admin' && (
                                            <button onClick={() => setConfirmDelete({ id: u.id, username: u.username })} style={{ padding: '6px 10px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Inter, sans-serif' }}>
                                                <FaTrash size={10} />
                                                {lang === 'EN' ? 'Delete' : 'Supprimer'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'establishments':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                                {lang === 'EN' ? 'Establishments' : 'Établissements'} ({establishments.length})
                            </h3>
                            <button onClick={() => setShowEstabForm(!showEstabForm)} style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                {showEstabForm ? (lang === 'EN' ? 'Cancel' : 'Annuler') : (lang === 'EN' ? '+ Add New' : '+ Ajouter')}
                            </button>
                        </div>
                        {showEstabForm && (
                            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Name' : 'Nom'}</label>
                                        <input type="text" value={estabName} onChange={e => setEstabName(e.target.value)} placeholder={lang === 'EN' ? 'Hospital name' : 'Nom'} style={{ width: '100%', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', boxSizing: 'border-box' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Type</label>
                                        <select value={estabType} onChange={e => setEstabType(e.target.value)} style={{ width: '100%', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', background: 'white' }}>
                                            <option>Hospital</option>
                                            <option>Clinic</option>
                                            <option>Health Center</option>
                                            <option>Pharmacy</option>
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Location' : 'Localisation'}</label>
                                        <input type="text" value={estabLocation} onChange={e => setEstabLocation(e.target.value)} placeholder="Douala, Cameroun" style={{ width: '100%', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', boxSizing: 'border-box' }} />
                                    </div>
                                </div>
                                <button style={{ padding: '8px 20px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                    {lang === 'EN' ? 'Save' : 'Enregistrer'}
                                </button>
                            </div>
                        )}
                        {establishments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                                {lang === 'EN' ? 'No establishments yet.' : 'Aucun établissement.'}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {establishments.map(e => (
                                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaHospital color="white" size={18} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>{e.name}</div>
                                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{e.type} • {e.location}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case 'stats':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaChartBar color="#6366f1" size={16} />
                                    {lang === 'EN' ? 'Weekly Activity' : 'Activité Hebdomadaire'}
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                                        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }}/>
                                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }}/>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}/>
                                        <Bar dataKey="users" name={lang === 'EN' ? 'New Users' : 'Nouveaux'} fill="#10b981" radius={[4,4,0,0]}/>
                                        <Bar dataKey="appointments" name={lang === 'EN' ? 'Appointments' : 'RDV'} fill="#3b82f6" radius={[4,4,0,0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaChartPie color="#f59e0b" size={16} />
                                    {lang === 'EN' ? 'User Distribution' : 'Distribution Utilisateurs'}
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={userRoleData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                                            {userRoleData.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaUserMd color="#3b82f6" size={16} />
                                    {lang === 'EN' ? 'Doctor Verification Status' : 'Statut Vérification Médecins'}
                                </h3>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={doctorStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                                            {doctorStatusData.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.92rem' }}>
                                    {lang === 'EN' ? 'Platform Summary' : 'Résumé Plateforme'}
                                </h3>
                                {[
                                    { label: lang === 'EN' ? 'Total Users' : 'Total Utilisateurs', value: users.length, color: '#6366f1' },
                                    { label: lang === 'EN' ? 'Verified Doctors' : 'Médecins Vérifiés', value: approvedDoctors.length, color: '#10b981' },
                                    { label: lang === 'EN' ? 'Pending Approvals' : 'En attente', value: pendingDoctors.length, color: '#f59e0b' },
                                    { label: lang === 'EN' ? 'Establishments' : 'Établissements', value: establishments.length, color: '#8b5cf6' },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none' }}>
                                        <span style={{ fontSize: '0.84rem', color: '#475569', fontWeight: 600 }}>{item.label}</span>
                                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: item.color }}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <MessageBanner />

                        {/* Banner */}
                        <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #064e3b 100%)', borderRadius: '16px', padding: '24px 28px' }}>
                            <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px' }}>
                                {pendingDoctors.length > 0
                                    ? (lang === 'EN' ? `${pendingDoctors.length} doctor profile(s) await validation` : `${pendingDoctors.length} profil(s) médecin en attente`)
                                    : (lang === 'EN' ? 'All doctors verified ✅' : 'Tous les médecins vérifiés ✅')}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', margin: '0 0 16px' }}>
                                {lang === 'EN' ? 'Approve medical credentials, manage establishments and monitor platform activity.' : 'Approuvez les credentials médicaux, gérez les établissements et surveillez l\'activité.'}
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setActiveMenu('doctors')} style={{ padding: '9px 16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
                                    <FaUserMd size={13} />
                                    {lang === 'EN' ? 'Approve Doctors' : 'Approuver Médecins'}
                                </button>
                                <button onClick={() => setActiveMenu('stats')} style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
                                    <FaChartBar size={13} />
                                    {lang === 'EN' ? 'View Stats' : 'Voir Stats'}
                                </button>
                            </div>
                        </div>

                        {/* Stats cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                            {[
                                { icon: <FaUsers size={20} />, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', label: lang === 'EN' ? 'Active Users' : 'Utilisateurs', value: patientUsers.length, menu: 'users' },
                                { icon: <FaUserMd size={20} />, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: lang === 'EN' ? 'Verified Doctors' : 'Médecins Vérifiés', value: approvedDoctors.length, menu: 'doctors' },
                                { icon: <FaHospital size={20} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', label: lang === 'EN' ? 'Establishments' : 'Établissements', value: establishments.length, menu: 'establishments' },
                                { icon: <FaFlag size={20} />, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: lang === 'EN' ? 'Pending' : 'En attente', value: pendingDoctors.length, menu: 'doctors' },
                            ].map((stat, i) => (
                                <div key={i} onClick={() => setActiveMenu(stat.menu)}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = stat.color; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = stat.border; }}
                                    style={{ background: stat.bg, border: '1px solid ' + stat.border, borderRadius: '14px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span>
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '18px' }}>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaChartBar color="#6366f1" size={15} />
                                    {lang === 'EN' ? 'Weekly Activity' : 'Activité Hebdomadaire'}
                                </h3>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={weeklyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }}/>
                                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }}/>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}/>
                                        <Bar dataKey="users" name={lang === 'EN' ? 'New Users' : 'Nouveaux'} fill="#10b981" radius={[3,3,0,0]}/>
                                        <Bar dataKey="appointments" name={lang === 'EN' ? 'Appointments' : 'RDV'} fill="#3b82f6" radius={[3,3,0,0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaChartPie color="#f59e0b" size={15} />
                                    {lang === 'EN' ? 'User Roles' : 'Rôles'}
                                </h3>
                                <ResponsiveContainer width="100%" height={180}>
                                    <PieChart>
                                        <Pie data={userRoleData} cx="50%" cy="45%" outerRadius={65} dataKey="value">
                                            {userRoleData.map((entry, index) => <Cell key={index} fill={entry.color}/>)}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}/>
                                        <Legend iconSize={10} wrapperStyle={{ fontSize: '0.72rem' }}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent registrations */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaUserPlus color="#10b981" size={14} />
                                {lang === 'EN' ? 'Recent Registrations' : 'Inscriptions Récentes'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {users.slice(0, 5).map(u => (
                                    <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: '1px solid #f1f5f9', borderRadius: '10px', background: '#f8fafc' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: u.role === 'doctor' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #10b981, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.8rem' }}>
                                                {u.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>{u.username}</div>
                                                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{u.email}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.66rem', fontWeight: 700, background: u.role === 'doctor' ? '#eff6ff' : '#f0fdf4', color: u.role === 'doctor' ? '#2563eb' : '#16a34a' }}>
                                                {u.role}
                                            </span>
                                            {u.role !== 'admin' && (
                                                <button onClick={() => setConfirmDelete({ id: u.id, username: u.username })} style={{ padding: '4px 8px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                                    <FaTrash size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #6366f1', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>
            <DeleteModal />

            {/* SIDEBAR */}
            <div style={{ width: '240px', flexShrink: 0, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.svg" alt="AnasHealthcare" style={{ width: '34px', height: '34px', borderRadius: '8px' }} />
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.86rem', background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AnasHealthcare</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>{lang === 'EN' ? 'Admin Portal' : 'Portail Admin'}</div>
                    </div>
                </div>
                <div style={{ padding: '12px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FaShieldAlt size={14} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>{user?.username}</div>
                        <span style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '20px', padding: '1px 7px', fontSize: '0.58rem', color: '#ef4444', fontWeight: 700 }}>Super Admin</span>
                    </div>
                </div>
                <nav style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                    {menuItems.map(item => (
                        <div key={item.id} onClick={() => setActiveMenu(item.id)} style={{
                            display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', cursor: 'pointer',
                            background: activeMenu === item.id ? item.color + '12' : 'transparent',
                            borderRadius: '9px', marginBottom: '2px',
                            borderLeft: activeMenu === item.id ? '3px solid ' + item.color : '3px solid transparent',
                            transition: 'all 0.15s'
                        }}>
                            <span style={{ color: activeMenu === item.id ? item.color : '#94a3b8', display: 'flex' }}>{item.icon}</span>
                            <span style={{ fontSize: '0.82rem', fontWeight: activeMenu === item.id ? 700 : 500, color: activeMenu === item.id ? item.color : '#475569', flex: 1 }}>{item.label}</span>
                            {item.badge > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.62rem', fontWeight: 800, padding: '1px 6px', borderRadius: '20px' }}>{item.badge}</span>}
                        </div>
                    ))}
                </nav>
                <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
                        <FaSignOutAlt size={13} />
                        {lang === 'EN' ? 'Logout' : 'Déconnexion'}
                    </button>
                </div>
            </div>

            {/* MAIN */}
            <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', paddingBottom: '40px', boxSizing: 'border-box' }}>
                <div style={{ background: 'white', padding: '14px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                            {lang === 'EN' ? 'Admin Panel — ' : 'Panneau Admin — '}
                            <span style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.username}</span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '0.74rem', margin: '2px 0 0' }}>
                            {lang === 'EN' ? 'Manage doctors, users and platform settings' : 'Gérez les médecins, utilisateurs et paramètres'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                            <FaBell size={14} color="#475569" />
                            {pendingDoctors.length > 0 && <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />}
                        </div>
                        <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{ background: 'white', border: '1.5px solid #6366f1', color: '#6366f1', borderRadius: '20px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                            {lang === 'EN' ? 'FR' : 'EN'}
                        </button>
                    </div>
                </div>
                <div style={{ padding: '24px 28px' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;