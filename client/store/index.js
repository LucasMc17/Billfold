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
import homeChartData from './homeChartData';
import monthChartData from './monthChartData';
import allCategories from './allCategories';
import loading from './loading';
import allIncomes from './allIncomes';
import allDeducts from './allDeducts';
import allExpenses from './allExpenses';
import singleIncome from './singleIncome';

const reducer = combineReducers({
  auth,
  // yearlyDeductions,
  // monthlyExpenses,
  // categories,
  dailyExpenses,
  singleYearlyDeduction,
  singleMonthlyExpense,
  singleCategory,
  singleDailyExpense,
  unassigned,
  homeChartData,
  monthChartData,
  allCategories,
  loading,
  allIncomes,
  allDeducts,
  allExpenses,
  singleIncome,
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
export * from './homeChartData';
export * from './monthChartData';
export * from './allCategories';
export * from './loading';
export * from './allIncomes';
export * from './allDeducts';
export * from './allExpenses';
export * from './singleIncome';
