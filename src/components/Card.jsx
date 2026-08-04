import { useState } from 'react'
import Image from 'next/image'
import { FiCopy, FiCheck, FiTrash2 } from 'react-icons/fi'
import styles from '../styles/Card.module.css'

export default function Card({ id, date, mensagem, autor, currentUserName, onDelete }) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const autorSeguro = autor && typeof autor === 'string' && autor.trim().length > 0
    ? autor.trim().charAt(0).toUpperCase() + autor.trim().slice(1)
    : 'Anônimo'

  const textoSeguro = mensagem && typeof mensagem === 'string'
    ? mensagem.trim()
    : ''

  // Permission check: compare active logged-in user name with poetry author
  const isAuthor = Boolean(
    currentUserName && 
    autor && 
    currentUserName.trim().toLowerCase() === autor.trim().toLowerCase()
  )

  let dateFormatado = ''
  try {
    if (date) {
      const d = new Date(date)
      if (!isNaN(d.getTime())) {
        dateFormatado = d.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      } else if (typeof date === 'string') {
        dateFormatado = date.substr(0, 10).split("-").reverse().join("/")
      }
    }
  } catch (e) {
    dateFormatado = ''
  }

  const handleCopy = () => {
    if (!textoSeguro) return
    const fullText = `"${textoSeguro}"\n— ${autorSeguro}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
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

  return (
    <article className={styles.cardContainer}>
      <div className={styles.poesia}>
        <div className={styles.cardHeader}>
          <p className={styles.date}>{dateFormatado}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={handleCopy} 
              className={styles.copyBtn} 
              title="Copiar poesia"
              aria-label="Copiar poesia"
            >
              {copied ? <FiCheck className={styles.checkIcon} /> : <FiCopy />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={styles.copyBtn}
                style={{
                  color: '#c53030',
                  borderColor: '#feb2b2',
                  backgroundColor: '#fff5f5'
                }}
                title="Excluir minha poesia"
                aria-label="Excluir minha poesia"
              >
                <FiTrash2 />
                <span>{deleting ? 'Apagando...' : 'Excluir'}</span>
              </button>
            )}
          </div>
        </div>

        <div className={styles.aspasContainer}>
          <Image src='/img/aspas.png' alt="aspas" width="28" height='28' />
          <Image src='/img/aspas.png' alt="aspas" width='28' height='28' className={styles.aspas_reverse} />
        </div>

        <p className={styles.escrita}>
          {textoSeguro}
        </p>

        <div className={styles.cardFooter}>
          <p className={styles.autoria}>- {autorSeguro}</p>
        </div>
      </div>
    </article>
  )
}