//components/Header.tsx
export default function Header() {
  return (
    <header className="glass-header">
      <div className="logo-area">
        <span className="logo">GlobalLingua</span>
        <span className="badge">ACADEMY</span>
        <span style={{ fontSize: "0.75rem", marginLeft: 6 }}>
          ⚡ Orchestrator Pro
        </span>
      </div>

      <div className="stats">📅 Schedule</div>
    </header>
  )
}