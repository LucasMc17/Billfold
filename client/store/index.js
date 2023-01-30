import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import dailyExpenses from './DailyExpenses';
import singleYearlyDeduction from './singleYearlyDeduction';
import singleMonthlyExpense from './singleMonthlyExpense';
import singleCategory from './singleCategory';
import singleDailyExpense from './SingleDailyExpense';
import unassigned from './unassigned';
import allCategories from './allCategories';
import loading from './loading';
import allIncomes from './allIncomes';
import allDeducts from './allDeducts';
import allExpenses from './allExpenses';
import singleIncome from './singleIncome';
import insights from './insights';
import insightIgnores from './insightIgnores';
import showTutorial from './showTutorial';

const reducer = combineReducers({
  auth,
  dailyExpenses,
  singleYearlyDeduction,
  singleMonthlyExpense,
  singleCategory,
  singleDailyExpense,
  unassigned,
  allCategories,
  loading,
  allIncomes,
  allDeducts,
  allExpenses,
  singleIncome,
  insights,
  insightIgnores,
  showTutorial,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
export * from './DailyExpenses';
export * from './singleYearlyDeduction';
export * from './singleMonthlyExpense';
export * from './singleCategory';
export * from './SingleDailyExpense';
export * from './unassigned';
export * from './allCategories';
export * from './loading';
export * from './allIncomes';
export * from './allDeducts';
export * from './allExpenses';
export * from './singleIncome';
export * from './insights';
export * from './insightIgnores';
export * from './showTutorial';
