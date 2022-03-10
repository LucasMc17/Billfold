import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import MonthlySummary from './components/MonthlySummary';
import MyInfo from './components/MyInfo';
import {
  fetchDeducts,
  fetchExpenses,
  me,
  fetchCategories,
  fetchDailies,
} from './store';

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route path="/year/:year/month/:month" component={MonthlySummary} />
            <Route path="/myinfo" component={MyInfo} />
            <Route path="/edit/basic-info" component={MyInfo} />
            <Route path="/edit/yearly-expenses" component={MyInfo} />
            <Route path="/edit/monthly-expenses" component={MyInfo} />
            <Route path="/edit/fixed-categories" component={MyInfo} />
            <Route path="/edit/flexible-categories" component={MyInfo} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Redirect to="/login" />
          </Switch>
        )}
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
      dispatch(fetchDeducts());
      dispatch(fetchExpenses());
      dispatch(fetchCategories());
      dispatch(fetchDailies());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
