// @ts-ignore
import { Epic, isActionOf } from 'typesafe-actions';
import { combineEpics } from 'redux-observable';
import { forkJoin, from, of } from 'rxjs';
import { catchError, filter, mergeMap, switchMap, takeUntil } from 'rxjs/operators';

import { ReviewType, Status } from '@pma/client/src/config/enum';

import { getSchema } from './actions';
import { cleanFormsDsl, checkFormsPermission, updateForms } from '../../utils/formDsl';
import { colleagueUUIDSelector } from '../../selectors';

export const getSchemaEpic: Epic = (action$, state$, { api }) =>
  action$.pipe(
    filter(isActionOf(getSchema.request)),
    switchMap(({ payload }) =>
      from(api.getSchema({ ...payload, includeForms: payload?.includeForms ? payload?.includeForms : true })).pipe(
        // @ts-ignore
        mergeMap(({ success, data: schemaData }) => {
          const state: any = state$.value;
          const currentColleagueUUID: string = colleagueUUIDSelector(state);
          const requestColleagueUUID: string = payload?.colleagueUuid;
          const users = state?.users;

          const schema = of(getSchema.success(schemaData));
          const reviews = of(state?.reviews);
          const user =
            requestColleagueUUID === currentColleagueUUID
              ? of(users?.current?.info)
              : api.getColleagueByUuid({ colleagueUuid: requestColleagueUUID });

          return forkJoin({ schema, reviews, user }).pipe(
            // @ts-ignore
            mergeMap((data: any) => {
              const user = data?.user?.data;
              const reviews = data?.reviews?.data;
              const schema = data?.schema?.payload;

              const { forms } = schema;
              const userRoles: string[] = user?.roles || [];
              const userWorkLevels: string[] =
                user?.colleague?.workRelationships?.map((workRelationship) => workRelationship.workLevel) || [];

              const formsComponentPermitted: any[] = checkFormsPermission(forms, [...userRoles, ...userWorkLevels]);
              const elementCount =
                reviews?.filter((review) => {
                  return review.status === Status.APPROVED && review.type === ReviewType.OBJECTIVE;
                })?.length || 0;

              const updatedForms: any[] = updateForms(formsComponentPermitted, elementCount);
              return of(getSchema.success({ ...schema, forms: cleanFormsDsl(updatedForms) }));
            }),
          );
        }),
        catchError(({ errors }) => of(getSchema.failure(errors))),
        takeUntil(action$.pipe(filter(isActionOf(getSchema.cancel)))),
      ),
    ),
  );

export default combineEpics(getSchemaEpic);
