import axios from 'axios';

/**
 * ACTION TYPES
 */
const SET_ALL_DEDUCTS = 'SET_ALL_DEDUCTS';
const ADD_DEDUCT = 'ADD_DEDUCT';
const DEL_DEDUCT = 'DEL_DEDUCT';
const UPDATE_DEDUCT = 'UPDATE_DEDUCT';

/**
 * ACTION CREATORS
 */
const setAllDeducts = (deducts) => ({ type: SET_ALL_DEDUCTS, deducts });
const delDeduct = (id) => ({ type: DEL_DEDUCT, id });
const updateDeduct = (deducts) => ({ type: UPDATE_DEDUCT, deducts });
const addDeduct = (deduct) => ({ type: ADD_DEDUCT, deduct });

/**
 * THUNK CREATORS
 */
export const fetchAllDeducts = () => {
  return async (dispatch) => {
    const token = window.localStorage.getItem('token');
    const { data } = await axios.get(`/api/all-deducts`, {
      headers: {
        authorization: token,
      },
    });
    dispatch(setAllDeducts(data));
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
export default function allDeducts(state = [], action) {
  switch (action.type) {
    case SET_ALL_DEDUCTS:
      return action.deducts;
    case ADD_DEDUCT:
      return [...state, action.deduct];
    case UPDATE_DEDUCT:
      const [oldDe, newDe] = action.deducts;
      const newState = state.map((de) => {
        if (de.id === oldDe.id) {
          return oldDe;
        } else {
          return de;
        }
      });
      if (!newDe) {
        return newState;
      } else {
        return [...newState, newDe];
      }
    case DEL_DEDUCT:
      return state.filter((de) => de.id !== action.id);
    default:
      return state;
  }
}
