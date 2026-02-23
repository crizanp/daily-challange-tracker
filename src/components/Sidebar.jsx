import { useState } from 'react'

const FILTERS = ['All', 'Easy', 'Medium', 'Hard']

const DIFF_COLOR = {
  Easy:   '#3ddc84',
  Medium: '#f5a623',
  Hard:   '#f06565',
}

export default function Sidebar({ problems, selectedId, onSelect }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const solved  = problems.filter(p => p.solved).length
  const pct     = Math.round((solved / 100) * 100)

  const filtered = problems.filter(p => {
    const s = p.title.toLowerCase().includes(search.toLowerCase())
    const f = filter === 'All' || p.difficulty === filter
    return s && f
  })

  return (
    <aside style={s.root}>

      {/* Brand */}
      <div style={s.brand}>
        <div style={s.brandTitle}>Cizan Will DO</div>
        <div style={s.brandSub}>Daily grind tracker</div>
      </div>

      {/* 100-day progress bar */}
      <div style={s.progress}>
        <div style={s.progressRow}>
          <span style={s.progressLabel}>100-Day Challenge</span>
          <span style={s.progressCount}>{solved} / 100</span>
        </div>
        <div style={s.bar}>
          <div style={{ ...s.barFill, width: `${pct}%` }} />
        </div>
        <div style={s.progressSub}>{100 - solved} days remaining</div>
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <svg style={s.searchIcon} viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="4.5" stroke="#454a60" strokeWidth="1.5"/>
          <path d="M11 11l2.5 2.5" stroke="#454a60" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          style={s.search}
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div style={s.filters}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...s.filterBtn,
              ...(filter === f ? {
                background: 'rgba(91,127,255,0.12)',
                color: '#5b7fff',
                borderColor: '#5b7fff',
              } : {}),
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={s.list}>
        {filtered.length === 0 && (
          <div style={s.empty}>No problems found</div>
        )}
        {filtered.map(p => {
          const active = selectedId === p.id
          return (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              style={{
                ...s.item,
                ...(active ? s.itemActive : {}),
              }}
            >
              <div style={s.itemRow}>
                <span style={s.dayNum}>Day {String(p.day).padStart(2, '0')}</span>
                {p.solved
                  ? <span style={s.solvedDot} title="Solved">✓</span>
                  : <span style={s.unsolvedDot} />
                }
              </div>
              <div style={{ ...s.itemTitle, color: active ? '#dde1ed' : '#9094a8' }}>
                {p.title}
              </div>
              <div style={{ ...s.diffLabel, color: DIFF_COLOR[p.difficulty] }}>
                {p.difficulty}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

const s = {
  root: {
    width: 220,
    flexShrink: 0,
    background: '#000000',
    borderRight: '1px solid #23272f',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  brand: {
    padding: '18px 16px 14px',
    borderBottom: '1px solid #23272f',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#dde1ed',
    letterSpacing: '-0.3px',
  },
  brandSub: {
    fontSize: 11,
    color: '#454a60',
    marginTop: 2,
  },
  progress: {
    padding: '14px 16px',
    borderBottom: '1px solid #23272f',
  },
  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 11,
    color: '#8b90a8',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  progressCount: {
    fontSize: 12,
    fontWeight: 700,
    color: '#5b7fff',
  },
  bar: {
    height: 4,
    background: '#1e2229',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #5b7fff, #3ddc84)',
    borderRadius: 99,
    transition: 'width 0.4s ease',
  },
  progressSub: {
    fontSize: 11,
    color: '#454a60',
  },
  searchWrap: {
    position: 'relative',
    padding: '10px 10px 6px',
  },
  searchIcon: {
    position: 'absolute',
    left: 18,
    top: '50%',
    transform: 'translateY(-25%)',
    width: 13,
    height: 13,
  },
  search: {
    width: '100%',
    background: '#1e2229',
    border: '1px solid #23272f',
    borderRadius: 6,
    padding: '7px 10px 7px 30px',
    color: '#dde1ed',
    fontSize: 13,
    outline: 'none',
  },
  filters: {
    display: 'flex',
    gap: 4,
    padding: '2px 10px 10px',
  },
  filterBtn: {
    flex: 1,
    padding: '4px 0',
    background: 'none',
    border: '1px solid #23272f',
    borderRadius: 5,
    color: '#454a60',
    fontSize: 11,
    fontWeight: 500,
    transition: 'all 0.15s',
  },
  list: {
    flex: 1,
    overflowY: 'auto',
  },
  empty: {
    padding: '20px 16px',
    color: '#454a60',
    fontSize: 13,
  },
  item: {
    padding: '10px 16px',
    cursor: 'pointer',
    borderLeft: '2px solid transparent',
    transition: 'all 0.12s',
  },
  itemActive: {
    borderLeftColor: '#5b7fff',
    background: 'rgba(91,127,255,0.06)',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  dayNum: {
    fontSize: 10,
    color: '#454a60',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: 600,
  },
  solvedDot: {
    fontSize: 10,
    color: '#3ddc84',
    fontWeight: 700,
  },
  unsolvedDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    border: '1px solid #2c3140',
    display: 'inline-block',
  },
  itemTitle: {
    fontSize: 13,
    marginBottom: 4,
    transition: 'color 0.12s',
  },
  diffLabel: {
    fontSize: 11,
    fontWeight: 500,
  },
}