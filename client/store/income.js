import axios from 'axios';

// ACTION TYPES
const SET_INCOME = 'SET_INCOME';
const SET_NEW_INCOME = 'SET_NEW_INCOME';

// ACTION CREATORS
const setIncome = (income) => ({ type: SET_INCOME, income });
const setNewIncome = (income) => ({ type: SET_NEW_INCOME, income });

// THUNK CREATORS
export const fetchIncome = (year, month) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/incomes/${year}/${month}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setIncome(data));
  };
};

export const patchIncome = (income) => {
  return async (dispatch) => {
    dispatch(setIncome(income.income));
    const token = window.localStorage.getItem('token');
    await axios.post(`/api/incomes/new-income`, income, {
      headers: {
        authorization: token,
      },
    });
  };
};

// REDUCER
export default function income(state = 40000, action) {
  switch (action.type) {
    case SET_INCOME:
      return action.income;
    case SET_NEW_INCOME:
      return action.income;
    default:
      return state;
  }
}
