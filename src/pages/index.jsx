import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { parseCookies, destroyCookie } from 'nookies'
import { FiEdit3, FiSearch, FiLogIn, FiLogOut, FiBookOpen, FiUser, FiSettings, FiGrid } from 'react-icons/fi'
import styles from '../styles/Home.module.css'

import { prisma } from '../lib/prisma'
import Card from '../components/Card'
import ScrollButton from '../components/ScrollButton'
import TypingEffect from '../components/TypingEffect'
import Footer from '../components/Footer'
import AccountModal from '../components/AccountModal'

export default function Home({ poesias = [] }) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeUser, setActiveUser] = useState(null)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [filterOnlyMyPosts, setFilterOnlyMyPosts] = useState(false)

  useEffect(() => {
    const cookies = parseCookies()
    let name = ''
    let email = ''

    if (session?.user) {
      name = session.user.name || session.user.email?.split('@')[0]
      email = session.user.email || ''
    } else if (cookies.user_name || cookies.token) {
      name = cookies.user_name || 'Poeta'
      email = cookies.user_email || ''
    }

    if (name) {
      setActiveUser({ name, email })
    } else {
      setActiveUser(null)
    }
  }, [session])

  const userPoesiasCount = activeUser
    ? poesias.filter(p => p.autor?.toLowerCase() === activeUser.name?.toLowerCase()).length
    : 0

  const filteredPoesias = poesias.filter((poesia) => {
    if (filterOnlyMyPosts && activeUser?.name) {
      if (poesia.autor?.toLowerCase() !== activeUser.name.toLowerCase()) {
        return false
      }
    }
    const term = searchTerm.toLowerCase()
    return (
      (poesia.autor && poesia.autor.toLowerCase().includes(term)) ||
      (poesia.mensagem && poesia.mensagem.toLowerCase().includes(term))
    )
  })

  function handleLogout() {
    destroyCookie(undefined, 'token', { path: '/' })
    destroyCookie(undefined, 'user_name', { path: '/' })
    destroyCookie(undefined, 'user_email', { path: '/' })
    setActiveUser(null)
    signOut({ callbackUrl: '/' })
  }

  function handleFilterMyPoesias(authorName) {
    const nameToFilter = authorName || activeUser?.name
    if (nameToFilter) {
      setSearchTerm(nameToFilter)
      setFilterOnlyMyPosts(true)
    }
  }

  return (
    <div className={styles.body}>
      <ScrollButton />

      {/* Account Settings Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userName={activeUser?.name}
        userEmail={activeUser?.email}
        userPoesiasCount={userPoesiasCount}
        onFilterMyPoesias={handleFilterMyPoesias}
      />

      {/* Top Navbar */}
      <header className={styles.headerNav}>
        <div className={styles.navContainer}>
          <Link href="/">
            <a className={styles.brandLogo} onClick={() => { setSearchTerm(''); setFilterOnlyMyPosts(false); }}>
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

            {activeUser ? (
              <div className={styles.userMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => setIsAccountModalOpen(true)}
                  className={styles.btnAuth}
                  style={{
                    backgroundColor: '#f4ede2',
                    borderColor: '#b8860b',
                    color: '#4a3b30',
                    fontWeight: '600'
                  }}
                  title="Configurações da conta e minhas poesias"
                >
                  <FiUser style={{ color: '#b8860b' }} /> {activeUser.name}
                  <FiSettings style={{ marginLeft: '0.2rem', opacity: 0.8 }} />
                </button>

                <button onClick={handleLogout} className={styles.btnAuth} title="Sair da conta">
                  <FiLogOut />
                </button>
              </div>
            ) : (
              <Link href="/login">
                <a className={styles.btnAuth}>
                  <FiLogIn /> Entrar / Cadastrar
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
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
              placeholder="Pesquisar por autor ou trecho de poesia..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (filterOnlyMyPosts) setFilterOnlyMyPosts(false)
              }}
              className={styles.searchInput}
            />
          </div>
        </div>
      </section>

      {/* Feed Container */}
      <main className={styles.main}>
        <div className={styles.feedHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2>{filterOnlyMyPosts ? `Minhas Poesias (${activeUser?.name})` : 'Poemas Publicados'}</h2>
            {filterOnlyMyPosts && (
              <button
                onClick={() => { setFilterOnlyMyPosts(false); setSearchTerm(''); }}
                style={{
                  background: '#e2d5c3',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.3rem 0.7rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  color: '#4a3b30'
                }}
              >
                Ver Todas
              </button>
            )}
          </div>
          <span className={styles.poetryCount}>{filteredPoesias.length} poesias</span>
        </div>

        {filteredPoesias.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              {filterOnlyMyPosts 
                ? 'Você ainda não publicou nenhuma poesia.' 
                : `Nenhuma poesia encontrada ${searchTerm ? `para "${searchTerm}"` : ''}.`}
            </p>
            <Link href="/poeta">
              <a className={styles.btnPublish}>Escrever Poesia Agora</a>
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
    if (!process.env.DATABASE_URL) {
      return {
        props: {
          poesias: []
        }
      }
    }

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

