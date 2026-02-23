import { useState, useEffect, useRef } from 'react'

// ─── Pyodide loader ───────────────────────────────────────────────────────────
let pyodidePromise = null

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      if (window.loadPyodide) {
        window.loadPyodide().then(resolve).catch(reject)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js'
      script.onload = () => {
        window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' })
          .then(resolve)
          .catch(reject)
      }
      script.onerror = () => reject(new Error('Failed to load Pyodide'))
      document.head.appendChild(script)
    })
  }
  return pyodidePromise
}


const KW_RE = /\b(def|return|for|if|elif|else|in|not|and|or|while|break|continue|import|from|class|pass|None|True|False|lambda|yield|with|as|try|except|finally|raise|print|len|range|enumerate|float|int|str|list|dict|set|bool|super|self)\b/g

function Line({ line }) {
  if (/^\s*#/.test(line)) {
    return <div style={{ color: '#4a5070', fontStyle: 'italic' }}>{line || '\u00a0'}</div>
  }
  const parts = []
  let last = 0
  const re = new RegExp(KW_RE.source, 'g')
  let m
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) parts.push(<span key={`t${last}`}>{line.slice(last, m.index)}</span>)
    parts.push(<span key={`k${m.index}`} style={{ color: '#79b8ff' }}>{m[0]}</span>)
    last = m.index + m[0].length
  }
  if (last < line.length) parts.push(<span key={`e${last}`}>{line.slice(last)}</span>)
  return <div>{parts.length ? parts : (line || '\u00a0')}</div>
}


export default function CodeRunner({ code }) {
  const [output,  setOutput]  = useState(null)
  const [runErr,  setRunErr]  = useState(null)
  const [running, setRunning] = useState(false)
  const [copied,  setCopied]  = useState(false)
  const [pyReady, setPyReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const pyRef = useRef(null)

  const lines = code.split('\n')

  useEffect(() => {
    setLoading(true)
    getPyodide()
      .then(py => {
        pyRef.current = py
        setPyReady(true)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = async () => {
    setRunning(true)
    setOutput(null)
    setRunErr(null)

    try {
      const py = pyRef.current || await getPyodide()
      pyRef.current = py

      const captureCode = `
import sys
import io
_stdout_capture = io.StringIO()
sys.stdout = _stdout_capture
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as _e:
    sys.stdout = sys.__stdout__
    raise _e
sys.stdout = sys.__stdout__
_stdout_capture.getvalue()
`
      const result = await py.runPythonAsync(captureCode)
      const out = String(result ?? '').trim()
      setOutput(out || '(no output — add print() to see results)')
    } catch (e) {
      const msg = String(e.message || e)
        .replace(/File "<exec>", line \d+, in <module>\n/g, '')
        .replace(/    /g, '')
        .trim()
      setRunErr(msg)
    } finally {
      setRunning(false)
    }
  }

  const hasResult = output !== null || runErr !== null

  return (
    <div style={S.wrap}>

      <div style={S.toolbar}>
        <div style={S.toolbarLeft}>
          <span style={S.lang}>Python 3</span>
          {loading && <span style={S.loadingBadge}>loading runtime…</span>}
          {pyReady && !loading && <span style={S.readyBadge}>● ready</span>}
        </div>
        <div style={S.toolbarRight}>
          <button style={S.copyBtn} onClick={handleCopy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
          <button
            style={{ ...S.runBtn, opacity: (running || loading) ? 0.6 : 1 }}
            onClick={handleRun}
            disabled={running || loading}
          >
            {running
              ? <><span style={S.spinner} />Running…</>
              : loading
              ? <>Loading…</>
              : <>▶ Run</>
            }
          </button>
        </div>
      </div>

      <div style={S.codeWrap}>
        <div style={S.lineNums}>
          {lines.map((_, i) => <div key={i} style={S.lineNum}>{i + 1}</div>)}
        </div>
        <pre style={S.pre}>
          {lines.map((line, i) => <Line key={i} line={line} />)}
        </pre>
      </div>

      {running && (
        <div style={S.runningBar}>
          <span style={S.pulse} />
          <span style={S.runningText}>Running in browser (Pyodide / WASM)…</span>
        </div>
      )}

      {hasResult && (
        <div style={S.resultWrap}>
          <div style={S.resultHeader}>
            <span style={runErr ? S.labelErr : S.labelOk}>
              {runErr ? '✗ Error' : '✓ Output'}
            </span>
            <button
              style={S.clearBtn}
              onClick={() => { setOutput(null); setRunErr(null) }}
            >
              Clear
            </button>
          </div>
          <pre style={runErr ? S.preErr : S.preOk}>
            {runErr || output}
          </pre>
        </div>
      )}

    </div>
  )
}


const S = {
  wrap: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#23272f',
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: '#0d0f12',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    background: '#12151a',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#23272f',
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  lang: {
    fontSize: 11,
    color: '#454a60',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    fontWeight: 600,
  },
  loadingBadge: {
    fontSize: 11,
    color: '#f5a623',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
  readyBadge: {
    fontSize: 11,
    color: '#3ddc84',
  },
  toolbarRight: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  copyBtn: {
    background: 'none',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2c3140',
    borderRadius: 5,
    padding: '4px 12px',
    color: '#8b90a8',
    fontSize: 12,
    cursor: 'pointer',
  },
  runBtn: {
    background: 'linear-gradient(135deg, #5b7fff, #3d5fe0)',
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 5,
    padding: '5px 16px',
    color: '#fff',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 0 12px rgba(91,127,255,0.3)',
    transition: 'opacity 0.15s',
    cursor: 'pointer',
  },
  spinner: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.25)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  codeWrap: {
    display: 'flex',
    overflowX: 'auto',
    maxHeight: 340,
  },
  lineNums: {
    padding: '14px 10px 14px 12px',
    textAlign: 'right',
    userSelect: 'none',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: '#1a1d24',
    flexShrink: 0,
    minWidth: 40,
    background: '#0d0f12',
  },
  lineNum: {
    fontSize: 12,
    lineHeight: '1.7',
    color: '#2c3140',
    fontFamily: "'Fira Code','Cascadia Code',monospace",
  },
  pre: {
    padding: '14px 16px',
    fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
    fontSize: 13,
    lineHeight: 1.7,
    color: '#c8cfe8',
    whiteSpace: 'pre',
    flex: 1,
    margin: 0,
    background: '#0d0f12',
  },
  runningBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 14px',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#1a1d24',
  },
  pulse: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#5b7fff',
    animation: 'pulse 1s ease-in-out infinite',
  },
  runningText: { fontSize: 12, color: '#8b90a8' },
  resultWrap: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: '#23272f',
    background: '#090b0e',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '7px 14px',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#1a1d24',
  },
  labelOk:  { fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#3ddc84' },
  labelErr: { fontSize: 11, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: '#f06565' },
  clearBtn: {
    background: 'none',
    borderWidth: 0,
    borderStyle: 'solid',
    borderColor: 'transparent',
    color: '#454a60',
    fontSize: 11,
    cursor: 'pointer',
  },
  preOk: {
    padding: '12px 16px', margin: 0,
    fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
    fontSize: 13, lineHeight: 1.7,
    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    color: '#b6f5c8',
  },
  preErr: {
    padding: '12px 16px', margin: 0,
    fontFamily: "'Fira Code','Cascadia Code','Courier New',monospace",
    fontSize: 13, lineHeight: 1.7,
    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    color: '#f48c8c',
  },
}