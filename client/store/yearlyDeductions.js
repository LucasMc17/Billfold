import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DEDUCTS = 'SET_DEDUCTS';
const DEL_DEDUCT = 'DEL_DEDUCT';

/**
 * ACTION CREATORS
 */
const setDeducts = (deducts) => ({ type: SET_DEDUCTS, deducts });
const delDeduct = (id) => ({ type: DEL_DEDUCT, id });

/**
 * THUNK CREATORS
 */
export const fetchDeducts = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get('/api/yearly-deductions', {
      headers: {
        authorization: token,
      },
    });
    dispatch(setDeducts(data));
  };
};

export const deleteDeduct = (id) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    await axios.delete(`/api/yearly-deductions/${id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(delDeduct(id));
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