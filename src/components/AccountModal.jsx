import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { destroyCookie, setCookie } from 'nookies';
import { FiX, FiUser, FiMail, FiBookOpen, FiEdit3, FiLogOut, FiCheck } from 'react-icons/fi';

export default function AccountModal({ isOpen, onClose, userName, userEmail, userPoesiasCount = 0, onFilterMyPoesias }) {
  const [displayName, setDisplayName] = useState(userName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setDisplayName(userName || '');
  }, [userName]);

  if (!isOpen) return null;

  function handleSaveName(e) {
    e.preventDefault();
    if (!displayName.trim()) return;

    setCookie(undefined, 'user_name', displayName.trim(), {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  }

  function handleLogout() {
    destroyCookie(undefined, 'token', { path: '/' });
    destroyCookie(undefined, 'user_name', { path: '/' });
    destroyCookie(undefined, 'user_email', { path: '/' });
    signOut({ callbackUrl: '/' });
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        padding: '2rem',
        position: 'relative',
        animation: 'modalSlide 0.25s ease-out'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            fontSize: '1.4rem',
            color: '#8c7f73',
            cursor: 'pointer'
          }}
          title="Fechar"
        >
          <FiX />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f5edd6',
            color: '#b8860b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            margin: '0 auto 0.75rem auto'
          }}>
            <FiUser />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#3b3028', margin: 0, fontSize: '1.5rem' }}>
            Minha Conta
          </h2>
          <p style={{ color: '#7a6a5c', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Gerencie seu perfil e suas publicações
          </p>
        </div>

        {/* Saved feedback */}
        {savedSuccess && (
          <div style={{
            backgroundColor: '#def7ec',
            color: '#03543f',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiCheck /> Pseudônimo atualizado com sucesso!
          </div>
        )}

        {/* User Info Form */}
        <form onSubmit={handleSaveName} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#5c4b3e', marginBottom: '0.3rem' }}>
              Nome de Autor / Pseudônimo:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #dcd0c0',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: '#b8860b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0 1rem',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Salvar
              </button>
            </div>
          </div>

          {userEmail && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#5c4b3e', marginBottom: '0.3rem' }}>
                E-mail da Conta:
              </label>
              <div style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                backgroundColor: '#f8f6f0',
                border: '1px solid #e5dec9',
                color: '#6b5c50',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FiMail /> {userEmail}
              </div>
            </div>
          )}
        </form>

        {/* Quick Stats & Actions */}
        <div style={{
          backgroundColor: '#faf6ee',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ display: 'block', fontSize: '0.8rem', color: '#8c7f73' }}>Suas Poesias Publicadas</span>
            <strong style={{ fontSize: '1.3rem', color: '#4a3b30' }}>{userPoesiasCount} poesias</strong>
          </div>
          <button 
            onClick={() => {
              if (onFilterMyPoesias) onFilterMyPoesias(displayName || userName);
              onClose();
            }}
            style={{
              backgroundColor: '#5c4b3e',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FiBookOpen /> Ver Meus Posts
          </button>
        </div>

        {/* Modal Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link href="/poeta">
            <a onClick={onClose} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#b8860b',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: '10px',
              fontWeight: 600,
              textDecoration: 'none',
              textAlign: 'center'
            }}>
              <FiEdit3 /> Escrever Nova Poesia
            </a>
          </Link>

          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: '#fff',
              color: '#c53030',
              border: '1px solid #feb2b2',
              padding: '0.7rem',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <FiLogOut /> Encerrar Sessão / Sair
          </button>
        </div>

      </div>
    </div>
  );
}
