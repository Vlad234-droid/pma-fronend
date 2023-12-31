// @ts-ignore
import { Epic, isActionOf } from 'typesafe-actions';
import { combineEpics } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { concatWithErrorToast, errorPayloadConverter } from '../../utils/toastHelper';

import { getHelpFaqUrls, getHelpFaqs } from './actions';

export const getHelpFaqUrlsEpic: Epic = (action$, _, { openapi }) =>
  action$.pipe(
    filter(isActionOf(getHelpFaqUrls.request)),

    switchMap(() =>
      from(openapi.cms.getHelpFaqUrls()).pipe(
        map(getHelpFaqUrls.success),
        catchError((e) => {
          const errors = e?.data?.errors;
          return concatWithErrorToast(
            of(getHelpFaqUrls.failure(errors?.[0])),
            errorPayloadConverter({ ...errors?.[0], title: 'Help faq urls fetch error' }),
          );
        }),
        takeUntil(action$.pipe(filter(isActionOf(getHelpFaqUrls.cancel)))),
      ),
    ),
  );

export const getHelpFaqsEpic: Epic = (action$, _, { api }) =>
  action$.pipe(
    filter(isActionOf(getHelpFaqs.request)),

    switchMap(({ payload }) =>
      from(api.getHelpFaqs(payload)).pipe(
        map(getHelpFaqs.success),
        catchError((e) => {
          const errors = e?.data?.errors;
          return concatWithErrorToast(
            of(getHelpFaqs.failure(errors?.[0])),
            errorPayloadConverter({ ...errors?.[0], title: 'Help faqs fetch error' }),
          );
        }),
        takeUntil(action$.pipe(filter(isActionOf(getHelpFaqUrls.cancel)))),
      ),
    ),
  );

export default combineEpics(getHelpFaqUrlsEpic, getHelpFaqsEpic);
