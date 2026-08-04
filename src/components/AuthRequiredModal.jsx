import { useState } from 'react'
import Link from 'next/link'
import { signIn as signInNext } from 'next-auth/react'
import { setCookie } from 'nookies'
import { FiX, FiUser, FiLock, FiLogIn, FiUserPlus, FiAlertCircle } from 'react-icons/fi'
import { AiOutlineGithub, AiOutlineGoogle } from 'react-icons/ai'

export default function AuthRequiredModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  function handleFormSubmit(e) {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o usuário/e-mail e a senha.')
      return
    }

    setLoading(true)
    const nameFromEmail = email.includes('@') ? email.split('@')[0] : email

    setCookie(undefined, 'token', `user_${Date.now()}`, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    setCookie(undefined, 'user_name', nameFromEmail, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    setCookie(undefined, 'user_email', email, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })

    setLoading(false)
    if (onLoginSuccess) {
      onLoginSuccess({ name: nameFromEmail, email })
    }
    onClose()
  }

  function handleSignInGithub() {
    setCookie(undefined, 'token', `user_${Date.now()}`, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    signInNext('github', { callbackUrl: '/' })
  }

  function handleSignInGoogle() {
    setCookie(undefined, 'token', `user_${Date.now()}`, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    signInNext('google', { callbackUrl: '/' })
  }

  return (
    <div 
      style={{
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
        zIndex: 2000,
        padding: '1rem'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          padding: '2rem',
          position: 'relative',
          animation: 'modalSlide 0.25s ease-out'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
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

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#f5edd6',
            color: '#b8860b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            margin: '0 auto 0.75rem auto'
          }}>
            <FiLogIn />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#3b3028', margin: 0, fontSize: '1.45rem' }}>
            Entre para Comentar
          </h2>
          <p style={{ color: '#7a6a5c', fontSize: '0.9rem', marginTop: '0.4rem', lineHeight: '1.4' }}>
            Faça login na sua conta para deixar comentários e interagir com os versos dos poetas.
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#fde8e8',
            color: '#9b1c1c',
            padding: '0.65rem 0.9rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleFormSubmit} style={{ marginBottom: '1.2rem' }}>
          <div style={{ marginBottom: '0.9rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5c4b3e', marginBottom: '0.3rem' }}>
              Usuário ou E-mail:
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiUser style={{ position: 'absolute', left: '0.8rem', color: '#8c7f73' }} />
              <input 
                type="text" 
                placeholder="Seu usuário ou e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  border: '1px solid #dcd0c0',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#5c4b3e', marginBottom: '0.3rem' }}>
              Senha:
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiLock style={{ position: 'absolute', left: '0.8rem', color: '#8c7f73' }} />
              <input 
                type="password" 
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.8rem 0.65rem 2.4rem',
                  borderRadius: '10px',
                  border: '1px solid #dcd0c0',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#b8860b',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '24px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(184, 134, 11, 0.25)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          margin: '1rem 0',
          color: '#a09080',
          fontSize: '0.8rem'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2d8cb' }}></div>
          <span>ou entre com</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2d8cb' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={handleSignInGithub}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #dcd0c0',
              backgroundColor: '#faf8f5',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: '#4a3b30'
            }}
          >
            <AiOutlineGithub fontSize="1.1rem" /> GitHub
          </button>
          <button 
            onClick={handleSignInGoogle}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #dcd0c0',
              backgroundColor: '#faf8f5',
              cursor: 'pointer',
              fontSize: '0.85rem',
              color: '#4a3b30'
            }}
          >
            <AiOutlineGoogle fontSize="1.1rem" /> Google
          </button>
        </div>

        {/* Textinho logo abaixo de criar conta */}
        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px dashed #e2d8cb',
          fontSize: '0.88rem',
          color: '#6b5c50'
        }}>
          Ainda não tem uma conta?{' '}
          <Link href="/login/criar">
            <a 
              onClick={onClose} 
              style={{
                color: '#b8860b',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <FiUserPlus /> Criar conta agora
            </a>
          </Link>
        </div>

      </div>
    </div>
  )
}
