'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewClient() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // =========================
  // VALIDADORES
  // =========================

  const invisibleChars = /[\u200B-\u200D\uFEFF]/g

  const validateName = (value: string) => {
    const normalized = value
      .normalize('NFKC')
      .replace(invisibleChars, '')
      .trim()
      .replace(/\s+/g, ' ')

    if (!normalized) {
      throw new Error('Nome obrigatório')
    }

    if (normalized.length < 3 || normalized.length > 50) {
      throw new Error('Nome deve ter entre 3 e 50 caracteres')
    }

    if (!/[aeiouáéíóúãõâêîôû]/i.test(normalized)) {
      throw new Error('Nome inválido')
    }

    // Bloqueia repetição suspeita
    if (/(.)\1{4,}/.test(normalized)) {
      throw new Error('Nome inválido')
    }

    // Apenas letras, espaços, hífen e apóstrofo
    const validRegex = /^[\p{L}\s'-]+$/u

    if (!validRegex.test(normalized)) {
      throw new Error('Nome contém caracteres inválidos')
    }

    return normalized
  }

  const validateEmail = (value: string) => {
    const normalized = value
      .normalize('NFKC')
      .replace(invisibleChars, '')
      .trim()
      .toLowerCase()

    if (!normalized) {
      throw new Error('Email obrigatório')
    }

    if (normalized.length > 50) {
      throw new Error('Email muito longo')
    }

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(normalized)) {
      throw new Error('Email inválido')
    }

    return normalized
  }

  const validatePhone = (value: string) => {
    // Remove tudo que não for número
    const cleaned = value.replace(/\D/g, '')

    if (!cleaned) {
      throw new Error('Telefone obrigatório')
    }

    // Brasil: 10 ou 11 dígitos
    if (cleaned.length < 10 || cleaned.length > 11) {
      throw new Error('Telefone inválido')
    }

    return cleaned
  }

  // =========================
  // SUBMIT
  // =========================

  const handleCreate = async () => {
    try {
      setLoading(true)
      setError(null)

      // Sanitização + validação
      const cleanName = validateName(name)
      const cleanEmail = validateEmail(email)
      const cleanPhone = validatePhone(phone)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        setError('Perfil não encontrado')
        setLoading(false)
        return
      }

      const { error } = await supabase.from('clients').insert([
        {
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          tenant_id: profile.tenant_id,
        },
      ])

      if (error) {
        console.error('Client error:', error)

        setError(`Erro: ${error.message}`)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar cliente')
      setLoading(false)
    }
  }

  return (
    <div>

      {/* BOTÃO VOLTAR */}
      <div style={{ marginBottom: 20 }}>
        <button
          className="btn btn-secondary"
          onClick={() => router.push('/dashboard')}
        >
          ← Dashboard
        </button>
      </div>

      <div className="card">
        <h1 className="title">Novo Cliente</h1>
        <p className="subtitle">Adicionar cliente ao Radar</p>

        <input
          type="text"
          maxLength={50}
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <input
          type="email"
          maxLength={50}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />

        <input
          type="text"
          maxLength={15}
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input"
        />

        {error && <p className="error">{error}</p>}

        <button
          onClick={handleCreate}
          disabled={loading}
          className="button"
        >
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>

    </div>
  )
}
