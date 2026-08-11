import { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  FiX, FiHeart, FiShare2, FiCopy, FiCheck, 
  FiMessageSquare, FiSend, FiTrash2, FiCalendar, FiUser, FiAlertTriangle 
} from 'react-icons/fi'

export default function PoemModal({
  isOpen,
  onClose,
  poetry,
  activeUser,
  onDelete,
  onOpenReportModal,
  onOpenAuthModal
}) {
  const [likes, setLikes] = useState(poetry?.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Comments state
  const [comments, setComments] = useState([])
  const [newCommentText, setNewCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (poetry?.id) {
      setLikes(poetry.likes || 0)
      setHasLiked(false)
      
      setLoadingComments(true)
      fetch(`/api/poesias/comments?poetryId=${poetry.id}`)
        .then(res => res.ok ? res.json() : { comments: [] })
        .then(data => setComments(data.comments || []))
        .catch(console.error)
        .finally(() => setLoadingComments(false))
    }
  }, [poetry])

  if (!isOpen || !poetry) return null

  const autorSeguro = poetry.autor && typeof poetry.autor === 'string' && poetry.autor.trim().length > 0
    ? poetry.autor.trim().charAt(0).toUpperCase() + poetry.autor.trim().slice(1)
    : 'Anônimo'

  const tituloSeguro = poetry.titulo && typeof poetry.titulo === 'string' && poetry.titulo.trim().length > 0
    ? poetry.titulo.trim()
    : null

  const textoSeguro = poetry.mensagem || ''

  const isAuthor = Boolean(
    activeUser && 
    poetry.autor && 
    activeUser.name?.trim().toLowerCase() === poetry.autor.trim().toLowerCase()
  )

  let dateFormatado = ''
  try {
    if (poetry.date) {
      const d = new Date(poetry.date)
      if (!isNaN(d.getTime())) {
        dateFormatado = d.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      }
    }
  } catch (e) {}

  async function fetchComments() {
    if (!poetry?.id) return
    setLoadingComments(true)
    try {
      const res = await fetch(`/api/poesias/comments?poetryId=${poetry.id}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingComments(false)
    }
  }

  async function handleLike() {
    if (hasLiked) return
    setHasLiked(true)
    setLikes(prev => prev + 1)
    try {
      await fetch('/api/poesias/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: poetry.id })
      })
    } catch (e) {
      console.error(e)
    }
  }

  function handleCopy() {
    if (!textoSeguro) return
    const textToCopy = `${tituloSeguro ? `${tituloSeguro}\n\n` : ''}"${textoSeguro}"\n— ${autorSeguro}`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleShare() {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?poesia=${poetry.id}` : ''
    const shareTitle = tituloSeguro || `Poesia de ${autorSeguro}`
    
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        text: `Confira esta poesia de ${autorSeguro}: "${textoSeguro.slice(0, 80)}..."`,
        url: shareUrl
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareUrl)
      setShared(true)
      setTimeout(() => setShared(false), 2500)
    }
  }

  async function handleDelete() {
    if (!poetry.id) return
    const confirmed = window.confirm('Tem certeza que deseja excluir esta poesia?')
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch('/api/poesias/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: poetry.id })
      })
      if (res.ok) {
        if (onDelete) onDelete(poetry.id)
        onClose()
      } else {
        alert('Erro ao apagar poesia.')
      }
    } catch (err) {
      alert('Erro na conexão com o servidor.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault()
    if (!newCommentText.trim()) return

    // If user is NOT logged in, open Auth Modal!
    if (!activeUser) {
      onOpenAuthModal()
      return
    }

    setSubmittingComment(true)
    try {
      const res = await fetch('/api/poesias/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poetryId: poetry.id,
          autor: activeUser.name,
          texto: newCommentText.trim()
        })
      })

      const data = await res.json()
      if (res.ok && data.comment) {
        setComments(prev => [...prev, data.comment])
        setNewCommentText('')
      } else {
        alert(data.error || 'Erro ao enviar comentário.')
      }
    } catch (e) {
      alert('Erro ao enviar comentário.')
    } finally {
      setSubmittingComment(false)
    }
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1500,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#faf7f2',
          borderRadius: '20px',
          maxWidth: '720px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'modalSlide 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.2rem 1.8rem',
          borderBottom: '1px solid #e8decb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8c7a6b', fontSize: '0.85rem' }}>
            <FiCalendar /> <span>{dateFormatado}</span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#6b5c50',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Fechar modal"
          >
            <FiX />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          padding: '2rem 2.2rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* Quotes visual */}
          <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.5, marginBottom: '0.5rem' }}>
            <Image src="/img/aspas.png" alt="aspas" width="32" height="32" />
            <Image src="/img/aspas.png" alt="aspas" width="32" height="32" style={{ transform: 'scaleX(-1) scaleY(-1)' }} />
          </div>

          {/* Title */}
          {tituloSeguro && (
            <h2 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.8rem',
              color: '#3b2f25',
              margin: '0 0 1.2rem 0',
              textAlign: 'center',
              fontWeight: '700',
              lineHeight: '1.3'
            }}>
              {tituloSeguro}
            </h2>
          )}

          {/* Poem Body */}
          <div style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: '1.2rem',
            lineHeight: '1.95',
            color: '#2a221b',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginBottom: '1.8rem',
            textAlign: poetry.mensagem.length < 250 ? 'center' : 'left'
          }}>
            {textoSeguro}
          </div>

          {/* Author */}
          <div style={{
            textAlign: 'right',
            borderTop: '1px dashed #e0d2c0',
            paddingTop: '1rem',
            marginBottom: '1.8rem'
          }}>
            <span style={{
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: '#5c493a'
            }}>
              — {autorSeguro}
            </span>
          </div>

          {/* Actions Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            padding: '0.8rem 1.2rem',
            borderRadius: '16px',
            border: '1px solid #e6dccb',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {/* Like button */}
              <button 
                onClick={handleLike}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backgroundColor: hasLiked ? '#fff0f3' : '#f5edd6',
                  border: `1px solid ${hasLiked ? '#ffb3c1' : '#e2d3b4'}`,
                  color: hasLiked ? '#e63946' : '#5c4838',
                  padding: '0.45rem 0.96rem',
                  borderRadius: '20px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FiHeart fill={hasLiked ? '#e63946' : 'none'} />
                <span>{likes > 0 ? likes : ''} Curtir</span>
              </button>

              {/* Share button */}
              <button 
                onClick={handleShare}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#f5f1eb',
                  border: '1px solid #dfd4c5',
                  color: '#5c4838',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '20px',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <FiShare2 /> <span>{shared ? 'Link Copiado!' : 'Compartilhar'}</span>
              </button>

              {/* Copy button */}
              <button 
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#f5f1eb',
                  border: '1px solid #dfd4c5',
                  color: '#5c4838',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '20px',
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                {copied ? <FiCheck color="#2e7d32" /> : <FiCopy />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>

              {/* Report button */}
              {onOpenReportModal && (
                <button
                  onClick={() => {
                    onOpenReportModal(poetry)
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#fff5f5',
                    border: '1px solid #fed7d7',
                    color: '#c53030',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '20px',
                    fontWeight: 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                  title="Denunciar poesia"
                >
                  <FiAlertTriangle /> <span>Denunciar</span>
                </button>
              )}
            </div>

            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #feb2b2',
                  color: '#c53030',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '20px',
                  fontWeight: 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <FiTrash2 /> <span>{deleting ? 'Apagando...' : 'Excluir'}</span>
              </button>
            )}
          </div>

          {/* Comments Section */}
          <div style={{
            borderTop: '2px solid #eae2d6',
            paddingTop: '1.5rem'
          }}>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1.2rem',
              color: '#3b2f25',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FiMessageSquare color="#b8860b" /> Comentários ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <textarea 
                  rows={3}
                  placeholder={
                    activeUser 
                      ? `Escreva um comentário como "${activeUser.name}"...`
                      : "Faça login para escrever um comentário..."
                  }
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onClick={() => {
                    if (!activeUser) {
                      onOpenAuthModal()
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #dcd0c0',
                    fontSize: '0.92rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                {!activeUser && (
                  <span style={{ fontSize: '0.82rem', color: '#8c7f73' }}>
                    É preciso estar logado para comentar.
                  </span>
                )}
                {activeUser && <span />}

                <button
                  type="submit"
                  disabled={submittingComment}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#b8860b',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.55rem 1.2rem',
                    borderRadius: '20px',
                    fontWeight: '600',
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(184, 134, 11, 0.2)'
                  }}
                >
                  <FiSend /> {submittingComment ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>

            {/* Comments List */}
            {loadingComments ? (
              <p style={{ color: '#8c7f73', fontSize: '0.9rem' }}>Carregando comentários...</p>
            ) : comments.length === 0 ? (
              <p style={{ color: '#8c7f73', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Nenhum comentário ainda. Seja o primeiro a comentar!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {comments.map((c) => (
                  <div key={c.id || Math.random()} style={{
                    backgroundColor: '#ffffff',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '12px',
                    border: '1px solid #e8dfd1'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#4a3b30', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <FiUser color="#b8860b" fontSize="0.85rem" /> {c.autor}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#9c8c7c' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : ''}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#332b25', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                      {c.texto}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
