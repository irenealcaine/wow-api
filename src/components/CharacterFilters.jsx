/* eslint-disable react/prop-types */
import './CharacterFilters.css'

function CharacterFilters({ filters, options, onChange, onReset, hasActiveFilters }) {
  return (
    <div className="characters-filters">
      <input
        className="characters-filters__input"
        type="search"
        placeholder="Buscar por nombre..."
        value={filters.name}
        onChange={onChange('name')}
      />

      <div className="characters-filters__row">
        <select className="characters-filters__select" value={filters.className} onChange={onChange('className')}>
          <option value="">Todas las clases</option>
          {options.classes.map((characterClass) => (
            <option key={characterClass} value={characterClass}>{characterClass}</option>
          ))}
        </select>

        <select className="characters-filters__select" value={filters.race} onChange={onChange('race')}>
          <option value="">Todas las razas</option>
          {options.races.map((race) => (
            <option key={race} value={race}>{race}</option>
          ))}
        </select>

        <select className="characters-filters__select" value={filters.profession} onChange={onChange('profession')}>
          <option value="">Todas las profesiones</option>
          {options.professions.map((profession) => (
            <option key={profession} value={profession}>{profession}</option>
          ))}
        </select>
      </div>

      <div className="characters-filters__row">
        <select className="characters-filters__select" value={filters.sortLevel} onChange={onChange('sortLevel')}>
          <option value="">Ordenar por nivel</option>
          <option value="asc">Nivel ascendente</option>
          <option value="desc">Nivel descendente</option>
        </select>

        <select className="characters-filters__select" value={filters.sortIlvl} onChange={onChange('sortIlvl')}>
          <option value="">Ordenar por item level</option>
          <option value="asc">Item level ascendente</option>
          <option value="desc">Item level descendente</option>
        </select>

        {hasActiveFilters && (
          <button className="characters-filters__reset" type="button" onClick={onReset}>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export default CharacterFilters
