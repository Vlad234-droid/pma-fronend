import { ComponentType, FC, LazyExoticComponent } from 'react';

enum Page {
  CONTRIBUTION = 'contribution', //
  CREATE_STRATEGIC_DRIVERS = 'strategic-drivers/create', //
  STRATEGIC_DRIVERS = 'strategic-drivers',
  CREATE_PERFORMANCE_CYCLE = 'performance-cycle/:performanceCycleUuid',
  PERFORMANCE_CYCLE = 'performance-cycle',
  PERSONAL_DEVELOPMENT_PLAN = 'personal-development-plan',
  CREATE_PERSONAL_DEVELOPMENT_PLAN = 'personal-development-plan/create',
  UPDATE_PERSONAL_DEVELOPMENT_PLAN = 'personal-development-plan/update/:uuid',
  PERSONAL_DEVELOPMENT_HELP = 'personal-development-plan/help',
  OBJECTIVES_VIEW = 'objectives',
  USER_OBJECTIVES = 'user-objective/:uuid',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  MY_TEAM = 'my-team',
  KNOWLEDGE_LIBRARY = 'knowledge-library',
  KNOWLEDGE_LIBRARY_BY_ID = ':countryCode/knowledge-library/:id',
  MY_ACTIONS = 'my-team/actions',
  PEOPLE_TEAM = 'people-team',
  CALIBRATION = 'calibration',
  NOTES = 'notes',
  GIVE_FEEDBACK = 'feedback/give',
  GIVE_NEW_FEEDBACK = 'feedback/give/:uuid', //
  REQUEST_FEEDBACK = 'feedback/request-feedback',
  RESPOND_FEEDBACK = 'feedback/respond-feedback',
  RESPOND_NEW_FEEDBACK = 'feedback/respond-feedback/:uuid',
  VIEW_FEEDBACK = 'feedback/view-feedback',
  FEEDBACK = 'feedback', //
  TIPS = 'tips',
  EDIT_TIP = 'tips/:tipUuid',
  REPORT = 'report',
  ADMINISTRATION = 'administration', //
  OBJECTIVES_SUBMITTED_REPORT = 'report/submitted-objectives',
  OBJECTIVES_APPROVED_REPORT = 'report/approved-objectives',
}

type PageElement =
  // eslint-disable-next-line
  LazyExoticComponent<FC<any>> | ComponentType | FC<any>;

export { Page };

export type { PageElement };
