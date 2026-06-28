import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaAmbulance, FaUser,
    FaBell, FaSignOutAlt, FaChevronRight,
    FaSearch, FaNotesMedical, FaStethoscope,
    FaCapsules, FaVenus, FaBed, FaDumbbell, FaSpinner
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
    
    // Consultation states
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loadingConsult, setLoadingConsult] = useState(false);
    
    // Booking Form
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSlot, setBookingSlot] = useState('09:00 - 09:30');
    const [bookingSymptoms, setBookingSymptoms] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [bookingMessage, setBookingMessage] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Teleconsultation
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
        if (!storedUser) {
            navigate('/login');
            return;
        }
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
            console.error('Error fetching consultation space data:', err);
        } finally {
            setLoadingConsult(false);
        }
    };

    useEffect(() => {
        if (activeMenu === 'consultation') {
            fetchConsultationData();
        }
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
            await createAppointment({
                doctor: selectedDoctorId,
                date: bookingDate,
                time_slot: bookingSlot,
                symptoms: bookingSymptoms,
                notes: bookingNotes
            });
            setBookingMessage({ type: 'success', text: lang === 'EN' ? 'Appointment request submitted successfully!' : 'Demande de rendez-vous enregistrée !' });
            
            // Reset form
            setSelectedDoctorId('');
            setBookingDate('');
            setBookingSlot('09:00 - 09:30');
            setBookingSymptoms('');
            setBookingNotes('');
            setShowBookingForm(false);
            
            // Reload list
            fetchConsultationData();
        } catch (err) {
            console.error('Error creating appointment:', err);
            setBookingMessage({ type: 'error', text: lang === 'EN' ? 'Failed to request appointment. Try again.' : 'Échec de la demande.' });
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

    // Move menuItems inside the component to render dynamically based on medicalRecord sex field
    const getMenuItems = () => {
        const items = [
            { id: 'dashboard', icon: <MdDashboard size={20} />, label: lang === 'EN' ? 'Dashboard' : 'Tableau de bord', color: '#6366f1' },
            { id: 'emergency', icon: <FaAmbulance size={18} />, label: lang === 'EN' ? 'Emergency Steps' : "Étapes d'urgence", color: '#ef4444' },
            { id: 'drugs', icon: <FaCapsules size={18} />, label: lang === 'EN' ? 'Drug Information' : 'Médicaments', color: '#10b981' },
            { id: 'consultation', icon: <FaStethoscope size={18} />, label: lang === 'EN' ? 'Consult a Doctor' : 'Consulter un Médecin', color: '#3b82f6' },
            { id: 'ai', icon: <MdPsychology size={22} />, label: lang === 'EN' ? 'AI Health Assistant' : 'Assistant IA Santé', color: '#8b5cf6' },
            { id: 'education', icon: <FaNotesMedical size={18} />, label: lang === 'EN' ? 'Health Academy' : 'Académie Santé', color: '#f59e0b' },
        ];

        // Conditional inclusion for Women's Health
        if (medicalRecord?.sex === 'female') {
            items.push({ 
                id: 'womens_health', 
                icon: <FaVenus size={18} />, 
                label: lang === 'EN' ? "Women's Health" : 'Santé Féminine', 
                color: '#f43f5e' 
            });
        }

        items.push(
            { id: 'medical_record', icon: <FaNotesMedical size={18} />, label: lang === 'EN' ? 'Medical Record' : 'Dossier Médical', color: '#ec4899' },
            { id: 'profile', icon: <FaUser size={18} />, label: lang === 'EN' ? 'My Profile' : 'Mon Profil', color: '#14b8a6' }
        );
        return items;
    };

    const menuItems = getMenuItems();

    const getQuickStats = () => {
        const stats = [];
        
        // 1. Emergency card is always here
        stats.push({
            icon: <FaAmbulance size={26} />,
            bg: 'linear-gradient(135deg, #ef4444, #f97316)',
            label: lang === 'EN' ? 'Emergency Guidance' : "Guide d'urgence",
            value: '24/7',
            desc: lang === 'EN' ? 'Always available offline' : 'Toujours disponible hors ligne',
            shadow: 'rgba(239,68,68,0.3)',
            id: 'emergency'
        });

        // Parse goals
        const goals = medicalRecord?.health_goals ? JSON.parse(medicalRecord.health_goals) : [];

        // 2. BMI and Activity card if stats exist
        if (medicalRecord?.weight && medicalRecord?.height) {
            const hM = medicalRecord.height / 100;
            const bmiVal = (medicalRecord.weight / (hM * hM)).toFixed(1);
            stats.push({
                icon: <MdHealthAndSafety size={26} />,
                bg: 'linear-gradient(135deg, #0d9488, #0f766e)',
                label: lang === 'EN' ? 'Body Mass Index (BMI)' : 'Indice de Masse Corporelle (IMC)',
                value: bmiVal,
                desc: lang === 'EN' 
                    ? `Height: ${medicalRecord.height}cm | Weight: ${medicalRecord.weight}kg` 
                    : `Taille: ${medicalRecord.height}cm | Poids: ${medicalRecord.weight}kg`,
                shadow: 'rgba(13,148,136,0.3)',
                id: 'medical_record'
            });
        }

        // 3. Sleep stat card if sleep goal is active
        if (goals.includes('sleep') && medicalRecord?.sleep_hours) {
            stats.push({
                icon: <FaBed size={26} />,
                bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                label: lang === 'EN' ? 'Average Sleep' : 'Sommeil moyen',
                value: `${medicalRecord.sleep_hours}h`,
                desc: lang === 'EN' 
                    ? `Quality: ${medicalRecord.sleep_quality || 'Good'}` 
                    : `Qualité : ${medicalRecord.sleep_quality === 'poor' ? 'Mauvais' : medicalRecord.sleep_quality === 'average' ? 'Moyen' : 'Réparateur'}`,
                shadow: 'rgba(59,130,246,0.3)',
                id: 'medical_record'
            });
        }

        // 4. Chronic illnesses tracking card if user has chronic illnesses or goals
        if (medicalRecord?.chronic_illnesses || goals.includes('chronic')) {
            stats.push({
                icon: <FaNotesMedical size={26} />,
                bg: 'linear-gradient(135deg, #ec4899, #be185d)',
                label: lang === 'EN' ? 'Chronic Care' : 'Suivi Chronique',
                value: lang === 'EN' ? 'Active' : 'Actif',
                desc: medicalRecord?.chronic_illnesses 
                    ? `${medicalRecord.chronic_illnesses.substring(0, 25)}${medicalRecord.chronic_illnesses.length > 25 ? '...' : ''}`
                    : (lang === 'EN' ? 'Monitor conditions' : 'Suivi de pathologie'),
                shadow: 'rgba(236,72,153,0.3)',
                id: 'medical_record'
            });
        }

        // 5. Sports and activity if fitness/sports objectives
        if (goals.includes('fitness') || goals.includes('lose_weight') || medicalRecord?.physical_activity) {
            const freq = medicalRecord?.sports_frequency ? `${medicalRecord.sports_frequency}x/wk` : '';
            stats.push({
                icon: <FaDumbbell size={26} />,
                bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
                label: lang === 'EN' ? 'Physical Activity' : 'Activité Physique',
                value: medicalRecord?.physical_activity 
                    ? (medicalRecord.physical_activity === 'none' ? 'None' : medicalRecord.physical_activity === 'occasional' ? 'Occasional' : medicalRecord.physical_activity === 'regular' ? 'Regular' : 'Intensive')
                    : 'Active',
                desc: lang === 'EN' ? `Sports frequency: ${freq || 'N/A'}` : `Fréquence sport : ${freq || 'N/A'}`,
                shadow: 'rgba(245,158,11,0.3)',
                id: 'medical_record'
            });
        }

        // Fillers if stats count is low
        if (stats.length < 4) {
            stats.push({
                icon: <FaCapsules size={26} />,
                bg: 'linear-gradient(135deg, #10b981, #34d399)',
                label: lang === 'EN' ? 'Drug Database' : 'Base Médicaments',
                value: lang === 'EN' ? 'Search' : 'Chercher',
                desc: lang === 'EN' ? 'Dosages & precautions' : 'Dosages et précautions',
                shadow: 'rgba(16,185,129,0.3)',
                id: 'drugs'
            });
        }

        if (stats.length < 4) {
            stats.push({
                icon: <MdPsychology size={30} />,
                bg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                label: lang === 'EN' ? 'AI Assistant' : 'Assistant IA',
                value: 'AI',
                desc: lang === 'EN' ? 'Daily health tips' : 'Conseils santé quotidiens',
                shadow: 'rgba(139,92,246,0.3)',
                id: 'ai'
            });
        }

        return stats.slice(0, 4);
    };

    const quickStats = getQuickStats();

    const getHealthTip = () => {
        const goals = medicalRecord?.health_goals ? JSON.parse(medicalRecord.health_goals) : [];
        if (goals.includes('chronic')) {
            return {
                EN: "Ensure you check your key indicators (blood pressure or glucose) regularly and log them. Always take your treatments at fixed hours.",
                FR: "Pensez à mesurer régulièrement vos indicateurs clés (tension ou glycémie) et à les noter. Prenez vos traitements à heures fixes."
            };
        }
        if (goals.includes('sleep')) {
            return {
                EN: "Try to avoid screen time at least 45 minutes before sleep. Keeping your bedroom dark and cool improves rest quality.",
                FR: "Évitez les écrans au moins 45 minutes avant de dormir. Une chambre sombre et fraîche favorise un sommeil réparateur."
            };
        }
        if (goals.includes('stress')) {
            return {
                EN: "Take 3 minutes today to practice slow diaphragmatic breathing: breathe in for 4 seconds, hold for 4, and breathe out for 4.",
                FR: "Prenez 3 minutes aujourd'hui pour pratiquer la respiration abdominale : inspirez sur 4 secondes, bloquez 4, et expirez sur 4."
            };
        }
        if (goals.includes('lose_weight')) {
            return {
                EN: "Focus on fiber-rich whole foods and proteins. Staying well-hydrated helps regulate appetite naturally.",
                FR: "Privilégiez les aliments complets riches en fibres et les protéines. Boire suffisamment d'eau aide à réguler l'appétit."
            };
        }
        if (goals.includes('gain_weight')) {
            return {
                EN: "Incorporate healthy calorie-dense foods like avocados, nuts, and clean protein sources into your snacks.",
                FR: "Intégrez des aliments sains et caloriques comme les avocats, les oléagineux et les protéines dans vos collations."
            };
        }
        if (goals.includes('fitness')) {
            return {
                EN: "Consistency beats intensity. Even a brisk 15-minute walk today maintains your cardiovascular progress.",
                FR: "La régularité prime sur l'intensité. Même une marche rapide de 15 minutes aujourd'hui préserve vos progrès."
            };
        }
        if (goals.includes('pregnancy')) {
            return {
                EN: "Stay well hydrated and emphasize foods rich in folate and iron. Soft, low-impact exercise like walking is ideal.",
                FR: "Hydratez-vous bien et privilégiez les aliments riches en folates et en fer. Une activité douce comme la marche est idéale."
            };
        }
        return {
            EN: "Drink at least 1.5L of water daily — especially important in Cameroon's warm climate.",
            FR: "Buvez au moins 1,5L d'eau par jour — important dans le climat chaud du Cameroun."
        };
    };

    const quickActions = [
        { icon: <FaAmbulance size={20} />, color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: lang === 'EN' ? 'View Emergency First Aid Steps' : "Voir les étapes de premiers secours", id: 'emergency' },
        { icon: <FaCapsules size={20} />, color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', label: lang === 'EN' ? 'Search Drug Information & Dosages' : 'Rechercher médicaments et dosages', id: 'drugs' },
        { icon: <FaStethoscope size={20} />, color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: lang === 'EN' ? 'Request a Doctor Consultation' : 'Demander une consultation médicale', id: 'consultation' },
        { icon: <MdPsychology size={22} />, color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', label: lang === 'EN' ? 'Chat with AI Health Assistant' : "Discuter avec l'assistant IA santé", id: 'ai' },
        { icon: <FaNotesMedical size={20} />, color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: lang === 'EN' ? 'Browse Health Academy Lessons' : "Parcourir les cours de l'Académie Santé", id: 'education' },
    ];

    const recentActivities = [
        { icon: <FaAmbulance size={14} />, color: '#ef4444', bg: '#fef2f2', text: lang === 'EN' ? 'Viewed emergency steps for high fever' : "Consulté les étapes d'urgence pour la fièvre", time: lang === 'EN' ? '2 hours ago' : 'Il y a 2 heures' },
        { icon: <FaCapsules size={14} />, color: '#10b981', bg: '#f0fdf4', text: lang === 'EN' ? 'Searched Paracetamol — dosage and uses' : 'Recherché Paracétamol — dosage et utilisations', time: lang === 'EN' ? '5 hours ago' : 'Il y a 5 heures' },
        { icon: <FaStethoscope size={14} />, color: '#3b82f6', bg: '#eff6ff', text: lang === 'EN' ? 'Consultation request sent to Dr. Mbeki' : 'Demande envoyée au Dr. Mbeki', time: lang === 'EN' ? '1 day ago' : 'Il y a 1 jour' },
        { icon: <MdPsychology size={16} />, color: '#8b5cf6', bg: '#f5f3ff', text: lang === 'EN' ? 'Asked AI about malaria prevention tips' : "Demandé à l'IA des conseils sur la prévention du paludisme", time: lang === 'EN' ? '2 days ago' : 'Il y a 2 jours' },
    ];

    const notifications = [
        {
            icon: <FaAmbulance size={18} />,
            color: '#ef4444', bg: '#fef2f2', border: '#fecaca',
            title: lang === 'EN' ? 'Emergency Reminder' : 'Rappel Urgence',
            desc: lang === 'EN' ? 'Save emergency contacts and first aid steps for offline access.' : "Sauvegardez les contacts d'urgence et les étapes de premiers secours hors ligne."
        },
        {
            icon: <FaCapsules size={18} />,
            color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0',
            title: lang === 'EN' ? 'Medication Reminder' : 'Rappel Médicament',
            desc: lang === 'EN' ? 'Never take medications without checking dosage and precautions first.' : 'Ne prenez jamais de médicaments sans vérifier le dosage et les précautions.'
        },
        {
            icon: <MdHealthAndSafety size={20} />,
            color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe',
            title: lang === 'EN' ? 'AI Health Tip' : 'Conseil IA Santé',
            desc: lang === 'EN' ? 'Ask our AI assistant about malaria prevention during the rainy season in Cameroon.' : "Demandez à notre assistant IA des conseils sur la prévention du paludisme."
        },
    ];

    const renderActiveContent = () => {
        switch (activeMenu) {
            case 'emergency':
                return (
                    <FirstAidModule 
                        lang={lang} 
                        initialEmergency={selectedEmergencyId} 
                        clearInitialEmergency={() => setSelectedEmergencyId(null)} 
                    />
                );
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
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                                    {lang === 'EN' ? 'SECURE TELECONSULTATION' : 'TÉLÉCONSULTATION EN COURS'}
                                </span>
                                <button onClick={() => setActiveTeleconsultation(null)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                                    {lang === 'EN' ? 'Leave Call' : 'Quitter l\'appel'}
                                </button>
                            </div>
                            <JitsiMeeting
                                domain="meet.jit.si"
                                roomName={`AnasHealthCare-Appt-${activeTeleconsultation.id}`}
                                configOverwrite={{ startWithAudioMuted: false, disableModeratorIndicator: true, startScreenSharing: false, enableEmailInStats: false }}
                                interfaceConfigOverwrite={{ DISABLE_JOIN_LEAVE_NOTIFICATIONS: true }}
                                userInfo={{ displayName: user.username }}
                                getIFrameRef={(iframeRef) => { iframeRef.style.height = '100%'; iframeRef.style.width = '100%'; iframeRef.style.border = 'none'; }}
                            />
                        </div>
                    );
                }
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start', fontFamily: "'Inter', sans-serif" }}>
                        {/* Left Column: My Appointments List */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1.1rem' }}>
                                📅 {lang === 'EN' ? 'My Consultations & Bookings' : 'Mes Rendez-vous & Consultations'}
                            </h3>
                            
                            {loadingConsult ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px', color: '#64748b' }}>
                                    <FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                                    <span>{lang === 'EN' ? 'Loading consultations history...' : 'Chargement des rendez-vous...'}</span>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div style={{ color: '#64748b', fontSize: '0.85rem', padding: '20px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1' }}>
                                    {lang === 'EN' ? 'No appointments requested yet.' : 'Aucun rendez-vous planifié.'}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {appointments.map((appt) => {
                                        const docName = appt.doctor_detail ? appt.doctor_detail.username : 'Doctor';
                                        const spec = appt.doctor_profile ? appt.doctor_profile.specialty : 'General Medicine';
                                        
                                        // Colors based on status
                                        let badgeBg = '#fffbeb';
                                        let badgeColor = '#d97706';
                                        if (appt.status === 'confirmed') {
                                            badgeBg = '#f0fdf4';
                                            badgeColor = '#16a34a';
                                        } else if (appt.status === 'completed') {
                                            badgeBg = '#eff6ff';
                                            badgeColor = '#2563eb';
                                        } else if (appt.status === 'declined') {
                                            badgeBg = '#fef2f2';
                                            badgeColor = '#dc2626';
                                        }

                                        return (
                                            <div key={appt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '12px', background: '#f8fafc' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>
                                                        Dr. {docName}
                                                    </div>
                                                    <div style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 600, marginTop: '2px' }}>
                                                        {spec}
                                                    </div>
                                                    <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                                                        {appt.date} ({appt.time_slot})
                                                    </div>
                                                    {appt.symptoms && (
                                                        <div style={{ fontSize: '0.72rem', color: '#475569', background: 'white', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '6px' }}>
                                                            {appt.symptoms}
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <span style={{ background: badgeBg, color: badgeColor, border: `1px solid ${badgeColor}40`, padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' }}>
                                                        {appt.status_display}
                                                    </span>
                                                    {appt.status === 'confirmed' && (
                                                        <button
                                                            onClick={() => setActiveTeleconsultation(appt)}
                                                            style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 4px rgba(59,130,246,0.3)' }}
                                                        >
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

                        {/* Right Column: Book New Appointment Form */}
                        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaStethoscope color="#3b82f6" />
                                {lang === 'EN' ? 'Request Consultation' : 'Prendre Rendez-vous'}
                            </h3>

                            {bookingMessage && (
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontSize: '0.78rem',
                                    fontWeight: 600,
                                    background: bookingMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                    color: bookingMessage.type === 'success' ? '#166534' : '#991b1b',
                                    border: `1px solid ${bookingMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                                    marginBottom: '16px'
                                }}>
                                    {bookingMessage.text}
                                </div>
                            )}

                            {!showBookingForm ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                                        {lang === 'EN'
                                            ? 'Connect with our network of verified medical professionals. Book a secure teleconsultation or physical appointment.'
                                            : 'Entrez en relation avec nos médecins vérifiés. Planifiez une consultation physique ou une téléconsultation.'}
                                    </p>
                                    
                                    {/* List of Doctors */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                                        {doctors.length === 0 ? (
                                            <div style={{ color: '#94a3b8', fontSize: '0.78rem', fontStyle: 'italic' }}>
                                                {lang === 'EN' ? 'No verified practitioners online.' : 'Aucun praticien vérifié disponible.'}
                                            </div>
                                        ) : (
                                            doctors.map(doc => (
                                                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #cbd5e1', padding: '10px 12px', borderRadius: '10px', background: '#f8fafc' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>Dr. {doc.user_detail.username}</div>
                                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{doc.specialty} {doc.establishment_detail && `• ${doc.establishment_detail.name}`}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDoctorId(doc.user);
                                                            setShowBookingForm(true);
                                                        }}
                                                        style={{ padding: '4px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                                                    >
                                                        {lang === 'EN' ? 'Select' : 'Choisir'}
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setShowBookingForm(true)}
                                        style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.84rem' }}
                                    >
                                        {lang === 'EN' ? 'New Request' : 'Nouvelle Demande'}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleBookAppointmentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    
                                    {/* Select Doctor */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                            {lang === 'EN' ? 'Practitioner' : 'Médecin / Praticien'}
                                        </label>
                                        <select
                                            value={selectedDoctorId}
                                            onChange={e => setSelectedDoctorId(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', background: 'white' }}
                                        >
                                            <option value="">{lang === 'EN' ? 'Select a Doctor' : 'Sélectionner un Médecin'}</option>
                                            {doctors.map(doc => (
                                                <option key={doc.id} value={doc.user}>Dr. {doc.user_detail.username} ({doc.specialty})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={bookingDate}
                                            onChange={e => setBookingDate(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '8px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem' }}
                                        />
                                    </div>

                                    {/* Slot */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                            {lang === 'EN' ? 'Time Slot' : 'Créneau horaire'}
                                        </label>
                                        <select
                                            value={bookingSlot}
                                            onChange={e => setBookingSlot(e.target.value)}
                                            style={{ width: '100%', padding: '8px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', background: 'white' }}
                                        >
                                            <option value="09:00 - 09:30">09:00 - 09:30</option>
                                            <option value="10:00 - 10:30">10:00 - 10:30</option>
                                            <option value="11:00 - 11:30">11:00 - 11:30</option>
                                            <option value="14:00 - 14:30">14:00 - 14:30</option>
                                            <option value="15:00 - 15:30">15:00 - 15:30</option>
                                        </select>
                                    </div>

                                    {/* Symptoms */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                                            {lang === 'EN' ? 'Symptoms Description' : 'Description des symptômes'}
                                        </label>
                                        <textarea
                                            value={bookingSymptoms}
                                            onChange={e => setBookingSymptoms(e.target.value)}
                                            placeholder={lang === 'EN' ? "Fever, cough, body pain..." : "Fièvre, toux, courbatures..."}
                                            style={{ width: '100%', height: '50px', padding: '8px', border: '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', resize: 'none', fontFamily: 'inherit' }}
                                        />
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '6px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setShowBookingForm(false)}
                                            style={{ padding: '8px 16px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            {lang === 'EN' ? 'Cancel' : 'Annuler'}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={bookingLoading}
                                            style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                                        >
                                            {bookingLoading && <FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} />}
                                            {lang === 'EN' ? 'Submit Request' : 'Soumettre'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                    </div>
                );
            case 'profile':
                return (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ color: '#1e293b', fontWeight: 800, margin: '0 0 20px' }}>
                            {lang === 'EN' ? 'My Profile' : 'Mon Profil'}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 700 }}>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800 }}>{user?.username || 'User'}</h3>
                                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>{user?.email || ''}</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
                            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{lang === 'EN' ? 'Role' : 'Rôle'}</span>
                                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 700, marginTop: '2px' }}>{user?.role || 'patient'}</div>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{lang === 'EN' ? 'Account Status' : 'Statut du Compte'}</span>
                                <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>{lang === 'EN' ? 'Active' : 'Actif'}</div>
                            </div>
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <>
                    
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
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            width: '24px', height: '24px',
                                            background: 'rgba(255,255,255,0.12)',
                                            borderRadius: '6px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <MdLocalHospital color="#a5b4fc" size={16} />
                                        </div>
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500 }}>
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
                                <div key={i} onClick={() => stat.id && setActiveMenu(stat.id)} style={{
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
                                                display: 'flex', alignItems: 'center', justify: 'center',
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
                                            {lang === 'EN' ? "Today's Health Tip" : "Conseil du Jour"}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'white', lineHeight: 1.7, fontWeight: 500 }}>
                                        {getHealthTip()[lang]}
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
                                {notifications.map((notif, i) => (
                                    <div key={i} style={{
                                        background: notif.bg,
                                        border: `1px solid ${notif.border}`,
                                        borderRadius: '12px', padding: '1rem 1.1rem',
                                        display: 'flex', alignItems: 'flex-start', gap: '10px'
                                    }}>
                                        <div style={{
                                            width: '38px', height: '38px', background: 'white',
                                            borderRadius: '10px', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                                        }}>
                                            <span style={{ color: notif.color }}>{notif.icon}</span>
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: '0.85rem', fontWeight: 700,
                                                color: '#0f172a', marginBottom: '0.3rem',
                                                display: 'flex', alignItems: 'center', gap: '6px'
                                            }}>
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
                    </>
                );
        }
    };

    if (loadingRecord) {
        return (
            <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f8fafc', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spin" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTop: '4px solid #6366f1', borderRadius: '50%', margin: '0 auto 16px' }} />
                    <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                        {lang === 'EN' ? 'Loading health spaces...' : 'Chargement des espaces santé...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>
            {showOnboarding && (
                <OnboardingWizard 
                    lang={lang} 
                    onComplete={() => {
                        fetchMedicalRecord();
                    }} 
                />
            )}

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
                            background: '#f0fdf4', border: '1px solid #bbf7d0',
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
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => {
                                setActiveMenu(item.id);
                                setSelectedEmergencyId(null);
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
            <div style={{ marginLeft: '260px', flex: 1, position: 'relative', minHeight: '100vh', paddingBottom: '100px', boxSizing: 'border-box' }}>

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
                            <MdHealthAndSafety size={22} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                {lang === 'EN'
                                    ? `Good day, ${user?.username || 'User'}`
                                    : `Bonjour, ${user?.username || 'User'}`}
                            </h1>
                            <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.1rem 0 0' }}>
                                {lang === 'EN' ? 'Welcome to your personal health dashboard' : 'Bienvenue sur votre tableau de bord santé personnel'}
                            </p>
                        </div>
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

                {/* Dashboard active view */}
                <div style={{ padding: '1.6rem 2rem' }}>
                    {renderActiveContent()}
                </div>

                {/* SOS Floating Action Widget */}
                <SOSModule 
                    lang={lang} 
                    setActiveMenu={setActiveMenu} 
                    selectEmergency={(id) => {
                      setSelectedEmergencyId(id);
                    }} 
                />

            </div>
        </div>
    );
};

export default UserDashboard;