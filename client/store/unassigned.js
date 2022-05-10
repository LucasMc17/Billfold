/**
 * ACTION TYPES
 */
const UPDATE_UNASSIGNED = 'UPDATE_UNASSIGNED';

 /**
 * ACTION CREATORS
 */
export const updateUnassigned = (newAmount) => ({ type: UPDATE_UNASSIGNED, newAmount });

/**
 * REDUCER
 */
 export default function unassigned(state = 3333.33, action) {
  switch (action.type) {
    case UPDATE_UNASSIGNED:
      return action.newAmount;
    default:
      return state;
  }
}
