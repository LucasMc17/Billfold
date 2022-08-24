import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import Logo from './Logo';

const Navbar = ({ handleClick, isLoggedIn }) => (
  <div>
    {isLoggedIn ? (
      <div id="nav">
        <Logo />
        <h1 id="name">illfold</h1>
        <nav>
          <div id="links">
            {/* The navbar will show these links after you log in */}
            <Link to="/home">Home</Link>
            <a href="#" onClick={handleClick}>
              Logout
            </a>
            <Link to="/myinfo">My Info</Link>
            <Link to="/bulk-upload">Bulk Upload</Link>
            <Link to="/bulk-export">Bulk Export</Link>
            <Link to="/all-months">All Months</Link>
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
