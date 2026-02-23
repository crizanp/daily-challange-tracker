const DIFF_COLOR = {
  Easy:   '#3ddc84',
  Medium: '#f5a623',
  Hard:   '#f06565',
}

// Build 100 day cells — filled based on problems array
export default function RightPanel({ problem, problems }) {
  const solved     = problems.filter(p => p.solved).length
  const remaining  = 100 - solved
  const solvedDays = new Set(problems.filter(p => p.solved).map(p => p.day))

  return (
    <aside style={s.root}>

      {/* Complexity */}
      <div style={s.card}>
        <div style={s.cardLabel}>Complexity</div>
        <div style={s.complexRow}>
          <div style={s.complexItem}>
            <div style={s.complexKey}>Time</div>
            <div style={s.complexVal}>{problem.complexity.time}</div>
          </div>
          <div style={s.divider} />
          <div style={s.complexItem}>
            <div style={s.complexKey}>Space</div>
            <div style={s.complexVal}>{problem.complexity.space}</div>
          </div>
          <div style={s.divider} />
          <div style={s.complexItem}>
            <div style={s.complexKey}>Difficulty</div>
            <div style={{ ...s.complexVal, color: DIFF_COLOR[problem.difficulty] }}>
              {problem.difficulty}
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={s.card}>
        <div style={s.cardLabel}>Topics</div>
        <div style={s.tagWrap}>
          {problem.tags.map(t => (
            <span key={t} style={s.tagChip}>{t}</span>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div style={{ ...s.card, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={s.cardLabel}>Notes</div>
        <div style={s.notesBox}>
          {problem.notes}
        </div>
      </div>

      {/* 100-day tracker */}
      <div style={s.card}>
        <div style={s.trackerHeader}>
          <div style={s.cardLabel}>100-Day Challenge</div>
          <div style={s.trackerStats}>
            <span style={s.statGreen}>{solved} done</span>
            <span style={s.statDim}> · {remaining} left</span>
          </div>
        </div>

        {/* Grid: 10 cols × 10 rows = 100 cells */}
        <div style={s.grid}>
          {Array.from({ length: 100 }, (_, i) => {
            const day      = i + 1
            const isSolved = solvedDays.has(day)
            const isCurrent= day === problem.day
            const isFuture = day > problems.length
            return (
              <div
                key={day}
                title={`Day ${day}${isSolved ? ' — solved' : isFuture ? '' : ' — not yet'}`}
                style={{
                  ...s.cell,
                  ...(isCurrent ? s.cellCurrent : {}),
                  ...(isSolved  ? s.cellSolved  : {}),
                  ...(isFuture  ? s.cellFuture  : {}),
                }}
              />
            )
          })}
        </div>

        {/* Legend */}
        <div style={s.legend}>
          <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#3ddc84' }} /> Solved</span>
          <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#5b7fff' }} /> Today</span>
          <span style={s.legendItem}><span style={{ ...s.legendDot, background: '#1e2229' }} /> Pending</span>
        </div>
      </div>

    </aside>
  )
}

const s = {
  root: {
    width: 240,
    flexShrink: 0,
    borderLeft: '1px solid #23272f',
    background: '#000000',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    gap: 0,
  },
  card: {
    padding: '14px 16px',
    borderBottom: '1px solid #23272f',
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#454a60',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 10,
  },

  // Complexity
  complexRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  complexItem: {
    flex: 1,
    textAlign: 'center',
  },
  complexKey: {
    fontSize: 10,
    color: '#454a60',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  complexVal: {
    fontSize: 14,
    fontWeight: 700,
    color: '#5b7fff',
    fontFamily: "'Fira Code', 'Courier New', monospace",
  },
  divider: {
    width: 1,
    height: 32,
    background: '#23272f',
    flexShrink: 0,
  },

  // Tags
  tagWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 5,
  },
  tagChip: {
    fontSize: 12,
    color: '#8b90a8',
    background: '#1e2229',
    border: '1px solid #23272f',
    padding: '3px 9px',
    borderRadius: 4,
  },

  // Notes
  notesBox: {
    fontSize: 12,
    color: '#8b90a8',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
    overflowY: 'auto',
    flex: 1,
    borderLeft: '2px solid #2c3140',
    paddingLeft: 10,
  },

  // 100-day tracker
  trackerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  trackerStats: {
    fontSize: 11,
  },
  statGreen: {
    color: '#3ddc84',
    fontWeight: 600,
  },
  statDim: {
    color: '#454a60',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(10, 1fr)',
    gap: 3,
    marginBottom: 10,
  },
  cell: {
    aspectRatio: '1',
    borderRadius: 2,
    background: '#1e2229',
    border: '1px solid #23272f',
    transition: 'all 0.1s',
    cursor: 'default',
  },
  cellSolved: {
    background: '#2ab96b',
    border: '1px solid #3ddc84',
    boxShadow: '0 0 4px rgba(61,220,132,0.3)',
  },
  cellCurrent: {
    background: '#3d5fe0',
    border: '1px solid #5b7fff',
    boxShadow: '0 0 6px rgba(91,127,255,0.4)',
  },
  cellFuture: {
    background: '#13161b',
    border: '1px solid #1a1d24',
    opacity: 0.5,
  },
  legend: {
    display: 'flex',
    gap: 10,
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    color: '#454a60',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    display: 'inline-block',
  },
}