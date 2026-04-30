'use client';

import React, { useState } from 'react';
import { useNotify } from '../NotificationContext';

interface CSVImporterProps {
  target: string;
  onImported?: () => void;
}

const CSVImporter: React.FC<CSVImporterProps> = ({ target, onImported }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { notify } = useNotify();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const processImport = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const dataRows = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj: any = {};
        headers.forEach((h, i) => obj[h] = values[i]?.trim());
        return obj;
      });

      // Simple bulk import via multiple hits or a bulk endpoint
      // For now, let's just loop (simplified)
      for (const row of dataRows) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/data/${target}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(row),
        });
      }

      notify(`Successfully imported ${dataRows.length} records into ${target}`);
      onImported?.();
    } catch (err) {
      notify('Failed to process CSV', 'error');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.5rem' }}>Import from CSV</label>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input type="file" accept=".csv" onChange={handleFileChange} className="input" style={{ width: 'auto' }} />
        <button className="btn" onClick={processImport} disabled={!file || uploading}>
          {uploading ? 'Processing...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default CSVImporter;
