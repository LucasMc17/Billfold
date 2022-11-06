import axios from 'axios';

// ACTION TYPES
const SET_INSIGHTS = 'SET_INSIGHTS';
const REMOVE_INSIGHT = 'REMOVE_INSIGHT';

// ACTION CREATORS
export const setInsights = (insights) => ({ type: SET_INSIGHTS, insights });
export const removeInsight = (id) => ({ type: REMOVE_INSIGHT, id });

// REDUCER
export default function insights(
  state = { recommendations: [], alert: undefined, statistics: [] },
  action
) {
  switch (action.type) {
    case SET_INSIGHTS:
      return action.insights;
    case REMOVE_INSIGHT:
      return {
        ...state,
        recommendations: state.recommendations.filter(
          (ins) => ins.id !== action.id
        ),
      };
    default:
      return state;
  }
}
