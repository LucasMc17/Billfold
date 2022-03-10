import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import auth from './auth';
import yearlyDeductions from './yearlyDeductions';
import monthlyExpenses from './monthlyExpenses';
import categories from './categories';

const reducer = combineReducers({
  auth,
  yearlyDeductions,
  monthlyExpenses,
  categories,
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
