/* eslint-disable react/prop-types */
import ProgressBar from './ProgressBar'
import useCountUp from '../hooks/useCountUp'
import './CharacterDetailsForever.css'

const getRenderImage = (character) => {
  const media = character.media ?? []

  return (
    media.find((asset) => asset.name === 'avatar')?.value ??
    media.find((asset) => asset.name === 'main-raw')?.value ??
    null
  )
}

const getProfessionEntries = (list) =>
  list.map((profession) => {
    const tier = profession.tiers?.slice(-1)[0]

    return {
      name: profession.name,
      skill: Number(tier?.skill) || 0,
      max: Number(tier?.max) || 0,
    }
  })

const normalizeReputation = (entry) => {
  const standing = entry?.standing

  return {
    faction: typeof entry?.faction === 'string' ? entry.faction : entry?.faction?.name ?? '',
    standing: typeof standing === 'string' ? standing : standing?.name ?? null,
    value: Number(entry?.value ?? standing?.value) || 0,
    max: Number(entry?.max ?? standing?.max) || 0,
  }
}

const renderProfessionGroup = (title, entries, characterId) => {
  if (!entries.length) return null

  return (
    <div className="character-card-forever__profession-group">
      <h4>{title}</h4>
      <ul>
        {entries.map((profession) => (
          <li key={`${characterId}-${title}-${profession.name}`}>
            <ProgressBar value={profession.skill} max={profession.max} label={profession.name} />
          </li>
        ))}
      </ul>
    </div>
  )
}

const EQUIPMENT_COLUMNS = [
  ['Head', 'Shoulders', 'Back', 'Chest', 'Waist', 'Legs', 'Feet', 'Wrist', 'Hands'],
  ['Neck', 'Ring 1', 'Ring 2', 'Trinket 1', 'Trinket 2'],
  ['Main Hand', 'Off Hand'],
]

const getEquipmentValueClassName = (value, averageItemLevel, lowestEquipmentValue) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 'character-card-forever__equipment-value'

  if (lowestEquipmentValue !== null && numericValue === lowestEquipmentValue) {
    return 'character-card-forever__equipment-value character-card-forever__equipment-value--lowest'
  }

  if (Number.isFinite(averageItemLevel) && numericValue > averageItemLevel) {
    return 'character-card-forever__equipment-value character-card-forever__equipment-value--above'
  }

  if (Number.isFinite(averageItemLevel) && numericValue < averageItemLevel) {
    return 'character-card-forever__equipment-value character-card-forever__equipment-value--below'
  }

  return 'character-card-forever__equipment-value'
}

function CharacterDetailsForever({ character }) {
  const image = getRenderImage(character)
  const level = useCountUp(character.level)
  const itemLevel = useCountUp(character.average_item_level)
  const primaryProfessions = getProfessionEntries(character.professions?.primaries ?? [])
  const secondaryProfessions = getProfessionEntries(character.professions?.secondaries ?? [])
  const reputations = (character.reputations ?? []).map(normalizeReputation)
  const averageItemLevel = Number(character.average_item_level)
  const equipmentByName = Object.fromEntries(
    (Array.isArray(character.equipment) ? character.equipment : [])
      .filter((slot) => slot.name?.toLowerCase() !== 'tabard')
      .filter((slot) => Number.isFinite(Number(slot.value)) && Number(slot.value) > 0)
      .map((slot) => [slot.name.toLowerCase(), slot]),
  )
  const equipmentValues = Object.values(equipmentByName).map((slot) => Number(slot.value))
  const lowestEquipmentValue = equipmentValues.length > 0 ? Math.min(...equipmentValues) : null
  const hasProfessions = primaryProfessions.length > 0 || secondaryProfessions.length > 0
  const hasEquipment = Object.keys(equipmentByName).length > 0

  return (
    <article className={`character-card-forever ${character.faction === 'Horde' ? 'character-card-forever--horde' : 'character-card-forever--alliance'}`}>
      <header className="character-card-forever__header">
        {image && (
          <img src={image} alt={`${character.name} render`} className="character-card-forever__avatar" />
        )}
        <div className="character-card-forever__header-info">
          <div className="character-card-forever__header-name">
            <h2>{character.name}</h2>
            <span className="character-card-forever__faction">{character.faction}</span>
          </div>
          <p className="character-card-forever__subtitle">{character.race}</p>
          <p className="character-card-forever__subtitle">{character.className}</p>
        </div>
      </header>

      <dl className="character-card-forever__stats">
        <div>
          <dt>Level</dt>
          <dd>{level}</dd>
        </div>
        <div>
          <dt>Item Level</dt>
          <dd>{itemLevel}</dd>
        </div>
      </dl>

      {hasProfessions && (
        <section className="character-card-forever__professions" aria-label="Character Professions">
          <h3>Professions</h3>
          <div className="character-card-forever__columns">
            {renderProfessionGroup('Primary', primaryProfessions, character.id)}
            {renderProfessionGroup('Secondary', secondaryProfessions, character.id)}
          </div>
        </section>
      )}

      {hasEquipment && (
        <section className="character-card-forever__equipment" aria-label="Character Equipment">
          <h3>Equipment</h3>
          <div className="character-card-forever__equipment-columns">
            {EQUIPMENT_COLUMNS.map((column, columnIndex) => (
              <ul key={`equipment-column-${columnIndex}`} className="character-card-forever__equipment-list">
                {column.map((slotName) => {
                  const slot = equipmentByName[slotName.toLowerCase()]
                  if (!slot) return null

                  return (
                    <li key={slot.name} className="character-card-forever__equipment-item">
                      <span>{slot.name}</span>
                      <strong className={getEquipmentValueClassName(slot.value, averageItemLevel, lowestEquipmentValue)}>
                        {slot.value}
                      </strong>
                    </li>
                  )
                })}
              </ul>
            ))}
          </div>
        </section>
      )}

      <section className="character-card-forever__reputations" aria-label="Character Reputations">
        <h3>Reputations</h3>
        {reputations.length === 0 ? (
          <p className="character-card-forever__status">No reputations available.</p>
        ) : (
          <ul className="character-card-forever__reputations-list">
            {reputations.map((reputation) => (
              <li key={reputation.faction} className="character-card-forever__reputation">
                <div className="character-card-forever__reputation-header">
                  <p className="character-card-forever__reputation-name">{reputation.faction}</p>
                  {reputation.standing && (
                    <span className="character-card-forever__reputation-standing">{reputation.standing}</span>
                  )}
                </div>
                <ProgressBar value={reputation.value} max={reputation.max} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}

export default CharacterDetailsForever
