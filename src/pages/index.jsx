import { useState } from 'react'
import Direcionar from '../components/Direcionar'
import ScrollButton from '../components/ScrollButton'
import styles from '../styles/Home.module.css'

import { prisma } from '../lib/prisma'
import Card from '../components/Card'

import TypingEffect from '../components/TypingEffect'
import Footer from '../components/Footer'

export default function Home({ poesias = [] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPoesias = poesias.filter((poesia) => {
    const term = searchTerm.toLowerCase()
    return (
      (poesia.autor && poesia.autor.toLowerCase().includes(term)) ||
      (poesia.mensagem && poesia.mensagem.toLowerCase().includes(term))
    )
  })

  return (
    <div className={styles.body}>
      <ScrollButton/>
      <header className={styles.header}>
        <Direcionar to="/poeta" text="bem-vindo" width="150" height="150"/>
        <div id="title" className={styles.title}>
          <TypingEffect className={styles.titulo} text={"A poesia é uma forma de salvação. As canetas são minhas asas e as palavras libertação."}/>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <input 
          type="text" 
          placeholder="🔍 Pesquisar por autor ou trecho de poema..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.poetryCount}>{filteredPoesias.length} poesias</span>
      </div>

      <main className={styles.main}>
        {filteredPoesias.length === 0 ? (
          <p className={styles.noResults}>
            {searchTerm ? `Nenhuma poesia encontrada para "${searchTerm}".` : 'Nenhuma poesia publicada ainda. Seja o primeiro a escrever!'}
          </p>
        ) : (
          filteredPoesias.map(poesia => (
            <Card 
              key={poesia.id}
              date={poesia.date}
              mensagem={poesia.mensagem}
              autor={poesia.autor}
            />
          ))
        )}
      </main>
      <Footer/>
    </div>
  )
}

export const getServerSideProps = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      return { props: { poesias: [] } }
    }
    const poesias = await prisma.poetrys.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const data = poesias.map(poesia => {
      return {
        id: poesia.id,
        autor: poesia.autor || 'Anônimo',
        mensagem: poesia.mensagem || '',
        date: poesia.createdAt ? poesia.createdAt.toISOString() : new Date().toISOString()
      }
    })
    return {
      props: {
        poesias: data
      }
    }
  } catch (error) {
    console.error("Erro no getServerSideProps:", error)
    return {
      props: {
        poesias: []
      }
    }
  }
}
