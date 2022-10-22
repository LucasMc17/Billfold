import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_SINGLE_INCOME = 'SET_SINGLE_INCOME';

/**
 * ACTION CREATORS
 */
const setSingleIncome = (income) => ({ type: SET_SINGLE_INCOME, income });

/**
 * THUNK CREATORS
 */
export const fetchSingleIncome = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/all-incomes/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setSingleIncome(data));
  };
};

/**
 * REDUCER
 */
export default function singleYearlyDeduction(state = {}, action) {
  switch (action.type) {
    case SET_SINGLE_INCOME:
      return action.income;
    default:
      return state;
  }
}
