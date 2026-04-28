'use client';

import React, { useState } from 'react';

interface AutoFormProps {
  target: string;
  fields: { name: string; type: string; label?: string }[];
  onSuccess?: () => void;
}

const AutoForm: React.FC<AutoFormProps> = ({ target, fields, onSuccess }) => {
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/data/${target}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({});
        onSuccess?.();
        alert('Success!');
      }
    } catch (err) {
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">
      <h3>Add New {target}</h3>
      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label>{field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1)}</label>
            <input
              className="input"
              type={field.type === 'number' ? 'number' : 'text'}
              value={formData[field.name] || ''}
              onChange={e => handleChange(field.name, e.target.value)}
              required
            />
          </div>
        ))}
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default AutoForm;
