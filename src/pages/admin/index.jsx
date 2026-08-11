import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { 
  FiShield, FiFeather, FiMessageSquare, FiHeart, FiAlertTriangle, 
  FiTrash2, FiCheck, FiX, FiRefreshCw, FiSearch, FiArrowLeft, FiLock, FiEye 
} from 'react-icons/fi'

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminKeyInput, setAdminKeyInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('reports') // 'reports' | 'poesias' | 'comments' | 'stats'

  // Data state
  const [stats, setStats] = useState(null)
  const [reports, setReports] = useState([])
  const [poesias, setPoesias] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  // Selected poetry modal for preview
  const [previewPoetry, setPreviewPoetry] = useState(null)

  useEffect(() => {
    if (sessionStatus !== 'loading') {
      fetchAdminData()
    }
  }, [sessionStatus])

  async function fetchAdminData(customKey = '') {
    setLoading(true)
    setAuthError('')

    const headers = {}
    const keyToUse = customKey || localStorage.getItem('admin_access_key') || ''
    if (keyToUse) {
      headers['x-admin-key'] = keyToUse
    }

    try {
      // 1. Fetch Stats & Recent items
      const statsRes = await fetch('/api/admin/stats', { headers })
      if (statsRes.status === 403 || statsRes.status === 401) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      const statsData = await statsRes.json()
      if (!statsRes.ok) {
        throw new Error(statsData.error || 'Falha ao acessar o painel de administrador.')
      }

      setIsAdmin(true)
      if (keyToUse) {
        localStorage.setItem('admin_access_key', keyToUse)
      }
      setStats(statsData.stats)
      setComments(statsData.recentComments || [])

      // 2. Fetch Reports
      const reportsRes = await fetch('/api/poesias/report', { headers })
      if (reportsRes.ok) {
        const reportsData = await reportsRes.json()
        setReports(reportsData.reports || [])
      }

      // 3. Fetch Poesias for management list
      const poesiasRes = await fetch('/api/admin/stats', { headers }) // initial overview
      if (poesiasData => statsData.recentPoesias) {
        setPoesias(statsData.recentPoesias || [])
      }
    } catch (err) {
      console.error(err)
      setAuthError(err.message || 'Erro ao carregar dados do painel.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminKeyLogin = (e) => {
    e.preventDefault()
    if (!adminKeyInput.trim()) return
    fetchAdminData(adminKeyInput.trim())
  }

  const handleResolveReport = async (reportId, newStatus) => {
    const key = localStorage.getItem('admin_access_key') || ''
    try {
      const res = await fetch('/api/poesias/report', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key
        },
        body: JSON.stringify({ id: reportId, status: newStatus })
      })
      if (res.ok) {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r))
        showNotification(newStatus === 'RESOLVIDO' ? 'Denúncia resolvida!' : 'Denúncia ignorada.')
      } else {
        alert('Erro ao atualizar denúncia.')
      }
    } catch (e) {
      alert('Erro na requisição.')
    }
  }

  const handleDeletePoetry = async (poetryId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta poesia como Administrador? Esta ação não pode ser desfeita.')) return
    
    const key = localStorage.getItem('admin_access_key') || ''
    try {
      const res = await fetch('/api/poesias/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key
        },
        body: JSON.stringify({ id: poetryId })
      })

      if (res.ok) {
        setPoesias(prev => prev.filter(p => p.id !== poetryId))
        setReports(prev => prev.filter(r => r.poetryId !== poetryId))
        if (stats) setStats(prev => ({ ...prev, totalPoesias: Math.max(0, prev.totalPoesias - 1) }))
        showNotification('Poesia excluída com sucesso!')
        if (previewPoetry?.id === poetryId) setPreviewPoetry(null)
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao excluir poesia.')
      }
    } catch (e) {
      alert('Erro na conexão com o servidor.')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) return

    const key = localStorage.getItem('admin_access_key') || ''
    try {
      const res = await fetch('/api/admin/comments/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key
        },
        body: JSON.stringify({ id: commentId })
      })

      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== commentId))
        if (stats) setStats(prev => ({ ...prev, totalComments: Math.max(0, prev.totalComments - 1) }))
        showNotification('Comentário excluído com sucesso!')
      } else {
        alert('Erro ao excluir comentário.')
      }
    } catch (e) {
      alert('Erro na requisição.')
    }
  }

  const showNotification = (msg) => {
    setActionSuccess(msg)
    setTimeout(() => setActionSuccess(''), 3000)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#121216',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <FiRefreshCw className="spin" style={{ fontSize: '2.5rem', color: '#b8860b', marginBottom: '1rem' }} />
          <p style={{ color: '#a0a0b0' }}>Carregando Painel de Administração...</p>
        </div>
      </div>
    )
  }

  // Not Admin Login Form
  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#121216',
        color: '#f0f0f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1rem'
      }}>
        <Head>
          <title>Acesso Restrito - Admin Poesias Web</title>
        </Head>

        <div style={{
          backgroundColor: '#1c1c24',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            backgroundColor: 'rgba(184, 134, 11, 0.15)',
            color: '#b8860b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            fontSize: '1.8rem'
          }}>
            <FiLock />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
            Painel de Administração
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#a0a0b0', marginBottom: '1.8rem' }}>
            Identifique-se como administrador por e-mail (NextAuth) ou digite a chave de segurança de acesso.
          </p>

          {authError && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '0.75rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              marginBottom: '1.2rem'
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminKeyLogin}>
            <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#a0a0b0', marginBottom: '0.4rem' }}>
                Chave de Acesso Admin (ADMIN_KEY):
              </label>
              <input
                type="password"
                placeholder="Insira a chave admin..."
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#b8860b',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(184, 134, 11, 0.3)',
                marginBottom: '1rem'
              }}
            >
              Entrar no Painel
            </button>
          </form>

          <Link href="/" passHref style={{
            color: '#a0a0b0',
            textDecoration: 'none',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '0.5rem'
          }}>
            <FiArrowLeft /> Voltar para a página principal
          </Link>
        </div>
      </div>
    )
  }

  const pendingReportsList = reports.filter(r => r.status === 'PENDENTE')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f14',
      color: '#e4e4eb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Head>
        <title>Painel de Administração - Poesias Web</title>
      </Head>

      {/* Top Header */}
      <header style={{
        backgroundColor: '#16161e',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(184, 134, 11, 0.2)',
            color: '#b8860b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem'
          }}>
            <FiShield />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Painel de Administração
            </h1>
            <span style={{ fontSize: '0.8rem', color: '#a0a0b0' }}>
              Moderação e Gestão do Poesias Web
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => fetchAdminData()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#d0d0e0',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            <FiRefreshCw /> Atualizar
          </button>

          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#b8860b',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}>
            <FiArrowLeft /> Ver Site
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Notification Toast */}
        {actionSuccess && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#10b981',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 500
          }}>
            <FiCheck style={{ fontSize: '1.2rem' }} /> {actionSuccess}
          </div>
        )}

        {/* Overview Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Poesias Card */}
          <div style={{
            backgroundColor: '#16161e',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#a0a0b0' }}>Total de Poesias</span>
              <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
                {stats?.totalPoesias || 0}
              </h3>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(184, 134, 11, 0.15)',
              color: '#b8860b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              <FiFeather />
            </div>
          </div>

          {/* Comments Card */}
          <div style={{
            backgroundColor: '#16161e',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#a0a0b0' }}>Total de Comentários</span>
              <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
                {stats?.totalComments || 0}
              </h3>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              <FiMessageSquare />
            </div>
          </div>

          {/* Likes Card */}
          <div style={{
            backgroundColor: '#16161e',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#a0a0b0' }}>Total de Curtidas</span>
              <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: '#ffffff' }}>
                {stats?.totalLikes || 0}
              </h3>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              color: '#ec4899',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              <FiHeart />
            </div>
          </div>

          {/* Pending Reports Card */}
          <div style={{
            backgroundColor: '#16161e',
            borderRadius: '14px',
            border: pendingReportsList.length > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255,255,255,0.08)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: pendingReportsList.length > 0 ? '#ef4444' : '#a0a0b0' }}>
                Denúncias Pendentes
              </span>
              <h3 style={{ margin: '0.4rem 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: pendingReportsList.length > 0 ? '#ef4444' : '#ffffff' }}>
                {pendingReportsList.length}
              </h3>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: pendingReportsList.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
              color: pendingReportsList.length > 0 ? '#ef4444' : '#a0a0b0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              <FiAlertTriangle />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'reports' ? '#b8860b' : 'transparent',
              color: activeTab === 'reports' ? '#ffffff' : '#a0a0b0',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <FiAlertTriangle /> Denúncias Pendentes ({pendingReportsList.length})
          </button>

          <button
            onClick={() => setActiveTab('poesias')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'poesias' ? '#b8860b' : 'transparent',
              color: activeTab === 'poesias' ? '#ffffff' : '#a0a0b0',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <FiFeather /> Gerenciar Poesias
          </button>

          <button
            onClick={() => setActiveTab('comments')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === 'comments' ? '#b8860b' : 'transparent',
              color: activeTab === 'comments' ? '#ffffff' : '#a0a0b0',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <FiMessageSquare /> Gerenciar Comentários
          </button>
        </div>

        {/* Tab 1: Denúncias */}
        {activeTab === 'reports' && (
          <div>
            {pendingReportsList.length === 0 ? (
              <div style={{
                backgroundColor: '#16161e',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#a0a0b0'
              }}>
                <FiCheck style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '0.75rem' }} />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem' }}>Nenhuma denúncia pendente!</h3>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.9rem' }}>
                  A plataforma está limpa e sem relatos de violações no momento.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingReportsList.map((r) => (
                  <div key={r.id} style={{
                    backgroundColor: '#16161e',
                    borderRadius: '14px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          DENÚNCIA #PENDENTE
                        </span>
                        <h4 style={{ margin: '0.6rem 0 0.2rem 0', fontSize: '1.1rem', color: '#fff' }}>
                          Motivo: &quot;{r.motivo}&quot;
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: '#a0a0b0' }}>
                          Denunciado por: <strong>{r.autor || 'Anônimo'}</strong> em {new Date(r.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleResolveReport(r.id, 'REJEITADO')}
                          style={{
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            backgroundColor: 'transparent',
                            color: '#a0a0b0',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                          title="Ignorar esta denúncia"
                        >
                          Ignorar / Manter Poesia
                        </button>
                        <button
                          onClick={() => handleDeletePoetry(r.poetryId)}
                          style={{
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                          title="Excluir a poesia denunciada da plataforma"
                        >
                          <FiTrash2 /> Excluir Poesia
                        </button>
                      </div>
                    </div>

                    {/* Preview of Reported Poetry */}
                    {r.poetry && (
                      <div style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        borderLeft: '4px solid #b8860b',
                        fontSize: '0.92rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 600, color: '#d0d0e0' }}>
                            {r.poetry.titulo || 'Sem título'} (por {r.poetry.autor})
                          </span>
                        </div>
                        <p style={{ margin: 0, color: '#a0a0b0', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                          &quot;{r.poetry.mensagem.length > 250 ? r.poetry.mensagem.slice(0, 250) + '...' : r.poetry.mensagem}&quot;
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Gerenciar Poesias */}
        {activeTab === 'poesias' && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
              <div style={{
                position: 'relative',
                flex: 1
              }}>
                <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#a0a0b0' }} />
                <input
                  type="text"
                  placeholder="Pesquisar por autor, título ou conteúdo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    borderRadius: '10px',
                    backgroundColor: '#16161e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{
              backgroundColor: '#16161e',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Poesia</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Autor</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Data</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Interações</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {poesias
                    .filter(p => 
                      !searchQuery || 
                      p.autor?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.mensagem?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 1.2rem', maxWidth: '300px' }}>
                          <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.2rem' }}>
                            {p.titulo || 'Sem título'}
                          </div>
                          <div style={{ color: '#a0a0b0', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.mensagem}
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.2rem', color: '#d0d0e0' }}>{p.autor}</td>
                        <td style={{ padding: '1rem 1.2rem', color: '#a0a0b0', fontSize: '0.82rem' }}>
                          {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', color: '#a0a0b0', fontSize: '0.82rem' }}>
                          ❤️ {p.likes || 0} | 💬 {p._count?.comments || 0}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeletePoetry(p.id)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                            title="Excluir poesia"
                          >
                            <FiTrash2 /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Gerenciar Comentários */}
        {activeTab === 'comments' && (
          <div>
            <div style={{
              backgroundColor: '#16161e',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.08)',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Comentário</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Autor</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Poesia Origem</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0' }}>Data</th>
                    <th style={{ padding: '1rem 1.2rem', color: '#a0a0b0', textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#a0a0b0' }}>
                        Nenhum comentário recente encontrado.
                      </td>
                    </tr>
                  ) : (
                    comments.map((c) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 1.2rem', color: '#fff' }}>{c.texto}</td>
                        <td style={{ padding: '1rem 1.2rem', color: '#d0d0e0' }}>{c.autor}</td>
                        <td style={{ padding: '1rem 1.2rem', color: '#a0a0b0', fontSize: '0.85rem' }}>
                          {c.poetry?.titulo || `Poesia de ${c.poetry?.autor || 'Desconhecido'}`}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', color: '#a0a0b0', fontSize: '0.82rem' }}>
                          {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            style={{
                              padding: '0.4rem 0.75rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <FiTrash2 /> Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
