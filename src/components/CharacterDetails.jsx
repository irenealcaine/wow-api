/* eslint-disable react/prop-types */
import './CharacterDetails.css'
import ProgressBar from './ProgressBar'

function CharacterDetails({ name, realm, className, level, active_spec, active_title, race, average_item_level, faction, professions }) {
  const primaryProfessions = professions?.primaries ?? []
  const secondaryProfessions = professions?.secondaries ?? []

  const renderProfessionGroup = (title, list) => {
    if (!list.length) return null

    return (
      <div className="character-card__profession-group">
        <h4>{title}</h4>
        <ul>
          {list.map((profession) => (
            <li key={`${title}-${profession.name}`}>
              <p>{profession.name}</p>
              <ul className="character-card__tiers">
                {profession.tiers?.map((tier) => (
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

  return (
    <article className="character-card">
      <header className="character-card__header">
        <h2>{name} {active_title}</h2>
        <span className="character-card__level">Nivel {level}</span>
      </header>

      <dl className="character-card__stats">
        <div>
          <dt>Reino</dt>
          <dd>{realm}</dd>
        </div>
        <div>
          <dt>Facción</dt>
          <dd>{faction}</dd>
        </div>
        <div>
          <dt>Raza</dt>
          <dd>{race}</dd>
        </div>
        <div>
          <dt>Clase</dt>
          <dd>{className} {active_spec}</dd>
        </div>
        <div>
          <dt>Item Level</dt>
          <dd>{average_item_level}</dd>
        </div>
      </dl>

      {(primaryProfessions.length > 0 || secondaryProfessions.length > 0) && (
        <section className="character-card__professions" aria-label="Profesiones del personaje">
          <h3>Profesiones</h3>
          {renderProfessionGroup('Primarias', primaryProfessions)}
          {renderProfessionGroup('Secundarias', secondaryProfessions)}
        </section>
      )}
    </article>
  )
}

export default CharacterDetails