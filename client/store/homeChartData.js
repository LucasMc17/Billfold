import axios from 'axios';
import { homeSetLoading } from './loading';

// ACTION TYPES
const SET_DATA = 'SET_DATA';

// ACTION CREATORS
const setData = (data) => ({ type: SET_DATA, data });

// THUNK CREATORS
export const fetchChartData = (view) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(
      `/api/chart-data/custom/${view.startYear}/${view.startMonth}/to/${view.endYear}/${view.endMonth}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch(setData(data));
    dispatch(homeSetLoading(false));
  };
};

// DEFAULT STATE
const defaultState = {
  spents: [],
  budgets: [],
};

// REDUCER
export default function homeChartData(state = defaultState, action) {
  switch (action.type) {
    case SET_DATA:
      return action.data;
    default:
      return state;
  }
}
