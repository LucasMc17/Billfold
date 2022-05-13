import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_BUDGETS = 'SET_BUDGETS';

/**
 * ACTION CREATORS
 */
const setBudgets = (budgets) => ({ type: SET_BUDGETS, budgets });

 /**
 * THUNK CREATORS
 */
export const fetchBudgets = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get('/api/budgets', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setBudgets(data));
  };
};

export default function budgets(state = [], action) {
  switch (action.type) {
    case SET_BUDGETS:
      return action.budgets;
    default:
      return state;
  }
}
