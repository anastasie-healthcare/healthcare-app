import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {
    FaUserMd, FaUser, FaBell, FaSignOutAlt,
    FaSearch, FaStethoscope, FaCheckCircle,
    FaCalendarAlt, FaFileMedical,
    FaToggleOn, FaToggleOff, FaSpinner,
    FaVideo, FaPhoneSlash, FaPlus
} from 'react-icons/fa';
import {
    MdDashboard, MdLocalHospital,
    MdPsychology,
    MdOutlineTipsAndUpdates, MdPendingActions
} from 'react-icons/md';
import {
    getAppointments, updateAppointment, getMedicalNotes,
    createMedicalNote, updateDoctorProfile, getEstablishments,
    getMyDoctorProfile, aiTriage
} from '../services/api';

const DoctorDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('FR');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    const [appointments, setAppointments] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientNotes, setPatientNotes] = useState([]);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [newNotePrescription, setNewNotePrescription] = useState('');
    const [notesLoading, setNotesLoading] = useState(false);

    const [aiHypotheses, setAiHypotheses] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const [specialty, setSpecialty] = useState('Médecine Générale');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [selectedEstablishment, setSelectedEstablishment] = useState('');
    const [bio, setBio] = useState('');
    const [fee, setFee] = useState(25.00);
    const [profileMessage, setProfileMessage] = useState('');

    const [telePatient, setTelePatient] = useState(null);
    const [teleAppointment, setTeleAppointment] = useState(null);
    const [postponeAppointmentId, setPostponeAppointmentId] = useState(null);
    const [newPostponeDate, setNewPostponeDate] = useState('');
    const [newPostponeSlot, setNewPostponeSlot] = useState('09:00 - 09:30');

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'doctor') { navigate('/user/dashboard'); return; }
        setUser(parsedUser);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const apptsResponse = await getAppointments();
            setAppointments(apptsResponse.data);
            const estResponse = await getEstablishments();
            setEstablishments(estResponse.data);
            const profileResponse = await getMyDoctorProfile();
            if (profileResponse.data) {
                const profile = profileResponse.data;
                setSpecialty(profile.specialty || 'Médecine Générale');
                setLicenseNumber(profile.license_number || '');
                setSelectedEstablishment(profile.establishment || '');
                setBio(profile.bio || '');
                setFee(parseFloat(profile.consultation_fee) || 25.00);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
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

    const handleStatusUpdate = async (apptId, newStatus, dateVal = null, slotVal = null) => {
        try {
            const payload = { id: apptId, status: newStatus };
            if (dateVal) payload.date = dateVal;
            if (slotVal) payload.time_slot = slotVal;
            await updateAppointment(payload);
            setPostponeAppointmentId(null);
            fetchData();
        } catch (err) {
            console.error('Error updating appointment:', err);
        }
    };

    const loadPatientDetails = async (patient) => {
        setSelectedPatient(patient);
        setNotesLoading(true);
        setNewNoteContent('');
        setNewNotePrescription('');
        setAiHypotheses(null);
        try {
            const res = await getMedicalNotes(patient.id);
            setPatientNotes(res.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setNotesLoading(false);
        }
    };

    const generateAIReport = async () => {
        if (!selectedPatient) return;
        setAiLoading(true);
        try {
            const patientAppts = appointments.filter(a => a.patient_detail.id === selectedPatient.id && a.symptoms);
            const latestSymptoms = patientAppts.length > 0 ? patientAppts[0].symptoms : '';
            const res = await aiTriage({ free_text: latestSymptoms, selected_symptoms: [] });
            setAiHypotheses(res.data.hypotheses || []);
        } catch (err) {
            console.error('Error generating AI report:', err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleAddMedicalNote = async (e) => {
        e.preventDefault();
        if (!newNoteContent.trim()) return;
        try {
            await createMedicalNote({ patient: selectedPatient.id, content: newNoteContent, prescription: newNotePrescription });
            setNewNoteContent('');
            setNewNotePrescription('');
            const res = await getMedicalNotes(selectedPatient.id);
            setPatientNotes(res.data);
        } catch (err) {
            console.error('Error adding note:', err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        try {
            await updateDoctorProfile({ specialty, license_number: licenseNumber, establishment: selectedEstablishment || null, bio, consultation_fee: fee });
            setProfileMessage(lang === 'EN' ? 'Profile updated successfully!' : 'Profil mis à jour avec succès !');
        } catch (err) {
            setProfileMessage(lang === 'EN' ? 'Failed to update profile.' : 'Échec de la mise à jour.');
        }
    };

    const startTeleconsultation = (appointment) => {
        setTelePatient(appointment.patient_detail);
        setTeleAppointment(appointment);
        setActiveMenu('teleconsultation');
        loadPatientDetails(appointment.patient_detail);
    };

    const patientsList = Array.from(new Map(appointments.map(a => [a.patient_detail.id, a.patient_detail])).values());

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Overview' : "Vue d'ensemble", color: '#3b82f6' },
        { id: 'appointments', icon: <FaCalendarAlt size={18} />, label: lang === 'EN' ? 'Appointments' : 'Rendez-vous', color: '#f59e0b' },
        { id: 'records', icon: <FaFileMedical size={18} />, label: lang === 'EN' ? 'Patient Files' : 'Dossiers Patients', color: '#8b5cf6' },
        { id: 'assistant_ia', icon: <MdPsychology size={22} />, label: lang === 'EN' ? 'AI Assistant' : 'Assistant IA', color: '#10b981' },
        { id: 'teleconsultation', icon: <FaVideo size={18} />, label: lang === 'EN' ? 'Teleconsultation' : 'Téléconsultation', color: '#ec4899' },
        { id: 'profile', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'My Profile' : 'Profil Professionnel', color: '#14b8a6' },
    ];

    const filteredAppointments = appointments.filter(appt =>
        appt.patient_detail.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appt.symptoms && appt.symptoms.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: '8px',
        border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '0.84rem',
        fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', color: '#1e293b', background: 'white'
    };

    const renderActiveContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
                    <FaSpinner size={32} color="#3b82f6" style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 600 }}>
                        {lang === 'EN' ? 'Loading...' : 'Chargement...'}
                    </span>
                </div>
            );
        }

        switch (activeMenu) {
            case 'appointments':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: '0 0 18px', color: '#1e293b', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCalendarAlt color="#f59e0b" />
                            {lang === 'EN' ? 'Appointment Manager' : 'Gestionnaire des Rendez-vous'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {filteredAppointments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.85rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                                    {lang === 'EN' ? 'No appointments found.' : 'Aucun rendez-vous trouvé.'}
                                </div>
                            ) : filteredAppointments.map(appt => {
                                let badgeBg = '#fffbeb', badgeColor = '#d97706';
                                if (appt.status === 'confirmed') { badgeBg = '#f0fdf4'; badgeColor = '#16a34a'; }
                                else if (appt.status === 'completed') { badgeBg = '#eff6ff'; badgeColor = '#2563eb'; }
                                else if (appt.status === 'declined') { badgeBg = '#fef2f2'; badgeColor = '#dc2626'; }
                                return (
                                    <div key={appt.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: appt.status === 'pending' ? '#fffbeb' : 'white' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.88rem' }}>
                                                    {appt.patient_detail.username.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{appt.patient_detail.username}</div>
                                                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{appt.date} • {appt.time_slot}</div>
                                                </div>
                                            </div>
                                            <span style={{ background: badgeBg, color: badgeColor, padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                                                {appt.status_display}
                                            </span>
                                        </div>
                                        {appt.symptoms && (
                                            <div style={{ fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #cbd5e1', marginBottom: '10px' }}>
                                                <strong>{lang === 'EN' ? 'Symptoms: ' : 'Symptômes : '}</strong>{appt.symptoms}
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {appt.status === 'pending' && (
                                                <>
                                                    <button onClick={() => handleStatusUpdate(appt.id, 'confirmed')} style={{ padding: '7px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                                                        {lang === 'EN' ? 'Confirm' : 'Confirmer'}
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(appt.id, 'declined')} style={{ padding: '7px 14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                                                        {lang === 'EN' ? 'Decline' : 'Refuser'}
                                                    </button>
                                                </>
                                            )}
                                            {appt.status === 'confirmed' && (
                                                <>
                                                    <button onClick={() => startTeleconsultation(appt)} style={{ padding: '7px 14px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
                                                        <FaVideo size={12} />
                                                        {lang === 'EN' ? 'Start Video Call' : 'Démarrer Vidéo'}
                                                    </button>
                                                    <button onClick={() => handleStatusUpdate(appt.id, 'completed')} style={{ padding: '7px 14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                                                        {lang === 'EN' ? 'Mark Completed' : 'Marquer Terminé'}
                                                    </button>
                                                </>
                                            )}
                                            <button onClick={() => setPostponeAppointmentId(postponeAppointmentId === appt.id ? null : appt.id)} style={{ padding: '7px 14px', background: 'white', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>
                                                {lang === 'EN' ? 'Reschedule' : 'Reporter'}
                                            </button>
                                        </div>
                                        {postponeAppointmentId === appt.id && (
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '10px', flexWrap: 'wrap' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>{lang === 'EN' ? 'New Date' : 'Nouvelle Date'}</label>
                                                    <input type="date" value={newPostponeDate} onChange={e => setNewPostponeDate(e.target.value)} style={{ padding: '7px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>{lang === 'EN' ? 'Time' : 'Créneau'}</label>
                                                    <select value={newPostponeSlot} onChange={e => setNewPostponeSlot(e.target.value)} style={{ padding: '7px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem', background: 'white' }}>
                                                        <option>09:00 - 09:30</option>
                                                        <option>10:00 - 10:30</option>
                                                        <option>11:00 - 11:30</option>
                                                        <option>14:00 - 14:30</option>
                                                        <option>15:00 - 15:30</option>
                                                    </select>
                                                </div>
                                                <button onClick={() => handleStatusUpdate(appt.id, 'postponed', newPostponeDate, newPostponeSlot)} style={{ padding: '7px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                                                    {lang === 'EN' ? 'Apply' : 'Appliquer'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'records':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.95rem' }}>
                                {lang === 'EN' ? 'My Patients' : 'Mes Patients'}
                            </h3>
                            {patientsList.length === 0 ? (
                                <div style={{ color: '#64748b', fontSize: '0.82rem', textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
                                    {lang === 'EN' ? 'No patients yet.' : 'Aucun patient enregistré.'}
                                </div>
                            ) : patientsList.map(pat => (
                                <div key={pat.id} onClick={() => loadPatientDetails(pat)} style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid ' + (selectedPatient?.id === pat.id ? '#8b5cf6' : '#e2e8f0'), background: selectedPatient?.id === pat.id ? '#f5f3ff' : '#f8fafc', cursor: 'pointer', marginBottom: '8px', transition: 'all 0.15s' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: selectedPatient?.id === pat.id ? '#6d28d9' : '#1e293b' }}>{pat.username}</div>
                                    <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{pat.email}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
                            {!selectedPatient ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8', gap: '12px' }}>
                                    <FaFileMedical size={40} />
                                    <span style={{ fontSize: '0.84rem' }}>{lang === 'EN' ? 'Select a patient to view their file' : 'Sélectionnez un patient pour voir son dossier'}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px', color: '#1e293b', fontWeight: 800 }}>{selectedPatient.username}</h3>
                                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>{selectedPatient.email}</p>
                                    </div>
                                    <form onSubmit={handleAddMedicalNote} style={{ border: '1px solid #ddd6fe', borderRadius: '12px', padding: '16px', background: '#f5f3ff' }}>
                                        <h4 style={{ margin: '0 0 10px', color: '#6d28d9', fontSize: '0.86rem', fontWeight: 800 }}>
                                            {lang === 'EN' ? 'Add Clinical Note' : 'Ajouter une Observation'}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <textarea required placeholder={lang === 'EN' ? 'Clinical observation...' : "Observation clinique..."} value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd6fe', outline: 'none', height: '70px', resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', background: 'white' }} />
                                            <textarea placeholder={lang === 'EN' ? 'Prescription (optional)...' : 'Ordonnance (optionnel)...'} value={newNotePrescription} onChange={e => setNewNotePrescription(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ddd6fe', outline: 'none', height: '50px', resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', background: 'white' }} />
                                            <button type="submit" style={{ padding: '8px 14px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
                                                <FaPlus size={11} />{lang === 'EN' ? 'Add Note' : 'Ajouter'}
                                            </button>
                                        </div>
                                    </form>
                                    <div>
                                        <h4 style={{ margin: '0 0 10px', color: '#1e293b', fontSize: '0.88rem', fontWeight: 800 }}>{lang === 'EN' ? 'Notes History' : 'Historique des Notes'}</h4>
                                        {notesLoading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : patientNotes.length === 0 ? (
                                            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{lang === 'EN' ? 'No notes yet.' : 'Aucune note enregistrée.'}</div>
                                        ) : patientNotes.map(note => (
                                            <div key={note.id} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', marginBottom: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '6px' }}>
                                                    <span>Dr. {note.doctor_detail.username}</span>
                                                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>{note.content}</p>
                                                {note.prescription && (
                                                    <div style={{ fontSize: '0.78rem', color: '#0f766e', background: '#f0fdf9', padding: '6px 10px', borderRadius: '6px', border: '1px solid #b2f5ea' }}>
                                                        <strong>{lang === 'EN' ? 'Prescription: ' : 'Ordonnance : '}</strong>{note.prescription}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'assistant_ia':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '20px', alignItems: 'flex-start' }}>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.95rem' }}>
                                {lang === 'EN' ? 'Select Patient' : 'Sélectionner Patient'}
                            </h3>
                            {patientsList.map(pat => (
                                <div key={pat.id} onClick={() => loadPatientDetails(pat)} style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid ' + (selectedPatient?.id === pat.id ? '#10b981' : '#e2e8f0'), background: selectedPatient?.id === pat.id ? '#ecfdf5' : '#f8fafc', cursor: 'pointer', marginBottom: '8px', transition: 'all 0.15s' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: selectedPatient?.id === pat.id ? '#047857' : '#1e293b' }}>{pat.username}</div>
                                    <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{pat.email}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
                            {!selectedPatient ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8', gap: '12px' }}>
                                    <MdPsychology size={40} color="#10b981" />
                                    <span style={{ fontSize: '0.84rem' }}>{lang === 'EN' ? 'Select a patient to generate AI analysis' : 'Sélectionnez un patient pour générer une analyse IA'}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MdPsychology color="#10b981" size={22} />
                                        {lang === 'EN' ? 'AI Clinical Assistant' : 'Assistant IA Clinique'}
                                    </h3>
                                    <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '12px 14px', color: '#047857', fontSize: '0.8rem', lineHeight: 1.6 }}>
                                        {lang === 'EN' ? 'AI suggests compatible hypotheses based on patient data. Always apply your clinical judgment.' : "L'IA suggère des hypothèses compatibles basées sur les données patient. Appliquez toujours votre jugement clinique."}
                                    </div>
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '10px' }}>
                                        <h4 style={{ margin: '0 0 8px', fontSize: '0.86rem', color: '#1e293b', fontWeight: 800 }}>{lang === 'EN' ? 'Patient Summary' : 'Résumé Patient'}</h4>
                                        <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#475569' }}><strong>{lang === 'EN' ? 'Allergies: ' : 'Allergies : '}</strong>{selectedPatient.allergies || (lang === 'EN' ? 'None' : 'Aucune')}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}><strong>{lang === 'EN' ? 'History: ' : 'Historique : '}</strong>{selectedPatient.medical_history || (lang === 'EN' ? 'Not recorded' : 'Non renseigné')}</p>
                                    </div>
                                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '14px', borderRadius: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.86rem', color: '#b45309', fontWeight: 800 }}>{lang === 'EN' ? 'Diagnostic Hypotheses' : 'Hypothèses Diagnostiques'}</h4>
                                            <button onClick={generateAIReport} disabled={aiLoading} style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>
                                                {aiLoading ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <MdPsychology size={14} />}
                                                {lang === 'EN' ? 'Run AI Analysis' : "Lancer l'Analyse"}
                                            </button>
                                        </div>
                                        {!aiHypotheses && !aiLoading && <div style={{ color: '#92400e', fontSize: '0.8rem' }}>{lang === 'EN' ? 'Click to analyze patient symptoms.' : 'Cliquez pour analyser les symptômes du patient.'}</div>}
                                        {aiLoading && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontSize: '0.8rem' }}><FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> {lang === 'EN' ? 'Analyzing...' : 'Analyse...'}</div>}
                                        {aiHypotheses && aiHypotheses.length === 0 && <div style={{ color: '#92400e', fontSize: '0.8rem' }}>{lang === 'EN' ? 'No correlations found.' : 'Aucune corrélation trouvée.'}</div>}
                                        {aiHypotheses && aiHypotheses.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                {aiHypotheses.map((hyp, i) => (
                                                    <li key={i} style={{ fontSize: '0.8rem', color: '#78350f', lineHeight: 1.5 }}>
                                                        <strong>{hyp.name?.[lang] || hyp.condition_en}</strong>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'teleconsultation':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '20px', minHeight: '600px' }}>
                        <div style={{ background: '#1e293b', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '500px' }}>
                            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.9)' }}>
                                <span style={{ color: 'white', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                                    {lang === 'EN' ? 'SECURE TELECONSULTATION' : 'TÉLÉCONSULTATION SÉCURISÉE'}
                                </span>
                                {telePatient && <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Patient: {telePatient.username}</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                                {teleAppointment && (
                                    <JitsiMeeting
                                        domain="meet.jit.si"
                                        roomName={"AnasHealthCare-Appt-" + teleAppointment.id}
                                        configOverwrite={{ startWithAudioMuted: false, disableModeratorIndicator: true }}
                                        userInfo={{ displayName: "Dr. " + (user?.username || 'Doctor') }}
                                        getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; iframeRef.style.border = 'none'; }}
                                    />
                                )}
                            </div>
                            <div style={{ padding: '12px 20px', background: 'rgba(15,23,42,0.9)', display: 'flex', justifyContent: 'center' }}>
                                <button onClick={() => { if (window.confirm(lang === 'EN' ? 'End consultation?' : 'Terminer la consultation ?')) { handleStatusUpdate(teleAppointment.id, 'completed'); setTelePatient(null); setTeleAppointment(null); setActiveMenu('appointments'); } }} style={{ padding: '10px 24px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}>
                                    <FaPhoneSlash size={14} />{lang === 'EN' ? 'End Consultation' : 'Clôturer la Consultation'}
                                </button>
                            </div>
                        </div>
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaFileMedical color="#8b5cf6" />{lang === 'EN' ? 'Live Medical Record' : 'Dossier Médical en Temps Réel'}
                                </h4>
                            </div>
                            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                                {telePatient && (
                                    <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{telePatient.username}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{lang === 'EN' ? 'Symptoms: ' : 'Symptômes : '}{teleAppointment?.symptoms || (lang === 'EN' ? 'Not specified' : 'Non renseignés')}</div>
                                    </div>
                                )}
                                <form onSubmit={handleAddMedicalNote} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <textarea required placeholder={lang === 'EN' ? 'Clinical notes...' : 'Notes cliniques...'} value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', height: '80px', resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }} />
                                    <textarea placeholder={lang === 'EN' ? 'Prescription...' : 'Ordonnance...'} value={newNotePrescription} onChange={e => setNewNotePrescription(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', height: '60px', resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }} />
                                    <button type="submit" style={{ padding: '8px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                                        {lang === 'EN' ? 'Save to Record' : 'Sauvegarder dans le dossier'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', maxWidth: '580px' }}>
                        <h3 style={{ margin: '0 0 20px', color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                            {lang === 'EN' ? 'Professional Profile Settings' : 'Paramètres du Profil Professionnel'}
                        </h3>
                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { label: lang === 'EN' ? 'Medical Specialty' : 'Spécialité', value: specialty, setter: setSpecialty, type: 'text', required: true },
                                { label: lang === 'EN' ? 'License Number' : 'Numéro de Licence', value: licenseNumber, setter: setLicenseNumber, type: 'text', required: true },
                                { label: lang === 'EN' ? 'Consultation Fee (XAF)' : 'Tarif Consultation (XAF)', value: fee, setter: (v) => setFee(parseFloat(v)), type: 'number', required: false },
                            ].map((field, i) => (
                                <div key={i}>
                                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{field.label}</label>
                                    <input type={field.type} required={field.required} value={field.value} onChange={e => field.setter(e.target.value)} style={inputStyle} />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{lang === 'EN' ? 'Establishment' : 'Établissement'}</label>
                                <select value={selectedEstablishment} onChange={e => setSelectedEstablishment(e.target.value)} style={{ ...inputStyle }}>
                                    <option value="">{lang === 'EN' ? '-- Select --' : '-- Sélectionner --'}</option>
                                    {establishments.map(est => (<option key={est.id} value={est.id}>{est.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{lang === 'EN' ? 'Biography' : 'Biographie'}</label>
                                <textarea value={bio} onChange={e => setBio(e.target.value)} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                            </div>
                            {profileMessage && <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>{profileMessage}</div>}
                            <button type="submit" style={{ padding: '12px', background: 'linear-gradient(135deg, #14b8a6, #0d9488)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', fontFamily: 'Inter, sans-serif' }}>
                                {lang === 'EN' ? 'Save Settings' : 'Enregistrer'}
                            </button>
                        </form>
                    </div>
                );

            case 'dashboard':
            default:
                const pendingBooking = appointments.filter(a => a.status === 'pending');
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Banner */}
                        <div style={{ background: 'linear-gradient(135deg, #0c1445 0%, #1e3a5f 50%, #064e3b 100%)', borderRadius: '16px', padding: '28px 32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px' }}>
                                        {lang === 'EN'
                                            ? "You have " + pendingBooking.length + " pending appointment" + (pendingBooking.length !== 1 ? 's' : '')
                                            : "Vous avez " + pendingBooking.length + " demande" + (pendingBooking.length !== 1 ? 's' : '') + " en attente"}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', margin: 0, maxWidth: '380px', lineHeight: 1.6 }}>
                                        {lang === 'EN'
                                            ? 'Review patient requests, validate consultations and update your availability.'
                                            : 'Consultez les demandes, validez les consultations et mettez à jour votre disponibilité.'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setActiveMenu('appointments')} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #ef4444, #f97316)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
                                        <MdPendingActions size={16} />{lang === 'EN' ? 'Manage Bookings' : 'Gérer les RDV'}
                                    </button>
                                    <button onClick={() => setActiveMenu('assistant_ia')} style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
                                        <MdPsychology size={17} />{lang === 'EN' ? 'AI Assistant' : 'Assistant IA'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                            {[
                                { icon: <MdPendingActions size={22} />, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: lang === 'EN' ? 'Pending' : 'En attente', value: appointments.filter(a => a.status === 'pending').length },
                                { icon: <FaCalendarAlt size={18} />, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: lang === 'EN' ? 'Confirmed' : 'Confirmés', value: appointments.filter(a => a.status === 'confirmed').length },
                                { icon: <FaUser size={18} />, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', label: lang === 'EN' ? 'Patients' : 'Patients', value: patientsList.length },
                                { icon: <FaCheckCircle size={18} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', label: lang === 'EN' ? 'Completed' : 'Terminées', value: appointments.filter(a => a.status === 'completed').length },
                            ].map((stat, i) => (
                                <div key={i} style={{ background: stat.bg, border: '1px solid ' + stat.border, borderRadius: '12px', padding: '16px 18px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                            <span style={{ color: stat.color }}>{stat.icon}</span>
                                        </div>
                                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.label}</span>
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Pending + Tip */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px' }}>
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '3px', height: '14px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', borderRadius: '2px' }} />
                                    {lang === 'EN' ? 'Pending Appointments' : 'Demandes en Attente'}
                                </h3>
                                {pendingBooking.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.84rem', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
                                        {lang === 'EN' ? 'No pending appointments.' : 'Aucune demande en attente.'}
                                    </div>
                                ) : pendingBooking.slice(0, 3).map(appt => (
                                    <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb', border: '1px solid #fde68a', padding: '12px 14px', borderRadius: '10px', marginBottom: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>{appt.patient_detail.username}</div>
                                            <div style={{ fontSize: '0.73rem', color: '#64748b' }}>{appt.date} • {appt.time_slot}</div>
                                        </div>
                                        <button onClick={() => setActiveMenu('appointments')} style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                                            {lang === 'EN' ? 'Process' : 'Traiter'}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', borderRadius: '14px', padding: '20px', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                    <MdOutlineTipsAndUpdates color="white" size={16} />
                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {lang === 'EN' ? 'Medical Advisory' : 'Conseil Clinique'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.84rem', color: 'white', lineHeight: 1.7, fontWeight: 500 }}>
                                    {lang === 'EN'
                                        ? 'Always verify prescription dosages and update patient records promptly after each consultation.'
                                        : 'Veillez à vérifier les posologies et à mettre à jour les dossiers patients dès la fin de chaque consultation.'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>

            {/* SIDEBAR */}
            <div style={{ width: '240px', flexShrink: 0, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>

                {/* Logo */}
                <div style={{ padding: '18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #3b82f6, #10b981)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MdLocalHospital size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AnasHealthcare</div>
                        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 500 }}>{lang === 'EN' ? 'Doctor Portal' : 'Portail Médecin'}</div>
                    </div>
                </div>

                {/* Doctor info */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FaUserMd size={16} color="white" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dr. {user?.username || 'Doctor'}</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '20px', padding: '1px 7px', fontSize: '0.6rem', color: '#3b82f6', fontWeight: 700, marginTop: '2px' }}>
                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6' }} />
                                {lang === 'EN' ? 'Verified Doctor' : 'Médecin Vérifié'}
                            </div>
                        </div>
                    </div>
                    {/* Availability toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isAvailable ? '#f0fdf4' : '#fef2f2', border: '1px solid ' + (isAvailable ? '#bbf7d0' : '#fecaca'), borderRadius: '10px', padding: '8px 12px' }}>
                        <div>
                            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: isAvailable ? '#10b981' : '#ef4444' }}>
                                {isAvailable ? (lang === 'EN' ? 'Available' : 'Disponible') : (lang === 'EN' ? 'Unavailable' : 'Indisponible')}
                            </div>
                            <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>{lang === 'EN' ? 'Toggle status' : 'Changer statut'}</div>
                        </div>
                        <div onClick={() => setIsAvailable(!isAvailable)} style={{ cursor: 'pointer', color: isAvailable ? '#10b981' : '#ef4444' }}>
                            {isAvailable ? <FaToggleOn size={26} /> : <FaToggleOff size={26} />}
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    {menuItems.map((item) => (
                        <div key={item.id} onClick={() => setActiveMenu(item.id)}
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
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '0.84rem', fontFamily: 'Inter, sans-serif' }}>
                        <FaSignOutAlt size={13} />{lang === 'EN' ? 'Logout' : 'Déconnexion'}
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', paddingBottom: '60px', boxSizing: 'border-box' }}>

                {/* Header */}
                <div style={{ background: 'white', padding: '14px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                            {lang === 'EN' ? 'Good day, ' : 'Bonjour, '}
                            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Dr. {user?.username || 'Doctor'}
                            </span>
                        </h1>
                        <p style={{ color: '#475569', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Manage your consultations and patient requests' : 'Gérez vos consultations et demandes de patients'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch size={12} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" placeholder={lang === 'EN' ? 'Search patient...' : 'Rechercher patient...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 30px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', width: '180px', fontFamily: 'Inter, sans-serif', background: '#f8fafc', color: '#1e293b' }} />
                        </div>
                        <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                            <FaBell size={14} color="#475569" />
                            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
                        </div>
                        <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{ background: 'white', border: '1.5px solid #3b82f6', color: '#3b82f6', borderRadius: '20px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
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

export default DoctorDashboard;