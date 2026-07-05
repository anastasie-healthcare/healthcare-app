import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPhoneAlt } from 'react-icons/fa';
import { MdLocalHospital } from 'react-icons/md';
import FirstAidModule from '../components/dashboard/FirstAidModule';

const PublicEmergency = () => {
    const [lang, setLang] = React.useState('EN');

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
            {/* Top bar */}
            <div style={{
                background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #b91c1c 100%)',
                padding: '1.2rem 2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/" style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: 'white', textDecoration: 'none', flexShrink: 0
                    }}>
                        <FaArrowLeft size={15} />
                    </Link>
                    <div style={{
                        width: '38px', height: '38px',
                        background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <MdLocalHospital size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                            {lang === 'EN' ? 'Emergency First Aid Guide' : "Guide de Premiers Secours d'Urgence"}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                            {lang === 'EN' ? 'No account needed — free for everyone' : 'Aucun compte requis — gratuit pour tous'}
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <a href="tel:112" style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'white', color: '#b91c1c',
                        padding: '0.5rem 1rem', borderRadius: '40px',
                        fontWeight: 800, fontSize: '0.82rem', textDecoration: 'none'
                    }}>
                        <FaPhoneAlt size={13} />
                        {lang === 'EN' ? 'Call 112' : 'Appeler le 112'}
                    </a>
                    <button
                        onClick={() => setLang(lang === 'EN' ? 'FR' : 'EN')}
                        style={{
                            background: 'transparent', border: '1.5px solid white',
                            color: 'white', borderRadius: '40px',
                            padding: '0.4rem 1rem', fontWeight: 700,
                            cursor: 'pointer', fontSize: '0.82rem'
                        }}>
                        {lang === 'EN' ? 'FR' : 'EN'}
                    </button>
                </div>
            </div>

            {/* Banner explaining free public access */}
            <div style={{
                background: '#fef2f2', borderBottom: '1px solid #fecaca',
                padding: '0.8rem 2rem', textAlign: 'center'
            }}>
                <span style={{ color: '#991b1b', fontSize: '0.85rem', fontWeight: 600 }}>
                    {lang === 'EN'
                        ? "In a real emergency, call your local emergency number first. This guide helps while help is on the way."
                        : "En cas d'urgence réelle, appelez d'abord les secours. Ce guide vous aide en attendant leur arrivée."}
                </span>
            </div>

            {/* Main content — reuse FirstAidModule */}
            <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
                <FirstAidModule lang={lang} initialEmergency={null} clearInitialEmergency={() => {}} />
            </div>

            {/* Footer CTA */}
            <div style={{
                background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                padding: '2rem', textAlign: 'center', marginTop: '2rem'
            }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>
                    {lang === 'EN' ? 'Want more health features?' : 'Envie de plus de fonctionnalités santé ?'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0 0 1.2rem' }}>
                    {lang === 'EN'
                        ? 'Create a free account to access AI health guidance, doctor consultations and more.'
                        : 'Créez un compte gratuit pour accéder à l\'IA santé, aux consultations médicales et plus.'}
                </p>
                <Link to="/register" style={{
                    display: 'inline-block', background: 'white', color: '#312e81',
                    padding: '0.8rem 2rem', borderRadius: '40px', fontWeight: 800,
                    textDecoration: 'none', fontSize: '0.9rem'
                }}>
                    {lang === 'EN' ? 'Create Free Account' : 'Créer un compte gratuit'}
                </Link>
            </div>
        </div>
    );
};

export default PublicEmergency;