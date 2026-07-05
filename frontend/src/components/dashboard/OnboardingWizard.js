/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle, FaArrowRight, FaArrowLeft,
  FaFileMedical, FaHeartbeat, FaSpinner, FaRulerVertical,
  FaWeight, FaBirthdayCake, FaVenusMars,
  FaNotesMedical, FaPills
} from 'react-icons/fa';
import { updateMedicalRecord } from '../../services/api';

const OnboardingWizard = ({ lang, onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(null);
  const [bmi, setBmi] = useState(null);

  const [allergies, setAllergies] = useState('');
  const [chronicIllnesses, setChronicIllnesses] = useState('');
  const [activeTreatments, setActiveTreatments] = useState('');

  const TOTAL_STEPS = 3;

  useEffect(() => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let a = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
      setAge(a);
    }
  }, [birthDate]);

  useEffect(() => {
    if (height && weight) {
      const h = height / 100;
      setBmi(parseFloat((weight / (h * h)).toFixed(1)));
    }
  }, [height, weight]);

  const getBmiInfo = (val) => {
    if (!val) return null;
    if (val < 18.5) return { label: { EN: 'Underweight', FR: 'Insuffisance pondérale' }, color: '#3b82f6', bg: '#eff6ff', bar: 15 };
    if (val < 25) return { label: { EN: 'Healthy Weight', FR: 'Poids santé' }, color: '#10b981', bg: '#f0fdf4', bar: 45 };
    if (val < 30) return { label: { EN: 'Overweight', FR: 'Surpoids' }, color: '#f59e0b', bg: '#fffbeb', bar: 70 };
    return { label: { EN: 'Obese', FR: 'Obésité' }, color: '#ef4444', bg: '#fef2f2', bar: 90 };
  };

  const handleNext = () => {
    if (step === 1) {
      if (!birthDate) {
        setError(lang === 'EN' ? 'Please enter your date of birth.' : 'Veuillez entrer votre date de naissance.');
        return;
      }
      if (!sex) {
        setError(lang === 'EN' ? 'Please select your gender.' : 'Veuillez sélectionner votre sexe.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await updateMedicalRecord({
        birth_date: birthDate || null,
        sex,
        height,
        weight,
        allergies,
        chronic_illnesses: chronicIllnesses,
        active_treatments: activeTreatments,
        onboarding_completed: true
      });
      onComplete();
    } catch (err) {
      console.error('Onboarding error:', err);
      setError(lang === 'EN' ? 'Something went wrong. Please try again.' : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const bmiInfo = getBmiInfo(bmi);

  const progressWidth = Math.round((step / TOTAL_STEPS) * 100);

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1.5px solid #e2e8f0',
    outline: 'none',
    fontSize: '0.88rem',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
    color: '#1e293b',
    background: 'white'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: '#475569',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #eff6ff 100%)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif', padding: '20px', boxSizing: 'border-box', overflowY: 'auto'
    }}>
      <div style={{
        width: '100%', maxWidth: '560px', background: 'white', borderRadius: '28px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)', overflow: 'hidden'
      }}>

        {/* Progress bar */}
        <div style={{ height: '5px', background: '#e2e8f0' }}>
          <div style={{
            height: '100%',
            width: progressWidth + '%',
            background: '#0d9488',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Header */}
        <div style={{
          padding: '28px 32px 20px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488, #0f766e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
            }}>
              <FaHeartbeat color="white" size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                AnasHealthcare
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginTop: '1px' }}>
                {lang === 'EN' ? 'Health Profile Setup' : 'Configuration du Profil Santé'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              {lang === 'EN' ? 'Step' : 'Étape'}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0d9488' }}>
              {step}<span style={{ color: '#cbd5e1', fontWeight: 400 }}>/{TOTAL_STEPS}</span>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: '6px', padding: '16px 32px 0', justifyContent: 'center' }}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} style={{
              height: '4px', flex: 1, borderRadius: '4px',
              background: i < step ? '#0d9488' : '#e2e8f0',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '24px 32px 32px' }}>
          <AnimatePresence mode="wait">

            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                    {lang === 'EN' ? 'Tell us about yourself' : 'Parlez-nous de vous'}
                  </h2>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    {lang === 'EN'
                      ? 'This helps us personalize your dashboard and calculate your BMI.'
                      : 'Cela nous permet de personnaliser votre tableau de bord et calculer votre IMC.'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* Date of birth */}
                  <div>
                    <label style={labelStyle}>
                      <FaBirthdayCake color="#0d9488" size={12} />
                      {lang === 'EN' ? 'Date of Birth' : 'Date de naissance'}
                      {age !== null && (
                        <span style={{ marginLeft: 'auto', color: '#0d9488', fontSize: '0.8rem', fontWeight: 800, textTransform: 'none', letterSpacing: 0 }}>
                          {age} {lang === 'EN' ? 'years old' : 'ans'}
                        </span>
                      )}
                    </label>
                    <input type="date" value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      style={inputStyle} />
                  </div>

                  {/* Gender */}
                  <div>
                    <label style={labelStyle}>
                      <FaVenusMars color="#0d9488" size={12} />
                      {lang === 'EN' ? 'Gender' : 'Sexe'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { id: 'female', label: { EN: 'Female', FR: 'Féminin' }, icon: '♀' },
                        { id: 'male', label: { EN: 'Male', FR: 'Masculin' }, icon: '♂' }
                      ].map(g => (
                        <button key={g.id} type="button" onClick={() => setSex(g.id)} style={{
                          padding: '14px',
                          border: '2px solid ' + (sex === g.id ? '#0d9488' : '#e2e8f0'),
                          borderRadius: '12px',
                          background: sex === g.id ? '#f0fdf4' : 'white',
                          color: sex === g.id ? '#0d9488' : '#64748b',
                          fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          fontFamily: 'Inter, sans-serif', transition: 'all 0.15s'
                        }}>
                          <span style={{ fontSize: '1.1rem' }}>{g.icon}</span>
                          {g.label[lang]}
                          {sex === g.id && <FaCheckCircle size={12} color="#0d9488" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <label style={labelStyle}>
                      <FaRulerVertical color="#0d9488" size={12} />
                      {lang === 'EN' ? 'Height' : 'Taille'}
                      <span style={{ marginLeft: 'auto', color: '#1e293b', fontSize: '0.88rem', fontWeight: 800, textTransform: 'none', letterSpacing: 0 }}>
                        {height} cm
                        <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.75rem', marginLeft: '4px' }}>
                          ({Math.floor(height / 30.48)}ft {Math.round((height / 2.54) % 12)}in)
                        </span>
                      </span>
                    </label>
                    <input type="range" min="100" max="230" value={height}
                      onChange={e => setHeight(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#0d9488', cursor: 'pointer' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#cbd5e1', marginTop: '2px' }}>
                      <span>100cm</span><span>165cm</span><span>230cm</span>
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <label style={labelStyle}>
                      <FaWeight color="#0d9488" size={12} />
                      {lang === 'EN' ? 'Weight' : 'Poids'}
                      <span style={{ marginLeft: 'auto', color: '#1e293b', fontSize: '0.88rem', fontWeight: 800, textTransform: 'none', letterSpacing: 0 }}>
                        {weight} kg
                        <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.75rem', marginLeft: '4px' }}>
                          ({Math.round(weight * 2.205)} lbs)
                        </span>
                      </span>
                    </label>
                    <input type="range" min="30" max="180" value={weight}
                      onChange={e => setWeight(parseInt(e.target.value))}
                      style={{ width: '100%', accentColor: '#0d9488', cursor: 'pointer' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#cbd5e1', marginTop: '2px' }}>
                      <span>30kg</span><span>105kg</span><span>180kg</span>
                    </div>
                  </div>

                  {/* BMI Card */}
                  {bmiInfo && (
                    <div style={{
                      background: bmiInfo.bg,
                      border: '1.5px solid ' + bmiInfo.color + '40',
                      borderRadius: '14px', padding: '16px 20px',
                      display: 'flex', alignItems: 'center', gap: '16px'
                    }}>
                      <div style={{ textAlign: 'center', minWidth: '60px' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>BMI / IMC</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: bmiInfo.color, lineHeight: 1.1 }}>{bmi}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: bmiInfo.color, marginBottom: '6px' }}>
                          {bmiInfo.label[lang]}
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: bmiInfo.bar + '%',
                            background: bmiInfo.color, borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#cbd5e1', marginTop: '3px' }}>
                          <span>{lang === 'EN' ? 'Under' : 'Sous'}</span>
                          <span>{lang === 'EN' ? 'Healthy' : 'Santé'}</span>
                          <span>{lang === 'EN' ? 'Over' : 'Sur'}</span>
                          <span>{lang === 'EN' ? 'Obese' : 'Obèse'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>

                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px',
                    padding: '4px 12px', marginBottom: '10px'
                  }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {lang === 'EN' ? 'Optional — Skip if you prefer' : 'Optionnel — Ignorez si vous préférez'}
                    </span>
                  </div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                    {lang === 'EN' ? 'Medical Background' : 'Antécédents Médicaux'}
                  </h2>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    {lang === 'EN'
                      ? 'Helps doctors understand your history before a consultation. Update anytime in My Profile.'
                      : 'Aide les médecins à mieux vous connaître. Modifiable à tout moment dans Mon Profil.'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>
                      <span style={{ fontSize: '0.85rem' }}>⚠️</span>
                      {lang === 'EN' ? 'Allergies' : 'Allergies'}
                    </label>
                    <input type="text" value={allergies}
                      onChange={e => setAllergies(e.target.value)}
                      placeholder={lang === 'EN'
                        ? 'e.g. Penicillin, Pollen, Peanuts... (leave blank if none)'
                        : 'ex: Pénicilline, Pollen, Arachides... (laisser vide si aucune)'}
                      style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <FaFileMedical color="#ef4444" size={12} />
                      {lang === 'EN' ? 'Chronic Conditions' : 'Maladies Chroniques'}
                    </label>
                    <input type="text" value={chronicIllnesses}
                      onChange={e => setChronicIllnesses(e.target.value)}
                      placeholder={lang === 'EN'
                        ? 'e.g. Diabetes, Asthma, Hypertension... (leave blank if none)'
                        : 'ex: Diabète, Asthme, Hypertension... (laisser vide si aucune)'}
                      style={inputStyle} />
                  </div>

                  <div>
                    <label style={labelStyle}>
                      <FaPills color="#8b5cf6" size={12} />
                      {lang === 'EN' ? 'Current Treatments' : 'Traitements en cours'}
                    </label>
                    <input type="text" value={activeTreatments}
                      onChange={e => setActiveTreatments(e.target.value)}
                      placeholder={lang === 'EN'
                        ? 'e.g. Insulin, Beta-blockers... (leave blank if none)'
                        : 'ex: Insuline, Bêta-bloquants... (laisser vide si aucun)'}
                      style={inputStyle} />
                  </div>

                  <div style={{
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                    padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px'
                  }}>
                    <FaNotesMedical color="#0d9488" size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                      {lang === 'EN'
                        ? 'Your medical data is private and only visible to you and doctors you consult.'
                        : 'Vos données médicales sont privées et visibles uniquement par vous et les médecins que vous consultez.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>

                <div style={{ textAlign: 'center', padding: '10px 0' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(13,148,136,0.3)'
                  }}>
                    <FaCheckCircle color="white" size={36} />
                  </div>

                  <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>
                    {lang === 'EN' ? "You're all set!" : 'Tout est prêt !'}
                  </h2>
                  <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '0.86rem', lineHeight: 1.6 }}>
                    {lang === 'EN'
                      ? 'Your health profile has been created. Welcome to AnasHealthcare!'
                      : 'Votre profil santé a été créé. Bienvenue sur AnasHealthcare !'}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px', textAlign: 'left' }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {lang === 'EN' ? 'Your BMI' : 'Votre IMC'}
                      </div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b' }}>{bmi}</div>
                      {bmiInfo && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: bmiInfo.color }}>
                          {bmiInfo.label[lang]}
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '14px' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {lang === 'EN' ? 'Profile' : 'Profil'}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b' }}>
                        {sex === 'female' ? (lang === 'EN' ? 'Female' : 'Féminin') : (lang === 'EN' ? 'Male' : 'Masculin')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {age !== null ? (age + ' ' + (lang === 'EN' ? 'years old' : 'ans')) : ''} • {height}cm • {weight}kg
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div style={{
                      padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
                      background: '#fef2f2', border: '1px solid #fecaca',
                      fontSize: '0.78rem', color: '#991b1b', fontWeight: 600
                    }}>{error}</div>
                  )}

                  <button onClick={handleSubmit} disabled={loading} style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    color: 'white', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 4px 15px rgba(13,148,136,0.35)', fontFamily: 'Inter, sans-serif'
                  }}>
                    {loading
                      ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {lang === 'EN' ? 'Go to my Dashboard' : 'Accéder à mon Tableau de bord'}
                          <FaArrowRight />
                        </span>
                      )
                    }
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {error && step !== 3 && (
            <div style={{
              marginTop: '14px', padding: '10px 14px', borderRadius: '8px',
              background: '#fef2f2', border: '1px solid #fecaca',
              fontSize: '0.78rem', color: '#991b1b', fontWeight: 600
            }}>{error}</div>
          )}

          {step < 3 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', gap: '12px' }}>
              {step > 1 ? (
                <button onClick={() => { setStep(step - 1); setError(''); }} style={{
                  padding: '11px 20px', background: 'white', border: '1.5px solid #e2e8f0',
                  borderRadius: '10px', color: '#64748b', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <FaArrowLeft size={12} />
                  {lang === 'EN' ? 'Back' : 'Retour'}
                </button>
              ) : <div />}

              <button onClick={handleNext} style={{
                padding: '11px 24px',
                background: 'linear-gradient(135deg, #0d9488, #0f766e)',
                border: 'none', borderRadius: '10px', color: 'white',
                fontWeight: 800, cursor: 'pointer', fontSize: '0.88rem',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(13,148,136,0.25)',
                fontFamily: 'Inter, sans-serif', marginLeft: 'auto'
              }}>
                {step === 2
                  ? (lang === 'EN' ? 'Almost done' : 'Presque terminé')
                  : (lang === 'EN' ? 'Continue' : 'Continuer')}
                <FaArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
