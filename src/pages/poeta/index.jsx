import styles from '../../styles/Poeta.module.css'

import Image from 'next/image'
import Direcionar from '../../components/Direcionar'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'

export default function Poeta() {
  const { data: session } = useSession()
  const router = useRouter()

  const [newAutor, setNewAutor] = useState('')
  const [newMensagem, setNewMensagem] = useState('')
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
      setErrorMsg('Por favor, informe seu nome de autor.')
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
          mensagem: newMensagem.trim()
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao publicar a poesia.')
      }

      setSuccessMsg('Sua poesia foi publicada com sucesso!')
      setNewMensagem('')
      
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
      <main className={styles.main}>
        <div className={styles.container}>
          <Direcionar to="/" text="Voltar para a página inicial" width='100' height='100'/>
          <h1>Seja Bem-Vindo</h1>
        </div>
        <br/>

        {errorMsg && <div className={styles.errorBox}>{errorMsg}</div>}
        {successMsg && <div className={styles.successBox}>{successMsg}</div>}

        <form className={styles.form} onSubmit={handleCreatePoesia}>
          <fieldset>
            <div className={styles.campo}>
              <label htmlFor="autor" className={styles.label}>
                <strong>
                  Nome / Pseudônimo:
                </strong>
              </label>
              <input 
                type="text" 
                name="autor" 
                id="autor" 
                required 
                maxLength={100}
                value={newAutor}
                className={styles.name} 
                autoFocus 
                onChange={e => setNewAutor(e.target.value)}
              />
            </div>
          </fieldset> 

          <div className={styles.campo}>
            <br/>
            <label htmlFor="poesia" className={styles.label}>
              <strong>
                Escreva seu poema:
              </strong>
            </label>
            <textarea 
              id="poesia" 
              name="poesia" 
              required
              maxLength={3000}
              value={newMensagem}
              className={styles.textarea} 
              onChange={e => setNewMensagem(e.target.value)}
            ></textarea>
            <div className={styles.charCounter}>
              {newMensagem.length} / 3000 caracteres
            </div>
          </div>

          <button className={styles.botao} type="submit" disabled={loading}>
            {loading ? 'Publicando...' : 'Concluído'}
          </button>            
        </form>
      </main>

      <aside className={`${styles.birds} ${styles.aside}`} >
        <Image src="/img/birds.png" alt="pássaros" width='100' height='100'/>
      </aside>

      <aside className={`${styles.casal} ${styles.aside}`} >
        <Image src="/img/casal.png" alt="casal" width='100' height='100'/>
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

