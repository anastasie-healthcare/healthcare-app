/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBrain, FaHeartbeat, FaFire, FaTint, FaBone,
  FaSkullCrossbones, FaBolt, FaCar, FaChevronLeft,
  FaPhoneAlt, FaClock, FaBaby, FaFemale,
  FaThermometerHalf, FaWater, FaBug, FaVirus,
  FaRunning, FaExclamationTriangle, FaShieldAlt
} from 'react-icons/fa';
import { MdSearch, MdWarning, MdLocalHospital } from 'react-icons/md';
import { GiSnake, GiSpiderWeb, GiScorpion } from 'react-icons/gi';

const EMERGENCY_DATA = {
  stroke: {
    id: 'stroke', icon: <FaBrain size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Stroke (AVC)', FR: 'AVC (Accident Vasculaire Cérébral)' },
    desc: { EN: 'Sudden disruption of blood flow to the brain.', FR: 'Interruption soudaine de la circulation sanguine dans le cerveau.' },
    steps: {
      EN: [
        'Apply FAST test: Face drooping, Arm weakness, Speech slurred, Time — call 112 immediately.',
        'Note the exact time symptoms started — critical for hospital treatment.',
        'Keep victim lying down. Use Recovery Position if unconscious but breathing.',
        'Never leave them alone. Reassure constantly until emergency services arrive.'
      ],
      FR: [
        'Appliquez le test FAST : Visage affaissé, Bras faible, Parole difficile, Temps — appelez le 112.',
        'Notez l\'heure exacte de début des symptômes — essentiel pour le traitement hospitalier.',
        'Allongez la victime. Mettez en PLS si inconsciente mais respire.',
        'Ne la laissez jamais seule. Rassurez-la jusqu\'à l\'arrivée des secours.'
      ]
    },
    avoid: {
      EN: ['Do NOT give food or drink — risk of choking.', 'Do NOT give Aspirin — can worsen a hemorrhagic stroke.'],
      FR: ['Ne donnez NI à boire NI à manger — risque de fausse route.', 'Ne donnez pas d\'aspirine — peut aggraver un AVC hémorragique.']
    },
    quickAction: { EN: 'Start stroke onset timer', FR: 'Lancer le chronomètre de début' }
  },
  heart: {
    id: 'heart', icon: <FaHeartbeat size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Cardiac Arrest', FR: 'Arrêt Cardiaque' },
    desc: { EN: 'Chest pain or sudden loss of consciousness with no breathing.', FR: 'Douleur thoracique ou perte de conscience soudaine sans respiration.' },
    steps: {
      EN: [
        'Check responsiveness: shake gently and call out loudly.',
        'Check breathing: look, listen and feel for chest movement for 10 seconds maximum.',
        'Call 112 immediately. Ask someone nearby to find an AED defibrillator.',
        'Start CPR: 30 chest compressions (100-120/min) then 2 rescue breaths. Repeat until help arrives.'
      ],
      FR: [
        'Vérifiez la conscience : secouez doucement et interpellez à voix haute.',
        'Vérifiez la respiration pendant 10 secondes maximum.',
        'Appelez le 112 immédiatement. Demandez un DAE défibrillateur à proximité.',
        'Commencez la RCP : 30 compressions thoraciques (100-120/min) puis 2 insufflations. Répétez.'
      ]
    },
    avoid: {
      EN: ['Do NOT leave the victim alone at any moment.', 'Do NOT hesitate to perform CPR — doing nothing is the worst option.'],
      FR: ['Ne laissez jamais la victime seule.', 'N\'hésitez pas à masser — ne rien faire est la pire option.']
    },
    quickAction: { EN: 'Start CPR metronome (110 BPM)', FR: 'Lancer le métronome RCP (110 BPM)' }
  },
  choking: {
    id: 'choking', icon: <FaExclamationTriangle size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Choking / Suffocation', FR: 'Étouffement / Suffocation' },
    desc: { EN: 'Complete airway obstruction — cannot speak, cough or breathe.', FR: 'Obstruction totale — ne peut ni parler, ni tousser, ni respirer.' },
    steps: {
      EN: [
        'Give 5 firm back blows between the shoulder blades using the heel of your hand.',
        'If unsuccessful: give 5 abdominal thrusts (Heimlich maneuver) — fist above navel, pull sharply inward and upward.',
        'Alternate 5 back blows and 5 abdominal thrusts until the object is expelled.',
        'If victim loses consciousness: lay them down and start CPR immediately.'
      ],
      FR: [
        'Donnez 5 claques vigoureuses dans le dos entre les omoplates avec le talon de la main.',
        'En cas d\'échec : effectuez 5 compressions abdominales (Heimlich) — poing au-dessus du nombril, tirez vers l\'intérieur et vers le haut.',
        'Alternez 5 claques et 5 compressions jusqu\'à expulsion du corps étranger.',
        'Si la victime perd connaissance : allongez-la et commencez la RCP immédiatement.'
      ]
    },
    avoid: {
      EN: ['Do NOT blindly reach into the throat — you may push the object deeper.'],
      FR: ['Ne cherchez pas à retirer l\'objet à l\'aveugle — vous risquez de l\'enfoncer davantage.']
    }
  },
  drowning: {
    id: 'drowning', icon: <FaWater size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Drowning', FR: 'Noyade' },
    desc: { EN: 'Respiratory distress caused by immersion in water.', FR: 'Détresse respiratoire provoquée par l\'immersion dans l\'eau.' },
    steps: {
      EN: [
        'Get the victim out of water safely without endangering yourself.',
        'Check consciousness and breathing immediately after removal.',
        'If not breathing: give 5 initial rescue breaths, then start CPR (30 compressions + 2 breaths).',
        'Remove wet clothing, dry and wrap in warm blanket to prevent hypothermia.'
      ],
      FR: [
        'Sortez la victime de l\'eau en toute sécurité sans vous mettre en danger.',
        'Vérifiez immédiatement la conscience et la respiration après extraction.',
        'Si elle ne respire pas : donnez 5 insufflations initiales, puis commencez la RCP (30 compressions + 2 insufflations).',
        'Retirez les vêtements mouillés et couvrez pour éviter l\'hypothermie.'
      ]
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
      EN: [
        'Cool the burn with running cool water (15°C) for at least 15 minutes — start immediately.',
        'Remove jewelry and clothing near the burn area unless stuck to the skin.',
        'Cover loosely with clean non-adhesive dressing or sterile plastic wrap.',
        'Seek medical help urgently for deep, large, facial or chemical burns.'
      ],
      FR: [
        'Refroidissez sous eau courante fraîche (15°C) pendant au moins 15 minutes — commencez immédiatement.',
        'Retirez bijoux et vêtements près de la brûlure sauf s\'ils adhèrent à la peau.',
        'Couvrez avec un pansement propre non adhésif ou film plastique stérile.',
        'Consultez d\'urgence pour les brûlures profondes, étendues, faciales ou chimiques.'
      ]
    },
    avoid: {
      EN: ['Do NOT apply ice, butter, oil or toothpaste — worsens the damage seriously.', 'Do NOT pop blisters — dramatically increases infection risk.'],
      FR: ['N\'appliquez JAMAIS glace, beurre, huile ou dentifrice — aggrave les lésions.', 'Ne percez pas les cloques — augmente considérablement le risque d\'infection.']
    }
  },
  bleeding: {
    id: 'bleeding', icon: <FaTint size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Severe Bleeding', FR: 'Hémorragie Grave' },
    desc: { EN: 'Rapid heavy blood loss from an open wound.', FR: 'Perte de sang abondante et rapide d\'une blessure ouverte.' },
    steps: {
      EN: [
        'Apply firm direct pressure on the wound with a clean cloth or gloved hand.',
        'Elevate the injured limb above the heart level if possible to slow blood flow.',
        'If bleeding continues: add a second layer on top — never remove the first cloth.',
        'Lay victim flat and keep warm to prevent shock. Call 112 immediately.'
      ],
      FR: [
        'Exercez une pression directe et ferme sur la plaie avec un tissu propre ou une main gantée.',
        'Surélevez le membre blessé au-dessus du niveau du cœur si possible pour ralentir le saignement.',
        'Si le saignement persiste : ajoutez une couche par-dessus — ne retirez jamais le premier tissu.',
        'Allongez la victime à plat et couvrez pour prévenir l\'état de choc. Appelez le 112.'
      ]
    },
    avoid: {
      EN: ['Do NOT remove the first cloth if soaked — add another on top.', 'Do NOT remove embedded objects from the wound — they act as plugs.'],
      FR: ['Ne retirez pas le premier tissu s\'il est imbibé — ajoutez-en un autre par-dessus.', 'Ne retirez pas les objets plantés dans la plaie — ils font office de bouchon.']
    }
  },
  fracture: {
    id: 'fracture', icon: <FaBone size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Fractures & Sprains', FR: 'Fractures et Entorses' },
    desc: { EN: 'Broken bones or severe joint injuries.', FR: 'Os brisé ou traumatisme articulaire grave.' },
    steps: {
      EN: [
        'Immobilize the injured area completely. Do NOT attempt to realign the bone.',
        'For open fractures: cover the wound with sterile dressing to prevent infection.',
        'Apply ice wrapped in a towel to reduce swelling and relieve pain.',
        'Elevate the limb gently only if it does not cause additional pain.'
      ],
      FR: [
        'Immobilisez complètement la zone blessée. Ne tentez PAS de redresser l\'os.',
        'En cas de fracture ouverte : couvrez la plaie avec un pansement stérile pour éviter l\'infection.',
        'Appliquez du froid enveloppé dans un tissu pour réduire le gonflement et soulager la douleur.',
        'Surélevez délicatement le membre uniquement si cela ne provoque pas de douleur supplémentaire.'
      ]
    },
    avoid: {
      EN: ['Do NOT force the victim to move or walk.', 'Do NOT massage the suspected fracture site.'],
      FR: ['Ne forcez pas la victime à bouger ou marcher.', 'Ne massez pas la zone suspectée de fracture.']
    }
  },
  poisoning: {
    id: 'poisoning', icon: <FaSkullCrossbones size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Poisoning & Intoxication', FR: 'Intoxication et Empoisonnement' },
    desc: { EN: 'Ingestion, inhalation or skin contact with a toxic substance.', FR: 'Ingestion, inhalation ou contact cutané avec un produit toxique.' },
    steps: {
      EN: [
        'Identify what was ingested or inhaled, the quantity and the exact time.',
        'If chemical contacted skin or eyes: rinse with running water for 15-20 minutes continuously.',
        'Call 112 or Poison Control Center immediately with product information.',
        'If victim is conscious: keep seated and calm. Do not leave them alone.'
      ],
      FR: [
        'Identifiez le produit ingéré ou inhalé, la quantité et l\'heure exacte.',
        'Si contact cutané ou oculaire : rincez abondamment à l\'eau courante pendant 15-20 minutes.',
        'Appelez le 112 ou le centre antipoison immédiatement avec les informations sur le produit.',
        'Si la victime est consciente : gardez-la assise et calme. Ne la laissez pas seule.'
      ]
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
    desc: { EN: 'Sudden violent body shaking or loss of body control.', FR: 'Secousses musculaires involontaires et perte de conscience soudaine.' },
    steps: {
      EN: [
        'Clear the area of sharp or hard objects immediately to protect the victim.',
        'Place something soft (folded jacket or cloth) gently under the victim\'s head.',
        'Time the seizure duration — this is critical information for doctors.',
        'Once shaking stops: roll the victim into Recovery Position (PLS) on their side.'
      ],
      FR: [
        'Écartez immédiatement tous les objets dangereux autour de la victime.',
        'Placez un objet mou (veste pliée ou tissu) doucement sous la tête.',
        'Chronométrez la durée de la crise — information critique pour les médecins.',
        'Une fois les convulsions terminées : mettez la victime sur le côté en PLS.'
      ]
    },
    avoid: {
      EN: ['Do NOT restrain or hold the victim down during convulsions.', 'Do NOT put anything in their mouth — risk of choking or severe biting.'],
      FR: ['Ne retenez PAS les mouvements de la victime pendant les convulsions.', 'Ne mettez RIEN dans sa bouche — risque d\'étouffement ou de morsure grave.']
    }
  },
  electrocution: {
    id: 'electrocution', icon: <FaBolt size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Electrocution', FR: 'Électrocution / Choc Électrique' },
    desc: { EN: 'Accidental electric current passing through the body.', FR: 'Passage accidentel d\'un courant électrique à travers le corps.' },
    steps: {
      EN: [
        'Do NOT touch the victim while still in contact with the electrical source.',
        'Turn off the main power source or circuit breaker immediately.',
        'If power cannot be cut: use a dry non-conducting object (dry wood or plastic) to push the source away.',
        'Once safe: check breathing and start CPR if victim is not breathing.'
      ],
      FR: [
        'Ne touchez JAMAIS la victime si elle est encore en contact avec la source électrique.',
        'Coupez immédiatement le disjoncteur général ou la source d\'alimentation.',
        'Si impossible : écartez le câble avec un objet sec non conducteur (bois sec ou plastique).',
        'Une fois en sécurité : vérifiez la respiration et commencez la RCP si nécessaire.'
      ]
    },
    avoid: {
      EN: ['Do NOT approach high-voltage wires — call specialized fire services only.'],
      FR: ['N\'approchez pas des câbles haute tension — appelez uniquement les pompiers spécialisés.']
    }
  },
  accident: {
    id: 'accident', icon: <FaCar size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Traffic Accident', FR: 'Accident de la Route' },
    desc: { EN: 'Securing the scene and assessing road casualties.', FR: 'Sécurisation des lieux et prise en charge des victimes.' },
    steps: {
      EN: [
        'PROTECT: Turn on hazard lights, place warning triangles, put on high-visibility vest.',
        'ALERT: Call 112 — give exact location, road name and number of casualties.',
        'ASSESS: Check all victims carefully without moving them.',
        'FIRST AID: Stop severe bleeding, keep victims warm, talk to conscious victims to reassure them.'
      ],
      FR: [
        'PROTÉGER : Feux de détresse, triangle de signalisation, gilets pour éviter un sur-accident.',
        'ALERTER : Appelez le 112 — donnez le lieu précis, la route et le nombre de blessés.',
        'SECOURIR : Vérifiez tous les blessés sans les déplacer.',
        'PREMIERS SECOURS : Stoppez les saignements, couvrez les victimes, parlez aux conscients pour les rassurer.'
      ]
    },
    avoid: {
      EN: ['Do NOT move a victim unless there is immediate fire or explosion risk.', 'Do NOT remove a motorcyclist\'s helmet — risk of spinal paralysis.'],
      FR: ['Ne déplacez pas une victime sauf danger de mort imminent (incendie, explosion).', 'Ne retirez jamais le casque d\'un motard blessé — risque de paralysie vertébrale.']
    }
  },
  snakebite_viper: {
    id: 'snakebite_viper', icon: <GiSnake size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Viper / Gaboon Viper Bite', FR: 'Morsure de Vipère / Vipère du Gabon' },
    desc: { EN: 'Common in Cameroon forests. Causes severe local swelling and tissue destruction.', FR: 'Fréquente dans les forêts camerounaises. Provoque un gonflement sévère et destruction des tissus.' },
    steps: {
      EN: [
        'Keep the victim completely still and calm — movement speeds venom spread through the body.',
        'Immobilize the bitten limb below heart level using a splint or improvised support.',
        'Remove rings, watches, bracelets and tight clothing before swelling occurs.',
        'Clean the bite wound gently with soap and water. Transport urgently to nearest hospital — antivenom is the only treatment.'
      ],
      FR: [
        'Gardez la victime immobile et calme — le mouvement accélère la diffusion du venin.',
        'Immobilisez le membre mordu en dessous du niveau du cœur avec une attelle ou support improvisé.',
        'Retirez bagues, montres, bracelets et vêtements serrés avant le gonflement.',
        'Nettoyez délicatement la plaie à l\'eau et au savon. Transportez d\'urgence à l\'hôpital — l\'antivenin est le seul traitement.'
      ]
    },
    avoid: {
      EN: ['Do NOT cut the wound or try to suck out the venom — ineffective and dangerous.', 'Do NOT apply tourniquet or ice — worsens tissue damage.', 'Do NOT give alcohol or traditional remedies.'],
      FR: ['N\'incisez pas la plaie et n\'aspirez jamais le venin — inefficace et dangereux.', 'N\'appliquez pas de garrot ni de glace — aggrave les lésions tissulaires.', 'Ne donnez pas d\'alcool ni de remèdes traditionnels.']
    }
  },
  snakebite_mamba: {
    id: 'snakebite_mamba', icon: <GiSnake size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Black Mamba / Green Mamba Bite', FR: 'Morsure de Mamba Noir / Vert' },
    desc: { EN: 'Extremely dangerous. Neurotoxic venom — can cause death within 1-4 hours without treatment.', FR: 'Extrêmement dangereux. Venin neurotoxique — peut causer la mort en 1 à 4 heures sans traitement.' },
    steps: {
      EN: [
        'Call 112 IMMEDIATELY — this is a life-threatening emergency with very little time.',
        'Keep the victim completely still — lay them down, do not walk or move them.',
        'Immobilize the bitten limb at or below heart level.',
        'Monitor breathing closely — neurotoxic venom causes rapid respiratory failure. Be ready to perform CPR.'
      ],
      FR: [
        'Appelez le 112 IMMÉDIATEMENT — urgence vitale avec très peu de temps disponible.',
        'Gardez la victime totalement immobile — allongez-la, ne la faites pas marcher.',
        'Immobilisez le membre mordu à hauteur ou en dessous du cœur.',
        'Surveillez étroitement la respiration — le venin neurotoxique provoque une défaillance respiratoire rapide. Soyez prêt à faire la RCP.'
      ]
    },
    avoid: {
      EN: ['Do NOT cut, suck or apply any substance to the wound.', 'Do NOT let the victim walk — speeds venom absorption dramatically.', 'Do NOT waste time on traditional remedies — every minute counts.'],
      FR: ['N\'incisez pas, n\'aspirez pas et n\'appliquez rien sur la plaie.', 'Ne laissez pas la victime marcher — accélère dramatiquement l\'absorption du venin.', 'Ne perdez pas de temps avec des remèdes traditionnels — chaque minute compte.']
    },
    quickAction: { EN: 'Start mamba bite timer', FR: 'Lancer le chrono morsure mamba' }
  },
  scorpion: {
    id: 'scorpion', icon: <GiScorpion size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Scorpion Sting', FR: 'Piqûre de Scorpion' },
    desc: { EN: 'Common in northern Cameroon. Can be dangerous especially for children.', FR: 'Fréquente au nord Cameroun. Peut être dangereuse surtout pour les enfants.' },
    steps: {
      EN: [
        'Stay calm and keep the victim still to slow venom spread.',
        'Wash the sting area thoroughly with soap and water.',
        'Apply a cold compress (ice wrapped in cloth) to the sting site to reduce pain.',
        'Transport immediately to hospital — especially if victim is a child, elderly or shows breathing difficulty.'
      ],
      FR: [
        'Restez calme et gardez la victime immobile pour ralentir la diffusion du venin.',
        'Nettoyez soigneusement la zone piquée à l\'eau et au savon.',
        'Appliquez une compresse froide (glace dans un tissu) sur la piqûre pour réduire la douleur.',
        'Transportez immédiatement à l\'hôpital — surtout si la victime est un enfant, une personne âgée ou présente des difficultés respiratoires.'
      ]
    },
    avoid: {
      EN: ['Do NOT apply tourniquet or make incisions.', 'Do NOT give anti-inflammatory drugs without medical advice.'],
      FR: ['N\'appliquez pas de garrot et ne faites pas d\'incisions.', 'Ne donnez pas d\'anti-inflammatoires sans avis médical.']
    }
  },
  pediatric: {
    id: 'pediatric', icon: <FaBaby size={22} />, color: '#ea580c', bg: '#fff7ed',
    gravity: { EN: 'HIGH', FR: 'ÉLEVÉ' },
    title: { EN: 'Pediatric Emergencies', FR: 'Urgences Pédiatriques' },
    desc: { EN: 'High fever, choking or dehydration in babies and young children.', FR: 'Fièvre élevée, étouffement ou déshydratation chez les bébés et jeunes enfants.' },
    steps: {
      EN: [
        'High fever: Partially undress the child, cool the room to 19-20°C and give small sips of water.',
        'CPR for infant (under 1 year): Cover both nose and mouth, give 5 rescue breaths, then 30 chest compressions with 2 fingers only.',
        'Choking infant: Lay face down on your forearm supporting the head, give 5 gentle but firm back slaps.',
        'Monitor hydration closely: watch for no tears, dry mouth and unusual lethargy.'
      ],
      FR: [
        'Fièvre : Déshabillez partiellement l\'enfant, refroidissez la pièce à 19-20°C et donnez de petites gorgées d\'eau.',
        'RCP nourrisson (moins de 1 an) : Couvrez bouche ET nez, donnez 5 insufflations, puis 30 compressions avec 2 doigts seulement.',
        'Étouffement bébé : Placez face vers le bas sur l\'avant-bras en soutenant la tête, donnez 5 claques fermes mais mesurées dans le dos.',
        'Surveillez la déshydratation : absence de larmes, bouche sèche, léthargie inhabituelle.'
      ]
    },
    avoid: {
      EN: ['Do NOT give cold baths for fever — causes shivering and raises internal temperature.', 'Do NOT apply adult CPR force on infants — use 2 fingers only.'],
      FR: ['Ne donnez pas de bain glacé — risque de choc thermique et convulsions.', 'N\'utilisez pas la force adulte sur un nourrisson — utilisez 2 doigts seulement.']
    }
  },
  maternal: {
    id: 'maternal', icon: <FaFemale size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Maternal Emergencies', FR: 'Urgences Maternelles' },
    desc: { EN: 'Severe bleeding, pain during pregnancy or imminent delivery.', FR: 'Saignements graves, douleurs en grossesse ou accouchement imminent.' },
    steps: {
      EN: [
        'Lay the pregnant woman on her LEFT side — relieves pressure on major blood vessels.',
        'Keep her warm, calm and monitor her breathing and pulse regularly.',
        'If delivery is imminent: wash hands thoroughly, lay clean sheets, guide her breathing calmly.',
        'Call 112, a midwife or prepare immediate transport to the nearest maternity hospital.'
      ],
      FR: [
        'Allongez la femme enceinte sur le CÔTÉ GAUCHE — libère la veine cave inférieure.',
        'Gardez-la au chaud, calme et surveillez sa respiration et son pouls régulièrement.',
        'Si accouchement imminent : lavez-vous soigneusement les mains, disposez des draps propres, guidez sa respiration calmement.',
        'Appelez le 112, une sage-femme ou préparez le transport immédiat vers la maternité la plus proche.'
      ]
    },
    avoid: {
      EN: ['Do NOT let her stand or walk if she is bleeding or in severe pain.', 'Do NOT pull the baby during delivery under any circumstances.'],
      FR: ['Ne la laissez pas debout ou marcher si elle saigne ou souffre intensément.', 'Ne tirez jamais sur le bébé lors de l\'expulsion sous aucun prétexte.']
    }
  },
  heatstroke: {
    id: 'heatstroke', icon: <FaThermometerHalf size={22} />, color: '#ef4444', bg: '#fef2f2',
    gravity: { EN: 'CRITICAL', FR: 'CRITIQUE' },
    title: { EN: 'Heatstroke & Dehydration', FR: 'Coup de Chaleur et Déshydratation' },
    desc: { EN: 'Dangerously high body temperature from prolonged heat exposure.', FR: 'Température corporelle dangereusement élevée due à l\'exposition prolongée à la chaleur.' },
    steps: {
      EN: [
        'Move the victim immediately to a cool shaded area away from direct heat.',
        'Remove excess clothing and apply cool damp cloths to neck, armpits and groin.',
        'Fan the victim continuously while applying cold compresses to speed cooling.',
        'If conscious and not vomiting: give small sips of cool water every few minutes.'
      ],
      FR: [
        'Transportez immédiatement la victime dans un endroit frais et ombragé loin de la chaleur directe.',
        'Retirez les vêtements en excès et appliquez des compresses fraîches sur le cou, les aisselles et l\'aine.',
        'Ventilez continuellement tout en appliquant du froid pour accélérer le refroidissement.',
        'Si consciente et sans vomissements : donnez de petites gorgées d\'eau fraîche toutes les quelques minutes.'
      ]
    },
    avoid: {
      EN: ['Do NOT give alcohol or caffeinated drinks.', 'Do NOT leave the victim alone — heatstroke can rapidly cause loss of consciousness.'],
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
            <div style={{ background: 'linear-gradient(135deg, #7f1d1d, #ef4444)', borderRadius: '16px', padding: '22px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', color: 'white', fontWeight: 900, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaShieldAlt size={20} />
                  {lang === 'EN' ? 'Emergency First Aid Guide' : 'Guide de Premiers Secours'}
                </h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem' }}>
                  {lang === 'EN' ? '18 emergency protocols — available offline' : '18 protocoles d\'urgence — disponibles hors ligne'}
                </p>
              </div>
              <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'white', color: '#ef4444', padding: '10px 18px', borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '0.86rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <FaPhoneAlt size={13} />
                {lang === 'EN' ? 'Call 112' : 'Appeler 112'}
              </a>
            </div>

            {/* Search */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '11px 16px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
              <MdSearch size={20} color="#94a3b8" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'EN' ? 'Search emergency type...' : 'Rechercher un type d\'urgence...'}
                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.86rem', fontFamily: 'Inter, sans-serif', color: '#1e293b', background: 'transparent' }} />
              {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1 }}>×</button>}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {Object.entries(GRAVITY_CONFIG).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: val.bg, border: '1px solid ' + val.color + '40', borderRadius: '20px', padding: '4px 12px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: val.color }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: val.color }}>{val.label[lang]}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '4px 12px' }}>
                <FaShieldAlt size={10} color="#16a34a" />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a' }}>{lang === 'EN' ? 'Available offline' : 'Disponible hors ligne'}</span>
              </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
              {sorted.map(item => {
                const gConfig = GRAVITY_CONFIG[item.gravity.EN];
                return (
                  <motion.div key={item.id} onClick={() => setSelected(item)}
                    whileHover={{ y: -3, boxShadow: '0 8px 20px rgba(0,0,0,0.08)' }}
                    style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', cursor: 'pointer', position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.color, borderRadius: '14px 0 0 14px' }} />
                    <div style={{ paddingLeft: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                          {item.icon}
                        </div>
                        <span style={{ background: gConfig.bg, color: gConfig.color, fontSize: '0.58rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', border: '1px solid ' + gConfig.color + '30' }}>
                          {gConfig.label[lang]}
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 4px', color: '#0f172a', fontWeight: 800, fontSize: '0.88rem' }}>{item.title[lang]}</h3>
                      <p style={{ margin: '0 0 10px', color: '#475569', fontSize: '0.74rem', lineHeight: 1.5 }}>{item.desc[lang]}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: item.color }}>
                        {lang === 'EN' ? 'View Protocol' : 'Voir Protocole'} →
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <button onClick={() => { setSelected(null); setTimerActive(false); setTimer(0); }}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'white', border: '1.5px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 }}>
                <FaChevronLeft size={14} />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: selected.color }}>{selected.icon}</span>
                  <h2 style={{ margin: 0, color: '#0f172a', fontWeight: 900, fontSize: '1.1rem' }}>{selected.title[lang]}</h2>
                  <span style={{ background: GRAVITY_CONFIG[selected.gravity.EN].bg, color: selected.color, fontSize: '0.6rem', fontWeight: 800, padding: '3px 9px', borderRadius: '20px', border: '1px solid ' + selected.color + '30' }}>
                    {GRAVITY_CONFIG[selected.gravity.EN].label[lang]}
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', color: '#475569', fontSize: '0.8rem' }}>{selected.desc[lang]}</p>
              </div>
              <a href="tel:112" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', color: 'white', padding: '9px 16px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0, boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}>
                <FaPhoneAlt size={12} />
                112
              </a>
            </div>

            {/* Timer */}
            {selected.quickAction && (
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaClock color="#3b82f6" size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>{selected.quickAction[lang]}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{lang === 'EN' ? 'Share elapsed time with doctors' : 'Communiquez la durée aux médecins'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 900, color: timerActive ? '#ef4444' : '#1e293b' }}>{formatTimer(timer)}</span>
                  <button onClick={() => setTimerActive(!timerActive)} style={{ padding: '7px 16px', background: timerActive ? '#ef4444' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    {timerActive
                      ? (lang === 'EN' ? 'Stop' : 'Arrêter')
                      : timer > 0
                        ? (lang === 'EN' ? 'Resume' : 'Reprendre')
                        : (lang === 'EN' ? 'Start' : 'Démarrer')}
                  </button>
                </div>
              </div>
            )}

            {/* Alert */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MdWarning color="#ef4444" size={18} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#991b1b' }}>
                {lang === 'EN'
                  ? 'Call 112 immediately while performing first aid. Every second matters.'
                  : 'Appelez le 112 immédiatement tout en prodiguant les premiers secours. Chaque seconde compte.'}
              </span>
            </div>

            {/* Steps + Avoid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '16px' }}>

              {/* Steps */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
                <h3 style={{ margin: '0 0 14px', color: '#0f172a', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 900 }}>✓</span>
                  </div>
                  {lang === 'EN' ? 'Steps to Follow' : 'Étapes à Suivre'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selected.steps[lang].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {idx + 1}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#1e293b', lineHeight: 1.65, fontWeight: 500 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Avoid + Emergency numbers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#fffafb', border: '1.5px solid #fecdd3', borderRadius: '14px', padding: '18px', flex: 1 }}>
                  <h3 style={{ margin: '0 0 12px', color: '#be123c', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 900 }}>✗</span>
                    </div>
                    {lang === 'EN' ? 'Mistakes to Avoid' : 'Erreurs à Éviter'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selected.avoid[lang].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: '#fff5f5', padding: '9px 11px', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                        <span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.95rem', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>×</span>
                        <p style={{ margin: 0, fontSize: '0.79rem', color: '#1e293b', lineHeight: 1.6, fontWeight: 500 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency numbers */}
                <div style={{ background: 'white', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <MdLocalHospital color="#3b82f6" size={16} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {lang === 'EN' ? 'Emergency Numbers — Cameroon' : 'Numéros d\'Urgence — Cameroun'}
                    </span>
                  </div>
                  {[
                    { label: lang === 'EN' ? 'General Emergency' : 'Urgences Générales', number: '112' },
                    { label: lang === 'EN' ? 'Fire Brigade' : 'Pompiers', number: '18' },
                    { label: lang === 'EN' ? 'Police' : 'Police', number: '17' },
                    { label: 'Gendarmerie', number: '113' },
                  ].map((contact, i) => (
                    <a key={i} href={'tel:' + contact.number} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none', textDecoration: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <FaPhoneAlt size={11} color="#94a3b8" />
                        <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>{contact.label}</span>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ef4444' }}>{contact.number}</span>
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