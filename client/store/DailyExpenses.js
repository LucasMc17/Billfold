import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DAILIES = 'SET_DAILIES';

/**
 * ACTION CREATORS
 */
const setDailies = (dailies) => ({ type: SET_DAILIES, dailies });

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

/**
 * REDUCER
 */
export default function dailyExpenses(state = [], action) {
  switch (action.type) {
    case SET_DAILIES:
      return action.dailies;
    default:
      return state;
  }
}
