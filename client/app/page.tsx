'use client';

import { useConfig } from './ConfigContext';
import { useAuth } from './AuthContext';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DynamicEntityView from './components/DynamicEntityView';
import LoginView from './components/LoginView';
import { useNotify } from './NotificationContext';
import { useTranslation } from './LocalizationContext';

export default function Home() {
  const { config, loading, refreshConfig } = useConfig();
  const { isAuthenticated, logout, token } = useAuth();
  const { notify } = useNotify();
  const { t } = useTranslation();
  const [jsonInput, setJsonInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [showConfigEditor, setShowConfigEditor] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleDeploy = async (payload?: string) => {
    const data = payload || jsonInput;
    try {
      const parsed = JSON.parse(data);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed),
      });
      if (res.ok) {
        refreshConfig();
        setShowConfigEditor(false);
        setCurrentSlug(null);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Deployment failed'}`);
      }
    } catch (err) {
      alert('Deployment failed. Please check if your input is valid JSON.');
    }
  };

  const handleExportGitHub = async () => {
    setExporting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/export/github`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        notify(data.message);
        console.log('Export structure:', data.structure);
      }
    } catch (err) {
      notify('Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem' }}>
        <div className="loader"></div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Initializing Superagent Runtime...</h2>
        <style jsx>{`.loader { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Auth Guard: If we have a config (app exists), users must log in
  if (config && Object.keys(config).length > 0 && !isAuthenticated) {
    return (
      <main style={{ padding: '2rem' }}>
        <LoginView />
      </main>
    );
  }

  // Show landing page if no config or editor is open
  if ((!config || Object.keys(config).length === 0) || showConfigEditor) {
    return (
      <main style={{ minHeight: '100vh', padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            ✨ Superagent Runtime
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Build Apps with JSON
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: '1.6' }}>
            Paste your structured configuration below to generate a fully working mini application with backend and database.
          </p>
        </header>

        <div className={`card glass animate-fade-in ${isFocused ? 'focused' : ''}`} style={{ width: '100%', padding: '0.5rem', border: isFocused ? '1px solid var(--primary)' : '1px solid var(--border)' }}>
          <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>app-config.json</span>
          </div>
          <textarea
            style={{ width: '100%', height: '300px', padding: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: '14px', outline: 'none', resize: 'none' }}
            placeholder='{ "appName": "My CRM", "entities": [ ... ] }'
            value={jsonInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
             {showConfigEditor && (
                <button className="btn outline" onClick={() => setShowConfigEditor(false)}>Cancel</button>
             )}
             <button className="btn primary" onClick={() => handleDeploy()} disabled={!jsonInput.trim()}>
                Deploy Application
             </button>
          </div>
        </div>
      </main>
    );
  }

  // Generated Dashboard
  const currentEntity = config.entities?.find((e: any) => e.slug === currentSlug);

  return (
    <div className="dashboard-layout">
      <Sidebar currentSlug={currentSlug} onSelectEntity={setCurrentSlug} />
      
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn outline" style={{ fontSize: '0.8rem' }} onClick={handleExportGitHub} disabled={exporting}>
               {exporting ? 'Exporting...' : 'Export to GitHub'}
            </button>
            <button className="btn outline" style={{ fontSize: '0.8rem' }} onClick={() => {
              setJsonInput(JSON.stringify(config, null, 2));
              setShowConfigEditor(true);
            }}>
              Edit Config
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{isAuthenticated ? 'Authenticated' : 'Guest'}</span>
            <button className="btn outline" style={{ fontSize: '0.8rem', color: 'var(--error)' }} onClick={logout}>
              Sign Out
            </button>
          </div>
        </header>

        {currentEntity ? (
          <DynamicEntityView entity={currentEntity} />
        ) : (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome, {isAuthenticated ? 'Admin' : 'User'}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Application: <strong>{t(config.appName)}</strong></p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {config.entities?.map((entity: any) => (
                <div key={entity.slug} className="card glass hover-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSlug(entity.slug)}>
                   <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{t(entity.label || entity.slug)}</h3>
                   <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{entity.fields.length} fields defined</p>
                   <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', gap: '0.5rem' }}>
                     Manage Records
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                     </svg>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .hover-card { transition: all 0.3s; }
        .hover-card:hover { transform: translateY(-5px); border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
      `}</style>
    </div>
  );
}
