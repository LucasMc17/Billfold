import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_INCOMES = 'SET_ALL_INCOMES';

/**
 * ACTION CREATORS
 */
const setAllIncomes = (incomes) => ({ type: SET_ALL_INCOMES, incomes });

/**
 * THUNK CREATORS
 */
export const fetchAllIncomes = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/all-incomes`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setAllIncomes(data));
  };
};

/**
 * REDUCER
 */
export default function allIncomes(state = [], action) {
  switch (action.type) {
    case SET_ALL_INCOMES:
      return action.incomes;
    default:
      return state;
  }
}
