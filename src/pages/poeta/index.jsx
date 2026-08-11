import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'
import { FiArrowLeft, FiSend, FiFeather, FiLock } from 'react-icons/fi'
import styles from '../../styles/Poeta.module.css'

export default function Poeta() {
  const { data: session } = useSession()
  const router = useRouter()

  const [newAutor, setNewAutor] = useState('')
  const [newTitulo, setNewTitulo] = useState('')
  const [newMensagem, setNewMensagem] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (session?.user?.name) {
      setNewAutor(session.user.name)
    } else if (session?.user?.email) {
      setNewAutor(session.user.email.split('@')[0])
    }
  }, [session])
  
  async function handleCreatePoesia(e){
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!newAutor.trim()) {
      setErrorMsg('Por favor, informe seu nome ou pseudônimo.')
      return
    }

    if (!newMensagem.trim()) {
      setErrorMsg('Por favor, escreva o seu poema antes de enviar.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/poesias/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          autor: newAutor.trim(),
          titulo: newTitulo.trim(),
          mensagem: newMensagem.trim(),
          isPrivate
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao publicar a poesia.')
      }

      setSuccessMsg('Sua poesia foi publicada com sucesso!')
      setNewMensagem('')
      setNewTitulo('')
      
      setTimeout(() => {
        router.push('/')
      }, 1200)
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.body_poeta}>
      {/* Navigation Top Bar */}
      <nav className={styles.topNav}>
        <Link href="/">
          <a className={styles.btnBack}>
            <FiArrowLeft /> Voltar para a Página Inicial
          </a>
        </Link>
      </nav>

      <main className={styles.main}>
        <div className={styles.headerTitle}>
          <FiFeather className={styles.featherIcon} />
          <h1>Escreva sua Poesia</h1>
        </div>

        {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}
        {successMsg && <div className={styles.successBox}>{successMsg}</div>}

        <form className={styles.formCard} onSubmit={handleCreatePoesia}>
          <div className={styles.inputGroup}>
            <label htmlFor="autor" className={styles.label}>
              Nome ou Pseudônimo:
            </label>
            <input 
              type="text" 
              name="autor" 
              id="autor" 
              required 
              maxLength={100}
              placeholder="Ex: Cecília Meireles"
              value={newAutor}
              className={styles.inputName} 
              autoFocus 
              onChange={e => setNewAutor(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="titulo" className={styles.label}>
              Título da Poesia (Opcional):
            </label>
            <input 
              type="text" 
              name="titulo" 
              id="titulo" 
              maxLength={150}
              placeholder="Ex: Amor é um fogo que arde sem se ver..."
              value={newTitulo}
              className={styles.inputName} 
              onChange={e => setNewTitulo(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="poesia" className={styles.label}>
              Seu Poema:
            </label>
            <textarea 
              id="poesia" 
              name="poesia" 
              required
              maxLength={3000}
              placeholder="Escreva seus versos aqui..."
              value={newMensagem}
              className={styles.textarea} 
              onChange={e => setNewMensagem(e.target.value)}
            ></textarea>
            <div className={styles.charCounter}>
              {newMensagem.length} / 3000 caracteres
            </div>
          </div>

          {/* Private / Unlisted toggle */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: isPrivate ? 'rgba(184, 134, 11, 0.08)' : 'rgba(0, 0, 0, 0.02)',
              border: isPrivate ? '1px solid rgba(184, 134, 11, 0.35)' : '1px solid rgba(0, 0, 0, 0.08)',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setIsPrivate(!isPrivate)}
          >
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: '0.2rem', accentColor: '#b8860b', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <label htmlFor="isPrivate" style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4a3b30', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <FiLock color="#b8860b" /> Poesia Não-Listada / Privada
              </label>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#7a6a5c', lineHeight: '1.45' }}>
                Sua poesia não aparecerá na lista pública da página inicial. Apenas pessoas com o link direto (ex: <code>/?poesia=ID</code>) poderão visualizar.
              </p>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link href="/">
              <a className={styles.btnCancel}>Cancelar</a>
            </Link>
            <button className={styles.btnSubmit} type="submit" disabled={loading}>
              <FiSend /> {loading ? 'Publicando...' : 'Publicar Poesia'}
            </button>            
          </div>
        </form>
      </main>

      <aside className={`${styles.birds} ${styles.aside}`} >
        <Image src="/img/birds.png" alt="pássaros" width='140' height='140'/>
      </aside>

      <aside className={`${styles.casal} ${styles.aside}`} >
        <Image src="/img/casal.png" alt="casal" width='140' height='140'/>
      </aside>

      <footer className={styles.footer} > 
      </footer>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  try {
    const session = await getSession(ctx)
    const cookies = ctx.req.cookies || {}

    if (!session && !cookies.token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    }
  } catch (e) {}

  return {
    props: {}
  }
}

