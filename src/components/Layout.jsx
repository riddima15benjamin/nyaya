import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Layout() {
  const { user } = useAuth();
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="page-wrapper animate-fade-in-up">
      <header style={{ 
        padding: '1.5rem 0', 
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        backgroundColor: 'var(--color-bg)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/">
            <Logo />
          </Link>
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center', fontFamily: 'var(--font-heading)', fontWeight: 600, color: 'var(--color-primary)' }}>
            <Link to="/chat" state={{ action: 'new_case', ts: Date.now() }} style={{ color: 'var(--color-primary)' }}>New Case</Link>
            <Link to="/resources" style={{ color: 'var(--color-primary)' }}>Resources</Link>
            <Link to="/contact" style={{ color: 'var(--color-primary)' }}>Contact</Link>
            {user ? (
              <button 
                onClick={handleSignOut}
                className="btn-outline"
                style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="btn-primary" style={{ padding: '0.4rem 1.25rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>

      <footer style={{ 
        backgroundColor: 'var(--color-primary)', 
        color: 'var(--color-card)', 
        padding: '4rem 0 2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
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
                <span style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-card)' }}>
                  Nyaya
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>Providing accessible, free legal aid to underprivileged communities when they need it most.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Platform</h4>
                <Link to="/chat" state={{ action: 'new_case', ts: Date.now() }} style={{ color: '#fff', fontSize: '0.95rem', opacity: 0.8 }}>AI Legal Chat</Link>
                <Link to="/resources" style={{ color: '#fff', fontSize: '0.95rem', opacity: 0.8 }}>Legal Resources</Link>
                <Link to="/contact" style={{ color: '#fff', fontSize: '0.95rem', opacity: 0.8 }}>Get in Touch</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ color: 'var(--color-accent)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Organization</h4>
                <Link to="/about" style={{ color: '#fff', fontSize: '0.95rem', opacity: 0.8 }}>About Us</Link>
                <a href="#" style={{ color: '#fff', fontSize: '0.95rem', opacity: 0.8 }}>Privacy Policy</a>
                <a href="#" style={{ color: '#fff', fontSize: '0.95rem', opacity: 0.8 }}>Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Nyaya Legal Aid. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
