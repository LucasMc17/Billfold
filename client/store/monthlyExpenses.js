import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_EXPENSES = 'SET_EXPENSES';
const DEL_EXPENSE = 'DEL_EXPENSE';

/**
 * ACTION CREATORS
 */
const setExpenses = (expenses) => ({ type: SET_EXPENSES, expenses });
const delExpense = (id) => ({ type: DEL_EXPENSE, id });

/**
 * THUNK CREATORS
 */
export const fetchExpenses = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get('/api/monthly-expenses', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setExpenses(data));
  };
};

export const deleteExpense = (ex) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    await axios.delete(`/api/monthly-expenses/${ex.id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(delExpense(ex.id));
  };
};

/**
 * REDUCER
 */
export default function monthlyExpenses(state = [], action) {
  switch (action.type) {
    case SET_EXPENSES:
      return action.expenses;
    case DEL_EXPENSE:
      return state.filter((ex) => ex.id !== action.id);
    default:
      return state;
  }
}
