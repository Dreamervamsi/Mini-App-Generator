'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../LocalizationContext';

interface DynamicFormProps {
  fields: { name: string; label: string; type: string; required?: boolean }[];
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function DynamicForm({ fields, initialData, onSubmit, onCancel, isSubmitting }: DynamicFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>(initialData || {});

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {fields.map((field) => (
          <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {t(field.label)} {field.required && <span style={{ color: 'var(--error)' }}>*</span>}
            </label>
            
            {field.type === 'boolean' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', height: '42px' }}>
                 <input 
                  type="checkbox" 
                  checked={!!formData[field.name]} 
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem' }}>Enabled</span>
              </div>
            ) : (
              <input
                type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                className="input-focus"
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <button type="button" onClick={onCancel} className="btn outline" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Record' : 'Create Record'}
        </button>
      </div>

      <style jsx>{`
        .input-focus:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </form>
  );
}
