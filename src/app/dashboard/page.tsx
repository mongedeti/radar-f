'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getRadarStatus, getPriorityScore } from '@/lib/radar'

type Client = {
  id: string
  name: string
  email: string | null
  phone: string | null
  last_contact_at: string | null
  next_contact_at: string | null
  created_at: string
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Nenhum contato registrado'

  const date = new Date(dateString)

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showOnlyRisk, setShowOnlyRisk] = useState(false)
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

    // Tratando pixel somente na primeira vez que acesa a dashboard
	const alreadyTracked = localStorage.getItem('lead_tracked')

	if (!alreadyTracked) {
	  if (typeof window !== 'undefined' && window.fbq) {
	    window.fbq('track', 'Lead')
	  }
	  localStorage.setItem('lead_tracked', 'true')
	}
	  
	// Buscar perfil com trial
    const { data: profile } = await supabase
      .from('profiles')
      .select('trial_started_at')
      .eq('id', user.id)
      .single()

    if (!profile?.trial_started_at) {
      setCheckingTrial(false)
      return
    }

    const start = new Date(profile.trial_started_at)
    const now = new Date()

    const diffInDays =
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)

    if (diffInDays > 30) {
      setTrialExpired(true)
      setCheckingTrial(false)
      return
    }

    // Se trial ainda válido, carregar clientes
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setClients(data)

    setCheckingTrial(false)
    setLoading(false)
  }

  init()
}, [])

  const handleRegisterContact = async (clientId: string) => {
    const now = new Date().toISOString()

    const { error } = await supabase
      .from('clients')
      .update({ last_contact_at: now })
      .eq('id', clientId)

    if (!error) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId ? { ...c, last_contact_at: now } : c
        )
      )
    }
  }

  if (checkingTrial) {
  return <div className="container">Verificando acesso...</div>
}

if (trialExpired) {
  return (
    <div className="container">
      <h1>Seu período de teste terminou.</h1>
      <p style={{ marginTop: 16 }}>
        Você usou o sistema por 30 dias.
        Quer continuar protegendo seus clientes?
      </p>

      <button
        className="btn btn-primary"
        style={{ marginTop: 24 }}
        onClick={() =>
          window.location.href =
            'https://wa.me/5511952815917'
        }
      >
        Falar com o fundador
      </button>
    </div>
  )
}
  
  if (loading) return <div className="container">Carregando...</div>

  const risco = clients.filter(c => getRadarStatus(c.last_contact_at) === 'risco').length
  const atencao = clients.filter(c => getRadarStatus(c.last_contact_at) === 'atenção').length
  const saudavel = clients.filter(c => getRadarStatus(c.last_contact_at) === 'saudável').length

  const hoje = new Date().toISOString().split('T')[0]
  const contatosHoje = clients.filter(
    c => c.next_contact_at && c.next_contact_at.startsWith(hoje)
  ).length

  const sortedClients = [...clients].sort((a, b) => {
    const priorityDiff =
      getPriorityScore(a.last_contact_at) -
      getPriorityScore(b.last_contact_at)

    if (priorityDiff !== 0) return priorityDiff

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const filteredClients = showOnlyRisk
    ? sortedClients.filter(c => getRadarStatus(c.last_contact_at) === 'risco')
    : sortedClients

return (
  <div className="container">

	<div className="page-header">

	  <div>
		<h1 className="page-title">Radar C</h1>
		<div className="user-info">Painel de clientes</div>
	  </div>

	  <div style={{ textAlign: 'right' }}>
		<div style={{ fontSize: 12, marginBottom: 6 }}>
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

    {/* FRASE DE IMPACTO */}
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ marginBottom: 6 }}>
        Nenhum cliente pode cair no esquecimento.
      </h2>
      <p style={{ opacity: 0.7 }}>
        O Radar C mostra quem você precisa contatar antes de perder a oportunidade.
      </p>
    </div>

    {/* ALERTA PSICOLÓGICO */}
    {risco > 0 && (
      <div
        style={{
          background: '#ffe5e5',
          border: '1px solid #ffb3b3',
          padding: 16,
          borderRadius: 8,
          marginBottom: 24,
          fontWeight: 500,
        }}
      >
        ⚠️ Você tem {risco} cliente(s) em risco de esfriar.
      </div>
    )}

    {/* BOTÃO PRINCIPAL */}
    <div style={{ marginBottom: 24 }}>
		<a href="/clients">
		  <button className="btn btn-primary">
			+ Adicionar Cliente
		  </button>
		</a>
    </div>

    {/* MÉTRICAS */}
    <div className="metrics-grid">
      <div className="metric-card metric-risk">
        <div className="metric-title">
          <span className="metric-dot dot-risk"></span>
          Em Risco
        </div>
        <div className="metric-value">{risco}</div>
      </div>

      <div className="metric-card metric-warning">
        <div className="metric-title">
          <span className="metric-dot dot-warning"></span>
          Atenção
        </div>
        <div className="metric-value">{atencao}</div>
      </div>

      <div className="metric-card metric-healthy">
        <div className="metric-title">
          <span className="metric-dot dot-healthy"></span>
          Saudáveis
        </div>
        <div className="metric-value">{saudavel}</div>
      </div>

      <div className="metric-card metric-info">
        <div className="metric-title">
          <span className="metric-dot dot-info"></span>
          Contatos Hoje
        </div>
        <div className="metric-value">{contatosHoje}</div>
      </div>
    </div>

    {/* FILTRO */}
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setShowOnlyRisk(!showOnlyRisk)}
        className={`btn ${showOnlyRisk ? 'btn-danger' : 'btn-secondary'}`}
      >
        {showOnlyRisk
          ? 'Mostrando apenas clientes em risco'
          : 'Mostrar apenas clientes em risco'}
      </button>
    </div>

    {/* LISTA */}
    <ul className="client-list">
      {filteredClients.map((client) => {
        const status = getRadarStatus(client.last_contact_at)

        const badgeClass =
          status === 'risco'
            ? 'badge badge-risk'
            : status === 'atenção'
            ? 'badge badge-warning'
            : 'badge badge-healthy'

        return (
          <li key={client.id} className="client-card">
            <div>
              <strong>{client.name}</strong>
              <div style={{ marginTop: 6 }}>
                <span className={badgeClass}>
                  {status.toUpperCase()}
                </span>
              </div>
            </div>

			<div style={{ textAlign: 'right' }}>
			  <button
				onClick={() => handleRegisterContact(client.id)}
				className="btn btn-primary"
			  >
				Registrar Contato
			  </button>

			  <div
				style={{
				  marginTop: 6,
				  fontSize: 12,
				  opacity: 0.7,
				}}
			  >
				Último contato: {formatDate(client.last_contact_at)}
			  </div>
			</div>
          </li>
        )
      })}
    </ul>

  </div>
)
}
