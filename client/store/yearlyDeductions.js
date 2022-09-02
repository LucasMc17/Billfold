import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_DEDUCTS = 'SET_DEDUCTS';
const DEL_DEDUCT = 'DEL_DEDUCT';
const UPDATE_DEDUCT = 'UPDATE_DEDUCT';
const ADD_DEDUCT = 'ADD_DEDUCT';

/**
 * ACTION CREATORS
 */
const setDeducts = (deducts) => ({ type: SET_DEDUCTS, deducts });
const delDeduct = (id) => ({ type: DEL_DEDUCT, id });
const updateDeduct = (deduct) => ({ type: UPDATE_DEDUCT, deduct });
const addDeduct = (deduct) => ({ type: ADD_DEDUCT, deduct });

/**
 * THUNK CREATORS
 */
export const fetchDeducts = (year, month) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(
      `/api/yearly-deductions/${year}/${month}`,
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch(setDeducts(data));
  };
};

export const deleteDeduct = (de) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    await axios.delete(`/api/yearly-deductions/${de.id}`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(delDeduct(de.id));
  };
};

export const patchDeduct = (de) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.put(`/api/yearly-deductions/${de.id}`, de, {
      headers: { authorization: token },
    });
    dispatch(updateDeduct(data));
  };
};

export const postDeduct = (de) => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.post('/api/yearly-deductions', de, {
      headers: { authorization: token },
    });
    dispatch(addDeduct(data));
  };
};

/**
 * REDUCER
 */
export default function yearlyDeductions(state = [], action) {
  switch (action.type) {
    case SET_DEDUCTS:
      return action.deducts;
    case DEL_DEDUCT:
      return state.filter((de) => de.id !== action.id);
    case UPDATE_DEDUCT:
      return state.map((de) => {
        if (de.id === action.deduct.id) {
          return action.deduct;
        } else {
          return de;
        }
      });
    case ADD_DEDUCT:
      return [...state, action.deduct];
    default:
      return state;
  }
}
