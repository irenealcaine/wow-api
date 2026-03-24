import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import CharacterFilters from '../components/CharacterFilters'
import './Characters.css'

const EMPTY = ''

function Characters() {
  const [characters, setCharacters] = useState([])
  const [filters, setFilters] = useState({
    name: EMPTY,
    className: EMPTY,
    race: EMPTY,
    profession: EMPTY,
    sortLevel: EMPTY,
    sortIlvl: EMPTY,
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')

      if (!error) setCharacters(data)
    }

    fetchData()
  }, [])

  const options = useMemo(() => {
    const classes = new Set()
    const races = new Set()
    const professions = new Set()

    characters.forEach((c) => {
      if (c.className) classes.add(c.className)
      if (c.race) races.add(c.race)
      const primaries = c.professions?.primaries ?? []
      const secondaries = c.professions?.secondaries ?? []
      ;[...primaries, ...secondaries].forEach((p) => professions.add(p.name))
    })

    return {
      classes: [...classes].sort(),
      races: [...races].sort(),
      professions: [...professions].sort(),
    }
  }, [characters])

  const filtered = useMemo(() => {
    const result = characters.filter((c) => {
      if (filters.name && !c.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      if (filters.className && c.className !== filters.className) return false
      if (filters.race && c.race !== filters.race) return false
      if (filters.profession) {
        const primaries = c.professions?.primaries ?? []
        const secondaries = c.professions?.secondaries ?? []
        const names = [...primaries, ...secondaries].map((p) => p.name)
        if (!names.includes(filters.profession)) return false
      }
      return true
    })

    const compareNumeric = (a, b, direction) => {
      if (!direction) return 0
      return direction === 'asc' ? a - b : b - a
    }

    return [...result].sort((a, b) => {
      const levelCompare = compareNumeric(a.level ?? 0, b.level ?? 0, filters.sortLevel)
      if (levelCompare !== 0) return levelCompare

      return compareNumeric(
        a.average_item_level ?? 0,
        b.average_item_level ?? 0,
        filters.sortIlvl,
      )
    })
  }, [characters, filters])

  const set = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))

  const resetFilters = () => setFilters({
    name: EMPTY, className: EMPTY, race: EMPTY,
    profession: EMPTY, sortLevel: EMPTY, sortIlvl: EMPTY,
  })

  const hasActiveFilters = Object.values(filters).some((v) => v !== EMPTY)

  return (
    <main className="characters-page">
      <h1>Characters</h1>
      <p className="characters-page__subtitle">Tus personajes destacados de Azeroth.</p>

      <CharacterFilters
        filters={filters}
        options={options}
        onChange={set}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <section className="characters-grid" aria-label="Listado de personajes">
        {filtered.length === 0 && (
          <p className="characters-page__empty">No hay personajes que coincidan con los filtros.</p>
        )}
        {filtered.map((character) => {
          const primaries = character.professions?.primaries ?? []
          const secondaries = character.professions?.secondaries ?? []
          const professionNames = [...primaries, ...secondaries].map((p) => p.name)

          return (
            <Link to={`/characters/${character.id}`} key={character.id} className="character-preview">
              <header className="character-preview__header">
                <h2>{character.name}</h2>
                <span>Nivel {character.level}</span>
              </header>

              <p className="character-preview__meta">{character.className} · {character.race}</p>
              <p className="character-preview__ilvl">Item Level {character.average_item_level}</p>

              {professionNames.length > 0 && (
                <p className="character-preview__professions">{professionNames.join(', ')}</p>
              )}
            </Link>
          )
        })}
      </section>
    </main>
  )
}

export default Characters