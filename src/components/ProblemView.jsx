import { useState, useEffect } from 'react'
import CodeRunner from './CodeRunner'

const TABS = ['Question', 'Steps', 'My Code']

const DIFF = {
  Easy:   { color: '#3ddc84', bg: 'rgba(61,220,132,0.1)'  },
  Medium: { color: '#f5a623', bg: 'rgba(245,166,35,0.1)'  },
  Hard:   { color: '#f06565', bg: 'rgba(240,101,101,0.1)' },
}

export default function ProblemView({ problem }) {
  const [tab, setTab] = useState('Question')

  useEffect(() => setTab('Question'), [problem.id])

  const d = DIFF[problem.difficulty]

  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.headerMeta}>
          <span style={s.dayChip}>Day {String(problem.day).padStart(2,'0')}</span>
          {problem.solved && <span style={s.solvedChip}>✓ Solved</span>}
        </div>
        <h1 style={s.title}>{problem.title}</h1>
        <div style={s.badges}>
          <span style={{ ...s.diffBadge, color: d.color, background: d.bg }}>
            {problem.difficulty}
          </span>
          {problem.tags.map(t => (
            <span key={t} style={s.tag}>{t}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabBar}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{ ...s.tabBtn, ...(tab === t ? s.tabActive : {}) }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={s.content}>

        {tab === 'Question' && (
          <div>
            <p style={s.questionText}>{problem.question}</p>

            <div style={s.sectionLabel}>Examples</div>
            {problem.examples.map((ex, i) => (
              <div key={i} style={s.exBox}>
                <div style={s.exRow}>
                  <span style={s.exKey}>Input</span>
                  <code style={s.exVal}>{ex.input}</code>
                </div>
                <div style={s.exRow}>
                  <span style={s.exKey}>Output</span>
                  <code style={s.exVal}>{ex.output}</code>
                </div>
                {ex.explanation && (
                  <div style={s.exExplain}>{ex.explanation}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEPS ── */}
        {tab === 'Steps' && (
          <div>
            <div style={s.sectionLabel}>Step-by-step approach</div>
            {problem.steps.map((step, i) => (
              <div key={step.step} style={{ ...s.stepCard, animationDelay: `${i * 60}ms` }}>
                <div style={s.stepNum}>{step.step}</div>
                <div style={s.stepBody}>
                  <div style={s.stepTitle}>{step.title}</div>
                  <div style={s.stepDetail}>{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MY CODE ── */}
        {tab === 'My Code' && (
          <div>
            <div style={s.sectionLabel}>My solution — hit Run to execute</div>
            <CodeRunner code={problem.code} />
          </div>
        )}

      </div>
    </div>
  )
}

const s = {
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    minWidth: 0,
  },
  header: {
    padding: '20px 24px 16px',
    borderBottom: '1px solid #23272f',
    background: '#000000',
    flexShrink: 0,
  },
  headerMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  dayChip: {
    fontSize: 11,
    fontWeight: 600,
    color: '#454a60',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  solvedChip: {
    fontSize: 11,
    fontWeight: 600,
    color: '#3ddc84',
    background: 'rgba(61,220,132,0.1)',
    padding: '2px 8px',
    borderRadius: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: 700,
    color: '#dde1ed',
    letterSpacing: '-0.3px',
    marginBottom: 10,
  },
  badges: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  diffBadge: {
    fontSize: 12,
    fontWeight: 600,
    padding: '2px 10px',
    borderRadius: 4,
  },
  tag: {
    fontSize: 12,
    color: '#8b90a8',
    background: '#1e2229',
    padding: '2px 9px',
    borderRadius: 4,
    border: '1px solid #23272f',
  },

  tabBar: {
    display: 'flex',
    background: '#12151a',
    borderBottom: '1px solid #23272f',
    padding: '0 24px',
    gap: 2,
    flexShrink: 0,
  },
  tabBtn: {
    padding: '10px 14px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#454a60',
    fontSize: 13,
    fontWeight: 500,
    marginBottom: -1,
    transition: 'all 0.15s',
  },
  tabActive: {
    color: '#dde1ed',
    borderBottomColor: '#5b7fff',
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '22px 24px',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#454a60',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 14,
  },

  questionText: {
    fontSize: 14,
    color: '#a8adc4',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap',
    marginBottom: 24,
  },
  exBox: {
    background: '#12151a',
    border: '1px solid #23272f',
    borderRadius: 7,
    padding: '13px 16px',
    marginBottom: 10,
  },
  exRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'baseline',
    marginBottom: 5,
  },
  exKey: {
    fontSize: 12,
    color: '#454a60',
    width: 52,
    flexShrink: 0,
    fontWeight: 500,
  },
  exVal: {
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontSize: 12,
    color: '#c8cfe8',
    background: '#1e2229',
    padding: '2px 8px',
    borderRadius: 4,
  },
  exExplain: {
    fontSize: 12,
    color: '#8b90a8',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1px solid #1e2229',
  },
  stepCard: {
    display: 'flex',
    gap: 14,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 6,
    background: 'rgba(91,127,255,0.12)',
    color: '#5b7fff',
    fontSize: 13,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepBody: {
    flex: 1,
    paddingTop: 3,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#dde1ed',
    marginBottom: 4,
  },
  stepDetail: {
    fontSize: 13,
    color: '#8b90a8',
    lineHeight: 1.7,
  },
}