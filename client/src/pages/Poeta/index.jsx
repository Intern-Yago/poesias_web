import React from 'react'
import styles from './styles.module.css'

import birds from '../../img/birds.png'
import casal from '../../img/casal.png'
import { Direcionar } from '../../components/Direcionar'

export function Poeta() {
  document.title="Poeta"
  return (
    <div className={styles.body_poeta}>
      <main className={styles.main}>
        <div className={styles.container}>
          <Direcionar to="/" text="Voltar para a página inicial"/>
          <h1 >Seja Bem-Vindo</h1>
        </div>
        <br/>
        <form className={styles.form} action='/' method="get">
          <fieldset>
            <div className={styles.campo}>
              <label htmlFor="autor" className={styles.label}>
                <strong>
                  Nome
                </strong>
              </label>
              <input type="text" name="autor" id="autor" required className={styles.name} autoFocus/>
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
            <textarea id="experiencia" name="poesia" className={styles.textarea} ></textarea>
          </div>

          {/*<!-- Botão para enviar o formulário -->*/}
          <button className={styles.botao} type="submit">Concluído</button>            

        </form>
      </main>

      <aside className={`${styles.birds} ${styles.aside}`} >
        <img src={birds} alt=""/>
      </aside>

      <aside className={`${styles.casal} ${styles.aside}`} >
        <img src={casal} alt="" />
      </aside>

      <footer className={styles.footer} > 
      </footer>
    </div>
  )
}