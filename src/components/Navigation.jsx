import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="main-nav">
      <h1>Video Player Test App</h1>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/embedded-tracks" className={({ isActive }) => isActive ? 'active' : ''}>
            Embedded Tracks Player
          </NavLink>
        </li>
        <li>
          <NavLink to="/external-tracks" className={({ isActive }) => isActive ? 'active' : ''}>
            External Tracks Player
          </NavLink>
        </li>
        <li>
          <NavLink to="/file-picker" className={({ isActive }) => isActive ? 'active' : ''}>
            File Picker Player
          </NavLink>
        </li>
        <li>
          <NavLink to="/custom-player" className={({ isActive }) => isActive ? 'active' : ''}>
            Custom Player
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
