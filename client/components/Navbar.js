import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';
import Logo from './Logo';
import useWindowSize from './custom_hooks/useWindowSize';

const Navbar = ({ handleClick, isLoggedIn, insights }) => {
  const { dynamicWidth } = useWindowSize();

  const [navOpen, toggleNav] = useState(false);
  console.log(navOpen);
  return (
    <div>
      {isLoggedIn ? (
        <>
          <div id="nav">
            <Link to="/home">
              <div id="home-link">
                <Logo />
                <h1 id="name">illfold</h1>
              </div>
            </Link>
            <nav>
              {dynamicWidth > 481 ? (
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
                    <Link className="nav-button insight-button" to="/insights">
                      Billfold Insights
                      {insights.length ? (
                        <div>
                          <h3>{insights.length}</h3>
                        </div>
                      ) : (
                        <></>
                      )}
                    </Link>
                  </div>
                  <div id="logout-button">
                    <a className="nav-button" href="#" onClick={handleClick}>
                      Logout
                    </a>
                  </div>
                </div>
              ) : (
                <img
                  id="nav-hamburger"
                  src="/hamburger.png"
                  onClick={() => toggleNav(!navOpen)}
                />
              )}
            </nav>
          </div>
          {navOpen ? (
            <div id="mobile-nav">
              <Link
                className="mobile-nav-button"
                to="/myinfo"
                onClick={() => toggleNav(false)}
              >
                My Info
              </Link>
              <Link
                className="mobile-nav-button"
                to="/all-months"
                onClick={() => toggleNav(false)}
              >
                All Months
              </Link>
              <Link
                className="mobile-nav-button"
                to="/bulk-upload"
                onClick={() => toggleNav(false)}
              >
                Bulk Upload
              </Link>
              <Link
                className="mobile-nav-button"
                to="/bulk-export"
                onClick={() => toggleNav(false)}
              >
                Bulk Export
              </Link>
              <Link
                className="mobile-nav-button"
                to={`/budget-history/${new Date().getFullYear()}`}
                onClick={() => toggleNav(false)}
              >
                Budget History
              </Link>
              <Link
                className="mobile-nav-button insight-button"
                to="/insights"
                onClick={() => toggleNav(false)}
              >
                Billfold Insights
                {insights.length ? (
                  <div>
                    <h3>{insights.length}</h3>
                  </div>
                ) : (
                  <></>
                )}
              </Link>
              <Link
                className="mobile-nav-button"
                href="#"
                onClick={() => {
                  toggleNav(false);
                  handleClick();
                }}
              >
                Logout
              </Link>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        ''
      )}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
    insights: state.insights.recommendations,
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
