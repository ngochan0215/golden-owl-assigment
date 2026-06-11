import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.js';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isDark = theme === 'dark';

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand} end>
        <span className={styles.logo}>🦉</span>
        <span className={styles.brandText}>G-Scores</span>
      </NavLink>

      <div className={styles.right}>
        <ul className={styles.links}>
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''} end>
              Tra cứu
            </NavLink>
          </li>
          <li>
            <NavLink to="/report" className={({ isActive }) => isActive ? styles.active : ''}>
              Thống kê
            </NavLink>
          </li>
          <li>
            <NavLink to="/top10" className={({ isActive }) => isActive ? styles.active : ''}>
              Top 10
            </NavLink>
          </li>
        </ul>

        <div className={styles.settings} ref={menuRef}>
          <button
            type="button"
            className={`${styles.gear} ${open ? styles.gearOpen : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Cài đặt"
            aria-haspopup="true"
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {open && (
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
