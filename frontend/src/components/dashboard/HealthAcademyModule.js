import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBookReader, FaAward, FaChartBar, FaCheck, FaTimes, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

const COURSES = [
  {
    id: 'first_aid',
    title: { EN: 'First Aid Basics', FR: 'Bases de Premiers Secours' },
    desc: { EN: 'Learn vital gestures to save lives in emergencies.', FR: 'Apprenez les gestes vitaux pour sauver des vies.' },
    badge: 'first_responder',
    badgeLabel: { EN: 'First Responder', FR: 'Secouriste Certifié' },
    lesson: {
      title: { EN: 'The Recovery Position (PLS)', FR: 'La Position Latérale de Sécurité (PLS)' },
      content: {
        EN: 'The Recovery Position (PLS) is used when a victim is unconscious but breathing normally. It keeps the airway open and prevents choking on vomit. To perform it: 1) Place the arm closest to you at a right angle. 2) Bring the other arm across the chest. 3) Bend the far knee. 4) Roll the victim toward you onto their side. 5) Adjust the hand under the cheek and open the mouth slightly.',
        FR: 'La Position Latérale de Sécurité (PLS) s\'applique lorsqu\'une victime est inconsciente mais respire normalement. Elle permet de maintenir les voies respiratoires ouvertes et d\'éviter l\'asphyxie. Pour la réaliser : 1) Placez le bras le plus proche de vous à angle droit. 2) Ramenez l\'autre bras sur la poitrine. 3) Pliez le genou opposé. 4) Faites rouler la victime vers vous sur le côté. 5) Ajustez la main sous la joue et ouvrez sa bouche.'
      }
    },
    quiz: {
      question: { EN: 'When should you put a victim in the Recovery Position (PLS)?', FR: 'Quand doit-on placer une victime en Position Latérale de Sécurité (PLS) ?' },
      options: [
        { id: 'A', text: { EN: 'If she is conscious and talking.', FR: 'Si elle est consciente et parle.' } },
        { id: 'B', text: { EN: 'If she is unconscious but breathing.', FR: 'Si elle est inconsciente mais respire.' } },
        { id: 'C', text: { EN: 'If she is unconscious and not breathing.', FR: 'Si elle est inconsciente et ne respire plus.' } }
      ],
      correct: 'B'
    }
  },
  {
    id: 'nutrition',
    title: { EN: 'Healthy Nutrition', FR: 'Nutrition Équilibrée' },
    desc: { EN: 'Master daily hydration and vital nutrient balances.', FR: 'Maîtrisez les bases de l\'hydratation et des nutriments.' },
    badge: 'nutrition_novice',
    badgeLabel: { EN: 'Nutrition Champion', FR: 'As de la Nutrition' },
    lesson: {
      title: { EN: 'The Vital Role of Hydration', FR: 'L\'importance de l\'hydratation' },
      content: {
        EN: 'Water is the primary component of the human body, accounting for about 60% of body weight. Proper hydration regulates body temperature, lubricates joints, and helps kidneys flush waste. In warm tropical climates like Cameroon, dehydration can occur quickly. Adults should drink at least 1.5 to 2 liters of water daily, even before feeling thirsty.',
        FR: 'L\'eau est le composant principal du corps humain (environ 60% du poids). Une bonne hydratation régule la température corporelle, protège les articulations et aide les reins à éliminer les toxines. Dans les climats tropicaux chauds comme au Cameroun, la déshydratation survient vite. Un adulte doit boire au moins 1,5 à 2 litres d\'eau par jour.'
      }
    },
    quiz: {
      question: { EN: 'How much water should a healthy adult drink daily?', FR: 'Quelle quantité minimale d\'eau un adulte doit-il boire par jour ?' },
      options: [
        { id: 'A', text: { EN: '0.5 liters', FR: '0,5 litre' } },
        { id: 'B', text: { EN: '1.5 to 2 liters', FR: '1,5 à 2 litres' } },
        { id: 'C', text: { EN: '5 liters', FR: '5 litres' } }
      ],
      correct: 'B'
    }
  },
  {
    id: 'prevention',
    title: { EN: 'Malaria Prevention', FR: 'Prévention du Paludisme' },
    desc: { EN: 'Defend your home and family against malaria.', FR: 'Protégez votre domicile et votre famille du paludisme.' },
    badge: 'preventive_hero',
    badgeLabel: { EN: 'Prevention Hero', FR: 'Héros de la Prévention' },
    lesson: {
      title: { EN: 'Stagnant Water and Mosquito Nets', FR: 'Eaux stagnantes et moustiquaires' },
      content: {
        EN: 'Malaria is transmitted by female Anopheles mosquitoes. They breed in clean, stagnant water around homes. To prevent malaria: 1) Eliminate stagnant water pools, empty flower pots and old tires. 2) Sleep under WHO-approved insecticide-treated mosquito nets (ITNs) every night. 3) Install insect screens on windows and use mosquito repellents during evening hours.',
        FR: 'Le paludisme est transmis par la piqûre de moustiques Anophèles femelles. Ils pondent dans les eaux stagnantes autour des habitations. Pour le prévenir : 1) Éliminez les flaques d\'eau, videz les récipients et pneus abandonnés. 2) Dormez chaque nuit sous une moustiquaire imprégnée d\'insecticide. 3) Placez des moustiquaires aux fenêtres.'
      }
    },
    quiz: {
      question: { EN: 'Which is the most effective household action to prevent malaria?', FR: 'Quelle est l\'action domestique la plus efficace pour prévenir le paludisme ?' },
      options: [
        { id: 'A', text: { EN: 'Taking vitamin C daily.', FR: 'Prendre de la vitamine C tous les jours.' } },
        { id: 'B', text: { EN: 'Sleeping under an insecticide-treated mosquito net.', FR: 'Dormir sous une moustiquaire imprégnée.' } },
        { id: 'C', text: { EN: 'Leaving windows fully open at night without nets.', FR: 'Laisser les fenêtres ouvertes la nuit sans moustiquaires.' } }
      ],
      correct: 'B'
    }
  }
];

const HealthAcademyModule = ({ lang }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [userProgress, setUserProgress] = useState({}); // courseId -> true/false
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  useEffect(() => {
    const progress = localStorage.getItem('academy_progress');
    if (progress) {
      setUserProgress(JSON.parse(progress));
    }
  }, []);

  const handleStartCourse = (course) => {
    setSelectedCourse(course);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
  };

  const handleSelectOption = (optId) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optId);
  };

  const handleSubmitQuiz = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === selectedCourse.quiz.correct;
    setQuizSuccess(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect) {
      const updatedProgress = { ...userProgress, [selectedCourse.id]: true };
      setUserProgress(updatedProgress);
      localStorage.setItem('academy_progress', JSON.stringify(updatedProgress));
    }
  };

  const completedCount = Object.values(userProgress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / COURSES.length) * 100);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          // 1. Academy Overview & Courses List
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}
          >
            {/* Courses Column */}
            <div>
              <h3 style={{ margin: '0 0 16px', color: '#0f172a', fontWeight: 800, fontSize: '1.15rem' }}>
                🎓 {lang === 'EN' ? 'Available Courses' : 'Cours Disponibles'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {COURSES.map(course => {
                  const isCompleted = !!userProgress[course.id];
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleStartCourse(course)}
                      style={{
                        background: 'white', border: '1px solid #e2e8f0',
                        borderRadius: '16px', padding: '16px 20px',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = '#4f46e5'}
                      onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>{course.title[lang]}</span>
                          {isCompleted && (
                            <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '20px' }}>
                              {lang === 'EN' ? 'Passed' : 'Validé'}
                            </span>
                          )}
                        </div>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>{course.desc[lang]}</p>
                      </div>
                      <FaArrowRight size={12} color="#cbd5e1" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gamification Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Progress Card */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaChartBar color="#4f46e5" /> {lang === 'EN' ? 'My Progress' : 'Ma Progression'}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>
                  <span>{lang === 'EN' ? 'Academy Completion' : "Validation de l'Académie"}</span>
                  <span style={{ color: '#4f46e5' }}>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: '#4f46e5', borderRadius: '10px', transition: 'width 0.4s' }} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1e293b' }}>{COURSES.length}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{lang === 'EN' ? 'Courses' : 'Cours'}</div>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#16a34a' }}>{completedCount}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{lang === 'EN' ? 'Completed' : 'Terminés'}</div>
                  </div>
                </div>
              </div>

              {/* Badges Panel */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaAward color="#eab308" /> {lang === 'EN' ? 'My Badges' : 'Mes Badges'}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
                  {COURSES.map(course => {
                    const active = !!userProgress[course.id];
                    return (
                      <div key={course.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: active ? 1 : 0.25 }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, #fef08a 0%, #eab308 100%)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: active ? '0 4px 10px rgba(234,179,8,0.3)' : 'none',
                          marginBottom: '8px', border: '2px solid white'
                        }}>
                          <FaGraduationCap size={20} color="white" />
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#334155', lineHeight: 1.2 }}>
                          {course.badgeLabel[lang]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // 2. Lesson content & Quiz view
          <motion.div
            key="course_view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}
          >
            {/* Lesson details */}
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <button
                  onClick={() => setSelectedCourse(null)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b'
                  }}
                >
                  {lang === 'EN' ? 'Back' : 'Retour'}
                </button>
                <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 900, fontSize: '1.2rem' }}>{selectedCourse.title[lang]}</h2>
              </div>
              <h3 style={{ margin: '0 0 10px', color: '#4f46e5', fontWeight: 800, fontSize: '0.95rem' }}>
                <FaBookReader style={{ marginRight: '6px' }} /> {selectedCourse.lesson.title[lang]}
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.7 }}>
                {selectedCourse.lesson.content[lang]}
              </p>
            </div>

            {/* Quiz panel */}
            <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '24px', padding: '24px' }}>
              <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '1rem', fontWeight: 800 }}>
                ❓ {lang === 'EN' ? 'Lesson Quiz' : 'Quiz de Fin de Cours'}
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '0.88rem', color: '#334155', fontWeight: 700, lineHeight: 1.5 }}>
                {selectedCourse.quiz.question[lang]}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {selectedCourse.quiz.options.map(opt => {
                  let borderClr = '#cbd5e1';
                  let bgClr = 'white';
                  let checkIcon = null;

                  if (selectedAnswer === opt.id) {
                    borderClr = '#4f46e5';
                    bgClr = '#f5f3ff';
                  }

                  if (quizSubmitted) {
                    if (opt.id === selectedCourse.quiz.correct) {
                      borderClr = '#16a34a';
                      bgClr = '#f0fdf4';
                      checkIcon = <FaCheck color="#16a34a" size={12} />;
                    } else if (selectedAnswer === opt.id) {
                      borderClr = '#ef4444';
                      bgClr = '#fef2f2';
                      checkIcon = <FaTimes color="#ef4444" size={12} />;
                    }
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      style={{
                        padding: '12px 16px', background: bgClr,
                        border: `1.5px solid ${borderClr}`, borderRadius: '12px',
                        cursor: quizSubmitted ? 'default' : 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.15s'
                      }}
                    >
                      <span style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 500 }}>
                        <strong>{opt.id}.</strong> {opt.text[lang]}
                      </span>
                      {checkIcon}
                    </div>
                  );
                })}
              </div>

              {quizSubmitted ? (
                <div style={{
                  background: quizSuccess ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${quizSuccess ? '#bbf7d0' : '#fecaca'}`,
                  borderRadius: '12px', padding: '12px', textAlign: 'center',
                  marginBottom: '16px', color: quizSuccess ? '#15803d' : '#b91c1c',
                  fontSize: '0.82rem', fontWeight: 700
                }}>
                  {quizSuccess 
                    ? (lang === 'EN' ? 'Correct answer! Course validated and badge earned.' : 'Bonne réponse ! Cours validé et badge obtenu.')
                    : (lang === 'EN' ? 'Incorrect answer. Try again.' : 'Mauvaise réponse. Réessayez.')
                  }
                </div>
              ) : null}

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!selectedAnswer}
                  style={{
                    width: '100%', padding: '12px',
                    background: selectedAnswer ? '#4f46e5' : '#94a3b8',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontWeight: 700, fontSize: '0.85rem', cursor: selectedAnswer ? 'pointer' : 'not-allowed'
                  }}
                >
                  {lang === 'EN' ? 'Submit Answer' : 'Valider la réponse'}
                </button>
              ) : (
                <button
                  onClick={() => handleStartCourse(selectedCourse)}
                  style={{
                    width: '100%', padding: '12px',
                    background: 'white', border: '1.5px solid #cbd5e1',
                    color: '#475569', borderRadius: '12px',
                    fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                  }}
                >
                  {lang === 'EN' ? 'Retry Quiz' : 'Réessayer le Quiz'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthAcademyModule;
