import React from 'react';

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M8 22h8" />
        <path d="M4 6h16" />
        <path d="M4 6l-2 8" />
        <path d="M4 6l2 8" />
        <path d="M2 14c0 1.5 1 2 2 2s2-.5 2-2" />
        <path d="M20 6l-2 8" />
        <path d="M20 6l2 8" />
        <path d="M18 14c0 1.5 1 2 2 2s2-.5 2-2" />
      </svg>
      <span style={{ 
        fontFamily: 'var(--font-heading)', 
        fontStyle: 'italic', 
        fontSize: '1.75rem', 
        fontWeight: '700', 
        color: 'var(--color-primary)' 
      }}>
        Nyaya
      </span>
    </div>
  );
}
