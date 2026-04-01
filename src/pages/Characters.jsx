import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import CharacterFilters from '../components/CharacterFilters'
import './Characters.css'
import horde from '../assets/HordeLogo.png'
import alliance from '../assets/AllianceLogo.webp'
import Reputations from '../components/Reputations'

const EMPTY = ''
const EXPANSION_KEYWORD = 'midnight'
const DEFAULT_SORT_ILEVEL = 'desc'

const hasExpansionKeywordTier = (profession) =>
  profession.tiers?.some((tier) => tier.expansion?.toLowerCase().includes(EXPANSION_KEYWORD)) ?? false

const getProfessionNamesWithExpansionKeyword = (character) => {
  const primaries = character.professions?.primaries ?? []
  const secondaries = character.professions?.secondaries ?? []

  return [...primaries, ...secondaries]
    .filter(hasExpansionKeywordTier)
    .map((profession) => profession.name)
}

function Characters() {
  const [characters, setCharacters] = useState([])
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [filters, setFilters] = useState({
    name: EMPTY,
    className: EMPTY,
    race: EMPTY,
    profession: EMPTY,
    sortLevel: EMPTY,
    sortIlvl: DEFAULT_SORT_ILEVEL,
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
      getProfessionNamesWithExpansionKeyword(c).forEach((name) => professions.add(name))
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
        const names = getProfessionNamesWithExpansionKeyword(c)
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
    profession: EMPTY, sortLevel: EMPTY, sortIlvl: DEFAULT_SORT_ILEVEL,
  })

  const hasActiveFilters = Object.values(filters).some((v) => v !== EMPTY)

  return (
    <main className="characters-page">
      <h1>Characters</h1>
      <p className="characters-page__subtitle">Tus personajes destacados de Azeroth.</p>

      <button
        type="button"
        className="characters-page__filters-toggle"
        onClick={() => setIsFiltersVisible((prev) => !prev)}
        aria-expanded={isFiltersVisible}
        aria-controls="characters-filters-panel"
      >
        {isFiltersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>

      {isFiltersVisible && (
        <div id="characters-filters-panel">
          <CharacterFilters
            filters={filters}
            options={options}
            onChange={set}
            onReset={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      )}

      <section className="characters-grid" aria-label="Listado de personajes">
        {filtered.length === 0 && (
          <p className="characters-page__empty">No hay personajes que coincidan con los filtros.</p>
        )}
        {filtered.map((character) => {
          const professionNames = getProfessionNamesWithExpansionKeyword(character)

          return (
            <Link to={`/characters/${character.id}`} key={character.id} className="character-preview">
              <header className="character-preview__header">
                  
                <h2>{character.name}</h2>
                <div className="character-preview__stats-badges">
                  <span className="character-preview__badge character-preview__badge--level">Nivel {character.level}</span>
                  <span className="character-preview__badge character-preview__badge--ilvl">Item Level {character.average_item_level}</span>
                  <img src={character.faction === 'Horde' ? horde : alliance} alt={`${character.faction} thumbnail`}/>
                </div>
              </header>

              <p className="character-preview__meta">{character.race} · {character.className}</p>

              {professionNames.length > 0 && (
                <ul className="character-preview__professions" aria-label="Profesiones">
                  {professionNames.map((professionName) => (
                    <li key={`${character.id}-${professionName}`} className="character-preview__profession-tag">
                      {professionName}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          )
        })}
      </section>
      <section>
        <Reputations />
      </section>
    </main>
  )
}

export default Characters