import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Login, Signup } from './components/AuthForm';
import EditBasicInfo from './components/EditBasicInfo';
import Home from './components/Home';
import MonthlySummary from './components/MonthlySummary';
import MyInfo from './components/MyInfo';
import EditYearlyExpenses from './components/EditYearlyExpenses';
import EditMonthlyExpenses from './components/EditMonthlyExpenses';
import EditFixedCategories from './components/EditFixedCategories';
import EditFlexibleCategories from './components/EditFlexibleCategories';
import NewDailyForm from './components/NewDailyForm';
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
            <Route path="/test/test" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route path="/year/:year/month/:month" component={MonthlySummary} />
            <Route path="/myinfo" component={MyInfo} />
            <Route path="/edit/basic-info" component={EditBasicInfo} />
            <Route
              path="/edit/yearly-expenses"
              component={EditYearlyExpenses}
            />
            <Route
              path="/edit/monthly-expenses"
              component={EditMonthlyExpenses}
            />
            <Route
              path="/edit/fixed-categories"
              component={EditFixedCategories}
            />
            <Route
              path="/edit/flexible-categories"
              component={EditFlexibleCategories}
            />
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
