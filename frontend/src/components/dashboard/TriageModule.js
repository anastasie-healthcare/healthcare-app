import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHeartbeat, FaInfoCircle, FaRedo, 
  FaHospital, FaStethoscope, FaSpinner,
  FaCheckCircle, FaExclamationCircle, FaUserClock
} from 'react-icons/fa';
import { aiTriage, createAppointment } from '../../services/api';

const SYMPTOM_CHECKBOXES = [
  { id: 'fever', label: { EN: 'Fever', FR: 'Fièvre' } },
  { id: 'chills', label: { EN: 'Chills', FR: 'Frissons' } },
  { id: 'headache', label: { EN: 'Headache', FR: 'Maux de tête' } },
  { id: 'fatigue', label: { EN: 'Severe Fatigue', FR: 'Fatigue intense' } },
  { id: 'abdominal_pain', label: { EN: 'Abdominal Pain', FR: 'Douleur abdominale' } },
  { id: 'nausea_vomiting', label: { EN: 'Nausea / Vomiting', FR: 'Nausées / Vomissements' } },
  { id: 'chest_pain', label: { EN: 'Chest Pain', FR: 'Douleur thoracique' } },
  { id: 'breathing_difficulty', label: { EN: 'Difficulty Breathing', FR: 'Difficulté à respirer' } },
  { id: 'cough', label: { EN: 'Persistent Cough', FR: 'Toux persistante' } },
  { id: 'stiff_neck', label: { EN: 'Stiff Neck', FR: 'Nuque raide' } },
  { id: 'light_sound_sensitivity', label: { EN: 'Sensitivity to Light/Sound', FR: 'Sensibilité lumière/bruit' } },
  { id: 'diarrhea', label: { EN: 'Diarrhea', FR: 'Diarrhée' } },
];

const TriageModule = ({ lang }) => {
  const [freeText, setFreeText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [bookingStatus, setBookingStatus] = useState({});

  const handleCheckboxChange = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const handleTriageSubmit = async (e) => {
    e.preventDefault();
    if (!freeText.trim() && selectedSymptoms.length === 0) {
      setError(
        lang === 'EN'
          ? 'Please enter some text or select at least one symptom.'
          : 'Veuillez saisir du texte ou sélectionner au moins un symptôme.'
      );
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await aiTriage({
        free_text: freeText,
        selected_symptoms: selectedSymptoms,
        additional_info: additionalInfo
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        lang === 'EN'
          ? 'An error occurred during symptom analysis. Please try again.'
          : "Une erreur est survenue lors de l'analyse. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookMockAppointment = async (doctor) => {
    try {
      setBookingStatus({ ...bookingStatus, [doctor.id]: 'loading' });
      // Create a mock appointment tomorrow at 10:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      await createAppointment({
        doctor: doctor.id,
        date: dateStr,
        time_slot: '10:00 - 10:30',
        symptoms: selectedSymptoms.join(', ') + ' | ' + freeText,
        notes: 'AI Orientation recommended consultation.'
      });
      
      setBookingStatus({ ...bookingStatus, [doctor.id]: 'success' });
    } catch (err) {
      console.error(err);
      setBookingStatus({ ...bookingStatus, [doctor.id]: 'error' });
    }
  };

  const handleReset = () => {
    setFreeText('');
    setSelectedSymptoms([]);
    setAdditionalInfo('');
    setResult(null);
    setError('');
    setBookingStatus({});
  };

  const getSymptomLabel = (id) => {
    const s = SYMPTOM_CHECKBOXES.find((item) => item.id === id);
    return s ? s.label[lang] : id;
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 1. Global Reassuring Medical Disclaimer */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
        border: '1px solid #bae6fd',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        boxShadow: '0 4px 12px rgba(14, 165, 233, 0.05)'
      }}>
        <FaInfoCircle color="#0284c7" size={24} style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <h4 style={{ margin: '0 0 4px', color: '#0369a1', fontWeight: 800, fontSize: '0.9rem' }}>
            {lang === 'EN' ? 'Medical Orientation Assistant' : 'Assistant d\'Orientation Médicale'}
          </h4>
          <p style={{ margin: 0, color: '#075985', fontSize: '0.82rem', lineHeight: 1.6 }}>
            {lang === 'EN' 
              ? 'Our assistant will guide you and analyze potential symptoms to guide you toward the right specialist. ONLY a certified healthcare professional can give a medical diagnosis.' 
              : 'Notre assistant vous écoute et analyse vos symptômes potentiels afin de vous orienter vers la bonne spécialité. SEUL un professionnel de santé certifié peut établir un diagnostic.'
            }
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          // Triaging input wizard
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleTriageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Free text input */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                  {lang === 'EN' ? 'Describe what you feel (free text)' : 'Décrivez ce que vous ressentez (texte libre)'}
                </label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder={lang === 'EN' ? "Example: I have high fever and severe headaches since yesterday..." : "Exemple: J'ai une forte fièvre et des maux de tête intenses depuis hier..."}
                  style={{
                    width: '100%',
                    height: '110px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.88rem',
                    fontFamily: "'Inter', sans-serif",
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Symptom checkboxes grid */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
                  {lang === 'EN' ? 'Select specific symptoms (optional)' : 'Sélectionnez des symptômes spécifiques (optionnel)'}
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '10px'
                }}>
                  {SYMPTOM_CHECKBOXES.map((sym) => {
                    const isChecked = selectedSymptoms.includes(sym.id);
                    return (
                      <div
                        key={sym.id}
                        onClick={() => handleCheckboxChange(sym.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: `1.5px solid ${isChecked ? '#14b8a6' : '#e2e8f0'}`,
                          background: isChecked ? '#f0fdfa' : '#f8fafc',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          userSelect: 'none'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          style={{
                            accentColor: '#14b8a6',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: isChecked ? '#0f766e' : '#475569'
                        }}>
                          {sym.label[lang]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional inputs */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                  {lang === 'EN' ? 'Additional Information (Allergies, chronic conditions, etc.)' : 'Informations Complémentaires (Allergies, antécédents, etc.)'}
                </label>
                <input
                  type="text"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder={lang === 'EN' ? "Example: Diabetic, allergic to Penicillin" : "Exemple: Diabétique, allergique à la Pénicilline"}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '0.88rem',
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <FaExclamationCircle />
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaSpinner className="spin" style={{ animation: 'spin 1.2s linear infinite' }} />
                    <span>{lang === 'EN' ? 'Analyzing symptoms patiently...' : 'Analyse bienveillante de vos symptômes...'}</span>
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaHeartbeat />
                    <span>{lang === 'EN' ? 'Analyze Symptoms' : 'Lancer l\'Analyse des Symptômes'}</span>
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          // 3. Results Panel
          <motion.div
            key="results-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Compassionate Summary Banner */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FaStethoscope color="#10b981" />
                </div>
                <h3 style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '1.15rem' }}>
                  {lang === 'EN' ? 'AI Assessment Summary' : "Synthèse de l'Analyse Assistée"}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.92rem', lineHeight: 1.7, fontWeight: 500 }}>
                {result.care_summary[lang]}
              </p>
            </div>

            {/* Hypotheses List */}
            <div>
              <h4 style={{ color: '#1e293b', fontWeight: 800, fontSize: '1rem', marginBottom: '12px' }}>
                🩺 {lang === 'EN' ? 'Compatible Hypotheses' : 'Hypothèses Compatibles'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {result.hypotheses.length === 0 ? (
                  <div style={{
                    background: '#f8fafc',
                    padding: '20px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px dashed #cbd5e1',
                    color: '#64748b',
                    fontSize: '0.88rem'
                  }}>
                    {lang === 'EN' 
                      ? 'No specific disease matches identified. We recommend standard monitoring.' 
                      : 'Aucune correspondance spécifique identifiée. Nous conseillons une surveillance standard.'}
                  </div>
                ) : (
                  result.hypotheses.map((hyp, i) => (
                    <div
                      key={hyp.id}
                      style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '20px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 4px', fontSize: '1.02rem', fontWeight: 800, color: '#1e293b' }}>
                            {hyp.name[lang]}
                          </h5>
                          <span style={{
                            display: 'inline-block',
                            background: '#f1f5f9',
                            color: '#475569',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}>
                            {lang === 'EN' ? `Specialty: ${hyp.specialty}` : `Spécialité : ${hyp.specialty}`}
                          </span>
                        </div>
                        {/* Confidence score badge */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: hyp.confidence_score > 60 ? '#f0fdf4' : '#fffbeb',
                          border: `1px solid ${hyp.confidence_score > 60 ? '#bbf7d0' : '#fde68a'}`,
                          padding: '4px 10px',
                          borderRadius: '20px'
                        }}>
                          <div style={{
                            width: '6px', height: '6px', borderRadius: '50%',
                            background: hyp.confidence_score > 60 ? '#10b981' : '#f59e0b'
                          }} />
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: hyp.confidence_score > 60 ? '#166534' : '#b45309'
                          }}>
                            {lang === 'EN' ? `Confidence: ${hyp.confidence_score}%` : `Confiance: ${hyp.confidence_score}%`}
                          </span>
                        </div>
                      </div>

                      <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
                        {hyp.desc[lang]}
                      </p>

                      {/* Matching and missing signs */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                            ✓ {lang === 'EN' ? 'Matching Symptoms' : 'Signes Présents'}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {hyp.matching_symptoms.map((s) => (
                              <span key={s} style={{ fontSize: '0.75rem', color: '#0f766e', background: '#ccfbf1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                {getSymptomLabel(s)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                            ? {lang === 'EN' ? 'Missing Typical Signs' : 'Signes Absents'}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {hyp.missing_symptoms.map((s) => (
                              <span key={s} style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                                {getSymptomLabel(s)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Smart Orientation Recommendations */}
            <div style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '20px',
              padding: '24px'
            }}>
              <h4 style={{ margin: '0 0 4px', fontWeight: 900, color: '#1e293b', fontSize: '1.05rem' }}>
                🧭 {lang === 'EN' ? 'Smart Orientation' : 'Orientation Recommandée'}
              </h4>
              <p style={{ margin: '0 0 16px', fontSize: '0.83rem', color: '#64748b' }}>
                {lang === 'EN' 
                  ? `Recommended Specialty: ${result.recommended_specialty}. Here are certified specialists who can help.`
                  : `Spécialité recommandée : ${result.recommended_specialty}. Voici les professionnels recommandés.`}
              </p>

              {/* Doctors listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🧑‍⚕️ {lang === 'EN' ? 'Recommended Doctors Available' : 'Médecins Recommandés Disponibles'}
                </div>
                {result.matching_doctors.length === 0 ? (
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', color: '#64748b', fontSize: '0.82rem', textAlign: 'center' }}>
                    {lang === 'EN' ? 'No doctors listed for this specialty yet.' : 'Aucun médecin répertorié dans cette spécialité pour le moment.'}
                  </div>
                ) : (
                  result.matching_doctors.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                          color: 'white', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem'
                        }}>
                          {doc.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>
                            Dr. {doc.username}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {doc.specialty} {doc.establishment_name && `• ${doc.establishment_name}`}
                          </div>
                        </div>
                      </div>
                      <div>
                        {bookingStatus[doc.id] === 'success' ? (
                          <div key="success" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>
                            <FaCheckCircle />
                            <span>{lang === 'EN' ? 'Requested' : 'Demandé'}</span>
                          </div>
                        ) : bookingStatus[doc.id] === 'loading' ? (
                          <div key="loading" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <FaSpinner className="spin" style={{ animation: 'spin 1.2s linear infinite' }} color="#14b8a6" />
                          </div>
                        ) : (
                          <button
                            key="book"
                            onClick={() => handleBookMockAppointment(doc)}
                            style={{
                              padding: '6px 12px',
                              background: '#14b8a6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              fontFamily: "'Inter', sans-serif",
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <FaUserClock />
                            <span>{lang === 'EN' ? 'Book Call' : 'Réserver appel'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Establishments listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🏥 {lang === 'EN' ? 'Relevant Establishments' : 'Établissements Recommandés'}
                </div>
                {result.matching_establishments.length === 0 ? (
                  <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', color: '#64748b', fontSize: '0.82rem', textAlign: 'center' }}>
                    {lang === 'EN' ? 'No establishments linked to this specialty yet.' : 'Aucun établissement associé pour le moment.'}
                  </div>
                ) : (
                  result.matching_establishments.map((est) => (
                    <div
                      key={est.id}
                      style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <FaHospital color="#0d9488" size={18} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#1e293b' }}>
                          {est.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {est.type_display} • {est.location}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Disclaimer text */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.75rem',
              color: '#94a3b8',
              lineHeight: 1.5,
              textAlign: 'center'
            }}>
              ⚠️ {result.disclaimer[lang]}
            </div>

            {/* Reset button */}
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '12px',
                background: 'white',
                border: '1.5px solid #cbd5e1',
                color: '#64748b',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <FaRedo />
              {lang === 'EN' ? 'New AI Assessment' : 'Faire une nouvelle analyse'}
            </button>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TriageModule;
