/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBookReader, FaAward, FaChartBar, FaCheck, FaTimes,
  FaGraduationCap, FaArrowRight, FaArrowLeft, FaLock,
  FaHeartbeat, FaAppleAlt, FaMosquito, FaHandsWash,
  FaBrain, FaRunning, FaStar, FaTrophy
} from 'react-icons/fa';
import { MdHealthAndSafety, MdPregnantWoman, MdPsychology } from 'react-icons/md';

const COURSES = [
  {
    id: 'first_aid',
    icon: <FaHeartbeat size={22} />,
    color: '#ef4444',
    bg: '#fef2f2',
    title: { EN: 'First Aid Basics', FR: 'Premiers Secours' },
    desc: { EN: 'Learn vital gestures to save lives in emergencies.', FR: 'Apprenez les gestes vitaux pour sauver des vies.' },
    badgeLabel: { EN: 'First Responder', FR: 'Secouriste' },
    questions: [
      {
        lesson: { EN: 'The Recovery Position is used when a victim is unconscious but breathing. Place them on their side to keep the airway open and prevent choking. Steps: 1) Bend the nearest arm at a right angle. 2) Bring the other arm across the chest. 3) Bend the far knee. 4) Roll the victim toward you. 5) Open the mouth slightly.', FR: 'La Position Latérale de Sécurité s\'applique quand une victime est inconsciente mais respire. Placez-la sur le côté pour maintenir les voies respiratoires ouvertes. Étapes : 1) Placez le bras le plus proche à angle droit. 2) Ramenez l\'autre bras. 3) Pliez le genou opposé. 4) Faites-la rouler vers vous. 5) Ouvrez légèrement la bouche.' },
        question: { EN: 'When should you put a victim in the Recovery Position?', FR: 'Quand place-t-on une victime en Position Latérale de Sécurité ?' },
        options: [
          { id: 'A', text: { EN: 'If she is conscious and talking.', FR: 'Si elle est consciente et parle.' } },
          { id: 'B', text: { EN: 'If she is unconscious but breathing.', FR: 'Si elle est inconsciente mais respire.' } },
          { id: 'C', text: { EN: 'If she is not breathing at all.', FR: 'Si elle ne respire plus du tout.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'CPR (Cardiopulmonary Resuscitation) is performed when a person has no pulse and is not breathing. Push hard and fast on the center of the chest — 30 compressions, then 2 rescue breaths. Continue until help arrives. For children, use 2 fingers only.', FR: 'La RCP (Réanimation Cardio-Pulmonaire) est réalisée quand une personne n\'a plus de pouls et ne respire plus. Appuyez fort et vite au centre du thorax — 30 compressions, puis 2 insufflations. Continuez jusqu\'à l\'arrivée des secours. Pour les enfants, utilisez 2 doigts.' },
        question: { EN: 'How many chest compressions are done before rescue breaths in CPR?', FR: 'Combien de compressions thoraciques avant les insufflations en RCP ?' },
        options: [
          { id: 'A', text: { EN: '10 compressions', FR: '10 compressions' } },
          { id: 'B', text: { EN: '20 compressions', FR: '20 compressions' } },
          { id: 'C', text: { EN: '30 compressions', FR: '30 compressions' } }
        ],
        correct: 'C'
      },
      {
        lesson: { EN: 'Burns are classified in 3 degrees. First degree: redness only (sunburn). Second degree: blisters form. Third degree: deep tissue damage. For minor burns, cool with running water for 10 minutes. NEVER use ice, butter, or toothpaste. Cover with a clean cloth and seek medical help for 2nd and 3rd degree burns.', FR: 'Les brûlures sont classées en 3 degrés. 1er degré : rougeur (coup de soleil). 2e degré : cloques. 3e degré : destruction profonde. Pour une brûlure légère, refroidir sous l\'eau courante 10 minutes. Ne JAMAIS utiliser de glace, beurre ou dentifrice. Couvrir d\'un linge propre et consulter pour les 2e et 3e degrés.' },
        question: { EN: 'What should you do first for a minor burn?', FR: 'Que faut-il faire en premier pour une brûlure légère ?' },
        options: [
          { id: 'A', text: { EN: 'Apply butter or toothpaste.', FR: 'Appliquer du beurre ou du dentifrice.' } },
          { id: 'B', text: { EN: 'Cool with running water for 10 minutes.', FR: 'Refroidir sous eau courante pendant 10 minutes.' } },
          { id: 'C', text: { EN: 'Apply ice directly.', FR: 'Appliquer de la glace directement.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Choking occurs when an object blocks the airway. Signs: person cannot speak, cough, or breathe. For adults: perform the Heimlich maneuver — stand behind the person, place a fist above the navel, and give 5 strong upward thrusts. For infants: 5 back blows + 5 chest thrusts. Call emergency services immediately.', FR: 'L\'étouffement survient quand un objet bloque les voies respiratoires. Signes : la personne ne peut pas parler, tousser ou respirer. Pour adultes : manœuvre de Heimlich — se placer derrière, poing au-dessus du nombril, 5 poussées vers le haut. Pour nourrissons : 5 tapes dans le dos + 5 compressions. Appelez les secours immédiatement.' },
        question: { EN: 'What is the correct maneuver for an adult who is choking?', FR: 'Quelle est la manœuvre correcte pour un adulte qui s\'étouffe ?' },
        options: [
          { id: 'A', text: { EN: 'Pat them strongly on the back only.', FR: 'Lui taper vigoureusement dans le dos uniquement.' } },
          { id: 'B', text: { EN: 'Perform the Heimlich maneuver — upward abdominal thrusts.', FR: 'Réaliser la manœuvre de Heimlich — poussées abdominales vers le haut.' } },
          { id: 'C', text: { EN: 'Give them water to drink.', FR: 'Lui donner de l\'eau à boire.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Bleeding control is critical. For external bleeding: apply firm, direct pressure with a clean cloth. Do not remove the cloth — add more on top if it soaks through. Elevate the injured limb above heart level if possible. If bleeding doesn\'t stop in 10 minutes or is severe, call emergency services. Tourniquets are only used for life-threatening limb bleeding.', FR: 'Contrôler une hémorragie est essentiel. Pour un saignement externe : exercez une pression ferme et directe avec un tissu propre. Ne retirez pas le tissu — ajoutez-en un autre par-dessus. Élevez le membre blessé au-dessus du cœur si possible. Si le saignement ne s\'arrête pas en 10 minutes ou est abondant, appelez les secours. Le garrot n\'est utilisé qu\'en cas d\'hémorragie grave d\'un membre.' },
        question: { EN: 'What should you do when a cloth soaks through with blood during first aid?', FR: 'Que faire quand le tissu est imbibé de sang lors des premiers secours ?' },
        options: [
          { id: 'A', text: { EN: 'Remove the cloth and replace it.', FR: 'Retirer le tissu et le remplacer.' } },
          { id: 'B', text: { EN: 'Add another cloth on top without removing the first.', FR: 'Ajouter un autre tissu par-dessus sans retirer le premier.' } },
          { id: 'C', text: { EN: 'Stop applying pressure.', FR: 'Arrêter d\'appuyer.' } }
        ],
        correct: 'B'
      }
    ]
  },
  {
    id: 'nutrition',
    icon: <FaAppleAlt size={22} />,
    color: '#10b981',
    bg: '#f0fdf4',
    title: { EN: 'Healthy Nutrition', FR: 'Nutrition Saine' },
    desc: { EN: 'Master daily nutrition and hydration for optimal health.', FR: 'Maîtrisez les bases de la nutrition et de l\'hydratation.' },
    badgeLabel: { EN: 'Nutrition Champion', FR: 'Champion Nutrition' },
    questions: [
      {
        lesson: { EN: 'Water makes up about 60% of the human body. Proper hydration regulates temperature, lubricates joints, and helps kidneys flush waste. In Cameroon\'s warm climate, dehydration can happen quickly. Adults should drink at least 1.5 to 2 liters of water daily, even before feeling thirsty. Coffee, tea and alcohol increase dehydration.', FR: 'L\'eau représente 60% du corps humain. Une bonne hydratation régule la température, protège les articulations et aide à éliminer les toxines. Dans le climat chaud du Cameroun, la déshydratation arrive vite. Un adulte doit boire au moins 1,5 à 2 litres par jour, même sans avoir soif. Le café, le thé et l\'alcool déshydratent davantage.' },
        question: { EN: 'How much water should a healthy adult drink daily?', FR: 'Quelle quantité d\'eau un adulte sain doit-il boire par jour ?' },
        options: [
          { id: 'A', text: { EN: '0.5 liters', FR: '0,5 litre' } },
          { id: 'B', text: { EN: '1.5 to 2 liters', FR: '1,5 à 2 litres' } },
          { id: 'C', text: { EN: '5 liters', FR: '5 litres' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'A balanced diet includes 5 food groups: 1) Carbohydrates (rice, cassava, plantain) for energy. 2) Proteins (fish, beans, eggs, meat) for muscle repair. 3) Fats (palm oil, avocado) in moderation. 4) Vitamins & minerals (fruits and vegetables). 5) Water. Eat a variety of colors on your plate — each color provides different nutrients.', FR: 'Une alimentation équilibrée comprend 5 groupes : 1) Glucides (riz, manioc, plantain) pour l\'énergie. 2) Protéines (poisson, haricots, œufs, viande) pour les muscles. 3) Graisses (huile de palme, avocat) avec modération. 4) Vitamines et minéraux (fruits et légumes). 5) Eau. Variez les couleurs dans votre assiette — chaque couleur apporte des nutriments différents.' },
        question: { EN: 'Which food group provides the body with energy?', FR: 'Quel groupe alimentaire fournit de l\'énergie au corps ?' },
        options: [
          { id: 'A', text: { EN: 'Proteins (fish, meat)', FR: 'Protéines (poisson, viande)' } },
          { id: 'B', text: { EN: 'Carbohydrates (rice, cassava, plantain)', FR: 'Glucides (riz, manioc, plantain)' } },
          { id: 'C', text: { EN: 'Vitamins (fruits and vegetables)', FR: 'Vitamines (fruits et légumes)' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Iron deficiency anemia is common in Cameroon, especially in women and children. Iron is essential for producing red blood cells. Good sources of iron: red meat, liver, spinach, beans, groundnuts. Vitamin C (from oranges, tomatoes) helps iron absorption. Avoid drinking tea or coffee with iron-rich meals as they block absorption.', FR: 'L\'anémie par carence en fer est fréquente au Cameroun, surtout chez les femmes et enfants. Le fer est essentiel pour produire les globules rouges. Bonnes sources : viande rouge, foie, épinards, haricots, arachides. La vitamine C (oranges, tomates) aide à absorber le fer. Évitez le thé ou le café avec des repas riches en fer car ils bloquent l\'absorption.' },
        question: { EN: 'What helps improve iron absorption in the body?', FR: 'Qu\'est-ce qui aide à améliorer l\'absorption du fer dans le corps ?' },
        options: [
          { id: 'A', text: { EN: 'Drinking tea with every meal.', FR: 'Boire du thé à chaque repas.' } },
          { id: 'B', text: { EN: 'Vitamin C from citrus fruits and tomatoes.', FR: 'La vitamine C des agrumes et tomates.' } },
          { id: 'C', text: { EN: 'Eating less protein.', FR: 'Manger moins de protéines.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Salt and sugar excess are major health risks. Too much salt raises blood pressure (hypertension) — a risk for stroke and heart disease. Too much sugar leads to diabetes and obesity. Practical tips: cook with less salt, avoid soft drinks and sugary juices, read food labels, and choose fresh foods over processed ones. WHO recommends less than 5g of salt and 25g of sugar daily.', FR: 'L\'excès de sel et de sucre est un risque majeur. Trop de sel augmente la tension artérielle (hypertension) — facteur d\'AVC et maladies cardiaques. Trop de sucre mène au diabète et à l\'obésité. Conseils : cuisinez avec moins de sel, évitez les sodas et jus sucrés, lisez les étiquettes, préférez les aliments frais. L\'OMS recommande moins de 5g de sel et 25g de sucre par jour.' },
        question: { EN: 'What is the main health risk of consuming too much salt?', FR: 'Quel est le principal risque de consommer trop de sel ?' },
        options: [
          { id: 'A', text: { EN: 'Diabetes', FR: 'Le diabète' } },
          { id: 'B', text: { EN: 'High blood pressure (hypertension)', FR: 'L\'hypertension artérielle' } },
          { id: 'C', text: { EN: 'Vitamin C deficiency', FR: 'Carence en vitamine C' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Breastfeeding is the best nutrition for babies in the first 6 months. Breast milk contains all nutrients, antibodies, and water a baby needs. It protects against infections, diarrhea, and respiratory illness. After 6 months, introduce complementary foods (porridge, mashed vegetables, eggs) while continuing breastfeeding up to 2 years. Avoid giving water or other liquids before 6 months.', FR: 'L\'allaitement maternel est la meilleure nutrition pour les bébés les 6 premiers mois. Le lait maternel contient tous les nutriments, anticorps et l\'eau nécessaires. Il protège contre les infections, la diarrhée et les maladies respiratoires. Après 6 mois, introduisez des aliments (bouillie, légumes, œufs) tout en continuant l\'allaitement jusqu\'à 2 ans. Évitez de donner de l\'eau avant 6 mois.' },
        question: { EN: 'How long should exclusive breastfeeding last?', FR: 'Combien de temps doit durer l\'allaitement exclusif ?' },
        options: [
          { id: 'A', text: { EN: '2 months', FR: '2 mois' } },
          { id: 'B', text: { EN: '6 months', FR: '6 mois' } },
          { id: 'C', text: { EN: '12 months', FR: '12 mois' } }
        ],
        correct: 'B'
      }
    ]
  },
  {
    id: 'prevention',
    icon: <MdHealthAndSafety size={22} />,
    color: '#3b82f6',
    bg: '#eff6ff',
    title: { EN: 'Disease Prevention', FR: 'Prévention des Maladies' },
    desc: { EN: 'Protect yourself and your family from common diseases.', FR: 'Protégez-vous et votre famille des maladies courantes.' },
    badgeLabel: { EN: 'Prevention Hero', FR: 'Héros Prévention' },
    questions: [
      {
        lesson: { EN: 'Malaria is transmitted by female Anopheles mosquitoes. They breed in clean, stagnant water around homes. Prevention: 1) Eliminate stagnant water (empty pots, tires). 2) Sleep under WHO-approved insecticide-treated nets every night. 3) Use mosquito repellents at dusk. 4) Wear long-sleeved clothing in the evening. 5) Seek treatment immediately if you have fever, chills, or headache.', FR: 'Le paludisme est transmis par les moustiques Anophèles femelles. Ils pondent dans les eaux stagnantes. Prévention : 1) Éliminez les eaux stagnantes. 2) Dormez sous moustiquaire imprégnée chaque nuit. 3) Utilisez des répulsifs au crépuscule. 4) Portez des vêtements couvrants le soir. 5) Consultez immédiatement si vous avez fièvre, frissons ou maux de tête.' },
        question: { EN: 'Which is the most effective action to prevent malaria at home?', FR: 'Quelle est l\'action la plus efficace pour prévenir le paludisme à la maison ?' },
        options: [
          { id: 'A', text: { EN: 'Taking vitamin supplements daily.', FR: 'Prendre des compléments vitaminés chaque jour.' } },
          { id: 'B', text: { EN: 'Sleeping under an insecticide-treated mosquito net.', FR: 'Dormir sous une moustiquaire imprégnée.' } },
          { id: 'C', text: { EN: 'Leaving windows open at night.', FR: 'Laisser les fenêtres ouvertes la nuit.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Handwashing is the single most effective public health measure. Wash hands: before eating, after using the toilet, after touching animals, before preparing food, after coughing or sneezing. Use soap and running water — rub for at least 20 seconds covering all surfaces including between fingers and under nails. If no water is available, use alcohol-based hand sanitizer.', FR: 'Le lavage des mains est la mesure de santé publique la plus efficace. Lavez les mains : avant de manger, après les toilettes, après avoir touché des animaux, avant de préparer les repas, après avoir toussé ou éternué. Utilisez du savon et de l\'eau courante — frottez au moins 20 secondes en couvrant toutes les surfaces. Sans eau, utilisez un gel hydroalcoolique.' },
        question: { EN: 'How long should you scrub your hands when washing them?', FR: 'Combien de temps faut-il se frotter les mains lors du lavage ?' },
        options: [
          { id: 'A', text: { EN: '5 seconds', FR: '5 secondes' } },
          { id: 'B', text: { EN: 'At least 20 seconds', FR: 'Au moins 20 secondes' } },
          { id: 'C', text: { EN: '2 minutes', FR: '2 minutes' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Vaccines protect against serious diseases. Key vaccines in Cameroon: BCG (tuberculosis), Polio, DTP (diphtheria, tetanus, pertussis), Hepatitis B, Yellow Fever, Meningitis, COVID-19. Children should receive all recommended vaccines on schedule. Adults should keep tetanus and flu vaccines up to date. Vaccines do not cause the diseases they prevent — they train the immune system.', FR: 'Les vaccins protègent contre les maladies graves. Vaccins essentiels au Cameroun : BCG (tuberculose), Polio, DTP (diphtérie, tétanos, coqueluche), Hépatite B, Fièvre jaune, Méningite, COVID-19. Les enfants doivent recevoir tous les vaccins du calendrier. Les adultes doivent maintenir le vaccin antitétanique à jour. Les vaccins ne causent pas les maladies qu\'ils préviennent — ils entraînent le système immunitaire.' },
        question: { EN: 'What do vaccines do in the body?', FR: 'Que font les vaccins dans le corps ?' },
        options: [
          { id: 'A', text: { EN: 'They cause the disease to build immunity.', FR: 'Ils provoquent la maladie pour créer une immunité.' } },
          { id: 'B', text: { EN: 'They train the immune system to fight specific diseases.', FR: 'Ils entraînent le système immunitaire à combattre des maladies spécifiques.' } },
          { id: 'C', text: { EN: 'They permanently cure all diseases.', FR: 'Ils guérissent définitivement toutes les maladies.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Typhoid fever is caused by Salmonella Typhi bacteria spread through contaminated food and water. Symptoms: prolonged fever, headache, abdominal pain, weakness. Prevention: drink safe water (boiled or purified), wash fruits and vegetables, cook food thoroughly, wash hands before eating. Treatment requires antibiotics prescribed by a doctor. Avoid self-medication.', FR: 'La fièvre typhoïde est causée par la bactérie Salmonella Typhi transmise via des aliments et de l\'eau contaminés. Symptômes : fièvre prolongée, maux de tête, douleurs abdominales, fatigue. Prévention : buvez de l\'eau saine (bouillie ou purifiée), lavez les fruits et légumes, faites cuire les aliments, lavez les mains avant de manger. Le traitement nécessite des antibiotiques prescrits par un médecin.' },
        question: { EN: 'How is typhoid fever mainly spread?', FR: 'Comment la fièvre typhoïde se transmet-elle principalement ?' },
        options: [
          { id: 'A', text: { EN: 'Through mosquito bites.', FR: 'Par les piqûres de moustiques.' } },
          { id: 'B', text: { EN: 'Through contaminated food and water.', FR: 'Par des aliments et de l\'eau contaminés.' } },
          { id: 'C', text: { EN: 'Through physical contact only.', FR: 'Uniquement par contact physique.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Sexually Transmitted Infections (STIs) including HIV/AIDS are preventable. HIV is transmitted through unprotected sex, contaminated blood, and from mother to child. Prevention: use condoms consistently, get tested regularly, avoid sharing needles, know your status. HIV-positive people on antiretroviral treatment can live long, healthy lives. STIs like gonorrhea and chlamydia are curable with antibiotics if treated early.', FR: 'Les Infections Sexuellement Transmissibles (IST) dont le VIH/SIDA sont évitables. Le VIH se transmet par rapports non protégés, sang contaminé, et de mère à enfant. Prévention : utilisez des préservatifs systématiquement, faites-vous dépister régulièrement, évitez le partage de seringues, connaissez votre statut. Les personnes séropositives sous traitement peuvent vivre longtemps et sainement. Les IST comme la gonorrhée se soignent avec des antibiotiques si détectées tôt.' },
        question: { EN: 'How can HIV transmission be prevented during sexual intercourse?', FR: 'Comment prévenir la transmission du VIH lors des rapports sexuels ?' },
        options: [
          { id: 'A', text: { EN: 'By taking vitamins regularly.', FR: 'En prenant des vitamines régulièrement.' } },
          { id: 'B', text: { EN: 'By using condoms consistently.', FR: 'En utilisant des préservatifs de manière systématique.' } },
          { id: 'C', text: { EN: 'By avoiding handshakes.', FR: 'En évitant les poignées de main.' } }
        ],
        correct: 'B'
      }
    ]
  },
  {
    id: 'mental_health',
    icon: <MdPsychology size={22} />,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    title: { EN: 'Mental Health', FR: 'Santé Mentale' },
    desc: { EN: 'Understand stress, anxiety and how to protect your mind.', FR: 'Comprenez le stress, l\'anxiété et comment protéger votre esprit.' },
    badgeLabel: { EN: 'Mind Guardian', FR: 'Gardien Mental' },
    questions: [
      {
        lesson: { EN: 'Mental health is as important as physical health. Common mental health conditions include depression, anxiety, and stress. Signs of depression: persistent sadness, loss of interest, sleep changes, fatigue, difficulty concentrating. In Cameroon, mental health stigma is common — but seeking help is a sign of strength, not weakness. Talk to a doctor, trusted person, or counselor if you feel overwhelmed.', FR: 'La santé mentale est aussi importante que la santé physique. Les troubles mentaux courants incluent la dépression, l\'anxiété et le stress. Signes de dépression : tristesse persistante, perte d\'intérêt, troubles du sommeil, fatigue, difficultés de concentration. Au Cameroun, la stigmatisation est courante — mais chercher de l\'aide est un signe de force. Parlez à un médecin, une personne de confiance ou un conseiller si vous vous sentez dépassé.' },
        question: { EN: 'Which is a common sign of depression?', FR: 'Quel est un signe courant de dépression ?' },
        options: [
          { id: 'A', text: { EN: 'Feeling very energetic and happy all the time.', FR: 'Se sentir très énergique et heureux tout le temps.' } },
          { id: 'B', text: { EN: 'Persistent sadness and loss of interest in daily activities.', FR: 'Tristesse persistante et perte d\'intérêt pour les activités quotidiennes.' } },
          { id: 'C', text: { EN: 'Eating more than usual only.', FR: 'Seulement manger plus que d\'habitude.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Stress is the body\'s response to pressure or threats. Short-term stress can be helpful. Chronic stress damages health — causing headaches, insomnia, digestive issues, and weakened immunity. Healthy stress management: deep breathing (inhale 4s, hold 4s, exhale 4s), regular exercise, adequate sleep (7-8h), social support, limiting screen time, and seeking professional help when needed.', FR: 'Le stress est la réponse du corps à la pression ou aux menaces. Le stress à court terme peut être utile. Le stress chronique nuit à la santé — causant maux de tête, insomnies, troubles digestifs et immunité affaiblie. Gestion saine : respiration profonde (inspirer 4s, bloquer 4s, expirer 4s), exercice régulier, sommeil suffisant (7-8h), soutien social, limiter les écrans, et consulter un professionnel si nécessaire.' },
        question: { EN: 'What is a healthy way to manage chronic stress?', FR: 'Quelle est une façon saine de gérer le stress chronique ?' },
        options: [
          { id: 'A', text: { EN: 'Isolating yourself from others.', FR: 'S\'isoler des autres.' } },
          { id: 'B', text: { EN: 'Deep breathing, exercise, and adequate sleep.', FR: 'Respiration profonde, exercice et sommeil suffisant.' } },
          { id: 'C', text: { EN: 'Drinking alcohol to relax.', FR: 'Boire de l\'alcool pour se détendre.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Sleep is essential for mental and physical health. During sleep, the brain processes memories, repairs tissues, and regulates hormones. Adults need 7-9 hours of quality sleep. Poor sleep increases risk of depression, anxiety, obesity, and heart disease. Good sleep habits: consistent schedule, dark and quiet room, avoid screens 1 hour before bed, no caffeine after 3pm, and short naps (20-30min) if needed.', FR: 'Le sommeil est essentiel pour la santé mentale et physique. Pendant le sommeil, le cerveau traite les mémoires, répare les tissus et régule les hormones. Les adultes ont besoin de 7 à 9 heures de sommeil de qualité. Un mauvais sommeil augmente le risque de dépression, d\'anxiété, d\'obésité et de maladies cardiaques. Bonnes habitudes : horaires réguliers, chambre sombre et calme, pas d\'écrans 1h avant le coucher, pas de caféine après 15h.' },
        question: { EN: 'How many hours of sleep do adults generally need per night?', FR: 'Combien d\'heures de sommeil les adultes ont-ils généralement besoin par nuit ?' },
        options: [
          { id: 'A', text: { EN: '3 to 4 hours', FR: '3 à 4 heures' } },
          { id: 'B', text: { EN: '7 to 9 hours', FR: '7 à 9 heures' } },
          { id: 'C', text: { EN: '12 hours minimum', FR: '12 heures minimum' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Substance abuse — including alcohol, tobacco, and drugs — seriously damages mental and physical health. Alcohol affects the brain, liver, and heart. Tobacco causes lung cancer, stroke, and heart disease. Drug addiction changes brain chemistry. Warning signs of addiction: using more over time, inability to stop, neglecting responsibilities, withdrawal symptoms. Help is available — speak to a doctor or counselor confidentially.', FR: 'L\'abus de substances — alcool, tabac, drogues — nuit gravement à la santé mentale et physique. L\'alcool affecte le cerveau, le foie et le cœur. Le tabac provoque le cancer du poumon, les AVC et maladies cardiaques. La drogue modifie la chimie du cerveau. Signes d\'addiction : consommation croissante, impossibilité d\'arrêter, négligence des responsabilités, sevrage. De l\'aide existe — consultez un médecin ou conseiller en toute confidentialité.' },
        question: { EN: 'Which organ is most directly damaged by excessive alcohol consumption?', FR: 'Quel organe est le plus directement affecté par une consommation excessive d\'alcool ?' },
        options: [
          { id: 'A', text: { EN: 'The lungs', FR: 'Les poumons' } },
          { id: 'B', text: { EN: 'The liver and brain', FR: 'Le foie et le cerveau' } },
          { id: 'C', text: { EN: 'The skin only', FR: 'La peau uniquement' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Social connections are vital for mental health. Loneliness and isolation increase risk of depression and anxiety. Strong social ties improve wellbeing, resilience, and even physical health. Ways to strengthen connections: spend time with family and friends, join community groups, volunteer, limit social media (it can increase isolation despite appearing social), and reach out when you feel alone. Helping others also improves your own mental health.', FR: 'Les liens sociaux sont essentiels pour la santé mentale. La solitude et l\'isolement augmentent le risque de dépression et d\'anxiété. Des liens sociaux forts améliorent le bien-être, la résilience et même la santé physique. Façons de renforcer les liens : passer du temps avec famille et amis, rejoindre des groupes communautaires, faire du bénévolat, limiter les réseaux sociaux (qui peuvent augmenter l\'isolement malgré l\'apparence sociale), et contacter quelqu\'un quand vous vous sentez seul.' },
        question: { EN: 'What is a risk factor for depression related to social life?', FR: 'Quel est un facteur de risque de dépression lié à la vie sociale ?' },
        options: [
          { id: 'A', text: { EN: 'Having too many friends.', FR: 'Avoir trop d\'amis.' } },
          { id: 'B', text: { EN: 'Loneliness and social isolation.', FR: 'La solitude et l\'isolement social.' } },
          { id: 'C', text: { EN: 'Exercising with others.', FR: 'Faire de l\'exercice avec d\'autres personnes.' } }
        ],
        correct: 'B'
      }
    ]
  },
  {
    id: 'fitness',
    icon: <FaRunning size={22} />,
    color: '#f59e0b',
    bg: '#fffbeb',
    title: { EN: 'Physical Fitness', FR: 'Activité Physique' },
    desc: { EN: 'Build healthy exercise habits for a stronger, longer life.', FR: 'Construisez des habitudes d\'exercice saines pour une vie plus longue.' },
    badgeLabel: { EN: 'Fitness Star', FR: 'Étoile Fitness' },
    questions: [
      {
        lesson: { EN: 'The WHO recommends adults get at least 150 minutes of moderate exercise per week (e.g., brisk walking, cycling) or 75 minutes of vigorous exercise (e.g., running, swimming). Exercise reduces risk of heart disease, diabetes, obesity, depression, and certain cancers. Even small amounts help — a 10-minute walk after each meal improves blood sugar control and digestion.', FR: 'L\'OMS recommande aux adultes au moins 150 minutes d\'exercice modéré par semaine (marche rapide, vélo) ou 75 minutes d\'exercice vigoureux (course, natation). L\'exercice réduit le risque de maladies cardiaques, diabète, obésité, dépression et certains cancers. Même de petites quantités aident — une marche de 10 minutes après chaque repas améliore la glycémie et la digestion.' },
        question: { EN: 'How many minutes of moderate exercise per week does the WHO recommend for adults?', FR: 'Combien de minutes d\'exercice modéré par semaine l\'OMS recommande-t-elle aux adultes ?' },
        options: [
          { id: 'A', text: { EN: '30 minutes', FR: '30 minutes' } },
          { id: 'B', text: { EN: '150 minutes', FR: '150 minutes' } },
          { id: 'C', text: { EN: '500 minutes', FR: '500 minutes' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Stretching and flexibility training are often overlooked but essential. Regular stretching: improves posture, reduces muscle tension, prevents injury, increases range of motion, and reduces lower back pain. Stretch after exercise when muscles are warm. Hold each stretch 15-30 seconds without bouncing. Yoga and gentle stretching routines are excellent for all fitness levels, including seniors.', FR: 'Les étirements et la souplesse sont souvent négligés mais essentiels. Les étirements réguliers : améliorent la posture, réduisent les tensions musculaires, préviennent les blessures, augmentent la mobilité et réduisent les douleurs lombaires. Étirez-vous après l\'exercice quand les muscles sont chauds. Maintenez chaque étirement 15 à 30 secondes sans rebondir. Le yoga est excellent pour tous les niveaux.' },
        question: { EN: 'When is the best time to stretch for maximum benefit?', FR: 'Quand est-il préférable de s\'étirer pour un bénéfice maximal ?' },
        options: [
          { id: 'A', text: { EN: 'Before any physical activity when muscles are cold.', FR: 'Avant toute activité quand les muscles sont froids.' } },
          { id: 'B', text: { EN: 'After exercise when muscles are warm.', FR: 'Après l\'exercice quand les muscles sont chauds.' } },
          { id: 'C', text: { EN: 'Only when you feel pain.', FR: 'Seulement quand vous ressentez une douleur.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Sedentary behavior (sitting for long hours) is a major health risk independent of exercise. Sitting for 8+ hours daily increases risk of cardiovascular disease, diabetes, and premature death — even if you exercise regularly. Solutions: stand up every 30-45 minutes, take walking meetings, use stairs instead of lifts, walk during phone calls, do light exercises at your desk, and aim for 8,000-10,000 steps daily.', FR: 'La sédentarité (rester assis longtemps) est un risque majeur indépendant de l\'exercice. Rester assis 8h+ par jour augmente le risque de maladies cardiovasculaires, diabète et décès prématuré — même si vous faites de l\'exercice. Solutions : levez-vous toutes les 30-45 minutes, marchez pendant les réunions téléphoniques, utilisez les escaliers, faites des exercices légers à votre bureau, et visez 8 000 à 10 000 pas par jour.' },
        question: { EN: 'What is a simple way to reduce sedentary behavior at work?', FR: 'Quelle est une façon simple de réduire la sédentarité au travail ?' },
        options: [
          { id: 'A', text: { EN: 'Sit in a more comfortable chair.', FR: 'S\'asseoir dans une chaise plus confortable.' } },
          { id: 'B', text: { EN: 'Stand up and move every 30-45 minutes.', FR: 'Se lever et bouger toutes les 30 à 45 minutes.' } },
          { id: 'C', text: { EN: 'Work from home only.', FR: 'Travailler uniquement depuis chez soi.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Hydration during exercise is critical. Even mild dehydration (1-2% body weight loss) impairs performance, concentration, and mood. Drink water before, during, and after exercise. For intense or long workouts (over 60 min), consider electrolyte drinks. Warning signs of dehydration during exercise: dark urine, dizziness, headache, cramps, and excessive fatigue. Do not wait until you are thirsty.', FR: 'L\'hydratation pendant l\'exercice est critique. Même une légère déshydratation (1 à 2% du poids) affecte les performances, la concentration et l\'humeur. Buvez avant, pendant et après l\'exercice. Pour les efforts intenses (plus de 60 min), des boissons électrolytiques peuvent aider. Signes de déshydratation : urines foncées, vertiges, maux de tête, crampes et fatigue excessive. N\'attendez pas d\'avoir soif.' },
        question: { EN: 'What is an early warning sign of dehydration during exercise?', FR: 'Quel est un signe précoce de déshydratation pendant l\'exercice ?' },
        options: [
          { id: 'A', text: { EN: 'Feeling very strong and focused.', FR: 'Se sentir très fort et concentré.' } },
          { id: 'B', text: { EN: 'Dark urine, dizziness, or muscle cramps.', FR: 'Urines foncées, vertiges ou crampes musculaires.' } },
          { id: 'C', text: { EN: 'Breathing faster than normal.', FR: 'Respirer plus vite que normalement.' } }
        ],
        correct: 'B'
      },
      {
        lesson: { EN: 'Rest and recovery are part of fitness — not a sign of weakness. Muscles grow and repair during rest, not during exercise. Overtraining leads to fatigue, injury, decreased performance, and burnout. Recovery tips: get 7-9 hours of sleep, take rest days between intense sessions, eat protein after workouts (eggs, fish, beans), stretch, and listen to your body. Active recovery (light walking, yoga) on rest days is better than complete inactivity.', FR: 'Le repos et la récupération font partie de la condition physique — pas un signe de faiblesse. Les muscles se développent et se réparent pendant le repos, pas pendant l\'exercice. Le surentraînement mène à la fatigue, aux blessures et à l\'épuisement. Conseils de récupération : 7-9h de sommeil, jours de repos entre les séances intenses, protéines après l\'entraînement (œufs, poisson, haricots), étirements, et écouter son corps. La récupération active (marche légère, yoga) est meilleure que l\'inactivité totale.' },
        question: { EN: 'When do muscles actually grow and repair?', FR: 'Quand les muscles se développent-ils et se réparent-ils réellement ?' },
        options: [
          { id: 'A', text: { EN: 'During intense exercise only.', FR: 'Uniquement pendant l\'exercice intense.' } },
          { id: 'B', text: { EN: 'During rest and sleep after exercise.', FR: 'Pendant le repos et le sommeil après l\'exercice.' } },
          { id: 'C', text: { EN: 'While eating protein.', FR: 'En mangeant des protéines.' } }
        ],
        correct: 'B'
      }
    ]
  }
];

const HealthAcademyModule = ({ lang }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [userProgress, setUserProgress] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [courseFinished, setCourseFinished] = useState(false);

  useEffect(() => {
    const progress = localStorage.getItem('academy_progress_v2');
    if (progress) setUserProgress(JSON.parse(progress));
  }, []);

  const handleStartCourse = (course) => {
    setSelectedCourse(course);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizSuccess(false);
    setScore(0);
    setCourseFinished(false);
  };

  const handleSelectOption = (optId) => {
    if (quizSubmitted) return;
    setSelectedAnswer(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    const isCorrect = selectedAnswer === selectedCourse.questions[currentQ].correct;
    setQuizSuccess(isCorrect);
    setQuizSubmitted(true);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNextQuestion = () => {
    if (currentQ < selectedCourse.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setQuizSubmitted(false);
      setQuizSuccess(false);
    } else {
      setCourseFinished(true);
      const passed = (score + (quizSuccess ? 1 : 0)) >= Math.ceil(selectedCourse.questions.length * 0.6);
      if (passed) {
        const updated = { ...userProgress, [selectedCourse.id]: true };
        setUserProgress(updated);
        localStorage.setItem('academy_progress_v2', JSON.stringify(updated));
      }
    }
  };

  const completedCount = Object.values(userProgress).filter(Boolean).length;
  const totalCourses = COURSES.length;
  const progressPercent = Math.round((completedCount / totalCourses) * 100);
  const finalScore = score + (quizSuccess ? 1 : 0);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: '16px', padding: '24px 28px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ margin: '0 0 6px', color: 'white', fontWeight: 900, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaGraduationCap /> {lang === 'EN' ? 'Health Academy' : 'Académie Santé'}
                </h2>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem' }}>
                  {lang === 'EN' ? '5 courses • 25 questions • Earn badges' : '5 cours • 25 questions • Gagnez des badges'}
                </p>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 20px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white' }}>{progressPercent}%</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{lang === 'EN' ? 'Completed' : 'Complété'}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>

              {/* Courses */}
              <div>
                <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '1rem' }}>
                  {lang === 'EN' ? 'Available Courses' : 'Cours Disponibles'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {COURSES.map(course => {
                    const isCompleted = !!userProgress[course.id];
                    return (
                      <div key={course.id} onClick={() => handleStartCourse(course)} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = course.color; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'none'; }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: course.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: course.color }}>
                          {course.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{course.title[lang]}</span>
                            {isCompleted && (
                              <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '0.6rem', fontWeight: 800, padding: '2px 7px', borderRadius: '20px' }}>
                                {lang === 'EN' ? '✓ Passed' : '✓ Validé'}
                              </span>
                            )}
                          </div>
                          <p style={{ margin: 0, color: '#64748b', fontSize: '0.76rem' }}>{course.desc[lang]}</p>
                          <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
                            {course.questions.length} {lang === 'EN' ? 'questions' : 'questions'}
                          </div>
                        </div>
                        <FaArrowRight size={12} color="#cbd5e1" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress + Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Progress */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaChartBar color="#6366f1" size={14} /> {lang === 'EN' ? 'My Progress' : 'Ma Progression'}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>
                    <span>{lang === 'EN' ? 'Overall Completion' : 'Avancement Global'}</span>
                    <span style={{ color: '#6366f1' }}>{completedCount}/{totalCourses}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ width: progressPercent + '%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '10px', transition: 'width 0.4s' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#1e293b' }}>{totalCourses}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{lang === 'EN' ? 'Total Courses' : 'Cours Totaux'}</div>
                    </div>
                    <div style={{ background: '#f0fdf4', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#16a34a' }}>{completedCount}</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600 }}>{lang === 'EN' ? 'Completed' : 'Terminés'}</div>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                  <h4 style={{ margin: '0 0 14px', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaAward color="#f59e0b" size={14} /> {lang === 'EN' ? 'My Badges' : 'Mes Badges'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {COURSES.slice(0, 3).map(course => {
                      const active = !!userProgress[course.id];
                      return (
                        <div key={course.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: active ? 1 : 0.3 }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: active ? ('linear-gradient(135deg, ' + course.color + ', ' + course.color + '99)') : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', boxShadow: active ? ('0 3px 8px ' + course.color + '40') : 'none' }}>
                            {active ? <FaStar color="white" size={18} /> : <FaLock color="#94a3b8" size={14} />}
                          </div>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#334155', lineHeight: 1.2, textAlign: 'center' }}>{course.badgeLabel[lang]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
                    {COURSES.slice(3).map(course => {
                      const active = !!userProgress[course.id];
                      return (
                        <div key={course.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: active ? 1 : 0.3 }}>
                          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: active ? ('linear-gradient(135deg, ' + course.color + ', ' + course.color + '99)') : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px', boxShadow: active ? ('0 3px 8px ' + course.color + '40') : 'none' }}>
                            {active ? <FaTrophy color="white" size={18} /> : <FaLock color="#94a3b8" size={14} />}
                          </div>
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#334155', lineHeight: 1.2, textAlign: 'center' }}>{course.badgeLabel[lang]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        ) : courseFinished ? (
          // Course finished screen
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: finalScore >= Math.ceil(selectedCourse.questions.length * 0.6) ? 'linear-gradient(135deg, #10b981, #0d9488)' : 'linear-gradient(135deg, #f59e0b, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
              {finalScore >= Math.ceil(selectedCourse.questions.length * 0.6) ? <FaTrophy color="white" size={34} /> : <FaTimes color="white" size={34} />}
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900, color: '#1e293b' }}>
              {finalScore >= Math.ceil(selectedCourse.questions.length * 0.6)
                ? (lang === 'EN' ? 'Course Completed!' : 'Cours Validé !')
                : (lang === 'EN' ? 'Keep Practicing!' : 'Continuez à pratiquer !')}
            </h2>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: finalScore >= Math.ceil(selectedCourse.questions.length * 0.6) ? '#10b981' : '#f59e0b', margin: '12px 0' }}>
              {finalScore}/{selectedCourse.questions.length}
            </div>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginBottom: '28px' }}>
              {finalScore >= Math.ceil(selectedCourse.questions.length * 0.6)
                ? (lang === 'EN' ? 'Congratulations! You earned your badge.' : 'Félicitations ! Vous avez gagné votre badge.')
                : (lang === 'EN' ? 'You need 60% to pass. Try again!' : 'Vous avez besoin de 60% pour valider. Réessayez !')}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => handleStartCourse(selectedCourse)} style={{ padding: '12px 24px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Inter, sans-serif' }}>
                {lang === 'EN' ? 'Retry Course' : 'Réessayer'}
              </button>
              <button onClick={() => setSelectedCourse(null)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Inter, sans-serif' }}>
                {lang === 'EN' ? 'Back to Academy' : "Retour à l'Académie"}
              </button>
            </div>
          </motion.div>

        ) : (
          // Question view
          <motion.div key={"q" + currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

            {/* Course header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <button onClick={() => setSelectedCourse(null)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                <FaArrowLeft size={12} />
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>{selectedCourse.title[lang]}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                  {lang === 'EN' ? 'Question' : 'Question'} {currentQ + 1}/{selectedCourse.questions.length} • {lang === 'EN' ? 'Score:' : 'Score :'} {score}/{currentQ}
                </div>
              </div>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {selectedCourse.questions.map((_, i) => (
                  <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < currentQ ? '#10b981' : i === currentQ ? selectedCourse.color : '#e2e8f0' }} />
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>

              {/* Lesson */}
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: selectedCourse.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedCourse.color, flexShrink: 0 }}>
                    <FaBookReader size={14} />
                  </div>
                  <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 800, fontSize: '0.92rem' }}>
                    {lang === 'EN' ? 'Read before answering' : 'Lisez avant de répondre'}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.75 }}>
                  {selectedCourse.questions[currentQ].lesson[lang]}
                </p>
              </div>

              {/* Quiz */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px' }}>
                <h3 style={{ margin: '0 0 14px', color: '#1e293b', fontSize: '0.92rem', fontWeight: 800 }}>
                  {lang === 'EN' ? 'Question' : 'Question'} {currentQ + 1}
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.86rem', color: '#334155', fontWeight: 600, lineHeight: 1.55 }}>
                  {selectedCourse.questions[currentQ].question[lang]}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {selectedCourse.questions[currentQ].options.map(opt => {
                    let borderClr = '#e2e8f0', bgClr = 'white', textColor = '#1e293b';
                    let rightIcon = null;
                    if (selectedAnswer === opt.id && !quizSubmitted) { borderClr = selectedCourse.color; bgClr = selectedCourse.bg; }
                    if (quizSubmitted) {
                      if (opt.id === selectedCourse.questions[currentQ].correct) { borderClr = '#16a34a'; bgClr = '#f0fdf4'; textColor = '#166534'; rightIcon = <FaCheck color="#16a34a" size={11} />; }
                      else if (selectedAnswer === opt.id) { borderClr = '#ef4444'; bgClr = '#fef2f2'; textColor = '#991b1b'; rightIcon = <FaTimes color="#ef4444" size={11} />; }
                    }
                    return (
                      <div key={opt.id} onClick={() => handleSelectOption(opt.id)} style={{ padding: '10px 14px', background: bgClr, border: '1.5px solid ' + borderClr, borderRadius: '10px', cursor: quizSubmitted ? 'default' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.15s' }}>
                        <span style={{ fontSize: '0.8rem', color: textColor, fontWeight: 500 }}>
                          <strong>{opt.id}.</strong> {opt.text[lang]}
                        </span>
                        {rightIcon}
                      </div>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div style={{ background: quizSuccess ? '#f0fdf4' : '#fef2f2', border: '1px solid ' + (quizSuccess ? '#bbf7d0' : '#fecaca'), borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.78rem', fontWeight: 700, color: quizSuccess ? '#166534' : '#991b1b' }}>
                    {quizSuccess
                      ? (lang === 'EN' ? '✓ Correct! Well done.' : '✓ Correct ! Bien joué.')
                      : (lang === 'EN' ? '✗ Incorrect. Check the green answer.' : '✗ Incorrect. Regardez la bonne réponse en vert.')}
                  </div>
                )}

                {!quizSubmitted ? (
                  <button onClick={handleSubmitAnswer} disabled={!selectedAnswer} style={{ width: '100%', padding: '11px', background: selectedAnswer ? ('linear-gradient(135deg, ' + selectedCourse.color + ', ' + selectedCourse.color + 'cc)') : '#e2e8f0', color: selectedAnswer ? 'white' : '#94a3b8', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.84rem', cursor: selectedAnswer ? 'pointer' : 'not-allowed', fontFamily: 'Inter, sans-serif' }}>
                    {lang === 'EN' ? 'Submit Answer' : 'Valider la réponse'}
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {currentQ < selectedCourse.questions.length - 1
                      ? (lang === 'EN' ? 'Next Question' : 'Question Suivante')
                      : (lang === 'EN' ? 'Finish Course' : 'Terminer le Cours')}
                    <FaArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthAcademyModule;