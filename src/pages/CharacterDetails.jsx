import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import CharacterDetailsForever from '../components/CharacterDetailsForever'
import Skeleton from '../components/Skeleton'
import useCountUp from '../hooks/useCountUp'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import './CharacterDetails.css'

function CharacterDetailsPage() {
  const { id } = useParams()
  const [character, setCharacter] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const level = useCountUp(character?.level)
  const itemLevel = useCountUp(character?.average_item_level)

  useEffect(() => {
    const fetchCharacter = async () => {
      setIsLoading(true)
      setErrorMessage('')

      const documentSnapshot = await getDoc(doc(db, 'characters', id))

      if (documentSnapshot.exists()) {
        setCharacter({ id: documentSnapshot.id, ...documentSnapshot.data() })
      } else {
        setErrorMessage("Can't load character")
        setCharacter(null)
      }

      setIsLoading(false)
    }

    fetchCharacter()
  }, [id])

  const getProfessionsWithMidnightTiers = (list) =>
    list
      .map((profession) => ({
        ...profession,
        tiers:
          profession.tiers?.filter((tier) => tier.expansion?.toLowerCase().includes('midnight')) ?? [],
      }))
      .filter((profession) => profession.tiers.length > 0)

  const renderProfessionGroup = (title, list) => {
    const professionsWithTiers = getProfessionsWithMidnightTiers(list)

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
  const hasVisiblePrimaryProfessions = getProfessionsWithMidnightTiers(primaryProfessions).length > 0
  const hasVisibleSecondaryProfessions = getProfessionsWithMidnightTiers(secondaryProfessions).length > 0
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
    ['Head', 'Shoulders','Back', 'Chest', 'Waist', 'Legs', 'Feet', 'Wrist', 'Hands'],
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
      <Link to="/" className="character-details-page__back-link">Back to list</Link>
      {/* {console.log(character)} */}
      {isLoading && (
        <article className="character-card character-details-page__skeleton" role="status" aria-label="Loading character">
          <div className="character-details-page__skeleton-header">
            <Skeleton className="character-details-page__skeleton-avatar" />
            <div className="character-details-page__skeleton-lines">
              <Skeleton style={{ height: '1.35rem', width: '45%' }} />
              <Skeleton style={{ height: '0.9rem', width: '30%' }} />
              <Skeleton style={{ height: '0.9rem', width: '35%' }} />
            </div>
          </div>
          <Skeleton style={{ height: '2.4rem' }} />
          <Skeleton style={{ height: '7rem' }} />
          <Skeleton style={{ height: '9rem' }} />
        </article>
      )}

      {!isLoading && errorMessage && (
        <p className="character-details-page__status character-details-page__status--error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && character?.game === 'forever' && (
        <CharacterDetailsForever character={character} />
      )}

      {!isLoading && !errorMessage && character && character.game !== 'forever' && (
        <article className={`character-card ${character.faction === 'Horde' ? 'character-card--horde' : 'character-card--alliance'}`}>
          <header className="character-card__header">
            <img src={character.media[0]?.value} alt={`${character.name} thumbnail`} className='character-card__avatar'/>
            <div className="character-card__header-info">
              <div className="character-card__header-name">
                <h2>{character.name}</h2>
                <span className="character-card__faction">{character.faction}</span>
              </div>
              <p className="character-card__subtitle">{character.race}</p>
              <p className="character-card__subtitle">{character.className} · {character.active_spec}</p>
              {character.active_title && <span className="character-card__active-title">{character.active_title}</span>}
            </div>
          </header>

          <dl className="character-card__stats">
            <div>
              <dt>Level</dt>
              <dd>{level}</dd>
            </div>
            <div>
              <dt>Item Level</dt>
              <dd>{itemLevel}</dd>
            </div>
            {character.active_spec && (
              <div>
                <dt>Spec</dt>
                <dd>{character.active_spec}</dd>
              </div>
            )}
          </dl>

          {(hasVisiblePrimaryProfessions || hasVisibleSecondaryProfessions) && (
            <section className="character-card__professions" aria-label="Character Professions">
              <h3>Professions</h3>
              <div className="character-card__professions-columns">
                {renderProfessionGroup('Primary', primaryProfessions)}
                {renderProfessionGroup('Secondary', secondaryProfessions)}
              </div>
            </section>
          )}

          {visibleEquipment.length > 0 && (
            <section className="character-card__equipment" aria-label="Character Equipment">
              <h3>Equipment</h3>
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
