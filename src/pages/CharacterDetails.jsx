/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
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

  const primaryProfessions = character?.professions?.primaries ?? []
  const secondaryProfessions = character?.professions?.secondaries ?? []

  return (
    <main className="character-details-page">
      <Link to="/" className="character-details-page__back-link">Volver al listado</Link>

      {isLoading && <p className="character-details-page__status">Cargando personaje...</p>}

      {!isLoading && errorMessage && (
        <p className="character-details-page__status character-details-page__status--error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && character && (
        <article className="character-card">
          <header className="character-card__header">
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
              {renderProfessionGroup('Primarias', primaryProfessions)}
              {renderProfessionGroup('Secundarias', secondaryProfessions)}
            </section>
          )}
        </article>
      )}
    </main>
  )
}

export default CharacterDetailsPage
