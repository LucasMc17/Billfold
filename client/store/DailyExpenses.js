import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DAILIES = 'SET_DAILIES';
const ADD_DAILY = 'ADD_DAILY';

/**
 * ACTION CREATORS
 */
const setDailies = (dailies) => ({ type: SET_DAILIES, dailies });
const addDaily = (daily) => ({ type: ADD_DAILY, daily });

/**
 * THUNK CREATORS
 */
export const fetchDailies = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get('/api/daily-expenses', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setDailies(data));
  };
};

export const postDaily = (daily) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post('/api/daily-expenses', daily, {
      headers: {
        authorization: token,
      },
    });
    dispatch(addDaily(data));
  };
};

/**
 * REDUCER
 */
export default function dailyExpenses(state = [], action) {
  switch (action.type) {
    case SET_DAILIES:
      return action.dailies;
    case ADD_DAILY:
      return [...state, action.daily];
    default:
      return state;
  }
}
