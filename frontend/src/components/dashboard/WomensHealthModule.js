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
  { id: 'calm', label: { EN: 'Calm', FR: 'Calme' }, icon: '🧘' },
  { id: 'happy', label: { EN: 'Happy', FR: 'Heureuse' }, icon: '😊' },
  { id: 'sad', label: { EN: 'Sad', FR: 'Triste' }, icon: '😢' },
  { id: 'irritable', label: { EN: 'Irritable', FR: 'Irritable' }, icon: '😠' },
  { id: 'anxious', label: { EN: 'Anxious', FR: 'Anxieuse' }, icon: '😰' },
  { id: 'energetic', label: { EN: 'Energetic', FR: "Pleine d'énergie" }, icon: '⚡' },
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
  EN: ['January', 'February', 'March', 'April', 'May', 'June', 
       'July', 'August', 'September', 'October', 'November', 'December'],
  FR: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
};

const WomensHealthModule = ({ lang }) => {
  const [profile, setProfile] = useState({
    is_enabled: true,
    last_period_date: '',
    cycle_length: 28,
    period_duration: 5,
  });

  const [logs, setLogs] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [painLevel, setPainLevel] = useState('none');
  const [fatigue, setFatigue] = useState('none');
  const [mood, setMood] = useState('calm');
  const [flow, setFlow] = useState('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [logMessage, setLogMessage] = useState(null);
  const [pregnancyMode, setPregnancyMode] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const profileRes = await getWomensHealthProfile();
      if (profileRes.data) setProfile(profileRes.data);
      const logsRes = await getCycleLogs();
      if (logsRes.data) setLogs(logsRes.data);
    } catch (err) {
      console.error("Error fetching women's health data:", err);
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
      setProfileMessage({ type: 'error', text: lang === 'EN' ? 'Failed to update settings.' : "Échec de l'enregistrement." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    setSavingLog(true);
    setLogMessage(null);
    try {
      await createCycleLog({
        date: logDate,
        pain_level: painLevel,
        fatigue,
        mood,
        flow,
        symptoms: JSON.stringify(selectedSymptoms),
        notes
      });
      setLogMessage({ type: 'success', text: lang === 'EN' ? 'Symptom log added successfully!' : 'Symptômes enregistrés avec succès !' });
      const logsRes = await getCycleLogs();
      setLogs(logsRes.data);
    } catch (err) {
      setLogMessage({ type: 'error', text: lang === 'EN' ? 'Failed to save daily symptoms.' : "Échec de l'enregistrement des symptômes." });
    } finally {
      setSavingLog(false);
    }
  };

  const handleSymptomToggle = (id) => {
    setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const getDayStatus = (date) => {
    if (!profile.last_period_date) return 'none';
    const lastPeriod = new Date(profile.last_period_date);
    lastPeriod.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((targetDate - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleLength = 28;
    const periodDuration = 5;

    let remainder = diffDays % cycleLength;
    if (remainder < 0) remainder += cycleLength;

    if (remainder >= 0 && remainder < periodDuration) return 'period';
    const ovulationDay = cycleLength - 14;
    if (remainder === ovulationDay) return 'ovulation';
    if (remainder >= ovulationDay - 5 && remainder <= ovulationDay + 1) return 'fertile';
    return 'none';
  };

  const getLogForDate = (dateString) => logs.find(l => l.date === dateString);

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
      setPainLevel('none'); setFatigue('none'); setMood('calm');
      setFlow('none'); setSelectedSymptoms([]); setNotes('');
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const renderCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const calendarCells = [];

    for (let i = 0; i < firstDayIndex; i++) {
      calendarCells.push(<div key={`empty-${i}`} style={{ height: '54px' }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const status = getDayStatus(dayDate);
      const isTodayString = new Date().toISOString().split('T')[0] === dateString;
      const isSelected = logDate === dateString;
      const dayLog = getLogForDate(dateString);

      let bg = 'white', color = '#334155', border = '1px solid #f1f5f9', fontWeight = '500';

      if (status === 'period') { bg = '#ffe4e6'; color = '#be123c'; border = '1px solid #fda4af'; fontWeight = '700'; }
      else if (status === 'ovulation') { bg = '#f5f3ff'; color = '#6d28d9'; border = '1px solid #c084fc'; fontWeight = '700'; }
      else if (status === 'fertile') { bg = '#ecfdf5'; color = '#047857'; border = '1px solid #6ee7b7'; fontWeight = '600'; }
      if (isSelected) border = '2.5px solid #e11d48';

      calendarCells.push(
        <div key={`day-${day}`} onClick={() => handleDayClick(dateString)}
          style={{
            height: '54px', background: bg, color, border, borderRadius: '12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '0.82rem', fontWeight, position: 'relative',
            boxSizing: 'border-box', transition: 'all 0.15s',
            boxShadow: isTodayString ? 'inset 0 0 0 2px #3b82f6' : 'none'
          }}>
          <span>{day}</span>
          {status === 'ovulation' && <span style={{ fontSize: '0.6rem', position: 'absolute', top: '2px', right: '2px' }}>🌸</span>}
          {dayLog && (
            <div style={{ display: 'flex', gap: '2px', position: 'absolute', bottom: '4px' }}>
              <span style={{ fontSize: '0.65rem' }}>{MOODS.find(m => m.id === dayLog.mood)?.icon || '🧘'}</span>
              {dayLog.flow !== 'none' && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#ef4444' }} />}
            </div>
          )}
        </div>
      );
    }
    return calendarCells;
  };

  // Calculate 3 period predictions
  const getPredictions = () => {
    if (!profile.last_period_date) return [];
    const lastPeriod = new Date(profile.last_period_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [
      { days: 26, label: { EN: 'Short cycle (26 days)', FR: 'Cycle court (26 jours)' }, color: '#f43f5e' },
      { days: 28, label: { EN: 'Average cycle (28 days)', FR: 'Cycle moyen (28 jours)' }, color: '#8b5cf6' },
      { days: 30, label: { EN: 'Long cycle (30 days)', FR: 'Cycle long (30 jours)' }, color: '#0d9488' },
    ].map(p => {
      let nextPeriod = new Date(lastPeriod);
      while (nextPeriod <= today) nextPeriod.setDate(nextPeriod.getDate() + p.days);
      const daysRemaining = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24));
      const dateStr = nextPeriod.toLocaleDateString(lang === 'EN' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long' });
      return { ...p, dateStr, daysRemaining };
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <FaSpinner size={36} color="#f43f5e" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const predictions = getPredictions();
  const currentStatus = getDayStatus(new Date());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Inter', sans-serif" }}>

      {/* Top Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        border: '1px solid #fecdd3', borderRadius: '20px', padding: '24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', background: 'white', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f43f5e', boxShadow: '0 4px 10px rgba(244,63,94,0.15)'
          }}>
            <FaHeart size={24} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#9f1239', fontWeight: 800, fontSize: '1.25rem' }}>
              {lang === 'EN' ? 'My Health Cycle & Calendar' : 'Mon Calendrier & Cycle de Santé'}
            </h2>
            <p style={{ margin: '4px 0 0', color: '#be123c', fontSize: '0.85rem', maxWidth: '500px', lineHeight: 1.5 }}>
              {lang === 'EN'
                ? 'Track your symptoms and get estimates for your next period based on different cycle lengths.'
                : 'Suivez vos symptômes et obtenez des estimations de vos prochaines règles selon différentes durées de cycle.'}
            </p>
          </div>
        </div>

        {/* 3 Predictions Countdown */}
        {profile.last_period_date && (
          <div style={{
            background: 'white', padding: '14px 20px', borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(244,63,94,0.1)', border: '1px solid #ffe4e6', minWidth: '230px'
          }}>
            {currentStatus === 'period' ? (
              <>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {lang === 'EN' ? 'Period in progress' : 'Règles en cours'}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#f43f5e' }}>
                  {lang === 'EN' ? 'Take care of yourself' : 'Prenez soin de vous'}
                </span>
              </>
            ) : (
              <>
                <span style={{ display: 'block', fontSize: '0.68rem', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  {lang === 'EN' ? 'Next period estimates' : 'Estimations prochaines règles'}
                </span>
                {predictions.map((p, i) => (
                  <div key={p.days} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '5px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', gap: '12px'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{p.label[lang]}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: p.color }}>{p.dateStr}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                        {lang === 'EN' ? `in ${p.daysRemaining}d` : `dans ${p.daysRemaining}j`}
                      </span>
                    </div>
                  </div>
                ))}
                <p style={{ margin: '8px 0 0', fontSize: '0.65rem', color: '#94a3b8', lineHeight: 1.4, textAlign: 'center' }}>
                  {lang === 'EN'
                    ? 'Cycles vary due to health & stress conditions.'
                    : 'Les cycles varient selon la santé et le stress.'}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Calendar */}
          <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px',
            padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCalendarAlt color="#f43f5e" />
                {MONTHS[lang][currentMonth]} {currentYear}
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrevMonth} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <FaChevronLeft size={10} />
                </button>
                <button onClick={handleNextMonth} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  <FaChevronRight size={10} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', marginBottom: '8px' }}>
              {WEEKDAYS[lang].map((day, idx) => (
                <span key={idx} style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{day}</span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {renderCalendarDays()}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px', justifyContent: 'center' }}>
              {[
                { bg: '#ffe4e6', border: '#fda4af', label: { EN: 'Period', FR: 'Règles' } },
                { bg: '#ecfdf5', border: '#6ee7b7', label: { EN: 'High Fertility', FR: 'Haute fertilité' } },
                { bg: '#f5f3ff', border: '#c084fc', label: { EN: 'Ovulation Day', FR: "Jour d'ovulation" } },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '14px', height: '14px', background: item.bg, border: `1px solid ${item.border}`, borderRadius: '4px' }} />
                  <span style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 600 }}>{item.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simplified Profile Config - only last period date */}
          <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBookMedical color="#f43f5e" />
              {lang === 'EN' ? 'Cycle Settings' : 'Paramètres du Cycle'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
              {lang === 'EN'
                ? 'Enter the first day of your last period. We will estimate your next period across 3 possible cycle lengths (26, 28, 30 days) since cycles vary due to health and stress.'
                : 'Entrez le premier jour de vos dernières règles. Nous estimerons vos prochaines règles sur 3 durées possibles (26, 28, 30 jours) car les cycles varient selon la santé et le stress.'}
            </p>

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? 'First Day of Last Period' : 'Premier jour des dernières règles'}
                </label>
                <input
                  type="date"
                  value={profile.last_period_date || ''}
                  onChange={e => setProfile({ ...profile, last_period_date: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.85rem' }}
                  required
                />
              </div>

              {profileMessage && (
                <div style={{
                  padding: '10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                  background: profileMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: profileMessage.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${profileMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>
                  {profileMessage.text}
                </div>
              )}

              <button type="submit" disabled={savingProfile} style={{
                padding: '10px 16px', background: '#f43f5e', color: 'white', border: 'none',
                borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 10px rgba(244,63,94,0.2)'
              }}>
                {savingProfile
                  ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                  : (lang === 'EN' ? 'Save & Calculate' : 'Enregistrer & Calculer')}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Symptom Logger */}
          <div style={{
            background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPlus color="#f43f5e" />
              {lang === 'EN' ? 'Log Daily Symptoms' : 'Journal des Symptômes'}
            </h3>

            <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCalendarDay color="#f43f5e" />
              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                {lang === 'EN' ? 'Selected Date:' : 'Date sélectionnée :'} <strong>{new Date(logDate + 'T00:00:00').toLocaleDateString(lang === 'EN' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
              </span>
            </div>

            <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {lang === 'EN' ? 'Log Date' : 'Modifier la date'}
                </label>
                <input type="date" value={logDate} onChange={e => handleDayClick(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.8rem' }} required />
              </div>

              {/* Flow */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? 'Menstrual Flow' : 'Flux menstruel'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'none', label: { EN: 'None', FR: 'Aucun' } },
                    { id: 'light', label: { EN: 'Light', FR: 'Léger' } },
                    { id: 'medium', label: { EN: 'Medium', FR: 'Moyen' } },
                    { id: 'heavy', label: { EN: 'Heavy', FR: 'Abondant' } }
                  ].map(f => (
                    <button key={f.id} type="button" onClick={() => setFlow(f.id)} style={{
                      padding: '8px 4px', border: `1.5px solid ${flow === f.id ? '#f43f5e' : '#cbd5e1'}`,
                      borderRadius: '8px', background: flow === f.id ? '#fff1f2' : 'white',
                      color: flow === f.id ? '#f43f5e' : '#475569', fontWeight: 700, cursor: 'pointer', fontSize: '0.74rem'
                    }}>{f.label[lang]}</button>
                  ))}
                </div>
              </div>

              {/* Pain & Fatigue */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { label: { EN: 'Pain Level', FR: 'Douleur' }, value: painLevel, setter: setPainLevel },
                  { label: { EN: 'Fatigue Level', FR: 'Fatigue' }, value: fatigue, setter: setFatigue }
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      {field.label[lang]}
                    </label>
                    <select value={field.value} onChange={e => field.setter(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', background: 'white', fontSize: '0.8rem' }}>
                      <option value="none">{lang === 'EN' ? 'None' : 'Aucune'}</option>
                      <option value="mild">{lang === 'EN' ? 'Mild' : 'Légère'}</option>
                      <option value="moderate">{lang === 'EN' ? 'Moderate' : 'Modérée'}</option>
                      <option value="severe">{lang === 'EN' ? 'Severe' : 'Intense'}</option>
                    </select>
                  </div>
                ))}
              </div>

              {/* Mood */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? 'Dominant Mood' : 'Humeur dominante'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {MOODS.map(m => (
                    <button key={m.id} type="button" onClick={() => setMood(m.id)} style={{
                      padding: '8px 4px', border: `1.5px solid ${mood === m.id ? '#f43f5e' : '#e2e8f0'}`,
                      borderRadius: '8px', background: mood === m.id ? '#fff1f2' : '#f8fafc',
                      color: mood === m.id ? '#f43f5e' : '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.74rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}>
                      <span>{m.icon}</span><span>{m.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {lang === 'EN' ? 'Symptoms Experienced' : 'Symptômes ressentis'}
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {COMMON_SYMPTOMS.map(s => (
                    <button key={s.id} type="button" onClick={() => handleSymptomToggle(s.id)} style={{
                      padding: '6px 12px', border: `1px solid ${selectedSymptoms.includes(s.id) ? '#f43f5e' : '#cbd5e1'}`,
                      borderRadius: '20px', background: selectedSymptoms.includes(s.id) ? '#f43f5e' : 'white',
                      color: selectedSymptoms.includes(s.id) ? 'white' : '#475569', fontWeight: 600, cursor: 'pointer', fontSize: '0.74rem'
                    }}>{s.label[lang]}</button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {lang === 'EN' ? 'Daily Notes' : 'Notes personnelles'}
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder={lang === 'EN' ? 'How did you feel today? Any special events?' : 'Comment vous êtes-vous sentie ? Des événements particuliers ?'}
                  style={{ width: '100%', height: '70px', padding: '8px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.8rem', resize: 'none', fontFamily: 'inherit' }} />
              </div>

              {logMessage && (
                <div style={{
                  padding: '10px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                  background: logMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
                  color: logMessage.type === 'success' ? '#166534' : '#991b1b',
                  border: `1px solid ${logMessage.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                }}>{logMessage.text}</div>
              )}

              <button type="submit" disabled={savingLog} style={{
                padding: '10px 16px', background: '#f43f5e', color: 'white', border: 'none',
                borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 10px rgba(244,63,94,0.2)'
              }}>
                {savingLog ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : (lang === 'EN' ? 'Save Daily Log' : 'Enregistrer la journée')}
              </button>
            </form>
          </div>

          {/* Pregnancy Mode Stub */}
          <div style={{
            background: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
            border: '1px solid #e7e5e4', borderRadius: '16px', padding: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', flexShrink: 0 }}>
                <FaBaby size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#44403c', fontWeight: 800, fontSize: '0.88rem' }}>
                  {lang === 'EN' ? 'Pregnancy Mode & Prenatal Planner' : 'Mode Grossesse & Calendrier Prénatal'}
                </h4>
                <p style={{ margin: '2px 0 0', color: '#78716c', fontSize: '0.76rem', maxWidth: '300px', lineHeight: 1.4 }}>
                  {lang === 'EN'
                    ? 'Monitor baby growth steps, medical visits, and checklist. Currently in prototype.'
                    : 'Suivez le développement de bébé, les consultations et examens prénataux. Mode prototype.'}
                </p>
              </div>
            </div>
            <button onClick={() => setPregnancyMode(!pregnancyMode)} style={{
              padding: '6px 12px', background: pregnancyMode ? '#d97706' : 'white',
              border: pregnancyMode ? 'none' : '1px solid #cbd5e1', borderRadius: '20px',
              fontSize: '0.74rem', fontWeight: 700, color: pregnancyMode ? 'white' : '#57534e', cursor: 'pointer'
            }}>
              {pregnancyMode ? (lang === 'EN' ? 'Active' : 'Actif') : (lang === 'EN' ? 'Activate' : 'Activer')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WomensHealthModule;