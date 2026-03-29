import { useEffect, useState } from 'react'
import ProgressBar from './ProgressBar'
import './Reputations.css'
import { supabase } from '../lib/supabase'

const REPUTATION_COLUMNS = [
  ['Silvermoon Court', 'Amani Tribe', "Hara'ti", 'The Singularity'],
  ['Blood Knights', 'Magisters', 'Farstriders', 'Shades of the Row'],
  ['Valeera Sanguinar', "Slayer's Duellum"],
]

const TARGET_FACTIONS = REPUTATION_COLUMNS.flat()

function Reputations() {
  const [reputations, setReputations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchReputations = async () => {
      setIsLoading(true)
      setErrorMessage('')

      const { data, error } = await supabase
        .from('reputations')
        .select('id, faction, standing, value, max')
        .in('faction', TARGET_FACTIONS)
        .order('id', { ascending: false })

      if (error) {
        setErrorMessage('No se pudieron cargar las reputaciones.')
        setReputations([])
      } else {
        const latestByFaction = new Map()

        ;(Array.isArray(data) ? data : []).forEach((reputation) => {
          if (!latestByFaction.has(reputation.faction)) {
            latestByFaction.set(reputation.faction, reputation)
          }
        })

        setReputations(Array.from(latestByFaction.values()))
      }

      setIsLoading(false)
    }

    fetchReputations()
  }, [])

  if (isLoading) {
    return (
      <section className="reputations" aria-label="Reputaciones del personaje">
        <h3>Reputaciones</h3>
        <p className="reputations__status">Cargando reputaciones...</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="reputations" aria-label="Reputaciones del personaje">
        <h3>Reputaciones</h3>
        <p className="reputations__status reputations__status--error">{errorMessage}</p>
      </section>
    )
  }

  if (reputations.length === 0) {
    return (
      <section className="reputations" aria-label="Reputaciones del personaje">
        <h3>Reputaciones</h3>
        <p className="reputations__status">No hay reputaciones disponibles.</p>
      </section>
    )
  }

  const reputationByFaction = new Map(
    reputations.map((reputation) => [reputation.faction, reputation]),
  )

  return (
    <section className="reputations" aria-label="Reputaciones del personaje">
      <h3>Reputaciones</h3>

      <div className="reputations__columns">
        {REPUTATION_COLUMNS.map((column, columnIndex) => (
          <ul key={`reputation-column-${columnIndex}`} className="reputations__column">
            {column.map((factionName) => {
              const reputation = reputationByFaction.get(factionName)

              return (
                <li key={factionName} className="reputations__item">
                  <div className="reputations__header">
                    <p className="reputations__name">{factionName}</p>
                    {reputation?.standing && <span className="reputations__standing">{reputation.standing}</span>}
                  </div>

                  {reputation ? (
                    <ProgressBar value={Number(reputation.value) || 0} max={Number(reputation.max) || 1} />
                  ) : (
                    <p className="reputations__empty-item">Sin datos</p>
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </section>
  )
}

export default Reputations
