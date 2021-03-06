import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DAILIES = 'SET_DAILIES';
const ADD_DAILY = 'ADD_DAILY';
const DEL_DAILY = 'DEL_DAILY';
const UPDATE_DAILY = 'UPDATE_DAILY';

/**
 * ACTION CREATORS
 */
const setDailies = (dailies) => ({ type: SET_DAILIES, dailies });
const addDaily = (daily) => ({ type: ADD_DAILY, daily });
const delDaily = (daily) => ({ type: DEL_DAILY, daily });
const updateDaily = (daily) => ({ type: UPDATE_DAILY, daily });

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

export const deleteDaily = (daily) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    await axios.delete(`/api/daily-expenses/${daily.id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(delDaily(daily));
  };
};

export const patchDaily = (daily) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.put(`/api/daily-expenses/${daily.id}`, daily, {
      headers: {
        authorization: token,
      },
    });
    dispatch(updateDaily(data));
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
    case DEL_DAILY:
      return state.filter((daily) => daily.id !== action.daily.id);
    case UPDATE_DAILY:
      return state.map((daily) => {
        if (daily.id === action.daily.id) {
          return action.daily;
        } else {
          return daily;
        }
      });
    default:
      return state;
  }
}
