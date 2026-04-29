'use client';

import { useConfig } from '../ConfigContext';
import { useTranslation } from '../LocalizationContext';
import LanguageSelector from './LanguageSelector';

interface SidebarProps {
  currentSlug: string | null;
  onSelectEntity: (slug: string | null) => void;
}

export default function Sidebar({ currentSlug, onSelectEntity }: SidebarProps) {
  const { config } = useConfig();
  const { t } = useTranslation();
  const entities = config?.entities || [];

  return (
    <aside className="glass" style={{ 
      width: '280px', 
      height: '100vh', 
      position: 'sticky', 
      top: 0, 
      display: 'flex', 
      flexDirection: 'column',
      borderRight: '1px solid var(--border)',
      background: 'var(--sidebar)'
    }}>
      <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>
          {t(config?.appName) || 'Superagent Runtime'}
        </h1>
      </div>

      <nav style={{ padding: '1.5rem', flex: 1 }}>
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            paddingLeft: '0.75rem'
          }}>
            Navigation
          </p>
          <ul style={{ listStyle: 'none' }}>
            <li>
              <button 
                onClick={() => onSelectEntity(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: currentSlug === null ? 'var(--primary)' : 'transparent',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: currentSlug === null ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <DashboardIcon />
                {t({ en: 'Dashboard', es: 'Tablero', fr: 'Tableau', de: 'Instrumententafel' })}
              </button>
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em', 
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            paddingLeft: '0.75rem'
          }}>
            Entities
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {entities.map((entity: any) => (
              <li key={entity.slug}>
                <button 
                  onClick={() => onSelectEntity(entity.slug)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: currentSlug === entity.slug ? 'var(--primary)' : 'transparent',
                    color: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: currentSlug === entity.slug ? 600 : 400,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: currentSlug === entity.slug ? 'white' : 'var(--text-muted)' 
                  }}></div>
                  {t(entity.label || entity.slug)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <LanguageSelector />
        <button className="btn outline" style={{ width: '100%', fontSize: '0.8rem' }} onClick={() => window.location.reload()}>
          Config Viewer
        </button>
      </div>
    </aside>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}
