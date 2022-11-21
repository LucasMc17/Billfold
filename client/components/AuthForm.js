import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store';
import { Link } from 'react-router-dom';
import Logo from './Logo';

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const { name, displayName, handleSubmit, error } = props;

  return (
    <div id="login">
      <div id="logo-container">
        <img src="/logo.png" id="main-logo" />
        <h1>illfold</h1>
      </div>
      <div className="form loginForm">
        <div>
          {displayName === 'Login' ? (
            <div>
              <h2>Welcome to Billfold! Please log in to continue</h2>
              <h3>Don't have an account?</h3>
              <Link to="/signup">
                <button type="button">Sign Up</button>
              </Link>
            </div>
          ) : (
            <div>
              <h2>
                Welcome to Billfold! choose a username and password to continue
              </h2>
              <h3>Already have an account?</h3>
              <Link to="/login">
                <button type="button">Log In</button>
              </Link>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} name={name}>
          <div>
            <label htmlFor="username">
              <small>Username</small>
            </label>
            <input name="username" type="text" />
          </div>
          <div>
            <label htmlFor="password">
              <small>Password</small>
            </label>
            <input name="password" type="password" />
          </div>
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.auth.error,
  };
};

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.auth.error,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const username = evt.target.username.value;
      const password = evt.target.password.value;
      dispatch(authenticate(username, password, formName));
    },
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);
