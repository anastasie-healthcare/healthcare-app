/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaCheckCircle, 
  FaArrowRight, FaArrowLeft, FaDumbbell, 
  FaBed, FaFileMedical, FaBullseye,
  FaSpinner
} from 'react-icons/fa';
import { updateMedicalRecord } from '../../services/api';

const SPORTS_LIST = [
  { id: 'football', label: { EN: 'Football', FR: 'Football' } },
  { id: 'basketball', label: { EN: 'Basketball', FR: 'Basketball' } },
  { id: 'running', label: { EN: 'Running', FR: 'Course à pied' } },
  { id: 'swimming', label: { EN: 'Swimming', FR: 'Natation' } },
  { id: 'weightlifting', label: { EN: 'Weightlifting', FR: 'Musculation' } },
  { id: 'cycling', label: { EN: 'Cycling', FR: 'Cyclisme' } },
  { id: 'martial_arts', label: { EN: 'Martial Arts', FR: 'Arts Martiaux' } },
];

const GOALS_LIST = [
  { id: 'stay_healthy', label: { EN: 'Stay Healthy', FR: 'Rester en bonne santé' }, desc: { EN: 'Maintain current wellness and balance', FR: 'Maintenir son bien-être et sa vitalité' } },
  { id: 'lose_weight', label: { EN: 'Lose Weight', FR: 'Perdre du poids' }, desc: { EN: 'Reach a lower, healthy weight target', FR: 'Atteindre un poids d\'équilibre' } },
  { id: 'gain_weight', label: { EN: 'Gain Weight', FR: 'Prendre du poids', }, desc: { EN: 'Build lean muscle mass or healthy weight', FR: 'Gagner en masse musculaire ou poids sain' } },
  { id: 'fitness', label: { EN: 'Improve Fitness', FR: 'Améliorer ma condition physique' }, desc: { EN: 'Increase strength, stamina, and agility', FR: 'Augmenter force, endurance et souplesse' } },
  { id: 'sleep', label: { EN: 'Sleep Better', FR: 'Mieux dormir' }, desc: { EN: 'Optimize sleep hygiene and rest cycles', FR: 'Optimiser le repos et les cycles de sommeil' } },
  { id: 'stress', label: { EN: 'Manage Stress', FR: 'Gérer mon stress' }, desc: { EN: 'Practice mindfulness and lower anxiety', FR: 'Pratiquer la relaxation et baisser l\'anxiété' } },
  { id: 'pregnancy', label: { EN: 'Track Pregnancy', FR: 'Suivre ma grossesse' }, desc: { EN: 'Monitor cycles, maternity, and prenatal care', FR: 'Suivre les cycles, maternité et soins prénataux' } },
  { id: 'chronic', label: { EN: 'Monitor Chronic Condition', FR: 'Surveiller une maladie chronique' }, desc: { EN: 'Track metrics like glucose or blood pressure', FR: 'Suivre la glycémie ou la tension' } },
];

const OnboardingWizard = ({ lang, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('female');
  const [height, setHeight] = useState(170); // in cm
  const [weight, setWeight] = useState(70); // in kg
  
  const [physicalActivity, setPhysicalActivity] = useState('occasional');
  const [selectedSports, setSelectedSports] = useState([]);
  const [sportsFrequency, setSportsFrequency] = useState(2);

  const [sleepQuality, setSleepQuality] = useState('good');
  const [sleepHours, setSleepHours] = useState(8);
  const [stressLevel, setStressLevel] = useState('medium');
  const [waterIntake, setWaterIntake] = useState('medium');
  const [diet, setDiet] = useState('good');
  
  // Optional habits
  const [tobacco, setTobacco] = useState('no');
  const [alcohol, setAlcohol] = useState('occasional');

  const [allergies, setAllergies] = useState('');
  const [chronicIllnesses, setChronicIllnesses] = useState('');
  const [surgeries, setSurgeries] = useState('');
  const [activeTreatments, setActiveTreatments] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');

  const [healthGoals, setHealthGoals] = useState([]);

  // Calculate age and BMI
  const [age, setAge] = useState(null);
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [birthDate]);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(parseFloat(calculatedBmi));
    }
  }, [height, weight]);

  const handleSportToggle = (id) => {
    if (selectedSports.includes(id)) {
      setSelectedSports(selectedSports.filter((s) => s !== id));
    } else {
      setSelectedSports([...selectedSports, id]);
    }
  };

  const handleGoalToggle = (id) => {
    if (healthGoals.includes(id)) {
      setHealthGoals(healthGoals.filter((g) => g !== id));
    } else {
      setHealthGoals([...healthGoals, id]);
    }
  };

  const getBmiCategory = (bmiVal) => {
    if (!bmiVal) return '';
    if (bmiVal < 18.5) return { label: { EN: 'Underweight', FR: 'Insuffisante' }, color: '#3b82f6', desc: { EN: 'Consider consulting a nutritionist for advice.', FR: 'Nous vous conseillons d\'enrichir votre alimentation pour retrouver de l\'énergie.' } };
    if (bmiVal < 25) return { label: { EN: 'Balanced', FR: 'Équilibrée' }, color: '#10b981', desc: { EN: 'Perfect balance. Keep up the good habits!', FR: 'Excellent équilibre. Continuez ainsi pour préserver votre capital santé !' } };
    if (bmiVal < 30) return { label: { EN: 'Overweight', FR: 'Surpoids' }, color: '#f59e0b', desc: { EN: 'A balanced diet and regular physical activity can help.', FR: 'Une alimentation équilibrée et une activité physique douce vous feront du bien.' } };
    return { label: { EN: 'High Weight', FR: 'Élevée' }, color: '#ef4444', desc: { EN: 'We suggest discussing a healthy program with a doctor.', FR: 'Nous vous recommandons de consulter votre médecin pour convenir d\'un accompagnement adapté.' } };
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        birth_date: birthDate || null,
        sex,
        height,
        weight,
        physical_activity: physicalActivity,
        sports: JSON.stringify(selectedSports),
        sports_frequency: sportsFrequency,
        sleep_quality: sleepQuality,
        sleep_hours: sleepHours,
        stress_level: stressLevel,
        water_intake: waterIntake,
        diet,
        tobacco,
        alcohol,
        allergies,
        chronic_illnesses: chronicIllnesses,
        surgeries,
        active_treatments: activeTreatments,
        family_history: familyHistory,
        health_goals: JSON.stringify(healthGoals),
        onboarding_completed: true
      };

      await updateMedicalRecord(payload);
      onComplete();
    } catch (err) {
      console.error('Error saving onboarding data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #eff6ff 100%)',
      zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', fontFamily: "'Inter', sans-serif", overflowY: 'auto', padding: '20px', boxSizing: 'border-box'
    }}>
      
      {/* Container */}
      <div style={{
        width: '100%', maxWidth: '640px', background: 'white', borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0',
        padding: '32px', display: 'flex', flexDirection: 'column', minHeight: '520px',
        justifyContent: 'space-between', boxSizing: 'border-box', position: 'relative'
      }}>
        
        {/* Progress header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {lang === 'EN' ? `Step ${step} of 5` : `Étape ${step} sur 5`}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3, 4, 5].map(idx => (
              <div key={idx} style={{
                width: '32px', height: '6px', borderRadius: '4px',
                background: idx <= step ? '#0d9488' : '#e2e8f0', transition: 'background 0.3s'
              }} />
            ))}
          </div>
        </div>

        {/* Dynamic step view */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <FaUser size={24} color="#0d9488" />
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1.35rem' }}>
                    {lang === 'EN' ? 'Tell us about yourself' : 'Faisons connaissance'}
                  </h2>
                </div>
                <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '0.86rem', lineHeight: 1.6 }}>
                  {lang === 'EN' 
                    ? 'These parameters help calculate basic metabolic rates and set optimal guidelines.' 
                    : 'Ces informations nous permettent de calculer vos indices corporels et d\'ajuster vos recommandations.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      {lang === 'EN' ? 'Birthdate' : 'Date de naissance'}
                      {age !== null && (
                        <span style={{ marginLeft: '8px', color: '#0d9488', fontWeight: 800 }}>
                          ({age} {lang === 'EN' ? 'y/o' : 'ans'})
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      {lang === 'EN' ? 'Gender' : 'Sexe'}
                    </label>
                    <select
                      value={sex}
                      onChange={e => setSex(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', background: 'white' }}
                    >
                      <option value="female">{lang === 'EN' ? 'Female' : 'Féminin'}</option>
                      <option value="male">{lang === 'EN' ? 'Male' : 'Masculin'}</option>
                      <option value="other">{lang === 'EN' ? 'Other' : 'Autre'}</option>
                    </select>
                  </div>
                </div>

                {/* Height / Weight Sliders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      <span>{lang === 'EN' ? 'Height' : 'Taille'}</span>
                      <span>{height} cm</span>
                    </div>
                    <input
                      type="range" min="100" max="230" value={height}
                      onChange={e => setHeight(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#0d9488' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      <span>{lang === 'EN' ? 'Weight' : 'Poids'}</span>
                      <span>{weight} kg</span>
                    </div>
                    <input
                      type="range" min="30" max="180" value={weight}
                      onChange={e => setWeight(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#0d9488' }}
                    />
                  </div>
                </div>

                {/* Dynamically calculated output card */}
                {bmi && (
                  <div style={{
                    background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px',
                    padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>BMI / IMC</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>{bmi}</div>
                    </div>
                    <div style={{ width: '1px', height: '40px', background: '#cbd5e1' }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: getBmiCategory(bmi).color }}>
                          {getBmiCategory(bmi).label[lang]}
                        </span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748b', lineHeight: 1.4 }}>
                        {getBmiCategory(bmi).desc[lang]}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <FaDumbbell size={22} color="#0d9488" />
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1.35rem' }}>
                    {lang === 'EN' ? 'Your Fitness & Activity' : 'Votre activité physique'}
                  </h2>
                </div>

                {/* Level selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { id: 'none', title: { EN: 'No regular activity', FR: 'Aucune activité' } },
                    { id: 'occasional', title: { EN: 'Occasional (1-2x / week)', FR: 'Occasionnelle (1-2x par semaine)' } },
                    { id: 'regular', title: { EN: 'Regular (3-4x / week)', FR: 'Régulière (3-4x par semaine)' } },
                    { id: 'intensive', title: { EN: 'Intensive (5x+ / week)', FR: 'Intensive (5x+ par semaine)' } }
                  ].map(lvl => {
                    const isSelected = physicalActivity === lvl.id;
                    return (
                      <div
                        key={lvl.id}
                        onClick={() => setPhysicalActivity(lvl.id)}
                        style={{
                          padding: '12px 16px', borderRadius: '10px', border: `1.5px solid ${isSelected ? '#0d9488' : '#e2e8f0'}`,
                          background: isSelected ? '#f0fdf4' : '#f8fafc', cursor: 'pointer', fontWeight: 600, fontSize: '0.84rem',
                          color: isSelected ? '#0f766e' : '#475569', transition: 'all 0.15s'
                        }}
                      >
                        {lvl.title[lang]}
                      </div>
                    );
                  })}
                </div>

                {/* Sports selector */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                    {lang === 'EN' ? 'Which sports do you practice?' : 'Quels sports pratiquez-vous ?'}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {SPORTS_LIST.map(sport => {
                      const isSelected = selectedSports.includes(sport.id);
                      return (
                        <div
                          key={sport.id}
                          onClick={() => handleSportToggle(sport.id)}
                          style={{
                            padding: '6px 12px', borderRadius: '20px', border: `1px solid ${isSelected ? '#0d9488' : '#cbd5e1'}`,
                            background: isSelected ? '#0d9488' : 'white', color: isSelected ? 'white' : '#475569',
                            cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s'
                          }}
                        >
                          {sport.label[lang]}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <FaBed size={22} color="#0d9488" />
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1.35rem' }}>
                    {lang === 'EN' ? 'Daily Habits & Well-being' : 'Habitudes de vie'}
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '12px' }}>
                  {/* Sleep hours range */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      <span>{lang === 'EN' ? 'Hours of sleep' : 'Heures de sommeil'}</span>
                      <span>{sleepHours}h</span>
                    </div>
                    <input
                      type="range" min="4" max="12" step="0.5" value={sleepHours}
                      onChange={e => setSleepHours(parseFloat(e.target.value))}
                      style={{ width: '100%', accentColor: '#0d9488' }}
                    />
                  </div>

                  {/* Sleep quality grid */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      {lang === 'EN' ? 'Sleep quality' : 'Qualité du sommeil'}
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[
                        { id: 'poor', label: { EN: 'Poor', FR: 'Mauvais' } },
                        { id: 'average', label: { EN: 'Average', FR: 'Moyen' } },
                        { id: 'good', label: { EN: 'Restful', FR: 'Réparateur' } }
                      ].map(item => (
                        <button
                          key={item.id} type="button"
                          onClick={() => setSleepQuality(item.id)}
                          style={{
                            padding: '8px', border: `1.5px solid ${sleepQuality === item.id ? '#0d9488' : '#e2e8f0'}`,
                            borderRadius: '8px', background: sleepQuality === item.id ? '#f0fdf4' : 'white',
                            color: sleepQuality === item.id ? '#0d9488' : '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem'
                          }}
                        >
                          {item.label[lang]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stress level */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      {lang === 'EN' ? 'Stress level' : 'Niveau de stress'}
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[
                        { id: 'low', label: { EN: 'Low', FR: 'Faible' } },
                        { id: 'medium', label: { EN: 'Moderate', FR: 'Modéré' } },
                        { id: 'high', label: { EN: 'High', FR: 'Élevé' } }
                      ].map(item => (
                        <button
                          key={item.id} type="button"
                          onClick={() => setStressLevel(item.id)}
                          style={{
                            padding: '8px', border: `1.5px solid ${stressLevel === item.id ? '#0d9488' : '#e2e8f0'}`,
                            borderRadius: '8px', background: stressLevel === item.id ? '#f0fdf4' : 'white',
                            color: stressLevel === item.id ? '#0d9488' : '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem'
                          }}
                        >
                          {item.label[lang]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Water intake */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                      {lang === 'EN' ? 'Water Intake' : 'Consommation d\'eau'}
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[
                        { id: 'low', label: { EN: 'Less than 1L', FR: 'Moins d\'1L' } },
                        { id: 'medium', label: { EN: '1L - 2L', FR: '1L à 2L' } },
                        { id: 'high', label: { EN: '2L+', FR: 'Plus de 2L' } }
                      ].map(item => (
                        <button
                          key={item.id} type="button"
                          onClick={() => setWaterIntake(item.id)}
                          style={{
                            padding: '8px', border: `1.5px solid ${waterIntake === item.id ? '#0d9488' : '#e2e8f0'}`,
                            borderRadius: '8px', background: waterIntake === item.id ? '#f0fdf4' : 'white',
                            color: waterIntake === item.id ? '#0d9488' : '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem'
                          }}
                        >
                          {item.label[lang]}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <FaFileMedical size={22} color="#0d9488" />
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1.35rem' }}>
                    {lang === 'EN' ? 'Medical Background (Optional)' : 'Antécédents médicaux'}
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      {lang === 'EN' ? 'Allergies' : 'Allergies (médicamenteuses, alimentaires...)'}
                    </label>
                    <input
                      type="text" value={allergies} onChange={e => setAllergies(e.target.value)}
                      placeholder={lang === 'EN' ? "Pollen, Penicillin, etc. (leave blank if none)" : "Pollen, Pénicilline, etc. (laisser vide si aucun)"}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      {lang === 'EN' ? 'Chronic conditions' : 'Affections ou maladies chroniques'}
                    </label>
                    <input
                      type="text" value={chronicIllnesses} onChange={e => setChronicIllnesses(e.target.value)}
                      placeholder={lang === 'EN' ? "Diabetes, Asthma, Hypertension..." : "Diabète, Asthme, Hypertension..."}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      {lang === 'EN' ? 'Current Treatments' : 'Traitements médicaux en cours'}
                    </label>
                    <input
                      type="text" value={activeTreatments} onChange={e => setActiveTreatments(e.target.value)}
                      placeholder={lang === 'EN' ? "Insulin, beta-blockers..." : "Insuline, bêta-bloquants..."}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', outline: 'none', fontSize: '0.82rem' }}
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    * {lang === 'EN' ? 'You can always update these settings in your clinical medical file.' : 'Vous pourrez modifier ces informations à tout moment dans votre dossier médical.'}
                  </span>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <FaBullseye size={22} color="#0d9488" />
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '1.35rem' }}>
                    {lang === 'EN' ? 'What are your health goals?' : 'Quels sont vos objectifs santé ?'}
                  </h2>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
                  maxHeight: '260px', overflowY: 'auto', paddingRight: '4px'
                }}>
                  {GOALS_LIST.map(goal => {
                    const isSelected = healthGoals.includes(goal.id);
                    return (
                      <div
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        style={{
                          padding: '12px 14px', borderRadius: '12px', border: `1.5px solid ${isSelected ? '#0d9488' : '#e2e8f0'}`,
                          background: isSelected ? '#f0fdf4' : 'white', cursor: 'pointer', transition: 'all 0.15s',
                          display: 'flex', flexDirection: 'column', gap: '4px'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isSelected ? '#0f766e' : '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          {goal.label[lang]}
                          {isSelected && <FaCheckCircle color="#0d9488" size={12} />}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 }}>
                          {goal.desc[lang]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Action Controls Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '10px 18px', background: 'white', border: '1.5px solid #cbd5e1',
                borderRadius: '10px', color: '#475569', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem'
              }}
            >
              <FaArrowLeft />
              {lang === 'EN' ? 'Back' : 'Retour'}
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                padding: '10px 20px', background: '#0d9488', border: 'none',
                borderRadius: '10px', color: 'white', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                boxShadow: '0 4px 10px rgba(13,148,136,0.2)'
              }}
            >
              {lang === 'EN' ? 'Continue' : 'Continuer'}
              <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '10px 22px', background: 'linear-gradient(135deg, #10b981, #0d9488)', border: 'none',
                borderRadius: '10px', color: 'white', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
              }}
            >
              {loading ? (
                <FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {lang === 'EN' ? 'Finish' : 'Terminer'}
                  <FaCheckCircle />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default OnboardingWizard;
