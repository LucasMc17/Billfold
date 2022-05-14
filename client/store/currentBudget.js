import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_CURRENT_BUDGET = 'SET_CURRENT_BUDGET';
const ADD_BUDGET = 'ADD_BUDGET';

/**
 * ACTION CREATORS
 */
const setCurrentBudget = (budget) => ({ type: SET_CURRENT_BUDGET, budget });

/**
 * THUNK CREATORS
 */
export const fetchCurrentBudget = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/budgets/current`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setCurrentBudget(data));
  };
};

export default function currentBudget(state = {}, action) {
  switch (action.type) {
    case SET_CURRENT_BUDGET:
      return action.budget;
    case ADD_BUDGET:
      return action.budget;
    default:
      return state;
  }
}
