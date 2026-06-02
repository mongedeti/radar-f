'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="landing-container">

      {/* HEADER */}
      <header className="landing-header">
        <div className="logo">Radar C</div>
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
            Organize seus clientes. Antecipe riscos. Venda com previsibilidade.
          </h1>

          <p className="hero-subtitle">
            O Radar C ajuda autônomos, corretores e representantes comerciais
            a saber exatamente quem precisa de atenção antes que seja tarde.
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
          <h2>Você perde oportunidades por falta de acompanhamento?</h2>
          <p>
            Clientes esquecidos, follow-ups atrasados e negócios esfriando.
            O Radar C mostra quem está em risco e quem está pronto para comprar.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="landing-section">
        <div className="landing-center">
          <h2>Como funciona</h2>

          <div className="grid-3">
            <div>
              <h3>1. Cadastre seus clientes</h3>
              <p>Registre contatos e última interação.</p>
            </div>

            <div>
              <h3>2. Veja o status automaticamente</h3>
              <p>O sistema identifica risco, alerta ou saudável.</p>
            </div>

            <div>
              <h3>3. Aja com estratégia</h3>
              <p>Priorize quem realmente precisa de você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section id="para-quem" className="landing-section section-gray">
        <div className="landing-center">
          <h2>Feito para profissionais de linha de frente</h2>

          <div className="grid-3">
            <div>
              <h3>Autônomos</h3>
              <p>Controle total da sua base de clientes.</p>
            </div>

            <div>
              <h3>Corretores de imóveis</h3>
              <p>Não perca clientes por falta de acompanhamento.</p>
            </div>

            <div>
              <h3>Representantes comerciais</h3>
              <p>Priorize contatos com maior potencial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="landing-section section-dark">
        <div className="landing-center">
          <h2>Comece hoje a vender com mais previsibilidade</h2>

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
  );
}
