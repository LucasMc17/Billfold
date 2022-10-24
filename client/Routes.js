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
import EditSingleYearlyExpense from './components/EditSingleYearlyExpense';
import EditSingleMonthlyExpense from './components/EditSingleMonthlyExpense';
import EditSingleCategory from './components/EditSingleCategory';
import AllMonths from './components/AllMonths';
import EditDailyExpense from './components/EditDailyExpense';
import BulkUpload from './components/BulkUpload';
import BulkExport from './components/BulkExport';
import BudgetHistory from './components/BudgetHistory';
import EditSingleYearlyExpenseDates from './components/EditSingleYearlyExpenseDates';
import EditSingleMonthlyExpenseDates from './components/EditSingleMonthlyExpenseDates';
import EditSingleCategoryDates from './components/EditSingleCategoryDates';
import EditIncomes from './components/EditIncomes';
import EditSingleIncomeDates from './components/EditSingleIncomeDates';
import EditSingleIncome from './components/EditSingleIncome';
import { me } from './store';

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
      <div id="page">
        {isLoggedIn ? (
          <Switch>
            <Route path="/all-months" component={AllMonths} />
            <Route exact path="/home" component={Home} />
            <Route path="/year/:year/month/:month" component={MonthlySummary} />
            <Route path="/myinfo" component={MyInfo} />
            <Route path="/bulk-upload" component={BulkUpload} />
            <Route path="/bulk-export" component={BulkExport} />
            <Route path="/budget-history/:year" component={BudgetHistory} />
            <Route path="/edit/basic-info" component={EditBasicInfo} />
            <Route exact path="/edit/incomes" component={EditIncomes} />
            <Route
              exact
              path="/edit/incomes/dates/:id"
              component={EditSingleIncomeDates}
            />
            <Route
              exact
              path="/edit/incomes/:id"
              component={EditSingleIncome}
            />
            <Route
              exact
              path="/edit/yearly-expenses"
              component={EditYearlyExpenses}
            />
            <Route
              path="/edit/yearly-expenses/dates/:id"
              component={EditSingleYearlyExpenseDates}
            />
            <Route
              path="/edit/yearly-expenses/:id"
              component={EditSingleYearlyExpense}
            />
            <Route
              exact
              path="/edit/monthly-expenses"
              component={EditMonthlyExpenses}
            />
            <Route
              path="/edit/monthly-expenses/dates/:id"
              component={EditSingleMonthlyExpenseDates}
            />
            <Route
              path="/edit/monthly-expenses/:id"
              component={EditSingleMonthlyExpense}
            />
            <Route
              path="/edit/fixed-categories"
              component={EditFixedCategories}
            />
            <Route
              path="/edit/flexible-categories"
              component={EditFlexibleCategories}
            />
            <Route
              path="/edit/categories/dates/:id"
              component={EditSingleCategoryDates}
            />
            <Route path="/edit/categories/:id" component={EditSingleCategory} />
            <Route
              path="/edit/daily-expenses/:id"
              component={EditDailyExpense}
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
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
