import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaMapMarkerAlt, FaCopy, FaUserPlus, FaTrash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const SOSModule = ({ lang, setActiveMenu, selectEmergency }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    const savedContacts = localStorage.getItem('emergency_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const saveContacts = (updated) => {
    setContacts(updated);
    localStorage.setItem('emergency_contacts', JSON.stringify(updated));
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;
    const updated = [...contacts, { id: Date.now(), ...newContact }];
    saveContacts(updated);
    setNewContact({ name: '', phone: '' });
    setShowAddContact(false);
  };

  const handleDeleteContact = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    saveContacts(updated);
  };

  const getGeoLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'EN' ? 'Geolocation is not supported by your browser.' : "La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        });
        setLocLoading(false);
      },
      (error) => {
        console.error(error);
        setLocLoading(false);
        alert(lang === 'EN' ? 'Unable to retrieve location.' : 'Impossible de récupérer votre position.');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const copyLocation = () => {
    if (!location) return;
    const text = `SOS! My location: Lat ${location.lat}, Lng ${location.lng}. https://maps.google.com/?q=${location.lat},${location.lng}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const defaultNumbers = [
    { label: lang === 'EN' ? 'Ambulance / SAMU' : 'SAMU / Urgences Médicales', num: '19', desc: '119' },
    { label: lang === 'EN' ? 'Fire Department' : 'Sapeurs-Pompiers', num: '18', desc: '118' },
    { label: lang === 'EN' ? 'Police' : 'Gendarmerie / Police', num: '17', desc: '117' },
    { label: lang === 'EN' ? 'General Emergency' : 'Urgences Générales', num: '112', desc: '112' }
  ];

  return (
    <>
      {/* Floating SOS Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '74px',
          height: '74px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(239, 68, 68, 0.5), 0 0 0 10px rgba(239, 68, 68, 0.15)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          letterSpacing: '1px',
          fontSize: '0.95rem'
        }}
      >
        <span style={{ fontSize: '1.2rem', marginBottom: '1px' }}>⚡</span>
        SOS
      </motion.button>

      {/* Main Overlay Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: '#090d16',
                zIndex: 99999,
                backdropFilter: 'blur(4px)'
              }}
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                maxHeight: '90vh',
                background: '#ffffff',
                borderTopLeftRadius: '32px',
                borderTopRightRadius: '32px',
                boxShadow: '0 -20px 40px rgba(0,0,0,0.15)',
                zIndex: 999999,
                padding: '24px',
                overflowY: 'auto',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#ef4444', fontWeight: 900, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaExclamationTriangle size={24} />
                    {lang === 'EN' ? 'Emergency SOS Panel' : "Panneau d'Urgence SOS"}
                  </h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
                    {lang === 'EN' ? 'Instant access to emergency response' : 'Accès immédiat aux secours et gestes de survie'}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}
                >
                  <MdClose size={22} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                
                {/* 1. Quick Emergency Calls */}
                <div style={{ background: '#fff5f5', border: '1px solid #fee2e2', borderRadius: '20px', padding: '20px' }}>
                  <h3 style={{ margin: '0 0 16px', color: '#991b1b', fontSize: '1.05rem', fontWeight: 800 }}>
                    📞 {lang === 'EN' ? 'Emergency Services' : 'Numéros Spéciaux Secours'}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {defaultNumbers.map((numItem, idx) => (
                      <a
                        key={idx}
                        href={`tel:${numItem.num}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: 'white',
                          border: '1px solid #fee2e2',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          color: '#ef4444',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          boxShadow: '0 2px 6px rgba(239,68,68,0.06)',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>{numItem.label}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>{lang === 'EN' ? 'Local code' : 'Numéro national'} : {numItem.desc}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
                          <FaPhoneAlt size={11} />
                          <span>{numItem.num}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* 2. My Location Tracker */}
                <div style={{ background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 12px', color: '#166534', fontSize: '1.05rem', fontWeight: 800 }}>
                      📍 {lang === 'EN' ? 'My Location Coordinates' : 'Ma Position Géographique'}
                    </h3>
                    <p style={{ margin: '0 0 16px', color: '#475569', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {lang === 'EN' ? 'Share your coordinates with responders. Works offline using satellite GPS.' : 'Partagez vos coordonnées GPS avec les secours. Fonctionne hors ligne.'}
                    </p>
                    
                    {location ? (
                      <div style={{ background: 'white', padding: '14px', borderRadius: '12px', border: '1.5px dashed #bbf7d0', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600, marginBottom: '6px' }}>
                          <span>Latitude: <strong style={{ color: '#16a34a' }}>{location.lat}</strong></span>
                          <span>Longitude: <strong style={{ color: '#16a34a' }}>{location.lng}</strong></span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                          {lang === 'EN' ? 'Obtained via Device GPS' : 'Localisé avec précision par GPS'}
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(255,255,255,0.6)', padding: '24px 12px', borderRadius: '12px', textAlign: 'center', border: '1px solid #dcfce7', marginBottom: '16px', color: '#64748b', fontSize: '0.82rem' }}>
                        {lang === 'EN' ? 'No coordinates loaded.' : 'Coordonnées non chargées.'}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={getGeoLocation}
                      disabled={locLoading}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(22,163,74,0.2)'
                      }}
                    >
                      <FaMapMarkerAlt />
                      {locLoading ? (lang === 'EN' ? 'Locating...' : 'Recherche...') : (lang === 'EN' ? 'Get Location' : 'Me localiser')}
                    </button>
                    {location && (
                      <button
                        onClick={copyLocation}
                        style={{
                          padding: '12px 16px',
                          background: copied ? '#15803d' : 'white',
                          color: copied ? 'white' : '#16a34a',
                          border: '1.5px solid #16a34a',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {copied ? <FaCheck /> : <FaCopy />}
                        {copied ? (lang === 'EN' ? 'Copied!' : 'Copié!') : (lang === 'EN' ? 'Copy Text' : 'Copier')}
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. My Emergency Contacts (localStorage) */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px', gridColumn: 'span 1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, color: '#334155', fontSize: '1.05rem', fontWeight: 800 }}>
                      👥 {lang === 'EN' ? 'Emergency Contacts' : 'Mes Contacts d\'Urgence'}
                    </h3>
                    {contacts.length < 3 && !showAddContact && (
                      <button
                        onClick={() => setShowAddContact(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#4f46e5',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaUserPlus /> {lang === 'EN' ? 'Add' : 'Ajouter'}
                      </button>
                    )}
                  </div>

                  {showAddContact && (
                    <form onSubmit={handleAddContact} style={{ background: 'white', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '12px' }}>
                      <input
                        type="text"
                        placeholder={lang === 'EN' ? 'Contact Name' : 'Nom du Contact'}
                        value={newContact.name}
                        onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '8px', boxSizing: 'border-box' }}
                      />
                      <input
                        type="tel"
                        placeholder={lang === 'EN' ? 'Phone Number' : 'Numéro de Téléphone'}
                        value={newContact.phone}
                        onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '8px', boxSizing: 'border-box' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowAddContact(false)} style={{ padding: '6px 12px', border: 'none', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          {lang === 'EN' ? 'Cancel' : 'Annuler'}
                        </button>
                        <button type="submit" style={{ padding: '6px 12px', border: 'none', background: '#4f46e5', color: 'white', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          {lang === 'EN' ? 'Save' : 'Enregistrer'}
                        </button>
                      </div>
                    </form>
                  )}

                  {contacts.length === 0 ? (
                    <div style={{ background: 'rgba(255,255,255,0.7)', padding: '24px 12px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.8rem' }}>
                      {lang === 'EN' ? 'No emergency contacts added yet.' : "Aucun contact d'urgence enregistré."}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{contact.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{contact.phone}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <a
                              href={`tel:${contact.phone}`}
                              style={{
                                width: '28px',
                                height: '28px',
                                background: '#e0e7ff',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#4f46e5'
                              }}
                            >
                              <FaPhoneAlt size={11} />
                            </a>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              style={{
                                width: '28px',
                                height: '28px',
                                background: '#fef2f2',
                                border: 'none',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ef4444',
                                cursor: 'pointer'
                              }}
                            >
                              <FaTrash size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Survival Guide Navigation Shortcuts */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '1rem', fontWeight: 800 }}>
                  🛡️ {lang === 'EN' ? 'Instant Survival Gestures' : 'Gestes de Survie Immédiats'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[
                    { id: 'choking', en: 'Choking / Suffocation', fr: 'Étouffement / Suffocation' },
                    { id: 'heart', en: 'Cardiac Arrest', fr: 'Arrêt Cardiaque' },
                    { id: 'bleeding', en: 'Severe Bleeding', fr: 'Hémorragie Grave' },
                    { id: 'stroke', en: 'Stroke (AVC)', fr: 'Signes d\'AVC' }
                  ].map((guide) => (
                    <button
                      key={guide.id}
                      onClick={() => {
                        setActiveMenu('emergency');
                        selectEmergency(guide.id);
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '10px 16px',
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      🔥 {lang === 'EN' ? guide.en : guide.fr}
                    </button>
                  ))}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSModule;
