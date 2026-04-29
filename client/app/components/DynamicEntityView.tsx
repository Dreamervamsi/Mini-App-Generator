'use client';

import { useState, useEffect } from 'react';
import DataTable from './DataTable';
import DynamicForm from './DynamicForm';
import CSVImporter from './CSVImporter';
import { useTranslation } from '../LocalizationContext';
import { useNotify } from '../NotificationContext';

interface DynamicEntityViewProps {
  entity: any;
}

export default function DynamicEntityView({ entity }: DynamicEntityViewProps) {
  const { t } = useTranslation();
  const { notify } = useNotify();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/data/${entity.slug}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setShowForm(false);
    setShowImporter(false);
    setEditingRecord(null);
  }, [entity.slug]);

  const handleSubmit = async (formData: any) => {
    const isEdit = !!editingRecord;
    const url = isEdit 
      ? `http://localhost:3001/api/data/${entity.slug}/${editingRecord.id}`
      : `http://localhost:3001/api/data/${entity.slug}`;
    
    try {
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        notify(isEdit ? 'Record updated' : 'Record created');
        setShowForm(false);
        setEditingRecord(null);
        fetchData();
      } else {
        const err = await res.json();
        notify(err.error || 'Failed to save', 'error');
      }
    } catch (err) {
      notify('Network error', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const res = await fetch(`http://localhost:3001/api/data/${entity.slug}/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        notify('Record deleted');
        fetchData();
      }
    } catch (err) {
      notify('Failed to delete', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{t(entity.label || entity.slug)}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your {t(entity.label || entity.slug).toLowerCase()} records</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn outline" onClick={() => setShowImporter(!showImporter)}>
             {showImporter ? 'Hide Import' : 'Import CSV'}
          </button>
          {!showForm && (
            <button className="btn primary" onClick={() => setShowForm(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add New
            </button>
          )}
        </div>
      </header>

      {showImporter && (
        <div className="card glass animate-fade-in" style={{ marginBottom: '2rem' }}>
           <CSVImporter target={entity.slug} onImported={fetchData} />
        </div>
      )}

      {showForm ? (
        <div className="card glass animate-fade-in">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            {editingRecord ? `Edit ${t(entity.label || entity.slug)}` : `New ${t(entity.label || entity.slug)}`}
          </h3>
          <DynamicForm 
            fields={entity.fields} 
            initialData={editingRecord}
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingRecord(null); }}
          />
        </div>
      ) : (
        <div className="card glass" style={{ padding: loading ? '4rem' : '0' }}>
          {loading ? (
             <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '3px solid rgba(255,255,255,0.1)', 
                  borderTopColor: 'var(--primary)', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p>Loading Data...</p>
             </div>
          ) : (
            <DataTable 
              columns={entity.fields} 
              data={data} 
              onEdit={(id) => {
                const record = data.find(r => r.id === id);
                setEditingRecord(record);
                setShowForm(true);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
