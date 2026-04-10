import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, BookOpen, Mail } from 'lucide-react';

export default function Landing() {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background motif */}
        <div style={{
          position: 'absolute',
          top: '27%',
          right: '40%',
          opacity: 0.03,
          transform: 'scale(3.5)',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '820px' }}>
          <h1 className="animate-fade-in-up" style={{
            fontSize: 'max(3rem, 4.5vw)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            color: 'var(--color-primary)'
          }}>
            Everyone Deserves a <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Fair Voice</span>
          </h1>

          <p className="animate-fade-in-up delay-100" style={{
            fontSize: '1.25rem',
            color: 'rgba(44,44,44,0.8)',
            marginBottom: '-2.5rem',
            lineHeight: 1.6,
            maxWidth: '500px',
            margin: '0 auto 4rem auto'
          }}>
            Free, accessible legal help because Justice shouldn’t depend on privilege.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '0 0 6rem 0', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>

            {/* Card 1 */}
            <div className="animate-fade-in-up delay-100" style={{
              backgroundColor: 'var(--color-card)',
              padding: '3rem 2.5rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{
                backgroundColor: 'rgba(201, 168, 76, 0.1)',
                padding: '1.25rem',
                borderRadius: '50%',
                marginBottom: '1.5rem',
                color: 'var(--color-accent)'
              }}>
                <MessageSquare size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Start AI Chat</h3>
              <p style={{ color: 'rgba(44,44,44,0.7)', marginBottom: '2.5rem', flex: 1, fontSize: '1.05rem' }}>
                Discuss your legal issues confidentially with our intelligent legal assistant. Get preliminary guidance instantly.
              </p>
              <Link to="/chat" className="btn-primary" style={{ width: '100%' }}>
                Start Session
              </Link>
            </div>

            {/* Card 2 */}
            <div className="animate-fade-in-up delay-200" style={{
              backgroundColor: 'var(--color-card)',
              padding: '3rem 2.5rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{
                backgroundColor: 'rgba(15, 31, 61, 0.05)',
                padding: '1.25rem',
                borderRadius: '50%',
                marginBottom: '1.5rem',
                color: 'var(--color-primary)'
              }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Free Legal Resources</h3>
              <p style={{ color: 'rgba(44,44,44,0.7)', marginBottom: '2.5rem', flex: 1, fontSize: '1.05rem' }}>
                Access a curated library of plain-language legal documents, rights explanations, and standardized forms.
              </p>
              <Link to="/resources" className="btn-outline" style={{ width: '100%' }}>
                Browse Library
              </Link>
            </div>

            {/* Card 3 */}
            <div className="animate-fade-in-up delay-300" style={{
              backgroundColor: 'var(--color-card)',
              padding: '3rem 2.5rem',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease',
              cursor: 'pointer'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{
                backgroundColor: 'rgba(44, 44, 44, 0.05)',
                padding: '1.25rem',
                borderRadius: '50%',
                marginBottom: '1.5rem',
                color: 'var(--color-text)'
              }}>
                <Mail size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Get in Touch</h3>
              <p style={{ color: 'rgba(44,44,44,0.7)', marginBottom: '2.5rem', flex: 1, fontSize: '1.05rem' }}>
                Need human assistance? Connect with our dedicated network of pro bono lawyers and legal advocates.
              </p>
              <Link to="/contact" className="btn-outline" style={{ width: '100%' }}>
                Contact Us
              </Link>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
