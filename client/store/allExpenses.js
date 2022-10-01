import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_EXPENSES = 'SET_ALL_EXPENSES';

/**
 * ACTION CREATORS
 */
const setAllExpenses = (expenses) => ({ type: SET_ALL_EXPENSES, expenses });

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

/**
 * REDUCER
 */
export default function allExpenses(state = [], action) {
  switch (action.type) {
    case SET_ALL_EXPENSES:
      return action.expenses;
    default:
      return state;
  }
}
