import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_BUDGETS = 'SET_BUDGETS';
const ADD_BUDGET = 'ADD_BUDGET';

/**
 * ACTION CREATORS
 */
const setBudgets = (budgets) => ({ type: SET_BUDGETS, budgets });
const addBudget = (budget, created) => ({ type: ADD_BUDGET, budget, created });

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

export const postBudget = (budget) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post('/api/budgets', budget, {
      headers: {
        authorization: token,
      },
    });
    const [newBudget, created] = data;
    dispatch(addBudget(newBudget, created));
  };
};

export default function budgets(state = [], action) {
  switch (action.type) {
    case SET_BUDGETS:
      return action.budgets;
    case ADD_BUDGET:
      return action.created
        ? [...state, action.budget]
        : state.map((budget) => {
            if (
              budget.month === action.budget.month &&
              budget.year === action.budget.year
            ) {
              return action.budget;
            } else {
              return budget;
            }
          });
    default:
      return state;
  }
}
