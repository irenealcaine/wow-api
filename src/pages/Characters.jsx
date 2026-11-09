import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Link } from 'react-router-dom'
import CharacterFilters from '../components/CharacterFilters'
import './Characters.css'
import horde from '../assets/HordeLogo.png'
import alliance from '../assets/AllianceLogo.webp'
import Reputations from '../components/Reputations'
import Skeleton from '../components/Skeleton'

const EMPTY = ''
const EXPANSION_KEYWORD = 'midnight'
const DEFAULT_SORT_LEVEL = 'desc'
const DEFAULT_SORT_ILEVEL = 'desc'
const DEFAULT_GAME_TAB = 'retail'
const OTHERS_GAME_TAB = 'others'

const GAME_TABS = [
  { value: 'retail', label: 'Retail' },
  { value: 'forever', label: 'Forever' },
  { value: OTHERS_GAME_TAB, label: 'Others' },
]

const getGameTabValue = (game) => {
  const value = typeof game === 'string' ? game.toLowerCase() : EMPTY
  return GAME_TABS.some((tab) => tab.value === value) ? value : OTHERS_GAME_TAB
}

const hasExpansionKeywordTier = (profession) =>
  profession.tiers?.some((tier) => tier.expansion?.toLowerCase().includes(EXPANSION_KEYWORD)) ?? false

const getProfessionNamesWithExpansionKeyword = (character) => {
  const primaries = character.professions?.primaries ?? []
  const secondaries = character.professions?.secondaries ?? []

  return [...primaries, ...secondaries]
    .filter(hasExpansionKeywordTier)
    .map((profession) => profession.name)
}

const getAllProfessionNames = (character) => {
  const primaries = character.professions?.primaries ?? []
  const secondaries = character.professions?.secondaries ?? []

  return [...primaries, ...secondaries].map((profession) => profession.name)
}

const getProfessionNames = (character) =>
  getGameTabValue(character.game) === 'forever'
    ? getAllProfessionNames(character)
    : getProfessionNamesWithExpansionKeyword(character)

const getRenderImage = (character) => {
  const media = character.media ?? []

  return (
    media.find((asset) => asset.name === 'main-raw')?.value ??
    media.find((asset) => asset.name === 'avatar')?.value ??
    null
  )
}

function Characters() {
  const [characters, setCharacters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [activeGame, setActiveGame] = useState(DEFAULT_GAME_TAB)
  const [filters, setFilters] = useState({
    name: EMPTY,
    className: EMPTY,
    race: EMPTY,
    profession: EMPTY,
    sortLevel: DEFAULT_SORT_LEVEL,
    sortIlvl: DEFAULT_SORT_ILEVEL,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'characters'))
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        setCharacters(data)
      } catch {
        setCharacters([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const tabCharacters = useMemo(
    () => characters.filter((character) => getGameTabValue(character.game) === activeGame),
    [characters, activeGame],
  )

  const options = useMemo(() => {
    const classes = new Set()
    const races = new Set()
    const professions = new Set()

    tabCharacters.forEach((c) => {
      if (c.className) classes.add(c.className)
      if (c.race) races.add(c.race)
      getProfessionNames(c).forEach((name) => professions.add(name))
    })

    return {
      classes: [...classes].sort(),
      races: [...races].sort(),
      professions: [...professions].sort(),
    }
  }, [tabCharacters])

  const filtered = useMemo(() => {
    const result = tabCharacters.filter((c) => {
      if (filters.name && !c.name.toLowerCase().includes(filters.name.toLowerCase())) return false
      if (filters.className && c.className !== filters.className) return false
      if (filters.race && c.race !== filters.race) return false
      if (filters.profession) {
        const names = getProfessionNames(c)
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
  }, [tabCharacters, filters])

  const gameTabs = useMemo(() => {
    const hasOthers = characters.some((character) => getGameTabValue(character.game) === OTHERS_GAME_TAB)
    return hasOthers ? GAME_TABS : GAME_TABS.filter((tab) => tab.value !== OTHERS_GAME_TAB)
  }, [characters])

  const set = (key) => (e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))

  const resetFilters = () => setFilters({
    name: EMPTY, className: EMPTY, race: EMPTY,
    profession: EMPTY, sortLevel: DEFAULT_SORT_LEVEL, sortIlvl: DEFAULT_SORT_ILEVEL,
  })

  const hasActiveFilters = Object.values(filters).some((v) => v !== EMPTY)

  return (
    <main className="characters-page">
      <h1>Characters</h1>
      <p className="characters-page__subtitle">For Azeroth</p>

      <div className="characters-page__toolbar">
        <input
          className="characters-page__search"
          type="search"
          placeholder="Search by name..."
          value={filters.name}
          onChange={set('name')}
          aria-label="Search by name"
        />

        <div className="characters-page__tabs" role="tablist" aria-label="Game">
          {gameTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              id={`game-tab-${tab.value}`}
              aria-selected={activeGame === tab.value}
              aria-controls="characters-grid-panel"
              className={`characters-page__tab${activeGame === tab.value ? ' characters-page__tab--active' : ''}`}
              onClick={() => setActiveGame(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="characters-page__filters-toggle"
          onClick={() => setIsFiltersVisible((prev) => !prev)}
          aria-expanded={isFiltersVisible}
          aria-controls="characters-filters-panel"
        >
          {isFiltersVisible ? 'Hide filters' : 'Filters'}
        </button>
      </div>

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

      {!isLoading && (
        <p className="characters-page__count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'character' : 'characters'}
        </p>
      )}

      <section
        id="characters-grid-panel"
        role="tabpanel"
        aria-labelledby={`game-tab-${activeGame}`}
        aria-busy={isLoading}
        className="characters-grid"
        aria-label="Listado de personajes"
      >
        {isLoading && Array.from({ length: 6 }, (_, index) => (
          <div key={`skeleton-${index}`} className="character-preview character-preview--skeleton">
            <Skeleton className="character-preview__skeleton-media" />
            <div className="character-preview__body">
              <Skeleton style={{ height: '1.25rem', width: '55%' }} />
              <Skeleton style={{ height: '0.9rem', width: '40%' }} />
              <Skeleton style={{ height: '0.75rem', width: '65%' }} />
            </div>
          </div>
        ))}
        {!isLoading && filtered.length === 0 && (
          <p className="characters-page__empty">No characters match the filters.</p>
        )}
        {!isLoading && filtered.map((character) => {
          const professionNames = getProfessionNames(character)

          const renderImage = getRenderImage(character)

          return (
            <Link
              to={`/characters/${character.id}`}
              key={character.id}
              className={`character-preview ${character.faction === 'Horde' ? 'character-preview--horde' : 'character-preview--alliance'}`}
            >
              {renderImage && (
                <div className="character-preview__media">
                  <img src={renderImage} alt="" loading="lazy" />
                </div>
              )}

              <div className="character-preview__body">
                <header className="character-preview__header">
                  <h2>{character.name}</h2>
                  <div className="character-preview__stats-badges">
                    <span className="character-preview__badge character-preview__badge--level">lvl {character.level}</span>
                    <span className="character-preview__badge character-preview__badge--ilvl">ilvl {character.average_item_level}</span>
                    <img src={character.faction === 'Horde' ? horde : alliance} alt={`${character.faction} thumbnail`}/>
                  </div>
                </header>

                <p className="character-preview__meta">{character.race} · {character.className}</p>

                {professionNames.length > 0 && (
                  <ul className="character-preview__professions" aria-label="Professions">
                    {professionNames.map((professionName) => (
                      <li key={`${character.id}-${professionName}`} className="character-preview__profession-tag">
                        {professionName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Link>
          )
        })}
      </section>
      {activeGame === 'retail' && (
        <section>
          <Reputations />
        </section>
      )}
    </main>
  )
}

export default Characters