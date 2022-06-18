import React, {useState, useEffect} from 'react'
import TypeAnimation from 'react-type-animation'
import {Link} from 'react-router-dom'
import './stylesHome.css'

import { ScrollButton } from '../../components/ButtonTop' 
import { Card } from '../../components/Card'

import luaImg from '../../img/pexels.jpg'
import gitImg from '../../img/git_white.png'

export function Home() {
    const autores = ['anonimo', "desconhecido","Zeus","Anfitrião","Ninguém", '5H4D0W']
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

  return (
    <>
    <ScrollButton/>

    <header>
        <Link to="/poeta" id="login">
            <img src={luaImg} alt="" className="home logoSite"/>
        </Link>
        <div id="title" className="home title">
            <TypeAnimation
            cursor={true}
            sequence={[`"A poesia é uma forma de salvação. As canetas são minhas asas e as palavras libertação."`]}
            className="home titulo"
            wrapper='h2'
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
        <address id="contato" className="home">
            <p>Copyright &copy;</p>
            <a href="https://github.com/Intern-Yago" className="home slub github" target="_blank">
                <img src={gitImg} alt="logo Github" className="home logo git"/>
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
