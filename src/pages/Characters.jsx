import CharacterDetails from '../components/CharacterDetails'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
          <CharacterDetails key={character.id} {...character} />
        ))}
      </section>
    </main>
  )
}

export default Characters