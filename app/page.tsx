'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <Logo />
        <Link href="/app" style={{
          background: '#0F1F3D',
          color: 'white',
          padding: '0.6rem 1.2rem',
          borderRadius: 99,
          fontSize: 14,
          fontWeight: 500,
          textDecoration: 'none',
        }}>Essayer la démo →</Link>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem 4rem', textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          background: '#EAF3DE',
          color: '#27500A',
          padding: '0.4rem 0.9rem',
          borderRadius: 99,
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem',
        }}>🇫🇷 Bêta · Lancement en France</div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
          fontWeight: 600,
          lineHeight: 1.1,
          marginBottom: '1.2rem',
          letterSpacing: '-0.02em',
        }}>À deux, c&apos;est moins cher.</h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#5F5E5A',
          maxWidth: 600,
          margin: '0 auto 2.5rem',
        }}>
          Profite des promos volume Fnac, Darty, Boulanger sans avoir à acheter en double. Trouve un co-acheteur, payez chacun votre part, validez ensemble au point relais.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/app" style={{
            background: '#0F1F3D', color: 'white',
            padding: '0.9rem 1.8rem', borderRadius: 99, fontSize: 15, fontWeight: 500,
            textDecoration: 'none',
          }}>Tester la démo</Link>
          <a href="#comment" style={{
            background: 'transparent', color: '#0F1F3D',
            padding: '0.9rem 1.8rem', borderRadius: 99, fontSize: 15, fontWeight: 500,
            textDecoration: 'none', border: '1px solid #D3D1C7',
          }}>Comment ça marche</a>
        </div>

        {/* Trust indicators */}
        <div style={{
          display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3rem',
          flexWrap: 'wrap', fontSize: 13, color: '#5F5E5A',
        }}>
          <span>🔒 Paiement séquestré (Mangopay)</span>
          <span>✓ Identité vérifiée</span>
          <span>📦 Validation au relais</span>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" style={{
        background: 'white',
        padding: '4rem 1.5rem',
        borderTop: '1px solid #E5E5E0',
        borderBottom: '1px solid #E5E5E0',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, textAlign: 'center', marginBottom: '0.5rem' }}>
            Comment ça marche
          </h2>
          <p style={{ textAlign: 'center', color: '#5F5E5A', marginBottom: '3rem' }}>
            Cinq étapes, zéro embrouille.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { n: '1', t: 'Tu repères une promo', d: '"2 écrans achetés = -30%". Tu poses le lien sur Splittr.' },
              { n: '2', t: 'Quelqu\'un rejoint', d: 'Un co-acheteur valide les conditions et le point relais.' },
              { n: '3', t: 'Vous payez chacun', d: 'L\'argent est bloqué dans un escrow Mangopay sécurisé.' },
              { n: '4', t: 'Commande passée', d: 'L\'app génère une carte virtuelle pour payer la Fnac.' },
              { n: '5', t: 'Retrait à deux', d: 'RDV au relais, scan QR mutuel, fonds libérés.' },
            ].map(s => (
              <div key={s.n} style={{
                padding: '1.2rem',
                background: '#FAFAF7',
                borderRadius: 16,
                border: '1px solid #E5E5E0',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 99,
                  background: '#0F1F3D', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, marginBottom: '0.8rem',
                }}>{s.n}</div>
                <div style={{ fontWeight: 500, marginBottom: '0.3rem', fontSize: 15 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemples */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, textAlign: 'center', marginBottom: '0.5rem' }}>
          Pour quels achats ?
        </h2>
        <p style={{ textAlign: 'center', color: '#5F5E5A', marginBottom: '3rem' }}>
          Tout ce qui se vend en lot avec une promo volume.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { e: '🖥️', t: 'High-tech', d: 'Écrans, GPU, manettes' },
            { e: '🎧', t: 'Audio', d: 'Casques, écouteurs en lot' },
            { e: '🚗', t: 'Auto', d: 'Pneus (lots de 2 ou 4)' },
            { e: '👶', t: 'Famille', d: 'Couches, lait infantile, lots' },
            { e: '🏋️', t: 'Sport', d: 'Compléments, packs nutrition' },
            { e: '📚', t: 'Études', d: 'Manuels, packs scolaires' },
          ].map(c => (
            <div key={c.t} style={{
              padding: '1.2rem', background: 'white', borderRadius: 16,
              border: '1px solid #E5E5E0',
            }}>
              <div style={{ fontSize: 28, marginBottom: '0.5rem' }}>{c.e}</div>
              <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>{c.t}</div>
              <div style={{ fontSize: 13, color: '#5F5E5A' }}>{c.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{
        background: '#0F1F3D', color: 'white',
        padding: '4rem 1.5rem', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: '1rem' }}>
          Prêt à économiser ?
        </h2>
        <p style={{ color: '#B5D4F4', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
          La démo est ouverte. Teste l&apos;appli avec deux comptes pour voir comment ça marche entre deux acheteurs.
        </p>
        <Link href="/app" style={{
          background: '#5DCAA5', color: '#04342C',
          padding: '0.9rem 2rem', borderRadius: 99, fontSize: 15, fontWeight: 500,
          textDecoration: 'none', display: 'inline-block',
        }}>Lancer la démo →</Link>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1.5rem', textAlign: 'center', fontSize: 13, color: '#5F5E5A',
      }}>
        <Logo small />
        <div style={{ marginTop: '0.8rem' }}>© 2026 Splittr · Bêta privée · Achat groupé sécurisé</div>
      </footer>
    </main>
  );
}

function Logo({ small = false }: { small?: boolean }) {
  const size = small ? 20 : 28;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <circle cx="12" cy="16" r="8" fill="#0F1F3D"/>
        <circle cx="20" cy="16" r="8" fill="#5DCAA5"/>
      </svg>
      <span style={{
        fontSize: small ? 14 : 18,
        fontWeight: 600, color: '#0F1F3D', letterSpacing: '-0.01em',
      }}>splittr</span>
    </div>
  );
}
