import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_EXPENSE = 'SET_EXPENSE';

/**
 * ACTION CREATORS
 */
const setExpense = (expense) => ({ type: SET_EXPENSE, expense });

/**
 * THUNK CREATORS
 */
export const fetchExpense = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/monthly-expenses/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setExpense(data));
  };
};

/**
 * REDUCER
 */
export default function singleMonthlyExpense(state = {}, action) {
  switch (action.type) {
    case SET_EXPENSE:
      return action.expense;
    default:
      return state;
  }
}
