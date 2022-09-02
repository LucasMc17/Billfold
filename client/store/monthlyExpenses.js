import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_EXPENSES = 'SET_EXPENSES';
const DEL_EXPENSE = 'DEL_EXPENSE';
const UPDATE_EXPENSE = 'UPDATE_EXPENSE';
const ADD_EXPENSE = 'ADD_EXPENSE';

/**
 * ACTION CREATORS
 */
const setExpenses = (expenses) => ({ type: SET_EXPENSES, expenses });
const delExpense = (id) => ({ type: DEL_EXPENSE, id });
const updateExpense = (expense) => ({ type: UPDATE_EXPENSE, expense });
const addExpense = (expense) => ({ type: ADD_EXPENSE, expense });

/**
 * THUNK CREATORS
 */
export const fetchExpenses = (year, month) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/monthly-expenses/${year}/${month}`, {
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

export const patchExpense = (ex) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.put(`/api/monthly-expenses/${ex.id}`, ex, {
      headers: {
        authorization: token,
      },
    });
    dispatch(updateExpense(data));
  };
};

export const postExpense = (ex) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post('/api/monthly-expenses', ex, {
      headers: { authorization: token },
    });
    dispatch(addExpense(data));
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
    case UPDATE_EXPENSE:
      return state.map((ex) => {
        if (ex.id === action.expense.id) {
          return action.expense;
        } else {
          return ex;
        }
      });
    case ADD_EXPENSE:
      return [...state, action.expense];
    default:
      return state;
  }
}
