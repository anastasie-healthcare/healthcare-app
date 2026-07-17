import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaAmbulance, FaUser,
    FaBell, FaSignOutAlt, FaChevronRight,
    FaSearch, FaNotesMedical, FaStethoscope,
    FaCapsules, FaVenus, FaSpinner, FaHeartbeat,
    FaCalendarCheck, FaUserMd
} from 'react-icons/fa';
import {
    MdDashboard, MdLocalHospital,
    MdHealthAndSafety, MdPsychology,
    MdOutlineTipsAndUpdates
} from 'react-icons/md';
import { JitsiMeeting } from '@jitsi/react-sdk';

import SOSModule from '../components/dashboard/SOSModule';
import FirstAidModule from '../components/dashboard/FirstAidModule';
import TriageModule from '../components/dashboard/TriageModule';
import MedicationModule from '../components/dashboard/MedicationModule';
import MedicalRecordModule from '../components/dashboard/MedicalRecordModule';
import HealthAcademyModule from '../components/dashboard/HealthAcademyModule';
import OnboardingWizard from '../components/dashboard/OnboardingWizard';
import WomensHealthModule from '../components/dashboard/WomensHealthModule';
import { getMedicalRecord, getDoctors, getAppointments, createAppointment } from '../services/api';
import DailyRemindersModule from '../components/dashboard/DailyRemindersModule';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [lang, setLang] = useState('EN');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmergencyId, setSelectedEmergencyId] = useState(null);
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [loadingRecord, setLoadingRecord] = useState(true);

    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loadingConsult, setLoadingConsult] = useState(false);

    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSlot, setBookingSlot] = useState('09:00 - 09:30');
    const [bookingSymptoms, setBookingSymptoms] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [bookingMessage, setBookingMessage] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [activeTeleconsultation, setActiveTeleconsultation] = useState(null);

    const navigate = useNavigate();

    const fetchMedicalRecord = async () => {
        try {
            setLoadingRecord(true);
            const response = await getMedicalRecord();
            setMedicalRecord(response.data);
            if (!response.data || !response.data.onboarding_completed) {
                setShowOnboarding(true);
            } else {
                setShowOnboarding(false);
            }
        } catch (err) {
            console.error('Error fetching medical record:', err);
            setShowOnboarding(true);
        } finally {
            setLoadingRecord(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'user') {
            fetchMedicalRecord();
        } else {
            setLoadingRecord(false);
        }
    }, [navigate]);

    const fetchConsultationData = async () => {
        setLoadingConsult(true);
        try {
            const doctorsRes = await getDoctors();
            const approved = doctorsRes.data.filter(d => d.verification_status === 'approved');
            setDoctors(approved);
            const apptsRes = await getAppointments();
            setAppointments(apptsRes.data);
        } catch (err) {
            console.error('Error fetching consultation data:', err);
        } finally {
            setLoadingConsult(false);
        }
    };

    useEffect(() => {
        fetchConsultationData();
    }, []);

    useEffect(() => {
        if (activeMenu === 'consultation') fetchConsultationData();
    }, [activeMenu]);

    const handleBookAppointmentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctorId || !bookingDate) {
            setBookingMessage({ type: 'error', text: lang === 'EN' ? 'Please select a doctor and date.' : 'Veuillez choisir un médecin et une date.' });
            return;
        }
        setBookingLoading(true);
        setBookingMessage(null);
        try {
            await createAppointment({ doctor: selectedDoctorId, date: bookingDate, time_slot: bookingSlot, symptoms: bookingSymptoms, notes: bookingNotes });
            setBookingMessage({ type: 'success', text: lang === 'EN' ? 'Appointment request submitted!' : 'Demande de rendez-vous envoyée !' });
            setSelectedDoctorId(''); setBookingDate(''); setBookingSlot('09:00 - 09:30');
            setBookingSymptoms(''); setBookingNotes(''); setShowBookingForm(false);
            fetchConsultationData();
        } catch (err) {
            setBookingMessage({ type: 'error', text: lang === 'EN' ? 'Failed to request appointment.' : 'Échec de la demande.' });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Check birthday
    const isBirthday = () => {
        if (!medicalRecord?.birth_date) return false;
        const today = new Date();
        const birth = new Date(medicalRecord.birth_date);
        return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
    };

    const getMenuItems = () => {
        const items = [
            { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Dashboard' : 'Tableau de bord', color: '#6366f1' },
            { id: 'emergency', icon: <FaAmbulance size={18} />, label: lang === 'EN' ? 'Emergency Steps' : "Étapes d'urgence", color: '#ef4444' },
            { id: 'drugs', icon: <FaCapsules size={18} />, label: lang === 'EN' ? 'Drug Information' : 'Médicaments', color: '#10b981' },
            { id: 'consultation', icon: <FaStethoscope size={18} />, label: lang === 'EN' ? 'Consult a Doctor' : 'Consulter un Médecin', color: '#3b82f6' },
            { id: 'ai', icon: <MdPsychology size={22} />, label: lang === 'EN' ? 'AI Health Assistant' : 'Assistant IA Santé', color: '#8b5cf6' },
            { id: 'education', icon: <FaNotesMedical size={18} />, label: lang === 'EN' ? 'Health Academy' : 'Académie Santé', color: '#f59e0b' },
        ];
        if (medicalRecord?.sex === 'female') {
            items.push({ id: 'womens_health', icon: <FaVenus size={18} />, label: lang === 'EN' ? "Women's Health" : 'Santé Féminine', color: '#f43f5e' });
        }
        items.push(
            { id: 'medical_record', icon: <FaNotesMedical size={18} />, label: lang === 'EN' ? 'Medical Record' : 'Dossier Médical', color: '#ec4899' },
            { id: 'profile', icon: <FaUser size={18} />, label: lang === 'EN' ? 'My Profile' : 'Mon Profil', color: '#14b8a6' }
        );
        return items;
    };

    const menuItems = getMenuItems();

    const getBmi = () => {
        if (!medicalRecord?.weight || !medicalRecord?.height) return null;
        const h = medicalRecord.height / 100;
        return (medicalRecord.weight / (h * h)).toFixed(1);
    };

    const getHealthTip = () => {
        const tips = [
            { EN: "Drink at least 1.5L of water daily — especially important in Cameroon's warm climate.", FR: "Buvez au moins 1,5L d'eau par jour — particulièrement important dans le climat chaud du Cameroun." },
            { EN: "A 15-minute walk after meals can significantly improve your cardiovascular health.", FR: "Une marche de 15 minutes après les repas peut améliorer significativement votre santé cardiovasculaire." },
            { EN: "Sleep 7-8 hours per night to allow your body to repair and restore energy.", FR: "Dormez 7 à 8 heures par nuit pour permettre à votre corps de récupérer et de restaurer son énergie." },
            { EN: "Wash your hands regularly — one of the most effective ways to prevent infections.", FR: "Lavez-vous régulièrement les mains — l'un des moyens les plus efficaces de prévenir les infections." },
            { EN: "Eat more fruits and vegetables — they provide essential vitamins and minerals your body needs.", FR: "Mangez plus de fruits et légumes — ils fournissent les vitamines et minéraux essentiels dont votre corps a besoin." },
        ];
        const day = new Date().getDay();
        return tips[day % tips.length];
    };

    const bmi = getBmi();
    const bmiColor = !bmi ? '#64748b' : bmi < 18.5 ? '#3b82f6' : bmi < 25 ? '#10b981' : bmi < 30 ? '#f59e0b' : '#ef4444';
    const bmiLabel = !bmi ? '' : bmi < 18.5 ? (lang === 'EN' ? 'Underweight' : 'Insuffisant') : bmi < 25 ? (lang === 'EN' ? 'Healthy' : 'Santé') : bmi < 30 ? (lang === 'EN' ? 'Overweight' : 'Surpoids') : (lang === 'EN' ? 'Obese' : 'Obésité');

    const renderActiveContent = () => {
        switch (activeMenu) {
            case 'emergency':
                return <FirstAidModule lang={lang} initialEmergency={selectedEmergencyId} clearInitialEmergency={() => setSelectedEmergencyId(null)} />;
            case 'drugs':
                return <MedicationModule lang={lang} />;
            case 'ai':
                return <TriageModule lang={lang} />;
            case 'education':
                return <HealthAcademyModule lang={lang} />;
            case 'medical_record':
                return <MedicalRecordModule lang={lang} />;
            case 'womens_health':
                return <WomensHealthModule lang={lang} />;
            case 'consultation':
                if (activeTeleconsultation) {
                    return (
                        <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.9)' }}>
                                <span style={{ color: 'white', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                                    {lang === 'EN' ? 'SECURE TELECONSULTATION' : 'TÉLÉCONSULTATION EN COURS'}
                                </span>
                                <button onClick={() => setActiveTeleconsultation(null)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                                    {lang === 'EN' ? 'Leave Call' : "Quitter l'appel"}
                                </button>
                            </div>
                            <JitsiMeeting
                                domain="meet.jit.si"
                                roomName={"AnasHealthCare-Appt-" + activeTeleconsultation.id}
                                configOverwrite={{ startWithAudioMuted: false, disableModeratorIndicator: true }}
                                userInfo={{ displayName: user.username }}
                                getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; iframeRef.style.border = 'none'; }}
                            />
                        </div>
                    );
                }
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaCalendarCheck color="#3b82f6" />
                                {lang === 'EN' ? 'My Appointments' : 'Mes Rendez-vous'}
                            </h3>
                            {loadingConsult ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px', color: '#64748b' }}>
                                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                                    <span style={{ fontSize: '0.85rem' }}>{lang === 'EN' ? 'Loading...' : 'Chargement...'}</span>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1' }}>
                                    {lang === 'EN' ? 'No appointments yet.' : 'Aucun rendez-vous.'}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {appointments.map((appt) => {
                                        const docName = appt.doctor_detail ? appt.doctor_detail.username : 'Doctor';
                                        const spec = appt.doctor_profile ? appt.doctor_profile.specialty : 'General Medicine';
                                        let badgeBg = '#fffbeb', badgeColor = '#d97706';
                                        if (appt.status === 'confirmed') { badgeBg = '#f0fdf4'; badgeColor = '#16a34a'; }
                                        else if (appt.status === 'completed') { badgeBg = '#eff6ff'; badgeColor = '#2563eb'; }
                                        else if (appt.status === 'declined') { badgeBg = '#fef2f2'; badgeColor = '#dc2626'; }
                                        return (
                                            <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '10px', background: '#f8fafc' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>Dr. {docName}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600 }}>{spec}</div>
                                                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>{appt.date} • {appt.time_slot}</div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                                                    <span style={{ background: badgeBg, color: badgeColor, padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700 }}>
                                                        {appt.status_display}
                                                    </span>
                                                    {appt.status === 'confirmed' && (
                                                        <button onClick={() => setActiveTeleconsultation(appt)} style={{ padding: '5px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                                                            {lang === 'EN' ? 'Join Video Call' : 'Rejoindre Vidéo'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaUserMd color="#3b82f6" />
                                {lang === 'EN' ? 'Book Consultation' : 'Prendre Rendez-vous'}
                            </h3>
                            {bookingMessage && (
                                <div style={{ padding: '10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, background: bookingMessage.type === 'success' ? '#f0fdf4' : '#fef2f2', color: bookingMessage.type === 'success' ? '#166534' : '#991b1b', border: "1px solid " + (bookingMessage.type === 'success' ? '#bbf7d0' : '#fecaca'), marginBottom: '12px' }}>
                                    {bookingMessage.text}
                                </div>
                            )}
                            {!showBookingForm ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {doctors.length === 0 ? (
                                        <div style={{ color: '#94a3b8', fontSize: '0.82rem', padding: '16px', textAlign: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
                                            {lang === 'EN' ? 'No verified doctors available yet.' : 'Aucun médecin vérifié disponible.'}
                                        </div>
                                    ) : doctors.map(doc => (
                                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: '10px', background: '#f8fafc' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>Dr. {doc.user_detail.username}</div>
                                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{doc.specialty}</div>
                                            </div>
                                            <button onClick={() => { setSelectedDoctorId(doc.user); setShowBookingForm(true); }} style={{ padding: '5px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                                                {lang === 'EN' ? 'Book' : 'Réserver'}
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => setShowBookingForm(true)} style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', fontFamily: 'Inter, sans-serif' }}>
                                        {lang === 'EN' ? '+ New Request' : '+ Nouvelle Demande'}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleBookAppointmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Doctor' : 'Médecin'}</label>
                                        <select value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', background: 'white' }}>
                                            <option value="">{lang === 'EN' ? 'Select a Doctor' : 'Choisir un médecin'}</option>
                                            {doctors.map(doc => (<option key={doc.id} value={doc.user}>Dr. {doc.user_detail.username} ({doc.specialty})</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Date</label>
                                        <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required style={{ width: '100%', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Time Slot' : 'Créneau'}</label>
                                        <select value={bookingSlot} onChange={e => setBookingSlot(e.target.value)} style={{ width: '100%', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', background: 'white' }}>
                                            <option>09:00 - 09:30</option>
                                            <option>10:00 - 10:30</option>
                                            <option>11:00 - 11:30</option>
                                            <option>14:00 - 14:30</option>
                                            <option>15:00 - 15:30</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>{lang === 'EN' ? 'Symptoms' : 'Symptômes'}</label>
                                        <textarea value={bookingSymptoms} onChange={e => setBookingSymptoms(e.target.value)} placeholder={lang === 'EN' ? "Describe your symptoms..." : "Décrivez vos symptômes..."} style={{ width: '100%', height: '60px', padding: '8px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button type="button" onClick={() => setShowBookingForm(false)} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
                                            {lang === 'EN' ? 'Cancel' : 'Annuler'}
                                        </button>
                                        <button type="submit" disabled={bookingLoading} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {bookingLoading && <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />}
                                            {lang === 'EN' ? 'Submit' : 'Envoyer'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                );

            case 'profile':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
                        <h2 style={{ color: '#1e293b', fontWeight: 800, margin: '0 0 24px', fontSize: '1.2rem' }}>
                            {lang === 'EN' ? 'My Profile' : 'Mon Profil'}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.8rem', fontWeight: 700 }}>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>{user?.username || 'User'}</h3>
                                <p style={{ margin: '4px 0 8px', color: '#64748b', fontSize: '0.84rem' }}>{user?.email || ''}</p>
                                <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                                    {lang === 'EN' ? 'Active Patient' : 'Patient Actif'}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                { label: lang === 'EN' ? 'Role' : 'Rôle', value: user?.role || 'patient' },
                                { label: 'BMI / IMC', value: bmi ? (bmi + ' — ' + bmiLabel) : (lang === 'EN' ? 'Not set' : 'Non défini') },
                                { label: lang === 'EN' ? 'Height' : 'Taille', value: medicalRecord?.height ? medicalRecord.height + ' cm' : '—' },
                                { label: lang === 'EN' ? 'Weight' : 'Poids', value: medicalRecord?.weight ? medicalRecord.weight + ' kg' : '—' },
                                { label: lang === 'EN' ? 'Allergies' : 'Allergies', value: medicalRecord?.allergies || (lang === 'EN' ? 'None' : 'Aucune') },
                                { label: lang === 'EN' ? 'Chronic Conditions' : 'Maladies Chroniques', value: medicalRecord?.chronic_illnesses || (lang === 'EN' ? 'None' : 'Aucune') },
                            ].map((item, i) => (
                                <div key={i} style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{item.label}</span>
                                    <div style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: 700 }}>{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'dashboard':
            default:
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Birthday banner */}
                        {isBirthday() && (
                            <div style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: '14px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <span style={{ fontSize: '2rem' }}>🎂</span>
                                <div>
                                    <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>
                                        {lang === 'EN' ? `Happy Birthday, ${user?.username}!` : `Joyeux anniversaire, ${user?.username} !`}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>
                                        {lang === 'EN' ? 'Wishing you great health and happiness today!' : 'Nous vous souhaitons santé et bonheur aujourd\'hui !'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Daily reminder */}
                        <DailyRemindersModule lang={lang} />

                        {/* Welcome banner */}
                        <div style={{ background: 'linear-gradient(135deg, #2619dd 0%, #a5a3c5 50%, #435586 100%)', borderRadius: '16px', padding: '28px 32px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px' }}>
                                        {lang === 'EN' ? 'How are you feeling today?' : "Comment vous sentez-vous aujourd'hui ?"}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', margin: 0, maxWidth: '380px', lineHeight: 1.6 }}>
                                        {lang === 'EN'
                                            ? 'Access emergency guidance, consult verified doctors, or use our AI health assistant.'
                                            : "Accédez aux urgences, consultez des médecins vérifiés ou utilisez notre assistant IA."}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => setActiveMenu('emergency')} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #ef4444, #f97316)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
                                        <FaAmbulance size={14} />
                                        {lang === 'EN' ? 'Emergency' : 'Urgence'}
                                    </button>
                                    <button onClick={() => setActiveMenu('ai')} style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: 'Inter, sans-serif' }}>
                                        <MdPsychology size={17} />
                                        {lang === 'EN' ? 'Ask AI' : "Demander à l'IA"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            {/* BMI Card */}
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MdHealthAndSafety color="#10b981" size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BMI / IMC</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: bmiColor, lineHeight: 1 }}>{bmi || '—'}</div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: bmiColor, marginTop: '4px' }}>{bmiLabel || (lang === 'EN' ? 'Complete profile' : 'Complétez le profil')}</div>
                                {medicalRecord?.height && medicalRecord?.weight && (
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>{medicalRecord.height}cm • {medicalRecord.weight}kg</div>
                                )}
                            </div>

                            {/* Emergency Card */}
                            <div onClick={() => setActiveMenu('emergency')} style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', borderRadius: '14px', padding: '20px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.25)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaAmbulance color="white" size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lang === 'EN' ? 'Emergency' : 'Urgence'}</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>24/7</div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{lang === 'EN' ? 'Always available offline' : 'Disponible hors ligne'}</div>
                            </div>

                            {/* Consultation Card */}
                            <div onClick={() => setActiveMenu('consultation')} style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', borderRadius: '14px', padding: '20px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(59,130,246,0.25)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaStethoscope color="white" size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{lang === 'EN' ? 'Doctors' : 'Médecins'}</span>
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>{doctors.length || '—'}</div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>{lang === 'EN' ? 'Verified specialists' : 'Spécialistes vérifiés'}</div>
                            </div>
                        </div>

                        {/* Quick actions + Health tip */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>

                            {/* Quick Actions */}
                            <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
                                <h3 style={{ margin: '0 0 14px', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '3px', height: '14px', background: 'linear-gradient(135deg, #6366f1, #10b981)', borderRadius: '2px' }} />
                                    {lang === 'EN' ? 'Quick Actions' : 'Actions Rapides'}
                                </h3>
                                {[
                                    { icon: <FaAmbulance size={16} />, color: '#ef4444', bg: '#fef2f2', label: lang === 'EN' ? 'Emergency First Aid' : 'Premiers Secours', id: 'emergency' },
                                    { icon: <FaCapsules size={16} />, color: '#10b981', bg: '#f0fdf4', label: lang === 'EN' ? 'Drug Information' : 'Informations Médicaments', id: 'drugs' },
                                    { icon: <FaStethoscope size={16} />, color: '#3b82f6', bg: '#eff6ff', label: lang === 'EN' ? 'Consult a Doctor' : 'Consulter un Médecin', id: 'consultation' },
                                    { icon: <MdPsychology size={18} />, color: '#8b5cf6', bg: '#f5f3ff', label: lang === 'EN' ? 'AI Health Assistant' : 'Assistant IA Santé', id: 'ai' },
                                    { icon: <FaHeartbeat size={16} />, color: '#f59e0b', bg: '#fffbeb', label: lang === 'EN' ? 'Health Academy' : 'Académie Santé', id: 'education' },
                                ].map((action, i) => (
                                    <div key={i} onClick={() => setActiveMenu(action.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: action.bg, borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.15s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                                <span style={{ color: action.color }}>{action.icon}</span>
                                            </div>
                                            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>{action.label}</span>
                                        </div>
                                        <FaChevronRight size={10} color="#cbd5e1" />
                                    </div>
                                ))}
                            </div>

                            {/* Right side: Health tip + Appointments summary */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* Health tip */}
                                <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '14px', padding: '20px', boxShadow: '0 4px 14px rgba(99,102,241,0.25)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <MdOutlineTipsAndUpdates color="white" size={16} />
                                        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            {lang === 'EN' ? "Today's Health Tip" : 'Conseil du Jour'}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'white', lineHeight: 1.7, fontWeight: 500 }}>
                                        {getHealthTip()[lang]}
                                    </p>
                                </div>

                                {/* Upcoming appointments */}
                                <div style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '1px solid #e2e8f0', flex: 1 }}>
                                    <h3 style={{ margin: '0 0 12px', fontSize: '0.88rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '7px' }}>
                                        <FaCalendarCheck color="#3b82f6" size={14} />
                                        {lang === 'EN' ? 'Upcoming Appointments' : 'Prochains Rendez-vous'}
                                    </h3>
                                    {appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length === 0 ? (
                                        <div style={{ color: '#94a3b8', fontSize: '0.78rem', textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                                            {lang === 'EN' ? 'No upcoming appointments.' : 'Aucun rendez-vous prévu.'}
                                        </div>
                                    ) : appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').slice(0, 2).map(appt => (
                                        <div key={appt.id} style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', marginBottom: '6px', borderLeft: '3px solid ' + (appt.status === 'confirmed' ? '#10b981' : '#f59e0b') }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>Dr. {appt.doctor_detail?.username}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{appt.date} • {appt.time_slot}</div>
                                        </div>
                                    ))}
                                    <button onClick={() => setActiveMenu('consultation')} style={{ width: '100%', marginTop: '8px', padding: '8px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                        {lang === 'EN' ? 'View All' : 'Voir Tout'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    if (loadingRecord) {
        return (
            <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f8fafc', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #6366f1', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                        {lang === 'EN' ? 'Loading your health space...' : 'Chargement de votre espace santé...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f8fafc' }}>
            {showOnboarding && (
                <OnboardingWizard lang={lang} setLang={setLang} onComplete={() => { fetchMedicalRecord(); }} />
            )}

            {/* SIDEBAR */}
            <div style={{ width: '240px', flexShrink: 0, background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, boxShadow: '2px 0 8px rgba(0,0,0,0.04)' }}>

                {/* Logo */}
<div style={{ padding: '20px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img src="/logo.svg" alt="AnasHealthcare" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
    <div>
        <div style={{ fontWeight: 800, fontSize: '0.88rem', background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AnasHealthcare
        </div>
        <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 500 }}>
            {lang === 'EN' ? 'Patient Portal' : 'Portail Patient'}
        </div>
    </div>
</div>
                {/* User info */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FaUser size={14} color="white" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username || 'User'}</div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '1px 7px', fontSize: '0.6rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }} />
                            Patient
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 10px', overflowY: 'auto' }}>
                    {menuItems.map((item) => (
                        <div key={item.id} onClick={() => { setActiveMenu(item.id); setSelectedEmergencyId(null); }}
                            onMouseEnter={e => { if (activeMenu !== item.id) { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderLeft = '3px solid ' + item.color; } }}
                            onMouseLeave={e => { if (activeMenu !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = '3px solid transparent'; } }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', cursor: 'pointer', background: activeMenu === item.id ? (item.color + '15') : 'transparent', borderRadius: '9px', marginBottom: '3px', borderLeft: activeMenu === item.id ? ('3px solid ' + item.color) : '3px solid transparent', transition: 'all 0.15s' }}>
                            <span style={{ color: activeMenu === item.id ? item.color : '#334155', display: 'flex' }}>{item.icon}</span>
                            <span style={{ fontSize: '0.86rem', fontWeight: activeMenu === item.id ? 700 : 600, color: activeMenu === item.id ? item.color : '#1e293b' }}>{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '12px 10px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, fontSize: '0.84rem', fontFamily: 'Inter, sans-serif' }}>
                        <FaSignOutAlt size={13} />
                        {lang === 'EN' ? 'Logout' : 'Déconnexion'}
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', paddingBottom: '80px', boxSizing: 'border-box' }}>

                {/* Top header */}
                <div style={{ background: 'white', padding: '14px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                            {lang === 'EN' ? 'Good day, ' : 'Bonjour, '}<span style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.username || 'User'}</span>
                        </h1>
                        <p style={{ color: '#475569', fontSize: '0.78rem', margin: '2px 0 0', fontWeight: 500 }}>
                            {lang === 'EN' ? 'Welcome to your personal health dashboard' : 'Bienvenue sur votre tableau de bord santé'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch size={12} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input type="text" placeholder={lang === 'EN' ? 'Search...' : 'Rechercher...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: '8px 12px 8px 30px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', outline: 'none', width: '160px', fontFamily: 'Inter, sans-serif', background: '#f8fafc', color: '#1e293b' }} />
                        </div>
                        <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                            <FaBell size={14} color="#475569" />
                            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#ef4444', borderRadius: '50%', border: '2px solid white' }} />
                        </div>
                        <button onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')} style={{ background: 'white', border: '1.5px solid #6366f1', color: '#6366f1', borderRadius: '20px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif' }}>
                            {lang === 'EN' ? 'FR' : 'EN'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px 28px' }}>
                    {renderActiveContent()}
                </div>

                <SOSModule lang={lang} setActiveMenu={setActiveMenu} selectEmergency={(id) => { setSelectedEmergencyId(id); }} />
            </div>
        </div>
    );
};

export default UserDashboard;
