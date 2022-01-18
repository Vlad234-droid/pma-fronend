import { createReducer } from 'typesafe-actions';
import {
  createPDPGoal,
  updatePDPGoal,
  getPDPGoal,
  getPDPByUUIDGoal,
  clearPDPData,
  deletePDPGoal,
} from './actions';

export const initialState = {
  meta: { loading: false, loaded: false, error: null, status: null },
  pdp: [],
};

export default createReducer(initialState)
  .handleAction(createPDPGoal.request, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: true, error: null, loaded: false },
  }))
  .handleAction(createPDPGoal.success, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: true },
  }))

  .handleAction(deletePDPGoal.request, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: true, error: null, loaded: false },
  }))
  .handleAction(deletePDPGoal.success, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: true },
  }))

  .handleAction(updatePDPGoal.request, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: true, error: null, loaded: false },
  }))
  .handleAction(updatePDPGoal.success, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: true },
  }))

  .handleAction(getPDPByUUIDGoal.request, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: true, error: null, loaded: false },
  }))
  .handleAction(getPDPByUUIDGoal.success, (state, { payload }) => ({
      ...state,
      ...payload,
      meta: { ...state.meta, loading: false, loaded: true },
    }))
  .handleAction(getPDPByUUIDGoal.cancel, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: false },
  }))
  .handleAction(getPDPByUUIDGoal.failure, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: false },
  }))

  .handleAction(getPDPGoal.request, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: true, error: null, loaded: false },
  }))
  .handleAction(getPDPGoal.success, (state, { payload }) => ({
      ...state,
      ...payload,
      meta: { ...state.meta, loading: false, loaded: true },
    }))
  .handleAction(getPDPGoal.cancel, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: false },
  }))
  .handleAction(getPDPGoal.failure, (state, { payload }) => ({
    ...state,
    ...payload,
    meta: { ...state.meta, loading: false, loaded: false },
  }))
  .handleAction(clearPDPData, () => initialState);