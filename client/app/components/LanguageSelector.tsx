'use client';

import { useTranslation } from '../LocalizationContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();

  const langs: { code: any; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Language:</span>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value as any)}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--border)',
          color: 'white',
          borderRadius: '6px',
          padding: '0.25rem 0.5rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {langs.map(l => (
          <option key={l.code} value={l.code} style={{ background: 'var(--surface)' }}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
