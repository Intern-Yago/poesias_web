import React from 'react'
import TypeAnimation from 'react-type-animation'

import styles from './styles.module.css'

import { ScrollButton } from '../../components/ButtonTop' 
import { Card } from '../../components/Card'

import gitImg from '../../img/git_white.png'
import { Direcionar } from '../../components/Direcionar'

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

  return (
    <div className={styles.body}>
    <ScrollButton/>
    <header className={styles.header}>
        <Direcionar to="/login" text="Clique aqui para escrever sua poesia"/>
        <div id="title" className={styles.title}>
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
    <footer className={styles.footer}> 
        <address className={styles.address}>
            <p>Copyright &copy;</p>
            <a href="https://github.com/Intern-Yago" target="_blank">
                <img src={gitImg} alt="logo Github"/>
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
    </div>
  )
}
