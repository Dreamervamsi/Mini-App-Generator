'use client';

import { useConfig } from './ConfigContext';
import DynamicComponent from './components/Renderer';
import { useState } from 'react';

const DEFAULT_CONFIG = {
  appName: "My Dynamic CRM",
  database: {
    tables: [
      {
        name: "tasks",
        fields: [
          { name: "title", type: "string", required: true },
          { name: "description", type: "text" },
          { name: "priority", type: "number" }
        ]
      }
    ]
  },
  ui: {
    pages: [
      {
        title: "Dashboard",
        path: "/",
        sections: [
          { type: "form", config: { target: "tasks", fields: [{ name: "title", type: "string" }, { name: "description", type: "string" }] } },
          { type: "table", config: { dataSource: "tasks" } }
        ]
      }
    ],
    navigation: [
      { label: "Dashboard", path: "/", icon: "home" }
    ]
  },
  auth: {
    enabled: true,
    allowRegistration: true
  }
};

export default function Home() {
  const { config, loading, refreshConfig } = useConfig();
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEFAULT_CONFIG, null, 2));

  const handleDeploy = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonInput,
      });
      if (res.ok) {
        refreshConfig();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      alert('Deployment failed');
    }
  };

  if (loading) return <div className="container"><h2>Loading Engine...</h2></div>;

  if (!config) {
    return (
      <main>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1>Aether <span style={{ color: 'var(--primary)', opacity: 0.5 }}>Runtime</span></h1>
          <p>No configuration detected. Deploy your first app now.</p>
        </header>

        <div className="card">
          <h3>Deploy App (JSON Config)</h3>
          <textarea
            className="input"
            style={{ minHeight: '300px', fontFamily: 'monospace', fontSize: '14px', marginTop: '1rem' }}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
          />
          <button className="btn" style={{ marginTop: '1.5rem', width: '100%' }} onClick={handleDeploy}>
            Initialize Application Runtime
          </button>
        </div>
      </main>
    );
  }

  const currentPage = config.ui.pages[0]; // Simplified: just show first page

  return (
    <main>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>{config.appName}</h2>
          <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>{currentPage.title}</p>
        </div>
        <button className="btn" onClick={() => { /* logic to reset or update */ }}>Settings</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {currentPage.sections.map((section: any, idx: number) => (
          <div key={idx}>
            <DynamicComponent type={section.type} config={section.config} />
          </div>
        ))}
      </div>
    </main>
  );
}
