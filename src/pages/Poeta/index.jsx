import { useState } from 'react'
import './styles.css'

import birds from '../../img/birds.png'
import casal from '../../img/casal.png'

export function Poeta() {
  return (
    <div className="body poeta">
    <main className="poeta">
      <div className="poeta">
        <h1 id="titulo" className="poeta" >Seja Bem-Vindo</h1>
      </div>
      <br/>
      <form className="poeta" action='/' method="get">
        <fieldset className="poeta grupo">
          <div className="poeta campo">
            <label htmlFor="autor" className="poeta">
              <strong>
                Nome
              </strong>
            </label>
            <input type="text" name="autor" id="autor" required className="poeta" autoFocus/>
          </div>
        </fieldset> 

        {/*<!-- Caixa de texto -->*/}
        <div className="poeta campo poesia">
          <br/>
          <label htmlFor="poesia" className="poeta" >
            <strong>
              Escreva seu poema:
            </strong>
          </label>
          <textarea id="experiencia" name="poesia" className="poeta" ></textarea>
        </div>

        {/*<!-- Botão para enviar o formulário -->*/}
        <button className="poeta botao" type="submit">Concluído</button>            

      </form>
    </main>

    <aside id="birds" className="poeta" >
      <img src={birds} alt="" className="poeta"/>
    </aside>

    <aside id="casal" className="poeta" >
      <img src={casal} alt="" className="poeta" />
    </aside>

    <footer className="poeta" > 
    </footer>
    </div>
  )
}