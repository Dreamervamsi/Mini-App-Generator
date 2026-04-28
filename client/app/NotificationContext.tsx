'use client';

import React, { createContext, useContext, useState } from 'react';

type Notification = { id: number; message: string; type: 'success' | 'error' };

const NotificationContext = createContext({
  notify: (message: string, type: 'success' | 'error' = 'success') => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 100 }}>
        {notifications.map(n => (
          <div key={n.id} className="card" style={{ 
            padding: '0.8rem 1.5rem', 
            background: n.type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)',
            border: 'none',
            color: 'white',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
            animation: 'slideIn 0.3s ease'
          }}>
            {n.message}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
