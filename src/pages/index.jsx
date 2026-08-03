import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { FiEdit3, FiSearch, FiLogIn, FiLogOut, FiBookOpen } from 'react-icons/fi'
import styles from '../styles/Home.module.css'

import { prisma } from '../lib/prisma'
import Card from '../components/Card'
import ScrollButton from '../components/ScrollButton'
import TypingEffect from '../components/TypingEffect'
import Footer from '../components/Footer'

export default function Home({ poesias = [] }) {
  const { data: session } = useSession()
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
      <ScrollButton />

      <header className={styles.headerNav}>
        <div className={styles.navContainer}>
          <Link href="/">
            <a className={styles.brandLogo}>
              <FiBookOpen className={styles.brandIcon} />
              <span>Poesias</span>
            </a>
          </Link>

          <div className={styles.navActions}>
            <Link href="/poeta">
              <a className={styles.btnPublish}>
                <FiEdit3 /> Escrever Poesia
              </a>
            </Link>

            {session ? (
              <button onClick={() => signOut()} className={styles.btnAuth}>
                <FiLogOut /> Sair
              </button>
            ) : (
              <Link href="/login">
                <a className={styles.btnAuth}>
                  <FiLogIn /> Entrar
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.titleWrapper}>
            <TypingEffect
              text={"A poesia é uma forma de salvação. As canetas são minhas asas e as palavras libertação."}
            />
          </div>
          <p className={styles.heroSubtitle}>
            Um refúgio para amantes da literatura, versos sinceros e expressão da alma.
          </p>

          <div className={styles.searchBox}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Pesquisar por autor ou verso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <div className={styles.feedHeader}>
          <h2>Poemas Publicados</h2>
          <span className={styles.poetryCount}>{filteredPoesias.length} poesias encontradas</span>
        </div>

        {filteredPoesias.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma poesia encontrada {searchTerm ? `para "${searchTerm}"` : ''}.</p>
            <Link href="/poeta">
              <a className={styles.btnPublish}>Seja o primeiro a escrever!</a>
            </Link>
          </div>
        ) : (
          <div className={styles.cardFeed}>
            {filteredPoesias.map((poesia) => (
              <Card
                key={poesia.id}
                date={poesia.date}
                mensagem={poesia.mensagem}
                autor={poesia.autor}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export const getServerSideProps = async () => {
  try {
    const poesias = await prisma.poetrys.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const data = poesias.map((poesia) => ({
      id: poesia.id,
      autor: poesia.autor || 'Anônimo',
      mensagem: poesia.mensagem || '',
      date: poesia.createdAt ? poesia.createdAt.toISOString() : new Date().toISOString()
    }))

    return {
      props: {
        poesias: data
      }
    }
  } catch (error) {
    console.error("Erro no getServerSideProps home:", error)
    return {
      props: {
        poesias: []
      }
    }
  }
}

