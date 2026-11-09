import './Footer.css'

const CONTACT_LINKS = [
  { label: 'Email', href: 'mailto:irenealcainealvarez@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/irenealcaine/' },
  { label: 'GitHub', href: 'https://github.com/irenealcaine' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav className="site-footer__links" aria-label="Contact">
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="site-footer__note">World of Warcraft fan project</p>
      </div>
    </footer>
  )
}

export default Footer
