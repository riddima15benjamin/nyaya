import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function ComingSoon() {
  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div className="animate-fade-in-up" style={{
        backgroundColor: 'var(--color-card)',
        padding: '4rem 3rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '500px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <Logo />
        
        <div>
          <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>Coming Soon</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(44, 44, 44, 0.7)' }}>
            We're working hard to bring this feature to you. Check back shortly for updates on our legal aid tools.
          </p>
        </div>
        
        <Link to="/" className="btn-primary" style={{ marginTop: '1rem' }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
