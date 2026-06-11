import { NavLink } from 'react-router-dom';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.brand} end>
        <span className={styles.logo}>🦉</span>
        <span className={styles.brandText}>G-Scores</span>
      </NavLink>
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
    </nav>
  );
}