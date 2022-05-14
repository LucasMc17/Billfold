import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ACTIVE_BUDGET = 'SET_ACTIVE_BUDGET';

/**
 * ACTION CREATORS
 */
const setActiveBudget = (budget) => ({ type: SET_ACTIVE_BUDGET, budget });

/**
 * THUNK CREATORS
 */
export const fetchActiveBudget = (year, month) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/budgets/${year}/${month}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(SET_ACTIVE_BUDGET(data));
  };
};

export default function activeBudget(state = {}, action) {
  switch (action.type) {
    case SET_ACTIVE_BUDGET:
      return action.budget;
    default:
      return state;
  }
}
