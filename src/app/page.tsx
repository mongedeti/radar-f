'use client'

import Link from 'next/link'

export default function Home() {
return ( <div className="landing-container">

```
  {/* HEADER */}
  <header className="landing-header">
    <div className="logo">Radar F</div>
    <div className="header-links">
      <a href="#como-funciona">Como funciona</a>
      <a href="#para-quem">Para quem</a>
      <a href="/login">Entrar</a>
    </div>
  </header>

  {/* HERO */}
  <section className="landing-section">
    <div className="landing-center">
      <h1 className="hero-title">
        Controle férias sem planilhas. Evite vencimentos. Organize sua equipe.
      </h1>

      <p className="hero-subtitle">
        O Radar F ajuda empresas e gestores a acompanhar períodos aquisitivos,
        férias programadas e vencimentos com total facilidade.
      </p>

      <Link
        href="/signup"
        className="btn-primary-large"
        onClick={() => {
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'ComecarAgora')
          }
        }}
      >
        Começar agora
      </Link>

      <p
        style={{
          marginTop: '16px',
          opacity: 0.8,
          fontSize: '14px',
        }}
      >
        30 dias grátis • depois apenas R$ 9,90/mês
      </p>
    </div>
  </section>

  {/* PROBLEMA */}
  <section className="landing-section section-gray">
    <div className="landing-center">
      <h2>Você controla férias em planilhas e corre o risco de esquecer prazos?</h2>
      <p>
        Férias vencidas, informações espalhadas e dificuldades para planejar
        ausências. O Radar F mostra exatamente quem precisa sair de férias
        e quando agir.
      </p>
    </div>
  </section>

  {/* COMO FUNCIONA */}
  <section id="como-funciona" className="landing-section">
    <div className="landing-center">
      <h2>Como funciona</h2>

      <div className="grid-3">
        <div>
          <h3>1. Cadastre seus funcionários</h3>
          <p>Registre admissões e informações básicas da equipe.</p>
        </div>

        <div>
          <h3>2. Acompanhe os períodos</h3>
          <p>O sistema calcula saldos e identifica vencimentos automaticamente.</p>
        </div>

        <div>
          <h3>3. Planeje com antecedência</h3>
          <p>Organize férias sem conflitos e mantenha a operação equilibrada.</p>
        </div>
      </div>
    </div>
  </section>

  {/* PARA QUEM É */}
  <section id="para-quem" className="landing-section section-gray">
    <div className="landing-center">
      <h2>Feito para quem precisa organizar equipes</h2>

      <div className="grid-3">
        <div>
          <h3>Pequenas empresas</h3>
          <p>Controle simples e centralizado das férias dos colaboradores.</p>
        </div>

        <div>
          <h3>Gestores</h3>
          <p>Visualize ausências futuras e evite surpresas na operação.</p>
        </div>

        <div>
          <h3>Setores administrativos</h3>
          <p>Mantenha registros organizados sem depender de planilhas.</p>
        </div>
      </div>
    </div>
  </section>

  {/* CTA FINAL */}
  <section className="landing-section section-dark">
    <div className="landing-center">
      <h2>Comece hoje a organizar as férias da sua equipe</h2>

      <p
        style={{
          marginTop: '12px',
          marginBottom: '24px',
          opacity: 0.85,
        }}
      >
        Teste grátis por 30 dias. Depois, apenas R$ 9,90/mês.
      </p>

      <Link
        href="/signup"
        className="btn-outline-light"
        onClick={() => {
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', 'ComecarAgora')
          }
        }}
      >
        Criar conta
      </Link>
    </div>
  </section>

</div>
```

);
}
