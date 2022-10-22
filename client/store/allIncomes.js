import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_INCOMES = 'SET_ALL_INCOMES';
const DEL_INCOME = 'DEL_INCOME';
const ADD_INCOME = 'ADD_INCOME';

/**
 * ACTION CREATORS
 */
const setAllIncomes = (incomes) => ({ type: SET_ALL_INCOMES, incomes });
const addIncome = (income) => ({ type: ADD_INCOME, income });
const delIncome = (id) => ({ type: DEL_INCOME, id });

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
    default:
      return state;
  }
}
