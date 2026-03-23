import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CharacterDetails from '../components/CharacterDetails'
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

  return (
    <main className="character-details-page">
      <Link to="/" className="character-details-page__back-link">Volver al listado</Link>

      {isLoading && <p className="character-details-page__status">Cargando personaje...</p>}

      {!isLoading && errorMessage && (
        <p className="character-details-page__status character-details-page__status--error">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && character && <CharacterDetails {...character} />}
    </main>
  )
}

export default CharacterDetailsPage
