import styles from '../../styles/Poeta.module.css'

import Image from 'next/image'
import Direcionar from '../../components/Direcionar'
import { useState } from 'react'
import { prisma } from '../../lib/prisma'
import Link from 'next/link'

export default function Poeta({poesias}) {
  const [newAutor, setNewAutor] = useState('')
  const [newMensagem, setNewMensagem] = useState('')
  
  async function handleCreatePoesia(e){
    e.preventDefault()
    await fetch('https://poesias-web.vercel.app/api/poesias/create',{
      method: 'POST',
      body: JSON.stringify({autor: newAutor, mensagem: newMensagem}),
      headers:{
        'Content-Type':'application/json'
      }

    }).then(async () =>{
      window.location.href = "https://poesias-web.vercel.app/"
    })
    .catch(async function(err) {
      console.log(err + " url: " + url);
    })
  
  }

  return (
    <div className={styles.body_poeta}>
      <main className={styles.main}>
        <div className={styles.container}>
          <Direcionar to="/" text="Voltar para a página inicial" width='100' height='100'/>
          <h1>Seja Bem-Vindo</h1>
        </div>
        <br/>
        <form className={styles.form} onSubmit={handleCreatePoesia} method={"POST"}>
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
        <Image src="/img/birds.png" width='100' height='100'/>
      </aside>

      <aside className={`${styles.casal} ${styles.aside}`} >
        <Image src="/img/casal.png" width='100' height='100'/>
      </aside>

      <footer className={styles.footer} > 
      </footer>
    </div>
  )
}
export const getServerSideProps = async (ctx)=>{
  const poesias = await prisma.poetrys.findMany()
  const data = poesias.map(poesia =>{
    return{
      id: poesia.id,
      autor: poesia.autor,
      mensagem: poesia.mensagem,
      date: poesia.createdAt.toISOString()
    }
  })
  return{
    props:{
      poesias: data
    }
  }
}
