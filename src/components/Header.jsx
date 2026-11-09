import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__brand">
          <span className="site-header__title">WoW API</span>
          <span className="site-header__tagline">Explorador de Personajes</span>
        </Link>
      </div>
    </header>
  )
}

export default Header
