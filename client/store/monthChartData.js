import axios from 'axios';

// ACTION TYPES
const SET_MONTH_DATA = 'SET_MONTH_DATA';

// ACTION CREATORS
const setMonthData = (data) => ({ type: SET_MONTH_DATA, data });

// THUNK CREATORS
export const fetchMonthChartData = (year, month, metric) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(
      `/api/month-chart-data/${year}/${month}/${metric}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch(setMonthData(data));
  };
};

// DEFAULT STATE
const defaultState = {
  labels: [],
  spents: [],
  budgets: [],
};

// REDUCER
export default function monthChartData(state = defaultState, action) {
  switch (action.type) {
    case SET_MONTH_DATA:
      return action.data;
    default:
      return state;
  }
}
