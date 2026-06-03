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
        Organize as férias da sua equipe sem planilhas e sem surpresas.
      </h1>

      <p className="hero-subtitle">
        O Radar F ajuda gestores e pequenas empresas a planejar férias,
        visualizar ausências futuras e manter a operação organizada.
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
      <h2>Você sabe exatamente quem estará de férias nos próximos meses?</h2>

      <p>
        Férias anotadas em planilhas, mensagens espalhadas e dificuldade
        para visualizar ausências futuras. O Radar F centraliza tudo em
        um único lugar.
      </p>
    </div>
  </section>

  {/* COMO FUNCIONA */}
  <section id="como-funciona" className="landing-section">
    <div className="landing-center">
      <h2>Como funciona</h2>

      <div className="grid-3">
        <div>
          <h3>1. Cadastre seus colaboradores</h3>
          <p>Mantenha uma lista organizada da sua equipe.</p>
        </div>

        <div>
          <h3>2. Agende as férias</h3>
          <p>Defina datas de início e término em poucos segundos.</p>
        </div>

        <div>
          <h3>3. Visualize tudo com antecedência</h3>
          <p>Saiba quem estará ausente e planeje sua operação.</p>
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
          <p>Organize férias sem depender de planilhas complexas.</p>
        </div>

        <div>
          <h3>Gestores</h3>
          <p>Visualize ausências futuras e evite conflitos de agenda.</p>
        </div>

        <div>
          <h3>Administrativo</h3>
          <p>Mantenha registros centralizados e fáceis de consultar.</p>
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

)
}
