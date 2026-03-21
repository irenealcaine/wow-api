function CharacterDetails({ name, realm, className, level}) {
  return (
    <article className="character-card">
      <header className="character-card__header">
        <h2>{name}</h2>
        <span className="character-card__level">Nivel {level}</span>
      </header>

      <dl className="character-card__stats">
        <div>
          <dt>Reino</dt>
          <dd>{realm}</dd>
        </div>
        <div>
          <dt>Clase</dt>
          <dd>{className}</dd>
        </div>

      </dl>
    </article>
  )
}

export default CharacterDetails