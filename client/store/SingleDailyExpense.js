import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DAILY = 'SET_DAILY';

/**
 * ACTION CREATORS
 */
const setDaily = (daily) => ({ type: SET_DAILY, daily });

/**
 * THUNK CREATORS
 */
export const fetchDaily = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/daily-expenses/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setDaily(data));
  };
};

/**
 * REDUCER
 */
export default function singleDailyExpense(state = {}, action) {
  switch (action.type) {
    case SET_DAILY:
      return action.daily;
    default:
      return state;
  }
}
