// @ts-ignore
import { Epic, isActionOf } from 'typesafe-actions';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import {
  createReview,
  deleteReview,
  getColleagueReviews,
  getReviews,
  updateReview,
  updateReviews,
  updateReviewStatus,
} from './actions';
import { getTimeline } from '../timeline/actions';
import { getManagers } from '../managers/actions';

export const getReviewsEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(getReviews.request)),
    switchMap(({ payload }) =>
      // @ts-ignore
      from(api.getReviews(payload)).pipe(
        map(({ success, data, errors }: any) => {
          if (!success) {
            return getReviews.failure(new Error(errors[0].message));
          }
          return getReviews.success({ data });
        }),
        catchError(({ errors }) => of(getReviews.failure(errors))),
        takeUntil(action$.pipe(filter(isActionOf(getReviews.cancel)))),
      ),
    ),
  );

export const getColleagueReviewsEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(getColleagueReviews.request)),
    switchMap(({ payload }) =>
      // @ts-ignore
      from(api.getReviews(payload)).pipe(
        mergeMap(({ data }: any) =>
          from([
            getColleagueReviews.success({ colleagueReviews: { [payload.pathParams.colleagueUuid]: data }, data }),
            getReviews.success({ data }),
          ]),
        ),
        catchError(({ errors }) => of(getColleagueReviews.failure(errors))),
        takeUntil(action$.pipe(filter(isActionOf(getColleagueReviews.cancel)))),
      ),
    ),
  );

export const updateReviewEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(updateReview.request)),
    switchMap(({ payload }) => {
      // @ts-ignore
      return from(api.updateReview(payload)).pipe(
        mergeMap(() =>
          from([
            updateReview.success({ ...payload }),
            getReviews.request({ ...payload }),
            getTimeline.request(payload.pathParams),
          ]),
        ),
        catchError(({ errors }) => of(updateReview.failure(errors))),
        takeUntil(action$.pipe(filter(isActionOf(updateReview.cancel)))),
      );
    }),
  );

export const createReviewEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(createReview.request)),
    switchMap(({ payload }) => {
      // @ts-ignore
      return from(api.createReview(payload)).pipe(
        mergeMap(({ data }: any) =>
          from([
            updateReview.success({ ...payload }),
            getReviews.request({
              ...payload,
              data,
            }),
            getTimeline.request(payload.pathParams),
          ]),
        ),
        catchError(({ errors }) => of(createReview.failure(errors))),
      );
    }),
  );

export const updateReviewsEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(updateReviews.request)),
    switchMap(({ payload }: any) =>
      // @ts-ignore
      from(api.updateReviews(payload)).pipe(
        mergeMap(({ data }: any) => {
          return from([
            updateReviews.success({ data }),
            getReviews.success({ data }),
            getTimeline.request(payload.pathParams),
          ]);
        }),
        catchError(({ errors }) => of(updateReviews.failure(errors))),
        takeUntil(action$.pipe(filter(isActionOf(updateReviews.cancel)))),
      ),
    ),
  );

export const deleteReviewEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(deleteReview.request)),
    switchMap(({ payload }) => {
      // @ts-ignore
      return from(api.deleteReview(payload)).pipe(
        mergeMap(({ data }: any) =>
          from([
            deleteReview.success({ ...payload }),
            getReviews.request({
              ...payload,
              data,
            }),
            getTimeline.request(payload.pathParams),
          ]),
        ),
        catchError(({ errors }) => of(deleteReview.failure(errors))),
        takeUntil(action$.pipe(filter(isActionOf(deleteReview.cancel)))),
      );
    }),
  );

export const updateReviewStatusEpic: Epic = (action$, _, { api }) => {
  return action$.pipe(
    filter(isActionOf(updateReviewStatus.request)),
    switchMap(({ payload }: any) => {
      // @ts-ignore
      return from(api.updateReviewStatus(payload)).pipe(
        mergeMap(() =>
            from([
              getManagers.request({ colleagueUuid: payload.pathParams.approverUuid }),
              updateReviewStatus.success({ ...payload }),
            ])),
        catchError((e) => {
          const data = e?.data;
          return of(updateReviewStatus.failure(data?.errors?.[0] || data?.error));
        }),
        takeUntil(action$.pipe(filter(isActionOf(updateReviewStatus.cancel)))),
      );
    }),
  );
};

export default combineEpics(
  getReviewsEpic,
  getColleagueReviewsEpic,
  updateReviewEpic,
  createReviewEpic,
  updateReviewsEpic,
  deleteReviewEpic,
  updateReviewStatusEpic,
);
