import { useState } from 'react'
import Image from 'next/image'
import { FiCopy, FiCheck } from 'react-icons/fi'
import styles from '../styles/Card.module.css'

export default function Card({ date, mensagem, autor }) {
  const [copied, setCopied] = useState(false)

  const autorSeguro = autor && typeof autor === 'string' && autor.trim() 
    ? autor.trim().charAt(0).toUpperCase() + autor.trim().slice(1)
    : 'Autor Anônimo'

  const textoSeguro = mensagem && typeof mensagem === 'string'
    ? mensagem.trim()
    : ''

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

  return (
    <article className={styles.cardContainer}>
      <div className={styles.poesiaCard}>
        <div className={styles.cardHeader}>
          <span className={styles.date}>{dateFormatado}</span>
          <button 
            onClick={handleCopy} 
            className={styles.copyBtn} 
            title="Copiar poesia"
            aria-label="Copiar poesia"
          >
            {copied ? <FiCheck className={styles.checkIcon} /> : <FiCopy />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        <div className={styles.quoteDecoration}>
          <span className={styles.quoteMark}>“</span>
        </div>

        <div className={styles.escrita}>
          {textoSeguro}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.authorBadge}>
            <p className={styles.autoria}>— {autorSeguro}</p>
          </div>
        </div>
      </div>
    </article>
  )
}