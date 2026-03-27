import { useState, useEffect, useCallback } from 'react';

const PRESET_SERVICES = [
  { id: 's1', name: 'Haircut', price: 25, emoji: '✂️' },
  { id: 's2', name: 'Hair Color', price: 80, emoji: '🎨' },
  { id: 's3', name: 'Manicure', price: 35, emoji: '💅' },
  { id: 's4', name: 'Pedicure', price: 45, emoji: '🦶' },
  { id: 's5', name: 'Facial', price: 60, emoji: '🧖' },
  { id: 's6', name: 'Massage', price: 90, emoji: '💆' },
  { id: 's7', name: 'Waxing', price: 30, emoji: '🪮' },
  { id: 's8', name: 'Blowout', price: 40, emoji: '💨' },
];

const REWARD_THRESHOLD = 100;
const POINTS_PER_DOLLAR = 1;

const AVATAR_COLORS = [
  ['#7c6af7', '#4a3fc4'],
  ['#f0b429', '#c47d00'],
  ['#34d399', '#059669'],
  ['#f87171', '#dc2626'],
  ['#38bdf8', '#0284c7'],
  ['#fb923c', '#ea580c'],
  ['#a78bfa', '#7c3aed'],
  ['#4ade80', '#16a34a'],
];

function getAvatarColor(name) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function calcPoints(price) {
  return Math.round(price * POINTS_PER_DOLLAR);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function seedCustomers() {
  const names = [
    ['Maria', 'Garcia', 'MGARC'],
    ['James', 'Wilson', 'JWILS'],
    ['Sophie', 'Chen', 'SCHEN'],
    ['David', 'Kim', 'DKIM0'],
    ['Aisha', 'Patel', 'APATE'],
    ['Lucas', 'Brown', 'LBROW'],
  ];
  return names.map(([first, last, code], i) => {
    const pts = [120, 45, 200, 88, 30, 155][i];
    const visits = [8, 3, 14, 5, 2, 10][i];
    const spent = [320, 90, 560, 180, 60, 400][i];
    const history = [];
    for (let j = 0; j < visits; j++) {
      const svc = PRESET_SERVICES[j % 8];
      history.push({ id: generateId(), type: 'add', service: svc.name, price: svc.price, points: calcPoints(svc.price), note: '', ts: Date.now() - (visits - j) * 86400000 * 3 });
    }
    return { id: generateId(), code, name: `${first} ${last}`, email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`, phone: `+1 (555) ${String(Math.floor(Math.random()*900)+100)}-${String(Math.floor(Math.random()*9000)+1000)}`, points: pts, totalSpent: spent, visits, history, createdAt: Date.now() - (i + 1) * 86400000 * 14 };
  });
}

const SVG = (d, size=16) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d={d}/></svg>
);

const Icons = {
  Dashboard: ({size=18}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm9 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm9 0a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z"/></svg>,
  Users: ({size=18}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zM1.5 16.5a7.5 7.5 0 0115 0H1.5z"/></svg>,
  Services: ({size=18}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"/></svg>,
  Rewards: ({size=18}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd"/></svg>,
  Search: ({size=16}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>,
  Plus: ({size=16}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>,
  Close: ({size=16}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  Check: ({size=16}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>,
  Edit: ({size=14}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>,
  Star: ({size=12}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>,
  Gift: ({size=14}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd"/><path d="M9 11H3v5a2 2 0 002 2h4v-7zm2 7h4a2 2 0 002-2v-5h-6v7z"/></svg>,
  TrendUp: ({size=12}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"/></svg>,
  ChevronRight: ({size=14}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
  Adjust: ({size=14}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"/></svg>,
  Mail: ({size=12}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>,
  AddUser: ({size=18}) => <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/></svg>,
};

function Toast({ toasts, removeToast }) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} onClick={() => removeToast(t.id)} style={{cursor:'pointer'}}>
          <span className="toast-icon">{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Avatar({ name, size='sm', eligible=false }) {
  const [bg, fg] = getAvatarColor(name || 'A');
  const initials = name ? name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?';
  return (
    <div className={`avatar ${size==='lg'?'avatar-lg':''}`} style={{background:`linear-gradient(135deg,${bg},${fg})`}}>
      {initials}
      {eligible && <span className="reward-crown">👑</span>}
    </div>
  );
}

function PointsBar({ points }) {
  const pct = Math.min((points / REWARD_THRESHOLD) * 100, 100);
  const isGold = points >= REWARD_THRESHOLD;
  return (
    <div className="points-bar">
      <div className={`points-bar-fill ${isGold?'gold':''}`} style={{width:`${pct}%`}} />
    </div>
  );
}

function CustomerCard({ customer, onClick }) {
  const eligible = customer.points >= REWARD_THRESHOLD;
  return (
    <div className={`customer-card ${eligible?'eligible':''}`} onClick={onClick}>
      <div className="customer-header">
        <Avatar name={customer.name} eligible={eligible} />
        <div style={{flex:1,minWidth:0}}>
          <h3>{customer.name}</h3>
          <div className="customer-code">{customer.code}</div>
          <div style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:'var(--text-muted)',marginTop:1}}>
            <Icons.Mail size={11}/>{customer.email}
          </div>
        </div>
      </div>
      <div className="customer-meta">
        <span className={`meta-chip ${eligible?'gold':'points'}`}><Icons.Star size={11}/>{customer.points} pts</span>
        <span className="meta-chip">{customer.visits} visits</span>
        <span className="meta-chip">${customer.totalSpent}</span>
        {eligible && <span className="reward-badge"><Icons.Gift size={11}/> Reward Ready</span>}
      </div>
      <PointsBar points={customer.points}/>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
        <span style={{fontSize:11,color:'var(--text-muted)'}}>{eligible?'Eligible for reward!': `${REWARD_THRESHOLD-customer.points} pts to reward`}</span>
        <span style={{fontSize:11,color:'var(--text-muted)'}}>{customer.phone}</span>
      </div>
    </div>
  );
}

function AddServiceModal({ customer, onClose, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [tab, setTab] = useState('preset');
  const service = tab==='preset' ? selected : (customName && customPrice ? {name:customName, price:parseFloat(customPrice)} : null);
  const pts = service ? calcPoints(service.price) : 0;
  const willEarn = !!(customer.points < REWARD_THRESHOLD && customer.points + pts >= REWARD_THRESHOLD);

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div><div className="modal-title">Add Service</div><div style={{fontSize:13,color:'var(--text-muted)',marginTop:2}}>for {customer.name}</div></div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.Close/></button>
        </div>
        <div className="modal-body">
          <div className="tabs mb-4">
            <div className={`tab ${tab==='preset'?'active':''}`} onClick={()=>setTab('preset')}>Preset Services</div>
            <div className={`tab ${tab==='custom'?'active':''}`} onClick={()=>setTab('custom')}>Custom Service</div>
          </div>
          {tab==='preset' && (
            <div className="services-grid">
              {PRESET_SERVICES.map(s=>(
                <button key={s.id} className={`service-btn ${selected?.id===s.id?'selected':''}`} onClick={()=>setSelected(s)}>
                  <div style={{fontSize:20,marginBottom:4}}>{s.emoji}</div>
                  <div className="service-btn-name">{s.name}</div>
                  <div className="service-btn-price">${s.price}</div>
                  <div className="service-btn-pts">+{calcPoints(s.price)} pts</div>
                </button>
              ))}
            </div>
          )}
          {tab==='custom' && (
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="input-group"><label className="input-label">Service Name</label><input className="input" placeholder="e.g. Eyebrow threading..." value={customName} onChange={e=>setCustomName(e.target.value)}/></div>
              <div className="input-group"><label className="input-label">Price ($)</label><input className="input" type="number" placeholder="0.00" min="0" step="0.01" value={customPrice} onChange={e=>setCustomPrice(e.target.value)}/></div>
            </div>
          )}
          {pts>0 && (
            <div className="points-preview">
              <span className="points-preview-label">✨ Points to be awarded</span>
              <span className="points-preview-value">+{pts} pts</span>
            </div>
          )}
          {willEarn && (
            <div style={{background:'var(--gold-dim)',border:'1px solid rgba(240,180,41,0.3)',borderRadius:'var(--radius-sm)',padding:'10px 14px',fontSize:13,color:'var(--gold)',display:'flex',alignItems:'center',gap:8}}>
              🎉 This will make {customer.name.split(' ')[0]} eligible for a reward!
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>service&&onSubmit({service:service.name,price:service.price,points:pts})} disabled={!service}>
            <Icons.Plus size={14}/> Award {pts>0?pts+' pts':'Points'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateCustomerModal({ prefillSearch, onClose, onCreate }) {
  const [code, setCode] = useState(prefillSearch.length===5?prefillSearch.toUpperCase():'');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const codeValid = code.length===5 && /^[A-Z0-9]{5}$/.test(code);

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div><div className="modal-title">New Customer</div><div style={{fontSize:13,color:'var(--text-muted)',marginTop:2}}>Add to loyalty program</div></div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.Close/></button>
        </div>
        <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="input-group">
            <label className="input-label">5-Letter Code *</label>
            <input className="input" placeholder="e.g. JSMIT" maxLength={5} value={code} onChange={e=>setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} style={{fontFamily:'Courier New,monospace',letterSpacing:3,fontSize:16}}/>
            {code.length>0&&!codeValid&&<div style={{fontSize:12,color:'var(--red)',marginTop:2}}>Must be exactly 5 letters/numbers</div>}
            {codeValid&&<div style={{fontSize:12,color:'var(--green)',marginTop:2,display:'flex',alignItems:'center',gap:4}}><Icons.Check size={12}/> Valid code</div>}
          </div>
          <div className="input-group"><label className="input-label">Full Name *</label><input className="input" placeholder="e.g. Jane Smith" value={name} onChange={e=>setName(e.target.value)}/></div>
          <div className="input-group"><label className="input-label">Email *</label><input className="input" type="email" placeholder="jane@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div className="input-group"><label className="input-label">Phone (optional)</label><input className="input" placeholder="+1 (555) 000-0000" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>codeValid&&name&&email&&onCreate({code,name,email,phone})} disabled={!codeValid||!name||!email}>
            <Icons.Plus size={14}/> Create Customer
          </button>
        </div>
      </div>
    </div>
  );
}

function ManualAdjustModal({ customer, onClose, onSubmit }) {
  const [adjType, setAdjType] = useState('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const pts = parseInt(amount)||0;
  const canSubmit = pts>0 && note.trim().length>0;
  const newBalance = adjType==='add' ? customer.points+pts : Math.max(0,customer.points-pts);

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div><div className="modal-title">Manual Adjustment</div><div style={{fontSize:13,color:'var(--text-muted)',marginTop:2}}>Current: {customer.points} pts · {customer.name}</div></div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.Close/></button>
        </div>
        <div className="modal-body">
          <div className="adj-type-selector">
            <button className={`adj-type-btn ${adjType==='add'?'add-active':''}`} onClick={()=>setAdjType('add')}>＋ Add Points</button>
            <button className={`adj-type-btn ${adjType==='deduct'?'deduct-active':''}`} onClick={()=>setAdjType('deduct')}>－ Deduct Points</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="input-group"><label className="input-label">Points Amount</label><input className="input" type="number" placeholder="0" min="1" value={amount} onChange={e=>setAmount(e.target.value)}/></div>
            {pts>0&&(
              <div className="points-preview" style={adjType==='deduct'?{background:'var(--red-dim)',border:'1px solid rgba(248,113,113,0.25)'}:{}}>
                <span style={{fontSize:13,color:adjType==='add'?'var(--accent-light)':'var(--red)',fontWeight:500}}>{adjType==='add'?'✨ New balance':'⚠️ New balance'}</span>
                <span style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:700,color:adjType==='add'?'var(--accent-light)':'var(--red)'}}>{newBalance} pts</span>
              </div>
            )}
            <div className="input-group"><label className="input-label">Reason / Note *</label><textarea className="input" placeholder="Required — describe why you're adjusting points..." value={note} onChange={e=>setNote(e.target.value)}/></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className={`btn ${adjType==='add'?'btn-primary':'btn-danger'}`} onClick={()=>canSubmit&&onSubmit({type:adjType,points:pts,note:note.trim()})} disabled={!canSubmit}>
            {adjType==='add'?`＋ Add ${pts} pts`:`－ Deduct ${pts} pts`}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerDetailModal({ customer, onClose, onAddService, onManualAdjust, onEdit, onRedeem }) {
  const [tab, setTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(customer.name);
  const [editPhone, setEditPhone] = useState(customer.phone||'');
  const eligible = customer.points >= REWARD_THRESHOLD;

  const mostUsed = (() => {
    const counts = {};
    customer.history.forEach(h => { if(h.service&&h.service!=='Account Created'&&h.service!=='Manual Adjustment'&&h.service!=='Reward Redeemed 🎁') counts[h.service]=(counts[h.service]||0)+1; });
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    return top ? top[0] : 'N/A';
  })();

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <Avatar name={customer.name} size="lg" eligible={eligible}/>
            <div>
              {editMode ? (
                <div className="inline-edit">
                  <input className="inline-input" value={editName} onChange={e=>setEditName(e.target.value)} style={{fontSize:18,fontFamily:'var(--font-display)',fontWeight:700}}/>
                  <button className="btn btn-sm btn-primary" onClick={()=>{if(editName.trim()){onEdit({name:editName.trim(),phone:editPhone.trim()});setEditMode(false);}}}><Icons.Check size={12}/> Save</button>
                  <button className="btn btn-sm btn-ghost" onClick={()=>setEditMode(false)}>Cancel</button>
                </div>
              ) : (
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div className="modal-title">{customer.name}</div>
                  <button className="btn btn-icon btn-ghost" style={{width:28,height:28}} onClick={()=>setEditMode(true)}><Icons.Edit/></button>
                </div>
              )}
              <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4,flexWrap:'wrap'}}>
                <span style={{fontSize:12,color:'var(--text-muted)',fontFamily:'Courier New,monospace'}}>{customer.code}</span>
                <span style={{fontSize:12,color:'var(--text-muted)'}}>·</span>
                <span style={{fontSize:12,color:'var(--text-muted)'}}>{customer.email}</span>
                {editMode ? (
                  <input className="inline-input" value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="Phone" style={{fontSize:12}}/>
                ) : customer.phone && <span style={{fontSize:12,color:'var(--text-muted)'}}>{customer.phone}</span>}
                {eligible && <span className="reward-badge"><Icons.Gift size={11}/> Reward Ready</span>}
              </div>
            </div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose}><Icons.Close/></button>
        </div>

        <div style={{padding:'16px 28px',borderBottom:'1px solid var(--border)'}}>
          <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
            {[
              {val:customer.points,label:'Points',color:eligible?'var(--gold)':'var(--accent-light)'},
              {val:customer.visits,label:'Visits',color:'var(--text)'},
              {val:`$${customer.totalSpent}`,label:'Total Spent',color:'var(--green)'},
              {val:eligible?'100%':`${Math.round((customer.points/REWARD_THRESHOLD)*100)}%`,label:'Progress',color:'var(--text)'},
            ].map(({val,label,color})=>(
              <div key={label} style={{textAlign:'center',flex:1}}>
                <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:700,color}}>{val}</div>
                <div style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <PointsBar points={customer.points}/>
            <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4,textAlign:'right'}}>
              {eligible?`${customer.points-REWARD_THRESHOLD} pts over threshold`:`${REWARD_THRESHOLD-customer.points} pts until reward`}
            </div>
          </div>
        </div>

        <div style={{padding:'12px 28px',borderBottom:'1px solid var(--border)',display:'flex',gap:8,flexWrap:'wrap'}}>
          <button className="btn btn-primary btn-sm" onClick={onAddService}><Icons.Plus size={12}/> Add Service</button>
          <button className="btn btn-secondary btn-sm" onClick={onManualAdjust}><Icons.Adjust size={12}/> Adjust Points</button>
          {eligible && <button className="btn btn-gold btn-sm" onClick={onRedeem}><Icons.Gift size={12}/> Redeem Reward</button>}
        </div>

        <div style={{padding:'12px 28px',borderBottom:'1px solid var(--border)'}}>
          <div className="tabs">
            <div className={`tab ${tab==='overview'?'active':''}`} onClick={()=>setTab('overview')}>Overview</div>
            <div className={`tab ${tab==='history'?'active':''}`} onClick={()=>setTab('history')}>History ({customer.history.filter(h=>h.service!=='Account Created').length})</div>
          </div>
        </div>

        <div style={{padding:'20px 28px',maxHeight:320,overflowY:'auto'}}>
          {tab==='overview' && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[
                {label:'Member Since',value:new Date(customer.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})},
                {label:'Last Visit',value:customer.history.length>1?formatDate(customer.history[customer.history.length-1].ts):'Never'},
                {label:'Most Used Service',value:mostUsed},
                {label:'Avg Spend/Visit',value:customer.visits>0?`$${(customer.totalSpent/customer.visits).toFixed(2)}`:'$0'},
              ].map(({label,value})=>(
                <div key={label} style={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'14px 16px'}}>
                  <div style={{fontSize:11,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:1,marginBottom:6}}>{label}</div>
                  <div style={{fontSize:14,fontWeight:600}}>{value}</div>
                </div>
              ))}
            </div>
          )}
          {tab==='history' && (
            customer.history.filter(h=>h.service!=='Account Created').length===0 ? (
              <div className="empty-state" style={{padding:'30px 20px'}}><div className="empty-state-icon">📋</div><h3>No history yet</h3></div>
            ) : (
              [...customer.history].filter(h=>h.service!=='Account Created').reverse().map(h=>(
                <div key={h.id} className="history-item">
                  <div className={`history-dot ${h.type}`} style={{marginTop:6}}/>
                  <div className="history-content">
                    <div className="history-service">{h.service}</div>
                    <div className="history-meta">{h.price?`$${h.price}`:''}{h.note?` · ${h.note}`:''} · {formatDate(h.ts)}</div>
                  </div>
                  {h.points>0&&<div className={`history-points ${h.type}`}>{h.type==='add'?'+':'-'}{h.points} pts</div>}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ customers, setPage }) {
  const totalPts = customers.reduce((a,c)=>a+c.points,0);
  const totalRevenue = customers.reduce((a,c)=>a+c.totalSpent,0);
  const eligible = customers.filter(c=>c.points>=REWARD_THRESHOLD);
  const recentActivity = customers.flatMap(c=>c.history.map(h=>({...h,customerName:c.name,customerId:c.id}))).sort((a,b)=>b.ts-a.ts).slice(0,8);
  const topCustomers = [...customers].sort((a,b)=>b.points-a.points).slice(0,5);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple"><Icons.Users size={18}/></div>
          <div className="stat-value">{customers.length}</div>
          <div className="stat-label">Total Customers</div>
        </div>
        <div className="stat-card gold-top">
          <div className="stat-icon gold"><Icons.Star size={18}/></div>
          <div className="stat-value">{totalPts.toLocaleString()}</div>
          <div className="stat-label">Points Issued</div>
        </div>
        <div className="stat-card green-top">
          <div className="stat-icon green"><Icons.TrendUp size={18}/></div>
          <div className="stat-value">${totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card red-top">
          <div className="stat-icon red"><Icons.Gift size={18}/></div>
          <div className="stat-value">{eligible.length}</div>
          <div className="stat-label">Reward Eligible</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
        <div className="card">
          <div className="card-header"><div className="card-title">Recent Activity</div></div>
          <div className="card-body" style={{padding:'0 24px'}}>
            {recentActivity.length===0 ? <div style={{padding:'30px 0',textAlign:'center',color:'var(--text-muted)'}}>No activity yet</div> :
              recentActivity.map(h=>(
                <div key={h.id} className="history-item">
                  <div className={`history-dot ${h.type}`}/>
                  <div className="history-content">
                    <div className="history-service" style={{fontSize:13}}>{h.customerName} · {h.service}</div>
                    <div className="history-meta">{formatDate(h.ts)}</div>
                  </div>
                  {h.points>0&&<div className={`history-points ${h.type}`} style={{fontSize:13}}>{h.type==='add'?'+':'-'}{h.points}</div>}
                </div>
              ))
            }
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Top Customers</div><button className="btn btn-sm btn-ghost" onClick={()=>setPage('customers')}>View All <Icons.ChevronRight size={12}/></button></div>
          <div className="card-body" style={{padding:'8px 24px'}}>
            {topCustomers.length===0 ? <div style={{padding:'30px 0',textAlign:'center',color:'var(--text-muted)'}}>No customers yet</div> :
              topCustomers.map((c,i)=>(
                <div key={c.id} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:i<topCustomers.length-1?'1px solid var(--border)':'none'}}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,color:'var(--text-muted)',width:20,textAlign:'center'}}>#{i+1}</div>
                  <Avatar name={c.name} eligible={c.points>=REWARD_THRESHOLD}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:600}}>{c.name}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{c.visits} visits · ${c.totalSpent}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,color:c.points>=REWARD_THRESHOLD?'var(--gold)':'var(--accent-light)'}}>{c.points}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>pts</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
      {eligible.length>0&&(
        <div className="card" style={{marginTop:20,border:'1px solid rgba(240,180,41,0.25)',background:'linear-gradient(135deg,rgba(240,180,41,0.04),transparent)'}}>
          <div className="card-header">
            <div style={{display:'flex',alignItems:'center',gap:8}}><Icons.Gift/><div className="card-title">🏆 Reward Eligible Customers</div></div>
            <span className="reward-badge">{eligible.length} customers</span>
          </div>
          <div className="card-body" style={{display:'flex',gap:12,flexWrap:'wrap',padding:'16px 24px'}}>
            {eligible.map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:8,background:'var(--gold-dim)',border:'1px solid rgba(240,180,41,0.2)',borderRadius:'var(--radius-sm)',padding:'8px 14px'}}>
                <Avatar name={c.name} eligible/>
                <div><div style={{fontSize:13,fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:'var(--gold)'}}>{c.points} pts</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function CustomersPage({ customers, onSelectCustomer, onCreateCustomer }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const filtered = customers.filter(c=>{
    const q=search.toLowerCase();
    const matchSearch=!q||c.name.toLowerCase().includes(q)||c.code.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||(c.phone&&c.phone.includes(q));
    const matchFilter=filter==='all'||(filter==='eligible'&&c.points>=REWARD_THRESHOLD)||(filter==='active'&&c.visits>5)||(filter==='new'&&c.visits<=2);
    return matchSearch&&matchFilter;
  });
  const noMatch = search.length>0 && filtered.length===0;
  const eligibleCount = customers.filter(c=>c.points>=REWARD_THRESHOLD).length;

  return (
    <>
      <div className="filter-bar">
        <div className="search-bar" style={{maxWidth:380}}>
          <span className="search-icon"><Icons.Search size={15}/></span>
          <input className="input" placeholder="Search by name, code, email, phone..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {[{key:'all',label:`All (${customers.length})`},{key:'eligible',label:`Reward Ready (${eligibleCount})`},{key:'active',label:'Active'},{key:'new',label:'New'}].map(f=>(
          <button key={f.key} className={`filter-chip ${filter===f.key?'active':''}`} onClick={()=>setFilter(f.key)}>{f.label}</button>
        ))}
        <button className="btn btn-primary" style={{marginLeft:'auto'}} onClick={()=>onCreateCustomer(search)}><Icons.Plus size={14}/> New Customer</button>
      </div>
      {noMatch ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No customers found</h3>
          <p>No results for "{search}". Want to add them?</p>
          <button className="btn btn-primary" onClick={()=>onCreateCustomer(search)}><Icons.Plus size={14}/> Create "{search}"</button>
        </div>
      ) : filtered.length===0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No customers yet</h3>
          <p>Start adding customers to your loyalty program.</p>
          <button className="btn btn-primary" onClick={()=>onCreateCustomer('')}><Icons.Plus size={14}/> Add First Customer</button>
        </div>
      ) : (
        <div className="customer-grid">
          {filtered.map(c=><CustomerCard key={c.id} customer={c} onClick={()=>onSelectCustomer(c.id)}/>)}
        </div>
      )}
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <div style={{marginBottom:24,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14}}>
        {PRESET_SERVICES.map(s=>(
          <div key={s.id} className="card" style={{padding:20,transition:'all 0.2s ease',cursor:'default'}} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={e=>e.currentTarget.style.transform=''}>
            <div style={{fontSize:32,marginBottom:10}}>{s.emoji}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,marginBottom:4}}>{s.name}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:22,fontWeight:700,color:'var(--green)'}}>${s.price}</div>
            <div style={{marginTop:8,display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--accent-light)'}}><Icons.Star size={12}/> +{calcPoints(s.price)} points</div>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:24}}>
        <div style={{fontFamily:'var(--font-display)',fontSize:16,fontWeight:700,marginBottom:8}}>💡 Points Policy</div>
        <div style={{fontSize:14,color:'var(--text-muted)',lineHeight:1.8}}>
          Customers earn <strong style={{color:'var(--text)'}}>1 point per $1 spent</strong> on any service. Once they reach <strong style={{color:'var(--gold)'}}>{REWARD_THRESHOLD} points</strong>, they unlock a reward. Custom services follow the same formula. You can manually adjust points at any time with a required note for accountability.
        </div>
      </div>
    </>
  );
}

function RewardsPage({ customers }) {
  const eligible = customers.filter(c=>c.points>=REWARD_THRESHOLD);
  return (
    <>
      <div style={{marginBottom:24,background:'linear-gradient(135deg,rgba(240,180,41,0.08),transparent)',border:'1px solid rgba(240,180,41,0.2)',borderRadius:'var(--radius)',padding:24,display:'flex',alignItems:'center',gap:20}}>
        <div style={{fontSize:48}}>🏆</div>
        <div>
          <div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700}}>{eligible.length} customers eligible for rewards</div>
          <div style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>Customers who reach {REWARD_THRESHOLD} points unlock a free service or discount.</div>
        </div>
      </div>
      {eligible.length===0 ? (
        <div className="empty-state"><div className="empty-state-icon">🎁</div><h3>No eligible customers yet</h3><p>Customers earn rewards after reaching {REWARD_THRESHOLD} points.</p></div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
          {eligible.map(c=>(
            <div key={c.id} className="card" style={{padding:20,border:'1px solid rgba(240,180,41,0.25)',background:'linear-gradient(135deg,rgba(240,180,41,0.04),transparent)',animation:'glow 3s ease infinite'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <Avatar name={c.name} eligible/>
                <div><div style={{fontFamily:'var(--font-display)',fontSize:15,fontWeight:700}}>{c.name}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{c.code} · {c.visits} visits</div></div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <span style={{fontSize:13,color:'var(--text-muted)'}}>Points balance</span>
                <span style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:700,color:'var(--gold)'}}>{c.points}</span>
              </div>
              <PointsBar points={c.points}/>
              <div style={{marginTop:14,fontSize:12,color:'var(--gold)',fontWeight:600}}>✨ Ready to redeem · {c.points-REWARD_THRESHOLD} pts over threshold</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const PAGES = {
  dashboard: { label: 'Dashboard', icon: 'Dashboard' },
  customers: { label: 'Customers', icon: 'Users' },
  services: { label: 'Services', icon: 'Services' },
  rewards: { label: 'Rewards', icon: 'Rewards' },
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [customers, setCustomers] = useState(()=>seedCustomers());
  const [toasts, setToasts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createPrefill, setCreatePrefill] = useState('');

  const selectedCustomer = customers.find(c=>c.id===selectedCustomerId);
  const eligibleCount = customers.filter(c=>c.points>=REWARD_THRESHOLD).length;

  const addToast = useCallback((message, type='success')=>{
    const id = generateId();
    setToasts(t=>[...t,{id,message,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500);
  },[]);

  const removeToast = useCallback(id=>setToasts(t=>t.filter(x=>x.id!==id)),[]);

  function handleCreateCustomer(prefill) { setCreatePrefill(prefill); setShowCreate(true); }

  function handleCreate({code,name,email,phone}) {
    if(customers.find(c=>c.code===code)){addToast(`Code ${code} is already taken`,'error');return;}
    const nc={id:generateId(),code,name,email,phone,points:0,totalSpent:0,visits:0,history:[{id:generateId(),type:'create',service:'Account Created',price:0,points:0,note:'',ts:Date.now()}],createdAt:Date.now()};
    setCustomers(cs=>[...cs,nc]);
    setShowCreate(false);
    addToast(`${name} added to loyalty program 🎉`,'success');
    setSelectedCustomerId(nc.id);
    setPage('customers');
  }

  function handleAddService({service,price,points}) {
    const c=customers.find(c=>c.id===selectedCustomerId);
    const wasEligible=c.points>=REWARD_THRESHOLD;
    const newPts=c.points+points;
    setCustomers(cs=>cs.map(c=>c.id!==selectedCustomerId?c:{...c,points:c.points+points,totalSpent:c.totalSpent+price,visits:c.visits+1,history:[...c.history,{id:generateId(),type:'add',service,price,points,note:'',ts:Date.now()}]}));
    setShowAddService(false);
    if(!wasEligible&&newPts>=REWARD_THRESHOLD){addToast(`🏆 ${c.name} is now eligible for a reward!`,'info');}
    else{addToast(`+${points} points added for ${service}`,'success');}
  }

  function handleManualAdjust({type,points,note}) {
    setCustomers(cs=>cs.map(c=>c.id!==selectedCustomerId?c:{...c,points:type==='add'?c.points+points:Math.max(0,c.points-points),history:[...c.history,{id:generateId(),type,service:'Manual Adjustment',price:0,points,note,ts:Date.now()}]}));
    setShowAdjust(false);
    addToast(`Points ${type==='add'?'added':'deducted'} successfully`,'success');
  }

  function handleEdit({name,phone}) {
    setCustomers(cs=>cs.map(c=>c.id===selectedCustomerId?{...c,name,phone}:c));
    addToast('Customer updated','success');
  }

  function handleRedeem() {
    const c=customers.find(c=>c.id===selectedCustomerId);
    setCustomers(cs=>cs.map(c=>c.id!==selectedCustomerId?c:{...c,points:c.points-REWARD_THRESHOLD,history:[...c.history,{id:generateId(),type:'deduct',service:'Reward Redeemed 🎁',price:0,points:REWARD_THRESHOLD,note:'Reward redeemed by customer',ts:Date.now()}]}));
    addToast(`🎁 Reward redeemed for ${c.name}!`,'info');
  }

  const pageInfo = {
    dashboard:{title:'Dashboard',subtitle:`Welcome back — ${new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}`},
    customers:{title:'Customers',subtitle:`${customers.length} members in your loyalty program`},
    services:{title:'Services',subtitle:'8 preset services + custom options'},
    rewards:{title:'Rewards',subtitle:`${eligibleCount} customer${eligibleCount!==1?'s':''} eligible for rewards`},
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">⭐</div>
            <div><div className="logo-text">LoyaltyOS</div><div className="logo-sub">Store Admin</div></div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {Object.entries(PAGES).map(([key,{label,icon}])=>{
            const Ic = Icons[icon];
            return (
              <div key={key} className={`nav-item ${page===key?'active':''}`} onClick={()=>setPage(key)}>
                <Ic size={18}/>{label}
                {key==='rewards'&&eligibleCount>0&&<span className="nav-badge">{eligibleCount}</span>}
              </div>
            );
          })}
          <div className="nav-section-label" style={{marginTop:8}}>Quick Actions</div>
          <div className="nav-item" onClick={()=>{setPage('customers');handleCreateCustomer('');}}>
            <Icons.AddUser size={18}/> Add Customer
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="version-badge">LoyaltyOS v1.0 · All-frontend</div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-left"><h1>{pageInfo[page].title}</h1><p>{pageInfo[page].subtitle}</p></div>
          <div className="topbar-right">
            {page==='customers'&&<button className="btn btn-primary" onClick={()=>handleCreateCustomer('')}><Icons.Plus size={14}/> New Customer</button>}
            {eligibleCount>0&&<div style={{display:'flex',alignItems:'center',gap:6,background:'var(--gold-dim)',border:'1px solid rgba(240,180,41,0.3)',borderRadius:'var(--radius-sm)',padding:'6px 12px',fontSize:12,color:'var(--gold)',fontWeight:600,cursor:'pointer'}} onClick={()=>setPage('rewards')}>🏆 {eligibleCount} reward{eligibleCount>1?'s':''} ready</div>}
          </div>
        </div>
        <div className="page-content">
          {page==='dashboard'&&<DashboardPage customers={customers} setPage={setPage}/>}
          {page==='customers'&&<CustomersPage customers={customers} onSelectCustomer={id=>setSelectedCustomerId(id)} onCreateCustomer={handleCreateCustomer}/>}
          {page==='services'&&<ServicesPage/>}
          {page==='rewards'&&<RewardsPage customers={customers}/>}
        </div>
      </main>

      {selectedCustomer&&!showAddService&&!showAdjust&&(
        <CustomerDetailModal customer={selectedCustomer} onClose={()=>setSelectedCustomerId(null)} onAddService={()=>setShowAddService(true)} onManualAdjust={()=>setShowAdjust(true)} onEdit={handleEdit} onRedeem={handleRedeem}/>
      )}
      {selectedCustomer&&showAddService&&(
        <AddServiceModal customer={selectedCustomer} onClose={()=>setShowAddService(false)} onSubmit={handleAddService}/>
      )}
      {selectedCustomer&&showAdjust&&(
        <ManualAdjustModal customer={selectedCustomer} onClose={()=>setShowAdjust(false)} onSubmit={handleManualAdjust}/>
      )}
      {showCreate&&(
        <CreateCustomerModal prefillSearch={createPrefill} onClose={()=>setShowCreate(false)} onCreate={handleCreate}/>
      )}
      <Toast toasts={toasts} removeToast={removeToast}/>
    </div>
  );
}
