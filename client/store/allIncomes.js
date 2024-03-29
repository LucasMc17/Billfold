import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_INCOMES = 'SET_ALL_INCOMES';
const DEL_INCOME = 'DEL_INCOME';
const ADD_INCOME = 'ADD_INCOME';
const UPDATE_INCOME = 'UPDATE_INCOME';

/**
 * ACTION CREATORS
 */
const setAllIncomes = (incomes) => ({ type: SET_ALL_INCOMES, incomes });
const addIncome = (income) => ({ type: ADD_INCOME, income });
const delIncome = (id) => ({ type: DEL_INCOME, id });
const updateIncome = (incomes) => ({ type: UPDATE_INCOME, incomes });

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

export const deleteIncome = (income) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    await axios.delete(`/api/all-incomes/${income.id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(delIncome(income.id));
  };
};

export const patchIncome = (income) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.put(`/api/all-incomes/${income.id}`, income, {
      headers: {
        authorization: token,
      },
    });
    dispatch(updateIncome(data));
  };
};

export const postIncome = (income) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post(`/api/all-incomes/`, income, {
      headers: {
        authorization: token,
      },
    });
    dispatch(addIncome(data));
  };
};

/**
 * REDUCER
 */
export default function allIncomes(state = [], action) {
  switch (action.type) {
    case SET_ALL_INCOMES:
      return action.incomes;
    case ADD_INCOME:
      return [...state, action.income];
    case DEL_INCOME:
      return state.filter((income) => income.id !== action.id);
    case UPDATE_INCOME:
      const [oldInc, newInc] = action.incomes;
      const newState = state.map((inc) => {
        if (inc.id === oldInc.id) {
          return oldInc;
        } else {
          return inc;
        }
      });
      if (!newInc) {
        return newState;
      } else {
        return [...newState, newInc];
      }
    default:
      return state;
  }
}
