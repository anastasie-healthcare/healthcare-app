import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Let's import standard react icons
import { 
  FaBrain, FaHeartbeat, FaTimesCircle, FaSwimmer, 
  FaFire, FaTint, FaBone, FaSkullCrossbones, 
  FaBolt, FaCar, FaChevronLeft, FaPhoneAlt, 
  FaClock, FaBaby, FaFemale 
} from 'react-icons/fa';
import { MdSearch, MdInfo } from 'react-icons/md';

// Static Data for the 14 Emergency Types
const EMERGENCY_DATA = {
  stroke: {
    id: 'stroke',
    icon: <FaBrain size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Stroke (AVC)', FR: 'AVC (Accident Vasculaire Cérébral)' },
    desc: { 
      EN: 'Sudden disruption of blood flow to the brain.', 
      FR: "Interruption soudaine de la circulation sanguine dans le cerveau." 
    },
    steps: {
      EN: [
        'Apply the FAST method: Face (drooping), Arm (weakness), Speech (slurred), Time (call immediately).',
        'Note the exact time symptoms started.',
        'Keep the victim lying down, ideally in the Recovery Position (PLS) if unconscious but breathing.',
        'Never leave them unattended and reassure them constantly.'
      ],
      FR: [
        'Appliquez la méthode FAST : Visage (affaissement), Bras (faiblesse), Parole (difficulté à parler), Temps (appeler vite).',
        'Notez l\'heure exacte de début des symptômes.',
        'Allongez la victime, idéalement en Position Latérale de Sécurité (PLS) si elle est inconsciente mais respire.',
        'Ne la laissez jamais seule et rassurez-la continuellement.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT give them anything to eat or drink (risk of choking).',
        'Do NOT administer Aspirin or any other medication (could worsen bleeding).'
      ],
      FR: [
        'Ne donnez NI à boire NI à manger (risque de fausse route).',
        'Ne donnez pas d\'aspirine ou d\'autres médicaments (risque d\'aggravation en cas d\'AVC hémorragique).'
      ]
    },
    quickAction: { EN: 'Start stroke onset timer', FR: 'Lancer le chronomètre de début des symptômes' }
  },
  heart: {
    id: 'heart',
    icon: <FaHeartbeat size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Cardiac Arrest', FR: 'Crise Cardiaque / Arrêt' },
    desc: { 
      EN: 'Chest pain spreading to the arm, neck, or back, or sudden loss of consciousness.', 
      FR: "Douleur thoracique irradiant vers le bras, le cou ou le dos, ou perte de conscience soudaine." 
    },
    steps: {
      EN: [
        'Check responsiveness: shake gently and ask questions.',
        'Check breathing: look, listen, and feel for chest movement (max 10 seconds).',
        'Call emergency services immediately and request an Automated External Defibrillator (AED) if nearby.',
        'Start Cardiopulmonary Resuscitation (CPR): 30 chest compressions (100-120/min) followed by 2 rescue breaths.'
      ],
      FR: [
        'Vérifiez la conscience : secouez doucement la victime et posez-lui des questions.',
        'Vérifiez la respiration : observez les mouvements de la poitrine (pendant 10 secondes maximum).',
        'Appelez immédiatement les secours et demandez un Défibrillateur Externe (DAE) si disponible.',
        'Commencez la Réanimation Cardio-Pulmonaire (RCP) : 30 compressions thoraciques (rythme 100-120/min) suivies de 2 insufflations.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT leave the victim alone.',
        'Do NOT hesitate to perform CPR; doing nothing is the worst action.'
      ],
      FR: [
        'Ne laissez jamais la victime seule.',
        'N\'hésitez pas à masser ; ne rien faire est la pire des options.'
      ]
    },
    quickAction: { EN: 'Start CPR rhythm metronome (110 BPM)', FR: 'Lancer le métronome RCP (110 BPM)' }
  },
  choking: {
    id: 'choking',
    icon: <FaTimesCircle size={24} />,
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.08)',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Choking / Suffocation', FR: 'Étouffement / Suffocation' },
    desc: { 
      EN: 'Complete airway obstruction. The victim cannot speak, cough, or breathe.', 
      FR: "Obstruction totale des voies respiratoires. La victime ne peut ni parler, ni tousser, ni respirer." 
    },
    steps: {
      EN: [
        'Give up to 5 back blows between the shoulder blades with the heel of your hand.',
        'If unsuccessful, perform up to 5 abdominal thrusts (Heimlich maneuver).',
        'Alternate 5 back blows and 5 abdominal thrusts until the object is expelled.',
        'If the victim becomes unconscious, lay them down and start CPR.'
      ],
      FR: [
        'Donnez jusqu\'à 5 claques vigoureuses dans le dos, entre les omoplates, avec le talon de la main.',
        'En cas d\'échec, effectuez jusqu\'à 5 compressions abdominales (méthode de Heimlich).',
        'Alternez 5 claques dans le dos et 5 compressions abdominales jusqu\'à l\'expulsion du corps étranger.',
        'Si la victime perd connaissance, allongez-la et commencez une réanimation cardio-pulmonaire.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT try to blindly reach down the throat; you might push the object deeper.'
      ],
      FR: [
        'N\'essayez pas de retirer l\'objet à l\'aveugle avec vos doigts, vous risqueriez de l\'enfoncer davantage.'
      ]
    }
  },
  drowning: {
    id: 'drowning',
    icon: <FaSwimmer size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Drowning', FR: 'Noyade' },
    desc: { 
      EN: 'Respiratory distress caused by immersion in liquid.', 
      FR: "Détresse respiratoire provoquée par l'immersion dans l'eau." 
    },
    steps: {
      EN: [
        'Get the victim out of the water safely without endangering yourself.',
        'Check if they are conscious and breathing.',
        'If not breathing, start CPR immediately. Give 5 initial rescue breaths before compressions.',
        'Remove wet clothing, dry them, and wrap them in a warm blanket to prevent hypothermia.'
      ],
      FR: [
        'Sortez la victime de l\'eau en toute sécurité sans vous mettre en danger.',
        'Vérifiez la conscience et la respiration.',
        'Si elle ne respire pas, commencez la RCP immédiatement. Donnez 5 insufflations initiales avant de masser.',
        'Retirez les vêtements mouillés, séchez la victime et couvrez-la pour éviter l\'hypothermie.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT try to push water out of the stomach (abdominal thrusts) as this increases vomiting risk.'
      ],
      FR: [
        'N\'essayez pas de vider l\'eau des poumons ou de l\'estomac en appuyant sur le ventre (risque de vomissements et d\'asphyxie).'
      ]
    }
  },
  burn: {
    id: 'burn',
    icon: <FaFire size={24} />,
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.08)',
    gravity: { EN: 'MODERATE', FR: 'MODÉRÉ' },
    title: { EN: 'Burns', FR: 'Brûlures' },
    desc: { 
      EN: 'Thermal, chemical, or electrical skin injury.', 
      FR: "Lésion de la peau causée par la chaleur, des produits chimiques ou de l'électricité." 
    },
    steps: {
      EN: [
        'Cool the burn immediately with cool running tap water (15°C) for at least 15 minutes.',
        'Remove any jewelry or clothing near the burn, unless it is stuck to the skin.',
        'Cover the burn loosely with a clean, non-adhesive dressing or clean plastic wrap.',
        'Seek medical attention for severe, deep, or large burns.'
      ],
      FR: [
        'Refroidissez immédiatement la brûlure sous l\'eau courante tiède/fraîche (15°C) pendant au moins 15 minutes (règle des 15).',
        'Retirez les vêtements et bijoux autour, sauf s\'ils collent à la peau.',
        'Couvrez la brûlure avec un pansement propre, non adhésif ou du film plastique stérile.',
        'Consultez un médecin pour les brûlures graves, profondes ou étendues.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT apply ice, butter, oil, or toothpaste to the burn.',
        'Do NOT pop any blisters (increases risk of severe infection).'
      ],
      FR: [
        'N\'appliquez JAMAIS de glace, de beurre, d\'huile ou de dentifrice.',
        'Ne percez pas les cloques (phlyctènes) car cela favorise l\'infection.'
      ]
    }
  },
  bleeding: {
    id: 'bleeding',
    icon: <FaTint size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Severe Bleeding', FR: 'Hémorragie / Saignement Grave' },
    desc: { 
      EN: 'Rapid and heavy blood loss from an open wound.', 
      FR: "Perte de sang abondante et rapide provenant d'une blessure ouverte." 
    },
    steps: {
      EN: [
        'Apply direct firm pressure on the wound with a clean cloth or gloved hand.',
        'Elevate the injured limb above the level of the heart if possible.',
        'If bleeding does not stop, apply a pressure bandage or a tourniquet high on the limb as a last resort.',
        'Lay the victim down flat and keep them warm to prevent shock.'
      ],
      FR: [
        'Exercez une pression directe et ferme sur la plaie avec un tissu propre ou une main gantée.',
        'Surélevez le membre blessé au-dessus du niveau du cœur si possible.',
        'Si le saignement persiste, appliquez un pansement compressif ou un garrot en haut du membre en dernier recours.',
        'Allongez la victime à plat et couvrez-la pour lutter contre l\'état de choc.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT remove the original cloth pressure if soaked; add a second layer on top.',
        'Do NOT remove embedded foreign objects from the wound.'
      ],
      FR: [
        'Ne retirez pas le premier tissu compressif s\'il est imbibé ; ajoutez un deuxième pansement par-dessus.',
        'Ne retirez pas les corps étrangers plantés dans la plaie (ils font office de bouchon).'
      ]
    }
  },
  fracture: {
    id: 'fracture',
    icon: <FaBone size={24} />,
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.08)',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Fractures & Sprains', FR: 'Fractures et Entorses' },
    desc: { 
      EN: 'Broken bones or severe joint sprains.', 
      FR: "Os brisé ou traumatisme articulaire sévère." 
    },
    steps: {
      EN: [
        'Immobilize the injured part. Do not attempt to realign the bone.',
        'For open fractures, cover the wound with a sterile dressing to prevent infection.',
        'Apply ice packs wrapped in a towel to reduce swelling and pain.',
        'Elevate the limb gently if it does not cause pain.'
      ],
      FR: [
        'Immobilisez la zone blessée. Ne tentez pas de redresser l\'os.',
        'En cas de fracture ouverte, couvrez la plaie avec un pansement stérile pour éviter l\'infection.',
        'Appliquez du froid (poche de glace enveloppée dans un tissu) pour réduire le gonflement.',
        'Surélevez délicatement le membre si cela ne provoque pas de douleur.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT force the victim to move or walk.',
        'Do NOT massage the suspected fracture site.'
      ],
      FR: [
        'Ne forcez pas la victime à bouger ou à marcher.',
        'Ne massez pas la zone suspectée de fracture.'
      ]
    }
  },
  poisoning: {
    id: 'poisoning',
    icon: <FaSkullCrossbones size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Intoxication & Poisoning', FR: 'Intoxication et Empoisonnement' },
    desc: { 
      EN: 'Ingestion, inhalation, or skin contact with a toxic substance.', 
      FR: "Ingestion, inhalation ou contact cutané avec un produit toxique." 
    },
    steps: {
      EN: [
        'Identify what was ingested/inhaled and how much.',
        'If the chemical touched skin or eyes, rinse with water for 15-20 minutes.',
        'Call the Poison Control Center or local emergency services immediately.',
        'If conscious, keep them seated and calm.'
      ],
      FR: [
        'Identifiez le produit en cause, la quantité et l\'heure d\'ingestion.',
        'En cas de contact avec la peau ou les yeux, rincez abondamment à l\'eau pendant 15-20 minutes.',
        'Appelez immédiatement le centre antipoison ou les urgences.',
        'Si la victime est consciente, gardez-la assise et rassurez-la.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT induce vomiting (unless explicitly told by doctors, as acid can burn again).',
        'Do NOT give milk, water, or anything else to drink.'
      ],
      FR: [
        'Ne faites JAMAIS vomir la victime (les acides ou solvants brûleraient l\'œsophage une seconde fois).',
        'Ne lui donnez pas de lait, d\'eau ou de charbon sans avis médical.'
      ]
    }
  },
  convulsions: {
    id: 'convulsions',
    icon: <FaHeartbeat size={24} />, // Replace later
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.08)',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Convulsions & Seizures', FR: 'Convulsions et Épilepsie' },
    desc: { 
      EN: 'Sudden, violent body shaking or loss of body control.', 
      FR: "Secousses musculaires involontaires et brutales avec perte de conscience." 
    },
    steps: {
      EN: [
        'Protect the victim from injury: clear the surrounding area of sharp objects.',
        'Place something soft (like a folded jacket) under their head.',
        'Time the seizure duration.',
        'Once the shaking stops, roll them onto their side into the Recovery Position (PLS).'
      ],
      FR: [
        'Protégez la victime contre les blessures : écartez tous les objets dangereux autour d\'elle.',
        'Placez un objet mou (ex. veste pliée) sous sa tête.',
        'Chronométrez la durée de la crise.',
        'Une fois les convulsions terminées, mettez la victime sur le côté en PLS.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT try to restrain or hold the victim down.',
        'Do NOT insert anything into the victim\'s mouth (risk of biting your fingers or choking).'
      ],
      FR: [
        'N\'essayez pas de retenir ou de bloquer les mouvements de la victime.',
        'Ne mettez RIEN dans sa bouche (risque d\'étouffement ou de morsure de vos doigts).'
      ]
    }
  },
  electrocution: {
    id: 'electrocution',
    icon: <FaBolt size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Electrocution', FR: 'Électrocution / Choc Électrique' },
    desc: { 
      EN: 'Accidental path of electric current through the body.', 
      FR: "Passage accidentel d'un courant électrique à travers le corps." 
    },
    steps: {
      EN: [
        'Do NOT touch the victim while they are still in contact with the electrical current.',
        'Turn off the main power source or breaker immediately.',
        'If power cannot be turned off, use a dry non-conducting wooden object to push the source away.',
        'Once safe, check responsiveness and breathing. Start CPR if needed.'
      ],
      FR: [
        'Ne touchez JAMAIS la victime si elle est toujours en contact avec la source d\'électricité.',
        'Coupez immédiatement le disjoncteur général.',
        'Si c\'est impossible, écartez la victime ou le câble à l\'aide d\'un objet sec et non conducteur (bois, plastique).',
        'Une fois la sécurité assurée, vérifiez la respiration et commencez la RCP si nécessaire.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT get close to high-voltage wires; call specialized emergency services.'
      ],
      FR: [
        'N\'approchez pas des câbles haute tension, appelez directement les pompiers.'
      ]
    }
  },
  accident: {
    id: 'accident',
    icon: <FaCar size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Traffic Accident', FR: 'Accident de la Route' },
    desc: { 
      EN: 'Securing the scene and assessing road traffic casualties.', 
      FR: "Sécurisation des lieux et prise en charge des victimes d'accident." 
    },
    steps: {
      EN: [
        'Protect: Secure the accident scene (hazard lights, warning triangles, high-vis vest).',
        'Alert: Call emergency services (112 or local rescue numbers).',
        'Assess: Check the condition of all victims without moving them.',
        'First Aid: Stop severe bleeding, keep victims warm, and talk to them.'
      ],
      FR: [
        'Protéger : Sécurisez la zone (feux de détresse, triangle, gilets) pour éviter un sur-accident.',
        'Alerter : Appelez les secours en indiquant le lieu précis et le nombre de blessés.',
        'Secourir : Ne déplacez pas les blessés sauf en cas de danger immédiat (incendie, noyade).',
        'Parlez aux victimes conscientes pour les rassurer et couvrez-les.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT move a victim unless there is an immediate threat of fire or explosion.',
        'Do NOT remove a motorcyclist\'s helmet.'
      ],
      FR: [
        'Ne déplacez pas une victime sauf danger de mort imminent (incendie, explosion).',
        'Ne retirez jamais le casque d\'un motard blessé (risque de paralysie).'
      ]
    }
  },
  snakebite: {
    id: 'snakebite',
    icon: <FaSkullCrossbones size={24} />, // Replace later
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.08)',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Snake Bites', FR: 'Morsure de Serpent' },
    desc: { 
      EN: 'Venomous snake attack or bite.', 
      FR: "Morsure d'un serpent potentiellement venimeux." 
    },
    steps: {
      EN: [
        'Keep the victim perfectly still and calm (anxiety spreads venom faster).',
        'Immobilize the bitten limb at or below heart level.',
        'Remove rings, watches, or tight clothing as swelling will occur.',
        'Clean the bite wound with soap and water. Seek immediate medical assistance.'
      ],
      FR: [
        'Gardez la victime immobile et calme (le stress accélère la diffusion du venin).',
        'Immobilisez le membre mordu à un niveau inférieur ou égal à celui du cœur.',
        'Retirez les bagues, bracelets ou vêtements serrés avant le gonflement.',
        'Nettoyez la plaie à l\'eau et au savon. Transportez la victime d\'urgence à l\'hôpital.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT cut the wound or try to suck out the venom.',
        'Do NOT use ice, tourniquets, or electric shocks.'
      ],
      FR: [
        'N\'incisez pas la plaie et n\'aspirez jamais le venin avec la bouche.',
        'N\'utilisez pas de garrot, de glace ou d\'appareil d\'aspiration électrique.'
      ]
    }
  },
  pediatric: {
    id: 'pediatric',
    icon: <FaBaby size={24} />,
    color: '#ea580c',
    bg: 'rgba(234, 88, 12, 0.08)',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Pediatric Emergencies', FR: 'Urgences Pédiatriques' },
    desc: { 
      EN: 'High fever, choking, or dehydration in babies and toddlers.', 
      FR: "Fièvre élevée, étouffement ou déshydratation chez les bébés et jeunes enfants." 
    },
    steps: {
      EN: [
        'For high fever: Undress the child partially, keep the room cool (19-20°C), and give water.',
        'For pediatric CPR (under 1 year): Give 5 initial rescue breaths covering nose & mouth, then do chest compressions with 2 fingers.',
        'For choking in infants: Rest the baby face down on your forearm, support the head, and give 5 gentle back slaps.',
        'Monitor hydration closely: look for dry eyes or lethargy.'
      ],
      FR: [
        'Fièvre élevée : Déshabillez partiellement l\'enfant, gardez la pièce fraîche (19-20°C) et donnez-lui à boire.',
        'RCP Nourrisson (moins de 1 an) : Donnez 5 insufflations initiales en englobant bouche et nez, puis alternez 30 compressions avec 2 doigts et 2 insufflations.',
        'Étouffement bébé : Placez le bébé face vers le bas sur votre avant-bras, et donnez 5 claques mesurées dans le dos.',
        'Surveillez les signes de déshydratation (absence de larmes, léthargie).'
      ]
    },
    avoid: {
      EN: [
        'Do NOT give cold baths for fever (causes shivering and spikes internal temperature).',
        'Do NOT use adult CPR force on infants.'
      ],
      FR: [
        'Ne donnez pas de bain glacé en cas de fièvre (risque de choc thermique et convulsions).',
        'N\'utilisez pas la force de réanimation d\'un adulte sur un nourrisson.'
      ]
    }
  },
  maternal: {
    id: 'maternal',
    icon: <FaFemale size={24} />,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.08)',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Maternal Emergencies', FR: 'Urgences Maternelles' },
    desc: { 
      EN: 'Severe abdominal pain, heavy bleeding during pregnancy, or imminent labor.', 
      FR: "Douleurs abdominales intenses, saignements pendant la grossesse ou accouchement imminent." 
    },
    steps: {
      EN: [
        'Lay the pregnant woman on her left side (relieves pressure on major blood vessels).',
        'Keep her warm, calm, and monitor her breathing.',
        'If imminent delivery: wash hands, lay clean sheets, and guide her breathing.',
        'Call for a midwife, ambulance, or prepare immediate transport.'
      ],
      FR: [
        'Allongez la femme enceinte sur son côté gauche (pour libérer la veine cave inférieure).',
        'Gardez-la au chaud, calme et observez sa respiration.',
        'Si accouchement imminent : lavez-vous les mains, disposez des draps propres, accompagnez sa respiration.',
        'Appelez immédiatement une ambulance ou une sage-femme.'
      ]
    },
    avoid: {
      EN: [
        'Do NOT let her stand up or walk if she is bleeding or having severe pain.',
        'Do NOT attempt to pull the baby during birth.'
      ],
      FR: [
        'Ne la laissez pas marcher ou rester debout en cas de saignements.',
        'Ne tirez jamais sur le bébé lors de l\'expulsion.'
      ]
    }
  }
};

const FirstAidModule = ({ lang, initialEmergency, clearInitialEmergency }) => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Listen to shortcuts from SOS panel
  useEffect(() => {
    if (initialEmergency && EMERGENCY_DATA[initialEmergency]) {
      setSelected(EMERGENCY_DATA[initialEmergency]);
      clearInitialEmergency();
    }
  }, [initialEmergency, clearInitialEmergency]);

  // Handle timer ticks
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filtered = Object.values(EMERGENCY_DATA).filter(item => {
    const query = search.toLowerCase();
    return (
      item.title[lang].toLowerCase().includes(query) ||
      item.desc[lang].toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {!selected ? (
          // Grid view
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {/* Search */}
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
              <MdSearch size={22} color="#94a3b8" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'EN' ? 'Search first aid guides...' : 'Rechercher un guide de premiers secours...'}
                style={{
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  fontSize: '0.95rem',
                  fontFamily: "'Inter', sans-serif",
                  color: '#1e293b'
                }}
              />
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filtered.map(item => (
                <motion.div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  whileHover={{ y: -4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'border 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div>
                    {/* Gravity tag */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: item.color === '#ef4444' ? '#fef2f2' : '#fff7ed',
                      border: `1.5px solid ${item.color}50`,
                      color: item.color,
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '20px'
                    }}>
                      {item.gravity[lang]}
                    </div>

                    {/* Icon circle */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: item.bg,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}>
                      {item.icon}
                    </div>

                    <h3 style={{ margin: '0 0 6px', color: '#1e293b', fontWeight: 800, fontSize: '1.05rem' }}>
                      {item.title[lang]}
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {item.desc[lang]}
                    </p>
                  </div>

                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: item.color
                  }}>
                    {lang === 'EN' ? 'View Steps →' : 'Voir les gestes →'}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // Detail view
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
            {/* Back button and title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={() => {
                  setSelected(null);
                  setTimerActive(false);
                  setTimer(0);
                }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569'
                }}
              >
                <FaChevronLeft size={16} />
              </button>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: selected.color }}>{selected.icon}</span>
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 900, fontSize: '1.4rem' }}>
                    {selected.title[lang]}
                  </h2>
                </div>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                  {selected.desc[lang]}
                </p>
              </div>
            </div>

            {/* Quick action helper / Timer */}
            {selected.quickAction && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justify: 'center', flexShrink: 0 }}>
                    <FaClock size={14} style={{ margin: 'auto' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{selected.quickAction[lang]}</span>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{lang === 'EN' ? 'Track time for doctors' : 'Aide à communiquer la durée exacte aux médecins'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>{formatTimer(timer)}</span>
                  <button
                    onClick={() => setTimerActive(!timerActive)}
                    style={{
                      padding: '6px 14px',
                      background: timerActive ? '#ef4444' : '#4f46e5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {timerActive ? (lang === 'EN' ? 'Stop' : 'Arrêter') : (lang === 'EN' ? 'Start' : 'Démarrer')}
                  </button>
                </div>
              </div>
            )}

            {/* Danger call banner */}
            <div style={{
              background: '#fef2f2',
              border: `1.5px solid ${selected.color}40`,
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MdInfo size={22} color={selected.color} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#991b1b' }}>
                  {lang === 'EN' 
                    ? `This is a ${selected.gravity[lang]} emergency. Call assistance immediately.` 
                    : `C'est une urgence de niveau ${selected.gravity[lang]}. Appelez les secours.`
                  }
                </span>
              </div>
              <a
                href="tel:112"
                style={{
                  padding: '8px 16px',
                  background: selected.color,
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(239,68,68,0.2)'
                }}
              >
                <FaPhoneAlt size={11} />
                {lang === 'EN' ? 'Call 112' : 'Appeler le 112'}
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              {/* Steps To Follow */}
              <div>
                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '1.05rem', fontWeight: 800 }}>
                  ✅ {lang === 'EN' ? 'Steps to Follow' : 'Étapes à suivre'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selected.steps[lang].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#4f46e5',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {idx + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mistakes to Avoid */}
              <div style={{ background: '#fffafb', border: '1px solid #ffe4e6', borderRadius: '20px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', color: '#be123c', fontSize: '1.05rem', fontWeight: 800 }}>
                  ❌ {lang === 'EN' ? 'Mistakes to Avoid' : 'Erreurs à éviter'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selected.avoid[lang].map((avoidItem, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#be123c', fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                      <p style={{ margin: 0, fontSize: '0.83rem', color: '#4c0519', lineHeight: 1.6, fontWeight: 500 }}>
                        {avoidItem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FirstAidModule;
