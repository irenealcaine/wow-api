/* eslint-disable react/prop-types */
import './ProgressBar.css'

function ProgressBar({ value, max, label }) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 1
  const safeValue = Number.isFinite(value) ? value : 0
  const clampedValue = Math.min(Math.max(safeValue, 0), safeMax)
  const percentage = Math.round((clampedValue / safeMax) * 100)

  return (
    <section className="progress" aria-label={label || 'Barra de progreso'}>
      <div className="progress__meta">
        {label && <span className="progress__label">{label}</span>}
        <span className="progress__value">{clampedValue}/{safeMax}</span>
      </div>

      <div className="progress__track" role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={clampedValue}>
        <div className="progress__fill" style={{ width: `${percentage}%` }} />
      </div>
    </section>
  )
}

export default ProgressBar
