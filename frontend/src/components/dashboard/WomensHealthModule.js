/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaTint, FaSmile, FaSpinner, 
  FaCheckCircle, FaBaby, FaHeart, FaChevronLeft, 
  FaChevronRight, FaPlus, FaBookMedical, FaCalendarDay 
} from 'react-icons/fa';
import { 
  getWomensHealthProfile, 
  updateWomensHealthProfile, 
  getCycleLogs, 
  createCycleLog 
} from '../../services/api';

const MOODS = [
  { id: 'calm', label: { EN: 'Calm', FR: 'Calme' }, emoji: '🧘' },
  { id: 'happy', label: { EN: 'Happy', FR: 'Heureuse' }, emoji: '😊' },
  { id: 'sad', label: { EN: 'Sad', FR: 'Triste' }, emoji: '😢' },
  { id: 'irritable', label: { EN: 'Irritable', FR: 'Irritable' }, emoji: '😠' },
  { id: 'anxious', label: { EN: 'Anxious', FR: 'Anxieuse' }, emoji: '😰' },
  { id: 'energetic', label: { EN: 'Energetic', FR: 'Pleine d\'énergie' }, emoji: '⚡' },
];

const COMMON_SYMPTOMS = [
  { id: 'cramps', label: { EN: 'Cramps', FR: 'Crampes' } },
  { id: 'headache', label: { EN: 'Headache', FR: 'Maux de tête' } },
  { id: 'bloating', label: { EN: 'Bloating', FR: 'Ballonnements' } },
  { id: 'acne', label: { EN: 'Acne', FR: 'Acné' } },
  { id: 'tender_breasts', label: { EN: 'Tender Breasts', FR: 'Seins douloureux' } },
  { id: 'backache', label: { EN: 'Backache', FR: 'Mal de dos' } },
];

const WEEKDAYS = {
  EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  FR: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
};

const MONTHS = {
  EN: [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  FR: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
};

const WomensHealthModule = ({ lang }) => {
  const [profile, setProfile] = useState({
    is_enabled: true,
    last_period_date: '',
    cycle_length: 28,
    period_duration: 5,
  });

  const [logs, setLogs] = useState([]);
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Log form states
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [painLevel, setPainLevel] = useState('none');
  const [fatigue, setFatigue] = useState('none');
  const [mood, setMood] = useState('calm');
  const [flow, setFlow] = useState('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [logMessage, setLogMessage] = useState(null);
  
  // Pregnancy mode (Stub)
  const [pregnancyMode, setPregnancyMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await getWomensHealthProfile();
      if (profileRes.data) {
        setProfile(profileRes.data);
      }
      
      const logsRes = await getCycleLogs();
      if (logsRes.data) {
        setLogs(logsRes.data);
      }
    } catch (err) {
      console.error('Error fetching women\'s health data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      await updateWomensHealthProfile(profile);
      setProfileMessage({ type: 'success', text: lang === 'EN' ? 'Settings updated successfully!' : 'Paramètres enregistrés avec succès !' });
      
      const logsRes = await getCycleLogs();
      setLogs(logsRes.data);
    } catch (err) {
      console.error('Error saving profile settings:', err);
      setProfileMessage({ type: 'error', text: lang === 'EN' ? 'Failed to update settings.' : 'Échec de l\'enregistrement.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSavingLog(true);
    setLogMessage(null);
    try {
      const payload = {
        date: logDate,
        pain_level: painLevel,
        fatigue,
        mood,
        flow,
        symptoms: JSON.stringify(selectedSymptoms),
        notes
      };
      await createCycleLog(payload);
      setLogMessage({ type: 'success', text: lang === 'EN' ? 'Symptom log added successfully!' : 'Symptômes enregistrés avec succès !' });
      
      const logsRes = await getCycleLogs();
      setLogs(logsRes.data);
    } catch (err) {
      console.error('Error creating cycle log:', err);
      setLogMessage({ type: 'error', text: lang === 'EN' ? 'Failed to save daily symptoms.' : 'Échec de l\'enregistrement des symptômes.' });
    } finally {
      setSavingLog(false);
    }
  };

  const handleSymptomToggle = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  // Check the status of a specific day (Returns: 'period', 'ovulation', 'fertile', or 'none')
  const getDayStatus = (date) => {
    if (!profile.last_period_date) return 'none';
    const lastPeriod = new Date(profile.last_period_date);
    lastPeriod.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - lastPeriod.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const cycleLength = parseInt(profile.cycle_length) || 28;
    const periodDuration = parseInt(profile.period_duration) || 5;

    // Modulo math to calculate cycle iterations forward and backward
    let remainder = diffDays % cycleLength;
    if (remainder < 0) {
      remainder += cycleLength;
    }

    if (remainder >= 0 && remainder < periodDuration) {
      return 'period';
    }

    const ovulationDay = cycleLength - 14;
    if (remainder === ovulationDay) {
      return 'ovulation';
    }

    if (remainder >= ovulationDay - 5 && remainder <= ovulationDay + 1) {
      return 'fertile';
    }

    return 'none';
  };

  const getLogForDate = (dateString) => {
    return logs.find(l => l.date === dateString);
  };

  const handleDayClick = (dateString) => {
    setLogDate(dateString);
    const existingLog = getLogForDate(dateString);
    if (existingLog) {
      setPainLevel(existingLog.pain_level);
      setFatigue(existingLog.fatigue);
      setMood(existingLog.mood);
      setFlow(existingLog.flow);
      setSelectedSymptoms(existingLog.symptoms ? JSON.parse(existingLog.symptoms) : []);
      setNotes(existingLog.notes || '');
    } else {
      setPainLevel('none');
      setFatigue('none');
      setMood('calm');
      setFlow('none');
      setSelectedSymptoms([]);
      setNotes('');
    }
  };

  // Calendar render functions
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Sun = 0, Mon = 1...
    
    const calendarCells = [];

    // Empty cells for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      calendarCells.push(<div key={`empty-${i}`} style={{ height: '54px' }} />);
    }

    // Days cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      // Format as YYYY-MM-DD
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const status = getDayStatus(dayDate);
      const isTodayString = new Date().toISOString().split('T')[0] === dateString;
      const isSelected = logDate === dateString;
      const dayLog = getLogForDate(dateString);

      // Styles based on cycle status
      let bg = 'white';
      let color = '#334155';
      let border = '1px solid #f1f5f9';
      let fontWeight = '500';

      if (status === 'period') {
        bg = '#ffe4e6'; // Rose
        color = '#be123c';
        border = '1px solid #fda4af';
        fontWeight = '700';
      } else if (status === 'ovulation') {
        bg = '#f5f3ff'; // Violet
        color = '#6d28d9';
        border = '1px solid #c084fc';
        fontWeight = '700';
      } else if (status === 'fertile') {
        bg = '#ecfdf5'; // Green-blue
        color = '#047857';
        border = '1px solid #6ee7b7';
        fontWeight = '600';
      }

      if (isSelected) {
        border = '2.5px solid #e11d48'; // Active choice
      }

      calendarCells.push(
        <div
          key={`day-${day}`}
          onClick={() => handleDayClick(dateString)}
          style={{
            height: '54px',
            background: bg,
            color: color,
            border: border,
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: fontWeight,
            position: 'relative',
            boxSizing: 'border-box',
            transition: 'all 0.15s',
            boxShadow: isTodayString ? 'inset 0 0 0 2px #3b82f6' : 'none'
          }}
          title={status !== 'none' ? `Status: ${status}` : ''}
        >
          {/* Day number */}
          <span>{day}</span>

          {/* Ovulation Flower/Heart tag */}
          {status === 'ovulation' && (
            <span style={{ fontSize: '0.6rem', position: 'absolute', top: '2px', right: '2px' }}>
              🌸
            </span>
          )}

          {/* Symptoms Indicators */}
          {dayLog && (
            <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '4px' }}>
              <span style={{ fontSize: '0.65rem' }}>
                {MOODS.find(m => m.id === dayLog.mood)?.emoji || '🧘'}
              </span>
              {dayLog.flow !== 'none' && (
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />
              )}
            </div>
          )}
        </div>
      );
    }

    return calendarCells;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <FaSpinner className="spin" size={36} color="#f43f5e" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Empathetic Top Intro Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        border: '1px solid #fecdd3',
        borderRadius: '20px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e',
            boxShadow: '0 4px 10px rgba(244,63,94,0.15)'
          }}>
            <FaHeart size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#9f1239', fontWeight: 800, fontSize: '1.25rem' }}>
              {lang === 'EN' ? "My Health Cycle & Calendar" : "Mon Calendrier & Cycle de Santé"}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#be123c', fontSize: '0.85rem', maxWidth: '500px', lineHeight: 1.5 }}>
              {lang === 'EN'
                ? "Track your physical symptoms, estimate your next cycle periods, and plan with absolute confidence."
                : "Suivez vos symptômes physiques, estimez vos prochaines règles et planifiez vos journées en toute confiance."}
            </p>
          </div>
        </div>

        {/* Dynamic Days Countdown */}
        {profile.last_period_date && (
          <div style={{
            background: 'white',
            padding: '10px 20px',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(244,63,94,0.1)',
            textAlign: 'center',
            border: '1px solid #ffe4e6'
          }}>
            <span style={{ display: 'block', fontSize: '0.68rem', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase' }}>
              {lang === 'EN' ? "Next Period countdown" : "Prochaines règles"}
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f43f5e' }}>
              {getDayStatus(new Date()) === 'period' ? (
                lang === 'EN' ? 'Ongoing' : 'En cours'
              ) : (
                `${getDayStatus(new Date()) === 'fertile' ? 'Fertile | ' : ''}Cycle Active`
              )}
            </span>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Visual Calendar & Profile Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* VISUAL INTERACTIVE CALENDAR */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            {/* Calendar Month Selector Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt color="#f43f5e" />
                {MONTHS[lang][currentMonth]} {currentYear}
              </h3>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handlePrevMonth}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #cbd5e1',
                    background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', transition: 'all 0.15s'
                  }}
                >
                  <FaChevronLeft size={10} />
                </button>
                <button
                  onClick={handleNextMonth}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #cbd5e1',
                    background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', transition: 'all 0.15s'
                  }}
                >
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>

            {/* Calendar Weekday Names header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
              {WEEKDAYS[lang].map((day, idx) => (
                <span key={idx} style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                  {day}
                </span>
              ))}
            </div>

            {/* Calendar Grid of days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {renderCalendarDays()}
            </div>

            {/* Calendar Legend Tag Keys */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', background: '#ffe4e6', border: '1px solid #fda4af', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>{lang === 'EN' ? 'Period' : 'Règles'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: '4px' }} />
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>{lang === 'EN' ? 'High Fertility' : 'Haute fertilité'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', background: '#f5f3ff', border: '1px solid #c084fc', borderRadius: '4px', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '-2px', right: '-1px', fontSize: '0.5rem' }}>🌸</span>
                </div>
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>{lang === 'EN' ? 'Ovulation Day' : "Jour d'ovulation"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '14px', height: '14px', border: '2.5px solid #e11d48', borderRadius: '4px', background: 'white' }} />
                <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>{lang === 'EN' ? 'Active Date' : 'Date sélectionnée'}</span>
              </div>
            </div>
          </div>

          {/* Profile Config Form */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBookMedical color="#cbd5e1" />
              {lang === 'EN' ? "Cycle Configuration" : "Configuration du Cycle"}
            </h3>

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? "First Day of Last Period" : "Premier jour des dernières règles"}
                </label>
                <input
                  type="date"
                  value={profile.last_period_date || ''}
                  onChange={e => setProfile({ ...profile, last_period_date: e.target.value })}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '8px',
                    border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.85rem'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {lang === 'EN' ? "Average Cycle Length (Days)" : "Durée moyenne du cycle (jours)"}
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="50"
                    value={profile.cycle_length || 28}
                    onChange={e => setProfile({ ...profile, cycle_length: parseInt(e.target.value) || 28 })}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '8px',
                      border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.85rem'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {lang === 'EN' ? "Average Period Duration (Days)" : "Durée moyenne des règles (jours)"}
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    value={profile.period_duration || 5}
                    onChange={e => setProfile({ ...profile, period_duration: parseInt(e.target.value) || 5 })}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '8px',
                      border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.85rem'
                    }}
                    required
                  />
                </div>
              </div>

              {profileMessage && (
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: profileMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: profileMessage.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${profileMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                  {profileMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  padding: '10px 16px',
                  background: '#f43f5e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(244,63,94,0.2)'
                }}
              >
                {savingProfile ? <FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : (lang === 'EN' ? 'Save Parameters' : 'Enregistrer les paramètres')}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Symptom Logger & Journal History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Symptom Logger Form */}
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPlus color="#f43f5e" />
              {lang === 'EN' ? "Log Daily Symptoms" : "Journal des Symptômes"}
            </h3>

            <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCalendarDay color="#f43f5e" />
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                {lang === 'EN' ? 'Selected Date:' : 'Date sélectionnée :'} <strong>{new Date(logDate).toLocaleDateString(lang === 'EN' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </span>
            </div>

            <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Date Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {lang === 'EN' ? "Log Date" : "Modifier la date"}
                </label>
                <input
                  type="date"
                  value={logDate}
                  onChange={e => handleDayClick(e.target.value)}
                  style={{
                    width: '100%', padding: '8px', borderRadius: '8px',
                    border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.8rem'
                  }}
                  required
                />
              </div>

              {/* Flow selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? "Menstrual Flow" : "Flux menstruel"}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'none', label: { EN: 'None', FR: 'Aucun' } },
                    { id: 'light', label: { EN: 'Light', FR: 'Léger' } },
                    { id: 'medium', label: { EN: 'Medium', FR: 'Moyen' } },
                    { id: 'heavy', label: { EN: 'Heavy', FR: 'Abondant' } }
                  ].map(f => {
                    const isSelected = flow === f.id;
                    return (
                      <button
                        key={f.id} type="button"
                        onClick={() => setFlow(f.id)}
                        style={{
                          padding: '8px 4px', border: `1.5px solid ${isSelected ? '#f43f5e' : '#cbd5e1'}`,
                          borderRadius: '8px', background: isSelected ? '#fff1f2' : 'white',
                          color: isSelected ? '#f43f5e' : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.74rem',
                          transition: 'all 0.15s'
                        }}
                      >
                        {f.label[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pain & Fatigue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {lang === 'EN' ? "Pain Level" : "Douleur"}
                  </label>
                  <select
                    value={painLevel}
                    onChange={e => setPainLevel(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', background: 'white', fontSize: '0.8rem' }}
                  >
                    <option value="none">{lang === 'EN' ? 'None' : 'Aucune'}</option>
                    <option value="mild">{lang === 'EN' ? 'Mild' : 'Légère'}</option>
                    <option value="moderate">{lang === 'EN' ? 'Moderate' : 'Modérée'}</option>
                    <option value="severe">{lang === 'EN' ? 'Severe' : 'Intense'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    {lang === 'EN' ? "Fatigue Level" : "Fatigue"}
                  </label>
                  <select
                    value={fatigue}
                    onChange={e => setFatigue(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', background: 'white', fontSize: '0.8rem' }}
                  >
                    <option value="none">{lang === 'EN' ? 'None' : 'Aucune'}</option>
                    <option value="mild">{lang === 'EN' ? 'Mild' : 'Légère'}</option>
                    <option value="moderate">{lang === 'EN' ? 'Moderate' : 'Modérée'}</option>
                    <option value="severe">{lang === 'EN' ? 'Severe' : 'Intense'}</option>
                  </select>
                </div>
              </div>

              {/* Mood selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? "Dominant Mood" : "Humeur dominante"}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {MOODS.map(m => {
                    const isSelected = mood === m.id;
                    return (
                      <button
                        key={m.id} type="button"
                        onClick={() => setMood(m.id)}
                        style={{
                          padding: '8px 4px', border: `1.5px solid ${isSelected ? '#f43f5e' : '#e2e8f0'}`,
                          borderRadius: '8px', background: isSelected ? '#fff1f2' : '#f8fafc',
                          color: isSelected ? '#f43f5e' : '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.74rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                          transition: 'all 0.15s'
                        }}
                      >
                        <span>{m.emoji}</span>
                        <span>{m.label[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Symptoms Checklist */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? "Symptoms Experienced" : "Symptômes ressentis"}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {COMMON_SYMPTOMS.map(s => {
                    const isSelected = selectedSymptoms.includes(s.id);
                    return (
                      <button
                        key={s.id} type="button"
                        onClick={() => handleSymptomToggle(s.id)}
                        style={{
                          padding: '6px 12px', border: `1px solid ${isSelected ? '#f43f5e' : '#cbd5e1'}`,
                          borderRadius: '20px', background: isSelected ? '#f43f5e' : 'white',
                          color: isSelected ? 'white' : '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.74rem',
                          transition: 'all 0.1s'
                        }}
                      >
                        {s.label[lang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Free text notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {lang === 'EN' ? "Daily Notes" : "Notes personnelles"}
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={lang === 'EN' ? "How did you feel today? Any special events?" : "Comment vous êtes-vous sentie ? Des évènements particuliers ?"}
                  style={{
                    width: '100%', height: '70px', padding: '8px', borderRadius: '8px',
                    border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.8rem',
                    resize: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>

              {logMessage && (
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: logMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: logMessage.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${logMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                  {logMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={savingLog}
                style={{
                  padding: '10px 16px',
                  background: '#f43f5e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(244,63,94,0.2)'
                }}
              >
                {savingLog ? <FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : (lang === 'EN' ? 'Save Daily Log' : 'Enregistrer la journée')}
              </button>
            </form>
          </div>

          {/* Pregnancy Tracker STUB */}
          <div style={{
            background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
            border: '1px solid #e7e5e4',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '50%',
                background: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                flexShrink: 0
              }}>
                <FaBaby size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#44403c', fontWeight: 800, fontSize: '0.88rem' }}>
                  {lang === 'EN' ? "Pregnancy Mode & Prenatal Planner" : "Mode Grossesse & Calendrier Prénatal"}
                </h4>
                <p style={{ margin: '2px 0 0', color: '#78716c', fontSize: '0.76rem', maxWidth: '300px', lineHeight: 1.4 }}>
                  {lang === 'EN'
                    ? "Monitor baby growth steps, medical visits, and checklist. Currently in prototype."
                    : "Suivez le développement de bébé, les consultations et examens prénataux. Mode prototype."}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setPregnancyMode(!pregnancyMode)}
              style={{
                padding: '6px 12px',
                background: pregnancyMode ? '#d97706' : 'white',
                border: pregnancyMode ? 'none' : '1px solid #cbd5e1',
                borderRadius: '20px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: pregnancyMode ? 'white' : '#57534e',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {pregnancyMode 
                ? (lang === 'EN' ? 'Active' : 'Actif') 
                : (lang === 'EN' ? 'Activate' : 'Activer')}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WomensHealthModule;
