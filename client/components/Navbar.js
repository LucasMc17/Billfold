import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import Logo from './Logo';

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div>
    {isLoggedIn ? (
      <div id="nav">
        <Link to="/home">
          <div id="home-link">
            <Logo />
            <h1 id="name">illfold</h1>
          </div>
        </Link>
        <nav>
          <div id="links">
            <div>
              <Link className="nav-button" to="/myinfo">
                My Info
              </Link>
              <Link className="nav-button" to="/all-months">
                All Months
              </Link>
              <Link className="nav-button" to="/bulk-upload">
                Bulk Upload
              </Link>
              <Link className="nav-button" to="/bulk-export">
                Bulk Export
              </Link>
              <Link
                className="nav-button"
                to={`/budget-history/${new Date().getFullYear()}`}
              >
                Budget History
              </Link>
              <Link className="nav-button" to="/insights">
                Billfold Insights
              </Link>
            </div>
            <div id="logout-button">
              <a className="nav-button" href="#" onClick={handleClick}>
                Logout
              </a>
            </div>
          </div>
        </nav>
      </div>
    ) : (
      ''
    )}
  </div>
);

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
