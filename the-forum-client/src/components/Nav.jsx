import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
  const btnRef = React.createRef();

  const handleFocus = () => {
    btnRef.current.click();
  };

  // Check if the user is logged in
  const isLoggedIn = !!localStorage.getItem('token'); // true if token exists, false otherwise

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-info position-sticky top-0 shadow z-3">
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center">
          <a className="navbar-brand text-blue fs-3 fw-bold" href="/">The Forum</a>
        </div>

        {/* Toggle button for small screens */}
        <button
          ref={btnRef}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"  onFocus={handleFocus}>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? 'nav-link text-blue fs-5 active-link' : 'nav-link text-blue fs-5'}
                to="/">Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => isActive ? 'nav-link text-blue fs-5 active-link' : 'nav-link text-blue fs-5'}
                to="/info/contact">Contact Us
              </NavLink>
            </li>

            {/* Conditional rendering for Login/Register */}
            {!isLoggedIn &&
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => isActive ? 'nav-link text-blue fs-5 active-link' : 'nav-link text-blue fs-5'}
                    to="/auth/login">Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) => isActive ? 'nav-link text-blue fs-5 active-link' : 'nav-link text-blue fs-5'}
                    to="/auth/register">Register
                  </NavLink>
                </li>
              </>}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
