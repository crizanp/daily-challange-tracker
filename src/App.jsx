import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ProblemView from './components/ProblemView'
import RightPanel from './components/RightPanel'
import problems from './data/problems.json'
import './index.css'

export default function App() {
  const [selectedId, setSelectedId] = useState(problems[0].id)
  const selected = problems.find(p => p.id === selectedId)

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d0f12', overflow: 'hidden' }}>
      <Sidebar
        problems={problems}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      {selected && (
        <>
          <ProblemView problem={selected} />
          <RightPanel problem={selected} problems={problems} />
        </>
      )}
    </div>
  )
}