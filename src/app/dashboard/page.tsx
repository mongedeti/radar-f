'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Vacation = {
id: string
employee_name: string
start_date: string
end_date: string
status: string
created_at: string
}

function formatDate(dateString: string) {
return new Date(dateString).toLocaleDateString('pt-BR', {
day: '2-digit',
month: '2-digit',
year: 'numeric',
})
}

function daysUntil(dateString: string) {
const today = new Date()
const target = new Date(dateString)

const diff =
target.getTime() - today.getTime()

return Math.ceil(
diff / (1000 * 60 * 60 * 24)
)
}

export default function Dashboard() {
const [vacations, setVacations] = useState<Vacation[]>([])
const [loading, setLoading] = useState(true)
const [trialExpired, setTrialExpired] = useState(false)
const [checkingTrial, setCheckingTrial] = useState(true)
const [userEmail, setUserEmail] = useState<string | null>(null)

const handleLogout = async () => {
await supabase.auth.signOut()
window.location.href = '/login'
}

useEffect(() => {
const init = async () => {
const {
data: { user },
} = await supabase.auth.getUser()

  if (!user) return

  setUserEmail(user.email ?? null)

  const alreadyTracked =
    localStorage.getItem('lead_tracked')

  if (!alreadyTracked) {
    if (
      typeof window !== 'undefined' &&
      window.fbq
    ) {
      window.fbq('track', 'Lead')
    }

    localStorage.setItem(
      'lead_tracked',
      'true'
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('trial_started_at')
    .eq('id', user.id)
    .single()

  if (!profile?.trial_started_at) {
    setCheckingTrial(false)
    return
  }

  const start = new Date(
    profile.trial_started_at
  )

  const now = new Date()

  const diffInDays =
    (now.getTime() - start.getTime()) /
    (1000 * 60 * 60 * 24)

  if (diffInDays > 30) {
    setTrialExpired(true)
    setCheckingTrial(false)
    return
  }

  const { data } = await supabase
    .from('radarf_vacations')
    .select('*')
    .order('start_date', {
      ascending: true,
    })

  if (data) {
    setVacations(data)
  }

  setLoading(false)
  setCheckingTrial(false)
}

init()

}, [])

if (checkingTrial) {
return ( <div className="container">
Verificando acesso... </div>
)
}

if (trialExpired) {
return ( <div className="container"> <h1>
Seu período de teste terminou. </h1>

    <p style={{ marginTop: 16 }}>
      Você usou o sistema por 30 dias.
      Quer continuar organizando as
      férias da sua equipe?
    </p>

    <button
      className="btn btn-primary"
      style={{ marginTop: 24 }}
      onClick={() =>
        (window.location.href =
          'https://wa.me/5511952815917')
      }
    >
      Falar com o fundador
    </button>
  </div>
)

}

if (loading) {
return ( <div className="container">
Carregando... </div>
)
}

const today = new Date()

const upcoming = vacations.filter(v => {
const start = new Date(v.start_date)
const diff =
(start.getTime() - today.getTime()) /
(1000 * 60 * 60 * 24)


return diff >= 0 && diff <= 30

}).length

const active = vacations.filter(v => {
const start = new Date(v.start_date)
const end = new Date(v.end_date)

return (
  today >= start &&
  today <= end
)

}).length

const endingSoon = vacations.filter(v => {
const end = new Date(v.end_date)

const diff =
  (end.getTime() - today.getTime()) /
  (1000 * 60 * 60 * 24)

return diff >= 0 && diff <= 7

}).length

return ( <div className="container">

  <div className="page-header">

    <div>
      <h1 className="page-title">
        Radar F
      </h1>

      <div className="user-info">
        Painel de férias
      </div>
    </div>

    <div style={{ textAlign: 'right' }}>
      <div
        style={{
          fontSize: 12,
          marginBottom: 6,
        }}
      >
        {userEmail}
      </div>

      <button
        className="btn btn-secondary"
        onClick={handleLogout}
      >
        Sair
      </button>
    </div>

  </div>

  <div style={{ marginBottom: 24 }}>
    <h2 style={{ marginBottom: 6 }}>
      Nenhuma ausência deve pegar sua equipe de surpresa.
    </h2>

    <p style={{ opacity: 0.7 }}>
      Organize férias e visualize
      ausências futuras com antecedência.
    </p>
  </div>

  {upcoming > 0 && (
    <div
      style={{
        background: '#fff3cd',
        border: '1px solid #ffe69c',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        fontWeight: 500,
      }}
    >
      ⚠️ Você possui {upcoming} férias
      iniciando nos próximos 30 dias.
    </div>
  )}

  <div style={{ marginBottom: 24 }}>
    <a href="/vacations">
      <button className="btn btn-primary">
        + Cadastrar Férias
      </button>
    </a>
  </div>

  <div className="metrics-grid">

    <div className="metric-card metric-info">
      <div className="metric-title">
        Próximas Férias
      </div>

      <div className="metric-value">
        {upcoming}
      </div>
    </div>

    <div className="metric-card metric-healthy">
      <div className="metric-title">
        Em Andamento
      </div>

      <div className="metric-value">
        {active}
      </div>
    </div>

    <div className="metric-card metric-warning">
      <div className="metric-title">
        Finalizando
      </div>

      <div className="metric-value">
        {endingSoon}
      </div>
    </div>

    <div className="metric-card metric-risk">
      <div className="metric-title">
        Total Agendadas
      </div>

      <div className="metric-value">
        {vacations.length}
      </div>
    </div>

  </div>

  <ul className="client-list">

    {vacations.map(vacation => (

      <li
        key={vacation.id}
        className="client-card"
      >

        <div>
          <strong>
            {vacation.employee_name}
          </strong>

          <div
            style={{
              marginTop: 8,
              opacity: 0.7,
            }}
          >
            {formatDate(
              vacation.start_date
            )}{' '}
            até{' '}
            {formatDate(
              vacation.end_date
            )}
          </div>
        </div>

        <div
          style={{
            textAlign: 'right',
          }}
        >
          <span className="badge badge-warning">
            INICIA EM{' '}
            {daysUntil(
              vacation.start_date
            )}{' '}
            DIAS
          </span>
        </div>

      </li>

    ))}

  </ul>

</div>
)
}
