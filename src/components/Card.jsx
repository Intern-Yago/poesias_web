import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiCopy, FiCheck, FiTrash2, FiHeart, FiShare2, FiMessageSquare, FiAlertTriangle } from 'react-icons/fi'
import styles from '../styles/Card.module.css'

export default function Card({ 
  id, 
  date, 
  mensagem, 
  autor, 
  titulo, 
  likes = 0, 
  commentsCount = 0,
  isPrivate = false,
  hasLiked: initialHasLiked = false,
  currentUserName, 
  onDelete, 
  onOpenModal,
  onOpenReportModal,
  onOpenAuthModal 
}) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [likeCount, setLikeCount] = useState(likes || 0)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)

  useEffect(() => {
    setHasLiked(initialHasLiked)
  }, [initialHasLiked])

  const autorSeguro = autor && typeof autor === 'string' && autor.trim().length > 0
    ? autor.trim().charAt(0).toUpperCase() + autor.trim().slice(1)
    : 'Anônimo'

  const tituloSeguro = titulo && typeof titulo === 'string' && titulo.trim().length > 0
    ? titulo.trim()
    : null

  const textoSeguro = mensagem && typeof mensagem === 'string'
    ? mensagem.trim()
    : ''

  const isAuthor = Boolean(
    currentUserName && 
    autor && 
    currentUserName.trim().toLowerCase() === autor.trim().toLowerCase()
  )

  const isLongPoem = textoSeguro.split('\n').length > 5 || textoSeguro.length > 220

  let dateFormatado = ''
  try {
    if (date) {
      const d = new Date(date)
      if (!isNaN(d.getTime())) {
        dateFormatado = d.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      } else if (typeof date === 'string') {
        dateFormatado = date.substr(0, 10).split("-").reverse().join("/")
      }
    }
  } catch (e) {
    dateFormatado = ''
  }

  const handleLike = async (e) => {
    e.stopPropagation()
    const nextHasLiked = !hasLiked
    setHasLiked(nextHasLiked)
    setLikeCount(prev => nextHasLiked ? prev + 1 : Math.max(0, prev - 1))
    try {
      const res = await fetch('/api/poesias/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        const data = await res.json()
        setHasLiked(data.liked)
        setLikeCount(data.likes)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCopy = (e) => {
    e.stopPropagation()
    if (!textoSeguro) return
    const fullText = `${tituloSeguro ? `${tituloSeguro}\n\n` : ''}"${textoSeguro}"\n— ${autorSeguro}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?poesia=${id}` : ''
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
      setTimeout(() => setShared(false), 2000)
    }
  }

  const handleComment = (e) => {
    e.stopPropagation()
    if (onOpenModal) {
      onOpenModal({ id, date, mensagem, autor, titulo, likes: likeCount, commentsCount })
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!id) return
    const confirmed = window.confirm(`Tem certeza que deseja apagar esta poesia?`)
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch('/api/poesias/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Erro ao deletar a poesia.')
        setDeleting(false)
        return
      }

      if (onDelete) {
        onDelete(id)
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor para deletar.')
      setDeleting(false)
    }
  }

  const handleCardClick = () => {
    if (onOpenModal) {
      onOpenModal({ id, date, mensagem, autor, titulo, likes: likeCount, commentsCount })
    }
  }

  return (
    <article className={styles.cardContainer}>
      <div className={styles.poesia}>
        {/* Header */}
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <p className={styles.date}>{dateFormatado}</p>
            {isPrivate && (
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: 'rgba(184, 134, 11, 0.15)',
                color: '#b8860b',
                border: '1px solid rgba(184, 134, 11, 0.3)',
                padding: '0.1rem 0.4rem',
                borderRadius: '6px',
                fontWeight: 600
              }} title="Poesia privada (acessível apenas por link)">
                🔒 Não-Listada
              </span>
            )}
          </div>

          <div className={styles.cardActionBar}>
            {/* Copy button */}
            <button 
              onClick={handleCopy} 
              className={`${styles.iconActionBtn} ${copied ? styles.iconActionBtnSuccess : ''}`}
              title={copied ? "Copiado!" : "Copiar poesia"}
              aria-label="Copiar poesia"
            >
              {copied ? <FiCheck color="#10b981" /> : <FiCopy />}
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className={`${styles.iconActionBtn} ${shared ? styles.iconActionBtnSuccess : ''}`}
              title={shared ? "Link copiado!" : "Compartilhar poesia"}
              aria-label="Compartilhar poesia"
            >
              {shared ? <FiCheck color="#10b981" /> : <FiShare2 />}
            </button>

            {/* Report button */}
            {onOpenReportModal && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onOpenReportModal({ id, date, mensagem, autor, titulo, likes: likeCount, commentsCount })
                }}
                className={`${styles.iconActionBtn} ${styles.iconActionBtnReport}`}
                title="Denunciar poesia"
                aria-label="Denunciar poesia"
              >
                <FiAlertTriangle />
              </button>
            )}

            {/* Delete button (Author only) */}
            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`${styles.iconActionBtn} ${styles.iconActionBtnDelete}`}
                title="Excluir minha poesia"
                aria-label="Excluir minha poesia"
              >
                <FiTrash2 />
              </button>
            )}
          </div>
        </div>

        {/* Title (if present) */}
        {tituloSeguro && (
          <h3 className={styles.cardTitle} onClick={handleCardClick}>
            {tituloSeguro}
          </h3>
        )}

        {/* Quotes Icons */}
        <div className={styles.aspasContainer} onClick={handleCardClick}>
          <Image src='/img/aspas.png' alt="aspas" width="24" height='24' />
          <Image src='/img/aspas.png' alt="aspas" width='24' height='24' className={styles.aspas_reverse} />
        </div>

        {/* Text preview */}
        <div 
          className={`${styles.previewContainer} ${isLongPoem ? styles.previewContainerFade : ''}`}
          onClick={handleCardClick}
        >
          <p className={styles.escrita}>
            {textoSeguro}
          </p>
        </div>

        {/* Read full poetry button */}
        {isLongPoem && (
          <button className={styles.btnReadMore} onClick={handleCardClick}>
            Ler poesia completa →
          </button>
        )}

        {/* Footer */}
        <div className={styles.cardFooter}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Like button */}
            <button 
              onClick={handleLike}
              className={`${styles.actionBtn} ${hasLiked ? styles.likedBtn : ''}`}
              title="Curtir poesia"
            >
              <FiHeart fill={hasLiked ? '#e63946' : 'none'} />
              <span>{likeCount > 0 ? likeCount : 'Curtir'}</span>
            </button>

            {/* Comment button with count / badge feedback */}
            <button 
              onClick={handleComment}
              className={`${styles.actionBtn} ${commentsCount > 0 ? styles.hasCommentsBtn : ''}`}
              title={commentsCount > 0 ? `${commentsCount} comentário${commentsCount > 1 ? 's' : ''}` : "Ver ou adicionar comentários"}
            >
              <FiMessageSquare className={commentsCount > 0 ? styles.commentIconActive : ''} />
              <span>{commentsCount > 0 ? 'Comentários' : 'Comentar'}</span>
              {commentsCount > 0 && (
                <span className={styles.commentBadge}>
                  {commentsCount > 9 ? '9+' : commentsCount}
                </span>
              )}
            </button>
          </div>

          <p className={styles.autoria}>- {autorSeguro}</p>
        </div>
      </div>
    </article>
  )
}