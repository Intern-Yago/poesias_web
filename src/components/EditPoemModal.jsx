import { useState, useEffect } from 'react'
import { FiX, FiCheck, FiLock, FiEdit3 } from 'react-icons/fi'

export default function EditPoemModal({ poetry, isOpen, onClose, onSaveSuccess }) {
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (poetry) {
      setTitulo(poetry.titulo || '')
      setMensagem(poetry.mensagem || '')
      setIsPrivate(Boolean(poetry.isPrivate))
      setErrorMsg('')
    }
  }, [poetry])

  if (!isOpen || !poetry) return null

  const handleSave = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!mensagem.trim()) {
      setErrorMsg('O texto da poesia não pode estar em branco.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/poesias/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: poetry.id,
          titulo: titulo.trim(),
          mensagem: mensagem.trim(),
          isPrivate
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao atualizar a poesia.')
      }

      if (onSaveSuccess) {
        onSaveSuccess(data.poetry)
      }
      onClose()
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', color: '#3b2f25', fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiEdit3 color="#b8860b" /> Editar Poesia
          </h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#888', cursor: 'pointer' }}
          >
            <FiX />
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fff5f5', color: '#c53030', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '1.2rem', border: '1px solid #feb2b2' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Título */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#5a4636', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Título (Opcional):
            </label>
            <input 
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título da sua poesia..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #dcd0c0',
                fontSize: '0.95rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Texto / Mensagem */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: 600, color: '#5a4636', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Poema:
            </label>
            <textarea 
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              required
              rows={8}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid #dcd0c0',
                fontSize: '0.95rem',
                fontFamily: 'Georgia, serif',
                lineHeight: '1.6',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Toggle Privacy (Pública / Privada) */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: '14px',
              backgroundColor: isPrivate ? 'rgba(184, 134, 11, 0.08)' : 'rgba(0, 0, 0, 0.02)',
              border: isPrivate ? '1px solid rgba(184, 134, 11, 0.35)' : '1px solid rgba(0, 0, 0, 0.08)',
              marginBottom: '1.5rem',
              cursor: 'pointer'
            }}
            onClick={() => setIsPrivate(!isPrivate)}
          >
            <input 
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              style={{ marginTop: '0.2rem', accentColor: '#b8860b', width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div>
              <label style={{ fontWeight: 600, fontSize: '0.95rem', color: '#4a3b30', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                <FiLock color="#b8860b" /> Poesia Não-Listada / Privada
              </label>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#7a6a5c', lineHeight: '1.4' }}>
                {isPrivate 
                  ? "Sua poesia está privada (não aparece no feed público, acessível apenas por link direto)." 
                  : "Sua poesia está pública (visível no feed principal para todos os leitores)."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '0.65rem 1.2rem',
                borderRadius: '24px',
                border: '1px solid #dcd0c0',
                background: '#f8f4ee',
                color: '#5c4b3e',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: '24px',
                border: 'none',
                background: 'linear-gradient(135deg, #b8860b 0%, #8b6508 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <FiCheck /> {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
