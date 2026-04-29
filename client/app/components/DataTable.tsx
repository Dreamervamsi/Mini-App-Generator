'use client';

import { useTranslation } from '../LocalizationContext';

interface DataTableProps {
  columns: { name: string; label: string }[];
  data: any[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DataTable({ columns, data, onEdit, onDelete }: DataTableProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div style={{ 
        padding: '4rem', 
        textAlign: 'center', 
        background: 'rgba(255,255,255,0.02)', 
        borderRadius: '16px',
        border: '1px dashed var(--border)'
      }}>
        <p style={{ color: 'var(--text-muted)' }}>No records found. Click "Add New" to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
            {columns.map(col => (
              <th key={col.name} style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {t(col.label)}
              </th>
            ))}
            <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover-row">
              {columns.map(col => (
                <td key={col.name} style={{ padding: '1rem 1.5rem', color: 'var(--text)' }}>
                  {renderCell(row[col.name])}
                </td>
              ))}
              <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => onEdit(row.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '4px' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(row.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '4px' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <style jsx>{`
        .hover-row:hover {
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
}

function renderCell(value: any) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? '✅' : '❌';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
