import { createReducer } from 'typesafe-actions';
import { getObjectivesReport } from './actions';

export const initialState = {
  objectivesReport: [],
  meta: { loading: false, loaded: false, error: null },
};

export default createReducer(initialState)
  .handleAction(getObjectivesReport.request, (state) => ({
    ...state,
    meta: { ...state.meta, loading: true },
  }))
  .handleAction(getObjectivesReport.success, (state) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true },
  }))
  .handleAction(getObjectivesReport.failure, (state, { payload }) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true, error: payload },
  }));