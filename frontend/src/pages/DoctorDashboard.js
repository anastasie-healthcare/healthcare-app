import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {
    FaUserMd, FaUser, FaBell, FaSignOutAlt,
    FaSearch, FaStethoscope, FaCheckCircle,
    FaCalendarAlt, FaFileMedical,
    FaToggleOn, FaToggleOff, FaSpinner,
    FaVideo, FaMicrophone, FaPhoneSlash,
    FaPlus, FaMicrophoneSlash, FaVideoSlash
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
    
    // API loading state
    const [appointments, setAppointments] = useState([]);
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Selected patient for notes / history
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientNotes, setPatientNotes] = useState([]);
    const [newNoteContent, setNewNoteContent] = useState('');
    const [newNotePrescription, setNewNotePrescription] = useState('');
    const [notesLoading, setNotesLoading] = useState(false);
    
    // AI Assistant state
    const [aiHypotheses, setAiHypotheses] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    
    // Doctor profile settings state
    const [specialty, setSpecialty] = useState('Médecine Générale');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [selectedEstablishment, setSelectedEstablishment] = useState('');
    const [bio, setBio] = useState('');
    const [fee, setFee] = useState(25.00);
    const [profileMessage, setProfileMessage] = useState('');
    
    // Teleconsultation state
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [teleChat, setTeleChat] = useState([]);
    const [teleInput, setTeleInput] = useState('');
    const [telePatient, setTelePatient] = useState(null);
    const [teleAppointment, setTeleAppointment] = useState(null);

    // Postpone state
    const [postponeAppointmentId, setPostponeAppointmentId] = useState(null);
    const [newPostponeDate, setNewPostponeDate] = useState('');
    const [newPostponeSlot, setNewPostponeSlot] = useState('09:00 - 09:30');

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
            console.error('Error fetching doctor dashboard data:', err);
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
            console.error('Error updating appointment status:', err);
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
            console.error('Error fetching patient notes:', err);
        } finally {
            setNotesLoading(false);
        }
    };

    const generateAIReport = async () => {
        if (!selectedPatient) return;
        setAiLoading(true);
        try {
            // Find patient's latest symptoms from appointments
            const patientAppts = appointments.filter(a => a.patient_detail.id === selectedPatient.id && a.symptoms);
            const latestSymptoms = patientAppts.length > 0 ? patientAppts[0].symptoms : '';
            
            const textToAnalyze = `${latestSymptoms} ${selectedPatient.medical_history || ''} ${selectedPatient.allergies || ''}`;
            
            const res = await aiTriage({ free_text: textToAnalyze, selected_symptoms: [] });
            setAiHypotheses(res.data.hypotheses || []);
        } catch (err) {
            console.error('Error generating AI Report:', err);
        } finally {
            setAiLoading(false);
        }
    };

    const handleAddMedicalNote = async (e) => {
        e.preventDefault();
        if (!newNoteContent.trim()) return;

        try {
            await createMedicalNote({
                patient: selectedPatient.id,
                content: newNoteContent,
                prescription: newNotePrescription
            });
            setNewNoteContent('');
            setNewNotePrescription('');
            // Reload patient notes
            const res = await getMedicalNotes(selectedPatient.id);
            setPatientNotes(res.data);
        } catch (err) {
            console.error('Error adding medical note:', err);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileMessage('');
        try {
            await updateDoctorProfile({
                specialty,
                license_number: licenseNumber,
                establishment: selectedEstablishment || null,
                bio,
                consultation_fee: fee
            });
            setProfileMessage(lang === 'EN' ? 'Profile updated successfully!' : 'Profil mis à jour avec succès !');
        } catch (err) {
            console.error('Error updating doctor profile:', err);
            setProfileMessage(lang === 'EN' ? 'Failed to update profile.' : 'Échec de la mise à jour.');
        }
    };

    const startTeleconsultation = (appointment) => {
        setTelePatient(appointment.patient_detail);
        setTeleAppointment(appointment);
        setActiveMenu('teleconsultation');
        loadPatientDetails(appointment.patient_detail);
    };

    const sendTeleMessage = (e) => {
        e.preventDefault();
        if (!teleInput.trim()) return;
        setTeleChat([...teleChat, { sender: 'doctor', text: teleInput }]);
        setTeleInput('');
        // Simulated patient response after 1.5s
        setTimeout(() => {
            setTeleChat(prev => [...prev, { sender: 'patient', text: lang === 'EN' ? 'Yes doctor, I hear you.' : 'Oui docteur, je vous entends bien.' }]);
        }, 1500);
    };

    // Filter unique patients from appointments list
    const patientsList = Array.from(new Map(appointments.map(a => [a.patient_detail.id, a.patient_detail])).values());

    const menuItems = [
        { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Overview' : "Vue d'ensemble", color: '#0d6efd' },
        { id: 'appointments', icon: <FaCalendarAlt size={18} />, label: lang === 'EN' ? 'Appointments' : 'Rendez-vous', color: '#f59e0b' },
        { id: 'records', icon: <FaFileMedical size={18} />, label: lang === 'EN' ? 'Patient Files' : 'Dossiers Patients', color: '#8b5cf6' },
        { id: 'assistant_ia', icon: <MdPsychology size={22} />, label: lang === 'EN' ? 'Doctor AI Helper' : 'Assistant IA Docteur', color: '#10b981' },
        { id: 'teleconsultation', icon: <FaVideo size={18} />, label: lang === 'EN' ? 'Telehealth Stub' : 'Téléconsultation', color: '#ec4899' },
        { id: 'profile', icon: <FaUserMd size={18} />, label: lang === 'EN' ? 'Professional Profile' : 'Profil Professionnel', color: '#14b8a6' },
    ];

    const stats = [
        {
            icon: <MdPendingActions size={26} />,
            bg: 'linear-gradient(135deg, #f59e0b, #f97316)',
            label: lang === 'EN' ? 'Pending Booking' : 'Réservations en attente',
            value: appointments.filter(a => a.status === 'pending').length,
            desc: lang === 'EN' ? 'Awaiting confirmation' : 'En attente de confirmation',
            shadow: 'rgba(245,158,11,0.2)'
        },
        {
            icon: <FaCalendarAlt size={24} />,
            bg: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            label: lang === 'EN' ? 'Active Scheduled' : 'Confirmés',
            value: appointments.filter(a => a.status === 'confirmed').length,
            desc: lang === 'EN' ? 'Scheduled appointments' : 'Rendez-vous confirmés',
            shadow: 'rgba(59,130,246,0.2)'
        },
        {
            icon: <FaUser size={24} />,
            bg: 'linear-gradient(135deg, #10b981, #34d399)',
            label: lang === 'EN' ? 'My Patients' : 'Mes Patients',
            value: patientsList.length,
            desc: lang === 'EN' ? 'Unique patients treated' : 'Patients distincts traités',
            shadow: 'rgba(16,185,129,0.2)'
        },
        {
            icon: <FaCheckCircle size={24} />,
            bg: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            label: lang === 'EN' ? 'Completed Consultations' : 'Terminées',
            value: appointments.filter(a => a.status === 'completed').length,
            desc: lang === 'EN' ? 'Total finished checks' : 'Consultations archivées',
            shadow: 'rgba(139,92,246,0.2)'
        },
    ];

    // Filter appointments by search query
    const filteredAppointments = appointments.filter(appt => 
        appt.patient_detail.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appt.symptoms && appt.symptoms.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const renderActiveContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
                    <FaSpinner className="spin" size={36} color="#0d6efd" style={{ animation: 'spin 1.2s linear infinite' }} />
                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                        {lang === 'EN' ? 'Loading portal information...' : 'Chargement du portail professionnel...'}
                    </span>
                </div>
            );
        }

        switch (activeMenu) {
            case 'appointments':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800 }}>
                                {lang === 'EN' ? 'Appointment Manager' : 'Gestionnaire des Rendez-vous'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {filteredAppointments.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                        {lang === 'EN' ? 'No appointments match your search.' : 'Aucun rendez-vous ne correspond à la recherche.'}
                                    </div>
                                ) : (
                                    filteredAppointments.map(appt => (
                                        <div key={appt.id} style={{
                                            border: '1px solid #cbd5e1',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            background: appt.status === 'pending' ? '#fffbeb' : '#ffffff'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #0d6efd, #3b82f6)',
                                                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700
                                                    }}>
                                                        {appt.patient_detail.username.slice(0,2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', fontWeight: 800 }}>
                                                            {appt.patient_detail.username}
                                                        </h4>
                                                        <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                                                            {appt.patient_detail.email} • {lang === 'EN' ? 'Slot' : 'Créneau'} : <strong>{appt.date} ({appt.time_slot})</strong>
                                                        </p>
                                                    </div>
                                                </div>
                                                <span style={{
                                                    background: appt.status === 'confirmed' ? '#f0fdf4' : appt.status === 'pending' ? '#fffbeb' : '#fef2f2',
                                                    color: appt.status === 'confirmed' ? '#10b981' : appt.status === 'pending' ? '#f59e0b' : '#ef4444',
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                                                    border: '1px solid currentColor'
                                                }}>
                                                    {appt.status_display}
                                                </span>
                                            </div>

                                            {appt.symptoms && (
                                                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #cbd5e1' }}>
                                                    <strong>{lang === 'EN' ? 'Reported Symptoms:' : 'Symptômes signalés :'}</strong> {appt.symptoms}
                                                </p>
                                            )}

                                            {/* Action triggers */}
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                                                {appt.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appt.id, 'confirmed')}
                                                            style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                        >
                                                            {lang === 'EN' ? 'Confirm' : 'Confirmer'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appt.id, 'declined')}
                                                            style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                        >
                                                            {lang === 'EN' ? 'Decline' : 'Refuser'}
                                                        </button>
                                                    </>
                                                )}

                                                {appt.status === 'confirmed' && (
                                                    <>
                                                        <button
                                                            onClick={() => startTeleconsultation(appt)}
                                                            style={{ padding: '8px 16px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            <FaVideo />
                                                            {lang === 'EN' ? 'Start Telehealth' : 'Démarrer consultation'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(appt.id, 'completed')}
                                                            style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                        >
                                                            {lang === 'EN' ? 'Mark Completed' : 'Marquer terminé'}
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => setPostponeAppointmentId(postponeAppointmentId === appt.id ? null : appt.id)}
                                                    style={{ padding: '8px 16px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
                                                >
                                                    {lang === 'EN' ? 'Reschedule' : 'Reporter / Modifier'}
                                                </button>
                                            </div>

                                            {postponeAppointmentId === appt.id && (
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', marginTop: '10px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>{lang === 'EN' ? 'New Date' : 'Nouvelle Date'}</label>
                                                        <input type="date" value={newPostponeDate} onChange={e => setNewPostponeDate(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, color: '#64748b' }}>{lang === 'EN' ? 'Time Slot' : 'Créneau'}</label>
                                                        <select value={newPostponeSlot} onChange={e => setNewPostponeSlot(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                                            <option value="09:00 - 09:30">09:00 - 09:30</option>
                                                            <option value="10:00 - 10:30">10:00 - 10:30</option>
                                                            <option value="11:00 - 11:30">11:00 - 11:30</option>
                                                            <option value="14:00 - 14:30">14:00 - 14:30</option>
                                                            <option value="15:00 - 15:30">15:00 - 15:30</option>
                                                        </select>
                                                    </div>
                                                    <button
                                                        onClick={() => handleStatusUpdate(appt.id, 'postponed', newPostponeDate, newPostponeSlot)}
                                                        style={{ padding: '8px 12px', background: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, marginTop: '14px' }}
                                                    >
                                                        {lang === 'EN' ? 'Apply' : 'Appliquer'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                );
            case 'records':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Patient directory */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>
                                {lang === 'EN' ? 'My Patients Directory' : 'Annuaire de mes Patients'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {patientsList.length === 0 ? (
                                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{lang === 'EN' ? 'No patients recorded yet.' : 'Aucun patient enregistré.'}</div>
                                ) : (
                                    patientsList.map(pat => (
                                        <div
                                            key={pat.id}
                                            onClick={() => loadPatientDetails(pat)}
                                            style={{
                                                padding: '12px 14px',
                                                borderRadius: '10px',
                                                border: `1.5px solid ${selectedPatient?.id === pat.id ? '#8b5cf6' : '#e2e8f0'}`,
                                                background: selectedPatient?.id === pat.id ? '#f5f3ff' : '#f8fafc',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: selectedPatient?.id === pat.id ? '#6d28d9' : '#1e293b' }}>
                                                {pat.username}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{pat.email}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Patient folder details */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
                            {!selectedPatient ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8' }}>
                                    <FaFileMedical size={48} style={{ marginBottom: '12px' }} />
                                    <span>{lang === 'EN' ? 'Select a patient to view files and notes' : 'Sélectionnez un patient pour voir ses notes et documents.'}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 4px', color: '#1e293b', fontWeight: 800 }}>
                                            {selectedPatient.username}
                                        </h3>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{selectedPatient.email}</p>
                                    </div>

                                    {/* Medical note creator */}
                                    <form onSubmit={handleAddMedicalNote} style={{ border: '1px solid #ddd6fe', borderRadius: '12px', padding: '16px', background: '#f5f3ff' }}>
                                        <h4 style={{ margin: '0 0 10px', color: '#6d28d9', fontSize: '0.88rem', fontWeight: 800 }}>
                                            ✍️ {lang === 'EN' ? 'Add Clinical Note & Prescription' : 'Rédiger une Observation & Ordonnance'}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <textarea
                                                required
                                                placeholder={lang === 'EN' ? "Diagnostic observation details..." : "Détails de l'observation diagnostique..."}
                                                value={newNoteContent}
                                                onChange={e => setNewNoteContent(e.target.value)}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', height: '70px', resize: 'none', fontFamily: 'inherit', fontSize: '0.82rem' }}
                                            />
                                            <textarea
                                                placeholder={lang === 'EN' ? "Prescription drugs & dosage details..." : "Médicaments prescrits & détails de posologie..."}
                                                value={newNotePrescription}
                                                onChange={e => setNewNotePrescription(e.target.value)}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', height: '50px', resize: 'none', fontFamily: 'inherit', fontSize: '0.82rem' }}
                                            />
                                            <button type="submit" style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FaPlus />
                                                {lang === 'EN' ? 'Add Note' : 'Ajouter Note'}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Notes history */}
                                    <div>
                                        <h4 style={{ margin: '0 0 10px', color: '#1e293b', fontSize: '0.9rem', fontWeight: 800 }}>
                                            📋 {lang === 'EN' ? 'Clinical Notes History' : 'Historique des Observations'}
                                        </h4>
                                        {notesLoading ? (
                                            <FaSpinner className="spin" style={{ animation: 'spin 1.2s linear infinite' }} />
                                        ) : patientNotes.length === 0 ? (
                                            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{lang === 'EN' ? 'No history notes recorded yet.' : 'Aucune observation enregistrée.'}</span>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {patientNotes.map(note => (
                                                    <div key={note.id} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>
                                                            <span>Dr. {note.doctor_detail.username}</span>
                                                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                                                            {note.content}
                                                        </p>
                                                        {note.prescription && (
                                                            <div style={{ fontSize: '0.78rem', color: '#0f766e', background: '#e6fffa', padding: '8px', borderRadius: '6px', border: '1px solid #b2f5ea' }}>
                                                                <strong>Ordonnance :</strong> {note.prescription}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'assistant_ia':
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Select patient */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>
                                {lang === 'EN' ? 'Select Patient for AI Digest' : 'Sélectionner Patient pour Synthèse IA'}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {patientsList.map(pat => (
                                    <div
                                        key={pat.id}
                                        onClick={() => loadPatientDetails(pat)}
                                        style={{
                                            padding: '12px 14px',
                                            borderRadius: '10px',
                                            border: `1.5px solid ${selectedPatient?.id === pat.id ? '#10b981' : '#e2e8f0'}`,
                                            background: selectedPatient?.id === pat.id ? '#ecfdf5' : '#f8fafc',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: selectedPatient?.id === pat.id ? '#047857' : '#1e293b' }}>
                                            {pat.username}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{pat.email}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Summary report */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', minHeight: '400px' }}>
                            {!selectedPatient ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8' }}>
                                    <MdPsychology size={54} color="#10b981" style={{ marginBottom: '12px' }} />
                                    <span>{lang === 'EN' ? 'Select a patient to generate AI summaries and correlations.' : 'Sélectionnez un patient pour générer son rapport de diagnostic IA.'}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <MdPsychology size={28} color="#10b981" />
                                        <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>
                                            {lang === 'EN' ? 'Clinical Assistant IA' : 'Assistant IA de Cabinet Clinique'}
                                        </h3>
                                    </div>
                                    
                                    {/* Empathy alert */}
                                    <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '16px', color: '#047857', fontSize: '0.82rem', lineHeight: 1.6 }}>
                                        <strong>ℹ️ Note à l'attention du praticien :</strong> L'IA réorganise les données saisies par le patient et suggère des pistes compatibles. Elle ne doit en aucun cas remplacer le jugement diagnostique clinique du médecin.
                                    </div>

                                    {/* Patient history summary */}
                                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px' }}>
                                        <h4 style={{ margin: '0 0 8px', fontSize: '0.88rem', color: '#1e293b', fontWeight: 800 }}>
                                            📋 {lang === 'EN' ? 'Synthesized History & Allergies' : 'Antécédents & Allergies Synthétisés'}
                                        </h4>
                                        <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#475569' }}>
                                            <strong>{lang === 'EN' ? 'Allergies declared:' : 'Allergies déclarées :'}</strong> {selectedPatient.allergies || (lang === 'EN' ? 'None declared' : 'Aucune allergie signalée')}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569' }}>
                                            <strong>{lang === 'EN' ? 'Medical history summary:' : 'Historique médical synthétique :'}</strong> {selectedPatient.medical_history || (lang === 'EN' ? 'No history recorded' : 'Aucun antécédent particulier')}
                                        </p>
                                    </div>

                                    {/* AI compatible hypothesis */}
                                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#b45309', fontWeight: 800 }}>
                                                💡 {lang === 'EN' ? 'Compatible Diagnostic Hypotheses' : 'Hypothèses de Corrélation Compatibles'}
                                            </h4>
                                            <button 
                                                onClick={generateAIReport}
                                                disabled={aiLoading}
                                                style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: aiLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                {aiLoading ? <FaSpinner className="spin" /> : <MdPsychology size={16} />}
                                                {lang === 'EN' ? 'Run AI Analysis' : 'Lancer l\'Analyse IA'}
                                            </button>
                                        </div>
                                        
                                        {!aiHypotheses && !aiLoading && (
                                            <div style={{ color: '#92400e', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                                {lang === 'EN' ? 'Click the button above to analyze the patient\'s latest symptoms and medical history.' : 'Cliquez sur le bouton ci-dessus pour analyser les symptômes récents et l\'historique du patient.'}
                                            </div>
                                        )}
                                        
                                        {aiLoading && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontSize: '0.8rem' }}>
                                                <FaSpinner className="spin" /> {lang === 'EN' ? 'Analyzing...' : 'Analyse en cours...'}
                                            </div>
                                        )}
                                        
                                        {aiHypotheses && aiHypotheses.length === 0 && (
                                            <div style={{ color: '#92400e', fontSize: '0.8rem' }}>
                                                {lang === 'EN' ? 'No specific correlations found.' : 'Aucune corrélation spécifique trouvée.'}
                                            </div>
                                        )}
                                        
                                        {aiHypotheses && aiHypotheses.length > 0 && (
                                            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {aiHypotheses.map((hyp, index) => (
                                                    <li key={index} style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.5 }}>
                                                        <strong>{lang === 'EN' ? hyp.condition_en : hyp.condition_fr} (Confiance: {hyp.confidence}) :</strong> {lang === 'EN' ? hyp.explanation_en : hyp.explanation_fr}
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
                        {/* Video Feed */}
                        <div style={{ background: '#1e293b', borderRadius: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', minHeight: '500px' }}>
                            <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', zIndex: 5, background: 'rgba(15,23,42,0.8)' }}>
                                <span style={{ color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                                    {lang === 'EN' ? 'SECURE JITSI MEETING' : 'TÉLÉCONSULTATION SÉCURISÉE'}
                                </span>
                                {telePatient && (
                                    <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 600 }}>
                                        Patient: {telePatient.username}
                                    </span>
                                )}
                            </div>

                            {/* Jitsi React Iframe */}
                            <div style={{ flex: 1, position: 'relative' }}>
                                {teleAppointment && (
                                    <JitsiMeeting
                                        domain="meet.jit.si"
                                        roomName={`AnasHealthCare-Appt-${teleAppointment.id}`}
                                        configOverwrite={{
                                            startWithAudioMuted: false,
                                            disableModeratorIndicator: true,
                                            startScreenSharing: false,
                                            enableEmailInStats: false
                                        }}
                                        interfaceConfigOverwrite={{
                                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                                        }}
                                        userInfo={{
                                            displayName: `Dr. ${user.username}`
                                        }}
                                        onApiReady={(externalApi) => {
                                            // API is ready
                                        }}
                                        getIFrameRef={(iframeRef) => {
                                            iframeRef.style.height = '100%';
                                            iframeRef.style.width = '100%';
                                            iframeRef.style.border = 'none';
                                        }}
                                    />
                                )}
                            </div>

                            <div style={{ padding: '10px 20px', background: 'rgba(15,23,42,0.8)', display: 'flex', justifyContent: 'center' }}>
                                <button
                                    onClick={() => {
                                        if (window.confirm("Avez-vous terminé la consultation ?")) {
                                            handleStatusUpdate(teleAppointment.id, 'completed');
                                            setTelePatient(null);
                                            setTeleAppointment(null);
                                            setActiveMenu('appointments');
                                        }
                                    }}
                                    style={{
                                        padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                        background: '#ef4444', color: 'white', fontWeight: 800, fontSize: '0.9rem',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    <FaPhoneSlash size={16} /> Clôturer la Consultation
                                </button>
                            </div>
                        </div>

                        {/* Consultation File / Note taking */}
                        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                <h4 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaFileMedical color="#8b5cf6" /> Dossier Médical Interactif
                                </h4>
                            </div>
                            
                            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                                {/* Patient Info */}
                                {telePatient && (
                                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>Patient:</strong> {telePatient.username} ({telePatient.email})</p>
                                        <p style={{ margin: '0 0 4px', fontSize: '0.85rem' }}><strong>Symptômes:</strong> {teleAppointment?.symptoms || 'Non renseignés'}</p>
                                    </div>
                                )}

                                {/* Note Form */}
                                <form onSubmit={handleAddMedicalNote} style={{ border: '1px solid #ddd6fe', borderRadius: '12px', padding: '14px', background: '#f5f3ff' }}>
                                    <h5 style={{ margin: '0 0 10px', color: '#6d28d9', fontSize: '0.88rem', fontWeight: 800 }}>
                                        ✍️ Saisie en direct
                                    </h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <textarea
                                            required
                                            placeholder="Notes cliniques de la séance..."
                                            value={newNoteContent}
                                            onChange={e => setNewNoteContent(e.target.value)}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', height: '100px', resize: 'none', fontFamily: 'inherit', fontSize: '0.85rem' }}
                                        />
                                        <textarea
                                            placeholder="Ordonnance (médicaments et posologie)..."
                                            value={newNotePrescription}
                                            onChange={e => setNewNotePrescription(e.target.value)}
                                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', height: '80px', resize: 'none', fontFamily: 'inherit', fontSize: '0.85rem' }}
                                        />
                                        <button type="submit" style={{ padding: '10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                                            <FaPlus /> Sauvegarder dans le dossier
                                        </button>
                                    </div>
                                </form>

                                {/* Notes History */}
                                <div>
                                    <h5 style={{ margin: '0 0 8px', color: '#334155', fontSize: '0.88rem', fontWeight: 800 }}>
                                        Historique récent
                                    </h5>
                                    {notesLoading ? (
                                        <FaSpinner className="spin" />
                                    ) : patientNotes.length === 0 ? (
                                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Aucun historique trouvé.</span>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {patientNotes.slice(0, 2).map(note => (
                                                <div key={note.id} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white' }}>
                                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '4px' }}>
                                                        {new Date(note.created_at).toLocaleDateString()}
                                                    </div>
                                                    <p style={{ margin: '0', fontSize: '0.8rem', color: '#334155' }}>
                                                        {note.content.substring(0, 50)}...
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
                        <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800 }}>
                            {lang === 'EN' ? 'Professional Details Settings' : 'Paramètres du Profil Professionnel'}
                        </h3>
                        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    {lang === 'EN' ? 'Medical Specialty' : 'Spécialité Médicale'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={specialty}
                                    onChange={e => setSpecialty(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    {lang === 'EN' ? 'Professional License Number' : 'Numéro de Licence Professionnelle'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={licenseNumber}
                                    onChange={e => setLicenseNumber(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    {lang === 'EN' ? 'Associated Medical Establishment' : 'Établissement Médical Rattaché'}
                                </label>
                                <select
                                    value={selectedEstablishment}
                                    onChange={e => setSelectedEstablishment(e.target.value)}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: 'white' }}
                                >
                                    <option value="">{lang === 'EN' ? '-- Select Establishment --' : '-- Sélectionner un Établissement --'}</option>
                                    {establishments.map(est => (
                                        <option key={est.id} value={est.id}>{est.name} ({est.type_display})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    {lang === 'EN' ? 'Consultation Fee ($)' : 'Tarif Consultation ($)'}
                                </label>
                                <input
                                    type="number"
                                    value={fee}
                                    onChange={e => setFee(parseFloat(e.target.value))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                    {lang === 'EN' ? 'Biography' : 'Biographie'}
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    style={{ width: '100%', height: '80px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                                />
                            </div>

                            {profileMessage && (
                                <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>{profileMessage}</div>
                            )}

                            <button type="submit" style={{ padding: '12px', background: '#14b8a6', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}>
                                {lang === 'EN' ? 'Save Settings' : 'Sauvegarder les Paramètres'}
                            </button>
                        </form>
                    </div>
                );
            case 'dashboard':
            default:
                // Normal Dashboard Overview
                const pendingBooking = appointments.filter(a => a.status === 'pending');
                return (
                    <>
                        {/* Hero banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #0c1445 0%, #1e3a5f 50%, #064e3b 100%)',
                            borderRadius: '16px', padding: '1.8rem 2rem',
                            marginBottom: '1.6rem', position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(13,110,253,0.15)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', bottom: '-25px', right: '160px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', pointerEvents: 'none' }} />
                            <div style={{ relative: 'zIndex', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.2rem' }}>
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
                                        {lang === 'EN' 
                                            ? `You have ${pendingBooking.length} pending appointments` 
                                            : `Vous avez ${pendingBooking.length} demandes de rendez-vous en attente`}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', margin: 0, maxWidth: '400px', lineHeight: 1.6 }}>
                                        {lang === 'EN'
                                            ? 'Review patient records, accept consultations, and update your calendar or availability status.'
                                            : 'Consultez les dossiers patients, validez vos rendez-vous et mettez à jour votre calendrier de consultation.'}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                                    <button onClick={() => setActiveMenu('appointments')} style={{
                                        padding: '0.7rem 1.3rem',
                                        background: 'linear-gradient(135deg, #ef4444, #f97316)',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        fontWeight: 700, cursor: 'pointer', fontSize: '0.86rem',
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        boxShadow: '0 5px 15px rgba(239,68,68,0.4)',
                                        fontFamily: "'Inter', sans-serif"
                                    }}>
                                        <MdPendingActions size={16} />
                                        {lang === 'EN' ? 'Manage Bookings' : 'Gérer les RDV'}
                                    </button>
                                    <button onClick={() => setActiveMenu('assistant_ia')} style={{
                                        padding: '0.7rem 1.3rem',
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(8px)',
                                        color: 'white', border: '1.5px solid rgba(255,255,255,0.18)',
                                        borderRadius: '10px', fontWeight: 600,
                                        cursor: 'pointer', fontSize: '0.86rem',
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        fontFamily: "'Inter', sans-serif"
                                    }}>
                                        <MdPsychology size={18} />
                                        {lang === 'EN' ? 'AI Assistant' : 'Assistant IA'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.1rem', marginBottom: '1.6rem'
                        }}>
                            {stats.map((stat, i) => (
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

                        {/* Split layout: Pending Bookings + Reminders */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '20px' }}>
                            {/* Pending Bookings List */}
                            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '0.98rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '3px', height: '16px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', borderRadius: '2px' }} />
                                    {lang === 'EN' ? 'Recent Pending Bookings' : 'Demandes de Consultation Récentes'}
                                </h3>
                                {pendingBooking.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.85rem' }}>
                                        {lang === 'EN' ? 'No pending appointments at this time.' : 'Aucune demande de consultation en attente.'}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {pendingBooking.slice(0,3).map(appt => (
                                            <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fffbeb', border: '1px solid #fde68a', padding: '12px 16px', borderRadius: '12px' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>{appt.patient_detail.username}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{appt.date} ({appt.time_slot})</div>
                                                </div>
                                                <button
                                                    onClick={() => setActiveMenu('appointments')}
                                                    style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                                                >
                                                    {lang === 'EN' ? 'Process' : 'Traiter'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Medical note summary & notifications */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Reminder */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #0d6efd, #3b82f6)',
                                    borderRadius: '16px', padding: '20px',
                                    boxShadow: '0 5px 18px rgba(13,110,253,0.2)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <MdOutlineTipsAndUpdates color="white" size={18} />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                            {lang === 'EN' ? 'Medical Advisory' : 'Conseil Clinique'}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'white', lineHeight: 1.6, fontWeight: 500 }}>
                                        {lang === 'EN'
                                            ? 'Ensure you double check prescription dosage guidelines and register medical documents on patient records in due time.'
                                            : 'Veillez à bien vérifier les posologies et à reporter les observations médicales sur les dossiers patients dès la fin des consultations.'}
                                    </p>
                                </div>
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
            <div style={{ marginLeft: '265px', flex: 1, display: 'flex', flexDirection: 'column' }}>

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
                                placeholder={lang === 'EN' ? 'Search patient, symptoms...' : 'Rechercher patient, symptômes...'}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '0.58rem 1rem 0.58rem 2.2rem',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: '9px', fontSize: '0.83rem',
                                    outline: 'none', width: '220px',
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

                {/* Dashboard content */}
                <div style={{ padding: '1.6rem 2rem', flex: 1 }}>
                    {renderActiveContent()}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;