import { useState } from 'react'

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.toolbar}>
        <span style={styles.lang}>python</span>
        <button
          style={{ ...styles.copyBtn, ...(copied ? styles.copyBtnDone : {}) }}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={styles.pre}>{code}</pre>
    </div>
  )
}

const styles = {
  wrap: {
    background: '#13151c',
    border: '1px solid #2a2d36',
    borderRadius: 6,
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 14px',
    borderBottom: '1px solid #2a2d36',
    background: '#1a1d24',
  },
  lang: {
    fontSize: 11,
    color: '#4a4e63',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  copyBtn: {
    background: 'none',
    border: '1px solid #2a2d36',
    borderRadius: 4,
    padding: '3px 10px',
    color: '#8b8fa8',
    fontSize: 12,
    transition: 'all 0.15s',
  },
  copyBtnDone: {
    borderColor: '#4ade80',
    color: '#4ade80',
  },
  pre: {
    padding: '16px',
    fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
    fontSize: 13,
    lineHeight: 1.7,
    color: '#c8cad6',
    overflowX: 'auto',
    whiteSpace: 'pre',
    margin: 0,
  },
}