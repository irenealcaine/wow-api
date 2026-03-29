import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import Reputations from '../components/Reputations'
import { supabase } from '../lib/supabase'
import './CharacterDetails.css'

function CharacterDetailsPage() {
  const { id } = useParams()
  const [character, setCharacter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchCharacter = async () => {
      setIsLoading(true)
      setErrorMessage('')

      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setErrorMessage('No se pudo cargar el personaje.')
        setCharacter(null)
      } else {
        setCharacter(data)
      }

      setIsLoading(false)
    }

    fetchCharacter()
  }, [id])

  const renderProfessionGroup = (title, list) => {
    const professionsWithTiers = list
      .map((profession) => ({
        ...profession,
        tiers:
          profession.tiers?.filter((tier) => tier.expansion?.toLowerCase().includes('midnight')) ?? [],
      }))
      .filter((profession) => profession.tiers.length > 0)

    if (!professionsWithTiers.length) return null

    return (
      <div className="character-card__profession-group">
        <h4>{title}</h4>
        <ul>
          {professionsWithTiers.map((profession) => (
            <li key={`${title}-${profession.name}`}>
              <p>{profession.name}</p>
              <ul className="character-card__tiers">
                {profession.tiers?.slice(-1).map((tier) => (
                  <li key={`${profession.name}-${tier.expansion}`}>
                    <ProgressBar value={tier.skill} max={tier.max} label={`${tier.expansion}`} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const primaryProfessions = character?.professions?.primaries ?? []
  const secondaryProfessions = character?.professions?.secondaries ?? []
  const equipment = Array.isArray(character?.equipment) ? character.equipment : []
  const averageItemLevel = Number(character?.average_item_level)
  const visibleEquipment = equipment.filter((slot) => slot.name?.toLowerCase() !== 'tabard')
  const equipmentByName = Object.fromEntries(
    visibleEquipment.map((slot) => [slot.name?.toLowerCase(), slot]),
  )
  const equipmentValues = visibleEquipment
    .map((slot) => Number(slot.value))
    .filter((value) => Number.isFinite(value))
  const lowestEquipmentValue = equipmentValues.length > 0 ? Math.min(...equipmentValues) : null
  const equipmentColumns = [
    ['Head', 'Shoulders', 'Chest', 'Waist', 'Legs', 'Feet', 'Wrist', 'Hands'],
    ['Neck', 'Ring 1', 'Ring 2', 'Trinket 1', 'Trinket 2'],
    ['Main Hand', 'Off Hand'],
  ]

  const getEquipmentValueClassName = (value) => {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return 'character-card__equipment-value'

    if (lowestEquipmentValue !== null && numericValue === lowestEquipmentValue) {
      return 'character-card__equipment-value character-card__equipment-value--lowest'
    }

    if (Number.isFinite(averageItemLevel) && numericValue > averageItemLevel) {
      return 'character-card__equipment-value character-card__equipment-value--above'
    }

    if (Number.isFinite(averageItemLevel) && numericValue < averageItemLevel) {
      return 'character-card__equipment-value character-card__equipment-value--below'
    }

    return 'character-card__equipment-value'
  }

  return (
    <main className="character-details-page">
      <Link to="/" className="character-details-page__back-link">Volver al listado</Link>
{console.log(character)}
      {isLoading && <p className="character-details-page__status">Cargando personaje...</p>}

      {!isLoading && errorMessage && (
        <p className="character-details-page__status character-details-page__status--error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && character && (
        <article className="character-card">
          <header className="character-card__header">
            <img src={character.media[0]?.value} alt={`${character.name} thumbnail`} className='character-card_faction_icon'/>
            <h2>{character.name} {character.active_title}</h2>
            <span className="character-card__level">Nivel {character.level}</span>
          </header>

          <dl className="character-card__stats">
            <div>
              <dt>Reino</dt>
              <dd>{character.realm}</dd>
            </div>
            <div>
              <dt>Facción</dt>
              <dd>{character.faction}</dd>
            </div>
            <div>
              <dt>Raza</dt>
              <dd>{character.race}</dd>
            </div>
            <div>
              <dt>Clase</dt>
              <dd>{character.className} {character.active_spec}</dd>
            </div>
            <div>
              <dt>Item Level</dt>
              <dd>{character.average_item_level}</dd>
            </div>
          </dl>

          {(primaryProfessions.length > 0 || secondaryProfessions.length > 0) && (
            <section className="character-card__professions" aria-label="Profesiones del personaje">
              <h3>Profesiones</h3>
              <div className="character-card__professions-columns">
                {renderProfessionGroup('Primarias', primaryProfessions)}
                {renderProfessionGroup('Secundarias', secondaryProfessions)}
              </div>
            </section>
          )}

          {visibleEquipment.length > 0 && (
            <section className="character-card__equipment" aria-label="Equipamiento del personaje">
              <h3>Equipamiento</h3>
              <div className="character-card__equipment-columns">
                {equipmentColumns.map((column, columnIndex) => (
                  <ul key={`equipment-column-${columnIndex}`} className="character-card__equipment-list">
                    {column.map((slotName) => {
                      const slot = equipmentByName[slotName.toLowerCase()]
                      if (!slot) return null

                      return (
                        <li key={slot.name} className="character-card__equipment-item">
                          <span>{slot.name}</span>
                          <strong className={getEquipmentValueClassName(slot.value)}>{slot.value}</strong>
                        </li>
                      )
                    })}
                  </ul>
                ))}
              </div>
            </section>
          )}
        </article>
      )}
    </main>
  )
}

export default CharacterDetailsPage
