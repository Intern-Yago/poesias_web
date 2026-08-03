import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'
import Link from 'next/link'
import { FiArrowLeft, FiSend, FiFeather } from 'react-icons/fi'
import styles from '../../styles/Poeta.module.css'

export default function Poeta() {
  const { data: session } = useSession()
  const router = useRouter()

  const [autor, setAutor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (session?.user?.name) {
      setAutor(session.user.name)
    } else if (session?.user?.email) {
      setAutor(session.user.email.split('@')[0])
    }
  }, [session])

  async function handleCreatePoesia(e) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!autor.trim()) {
      setErrorMsg('Por favor, informe seu nome de autor.')
      return
    }

    if (!mensagem.trim()) {
      setErrorMsg('Por favor, escreva a sua poesia antes de enviar.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/poesias/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          autor: autor.trim(),
          mensagem: mensagem.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao publicar a poesia.')
      }

      setSuccessMsg('Sua poesia foi publicada com sucesso!')
      setMensagem('')
      
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.body_poeta}>
      <header className={styles.topNav}>
        <Link href="/">
          <a className={styles.backBtn}>
            <FiArrowLeft /> Voltar ao Início
          </a>
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.cardBox}>
          <div className={styles.titleGroup}>
            <FiFeather className={styles.featherIcon} />
            <h1>Inspire o Mundo</h1>
            <p className={styles.subtitle}>Compartilhe sua versos, sentimentos e pensamentos</p>
          </div>

          {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}
          {successMsg && <div className={styles.successBox}>{successMsg}</div>}

          <form className={styles.form} onSubmit={handleCreatePoesia}>
            <div className={styles.campo}>
              <label htmlFor="autor" className={styles.label}>
                Nome ou Pseudônimo:
              </label>
              <input
                type="text"
                name="autor"
                id="autor"
                required
                maxLength={100}
                placeholder="Como deseja ser assinado?"
                value={autor}
                className={styles.nameInput}
                onChange={(e) => setAutor(e.target.value)}
              />
            </div>

            <div className={styles.campo}>
              <label htmlFor="poesia" className={styles.label}>
                Sua Poesia:
              </label>
              <textarea
                id="poesia"
                name="poesia"
                required
                maxLength={3000}
                placeholder="Escreva seus versos aqui..."
                value={mensagem}
                className={styles.textarea}
                onChange={(e) => setMensagem(e.target.value)}
              ></textarea>
              <div className={styles.charCounter}>
                {mensagem.length} / 3000 caracteres
              </div>
            </div>

            <button className={styles.botao} type="submit" disabled={loading}>
              {loading ? (
                'Publicando...'
              ) : (
                <>
                  <FiSend /> Publicar Poesia
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const cookies = ctx.req.cookies

  if (!session && !cookies.token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

