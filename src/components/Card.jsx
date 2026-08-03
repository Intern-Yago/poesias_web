import { useState } from 'react'
import Image from 'next/image'
import { FiCopy, FiCheck } from 'react-icons/fi'
import styles from '../styles/Card.module.css'

export default function Card({ date, mensagem, autor }) {
  const [copied, setCopied] = useState(false)

  const autorSeguro = autor && typeof autor === 'string' && autor.trim().length > 0
    ? autor.trim().charAt(0).toUpperCase() + autor.trim().slice(1)
    : 'Anônimo'

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

  return (
    <article className={styles.cardContainer}>
      <div className={styles.poesia}>
        <div className={styles.cardHeader}>
          <p className={styles.date}>{dateFormatado}</p>
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