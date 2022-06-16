import { useState } from 'react'
import './styles.css'

export function Poeta() {
  return (
    <>
    <main>
      <div>
        <h1 id="titulo">Seja Bem-Vindo</h1>
      </div>
      <br/>
      <form>
        <fieldset className="grupo">
          <div className="campo">
            <label htmlFor="autor">
              <strong>
                Nome
              </strong>
            </label>
            <input type="text" name="autor" id="autor" required/>
          </div>
        </fieldset> 

        {/*<!-- Caixa de texto -->*/}
        <div className="campo poesia">
          <br/>
          <label htmlFor="poesia">
            <strong>
              Escreva seu poema:
            </strong>
          </label>
          <textarea id="experiencia" name="poesia"></textarea>
        </div>

        {/*<!-- Botão para enviar o formulário -->*/}
        <a href="index.html">
          <button className="botao" type="submit">Concluído</button>            
        </a>

      </form>
    </main>

    <aside id="birds">
      <img src="../../img/birds.png" alt=""/>
    </aside>

    <aside id="casal">
      <img src="../../img/casal.png" alt=""/>
    </aside>

    <footer> 
    </footer>
    </>
  )
}
