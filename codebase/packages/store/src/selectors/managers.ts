//@ts-ignore
import { createSelector } from 'reselect'; //@ts-ignore
import { RootState } from 'typesafe-actions';
import { Status } from '@pma/client/src/config/enum';
import { SortBy, searchEmployeesFn, sortEmployeesFn } from '@pma/client/src/features/Filters';
import { ReviewForApproval } from '@pma/client/src/config/types';

export const managersSelector = (state: RootState) => state.managers || {};

// @ts-ignore
export const getAllEmployees = createSelector(
  managersSelector,
  (_, searchValue?: string, sortValue?: SortBy) => ({ search: searchValue, sort: sortValue }),
  ({ data }, { search, sort }) => {
    return data ? sortEmployeesFn(searchEmployeesFn(data, search), sort) : [];
  },
);

// @ts-ignore
export const getPendingEmployees = createSelector(
  managersSelector,
  (_, searchValue?: string, sortValue?: SortBy) => ({ search: searchValue, sort: sortValue }),
  ({ data }, { search, sort }) => {
    const filteredData = data ? sortEmployeesFn(searchEmployeesFn(data, search), sort) : [];

    const employeeWithPendingApprovals = filteredData?.filter((employee: ReviewForApproval) =>
      employee.timeline.some((review) => review.status === Status.WAITING_FOR_APPROVAL),
    );

    const employeePendingApprovals = filteredData?.filter((employee: ReviewForApproval) =>
      employee.timeline.some((review) => review.status === Status.DRAFT || review.status === Status.DECLINED),
    );

    const employeeWithCompletedApprovals = filteredData?.filter((employee: ReviewForApproval) =>
      employee.timeline.some((review) => review.status === Status.APPROVED),
    );

    return {
      employeeWithPendingApprovals,
      employeePendingApprovals,
      employeeWithCompletedApprovals,
    };
  },
);

export const getManagersMetaSelector = createSelector(managersSelector, ({ meta }) => meta);
