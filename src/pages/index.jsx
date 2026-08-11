import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'
import { parseCookies, destroyCookie } from 'nookies'
import { 
  FiEdit3, FiSearch, FiLogIn, FiLogOut, FiBookOpen, FiUser, FiSettings, 
  FiGrid, FiList, FiChevronLeft, FiChevronRight, FiShield 
} from 'react-icons/fi'
import styles from '../styles/Home.module.css'

import { prisma } from '../lib/prisma'
import Card from '../components/Card'
import ScrollButton from '../components/ScrollButton'
import TypingEffect from '../components/TypingEffect'
import Footer from '../components/Footer'
import AccountModal from '../components/AccountModal'
import PoemModal from '../components/PoemModal'
import AuthRequiredModal from '../components/AuthRequiredModal'
import ReportModal from '../components/ReportModal'
import EditPoemModal from '../components/EditPoemModal'

export default function Home({ poesias = [] }) {
  const router = useRouter()
  const { data: session } = useSession()

  const [poesiasList, setPoesiasList] = useState(poesias)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeUser, setActiveUser] = useState(null)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [filterOnlyMyPosts, setFilterOnlyMyPosts] = useState(false)

  // Layout view mode: 'grid' (3 por linha) or 'list' (1 por linha)
  const [viewMode, setViewMode] = useState('grid')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Modal states
  const [selectedPoetryModal, setSelectedPoetryModal] = useState(null)
  const [selectedReportPoetry, setSelectedReportPoetry] = useState(null)
  const [editingPoetry, setEditingPoetry] = useState(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const feedRef = useRef(null)

  useEffect(() => {
    setPoesiasList(poesias)
  }, [poesias])

  // Active user session / cookies setup
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

  // Deep linking check for ?poesia=ID
  useEffect(() => {
    if (router.query?.poesia) {
      const found = poesiasList.find(p => p.id === router.query.poesia)
      if (found) {
        setSelectedPoetryModal(found)
      } else {
        // Fetch unlisted/private poetry directly by ID if accessed via link
        fetch(`/api/poesias/get?id=${router.query.poesia}`)
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data?.poetry) {
              setSelectedPoetryModal(data.poetry)
            }
          })
          .catch(console.error)
      }
    }
  }, [router.query, poesiasList])

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterOnlyMyPosts])

  const userPoesiasCount = activeUser
    ? poesiasList.filter(p => p.autor?.toLowerCase() === activeUser.name?.toLowerCase()).length
    : 0

  const filteredPoesias = poesiasList.filter((poesia) => {
    if (filterOnlyMyPosts && activeUser?.name) {
      if (poesia.autor?.toLowerCase() !== activeUser.name.toLowerCase()) {
        return false
      }
    }
    const term = searchTerm.toLowerCase()
    return (
      (poesia.titulo && poesia.titulo.toLowerCase().includes(term)) ||
      (poesia.autor && poesia.autor.toLowerCase().includes(term)) ||
      (poesia.mensagem && poesia.mensagem.toLowerCase().includes(term))
    )
  })

  // Pagination calculation
  const totalPages = Math.ceil(filteredPoesias.length / itemsPerPage) || 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPoesias = filteredPoesias.slice(startIndex, startIndex + itemsPerPage)

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      if (feedRef.current) {
        feedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  function handleDeletePoesia(deletedId) {
    setPoesiasList(prev => prev.filter(p => p.id !== deletedId))
    if (selectedPoetryModal?.id === deletedId) {
      setSelectedPoetryModal(null)
    }
  }

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

  function handleLoginSuccess(userInfo) {
    setActiveUser(userInfo)
  }

  return (
    <div className={styles.body}>
      <ScrollButton />

      {/* Account Settings / Profile Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        userName={activeUser?.name}
        userEmail={activeUser?.email}
        onOpenPoetryModal={(poetry) => setSelectedPoetryModal(poetry)}
        onEditPoetry={(poetry) => setEditingPoetry(poetry)}
        onDeletePoetry={handleDeletePoesia}
      />

      {/* Full Poem View Modal */}
      <PoemModal
        isOpen={Boolean(selectedPoetryModal)}
        onClose={() => setSelectedPoetryModal(null)}
        poetry={selectedPoetryModal}
        activeUser={activeUser}
        onDelete={handleDeletePoesia}
        onEditPoetry={(poetry) => setEditingPoetry(poetry)}
        onOpenReportModal={(poetry) => setSelectedReportPoetry(poetry)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Edit Poem Modal */}
      <EditPoemModal
        isOpen={Boolean(editingPoetry)}
        onClose={() => setEditingPoetry(null)}
        poetry={editingPoetry}
        onSaveSuccess={(updatedPoetry) => {
          setPoesiasList(prev => prev.map(p => p.id === updatedPoetry.id ? { ...p, ...updatedPoetry } : p))
          if (selectedPoetryModal?.id === updatedPoetry.id) {
            setSelectedPoetryModal(updatedPoetry)
          }
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={Boolean(selectedReportPoetry)}
        onClose={() => setSelectedReportPoetry(null)}
        poetry={selectedReportPoetry}
      />

      {/* Login Required Modal (for commenting when logged out) */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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

            <Link href="/admin">
              <a className={styles.btnAuth} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} title="Painel de Administração">
                <FiShield style={{ color: '#b8860b' }} /> Admin
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
              placeholder="Pesquisar por título, autor ou trecho de poesia..."
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
      <main className={styles.main} ref={feedRef}>
        <div className={styles.feedHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
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

          <div className={styles.feedHeaderControls}>
            {/* Disposition switcher (Grid 3 per row vs List 1 per row) */}
            <div className={styles.viewToggleGroup}>
              <button
                onClick={() => setViewMode('grid')}
                className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleBtnActive : ''}`}
                title="Visualização em Grade (3 por linha)"
              >
                <FiGrid /> <span>Grade</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.toggleBtnActive : ''}`}
                title="Visualização em Lista (1 por linha)"
              >
                <FiList /> <span>Lista</span>
              </button>
            </div>

            <span className={styles.poetryCount}>{filteredPoesias.length} poesias</span>
          </div>
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
          <>
            {/* Feed Cards (Grid or List layout) */}
            <div className={viewMode === 'grid' ? styles.cardFeedGrid : styles.cardFeedList}>
              {paginatedPoesias.map((poesia) => (
                <Card
                  key={poesia.id}
                  id={poesia.id}
                  titulo={poesia.titulo}
                  date={poesia.date}
                  mensagem={poesia.mensagem}
                  autor={poesia.autor}
                  likes={poesia.likes}
                  isPrivate={poesia.isPrivate}
                  currentUserName={activeUser?.name}
                  onDelete={handleDeletePoesia}
                  onOpenModal={(poetry) => setSelectedPoetryModal(poetry)}
                  onOpenReportModal={(poetry) => setSelectedReportPoetry(poetry)}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                />
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className={styles.paginationContainer}>
                <div className={styles.paginationButtons}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageBtn}
                    title="Página Anterior"
                  >
                    <FiChevronLeft /> Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNum = index + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`${styles.pageBtn} ${currentPage === pageNum ? styles.pageBtnActive : ''}`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageBtn}
                    title="Próxima Página"
                  >
                    Próxima <FiChevronRight />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: '#7a6a5c' }}>
                  <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
                  <span>•</span>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    Exibir:
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        border: '1px solid #dcd0c0',
                        fontSize: '0.85rem',
                        color: '#4a3b30',
                        backgroundColor: '#fff'
                      }}
                    >
                      <option value={6}>6 por página</option>
                      <option value={9}>9 por página</option>
                      <option value={12}>12 por página</option>
                      <option value={18}>18 por página</option>
                    </select>
                  </label>
                </div>
              </div>
            )}
          </>
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
      where: {
        isPrivate: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const data = poesias.map((poesia) => ({
      id: poesia.id,
      titulo: poesia.titulo || null,
      autor: poesia.autor || 'Anônimo',
      mensagem: poesia.mensagem || '',
      likes: poesia.likes || 0,
      isPrivate: Boolean(poesia.isPrivate),
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
