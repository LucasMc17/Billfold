import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DEDUCT = 'SET_DEDUCT';

/**
 * ACTION CREATORS
 */
const setDeduct = (deduct) => ({ type: SET_DEDUCT, deduct });

/**
 * THUNK CREATORS
 */
export const fetchDeduct = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/yearly-deductions/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setDeduct(data));
  };
};

/**
 * REDUCER
 */
export default function yearlyDeductions(state = {}, action) {
  switch (action.type) {
    case SET_DEDUCT:
      return action.deduct;
    default:
      return state;
  }
}
