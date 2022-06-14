import React, {useState, useEffect} from 'react'
import TypeAnimation from 'react-type-animation'

import './styles.css'
import './login.css'

import { ScrollButton } from '../../components/ButtonTop' 
import { Card } from '../../components/Card'

import luaImg from '../../img/pexels.jpg'
import gitImg from '../../img/git_white.png'
import topImg from '../../img/top_white.png'

export function Home() {
    const autores = ['anonimo', "desconhecido","Yago","Ninguém", '5H4D0W']
    const poesia={
        texto: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique minus adipisci, necessitatibus vitae mollitia voluptas nemo fugit non recusandae voluptates, quibusdam dolorem! Quisquam deserunt rem ratione, nemo voluptatum atque corporis.",
        date(){
            return new Date().toLocaleString("pt-br", {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute:"2-digit",
                second:'2-digit'
            })
        },
        autor(){
            return autores[Math.floor(Math.random() * autores.length)]
        },
    }

    function handleSubmit(e) {
        const pop = document.getElementById("pop")
        if (pop){
        pop.classList.add("activate")
        pop.addEventListener('click',(e)=>{
            if(e.target.id == "pop" || e.target.className == 'fechar'){
                pop.classList.remove('activate')
            }
        })
    }
    }

  return (
    <>
     <div id="pop" className="body">
        <div id="pop-up">
            <button className="fechar" >X</button>
            <form>
                <fieldset className="grupo">
                    <div className="campo">
                        <label htmlFor="nome"><strong>Login</strong></label>
                        <input type="email" name="nome" id="nome" placeholder="Acesso" maxLength="100"/>
                    </div>
                    <div className="campo">
                        <label htmlFor="sobrenome"><strong>Senha</strong></label>
                        <input type="password" name="sobrenome" id="sobrenome" placeholder="*******" maxLength="100"/>
                    </div>
                </fieldset> 
            </form>
            <div id="button">
                <a href="poeta.html">
                    <input type="submit" value="Acessar" className="botao"/>         
                </a>
            </div>
        </div>
    </div>
    <ScrollButton/>

    <header>
        <a id="login" onClick={handleSubmit}>
            <img src={luaImg} alt=""/>
        </a>
        <div id="title" className="title">
            <TypeAnimation
            cursor={true}
            sequence={[`"A poesia é uma forma de salvação. As canetas são minhas asas e as palavras libertação."`]}
            className="titulo"
            wraper='h2'
            />
        </div>    
    </header>
    <main>
        <Card 
            date={poesia.date()}
            mensagem={poesia.texto}
            autor={poesia.autor()}
        />
        <Card 
            date={poesia.date()}
            mensagem={poesia.texto}
            autor={poesia.autor()}
        />
        <Card 
            date={poesia.date()}
            mensagem={poesia.texto}
            autor={poesia.autor()}
        />
        

    </main>
    <footer> 
        <address id="contato">
            <p>Copyright &copy;</p>
            <a href="https://github.com/Intern-Yago" className="slub github" target="_blank">
                <img src={gitImg} alt="logo Github" className="logo git"/>
                Intern-Yago
            </a>
        </address>
    </footer>

    {/*<!--JS-->
    <script src="/top.js"></script>
    <script src="/pop.js"></script>
    <script src="/escrita.js"></script>
    */
    }
    </>
  )
}
