import React, {useState, useEffect} from 'react'
import TypeAnimation from 'react-type-animation'
import './stylesHome.css'

import { ScrollButton } from '../../components/ButtonTop' 
import { Card } from '../../components/Card'

import luaImg from '../../img/pexels.jpg'
import { gql, useQuery } from '@apollo/client'
import { Link, useParams } from 'react-router-dom'

import { CardProps } from '../../interfaces/CardProps'
import { Sidebar } from '../../components/Sidebar'
import { Poetry } from '../../components/Poetry'
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

export function Home() {
    const {data} = useQuery<{publishes:CardProps[]}>(GET_POETRYS_QUERY)
    const {slug} = useParams<{slug:string}>()
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
    {slug
            ?<Poetry publishSlug={slug}/>
            :<div/>
    }
    <main>       
     {
        data?.publishes.map(publish=>{
            return <Card
                key={publish.id}
                poesia={publish.poesia}
                poeta={publish.poeta}
                date={publish.date}
                slug={publish.id}
            />
        })
     }
     
        
    </main>
    <Sidebar/>

    {/*<!--JS-->
    <script src="/top.js"></script>
    <script src="/pop.js"></script>
    <script src="/escrita.js"></script>
    */
    }
    </>
  )
}
