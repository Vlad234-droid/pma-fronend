import { Condition, ConditionOperandEnum, ColleagueFilterOptions, CalibrationColleague } from '@pma/openapi';
import { Operand } from 'config/enum';
import { CalibrationSessionUiType } from '../types';

export const filterMap = {
  'department-uuid': 'departments',
  'legal-entity-uuid': 'legal-entities',
  'line-manager-uuid': 'line-managers',
  'function-uuid': 'functions',
  'business-group-uuid': 'business-groups',
  'country-code': 'countries',
  'work-level': 'work-levels',
};

export const filterMapRevers = Object.fromEntries(Object.entries(filterMap).map((a) => a.reverse()));

export const filterToRequest = (filter) =>
  Object.entries(filter).reduce((acc, [key, val]) => {
    if (!filterMapRevers[key]) {
      throw new Error('Filter key not exist');
    }

    if (typeof val === 'object') {
      const keys = Object.entries(val || {})
        .filter(([, value]) => !!value)
        .map(([key]) => key);
      if (keys.length) {
        return { ...acc, [`${filterMapRevers[key]}${Operand.IN}`]: keys };
      }
      return acc;
    } else {
      return { ...acc, [`${filterMapRevers[key]}${Operand.IN}`]: val };
    }
  }, {});

export const filterFromSessionResponse = (filter: Condition[]) =>
  filter.reduce((acc, val) => {
    if (Array.isArray(val.value) && val.property) {
      acc[filterMap[val.property] || val.property] = val.value.reduce((acc, val) => {
        acc[val] = true;
        return acc;
      }, {});
    } else if (typeof val.value === 'string' && val.property) {
      acc[filterMap[val.property] || val.property] = val?.value ? { [val.value]: true } : {};
    }
    return acc;
  }, {});

export const prepareFormData = (data: CalibrationSessionUiType) => {
  const { colleaguesAdd = [], colleaguesRemoved = [], filter = {}, ...rest } = data;
  const filterToData = filterToRequest(filter);

  const participants = {
    ...(colleaguesAdd.length
      ? {
          'colleague-uuid_in': colleaguesAdd
            .filter((colleague) => !!colleague?.['value'])
            .map((colleague) => colleague?.['value']),
        }
      : {}),
    ...(colleaguesRemoved.length
      ? {
          'colleague-uuid_nin': colleaguesRemoved
            .filter((colleague) => !!colleague?.['value'])
            .map((colleague) => colleague?.['value']),
        }
      : {}),
    ...filterToData,
  };

  return {
    ...rest,
    ...(rest.startTime ? { startTime: new Date(rest.startTime).toISOString() } : {}),
    participants,
  };
};

export const prepareColleaguesForUI = (
  calibrationColleague: CalibrationColleague[],
  filters: Condition[],
  operand: ConditionOperandEnum.In | ConditionOperandEnum.NotIn,
) => {
  const colleaguesAddIds =
    (filters.find((f) => f?.property && ['colleague-uuid'].includes(f?.property) && f.operand === operand)
      ?.value as string[]) || [];

  return calibrationColleague
    .filter((c) => c.colleague && c.colleague.uuid && colleaguesAddIds.includes(c.colleague.uuid))
    .map(({ colleague }) => ({ value: colleague?.uuid, label: `${colleague?.firstName} ${colleague?.lastName}` }));
};

export const getSelectedGroups = (colleagueFilter: ColleagueFilterOptions, filter): string[] => {
  const acc: string[] = [];
  for (const [key, value] of Object.entries(colleagueFilter)) {
    const valueIds = value?.map((v) => (v.uuid ? v.uuid : v.code));
    const filterKeys = filter?.[key];
    if (key && Object.keys(filterKeys || {}).some((fk) => valueIds.includes(fk) && filterKeys[fk] === true)) {
      acc.push(key);
    }
  }
  return acc;
};