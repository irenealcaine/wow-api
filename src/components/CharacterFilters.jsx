/* eslint-disable react/prop-types */
import './CharacterFilters.css'

function CharacterFilters({ filters, options, onChange, onReset, hasActiveFilters }) {
  return (
    <div className="characters-filters">
      <input
        className="characters-filters__input"
        type="search"
        placeholder="Shearch by name..."
        value={filters.name}
        onChange={onChange('name')}
      />

      <div className="characters-filters__row">
        <select className="characters-filters__select" value={filters.className} onChange={onChange('className')}>
          <option value="">All classes</option>
          {options.classes.map((characterClass) => (
            <option key={characterClass} value={characterClass}>{characterClass}</option>
          ))}
        </select>

        <select className="characters-filters__select" value={filters.race} onChange={onChange('race')}>
          <option value="">All races</option>
          {options.races.map((race) => (
            <option key={race} value={race}>{race}</option>
          ))}
        </select>

        <select className="characters-filters__select" value={filters.profession} onChange={onChange('profession')}>
          <option value="">All professions</option>
          {options.professions.map((profession) => (
            <option key={profession} value={profession}>{profession}</option>
          ))}
        </select>
      </div>

      <div className="characters-filters__row">
        <select className="characters-filters__select" value={filters.sortLevel} onChange={onChange('sortLevel')}>
          <option value="">Sort by level</option>
          <option value="asc">Level ascending</option>
          <option value="desc">Level descending</option>
        </select>

        <select className="characters-filters__select" value={filters.sortIlvl} onChange={onChange('sortIlvl')}>
          <option value="">Sort by item level</option>
          <option value="asc">Item level ascending</option>
          <option value="desc">Item level descending</option>
        </select>

        {hasActiveFilters && (
          <button className="characters-filters__reset" type="button" onClick={onReset}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

export default CharacterFilters
