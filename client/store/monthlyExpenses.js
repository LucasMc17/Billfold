import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_EXPENSES = 'SET_EXPENSES';

/**
 * ACTION CREATORS
 */
const setExpenses = (expenses) => ({ type: SET_EXPENSES, expenses });

/**
 * THUNK CREATORS
 */
export const fetchExpenses = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    console.log(token)
    const { data } = await axios.get('/api/monthly-expenses', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setExpenses(data));
  };
};

/**
 * REDUCER
 */
 export default function monthlyExpenses(state = [], action) {
  switch (action.type) {
    case SET_EXPENSES:
      return action.expenses;
    default:
      return state;
  }
}
