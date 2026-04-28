'use client';

import React from 'react';
import DataTable from './DataTable';
import AutoForm from './AutoForm';

const ComponentRegistry: Record<string, React.FC<any>> = {
  table: DataTable,
  form: AutoForm,
  // Add more as needed
};

interface RendererProps {
  type: string;
  config: any;
}

const DynamicComponent: React.FC<RendererProps> = ({ type, config }) => {
  const Component = ComponentRegistry[type];

  if (!Component) {
    return (
      <div className="card" style={{ border: '1px dashed #f44' }}>
        <p>⚠️ Unknown Component Type: <strong>{type}</strong></p>
      </div>
    );
  }

  return <Component {...config} />;
};

export default DynamicComponent;
