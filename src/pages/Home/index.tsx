import React, {useState, useEffect} from 'react'
import TypeAnimation from 'react-type-animation'
import './stylesHome.css'

import { ScrollButton } from '../../components/ButtonTop' 
import { Card } from '../../components/Card'

import luaImg from '../../img/pexels.jpg'
import gitImg from '../../img/git_white.png'
import { gql, useQuery } from '@apollo/client'

const GET_POETRYS_QUERY = gql`
    query{
        publishes{
            id
            date
            poeta
            poesia
    }
}
`

interface Publish{
    id:string;
    date:string;
    poeta:string;
    poesia:string;
}

export function Home() {
    const {data} = useQuery<{publishes:Publish[]}>(GET_POETRYS_QUERY)

  return (
    <>
    <ScrollButton/>

    <header>
        <a href="../poeta" id="login">
            <img src={luaImg} alt="" className="home logoSite"/>
        </a>
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
     {
        data?.publishes.map(publish=>{
            return <Card
                key={publish.id}
                mensagem={publish.poesia}
                autor={publish.poeta}
                date={publish.date.split('-').reverse().join('-')}
            />
        })
     }
     
        
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
