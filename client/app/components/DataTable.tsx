'use client';

import React, { useEffect, useState } from 'react';
import CSVImporter from './CSVImporter';

interface DataTableProps {
  dataSource: string;
  fields?: string[];
}

const DataTable: React.FC<DataTableProps> = ({ dataSource, fields }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/data/${dataSource}`);
      const json = await res.json();
      if (Array.isArray(json)) {
        setData(json);
      } else {
        console.error('Expected array but received:', json);
        setData([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataSource]);

  if (loading) return <div className="card">Loading {dataSource}...</div>;

  const headers = fields || (data.length > 0 ? Object.keys(data[0]).filter(k => !['id', 'owner_id', 'created_at', 'created_at'].includes(k)) : []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>{dataSource.charAt(0).toUpperCase() + dataSource.slice(1)}</h3>
      </div>
      <table className="table">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h}>{h.charAt(0).toUpperCase() + h.slice(1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i}>
              {headers.map(h => (
                <td key={h}>{String(row[h])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5, marginTop: '1rem' }}>No data found.</p>}
      
      <CSVImporter target={dataSource} onImported={fetchData} />
    </div>
  );
};

export default DataTable;
