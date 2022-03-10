import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DEDUCTS = 'SET_DEDUCTS';

/**
 * ACTION CREATORS
 */
const setDeducts = (deducts) => ({ type: SET_DEDUCTS, deducts });

/**
 * THUNK CREATORS
 */
export const fetchDeducts = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    console.log(token)
    const { data } = await axios.get('/api/yearly-deductions', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setDeducts(data));
  };
};

/**
 * REDUCER
 */
 export default function yearlyDeductions(state = [], action) {
  switch (action.type) {
    case SET_DEDUCTS:
      return action.deducts;
    default:
      return state;
  }
}
