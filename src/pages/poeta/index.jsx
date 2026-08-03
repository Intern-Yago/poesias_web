import styles from '../../styles/Poeta.module.css'

import Image from 'next/image'
import Direcionar from '../../components/Direcionar'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'

export default function Poeta() {
  const [newAutor, setNewAutor] = useState('')
  const [newMensagem, setNewMensagem] = useState('')
  const router = useRouter()
  
  async function handleCreatePoesia(e){
    e.preventDefault()
    if (!newAutor.trim() || !newMensagem.trim()) return

    const res = await fetch('/api/poesias/create',{
      method: 'POST',
      body: JSON.stringify({autor: newAutor, mensagem: newMensagem}),
      headers:{
        'Content-Type':'application/json'
      }
    })

    if (res.ok) {
      router.push('/')
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
        <form className={styles.form} onSubmit={handleCreatePoesia}>
          <fieldset>
            <div className={styles.campo}>
              <label htmlFor="autor" className={styles.label}>
                <strong>
                  Nome
                </strong>
              </label>
              <input type="text" name="autor" id="autor" required className={styles.name} autoFocus onChange={e=>setNewAutor(e.target.value)}/>
            </div>
          </fieldset> 

          {/*<!-- Caixa de texto -->*/}
          <div className={styles.campo}>
            <br/>
            <label htmlFor="poesia" className={styles.label}>
              <strong>
                Escreva seu poema:
              </strong>
            </label>
            <textarea id="experiencia" name="poesia" className={styles.textarea} onChange={e=>setNewMensagem(e.target.value)}></textarea>
          </div>

          {/*<!-- Botão para enviar o formulário -->*/}
          <button className={styles.botao} type="submit">Concluído</button>            

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

