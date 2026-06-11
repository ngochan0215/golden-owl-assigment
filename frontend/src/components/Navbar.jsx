import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import styles from '../styles/navbar.module.css';

const NAV_ITEMS = [
  { to: '/', label: 'Tra cứu', end: true },
  { to: '/report', label: 'Thống kê' },
  { to: '/top10', label: 'Top 10' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const settingsRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (!settingsOpen && !navOpen) return;
    function onClick(e) {
      if (settingsOpen && settingsRef.current && !settingsRef.current.contains(e.target)) setSettingsOpen(false);
      if (navOpen && navRef.current && !navRef.current.contains(e.target)) setNavOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') { setSettingsOpen(false); setNavOpen(false); }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [settingsOpen, navOpen]);

  const isDark = theme === 'dark';

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand} end>
        <span className={styles.logo}>🦉</span>
        <span className={styles.brandText}>G-Scores</span>
      </NavLink>

      <div className={styles.right}>
        <div className={styles.navGroup} ref={navRef}>
          <button
            type="button"
            className={`${styles.hamburger} ${navOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setNavOpen(o => !o)}
            aria-label="Menu"
            aria-haspopup="true"
            aria-expanded={navOpen}
          >
            <span /><span /><span />
          </button>

          <ul className={`${styles.links} ${navOpen ? styles.linksOpen : ''}`}>
            {NAV_ITEMS.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => isActive ? styles.active : ''}
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.settings} ref={settingsRef}>
          <button
            type="button"
            className={`${styles.gear} ${settingsOpen ? styles.gearOpen : ''}`}
            onClick={() => setSettingsOpen(o => !o)}
            aria-label="Cài đặt"
            aria-haspopup="true"
            aria-expanded={settingsOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {settingsOpen && (
            <div className={styles.menu} role="menu">
              <div className={styles.menuHeader}>Cài đặt</div>

              <div className={styles.menuRow}>
                <div className={styles.menuLabel}>
                  <span className={styles.menuIcon}>{isDark ? '🌙' : '☀️'}</span>
                  <span>Giao diện {isDark ? 'tối' : 'sáng'}</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isDark}
                  className={`${styles.switch} ${isDark ? styles.switchOn : ''}`}
                  onClick={toggleTheme}
                >
                  <span className={styles.knob} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
