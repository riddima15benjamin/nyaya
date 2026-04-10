import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/chat');
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
        
        // Ensure redirect works post signup
        alert('Welcome! Your account has been created.');
        navigate('/chat');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      minHeight: '80vh',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem'
    }}>
      <div className="animate-fade-in-up" style={{
        backgroundColor: 'var(--color-card)',
        padding: '3rem 4rem',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Logo />
          </div>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p style={{ color: 'rgba(44, 44, 44, 0.7)', fontSize: '1rem' }}>
            {isLogin ? 'Sign in to access our legal tools.' : 'Register to get free legal aid.'}
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fff0f0', 
            border: '1px solid #ffcccc', 
            color: '#d32f2f', 
            borderRadius: '8px', 
            fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
            />
          </div>

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="confirmPassword" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isLogin}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '1rem', padding: '1rem', width: '100%', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

        </form>

        <div style={{ textAlign: 'center', fontSize: '0.95rem', color: 'rgba(44, 44, 44, 0.7)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            style={{ 
              background: 'none', 
              color: 'var(--color-accent)', 
              fontWeight: 600, 
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </div>
  );
}
