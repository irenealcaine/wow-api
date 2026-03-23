import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import './Characters.css'

function Characters() {
  const [characters, setCharacters] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')

      if (!error) setCharacters(data)
    }

    fetchData()
  }, [])

  return (
    <main className="characters-page">
      <h1>Characters</h1>
      <p className="characters-page__subtitle">Tus personajes destacados de Azeroth.</p>

      <section className="characters-grid" aria-label="Listado de personajes">
        {characters.map((character) => (
          <Link to={`/characters/${character.id}`} key={character.id} className="character-preview">
            <header className="character-preview__header">
              <h2>{character.name}</h2>
              <span>Nivel {character.level}</span>
            </header>

            <p className="character-preview__meta">{character.className} {character.active_spec}</p>
            <p className="character-preview__meta">{character.race} - {character.faction}</p>
            <p className="character-preview__meta">{character.realm}</p>
            <p className="character-preview__ilvl">Item Level {character.average_item_level}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Characters