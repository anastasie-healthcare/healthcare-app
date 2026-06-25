import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaStar, FaRegStar, FaHistory, FaCapsules, FaChevronRight, FaChevronLeft, FaExclamationCircle } from 'react-icons/fa';
import { MdClearAll } from 'react-icons/md';

const DRUG_DATABASE = [
  {
    id: 'paracetamol',
    name: 'Paracétamol (Doliprane, Efferalgan)',
    class: { EN: 'Analgesic & Antipyretic', FR: 'Antalgique & Antipyrétique' },
    uses: {
      EN: 'Fever, mild to moderate pain (headache, toothache, body aches).',
      FR: 'Fièvre, douleurs légères à modérées (maux de tête, courbatures, douleurs dentaires).'
    },
    dosage: {
      EN: 'Adults: 500mg to 1g every 4 to 6 hours (Max 4g per day). Children: 60mg/kg/day divided into 4 or 6 doses.',
      FR: 'Adulte : 500mg à 1g par prise, à espacer de 4 à 6 heures (Max 4g par jour). Enfant : 60mg/kg/jour répartis en 4 ou 6 prises.'
    },
    precautions: {
      EN: 'Severe liver disease (hepatoxicity risk). Do NOT combine with other drugs containing paracetamol.',
      FR: 'Insuffisance hépatique sévère. Ne pas associer à d\'autres médicaments contenant du paracétamol (risque de surdosage mortel).'
    },
    sideEffects: {
      EN: 'Rare. Allergic skin reactions, liver damage in case of overdose.',
      FR: 'Très rares. Éruptions cutanées allergiques, lésions du foie en cas de surdosage.'
    },
    interactions: {
      EN: 'Alcohol increases liver toxicity. Anticoagulants (warfarin) require monitoring if taken long-term.',
      FR: 'Alcool (augmente la toxicité hépatique). Anticoagulants oraux (nécessite un contrôle en cas de prise prolongée).'
    }
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofène (Advil, Nurofen)',
    class: { EN: 'NSAID (Non-steroidal Anti-inflammatory)', FR: 'AINS (Anti-inflammatoire Non Stéroïdien)' },
    uses: {
      EN: 'Pain, inflammation, joint pain, migraine, dental pain.',
      FR: 'Douleurs, inflammation, douleurs articulaires, migraine, maux de dents.'
    },
    dosage: {
      EN: 'Adults: 200mg to 400mg every 6 hours (Max 1200mg per day). Always take with meals.',
      FR: 'Adulte : 200mg à 400mg par prise, à espacer de 6 heures (Max 1200mg par jour). À prendre impérativement au cours des repas.'
    },
    precautions: {
      EN: 'Do NOT take during pregnancy (from 6th month). Active stomach ulcer, kidney or heart failure.',
      FR: 'CONTRE-INDIQUÉ pendant la grossesse (dès le 6e mois). Ulcère gastro-duodénal, insuffisance rénale ou cardiaque.'
    },
    sideEffects: {
      EN: 'Heartburn, stomach ulcer, headache, dizziness, increased risk of bleeding.',
      FR: 'Brûlures d\'estomac, ulcère gastrique, maux de tête, vertiges, augmentation du risque de saignement.'
    },
    interactions: {
      EN: 'Aspirin, other NSAIDs, oral anticoagulants, lithium.',
      FR: 'Aspirine, autres AINS, anticoagulants oraux (risque hémorragique majeur), lithium.'
    }
  },
  {
    id: 'amoxicillin',
    name: 'Amoxicilline (Clamoxyl)',
    class: { EN: 'Penicillin Antibiotic', FR: 'Antibiotique (Pénicilline)' },
    uses: {
      EN: 'Bacterial infections (ear infections, sinusitis, bronchitis, urinary tract infections).',
      FR: 'Infections bactériennes (otites, sinusites, bronchites, infections urinaires).'
    },
    dosage: {
      EN: 'Adults: 1g to 2g per day in 2 or 3 takes. Complete the full prescribed duration.',
      FR: 'Adulte : 1g à 2g par jour répartis en 2 ou 3 prises. Respectez scrupuleusement la durée prescrite.'
    },
    precautions: {
      EN: 'Allergy to penicillins or cephalosporins (risk of anaphylactic shock).',
      FR: 'Allergie connue aux pénicillines ou céphalosporines (risque de choc anaphylactique).'
    },
    sideEffects: {
      EN: 'Diarrhea, nausea, vomiting, skin rash (allergic reaction).',
      FR: 'Diarrhées, nausées, vomissements, éruption cutanée d\'origine allergique.'
    },
    interactions: {
      EN: 'Methotrexate, Allopurinol (increases skin rash risk).',
      FR: 'Méthotrexate, Allopurinol (risque accru de réactions cutanées).'
    }
  },
  {
    id: 'spasfon',
    name: 'Spasfon (Phloroglucinol)',
    class: { EN: 'Antispasmodic', FR: 'Antispasmodique' },
    uses: {
      EN: 'Spasmodic pain in intestines, bile ducts, bladder, or uterus (menstrual pain).',
      FR: 'Douleurs spasmodiques de l\'intestin, des voies biliaires, de la vessie ou de l\'utérus (règles douloureuses).'
    },
    dosage: {
      EN: 'Adults: 2 tablets per take, up to 3 times per day (Max 6 tablets daily).',
      FR: 'Adulte : 2 comprimés par prise, jusqu\'à 3 fois par jour si nécessaire (Max 6 comprimés par jour).'
    },
    precautions: {
      EN: 'Contains lactose and sucrose; avoid if intolerant.',
      FR: 'Contient du lactose et du saccharose ; à éviter en cas d\'intolérance.'
    },
    sideEffects: {
      EN: 'Extremely rare. Cutaneous allergic reactions.',
      FR: 'Très rares. Réactions allergiques cutanées (urticaire).'
    },
    interactions: {
      EN: 'None reported.',
      FR: 'Aucune interaction majeure signalée.'
    }
  },
  {
    id: 'gaviscon',
    name: 'Gaviscon',
    class: { EN: 'Antacid & Gastric Reflux Barrier', FR: 'Anti-acide & Protecteur Gastrique' },
    uses: {
      EN: 'Heartburn, acid reflux, GERD.',
      FR: 'Brûlures d\'estomac, remontées acides, reflux gastro-œsophagien (RGO).'
    },
    dosage: {
      EN: 'Adults: 1 sachet or 2 tablets after main meals and at bedtime.',
      FR: 'Adulte : 1 sachet ou 2 comprimés après les principaux repas et au coucher.'
    },
    precautions: {
      EN: 'Low-sodium diet (contains sodium bicarbonate). Take 2 hours apart from other drugs.',
      FR: 'Régime pauvre en sel (contient du sodium). À prendre à distance d\'autres médicaments (2h d\'écart).'
    },
    sideEffects: {
      EN: 'Constipation, bloating, allergic reactions.',
      FR: 'Constipation, ballonnements, réactions allergiques exceptionnelles.'
    },
    interactions: {
      EN: 'Reduces absorption of most other medications (antibiotics, iron, etc.).',
      FR: 'Diminue l\'absorption de la majorité des autres médicaments (antibiotiques, fer, etc.).'
    }
  },
  {
    id: 'ventoline',
    name: 'Salbutamol (Ventoline)',
    class: { EN: 'Bronchodilator (Beta-2 Agonist)', FR: 'Bronchodilatateur' },
    uses: {
      EN: 'Asthma attack, exercise-induced asthma, chronic obstructive pulmonary disease (COPD).',
      FR: 'Crise d\'asthme, asthme d\'effort, bronchopneumopathie chronique obstructive (BPCO).'
    },
    dosage: {
      EN: '1 to 2 inhalations during symptoms. Repeat if necessary after a few minutes.',
      FR: '1 à 2 inhalations lors des crises. Répétez après quelques minutes si nécessaire.'
    },
    precautions: {
      EN: 'Severe cardiovascular disease, hyperthyroidism.',
      FR: 'Troubles cardiaques sévères, hyperthyroïdie.'
    },
    sideEffects: {
      EN: 'Mild hand tremors, increased heart rate (palpitations), headache.',
      FR: 'Tremblements fins des mains, accélération du rythme cardiaque (palpitations), maux de tête.'
    },
    interactions: {
      EN: 'Beta-blockers (antagonize effect).',
      FR: 'Bêtabloquants (annulent l\'effet du salbutamol).'
    }
  }
];

const MedicationModule = ({ lang }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'favorites', 'history'
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);

  useEffect(() => {
    const favs = localStorage.getItem('drug_favorites');
    const hist = localStorage.getItem('drug_history');
    if (favs) setFavorites(JSON.parse(favs));
    if (hist) setHistory(JSON.parse(hist));
  }, []);

  const toggleFavorite = (drugId, e) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(drugId)) {
      updated = favorites.filter(id => id !== drugId);
    } else {
      updated = [...favorites, drugId];
    }
    setFavorites(updated);
    localStorage.setItem('drug_favorites', JSON.stringify(updated));
  };

  const handleSelectDrug = (drug) => {
    setSelectedDrug(drug);
    // Add to history
    const item = { id: drug.id, name: drug.name, timestamp: Date.now() };
    const filteredHist = history.filter(h => h.id !== drug.id);
    const updated = [item, ...filteredHist].slice(0, 10); // keep last 10
    setHistory(updated);
    localStorage.setItem('drug_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('drug_history');
  };

  const filteredDrugs = DRUG_DATABASE.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(search.toLowerCase()) || 
                          drug.class[lang].toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (activeTab === 'favorites') {
      return favorites.includes(drug.id) && matchesSearch;
    }
    return false;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {!selectedDrug ? (
          // Main list & search view
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {/* Search console */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <FaSearch size={18} color="#94a3b8" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'EN' ? 'Search medication name or therapeutic class...' : 'Rechercher par nom ou classe thérapeutique...'}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: '0.92rem',
                  fontFamily: "'Inter', sans-serif",
                  color: '#1e293b'
                }}
              />
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              {[
                { id: 'all', label: lang === 'EN' ? 'All Medicines' : 'Tous les Médicaments' },
                { id: 'favorites', label: lang === 'EN' ? 'Favorites' : 'Favoris' },
                { id: 'history', label: lang === 'EN' ? 'Recent History' : 'Historique récent' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? '#4f46e5' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content renderer */}
            {activeTab === 'history' ? (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, color: '#334155', fontWeight: 800, fontSize: '0.9rem' }}>
                    <FaHistory style={{ marginRight: '6px' }} /> {lang === 'EN' ? 'Search History' : 'Recherches Récentes'}
                  </h4>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      style={{
                        background: 'none', border: 'none', color: '#ef4444',
                        fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <MdClearAll size={16} /> {lang === 'EN' ? 'Clear' : 'Effacer'}
                    </button>
                  )}
                </div>
                
                {history.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.82rem' }}>
                    {lang === 'EN' ? 'No history found.' : "Aucun historique de recherche."}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {history.map((h, idx) => {
                      const drug = DRUG_DATABASE.find(d => d.id === h.id);
                      return (
                        <div
                          key={idx}
                          onClick={() => drug && handleSelectDrug(drug)}
                          style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 16px', background: '#f8fafc', border: '1px solid #f1f5f9',
                            borderRadius: '12px', cursor: 'pointer'
                          }}
                        >
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>{h.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(h.timestamp).toLocaleTimeString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              // Medicines Grid / List
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredDrugs.length === 0 ? (
                  <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    <FaCapsules size={28} style={{ marginBottom: '10px', color: '#cbd5e1' }} />
                    <div style={{ fontSize: '0.85rem' }}>{lang === 'EN' ? 'No medications found.' : 'Aucun médicament trouvé.'}</div>
                  </div>
                ) : (
                  filteredDrugs.map(drug => (
                    <div
                      key={drug.id}
                      onClick={() => handleSelectDrug(drug)}
                      style={{
                        background: 'white', border: '1px solid #e2e8f0',
                        borderRadius: '16px', padding: '16px 20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        cursor: 'pointer', transition: 'all 0.15s'
                      }}
                      onMouseOver={e => e.currentTarget.style.borderColor = '#4f46e5'}
                      onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FaCapsules size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1e293b' }}>{drug.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{drug.class[lang]}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={(e) => toggleFavorite(drug.id, e)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#eab308', padding: 0 }}
                        >
                          {favorites.includes(drug.id) ? <FaStar size={18} /> : <FaRegStar size={18} />}
                        </button>
                        <FaChevronRight size={12} color="#cbd5e1" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        ) : (
          // Detailed view
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              background: 'white',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setSelectedDrug(null)}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: '#f8fafc', border: '1px solid #e2e8f0',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569'
                  }}
                >
                  <FaChevronLeft size={16} />
                </button>
                <div>
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 900, fontSize: '1.35rem' }}>{selectedDrug.name}</h2>
                  <span style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 600 }}>{selectedDrug.class[lang]}</span>
                </div>
              </div>
              <button
                onClick={(e) => toggleFavorite(selectedDrug.id, e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#eab308', padding: 0 }}
              >
                {favorites.includes(selectedDrug.id) ? <FaStar size={22} /> : <FaRegStar size={22} />}
              </button>
            </div>

            {/* Warning Banner */}
            <div style={{
              background: '#fff7ed', border: '1px solid #ffedd5',
              borderRadius: '16px', padding: '14px 18px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              marginBottom: '20px'
            }}>
              <FaExclamationCircle color="#ea580c" size={18} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c2410c' }}>
                  {lang === 'EN' ? 'Safety Notice' : 'Notice de Sécurité'}
                </span>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#9a3412', lineHeight: 1.4, marginTop: '2px' }}>
                  {lang === 'EN' 
                    ? 'Always follow your doctor\'s prescription. Never change dosage without medical advice.' 
                    : 'Suivez toujours la prescription de votre médecin. Ne modifiez jamais la posologie de votre propre chef.'}
                </p>
              </div>
            </div>

            {/* Grid specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {[
                { title: lang === 'EN' ? 'Common Uses' : 'Utilisations & Indications', val: selectedDrug.uses[lang], color: '#3b82f6', bg: '#eff6ff' },
                { title: lang === 'EN' ? 'Standard Dosage' : 'Posologie Usuelle', val: selectedDrug.dosage[lang], color: '#10b981', bg: '#f0fdf4' },
                { title: lang === 'EN' ? 'Critical Precautions' : 'Contre-indications & Précautions', val: selectedDrug.precautions[lang], color: '#ef4444', bg: '#fef2f2' },
                { title: lang === 'EN' ? 'Side Effects' : 'Effets Secondaires', val: selectedDrug.sideEffects[lang], color: '#8b5cf6', bg: '#f5f3ff' },
                { title: lang === 'EN' ? 'Known Drug Interactions' : 'Interactions Médicamenteuses', val: selectedDrug.interactions[lang], color: '#f59e0b', bg: '#fffbeb' }
              ].map((spec, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: spec.color }} />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>{spec.title}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.6 }}>{spec.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicationModule;
