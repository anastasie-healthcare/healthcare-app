/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaHeart, FaSpinner, FaCheckCircle, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdWaterDrop } from 'react-icons/md';
import { getWomensHealthProfile, updateWomensHealthProfile, getCycleLogs, createCycleLog } from '../../services/api';

const MOODS = [
  { id: 'calm', EN: 'Calm', FR: 'Calme', icon: '😌' },
  { id: 'happy', EN: 'Happy', FR: 'Heureuse', icon: '😊' },
  { id: 'sad', EN: 'Sad', FR: 'Triste', icon: '😢' },
  { id: 'irritable', EN: 'Irritable', FR: 'Irritable', icon: '😠' },
  { id: 'anxious', EN: 'Anxious', FR: 'Anxieuse', icon: '😰' },
  { id: 'energetic', EN: 'Energetic', FR: 'Énergique', icon: '⚡' },
];

const SYMPTOMS = [
  { id: 'cramps', EN: 'Cramps', FR: 'Crampes' },
  { id: 'headache', EN: 'Headache', FR: 'Maux de tête' },
  { id: 'bloating', EN: 'Bloating', FR: 'Ballonnements' },
  { id: 'acne', EN: 'Acne', FR: 'Acné' },
  { id: 'tender_breasts', EN: 'Tender Breasts', FR: 'Seins douloureux' },
  { id: 'backache', EN: 'Back Pain', FR: 'Mal de dos' },
];

const MONTHS = {
  EN: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  FR: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
};

const WEEKDAYS = {
  EN: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  FR: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
};

const WomensHealthModule = ({ lang }) => {
  const [profile, setProfile] = useState({ last_period_date: '', cycle_length: 28, period_duration: 5 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  const [logMsg, setLogMsg] = useState(null);

  // Calendar
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  // Daily log form
  const [flow, setFlow] = useState('none');
  const [mood, setMood] = useState('calm');
  const [pain, setPain] = useState('none');
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  // Active tab
  const [tab, setTab] = useState('calendar'); // 'calendar' | 'log' | 'settings'

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, lRes] = await Promise.all([getWomensHealthProfile(), getCycleLogs()]);
      if (pRes.data) setProfile(pRes.data);
      if (lRes.data) setLogs(lRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateWomensHealthProfile(profile);
      setProfileMsg({ ok: true, text: lang === 'EN' ? 'Saved successfully!' : 'Enregistré avec succès !' });
      await fetchData();
      // Auto jump to next period month
        if (profile.last_period_date) {
            const last = new Date(profile.last_period_date);
            const next = new Date(last);
            next.setDate(next.getDate() + 28);
            setCalMonth(next.getMonth());
            setCalYear(next.getFullYear());
            setTab('calendar');
        }
    } catch { setProfileMsg({ ok: false, text: lang === 'EN' ? 'Failed to save.' : 'Échec de l\'enregistrement.' }); }
    finally { setSaving(false); setTimeout(() => setProfileMsg(null), 3000); }
  };

  const saveLog = async (e) => {
    e.preventDefault();
    setSavingLog(true);
    try {
      await createCycleLog({ date: selectedDate, flow, mood, pain_level: pain, fatigue: 'none', symptoms: JSON.stringify(symptoms), notes });
      setLogMsg({ ok: true, text: lang === 'EN' ? 'Log saved!' : 'Journal enregistré !' });
      setFlow('none'); setMood('calm'); setPain('none'); setSymptoms([]); setNotes('');
      await fetchData();
    } catch { setLogMsg({ ok: false, text: lang === 'EN' ? 'Failed to save.' : 'Échec.' }); }
    finally { setSavingLog(false); setTimeout(() => setLogMsg(null), 3000); }
  };

  const getDayStatus = (date) => {
    if (!profile.last_period_date) return 'none';
    const last = new Date(profile.last_period_date);
    last.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = Math.floor((d - last) / 86400000);

    // Check across all 3 cycle lengths
    const cycleLengths = [26, 28, 30];
    const periodDuration = 5;

    for (let cycle of cycleLengths) {
        let rem = diff % cycle;
        if (rem < 0) rem += cycle;

        // Period days (first 5 days)
        if (rem >= 0 && rem < periodDuration) return 'period';
    }

    // Ovulation window — covers all 3 cycles
    // 26-day cycle: ovulation day 12
    // 28-day cycle: ovulation day 14
    // 30-day cycle: ovulation day 16
    for (let cycle of cycleLengths) {
        let rem = diff % cycle;
        if (rem < 0) rem += cycle;
        const ovDay = cycle - 14;

        // Ovulation day
        if (rem === ovDay) return 'ovulation';

        // Fertile window (5 days before ovulation to 1 day after)
        if (rem >= ovDay - 5 && rem <= ovDay + 1) return 'fertile';
    }

    return 'none';
};
  const getLogForDate = (ds) => logs.find(l => l.date === ds);

  const handleDayClick = (ds) => {
    setSelectedDate(ds);
    const log = getLogForDate(ds);
    if (log) {
      setFlow(log.flow || 'none');
      setMood(log.mood || 'calm');
      setPain(log.pain_level || 'none');
      setSymptoms(log.symptoms ? JSON.parse(log.symptoms) : []);
      setNotes(log.notes || '');
    } else {
      setFlow('none'); setMood('calm'); setPain('none'); setSymptoms([]); setNotes('');
    }
    setTab('log');
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const cells = [];
    const todayStr = today.toISOString().split('T')[0];

    for (let i = 0; i < firstDay; i++) cells.push(<div key={'e' + i} />);

    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const status = getDayStatus(new Date(calYear, calMonth, d));
      const isToday = ds === todayStr;
      const isSelected = ds === selectedDate;
      const log = getLogForDate(ds);

      let bg = 'white', color = '#334155', border = '1px solid #f1f5f9';
      if (status === 'period') { bg = '#ffe4e6'; color = '#be123c'; border = '1px solid #fda4af'; }
      else if (status === 'ovulation') { bg = '#f5f3ff'; color = '#6d28d9'; border = '1px solid #c084fc'; }
      else if (status === 'fertile') { bg = '#ecfdf5'; color = '#047857'; border = '1px solid #6ee7b7'; }
      if (isSelected) border = '2px solid #f43f5e';
      if (isToday) border = '2px solid #3b82f6';

      cells.push(
        <div key={ds} onClick={() => handleDayClick(ds)} style={{
          height: '44px', background: bg, color, border, borderRadius: '10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, position: 'relative',
          transition: 'all 0.1s'
        }}>
          <span>{d}</span>
          {status === 'ovulation' && <span style={{ fontSize: '0.55rem', position: 'absolute', top: '2px', right: '3px' }}>🌸</span>}
          {log && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f43f5e', position: 'absolute', bottom: '3px' }} />}
        </div>
      );
    }
    return cells;
  };

  const getPredictions = () => {
    if (!profile.last_period_date) return [];
    const last = new Date(profile.last_period_date);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return [
      { days: 26, label: { EN: 'Short (26d)', FR: 'Court (26j)' }, color: '#f43f5e' },
      { days: 28, label: { EN: 'Average (28d)', FR: 'Moyen (28j)' }, color: '#8b5cf6' },
      { days: 30, label: { EN: 'Long (30d)', FR: 'Long (30j)' }, color: '#0d9488' },
    ].map(p => {
      let next = new Date(last);
      while (next <= now) next.setDate(next.getDate() + p.days);
      const days = Math.ceil((next - now) / 86400000);
      const dateStr = next.toLocaleDateString(lang === 'EN' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'short' });
      return { ...p, dateStr, days };
    });
  };

  const predictions = getPredictions();
  const currentStatus = profile.last_period_date ? getDayStatus(today) : 'none';

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
      <FaSpinner size={32} color="#f43f5e" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)', border: '1px solid #fecdd3', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(244,63,94,0.15)' }}>
            <FaHeart color="#f43f5e" size={22} />
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#9f1239', fontWeight: 800, fontSize: '1.1rem' }}>
              {lang === 'EN' ? "Women's Health" : 'Santé Féminine'}
            </h2>
            <p style={{ margin: '2px 0 0', color: '#be123c', fontSize: '0.78rem' }}>
              {lang === 'EN' ? 'Track your cycle and daily symptoms' : 'Suivez votre cycle et symptômes quotidiens'}
            </p>
          </div>
        </div>

        {/* Status + predictions */}
        {profile.last_period_date ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', border: '1px solid #fecdd3', minWidth: '200px' }}>
            {currentStatus === 'period' ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  {lang === 'EN' ? 'Period in progress' : 'Règles en cours'}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f43f5e' }}>
                  {lang === 'EN' ? 'Take care 💗' : 'Prenez soin de vous 💗'}
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: '0.65rem', color: '#9f1239', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  {lang === 'EN' ? 'Next period estimates' : 'Prochaines règles estimées'}
                </div>
                {predictions.map((p, i) => (
                  <div key={p.days} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: i < 2 ? '1px solid #fce7f3' : 'none' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{p.label[lang]}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 800, color: p.color }}>{p.dateStr}</span>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', marginLeft: '4px' }}>({lang === 'EN' ? `${p.days}d` : `${p.days}j`})</span>
                    </div>
                  </div>
                ))}
                <p style={{ margin: '6px 0 0', fontSize: '0.6rem', color: '#94a3b8', lineHeight: 1.3, textAlign: 'center' }}>
                  {lang === 'EN' ? 'Cycles vary — these are estimates only' : 'Les cycles varient — estimations seulement'}
                </p>
              </>
            )}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', border: '1px dashed #fecdd3', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#be123c', fontWeight: 600 }}>
              {lang === 'EN' ? '👇 Enter your last period date below to start' : '👇 Entrez votre dernière date de règles ci-dessous'}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
        {[
          { id: 'calendar', label: { EN: '📅 Calendar', FR: '📅 Calendrier' } },
          { id: 'log', label: { EN: '📝 Daily Log', FR: '📝 Journal' } },
          { id: 'settings', label: { EN: '⚙️ Settings', FR: '⚙️ Paramètres' } },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.82rem',
            background: tab === t.id ? 'white' : 'transparent',
            color: tab === t.id ? '#f43f5e' : '#64748b',
            boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.2s'
          }}>
            {t.label[lang]}
          </button>
        ))}
      </div>

      {/* TAB: Calendar */}
      {tab === 'calendar' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          {/* Month navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <FaChevronLeft size={10} />
            </button>
            <h3 style={{ margin: 0, fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
              {MONTHS[lang][calMonth]} {calYear}
            </h3>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
              <FaChevronRight size={10} />
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px', textAlign: 'center' }}>
            {WEEKDAYS[lang].map((d, i) => <span key={i} style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>{d}</span>)}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', justifyContent: 'center' }}>
            {[
              { bg: '#ffe4e6', border: '#fda4af', label: { EN: 'Period', FR: 'Règles' } },
              { bg: '#ecfdf5', border: '#6ee7b7', label: { EN: 'Fertile window', FR: 'Fenêtre fertile' } },
              { bg: '#f5f3ff', border: '#c084fc', label: { EN: 'Ovulation 🌸', FR: 'Ovulation 🌸' } },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', background: item.bg, border: `1px solid ${item.border}`, borderRadius: '4px' }} />
                <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{item.label[lang]}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', background: '#f43f5e', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>{lang === 'EN' ? 'Day logged' : 'Jour enregistré'}</span>
            </div>
          </div>

          <p style={{ margin: '12px 0 0', fontSize: '0.74rem', color: '#94a3b8', textAlign: 'center' }}>
            {lang === 'EN' ? '👆 Click any day to log your symptoms for that day' : '👆 Cliquez sur un jour pour enregistrer vos symptômes'}
          </p>
        </div>
      )}

      {/* TAB: Daily Log */}
      {tab === 'log' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 4px', fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
            📝 {lang === 'EN' ? 'How are you feeling?' : 'Comment vous sentez-vous ?'}
          </h3>
          <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '0.78rem' }}>
            {lang === 'EN' ? `Logging for: ${new Date(selectedDate + 'T00:00:00').toLocaleDateString(lang === 'EN' ? 'en-US' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}` : `Journal du : ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`}
          </p>

          <form onSubmit={saveLog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* Date picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Date' : 'Date'}
              </label>
              <input type="date" value={selectedDate} onChange={e => { setSelectedDate(e.target.value); const log = getLogForDate(e.target.value); if (log) { setFlow(log.flow || 'none'); setMood(log.mood || 'calm'); setPain(log.pain_level || 'none'); setSymptoms(log.symptoms ? JSON.parse(log.symptoms) : []); setNotes(log.notes || ''); } else { setFlow('none'); setMood('calm'); setPain('none'); setSymptoms([]); setNotes(''); } }}
                style={{ padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.84rem', outline: 'none', fontFamily: 'Inter, sans-serif', width: '100%', boxSizing: 'border-box' }} />
            </div>

            {/* Flow */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                💧 {lang === 'EN' ? 'Menstrual Flow' : 'Flux Menstruel'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'none', EN: 'None', FR: 'Aucun' },
                  { id: 'light', EN: 'Light', FR: 'Léger' },
                  { id: 'medium', EN: 'Medium', FR: 'Moyen' },
                  { id: 'heavy', EN: 'Heavy', FR: 'Abondant' },
                ].map(f => (
                  <button key={f.id} type="button" onClick={() => setFlow(f.id)} style={{
                    padding: '8px', border: '2px solid ' + (flow === f.id ? '#f43f5e' : '#e2e8f0'),
                    borderRadius: '8px', background: flow === f.id ? '#fff1f2' : 'white',
                    color: flow === f.id ? '#f43f5e' : '#475569', fontWeight: 700,
                    fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                  }}>{f[lang]}</button>
                ))}
              </div>
            </div>

            {/* Pain */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                🩹 {lang === 'EN' ? 'Pain Level' : 'Niveau de Douleur'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {[
                  { id: 'none', EN: 'None', FR: 'Aucune' },
                  { id: 'mild', EN: 'Mild', FR: 'Légère' },
                  { id: 'moderate', EN: 'Moderate', FR: 'Modérée' },
                  { id: 'severe', EN: 'Severe', FR: 'Intense' },
                ].map(p => (
                  <button key={p.id} type="button" onClick={() => setPain(p.id)} style={{
                    padding: '8px', border: '2px solid ' + (pain === p.id ? '#ef4444' : '#e2e8f0'),
                    borderRadius: '8px', background: pain === p.id ? '#fef2f2' : 'white',
                    color: pain === p.id ? '#ef4444' : '#475569', fontWeight: 700,
                    fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                  }}>{p[lang]}</button>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Mood' : 'Humeur'}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {MOODS.map(m => (
                  <button key={m.id} type="button" onClick={() => setMood(m.id)} style={{
                    padding: '8px', border: '2px solid ' + (mood === m.id ? '#8b5cf6' : '#e2e8f0'),
                    borderRadius: '8px', background: mood === m.id ? '#f5f3ff' : 'white',
                    color: mood === m.id ? '#8b5cf6' : '#475569', fontWeight: 700,
                    fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                  }}>
                    <span>{m.icon}</span> {m[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Symptoms' : 'Symptômes'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SYMPTOMS.map(s => (
                  <button key={s.id} type="button" onClick={() => setSymptoms(prev => prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id])} style={{
                    padding: '6px 12px', border: '1.5px solid ' + (symptoms.includes(s.id) ? '#f43f5e' : '#e2e8f0'),
                    borderRadius: '20px', background: symptoms.includes(s.id) ? '#f43f5e' : 'white',
                    color: symptoms.includes(s.id) ? 'white' : '#475569', fontWeight: 600,
                    fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif'
                  }}>{s[lang]}</button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'Notes (optional)' : 'Notes (optionnel)'}
              </label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder={lang === 'EN' ? 'How did you feel today? Anything special?' : 'Comment vous êtes-vous sentie aujourd\'hui ?'}
                style={{ width: '100%', height: '70px', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.82rem', resize: 'none', fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box', color: '#1e293b' }} />
            </div>

            {logMsg && (
              <div style={{ padding: '10px', borderRadius: '8px', background: logMsg.ok ? '#f0fdf4' : '#fef2f2', border: '1px solid ' + (logMsg.ok ? '#bbf7d0' : '#fecaca'), fontSize: '0.8rem', fontWeight: 700, color: logMsg.ok ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {logMsg.ok && <FaCheckCircle />} {logMsg.text}
              </div>
            )}

            <button type="submit" disabled={savingLog} style={{
              padding: '12px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white',
              border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(244,63,94,0.25)'
            }}>
              {savingLog ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaCheckCircle size={14} />}
              {lang === 'EN' ? 'Save Daily Log' : 'Enregistrer le Journal'}
            </button>
          </form>
        </div>
      )}

      {/* TAB: Settings */}
      {tab === 'settings' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 6px', fontWeight: 800, color: '#1e293b', fontSize: '1rem' }}>
            ⚙️ {lang === 'EN' ? 'Cycle Settings' : 'Paramètres du Cycle'}
          </h3>
          <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.5 }}>
            {lang === 'EN'
              ? 'Enter the first day of your last period. The app will show 3 estimates (26, 28, 30 days) for your next period since cycles vary based on health and stress.'
              : 'Entrez le premier jour de vos dernières règles. L\'application affichera 3 estimations (26, 28, 30 jours) car les cycles varient selon la santé et le stress.'}
          </p>

          <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                📅 {lang === 'EN' ? 'First Day of Last Period' : 'Premier Jour des Dernières Règles'}
              </label>
              <input type="date" value={profile.last_period_date || ''} onChange={e => setProfile({ ...profile, last_period_date: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.84rem', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} required />
            </div>

            {/* Info box */}
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#be123c', lineHeight: 1.6 }}>
                {lang === 'EN'
                  ? '💡 Based on this date, the calendar will automatically color your period days (pink), fertile window (green) and ovulation day (purple) for the next months.'
                  : '💡 Sur la base de cette date, le calendrier colorera automatiquement vos jours de règles (rose), la fenêtre fertile (vert) et le jour d\'ovulation (violet) pour les prochains mois.'}
              </p>
            </div>

            {profileMsg && (
              <div style={{ padding: '10px', borderRadius: '8px', background: profileMsg.ok ? '#f0fdf4' : '#fef2f2', border: '1px solid ' + (profileMsg.ok ? '#bbf7d0' : '#fecaca'), fontSize: '0.8rem', fontWeight: 700, color: profileMsg.ok ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {profileMsg.ok && <FaCheckCircle />} {profileMsg.text}
              </div>
            )}

            <button type="submit" disabled={saving} style={{
              padding: '12px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white',
              border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(244,63,94,0.25)'
            }}>
              {saving ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaCheckCircle size={14} />}
              {lang === 'EN' ? 'Save & Update Calendar' : 'Enregistrer & Mettre à jour le Calendrier'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WomensHealthModule;
