import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_EXPENSES = 'SET_ALL_EXPENSES';
const DEL_EXPENSE = 'DEL_EXPENSE';
const ADD_EXPENSE = 'ADD_EXPENSE';
const UPDATE_EXPENSE = 'UPDATE_EXPENSE';

/**
 * ACTION CREATORS
 */
const setAllExpenses = (expenses) => ({ type: SET_ALL_EXPENSES, expenses });
const delExpense = (id) => ({ type: DEL_EXPENSE, id });
const addExpense = (expense) => ({ type: ADD_EXPENSE, expense });
const updateExpense = (expenses) => ({ type: UPDATE_EXPENSE, expenses });

/**
 * THUNK CREATORS
 */
export const fetchAllExpenses = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/all-expenses`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setAllExpenses(data));
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
export default function allExpenses(state = [], action) {
  switch (action.type) {
    case SET_ALL_EXPENSES:
      return action.expenses;
    case ADD_EXPENSE:
      return [...state, action.expense];
    case DEL_EXPENSE:
      return state.filter((ex) => ex.id !== action.id);
    case UPDATE_EXPENSE:
      const [oldEx, newEx] = action.expenses;
      const newState = state.map((ex) => {
        if (ex.id === oldEx.id) {
          return oldEx;
        } else {
          return ex;
        }
      });
      if (!newEx) {
        return newState;
      } else {
        return [...newState, newEx];
      }
    default:
      return state;
  }
}
