'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type User = { id: string; name: string; email: string; balance: number; deals: number; score: number; initials: string; cls: 'sam' | 'lea' | '' };
type Participant = { user: User; paid: boolean; validated: boolean; arrivedAtRelais: boolean };
type Deal = {
  id: string; product: string; url: string; totalCents: number; slots: number; filled: number;
  saving: number; relais: string; deadlineH: number; initiator: User;
  participants: Participant[];
  status: 'OPEN' | 'FUNDED' | 'SHIPPED' | 'COMPLETED' | 'DISPUTED';
  hasPurchased: boolean;
};
type Msg = { who: string; text: string };
type Notif = { title: string; desc: string; time: number };

const SAM: User = { id: 'sam', name: 'Sam D.', email: 'sam@demo.fr', balance: 80000, deals: 3, score: 47, initials: 'SD', cls: 'sam' };
const LEA: User = { id: 'lea', name: 'Léa M.', email: 'lea@demo.fr', balance: 120000, deals: 4, score: 48, initials: 'LM', cls: 'lea' };

function fmt(cents: number) { return Math.round(cents / 100) + ' €'; }
function uid() { return 'd_' + Math.random().toString(36).slice(2, 8); }

export default function AppPage() {
  const [active, setActive] = useState<'sam' | 'lea'>('sam');
  const [users, setUsers] = useState<{ sam: User; lea: User }>({ sam: { ...SAM }, lea: { ...LEA } });
  const [deals, setDeals] = useState<Record<string, Deal>>({});
  const [messages, setMessages] = useState<Record<string, Msg[]>>({});
  const [views, setViews] = useState({
    sam: { tab: 'home' as string, currentDeal: null as string | null, notifs: [] as Notif[], unread: false, showNotifs: false },
    lea: { tab: 'home' as string, currentDeal: null as string | null, notifs: [] as Notif[], unread: false, showNotifs: false },
  });
  const [toast, setToast] = useState('');
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const d1: Deal = {
      id: uid(), product: 'Écran Dell 27" QHD ×2', url: 'fnac.com/ecran-dell-27',
      totalCents: 102000, slots: 2, filled: 2, saving: 9000,
      relais: 'Tabac de la rue Saint-Antoine, Paris 11e', deadlineH: 5,
      initiator: SAM,
      participants: [
        { user: SAM, paid: true, validated: false, arrivedAtRelais: false },
        { user: LEA, paid: true, validated: false, arrivedAtRelais: false },
      ],
      status: 'FUNDED', hasPurchased: false,
    };
    const d2: Deal = {
      id: uid(), product: 'Casque Bose QC45 ×2', url: 'fnac.com/bose-qc45',
      totalCents: 64000, slots: 2, filled: 1, saving: 8000,
      relais: 'Mondial Relay - Bordeaux centre', deadlineH: 24,
      initiator: { id: 'ines', name: 'Inès B.', email: '', balance: 0, deals: 7, score: 49, initials: 'IB', cls: '' },
      participants: [{ user: { id: 'ines', name: 'Inès B.', email: '', balance: 0, deals: 7, score: 49, initials: 'IB', cls: '' }, paid: false, validated: false, arrivedAtRelais: false }],
      status: 'OPEN', hasPurchased: false,
    };
    const d3: Deal = {
      id: uid(), product: 'Pneus Michelin ×4 (lot)', url: 'norauto.fr/lot-pneus',
      totalCents: 56000, slots: 2, filled: 1, saving: 12000,
      relais: 'Relais Colis Carrefour, Lyon 3e', deadlineH: 18,
      initiator: { id: 'max', name: 'Maxime R.', email: '', balance: 0, deals: 2, score: 50, initials: 'MR', cls: '' },
      participants: [{ user: { id: 'max', name: 'Maxime R.', email: '', balance: 0, deals: 2, score: 50, initials: 'MR', cls: '' }, paid: false, validated: false, arrivedAtRelais: false }],
      status: 'OPEN', hasPurchased: false,
    };
    setDeals({ [d1.id]: d1, [d2.id]: d2, [d3.id]: d3 });
    setMessages({
      [d1.id]: [
        { who: 'system', text: 'Léa a rejoint le deal' },
        { who: 'lea', text: 'Salut Sam ! On peut viser jeudi pour le retrait ?' },
        { who: 'sam', text: 'Yes parfait, vers 18h ça te va ?' },
        { who: 'lea', text: 'Nickel 👌' },
      ],
      [d2.id]: [], [d3.id]: [],
    });
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  function pushNotif(userId: 'sam' | 'lea', title: string, desc: string) {
    setViews(v => ({
      ...v,
      [userId]: { ...v[userId], notifs: [{ title, desc, time: Date.now() }, ...v[userId].notifs], unread: true },
    }));
  }

  const currentUser = users[active];
  const currentView = views[active];

  function setView(patch: Partial<typeof views.sam>) {
    setViews(v => ({ ...v, [active]: { ...v[active], ...patch } }));
  }

  const currentDeal = currentView.currentDeal ? deals[currentView.currentDeal] : null;
  const me = currentDeal ? currentDeal.participants.find(p => p.user.id === currentUser.id) : null;

  // ───── Actions ─────
  function joinDeal() {
    if (!currentDeal) return;
    setDeals(d => {
      const upd = { ...d };
      const deal = { ...upd[currentDeal.id] };
      deal.participants = [...deal.participants, { user: currentUser, paid: false, validated: false, arrivedAtRelais: false }];
      deal.filled++;
      upd[currentDeal.id] = deal;
      return upd;
    });
    setMessages(m => ({ ...m, [currentDeal.id]: [...(m[currentDeal.id] || []), { who: 'system', text: `${currentUser.name} a rejoint le deal` }] }));
    showToast('Tu as rejoint le deal');
  }

  function payShare() {
    if (!currentDeal || !me) return;
    const share = Math.ceil(currentDeal.totalCents / currentDeal.slots);
    if (currentUser.balance < share) { showToast('Solde insuffisant'); return; }

    setUsers(u => ({ ...u, [active]: { ...u[active], balance: u[active].balance - share } }));
    setDeals(d => {
      const upd = { ...d };
      const deal = { ...upd[currentDeal.id] };
      deal.participants = deal.participants.map(p => p.user.id === currentUser.id ? { ...p, paid: true } : p);
      if (deal.participants.every(p => p.paid)) deal.status = 'FUNDED';
      upd[currentDeal.id] = deal;
      return upd;
    });
    currentDeal.participants.forEach(p => {
      if (p.user.id !== currentUser.id && (p.user.id === 'sam' || p.user.id === 'lea')) {
        pushNotif(p.user.id as 'sam' | 'lea', 'Paiement reçu', `${currentUser.name} a versé sa part`);
      }
    });
    setView({ tab: 'deal' });
    showToast(`Versé à l'escrow · ${fmt(share)}`);
  }

  function purchase() {
    if (!currentDeal) return;
    setDeals(d => ({ ...d, [currentDeal.id]: { ...d[currentDeal.id], hasPurchased: true } }));
    currentDeal.participants.forEach(p => {
      if (p.user.id !== currentUser.id && (p.user.id === 'sam' || p.user.id === 'lea')) {
        pushNotif(p.user.id as 'sam' | 'lea', 'Commande passée', `${currentUser.name} a commandé sur Fnac`);
      }
    });
    showToast('Commande Fnac passée ✓');
  }

  function simulateArrival() {
    if (!currentDeal) return;
    setDeals(d => ({ ...d, [currentDeal.id]: { ...d[currentDeal.id], status: 'SHIPPED' } }));
    currentDeal.participants.forEach(p => {
      if (p.user.id === 'sam' || p.user.id === 'lea') {
        pushNotif(p.user.id as 'sam' | 'lea', 'Colis arrivé !', `Le colis "${currentDeal.product}" est au relais`);
      }
    });
    showToast('📦 Colis arrivé au relais');
  }

  function scanMutual() {
    if (!currentDeal) return;
    // Le QR scanné par l'autre = preuve de présence simultanée → valide les DEUX d'un coup
    setDeals(d => {
      const upd = { ...d };
      const deal = { ...upd[currentDeal.id] };
      deal.participants = deal.participants.map(p => ({ ...p, arrivedAtRelais: true }));
      upd[currentDeal.id] = deal;
      return upd;
    });
    showToast('QR scanné · présence des deux confirmée');
    setView({ tab: 'validate' });
  }

  function validateReception() {
    if (!currentDeal || !me) return;
    setDeals(d => {
      const upd = { ...d };
      const deal = { ...upd[currentDeal.id] };
      deal.participants = deal.participants.map(p => p.user.id === currentUser.id ? { ...p, validated: true } : p);

      if (deal.participants.every(p => p.validated)) {
        deal.status = 'COMPLETED';
        const initId = deal.initiator.id;
        if (initId === 'sam' || initId === 'lea') {
          setUsers(u => ({
            ...u,
            [initId]: { ...u[initId], balance: u[initId].balance + Math.round(deal.totalCents * 0.97), deals: u[initId].deals + 1 },
          }));
        }
        deal.participants.forEach(p => {
          if (p.user.id === 'sam' || p.user.id === 'lea') {
            pushNotif(p.user.id as 'sam' | 'lea', 'Deal terminé !', `Fonds libérés pour ${deal.product}`);
          }
        });
      } else {
        deal.participants.forEach(p => {
          if (p.user.id !== currentUser.id && (p.user.id === 'sam' || p.user.id === 'lea')) {
            pushNotif(p.user.id as 'sam' | 'lea', 'Validation enregistrée', `${currentUser.name} a validé la réception`);
          }
        });
      }
      upd[currentDeal.id] = deal;
      return upd;
    });

    const allValidated = currentDeal.participants.every(p => p.user.id === currentUser.id || p.validated);
    setView({ tab: allValidated ? 'success' : 'deal' });
    if (!allValidated) showToast('Validation enregistrée');
  }

  function sendMsg(text: string) {
    if (!currentDeal || !text.trim()) return;
    setMessages(m => ({ ...m, [currentDeal.id]: [...(m[currentDeal.id] || []), { who: currentUser.id, text }] }));
    currentDeal.participants.forEach(p => {
      if (p.user.id !== currentUser.id && (p.user.id === 'sam' || p.user.id === 'lea')) {
        pushNotif(p.user.id as 'sam' | 'lea', 'Nouveau message', `${currentUser.name}: ${text.slice(0, 30)}`);
      }
    });
  }

  function createDeal(form: { name: string; url: string; price: number; slots: number; save: number; relais: string }) {
    const nd: Deal = {
      id: uid(), product: form.name, url: form.url,
      totalCents: form.price * 100, slots: form.slots, filled: 1,
      saving: form.save * 100, relais: form.relais, deadlineH: 24,
      initiator: currentUser,
      participants: [{ user: currentUser, paid: false, validated: false, arrivedAtRelais: false }],
      status: 'OPEN', hasPurchased: false,
    };
    setDeals(d => ({ ...d, [nd.id]: nd }));
    setMessages(m => ({ ...m, [nd.id]: [] }));
    setView({ tab: 'deal', currentDeal: nd.id });
    showToast('Deal publié !');
  }

  function openDispute() {
    if (!currentDeal) return;
    setDeals(d => ({ ...d, [currentDeal.id]: { ...d[currentDeal.id], status: 'DISPUTED' } }));
    currentDeal.participants.forEach(p => {
      if (p.user.id === 'sam' || p.user.id === 'lea') {
        pushNotif(p.user.id as 'sam' | 'lea', 'Litige ouvert', `${currentUser.name} a signalé un problème`);
      }
    });
    setView({ tab: 'deal' });
    showToast('Litige enregistré · support contacté');
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        {/* Bandeau démo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Link href="/" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none' }}>← Retour au site</Link>
          <span style={{ fontSize: 11, color: '#5F5E5A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode démo</span>
        </div>

        {/* Switch comptes */}
        <div style={{ display: 'flex', gap: 8, background: '#FAFAF7', padding: 6, borderRadius: 14, marginBottom: 14, border: '1px solid #E5E5E0' }}>
          <button onClick={() => setActive('sam')} style={switchBtn(active === 'sam')}>
            <Avatar user={SAM} size={22} /> <span>Vue Sam</span>
          </button>
          <button onClick={() => setActive('lea')} style={switchBtn(active === 'lea')}>
            <Avatar user={LEA} size={22} /> <span>Vue Léa</span>
          </button>
        </div>

        {/* Phone mockup */}
        <div style={{ background: 'white', border: '1px solid #E5E5E0', borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', fontSize: 11, color: '#5F5E5A', background: '#FAFAF7' }}>
            <span>9:41</span><span>{currentUser.name}</span>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#0F1F3D', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600 }}>
              <svg width="22" height="22" viewBox="0 0 32 32"><circle cx="12" cy="16" r="8" fill="white"/><circle cx="20" cy="16" r="8" fill="#5DCAA5"/></svg>
              <span>splittr</span>
            </div>
            <button onClick={() => setView({ showNotifs: !currentView.showNotifs, unread: false })} style={{ position: 'relative', color: 'white', padding: 6, fontSize: 16 }}>
              🔔
              {currentView.unread && <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: '#FF7A59', borderRadius: '50%' }} />}
            </button>
          </div>

          {/* Notifs popup */}
          {currentView.showNotifs && (
            <div style={{ position: 'absolute', top: 60, right: 12, background: 'white', border: '1px solid #E5E5E0', borderRadius: 12, padding: 12, width: 240, zIndex: 20, boxShadow: '0 4px 12px rgba(15,31,61,0.08)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Notifications</div>
              {currentView.notifs.length === 0 ? (
                <div style={{ color: '#5F5E5A', fontSize: 12, padding: '8px 0' }}>Aucune notification</div>
              ) : currentView.notifs.slice(0, 5).map((n, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: '0.5px solid #F1EFE8', fontSize: 12 }}>
                  <div style={{ fontWeight: 500, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ color: '#5F5E5A', fontSize: 11 }}>{n.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <div style={{ padding: 16, minHeight: 540, background: 'white' }}>
            {currentView.tab === 'home' && <HomeScreen deals={deals} currentUser={currentUser} setView={setView} />}
            {currentView.tab === 'mydeals' && <MyDealsScreen deals={deals} currentUser={currentUser} setView={setView} />}
            {currentView.tab === 'profile' && <ProfileScreen user={currentUser} />}
            {currentView.tab === 'create' && <CreateScreen onCreate={createDeal} onBack={() => setView({ tab: 'home' })} />}
            {currentView.tab === 'deal' && currentDeal && (
              <DealScreen deal={currentDeal} me={me} currentUser={currentUser} setView={setView}
                onJoin={joinDeal} onPurchase={purchase} onSimulateArrival={simulateArrival} />
            )}
            {currentView.tab === 'pay' && currentDeal && <PayScreen deal={currentDeal} onPay={payShare} onBack={() => setView({ tab: 'deal' })} />}
            {currentView.tab === 'qr' && currentDeal && (
              <QRScreen deal={currentDeal} currentUser={currentUser} onScanned={scanMutual} onBack={() => setView({ tab: 'deal' })} />
            )}
            {currentView.tab === 'validate' && currentDeal && <ValidateScreen deal={currentDeal} onValidate={validateReception} onBack={() => setView({ tab: 'deal' })} />}
            {currentView.tab === 'chat' && currentDeal && (
              <ChatScreen deal={currentDeal} currentUser={currentUser} messages={messages[currentDeal.id] || []} onSend={sendMsg} onBack={() => setView({ tab: 'deal' })} />
            )}
            {currentView.tab === 'dispute' && currentDeal && <DisputeScreen onSubmit={openDispute} onBack={() => setView({ tab: 'deal' })} />}
            {currentView.tab === 'success' && currentDeal && <SuccessScreen deal={currentDeal} onBack={() => setView({ tab: 'home', currentDeal: null })} />}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderTop: '1px solid #E5E5E0', background: 'white' }}>
            {[
              { id: 'home', label: 'Deals' },
              { id: 'mydeals', label: 'Mes deals' },
              { id: 'profile', label: 'Profil' },
            ].map(t => (
              <button key={t.id} onClick={() => setView({ tab: t.id, currentDeal: null })}
                style={{ flex: 1, padding: '12px 4px', textAlign: 'center', fontSize: 12, color: currentView.tab === t.id ? '#0F1F3D' : '#5F5E5A', fontWeight: 500 }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Toast */}
          {toast && (
            <div style={{ position: 'absolute', bottom: 80, left: 16, right: 16, background: '#0F1F3D', color: 'white', padding: '11px 14px', borderRadius: 10, fontSize: 13, zIndex: 30 }}>
              {toast}
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#5F5E5A', marginTop: 12 }}>
          Démo interactive · aucune vraie transaction
        </p>
      </div>
    </div>
  );
}

// ━━━ Composants écrans ━━━

function HomeScreen({ deals, currentUser, setView }: { deals: Record<string, Deal>; currentUser: User; setView: (p: any) => void }) {
  const list = Object.values(deals).filter(d => d.status === 'OPEN' && !d.participants.some(p => p.user.id === currentUser.id));
  return (
    <>
      <div style={{ background: '#0F1F3D', color: 'white', padding: 14, borderRadius: 12, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#5DCAA5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#04342C', fontSize: 18, fontWeight: 600 }}>€</div>
        <div style={{ fontSize: 13 }}>
          <b style={{ display: 'block', fontSize: 14, marginBottom: 2 }}>À deux, c&apos;est moins cher.</b>
          Profite des promos sans le risque.
        </div>
      </div>
      <button onClick={() => setView({ tab: 'create' })} style={btnPrimary}>+ Créer un deal</button>
      <div style={{ fontSize: 13, color: '#5F5E5A', margin: '14px 0 8px', fontWeight: 500 }}>Deals ouverts près de chez toi ({list.length})</div>
      {list.length === 0 ? (
        <div style={empty}>Aucun deal disponible. Crée le premier !</div>
      ) : list.map(d => <DealCard key={d.id} deal={d} onClick={() => setView({ tab: 'deal', currentDeal: d.id })} />)}
    </>
  );
}

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  return (
    <div onClick={onClick} style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontWeight: 500, fontSize: 14 }}>{deal.product}</div>
        <Pill label={`${deal.filled}/${deal.slots}`} kind="open" />
      </div>
      <div style={{ fontSize: 13, marginBottom: 4 }}>
        Ta part : <b>{fmt(Math.ceil(deal.totalCents / deal.slots))}</b> · Tu économises <span style={{ color: '#085041', fontWeight: 500 }}>{fmt(deal.saving)}</span>
      </div>
      <div style={{ fontSize: 12, color: '#5F5E5A' }}>{deal.relais.split(',')[0]} · Ferme dans {deal.deadlineH}h</div>
    </div>
  );
}

function MyDealsScreen({ deals, currentUser, setView }: { deals: Record<string, Deal>; currentUser: User; setView: (p: any) => void }) {
  const list = Object.values(deals).filter(d => d.participants.some(p => p.user.id === currentUser.id));
  if (list.length === 0) return <div style={empty}>Aucun deal en cours.<br/>Rejoins-en un depuis l&apos;onglet Deals.</div>;
  return <>{list.map(d => {
    const me = d.participants.find(p => p.user.id === currentUser.id)!;
    let kind: 'open' | 'funded' | 'shipped' | 'complete' | 'dispute' = 'open';
    let label = 'Ouvert';
    if (d.status === 'FUNDED') { kind = 'funded'; label = d.hasPurchased ? 'Commandé' : 'Escrow plein'; }
    if (d.status === 'SHIPPED') { kind = 'shipped'; label = 'Au relais'; }
    if (d.status === 'COMPLETED') { kind = 'complete'; label = 'Terminé'; }
    if (d.status === 'DISPUTED') { kind = 'dispute'; label = 'Litige'; }
    return (
      <div key={d.id} onClick={() => setView({ tab: 'deal', currentDeal: d.id })} style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{d.product}</div>
          <Pill label={label} kind={kind} />
        </div>
        <div style={{ fontSize: 13, color: '#5F5E5A' }}>
          Ta part : {fmt(Math.ceil(d.totalCents / d.slots))}{me.paid && ' · ✓ Payé'}{me.validated && ' · ✓ Validé'}
        </div>
      </div>
    );
  })}</>;
}

function ProfileScreen({ user }: { user: User }) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <Avatar user={user} size={54} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 16 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: '#5F5E5A' }}>{user.email}</div>
        </div>
      </div>
      <Row label="Solde wallet" value={(user.balance / 100).toFixed(2).replace('.', ',') + ' €'} />
      <Row label="Deals complétés" value={String(user.deals)} />
      <Row label="Note moyenne" value={`${(user.score / 10).toFixed(1)}/5 ⭐`} />
      <Row label="Identité vérifiée" value="✓ Oui" success />
      <Row label="Plafond max par deal" value={user.deals >= 5 ? '2 000 €' : '500 €'} last />
    </>
  );
}

function DealScreen({ deal, me, currentUser, setView, onJoin, onPurchase, onSimulateArrival }: any) {
  const isMember = !!me;
  const share = Math.ceil(deal.totalCents / deal.slots);

  let action = null;
  if (!isMember && deal.status === 'OPEN' && deal.filled < deal.slots) {
    action = <button onClick={onJoin} style={btnPrimary}>Rejoindre · {fmt(share)}</button>;
  } else if (isMember && !me.paid && deal.status === 'OPEN') {
    action = <button onClick={() => setView({ tab: 'pay' })} style={btnPrimary}>Verser ma part · {fmt(share)}</button>;
  } else if (isMember && me.paid && deal.status === 'FUNDED' && !deal.hasPurchased && me.user.id === deal.initiator.id) {
    action = <button onClick={onPurchase} style={btnAccent}>Passer commande Fnac</button>;
  } else if (isMember && me.paid && deal.status === 'FUNDED' && !deal.hasPurchased) {
    action = <Banner kind="warn">⏳ En attente que {deal.initiator.name} passe commande</Banner>;
  } else if (isMember && deal.status === 'FUNDED' && deal.hasPurchased) {
    action = <>
      <Banner kind="warn">📦 Commande passée. Le colis est en route...</Banner>
      <button onClick={onSimulateArrival} style={btnGhost}>[Démo] Simuler arrivée au relais</button>
    </>;
  } else if (isMember && deal.status === 'SHIPPED' && !me.arrivedAtRelais) {
    action = <button onClick={() => setView({ tab: 'qr' })} style={btnPrimary}>Je suis au relais · scan QR</button>;
  } else if (isMember && deal.status === 'SHIPPED' && me.arrivedAtRelais && !me.validated) {
    action = <button onClick={() => setView({ tab: 'validate' })} style={btnAccent}>Valider la réception</button>;
  } else if (isMember && me.validated && deal.status !== 'COMPLETED') {
    action = <Banner kind="success">✓ Validé. En attente de l&apos;autre participant.</Banner>;
  }

  const stepsList = [
    { t: 'Deal créé', s: `Par ${deal.initiator.name}`, done: true, active: false },
    { t: 'Escrow rempli', s: `${deal.participants.filter((p: Participant) => p.paid).length}/${deal.slots} ont versé`, done: deal.status !== 'OPEN', active: deal.status === 'OPEN' },
    { t: 'Commande Fnac passée', s: 'Carte virtuelle utilisée', done: deal.hasPurchased, active: deal.status === 'FUNDED' && !deal.hasPurchased },
    { t: 'Livré au relais', s: deal.relais.split(',')[0], done: ['SHIPPED', 'COMPLETED'].includes(deal.status), active: deal.status === 'FUNDED' && deal.hasPurchased },
    { t: 'Validation des deux', s: 'QR mutuel + photo', done: deal.status === 'COMPLETED', active: deal.status === 'SHIPPED' },
  ];

  const canChat = isMember && deal.participants.length > 1;
  const canDispute = isMember && ['SHIPPED', 'FUNDED'].includes(deal.status);

  return (
    <>
      <button onClick={() => setView({ tab: 'home', currentDeal: null })} style={backBtn}>← Retour</button>
      <div style={{ margin: '6px 0 4px', fontSize: 18, fontWeight: 500 }}>{deal.product}</div>
      <div style={{ fontSize: 11, color: '#5F5E5A', marginBottom: 14 }}>{deal.url}</div>
      <div style={{ fontSize: 30, fontWeight: 600, textAlign: 'center', margin: '14px 0 4px' }}>{fmt(share)}</div>
      <div style={{ textAlign: 'center', fontSize: 13, color: '#085041', marginBottom: 18, fontWeight: 500 }}>↓ Tu économises {fmt(deal.saving)}</div>
      <div style={{ background: '#FAFAF7', padding: 12, borderRadius: 10, marginBottom: 16 }}>
        <Row label="Prix total" value={fmt(deal.totalCents)} />
        <Row label="Places" value={`${deal.filled}/${deal.slots}`} />
        <Row label="Point relais" value={deal.relais.split(',')[0]} last small />
      </div>
      <Section title="PARTICIPANTS">
        {deal.participants.map((p: Participant) => (
          <div key={p.user.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
            <Avatar user={p.user} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.user.name}{p.user.id === deal.initiator.id && ' · Initiateur'}</div>
              <div style={{ fontSize: 11, color: '#5F5E5A' }}>
                {p.user.deals} deals · {(p.user.score / 10).toFixed(1)}/5{p.paid && ' · ✓ Payé'}{p.validated && ' · ✓ Validé'}
              </div>
            </div>
          </div>
        ))}
      </Section>
      <Section title="ÉTAPES">
        {stepsList.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, flexShrink: 0,
              background: s.done ? '#5DCAA5' : s.active ? '#0F1F3D' : '#F1EFE8',
              color: s.done ? '#04342C' : s.active ? 'white' : '#888780' }}>{s.done ? '✓' : ''}</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{s.t}</div>
              <div style={{ color: '#5F5E5A', fontSize: 11, marginTop: 1 }}>{s.s}</div>
            </div>
          </div>
        ))}
      </Section>
      {action}
      {canChat && <button onClick={() => setView({ tab: 'chat' })} style={btnGhost}>💬 Discuter avec les participants</button>}
      {canDispute && <button onClick={() => setView({ tab: 'dispute' })} style={btnDanger}>⚠ Signaler un problème</button>}
    </>
  );
}

function CreateScreen({ onCreate, onBack }: { onCreate: (f: any) => void; onBack: () => void }) {
  const [form, setForm] = useState({ name: 'Écran LG UltraGear 32', url: 'https://fnac.com/ecran-lg-32', price: 850, slots: 2, save: 80, relais: 'Mondial Relay - Bar du Centre, Paris 11e' });
  return (
    <>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <div style={{ margin: '6px 0 16px', fontSize: 18, fontWeight: 500 }}>Créer un deal</div>
      <Field label="Lien produit"><input style={input} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /></Field>
      <Field label="Nom du produit"><input style={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Prix total à payer (€)"><input style={input} type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></Field>
      <Field label="Nombre de places"><input style={input} type="number" value={form.slots} onChange={e => setForm({ ...form, slots: +e.target.value })} /></Field>
      <Field label="Économie par personne (€)"><input style={input} type="number" value={form.save} onChange={e => setForm({ ...form, save: +e.target.value })} /></Field>
      <Field label="Point relais"><input style={input} value={form.relais} onChange={e => setForm({ ...form, relais: e.target.value })} /></Field>
      <button onClick={() => onCreate(form)} style={btnPrimary}>Publier le deal</button>
    </>
  );
}

function PayScreen({ deal, onPay, onBack }: { deal: Deal; onPay: () => void; onBack: () => void }) {
  const share = Math.ceil(deal.totalCents / deal.slots);
  return (
    <>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <div style={{ margin: '6px 0 4px', fontSize: 18, fontWeight: 500 }}>Paiement sécurisé</div>
      <div style={{ fontSize: 11, color: '#5F5E5A', marginBottom: 18 }}>Versement à l&apos;escrow Mangopay</div>
      <div style={{ fontSize: 30, fontWeight: 600, textAlign: 'center', margin: '14px 0 4px' }}>{fmt(share)}</div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#5F5E5A', marginBottom: 20 }}>🔒 Bloqué jusqu&apos;à validation des 2 parties</div>
      <Field label="Numéro de carte"><input style={input} value="4242 4242 4242 4242" readOnly /></Field>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}><Field label="Expiration"><input style={input} value="12/27" readOnly /></Field></div>
        <div style={{ flex: 1 }}><Field label="CVC"><input style={input} value="123" readOnly /></Field></div>
      </div>
      <button onClick={onPay} style={btnPrimary}>Payer {fmt(share)}</button>
      <div style={{ fontSize: 10, color: '#5F5E5A', textAlign: 'center', marginTop: 10 }}>Démo · aucune transaction réelle</div>
    </>
  );
}

function QRScreen({ deal, currentUser, onScanned, onBack }: { deal: Deal; currentUser: User; onScanned: () => void; onBack: () => void }) {
  // Génère un faux QR
  const cells = Array.from({ length: 225 }).map((_, i) => Math.random() > 0.5);
  const otherParticipant = deal.participants.find(p => p.user.id !== currentUser.id);
  return (
    <>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <div style={{ margin: '10px 0 8px', fontSize: 18, fontWeight: 500, textAlign: 'center' }}>Scan mutuel au relais</div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#5F5E5A', marginBottom: 14, lineHeight: 1.5 }}>
        Présente ce QR à <b>{otherParticipant?.user.name || 'l\'autre participant'}</b><br/>
        qui doit le scanner avec son appli Splittr.
      </div>
      <div style={{ width: 160, height: 160, background: 'white', border: '1px solid #D3D1C7', borderRadius: 12, margin: '10px auto', display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 1, padding: 10 }}>
        {cells.map((on, i) => <div key={i} style={{ background: on ? '#0F1F3D' : 'transparent', borderRadius: 1 }} />)}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: '#5F5E5A', marginBottom: 14 }}>Code session #{Math.floor(Math.random() * 100000)}</div>
      <div style={{ background: '#FAFAF7', padding: 12, borderRadius: 10, marginBottom: 16 }}>
        <Row label="📍 Géolocalisation" value="✓ Sur place (8m)" success />
        <Row label="🕐 Horaire" value="✓ Relais ouvert" success last />
      </div>
      <button onClick={onScanned} style={btnPrimary}>[Démo] Simuler scan par l&apos;autre</button>
      <div style={{ fontSize: 10, color: '#5F5E5A', textAlign: 'center', marginTop: 8, lineHeight: 1.4 }}>
        Le scan + les 2 géolocs prouvent que vous êtes bien ensemble au relais.
      </div>
    </>
  );
}

function ValidateScreen({ deal, onValidate, onBack }: { deal: Deal; onValidate: () => void; onBack: () => void }) {
  const [photoTaken, setPhotoTaken] = useState(false);
  return (
    <>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <div style={{ margin: '6px 0 4px', fontSize: 18, fontWeight: 500 }}>Valider la réception</div>
      <div style={{ fontSize: 12, color: '#5F5E5A', marginBottom: 18 }}>{deal.relais}</div>
      <div onClick={() => setPhotoTaken(true)} style={{
        width: '100%', height: 130, border: photoTaken ? '1px solid #5DCAA5' : '1px dashed #D3D1C7',
        borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: photoTaken ? '#27500A' : '#888780', fontSize: 13, marginBottom: 12,
        background: photoTaken ? '#EAF3DE' : '#FAFAF7', cursor: 'pointer',
      }}>
        {photoTaken ? '✓ Photo enregistrée' : '📷 Prendre une photo du colis ouvert'}
      </div>
      <div style={{ background: '#FAFAF7', padding: 12, borderRadius: 10, marginBottom: 14 }}>
        <Row label="📍 Scan QR mutuel" value="✓ Validé" success />
        <Row label="🕐 Heure" value={new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} last />
      </div>
      <div style={{ background: '#E1F5EE', color: '#085041', padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 14 }}>
        ✓ Le produit est conforme à la commande
      </div>
      <button onClick={onValidate} disabled={!photoTaken} style={{ ...btnPrimary, opacity: photoTaken ? 1 : 0.4, cursor: photoTaken ? 'pointer' : 'not-allowed' }}>
        Confirmer la réception
      </button>
    </>
  );
}

function ChatScreen({ deal, currentUser, messages, onSend, onBack }: { deal: Deal; currentUser: User; messages: Msg[]; onSend: (t: string) => void; onBack: () => void }) {
  const [text, setText] = useState('');
  const handleSend = () => { if (text.trim()) { onSend(text); setText(''); } };
  return (
    <>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <div style={{ margin: '6px 0 12px', fontSize: 16, fontWeight: 500 }}>{deal.product}</div>
      <div style={{ display: 'flex', flexDirection: 'column', height: 380 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => {
            if (m.who === 'system') return <div key={i} style={{ alignSelf: 'center', background: '#FAEEDA', color: '#633806', fontSize: 11, padding: '5px 10px', borderRadius: 99, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{m.text}</div>;
            const isMe = m.who === currentUser.id;
            const senderName = m.who === 'sam' ? 'Sam D.' : m.who === 'lea' ? 'Léa M.' : m.who;
            return (
              <div key={i} style={{
                maxWidth: '80%', padding: '8px 12px', borderRadius: 14, fontSize: 13,
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                background: isMe ? '#0F1F3D' : '#F1EFE8',
                color: isMe ? 'white' : '#0F1F3D',
                borderBottomRightRadius: isMe ? 4 : 14,
                borderBottomLeftRadius: isMe ? 14 : 4,
              }}>
                {!isMe && <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{senderName}</div>}
                {m.text}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid #E5E5E0' }}>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Message..."
            style={{ flex: 1, padding: '9px 12px', borderRadius: 99, border: '1px solid #D3D1C7', fontSize: 13 }} />
          <button onClick={handleSend} style={{ background: '#0F1F3D', color: 'white', borderRadius: 99, padding: '9px 16px', fontSize: 13, fontWeight: 500 }}>Envoyer</button>
        </div>
      </div>
    </>
  );
}

function DisputeScreen({ onSubmit, onBack }: { onSubmit: () => void; onBack: () => void }) {
  return (
    <>
      <button onClick={onBack} style={backBtn}>← Retour</button>
      <div style={{ margin: '6px 0 4px', fontSize: 18, fontWeight: 500 }}>Signaler un problème</div>
      <div style={{ fontSize: 12, color: '#5F5E5A', marginBottom: 18 }}>Les fonds restent bloqués jusqu&apos;à résolution</div>
      <Field label="Type de problème">
        <select style={input}>
          <option>L&apos;autre ne s&apos;est pas présenté au relais</option>
          <option>Produit défectueux ou non conforme</option>
          <option>L&apos;autre n&apos;a pas validé après réception</option>
          <option>Autre</option>
        </select>
      </Field>
      <Field label="Décris ce qu'il s'est passé">
        <textarea style={{ ...input, minHeight: 80, resize: 'vertical' }} placeholder="Sois précis : date, lieu, échanges..." />
      </Field>
      <div style={{ background: '#FCEBEB', color: '#A32D2D', padding: '10px 12px', borderRadius: 8, fontSize: 11, marginBottom: 14 }}>
        ⚠ Le support contactera les deux parties sous 24h.
      </div>
      <button onClick={onSubmit} style={{ ...btnPrimary, background: '#FF7A59' }}>Ouvrir le litige</button>
    </>
  );
}

function SuccessScreen({ deal, onBack }: { deal: Deal; onBack: () => void }) {
  const [rating, setRating] = useState(0);
  return (
    <>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#5DCAA5', color: '#04342C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px', fontWeight: 600 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>Deal terminé !</div>
        <div style={{ fontSize: 13, color: '#5F5E5A', marginBottom: 18 }}>Les fonds ont été libérés.</div>
      </div>
      <div style={{ background: '#FAFAF7', padding: 14, borderRadius: 10, marginBottom: 16 }}>
        <Row label="Tu as économisé" value={fmt(deal.saving)} success />
        <Row label="Commission Splittr (3%)" value={fmt(Math.round(deal.totalCents * 0.03 / deal.slots))} last />
      </div>
      <div style={{ fontSize: 13, marginBottom: 8, fontWeight: 500 }}>Note ton co-acheteur</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '12px 0' }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setRating(n)} style={{ fontSize: 24, color: n <= rating ? '#FF7A59' : '#D3D1C7' }}>★</button>
        ))}
      </div>
      <button onClick={onBack} style={btnPrimary}>Retour à l&apos;accueil</button>
    </>
  );
}

// ━━━ Composants atomiques ━━━

function Avatar({ user, size = 36 }: { user: User; size?: number }) {
  const bg = user.cls === 'lea' ? '#FF7A59' : user.cls === 'sam' ? '#5DCAA5' : '#B5D4F4';
  const fg = user.cls === 'lea' ? 'white' : user.cls === 'sam' ? '#04342C' : '#0C447C';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 600, flexShrink: 0 }}>
      {user.initials}
    </div>
  );
}

function Pill({ label, kind }: { label: string; kind: 'open' | 'funded' | 'shipped' | 'complete' | 'dispute' }) {
  const styles = {
    open: { bg: '#E1F5EE', fg: '#085041' },
    funded: { bg: '#E6F1FB', fg: '#0C447C' },
    shipped: { bg: '#FAEEDA', fg: '#633806' },
    complete: { bg: '#EAF3DE', fg: '#27500A' },
    dispute: { bg: '#FCEBEB', fg: '#A32D2D' },
  }[kind];
  return <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', background: styles.bg, color: styles.fg }}>{label}</span>;
}

function Row({ label, value, success, last, small }: { label: string; value: string; success?: boolean; last?: boolean; small?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 14, borderBottom: last ? 'none' : '0.5px solid #F1EFE8' }}>
      <span style={{ color: '#5F5E5A', fontSize: 13 }}>{label}</span>
      <span style={{ fontWeight: 500, color: success ? '#085041' : '#0F1F3D', fontSize: small ? 11 : 14, textAlign: 'right', maxWidth: small ? 180 : 'auto' }}>{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ fontSize: 12, color: '#5F5E5A', margin: '0 0 8px', fontWeight: 600, letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ marginBottom: 16 }}>{children}</div>
    </>
  );
}

function Banner({ kind, children }: { kind: 'warn' | 'success'; children: React.ReactNode }) {
  const colors = kind === 'warn' ? { bg: '#FAEEDA', fg: '#633806' } : { bg: '#EAF3DE', fg: '#27500A' };
  return <div style={{ background: colors.bg, color: colors.fg, padding: '10px 12px', borderRadius: 8, fontSize: 12, marginBottom: 12, fontWeight: 500 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ display: 'block', fontSize: 12, color: '#5F5E5A', marginBottom: 5, fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  );
}

// ━━━ Styles ━━━

const switchBtn = (active: boolean): React.CSSProperties => ({
  flex: 1, padding: 10, borderRadius: 10,
  background: active ? '#0F1F3D' : 'transparent',
  color: active ? 'white' : '#5F5E5A',
  fontSize: 13, fontWeight: active ? 500 : 400,
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
});

const card: React.CSSProperties = {
  padding: 14, border: '1px solid #E5E5E0', borderRadius: 12, marginBottom: 10, cursor: 'pointer',
};

const empty: React.CSSProperties = {
  textAlign: 'center', color: '#5F5E5A', fontSize: 13, padding: '40px 20px',
};

const input: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: 10, border: '1px solid #D3D1C7',
  background: 'white', fontSize: 14, color: '#0F1F3D',
};

const baseBtn: React.CSSProperties = {
  display: 'block', width: '100%', padding: 12, borderRadius: 10,
  fontSize: 14, fontWeight: 500, marginBottom: 8,
};

const btnPrimary: React.CSSProperties = { ...baseBtn, background: '#0F1F3D', color: 'white' };
const btnAccent: React.CSSProperties = { ...baseBtn, background: '#5DCAA5', color: '#04342C' };
const btnGhost: React.CSSProperties = { ...baseBtn, background: 'transparent', color: '#0F1F3D', border: '1px solid #D3D1C7' };
const btnDanger: React.CSSProperties = { ...baseBtn, background: 'transparent', color: '#A32D2D', border: '1px solid #F09595' };

const backBtn: React.CSSProperties = {
  background: 'transparent', color: '#5F5E5A', fontSize: 13, padding: 0, marginBottom: 8,
};
