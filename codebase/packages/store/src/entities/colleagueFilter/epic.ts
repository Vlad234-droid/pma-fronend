// @ts-ignore
import { Epic, isActionOf } from 'typesafe-actions';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { RestResponseColleagueFilterOptions } from '@pma/openapi';
import { getColleagueFilter } from './actions';
import { concatWithErrorToast, errorPayloadConverter } from '../../utils/toastHelper';

export const getCalibrationFilterEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(getColleagueFilter.request)),
    switchMap(({ payload }) =>
      from(api.getCalibrationFilter(payload)).pipe(
        //@ts-ignore
        map(({ success, data, errors }: RestResponseColleagueFilterOptions) => {
          if (!success) {
            return getColleagueFilter.failure(new Error(errors?.[0].message || undefined));
          }
          return getColleagueFilter.success({ data: data || {} });
        }),
        catchError((e) => {
          const errors = e?.data?.errors;
          return concatWithErrorToast(
            of(getColleagueFilter.failure(errors?.[0])),
            errorPayloadConverter({ ...errors?.[0], title: errors?.[0].message }),
          );
        }),
        takeUntil(action$.pipe(filter(isActionOf(getColleagueFilter.cancel)))),
      ),
    ),
  );

export default combineEpics(getCalibrationFilterEpic);