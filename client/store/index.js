import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import yearlyDeductions from './yearlyDeductions';
import monthlyExpenses from './monthlyExpenses';
import categories from './categories';
import dailyExpenses from './DailyExpenses';
import singleYearlyDeduction from './singleYearlyDeduction';
import singleMonthlyExpense from './singleMonthlyExpense';
import singleCategory from './singleCategory';
import singleDailyExpense from './SingleDailyExpense';
import unassigned from './unassigned';
import income from './income';
import homeChartData from './homeChartData';
import availableCategories from './availableCategories';
import monthChartData from './monthChartData';

const reducer = combineReducers({
  auth,
  yearlyDeductions,
  monthlyExpenses,
  categories,
  dailyExpenses,
  singleYearlyDeduction,
  singleMonthlyExpense,
  singleCategory,
  singleDailyExpense,
  unassigned,
  income,
  homeChartData,
  availableCategories,
  monthChartData,
});
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
export * from './yearlyDeductions';
export * from './monthlyExpenses';
export * from './categories';
export * from './DailyExpenses';
export * from './singleYearlyDeduction';
export * from './singleMonthlyExpense';
export * from './singleCategory';
export * from './SingleDailyExpense';
export * from './unassigned';
export * from './income';
export * from './homeChartData';
export * from './availableCategories';
export * from './monthChartData';
