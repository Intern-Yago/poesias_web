import React, { useState } from 'react'
import { FiAlertTriangle, FiX, FiCheck } from 'react-icons/fi'

const PRESET_MOTIVOS = [
  'Conteúdo ofensivo ou discurso de ódio',
  'Plágio ou violação de direitos autorais',
  'Spam ou conteúdo comercial não solicitado',
  'Linguagem imprópria ou violenta',
  'Outro motivo'
]

export default function ReportModal({ isOpen, onClose, poetry }) {
  const [selectedMotivo, setSelectedMotivo] = useState(PRESET_MOTIVOS[0])
  const [detalhes, setDetalhes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen || !poetry) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg('')
    setSuccessMsg('')

    const motivoFinal = selectedMotivo === 'Outro motivo'
      ? detalhes.trim()
      : (detalhes.trim() ? `${selectedMotivo}: ${detalhes.trim()}` : selectedMotivo)

    if (!motivoFinal) {
      setErrorMsg('Por favor, informe o motivo da denúncia.')
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/poesias/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poetryId: poetry.id,
          motivo: motivoFinal
        })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar denúncia.')
      }

      setSuccessMsg('Denúncia enviada com sucesso. Nossa moderação irá analisar!')
      setTimeout(() => {
        setSuccessMsg('')
        onClose()
      }, 2000)
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao comunicar com o servidor.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#1e1e24',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        color: '#f0f0f5'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backgroundColor: 'rgba(239, 68, 68, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              <FiAlertTriangle />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>Denunciar Poesia</h3>
              <span style={{ fontSize: '0.8rem', color: '#a0a0b0' }}>
                {poetry.titulo ? `"${poetry.titulo}"` : `Poesia de ${poetry.autor}`}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#a0a0b0',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex'
            }}
          >
            <FiX />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {successMsg ? (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem'
            }}>
              <FiCheck style={{ fontSize: '1.3rem', flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div style={{
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '0.85rem'
                }}>
                  {errorMsg}
                </div>
              )}

              <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0b0', marginBottom: '0.5rem' }}>
                Qual o motivo da denúncia?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {PRESET_MOTIVOS.map((m) => (
                  <label
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: selectedMotivo === m ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                      border: selectedMotivo === m ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="motivo"
                      value={m}
                      checked={selectedMotivo === m}
                      onChange={() => setSelectedMotivo(m)}
                      style={{ accentColor: '#ef4444' }}
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: '0.85rem', color: '#a0a0b0', marginBottom: '0.4rem' }}>
                Detalhes adicionais (opcional):
              </label>
              <textarea
                value={detalhes}
                onChange={(e) => setDetalhes(e.target.value)}
                placeholder="Descreva mais sobre o problema detectado..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backgroundColor: 'transparent',
                    color: '#d0d0e0',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'wait' : 'pointer',
                    fontSize: '0.9rem',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
