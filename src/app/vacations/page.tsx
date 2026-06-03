'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function NewVacation() {
const router = useRouter()

const [employeeName, setEmployeeName] = useState('')
const [startDate, setStartDate] = useState('')
const [endDate, setEndDate] = useState('')
const [notes, setNotes] = useState('')

const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const invisibleChars = /[\u200B-\u200D\uFEFF]/g

const validateName = (value: string) => {
const normalized = value
.normalize('NFKC')
.replace(invisibleChars, '')
.trim()
.replace(/\s+/g, ' ')

if (!normalized) {
  throw new Error('Nome do colaborador é obrigatório')
}

if (normalized.length < 3 || normalized.length > 80) {
  throw new Error(
    'Nome deve ter entre 3 e 80 caracteres'
  )
}

return normalized
}

const handleCreate = async () => {
try {
setLoading(true)
setError(null)

  const cleanName = validateName(employeeName)

  if (!startDate) {
    throw new Error(
      'Data inicial é obrigatória'
    )
  }

  if (!endDate) {
    throw new Error(
      'Data final é obrigatória'
    )
  }

  if (
    new Date(endDate) <
    new Date(startDate)
  ) {
    throw new Error(
      'A data final não pode ser menor que a inicial'
    )
  }

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

  const { error } = await supabase
    .from('radarf_vacations')
    .insert([
      {
        employee_name: cleanName,
        start_date: startDate,
        end_date: endDate,
        notes,
        tenant_id: profile.tenant_id,
      },
    ])

  if (error) {
    console.error(error)

    setError(
      `Erro ao salvar: ${error.message}`
    )

    setLoading(false)
    return
  }

  router.push('/dashboard')
} catch (err: any) {
  setError(
    err.message ||
      'Erro ao cadastrar férias'
  )

  setLoading(false)
}

}

return ( <div>

  <div style={{ marginBottom: 20 }}>
    <button
      className="btn btn-secondary"
      onClick={() =>
        router.push('/dashboard')
      }
    >
      ← Dashboard
    </button>
  </div>

  <div className="card">

    <h1 className="title">
      Cadastrar Férias
    </h1>

    <p className="subtitle">
      Registre um período de férias
    </p>

    <input
      type="text"
      maxLength={80}
      placeholder="Nome do colaborador"
      value={employeeName}
      onChange={(e) =>
        setEmployeeName(
          e.target.value
        )
      }
      className="input"
    />

    <label
      style={{
        marginTop: 10,
        marginBottom: 5,
      }}
    >
      Data de início
    </label>

    <input
      type="date"
      value={startDate}
      onChange={(e) =>
        setStartDate(
          e.target.value
        )
      }
      className="input"
    />

    <label
      style={{
        marginTop: 10,
        marginBottom: 5,
      }}
    >
      Data de término
    </label>

    <input
      type="date"
      value={endDate}
      onChange={(e) =>
        setEndDate(
          e.target.value
        )
      }
      className="input"
    />

    <textarea
      placeholder="Observações (opcional)"
      value={notes}
      onChange={(e) =>
        setNotes(e.target.value)
      }
      className="input"
      rows={4}
    />

    {error && (
      <p className="error">
        {error}
      </p>
    )}

    <button
      onClick={handleCreate}
      disabled={loading}
      className="button"
    >
      {loading
        ? 'Salvando...'
        : 'Salvar Férias'}
    </button>

  </div>

</div>

)
}
