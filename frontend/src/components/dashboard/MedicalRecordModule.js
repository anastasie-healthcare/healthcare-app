import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaTrash, FaDownload, FaFileMedical, 
  FaSearch, FaNotesMedical, FaCheck 
} from 'react-icons/fa';
import { 
  getMedicalRecord, updateMedicalRecord, 
  getMedicalDocuments, createMedicalDocument, 
  deleteMedicalDocument 
} from '../../services/api';

const MedicalRecordModule = ({ lang }) => {
  // Basic record states
  const [allergies, setAllergies] = useState('');
  const [history, setHistory] = useState('');
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordSaved, setRecordSaved] = useState(false);

  // Documents states
  const [documents, setDocuments] = useState([]);
  const [docSearch, setDocSearch] = useState('');
  const [docCategory, setDocCategory] = useState('all');
  const [docsLoading, setDocsLoading] = useState(false);

  // Add document modal/form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', category: 'prescription', date: '', notes: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchRecordData();
    fetchDocumentsData();
  }, []);

  const fetchRecordData = async () => {
    setRecordLoading(true);
    try {
      const response = await getMedicalRecord();
      setAllergies(response.data.allergies || '');
      setHistory(response.data.medical_history || '');
    } catch (err) {
      console.error(err);
    } finally {
      setRecordLoading(false);
    }
  };

  const fetchDocumentsData = async () => {
    setDocsLoading(true);
    try {
      const response = await getMedicalDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    setRecordLoading(true);
    setRecordSaved(false);
    try {
      await updateMedicalRecord({
        allergies: allergies,
        medical_history: history
      });
      setRecordSaved(true);
      setTimeout(() => setRecordSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setRecordLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.date || !selectedFile) {
      setErrorMsg(lang === 'EN' ? 'Please fill all fields and select a file.' : 'Veuillez remplir tous les champs et sélectionner un fichier.');
      return;
    }
    setUploading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('title', newDoc.title);
      formData.append('category', newDoc.category);
      formData.append('date', newDoc.date);
      formData.append('notes', newDoc.notes);
      formData.append('file', selectedFile);

      await createMedicalDocument(formData);
      setNewDoc({ title: '', category: 'prescription', date: '', notes: '' });
      setSelectedFile(null);
      setShowAddForm(false);
      fetchDocumentsData();
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'EN' ? 'Failed to upload document.' : 'Échec du téléchargement du document.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    const confirmText = lang === 'EN' ? 'Are you sure you want to delete this document?' : 'Voulez-vous vraiment supprimer ce document ?';
    if (!window.confirm(confirmText)) return;
    try {
      await deleteMedicalDocument(id);
      fetchDocumentsData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
                          (doc.notes && doc.notes.toLowerCase().includes(docSearch.toLowerCase()));
    const matchesCategory = docCategory === 'all' || doc.category === docCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'prescription', label: lang === 'EN' ? 'Prescription' : 'Ordonnance', color: '#3b82f6' },
    { id: 'analysis', label: lang === 'EN' ? 'Analysis' : 'Analyse', color: '#10b981' },
    { id: 'vaccine', label: lang === 'EN' ? 'Vaccination' : 'Vaccin', color: '#8b5cf6' },
    { id: 'other', label: lang === 'EN' ? 'Other' : 'Autre', color: '#64748b' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '24px', fontFamily: "'Inter', sans-serif" }}>
      
      {/* LEFT COLUMN: BASIC MEDICAL STATS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <form onSubmit={handleSaveRecord} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: '1.05rem', fontWeight: 800 }}>
            🩺 {lang === 'EN' ? 'Clinical Profile' : 'Profil Clinique'}
          </h3>
          
          {/* Allergies */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              ⚠️ {lang === 'EN' ? 'Known Allergies' : 'Allergies Connues'}
            </label>
            <textarea
              value={allergies}
              onChange={e => setAllergies(e.target.value)}
              placeholder={lang === 'EN' ? 'E.g., Penicillin, Peanuts, Pollen...' : 'Ex. Pénicilline, Arachides, Pollen...'}
              style={{
                width: '100%', height: '80px', padding: '10px',
                border: '1.5px solid #cbd5e1', borderRadius: '10px',
                fontSize: '0.85rem', outline: 'none', resize: 'none',
                fontFamily: "'Inter', sans-serif", color: '#1e293b', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Medical History */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              📋 {lang === 'EN' ? 'Medical History' : 'Antécédents Médicaux'}
            </label>
            <textarea
              value={history}
              onChange={e => setHistory(e.target.value)}
              placeholder={lang === 'EN' ? 'E.g., Asthma, Hypertension, Diabetes...' : 'Ex. Asthme, Hypertension, Diabète...'}
              style={{
                width: '100%', height: '140px', padding: '10px',
                border: '1.5px solid #cbd5e1', borderRadius: '10px',
                fontSize: '0.85rem', outline: 'none', resize: 'none',
                fontFamily: "'Inter', sans-serif", color: '#1e293b', boxSizing: 'border-box'
              }}
            />
          </div>

          {recordSaved && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '8px 12px', borderRadius: '10px', fontSize: '0.78rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaCheck /> {lang === 'EN' ? 'Profile saved successfully!' : 'Profil enregistré avec succès !'}
            </div>
          )}

          <button
            type="submit"
            disabled={recordLoading}
            style={{
              width: '100%', padding: '10px',
              background: '#4f46e5', color: 'white',
              border: 'none', borderRadius: '10px',
              fontWeight: 700, fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {recordLoading ? (lang === 'EN' ? 'Saving...' : 'Enregistrement...') : (lang === 'EN' ? 'Save Profile' : 'Enregistrer')}
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: UPLOADED DOCUMENTS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '20px' }}>
          
          {/* Header & Uploader Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.05rem', fontWeight: 800 }}>
              📁 {lang === 'EN' ? 'My Medical Files' : 'Mes Fichiers Médicaux'}
            </h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '8px 14px', background: '#4f46e5',
                color: 'white', border: 'none', borderRadius: '10px',
                fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <FaPlus size={10} />
              {lang === 'EN' ? 'Add Document' : 'Ajouter un Document'}
            </button>
          </div>

          {/* File Upload Form */}
          {showAddForm && (
            <form onSubmit={handleUploadDocument} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
              {errorMsg && (
                <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '10px', fontSize: '0.78rem', marginBottom: '12px' }}>
                  {errorMsg}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    {lang === 'EN' ? 'Document Title' : 'Titre du document'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc.title}
                    onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder={lang === 'EN' ? 'E.g., Lab Blood Test' : 'Ex. Analyse de sang'}
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    {lang === 'EN' ? 'Category' : 'Catégorie'}
                  </label>
                  <select
                    value={newDoc.category}
                    onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    {lang === 'EN' ? 'Date' : 'Date de délivrance'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newDoc.date}
                    onChange={e => setNewDoc({ ...newDoc, date: e.target.value })}
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    {lang === 'EN' ? 'Select File' : 'Sélectionner le fichier'}
                  </label>
                  <input
                    type="file"
                    required
                    onChange={handleFileChange}
                    style={{ width: '100%', fontSize: '0.78rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {lang === 'EN' ? 'Notes' : 'Remarques'}
                </label>
                <input
                  type="text"
                  value={newDoc.notes}
                  onChange={e => setNewDoc({ ...newDoc, notes: e.target.value })}
                  placeholder={lang === 'EN' ? 'E.g., Dr. Davis prescription' : 'Ex. Prescription du Dr. Martin'}
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: '8px 16px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  {lang === 'EN' ? 'Cancel' : 'Annuler'}
                </button>
                <button type="submit" disabled={uploading} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {uploading ? (lang === 'EN' ? 'Uploading...' : 'Envoi...') : (lang === 'EN' ? 'Upload' : 'Télécharger')}
                </button>
              </div>
            </form>
          )}

          {/* Search bar & Category filters */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={13} />
              <input
                type="text"
                value={docSearch}
                onChange={e => setDocSearch(e.target.value)}
                placeholder={lang === 'EN' ? 'Search documents...' : 'Rechercher un fichier...'}
                style={{ width: '100%', padding: '8px 8px 8px 30px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', boxSizing: 'border-box' }}
              />
            </div>
            <select
              value={docCategory}
              onChange={e => setDocCategory(e.target.value)}
              style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '0.82rem', background: 'white' }}
            >
              <option value="all">{lang === 'EN' ? 'All categories' : 'Toutes catégories'}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Files List */}
          {docsLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
              {lang === 'EN' ? 'Loading files...' : 'Chargement des fichiers...'}
            </div>
          ) : filteredDocs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: '#94a3b8', border: '1.5px dashed #e2e8f0', borderRadius: '12px' }}>
              <FaFileMedical size={26} style={{ marginBottom: '10px', color: '#cbd5e1' }} />
              <div style={{ fontSize: '0.82rem' }}>{lang === 'EN' ? 'No documents found.' : 'Aucun document trouvé.'}</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDocs.map(doc => {
                const catObj = categories.find(c => c.id === doc.category) || { label: 'Autre', color: '#64748b' };
                // Build document URL (handle media/ path returned from Django)
                const docUrl = doc.file ? `http://127.0.0.1:8000${doc.file}` : '#';
                
                return (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', border: '1.5px solid #f1f5f9', borderRadius: '12px',
                      background: '#f8fafc'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${catObj.color}15`, color: catObj.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FaNotesMedical size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>{doc.title}</div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: catObj.color }}>{catObj.label}</span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>•</span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{doc.date}</span>
                        </div>
                        {doc.notes && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>{doc.notes}</div>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {doc.file && (
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: '#e0f2fe', color: '#0284c7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          <FaDownload size={12} />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: '#fef2f2', color: '#ef4444', border: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default MedicalRecordModule;
