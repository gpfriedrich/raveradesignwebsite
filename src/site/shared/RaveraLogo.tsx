export default function RaveraLogo({ stacked = false }: { stacked?: boolean }) {
  return (
    <span className={`ts-logo${stacked ? ' ts-logo--stacked' : ''}`}>
      <span className="ts-logo-mark">R</span>
      <span className="ts-logo-word">RAVERA</span>
      {stacked && <span className="ts-logo-tag">Peças autorais de design</span>}
    </span>
  )
}
