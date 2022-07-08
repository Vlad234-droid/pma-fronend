import { createReducer } from 'typesafe-actions';
import {
  getObjectivesReport,
  getObjectivesStatistics,
  getTargetingColleagues,
  clearStatistics,
  getLimitedObjectivesReport,
  getTargetingFeedbacks,
} from './actions';

export const initialState = {
  objectiveReports: [],
  limitedObjectiveReports: [],
  objectiveStatistics: [],
  colleagues: [],
  meta: { loading: false, loaded: false, error: null },
};

export default createReducer(initialState)
  .handleAction(getObjectivesReport.request, (state) => ({
    ...state,
    meta: { ...state.meta, loading: true },
  }))
  .handleAction(getObjectivesReport.success, (state, { payload }) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true },
    objectiveReports: payload,
  }))
  .handleAction(getObjectivesReport.failure, (state, { payload }) => ({
    ...state,
    objectiveReports: [],
    meta: { ...state.meta, loading: false, loaded: true, error: payload },
  }))

  .handleAction(getObjectivesStatistics.request, (state) => ({
    ...state,
    meta: { ...state.meta, loading: true },
  }))
  .handleAction(getObjectivesStatistics.success, (state, { payload }) => ({
    ...state,
    objectiveStatistics: payload,
    meta: { ...state.meta, loading: false, loaded: true },
  }))
  .handleAction(getObjectivesStatistics.failure, (state, { payload }) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true, error: payload },
  }))

  .handleAction(getLimitedObjectivesReport.request, (state) => ({
    ...state,
    meta: { ...state.meta, loading: true },
  }))
  .handleAction(getLimitedObjectivesReport.success, (state, { payload }) => ({
    ...state,
    limitedObjectiveReports: [...state.limitedObjectiveReports, ...payload],
    meta: { ...state.meta, loading: false, loaded: true },
  }))
  .handleAction(getLimitedObjectivesReport.failure, (state, { payload }) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true, error: payload },
  }))

  .handleAction(getTargetingColleagues.request, (state) => ({
    ...state,
    meta: { ...state.meta, loading: true },
  }))
  .handleAction(getTargetingColleagues.success, (state, { payload }) => ({
    ...state,
    colleagues: payload,
    meta: { ...state.meta, loading: false, loaded: true },
  }))
  .handleAction(getTargetingColleagues.failure, (state, { payload }) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true, error: payload },
  }))

  .handleAction(getTargetingFeedbacks.request, (state) => ({
    ...state,
    meta: { ...state.meta, loading: true },
  }))
  .handleAction(getTargetingFeedbacks.success, (state, { payload }) => ({
    ...state,
    colleagues: payload,
    meta: { ...state.meta, loading: false, loaded: true },
  }))
  .handleAction(getTargetingFeedbacks.failure, (state, { payload }) => ({
    ...state,
    meta: { ...state.meta, loading: false, loaded: true, error: payload },
  }))
  .handleAction(clearStatistics, () => initialState);
