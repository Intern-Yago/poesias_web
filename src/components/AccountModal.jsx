import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { destroyCookie, setCookie } from 'nookies';
import { 
  FiX, FiUser, FiMail, FiBookOpen, FiEdit3, FiLogOut, FiCheck, 
  FiHeart, FiMessageSquare, FiLock, FiTrash2, FiEye, FiRefreshCw 
} from 'react-icons/fi';

export default function AccountModal({ 
  isOpen, 
  onClose, 
  userName, 
  userEmail, 
  onOpenPoetryModal,
  onEditPoetry,
  onDeletePoetry 
}) {
  const [displayName, setDisplayName] = useState(userName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('created'); // 'created' | 'liked' | 'commented'
  const [loading, setLoading] = useState(false);
  const [activityData, setActivityData] = useState({ created: [], liked: [], commented: [] });

  useEffect(() => {
    setDisplayName(userName || '');
  }, [userName]);

  useEffect(() => {
    if (isOpen) {
      fetchUserActivity();
    }
  }, [isOpen]);

  async function fetchUserActivity() {
    setLoading(true);
    try {
      const res = await fetch('/api/user/activity');
      if (res.ok) {
        const data = await res.json();
        setActivityData({
          created: data.created || [],
          liked: data.liked || [],
          commented: data.commented || []
        });
      }
    } catch (err) {
      console.error("Erro ao carregar atividade:", err);
    } finally {
      setLoading(false);
    }
  }

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

  const currentList = activityData[activeTab] || [];

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
        borderRadius: '20px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        padding: '1.8rem',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
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

        {/* Header Profile Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#f5edd6',
            color: '#b8860b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            flexShrink: 0
          }}>
            <FiUser />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: '#3b3028', margin: 0, fontSize: '1.35rem' }}>
              {displayName || userName || 'Meu Perfil'}
            </h2>
            {userEmail && (
              <p style={{ color: '#7a6a5c', fontSize: '0.85rem', margin: '0.2rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <FiMail /> {userEmail}
              </p>
            )}
          </div>
          <button 
            onClick={handleLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#fff5f5',
              color: '#c53030',
              border: '1px solid #feb2b2',
              padding: '0.45rem 0.8rem',
              borderRadius: '16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <FiLogOut /> Sair
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', borderBottom: '2px solid #eae2d6', marginBottom: '1rem', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('created')}
            style={{
              padding: '0.6rem 1rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'created' ? '3px solid #b8860b' : '3px solid transparent',
              color: activeTab === 'created' ? '#b8860b' : '#6b5c50',
              fontWeight: activeTab === 'created' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FiBookOpen /> Minhas Poesias ({activityData.created.length})
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            style={{
              padding: '0.6rem 1rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'liked' ? '3px solid #e63946' : '3px solid transparent',
              color: activeTab === 'liked' ? '#e63946' : '#6b5c50',
              fontWeight: activeTab === 'liked' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FiHeart /> Curtidas ({activityData.liked.length})
          </button>
          <button
            onClick={() => setActiveTab('commented')}
            style={{
              padding: '0.6rem 1rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'commented' ? '3px solid #2b6cb0' : '3px solid transparent',
              color: activeTab === 'commented' ? '#2b6cb0' : '#6b5c50',
              fontWeight: activeTab === 'commented' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FiMessageSquare /> Comentadas ({activityData.commented.length})
          </button>
        </div>

        {/* Tab Content List */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: '220px', maxHeight: '350px', paddingRight: '0.3rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
              <FiRefreshCw className="spin" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
              <p>Carregando publicações...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#faf8f5', borderRadius: '12px', color: '#8c7f73' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>
                {activeTab === 'created' && "Você ainda não publicou nenhuma poesia."}
                {activeTab === 'liked' && "Você ainda não curtiu nenhuma poesia."}
                {activeTab === 'commented' && "Você ainda não comentou em nenhuma poesia."}
              </p>
              {activeTab === 'created' && (
                <Link href="/poeta">
                  <a onClick={onClose} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    marginTop: '0.8rem',
                    backgroundColor: '#b8860b',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}>
                    <FiEdit3 /> Escrever Minha Primeira Poesia
                  </a>
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {currentList.map((poetry) => (
                <div 
                  key={poetry.id} 
                  style={{
                    backgroundColor: '#faf8f5',
                    border: '1px solid #e8e2d5',
                    borderRadius: '12px',
                    padding: '0.85rem 1.1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h4 style={{ margin: 0, fontFamily: 'Georgia, serif', color: '#3b2f25', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {poetry.titulo || 'Sem título'}
                      </h4>
                      {poetry.isPrivate && (
                        <span style={{ fontSize: '0.7rem', backgroundColor: 'rgba(184, 134, 11, 0.15)', color: '#b8860b', border: '1px solid rgba(184, 134, 11, 0.3)', padding: '0.05rem 0.35rem', borderRadius: '6px', fontWeight: 600 }}>
                          🔒 Privada
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, color: '#6b5c50', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      &quot;{poetry.mensagem.slice(0, 70)}...&quot;
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#8c7f73' }}>
                      Por {poetry.autor} • {poetry.likes} curtidas
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenPoetryModal) onOpenPoetryModal(poetry);
                      }}
                      style={{
                        padding: '0.4rem 0.7rem',
                        borderRadius: '8px',
                        border: '1px solid #dcd0c0',
                        backgroundColor: '#ffffff',
                        color: '#5c4b3e',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                      title="Ver poesia"
                    >
                      <FiEye /> Ver
                    </button>

                    {/* Edit button if created tab */}
                    {activeTab === 'created' && onEditPoetry && (
                      <button
                        onClick={() => {
                          onClose();
                          onEditPoetry(poetry);
                        }}
                        style={{
                          padding: '0.4rem 0.7rem',
                          borderRadius: '8px',
                          border: '1px solid #d4af37',
                          backgroundColor: '#fffdf5',
                          color: '#b8860b',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                        title="Editar poesia ou alterar visibilidade"
                      >
                        <FiEdit3 /> Editar
                      </button>
                    )}

                    {/* Delete button if created tab */}
                    {activeTab === 'created' && onDeletePoetry && (
                      <button
                        onClick={() => {
                          onDeletePoetry(poetry.id);
                          setActivityData(prev => ({
                            ...prev,
                            created: prev.created.filter(p => p.id !== poetry.id)
                          }));
                        }}
                        style={{
                          padding: '0.4rem',
                          borderRadius: '8px',
                          border: '1px solid #feb2b2',
                          backgroundColor: '#fff5f5',
                          color: '#c53030',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                        title="Excluir"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer write button */}
        <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/poeta">
            <a onClick={onClose} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: '#b8860b',
              color: '#ffffff',
              padding: '0.55rem 1.1rem',
              borderRadius: '20px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}>
              <FiEdit3 /> Escrever Poesia
            </a>
          </Link>
          <button 
            onClick={onClose}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '20px',
              border: '1px solid #dcd0c0',
              background: '#f8f4ee',
              color: '#5c4b3e',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
