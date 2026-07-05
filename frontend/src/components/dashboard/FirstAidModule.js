/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBrain, FaHeartbeat, FaTimesCircle, FaSwimmer,
  FaFire, FaTint, FaBone, FaSkullCrossbones,
  FaBolt, FaCar, FaChevronLeft, FaPhoneAlt,
  FaClock, FaBaby, FaFemale, FaThermometerHalf
} from 'react-icons/fa';
import { MdSearch, MdInfo, MdWarning } from 'react-icons/md';

const EMERGENCY_DATA = {
  stroke: {
    id: 'stroke', icon: <FaBrain size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Stroke (AVC)', FR: 'AVC (Accident Vasculaire Cérébral)' },
    desc: { EN: 'Sudden disruption of blood flow to the brain.', FR: 'Interruption soudaine de la circulation sanguine dans le cerveau.' },
    steps: {
      EN: ['Apply FAST: Face drooping, Arm weakness, Speech slurred, Time — call immediately.', 'Note the exact time symptoms started.', 'Keep victim lying down. Use Recovery Position if unconscious but breathing.', 'Never leave them alone. Reassure constantly until help arrives.'],
      FR: ['Appliquez FAST : Visage affaissé, Bras faible, Parole difficile, Temps — appelez immédiatement.', 'Notez l\'heure exacte de début des symptômes.', 'Allongez la victime. Mettez en PLS si inconsciente mais respire.', 'Ne la laissez jamais seule. Rassurez-la jusqu\'à l\'arrivée des secours.']
    },
    avoid: {
      EN: ['Do NOT give food or drink — risk of choking.', 'Do NOT give Aspirin — can worsen bleeding strokes.'],
      FR: ['Ne donnez NI à boire NI à manger — risque de fausse route.', 'Ne donnez pas d\'aspirine — peut aggraver un AVC hémorragique.']
    },
    quickAction: { EN: 'Start stroke onset timer', FR: 'Lancer le chronomètre de début' }
  },
  heart: {
    id: 'heart', icon: <FaHeartbeat size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Cardiac Arrest', FR: 'Arrêt Cardiaque' },
    desc: { EN: 'Chest pain or sudden loss of consciousness.', FR: 'Douleur thoracique ou perte de conscience soudaine.' },
    steps: {
      EN: ['Check responsiveness: shake gently and call out.', 'Check breathing: look, listen and feel for 10 seconds maximum.', 'Call emergency services immediately. Request an AED if available.', 'Start CPR: 30 chest compressions (100-120/min) then 2 rescue breaths. Repeat.'],
      FR: ['Vérifiez la conscience : secouez doucement et interpellez.', 'Vérifiez la respiration pendant 10 secondes maximum.', 'Appelez les secours immédiatement. Demandez un DAE.', 'Commencez la RCP : 30 compressions (100-120/min) puis 2 insufflations. Répétez.']
    },
    avoid: {
      EN: ['Do NOT leave the victim alone.', 'Do NOT hesitate to perform CPR — doing nothing is the worst option.'],
      FR: ['Ne laissez jamais la victime seule.', 'N\'hésitez pas à masser — ne rien faire est la pire option.']
    },
    quickAction: { EN: 'Start CPR metronome (110 BPM)', FR: 'Lancer le métronome RCP (110 BPM)' }
  },
  choking: {
    id: 'choking', icon: <FaTimesCircle size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Choking / Suffocation', FR: 'Étouffement / Suffocation' },
    desc: { EN: 'Complete airway obstruction — cannot speak, cough or breathe.', FR: 'Obstruction totale — ne peut ni parler, ni tousser, ni respirer.' },
    steps: {
      EN: ['Give 5 firm back blows between shoulder blades with heel of hand.', 'If unsuccessful, give 5 abdominal thrusts (Heimlich maneuver).', 'Alternate 5 back blows and 5 abdominal thrusts until object is expelled.', 'If victim loses consciousness, lay them down and start CPR.'],
      FR: ['Donnez 5 claques vigoureuses dans le dos avec le talon de la main.', 'En cas d\'échec, effectuez 5 compressions abdominales (Heimlich).', 'Alternez 5 claques et 5 compressions jusqu\'à expulsion du corps étranger.', 'Si la victime perd connaissance, allongez-la et commencez la RCP.']
    },
    avoid: {
      EN: ['Do NOT blindly reach into the throat — you may push the object deeper.'],
      FR: ['Ne cherchez pas à retirer l\'objet à l\'aveugle — vous risquez de l\'enfoncer.']
    }
  },
  drowning: {
    id: 'drowning', icon: <FaSwimmer size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Drowning', FR: 'Noyade' },
    desc: { EN: 'Respiratory distress caused by immersion in water.', FR: 'Détresse respiratoire provoquée par l\'immersion dans l\'eau.' },
    steps: {
      EN: ['Get the victim out of water safely without endangering yourself.', 'Check consciousness and breathing immediately.', 'If not breathing: give 5 initial rescue breaths, then start CPR.', 'Remove wet clothing, dry and wrap in warm blanket to prevent hypothermia.'],
      FR: ['Sortez la victime de l\'eau sans vous mettre en danger.', 'Vérifiez immédiatement la conscience et la respiration.', 'Si elle ne respire pas : donnez 5 insufflations initiales, puis commencez la RCP.', 'Retirez les vêtements mouillés et couvrez pour éviter l\'hypothermie.']
    },
    avoid: {
      EN: ['Do NOT press on the abdomen to remove water — increases vomiting and asphyxia risk.'],
      FR: ['Ne cherchez pas à vider l\'eau en appuyant sur le ventre — risque de vomissements et d\'asphyxie.']
    }
  },
  burn: {
    id: 'burn', icon: <FaFire size={22} />, color: '#eab308', bg: '#fefce8',
    gravity: { EN: 'MODERATE', FR: 'MODÉRÉ' },
    title: { EN: 'Burns', FR: 'Brûlures' },
    desc: { EN: 'Thermal, chemical or electrical skin injury.', FR: 'Lésion cutanée par la chaleur, un produit chimique ou l\'électricité.' },
    steps: {
      EN: ['Cool the burn with running cool water (15°C) for at least 15 minutes.', 'Remove jewelry and clothing near the burn unless stuck to skin.', 'Cover loosely with clean non-adhesive dressing or clean plastic wrap.', 'Seek medical help for deep, large or chemical burns.'],
      FR: ['Refroidissez sous eau courante fraîche (15°C) pendant au moins 15 minutes.', 'Retirez bijoux et vêtements près de la brûlure sauf s\'ils collent.', 'Couvrez avec un pansement propre non adhésif ou film plastique stérile.', 'Consultez pour les brûlures profondes, étendues ou chimiques.']
    },
    avoid: {
      EN: ['Do NOT apply ice, butter, oil or toothpaste — worsens damage.', 'Do NOT pop blisters — increases infection risk.'],
      FR: ['N\'appliquez JAMAIS glace, beurre, huile ou dentifrice.', 'Ne percez pas les cloques — risque d\'infection grave.']
    }
  },
  bleeding: {
    id: 'bleeding', icon: <FaTint size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Severe Bleeding', FR: 'Hémorragie Grave' },
    desc: { EN: 'Rapid heavy blood loss from an open wound.', FR: 'Perte de sang abondante et rapide d\'une blessure ouverte.' },
    steps: {
      EN: ['Apply firm direct pressure on the wound with clean cloth.', 'Elevate the injured limb above the heart level if possible.', 'If bleeding continues, add a second layer — do not remove the first.', 'Lay victim flat and keep warm to prevent shock.'],
      FR: ['Exercez une pression directe et ferme sur la plaie avec un tissu propre.', 'Surélevez le membre blessé au-dessus du niveau du cœur si possible.', 'Si le saignement persiste, ajoutez une couche — ne retirez pas la première.', 'Allongez la victime à plat et couvrez pour prévenir l\'état de choc.']
    },
    avoid: {
      EN: ['Do NOT remove the first cloth if soaked — add on top.', 'Do NOT remove embedded objects from the wound — they act as plugs.'],
      FR: ['Ne retirez pas le premier tissu s\'il est imbibé — ajoutez par-dessus.', 'Ne retirez pas les objets plantés dans la plaie — ils font office de bouchon.']
    }
  },
  fracture: {
    id: 'fracture', icon: <FaBone size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Fractures & Sprains', FR: 'Fractures et Entorses' },
    desc: { EN: 'Broken bones or severe joint injuries.', FR: 'Os brisé ou traumatisme articulaire grave.' },
    steps: {
      EN: ['Immobilize the injured area. Do NOT attempt to realign the bone.', 'For open fractures, cover the wound with sterile dressing.', 'Apply ice wrapped in a towel to reduce swelling and pain.', 'Elevate the limb gently if it does not cause additional pain.'],
      FR: ['Immobilisez la zone blessée. Ne tentez PAS de redresser l\'os.', 'En cas de fracture ouverte, couvrez la plaie avec un pansement stérile.', 'Appliquez du froid enveloppé dans un tissu pour réduire le gonflement.', 'Surélevez délicatement le membre si cela ne provoque pas de douleur.']
    },
    avoid: {
      EN: ['Do NOT force the victim to move or walk.', 'Do NOT massage the fracture site.'],
      FR: ['Ne forcez pas la victime à bouger ou marcher.', 'Ne massez pas la zone de la fracture.']
    }
  },
  poisoning: {
    id: 'poisoning', icon: <FaSkullCrossbones size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Poisoning & Intoxication', FR: 'Intoxication et Empoisonnement' },
    desc: { EN: 'Ingestion, inhalation or skin contact with toxic substance.', FR: 'Ingestion, inhalation ou contact cutané avec un produit toxique.' },
    steps: {
      EN: ['Identify what was ingested, how much and when.', 'If chemical contacted skin or eyes: rinse with water for 15-20 minutes.', 'Call Poison Control Center or emergency services immediately.', 'Keep victim seated and calm if conscious.'],
      FR: ['Identifiez le produit, la quantité et l\'heure d\'ingestion.', 'Si contact cutané ou oculaire : rincez abondamment à l\'eau 15-20 minutes.', 'Appelez immédiatement le centre antipoison ou les urgences.', 'Si consciente, gardez la victime assise et rassurez-la.']
    },
    avoid: {
      EN: ['Do NOT induce vomiting — acid burns the esophagus a second time.', 'Do NOT give milk, water or charcoal without medical advice.'],
      FR: ['Ne faites JAMAIS vomir — les acides brûleraient l\'œsophage une seconde fois.', 'Ne donnez pas de lait, eau ou charbon sans avis médical.']
    }
  },
  convulsions: {
    id: 'convulsions', icon: <FaBrain size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Seizures & Convulsions', FR: 'Convulsions et Épilepsie' },
    desc: { EN: 'Sudden violent body shaking or loss of body control.', FR: 'Secousses musculaires involontaires et perte de conscience.' },
    steps: {
      EN: ['Clear the area of sharp or hard objects immediately.', 'Place something soft (folded jacket) under the victim\'s head.', 'Time the seizure duration — important information for doctors.', 'Once shaking stops, roll them into Recovery Position (PLS).'],
      FR: ['Écartez immédiatement tous les objets dangereux autour de la victime.', 'Placez un objet mou sous la tête (veste pliée).', 'Chronométrez la durée de la crise — information essentielle pour les médecins.', 'Une fois les convulsions terminées, mettez en PLS.']
    },
    avoid: {
      EN: ['Do NOT restrain or hold the victim down during convulsions.', 'Do NOT put anything in their mouth — risk of choking or biting.'],
      FR: ['Ne retenez PAS les mouvements de la victime.', 'Ne mettez RIEN dans sa bouche — risque d\'étouffement ou de morsure.']
    }
  },
  electrocution: {
    id: 'electrocution', icon: <FaBolt size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Electrocution', FR: 'Électrocution / Choc Électrique' },
    desc: { EN: 'Accidental electric current passing through the body.', FR: 'Passage accidentel d\'un courant électrique à travers le corps.' },
    steps: {
      EN: ['Do NOT touch the victim while still in contact with the current.', 'Turn off the main power source or breaker immediately.', 'If power cannot be cut: use dry non-conducting wood/plastic to push source away.', 'Once safe: check breathing and start CPR if needed.'],
      FR: ['Ne touchez JAMAIS la victime si elle est encore en contact avec le courant.', 'Coupez immédiatement le disjoncteur général.', 'Si impossible : écartez le câble avec un objet sec non conducteur (bois, plastique).', 'Une fois en sécurité : vérifiez la respiration et commencez la RCP si nécessaire.']
    },
    avoid: {
      EN: ['Do NOT approach high-voltage wires — call specialized services only.'],
      FR: ['N\'approchez pas des câbles haute tension — appelez uniquement les pompiers.']
    }
  },
  accident: {
    id: 'accident', icon: <FaCar size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Traffic Accident', FR: 'Accident de la Route' },
    desc: { EN: 'Securing the scene and assessing casualties.', FR: 'Sécurisation des lieux et prise en charge des victimes.' },
    steps: {
      EN: ['PROTECT: Turn on hazard lights, place warning triangles, wear high-vis vest.', 'ALERT: Call emergency services — give exact location and number of casualties.', 'ASSESS: Check all victims without moving them.', 'FIRST AID: Stop severe bleeding, keep victims warm, talk to conscious victims.'],
      FR: ['PROTÉGER : Feux de détresse, triangle, gilets pour éviter un sur-accident.', 'ALERTER : Appelez les secours — donnez le lieu précis et le nombre de blessés.', 'SECOURIR : Vérifiez tous les blessés sans les déplacer.', 'PREMIERS SECOURS : Arrêtez les saignements, couvrez les victimes, parlez aux conscients.']
    },
    avoid: {
      EN: ['Do NOT move a victim unless there is immediate fire or explosion risk.', 'Do NOT remove a motorcyclist\'s helmet.'],
      FR: ['Ne déplacez pas une victime sauf danger de mort imminent (incendie).', 'Ne retirez jamais le casque d\'un motard blessé — risque de paralysie.']
    }
  },
  snakebite: {
    id: 'snakebite', icon: <FaSkullCrossbones size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Snake Bite', FR: 'Morsure de Serpent' },
    desc: { EN: 'Venomous snake attack or bite.', FR: 'Morsure d\'un serpent potentiellement venimeux.' },
    steps: {
      EN: ['Keep victim completely still and calm — anxiety spreads venom faster.', 'Immobilize the bitten limb at or below heart level.', 'Remove rings, watches and tight clothing before swelling occurs.', 'Clean wound with soap and water. Transport urgently to hospital.'],
      FR: ['Gardez la victime immobile et calme — le stress accélère la diffusion du venin.', 'Immobilisez le membre mordu à hauteur du cœur ou en dessous.', 'Retirez bagues, montres et vêtements serrés avant le gonflement.', 'Nettoyez la plaie à l\'eau et au savon. Transportez d\'urgence à l\'hôpital.']
    },
    avoid: {
      EN: ['Do NOT cut the wound or suck out the venom.', 'Do NOT apply ice, tourniquet or electric shock.'],
      FR: ['N\'incisez pas la plaie et n\'aspirez jamais le venin avec la bouche.', 'N\'utilisez pas de garrot, glace ou appareil d\'aspiration.']
    }
  },
  pediatric: {
    id: 'pediatric', icon: <FaBaby size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Pediatric Emergencies', FR: 'Urgences Pédiatriques' },
    desc: { EN: 'High fever, choking or dehydration in babies and children.', FR: 'Fièvre élevée, étouffement ou déshydratation chez les bébés.' },
    steps: {
      EN: ['High fever: Partially undress the child, cool the room (19-20°C), give water to drink.', 'CPR infant (under 1 year): Give 5 rescue breaths covering nose and mouth, then 30 compressions with 2 fingers.', 'Choking infant: Lay face down on your forearm, support head, give 5 gentle back slaps.', 'Watch for dehydration signs: no tears, dry mouth, lethargy.'],
      FR: ['Fièvre : Déshabillez partiellement, gardez la pièce fraîche (19-20°C), donnez à boire.', 'RCP nourrisson (moins de 1 an) : 5 insufflations bouche+nez, puis 30 compressions avec 2 doigts.', 'Étouffement bébé : Placez face vers le bas sur l\'avant-bras, donnez 5 claques mesurées dans le dos.', 'Surveillez : absence de larmes, bouche sèche, léthargie.']
    },
    avoid: {
      EN: ['Do NOT give cold baths for fever — causes shivering and spikes internal temperature.', 'Do NOT apply adult CPR force on infants.'],
      FR: ['Ne donnez pas de bain glacé — risque de choc thermique et convulsions.', 'N\'utilisez pas la force adulte sur un nourrisson.']
    }
  },
  maternal: {
    id: 'maternal', icon: <FaFemale size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Maternal Emergencies', FR: 'Urgences Maternelles' },
    desc: { EN: 'Severe bleeding, pain during pregnancy or imminent labor.', FR: 'Saignements, douleurs en grossesse ou accouchement imminent.' },
    steps: {
      EN: ['Lay the pregnant woman on her LEFT side — relieves pressure on major blood vessels.', 'Keep her warm, calm and monitor her breathing regularly.', 'If imminent delivery: wash hands, lay clean sheets, guide her breathing calmly.', 'Call a midwife, ambulance or prepare immediate transport to hospital.'],
      FR: ['Allongez la femme enceinte sur le CÔTÉ GAUCHE — libère la veine cave inférieure.', 'Gardez-la au chaud, calme et surveillez sa respiration régulièrement.', 'Si accouchement imminent : lavez-vous les mains, disposez des draps propres, guidez sa respiration.', 'Appelez immédiatement une ambulance ou une sage-femme.']
    },
    avoid: {
      EN: ['Do NOT let her stand or walk if bleeding or in severe pain.', 'Do NOT pull the baby during delivery.'],
      FR: ['Ne la laissez pas debout ou marcher si elle saigne ou souffre.', 'Ne tirez jamais sur le bébé lors de l\'expulsion.']
    }
  },
  heatstroke: {
    id: 'heatstroke', icon: <FaThermometerHalf size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Heatstroke & Dehydration', FR: 'Coup de Chaleur et Déshydratation' },
    desc: { EN: 'Dangerously high body temperature from heat exposure.', FR: 'Température corporelle dangereusement élevée due à la chaleur.' },
    steps: {
      EN: ['Move the victim immediately to a cool, shaded area.', 'Remove excess clothing and apply cool damp cloths to neck, armpits and groin.', 'Fan the victim continuously while applying cold compresses.', 'If conscious and not vomiting, give small sips of cool water every few minutes.'],
      FR: ['Transportez immédiatement la victime dans un endroit frais et ombragé.', 'Retirez les vêtements en excès et appliquez des compresses fraîches sur le cou, aisselles et aine.', 'Ventilez continuellement tout en appliquant du froid.', 'Si consciente et sans vomissements, donnez de petites gorgées d\'eau fraîche.']
    },
    avoid: {
      EN: ['Do NOT give alcohol or caffeinated drinks.', 'Do NOT leave the victim alone — heatstroke can rapidly cause unconsciousness.'],
      FR: ['Ne donnez pas d\'alcool ni de boissons caféinées.', 'Ne laissez pas la victime seule — le coup de chaleur peut rapidement causer une perte de conscience.']
    },
    quickAction: { EN: 'Start cooling timer', FR: 'Lancer le minuteur de refroidissement' }
  }
};

const GRAVITY_CONFIG = {
  CRITICAL: { color: '#ef4444', bg: '#fef2f2', label: { EN: 'CRITICAL', FR: 'CRITIQUE' } },
  HIGH: { color: '#ea580c', bg: '#fff7ed', label: { EN: 'HIGH', FR: 'ÉLEVÉ' } },
  MODERATE: { color: '#eab308', bg: '#fefce8', label: { EN: 'MODERATE', FR: 'MODÉRÉ' } }
};

const FirstAidModule = ({ lang, initialEmergency, clearInitialEmergency }) => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (initialEmergency && EMERGENCY_DATA[initialEmergency]) {
      setSelected(EMERGENCY_DATA[initialEmergency]);
      clearInitialEmergency();
    }
  }, [initialEmergency, clearInitialEmergency]);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return m + ':' + s;
  };

  const filtered = Object.values(EMERGENCY_DATA).filter(item => {
    const q = search.toLowerCase();
    return item.title[lang].toLowerCase().includes(q) || item.desc[lang].toLowerCase().includes(q);
  });

  const gravityOrder = { CRITICAL: 0, HIGH: 1, MODERATE: 2 };
  const sorted = [...filtered].sort((a, b) => gravityOrder[a.gravity.EN] - gravityOrder[b.gravity.EN]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #ef4444)', borderRadius: '16px', padding: '22px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>
                  {lang === 'EN' ? 'Emergency First Aid Guide' : 'Guide de Premiers Secours'}
                </h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                  {lang === 'EN' ? '15 emergency protocols — available offline' : '15 protocoles d\'urgence — disponibles hors ligne'}
                </p>
              </div>
              <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'white', color: '#ef4444', padding: '10px 18px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.86rem', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <FaPhoneAlt size={13} />
                {lang === 'EN' ? 'Call 112' : 'Appeler 112'}
              </a>
            </div>

            {/* Search */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '12px 16px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <MdSearch size={20} color="#94a3b8" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'EN' ? 'Search emergency type...' : 'Rechercher un type d\'urgence...'}
                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.88rem', fontFamily: 'Inter, sans-serif', color: '#1e293b', background: 'transparent' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1rem' }}>×</button>}
            </div>

            {/* Gravity legend */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {Object.entries(GRAVITY_CONFIG).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: val.bg, border: '1px solid ' + val.color + '40', borderRadius: '20px', padding: '4px 12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: val.color }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: val.color }}>{val.label[lang]}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {sorted.map(item => {
                const gConfig = GRAVITY_CONFIG[item.gravity.EN];
                return (
                  <motion.div key={item.id} onClick={() => setSelected(item)}
                    whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                    style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}>
                    {/* Left accent */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.color, borderRadius: '14px 0 0 14px' }} />
                    <div style={{ paddingLeft: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                          {item.icon}
                        </div>
                        <span style={{ background: gConfig.bg, color: gConfig.color, fontSize: '0.6rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', border: '1px solid ' + gConfig.color + '30' }}>
                          {gConfig.label[lang]}
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 5px', color: '#1e293b', fontWeight: 800, fontSize: '0.92rem' }}>{item.title[lang]}</h3>
                      <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: '0.76rem', lineHeight: 1.5 }}>{item.desc[lang]}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: item.color }}>
                        {lang === 'EN' ? 'View Protocol' : 'Voir Protocole'}
                        <span>→</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        ) : (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

            {/* Back + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => { setSelected(null); setTimerActive(false); setTimer(0); }}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', border: '1.5px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flexShrink: 0 }}>
                <FaChevronLeft size={14} />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: selected.color }}>{selected.icon}</span>
                  <h2 style={{ margin: 0, color: '#1e293b', fontWeight: 900, fontSize: '1.2rem' }}>{selected.title[lang]}</h2>
                  <span style={{ background: GRAVITY_CONFIG[selected.gravity.EN].bg, color: selected.color, fontSize: '0.62rem', fontWeight: 800, padding: '3px 9px', borderRadius: '20px', border: '1px solid ' + selected.color + '30' }}>
                    {GRAVITY_CONFIG[selected.gravity.EN].label[lang]}
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', color: '#64748b', fontSize: '0.82rem' }}>{selected.desc[lang]}</p>
              </div>
              <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', padding: '9px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                <FaPhoneAlt size={12} />
                112
              </a>
            </div>

            {/* Timer (if quickAction) */}
            {selected.quickAction && (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaClock color="#3b82f6" size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{selected.quickAction[lang]}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{lang === 'EN' ? 'Share elapsed time with doctors' : 'Communiquez la durée aux médecins'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.3rem', fontWeight: 900, color: timerActive ? '#ef4444' : '#1e293b' }}>{formatTimer(timer)}</span>
                  <button onClick={() => setTimerActive(!timerActive)} style={{ padding: '7px 16px', background: timerActive ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    {timerActive ? (lang === 'EN' ? 'Stop' : 'Arrêter') : (lang === 'EN' ? 'Start' : 'Démarrer')}
                  </button>
                  {timer > 0 && <button onClick={() => { setTimer(0); setTimerActive(false); }} style={{ padding: '7px 12px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    {lang === 'EN' ? 'Reset' : 'Réinit.'}
                  </button>}
                </div>
              </div>
            )}

            {/* Alert banner */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MdWarning color="#ef4444" size={20} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#991b1b', flex: 1 }}>
                {lang === 'EN'
                  ? 'This is a ' + selected.gravity.EN + ' emergency. Call 112 immediately while performing first aid.'
                  : 'Urgence niveau ' + selected.gravity.FR + '. Appelez le 112 immédiatement tout en prodiguant les premiers secours.'}
              </span>
            </div>

            {/* Steps + Avoid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }}>

              {/* Steps */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
                <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#16a34a', fontSize: '0.8rem' }}>✓</span>
                  </div>
                  {lang === 'EN' ? 'Steps to Follow' : 'Étapes à Suivre'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selected.steps[lang].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.83rem', color: '#334155', lineHeight: 1.65 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid */}
              <div style={{ background: '#fffafb', border: '1.5px solid #fecdd3', borderRadius: '16px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 16px', color: '#be123c', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>✗</span>
                  </div>
                  {lang === 'EN' ? 'Mistakes to Avoid' : 'Erreurs à Éviter'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selected.avoid[lang].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#fff5f5', padding: '10px 12px', borderRadius: '10px', border: '1px solid #fecdd3' }}>
                      <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '1rem', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>×</span>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#4c0519', lineHeight: 1.6, fontWeight: 500 }}>{item}</p>
                    </div>
                  ))}
                </div>

                {/* Emergency numbers */}
                <div style={{ marginTop: '20px', background: 'white', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                    {lang === 'EN' ? 'Emergency Numbers — Cameroon' : 'Numéros d\'Urgence — Cameroun'}
                  </div>
                  {[
                    { label: lang === 'EN' ? 'General Emergency' : 'Urgences Générales', number: '112' },
                    { label: lang === 'EN' ? 'Fire Brigade' : 'Pompiers', number: '18' },
                    { label: lang === 'EN' ? 'Police' : 'Police', number: '17' },
                  ].map((contact, i) => (
                    <a key={i} href={'tel:' + contact.number} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none', textDecoration: 'none' }}>
                      <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>{contact.label}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ef4444' }}>{contact.number}</span>
                    </a>
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