import React, { useState, useEffect } from 'react';
import { FaTimes, FaBell } from 'react-icons/fa';
import { MdWaterDrop, MdOutlineSanitizer, MdDirectionsWalk, MdOutlineBedtime } from 'react-icons/md';

const DAILY_QUESTIONS = [
    {
        id: 'water',
        icon: <MdWaterDrop size={20} />,
        color: '#3b82f6',
        bg: '#eff6ff',
        text: { EN: 'Have you had a glass of water this morning?', FR: "Avez-vous bu un verre d'eau ce matin ?" }
    },
    {
        id: 'teeth',
        icon: <MdOutlineSanitizer size={20} />,
        color: '#10b981',
        bg: '#f0fdf4',
        text: { EN: 'Don\'t forget to brush your teeth today!', FR: "N'oubliez pas de vous brosser les dents aujourd'hui !" }
    },
    {
        id: 'walk',
        icon: <MdDirectionsWalk size={20} />,
        color: '#f59e0b',
        bg: '#fffbeb',
        text: { EN: 'A short walk today can boost your energy.', FR: "Une courte marche aujourd'hui peut booster votre énergie." }
    },
    {
        id: 'sleep',
        icon: <MdOutlineBedtime size={20} />,
        color: '#8b5cf6',
        bg: '#f5f3ff',
        text: { EN: 'Aim for 7-8 hours of sleep tonight.', FR: "Visez 7 à 8 heures de sommeil cette nuit." }
    },
];

const getTodayKey = () => {
    const today = new Date();
    return `reminder_dismissed_${today.toISOString().split('T')[0]}`;
};

const getQuestionOfTheDay = () => {
    const hour = new Date().getHours();
    const dayIndex = new Date().getDate() % DAILY_QUESTIONS.length;
    const base = DAILY_QUESTIONS[dayIndex];

    // Morning (5am - 11am)
    if (hour >= 5 && hour < 12) {
        return base;
    }
    // Afternoon (12pm - 5pm)
    if (hour >= 12 && hour < 17) {
        return {
            ...base,
            text: {
                EN: 'Good afternoon! Remember to stay hydrated and take a short break.',
                FR: 'Bon après-midi ! Pensez à vous hydrater et à faire une courte pause.'
            }
        };
    }
    // Evening (5pm onwards)
    return {
        ...base,
        text: {
            EN: 'Good evening! Wind down and aim for a restful night of sleep.',
            FR: 'Bonsoir ! Détendez-vous et visez une nuit de sommeil réparatrice.'
        }
    };
};
const DailyRemindersModule = ({ lang }) => {
    const [visible, setVisible] = useState(false);
    const [answered, setAnswered] = useState(false);
    const question = getQuestionOfTheDay();

    useEffect(() => {
        const dismissed = localStorage.getItem(getTodayKey());
        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    const handleDismiss = (didAnswer) => {
        localStorage.setItem(getTodayKey(), 'true');
        setAnswered(didAnswer);
        setTimeout(() => setVisible(false), didAnswer ? 900 : 0);
    };

    if (!visible) return null;

    return (
        <div style={{
            background: question.bg,
            border: `1.5px solid ${question.color}30`,
            borderRadius: '14px',
            padding: '1rem 1.2rem',
            marginBottom: '1.4rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '1rem', flexWrap: 'wrap',
            transition: 'opacity 0.3s'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px', height: '40px', background: 'white',
                    borderRadius: '10px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <span style={{ color: question.color }}>
                        {answered ? <FaBell size={18} /> : question.icon}
                    </span>
                </div>
                <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: question.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {lang === 'EN' ? "Today's Reminder" : 'Rappel du jour'}
                    </div>
                    <div style={{ fontSize: '0.87rem', fontWeight: 600, color: '#1e293b' }}>
                        {answered
                            ? (lang === 'EN' ? 'Great! Keep it up tomorrow.' : 'Très bien ! Continuez demain.')
                            : question.text[lang]}
                    </div>
                </div>
            </div>
            {!answered && (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => handleDismiss(true)}
                        style={{
                            padding: '0.4rem 1rem', background: question.color,
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer'
                        }}>
                        {lang === 'EN' ? 'Yes, done!' : 'Oui, fait !'}
                    </button>
                    <button
                        onClick={() => handleDismiss(false)}
                        style={{
                            width: '32px', height: '32px', background: 'white',
                            border: '1px solid #e2e8f0', borderRadius: '8px',
                            cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', color: '#94a3b8'
                        }}>
                        <FaTimes size={13} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DailyRemindersModule;