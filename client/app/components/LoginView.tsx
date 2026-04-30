'use client';

import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNotify } from '../NotificationContext';
import { useTranslation } from '../LocalizationContext';

export default function LoginView() {
  const { login } = useAuth();
  const { notify } = useNotify();
  const { t } = useTranslation();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup ? 'signup' : 'login';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        notify(isSignup ? 'Welcome!' : 'Signed in successfully');
      } else {
        notify(data.error || 'Authentication failed', 'error');
      }
    } catch (err) {
      notify('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh' 
    }}>
      <div className="card glass" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>
          {isSignup ? t({ en: 'Create Account', es: 'Crear Cuenta' }) : t({ en: 'Welcome Back', es: 'Bienvenido de nuevo' })}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
          {isSignup ? 'Join the Superagent ecosystem' : 'Sign in to access your mini app'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button 
            onClick={() => setIsSignup(!isSignup)}
            style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
