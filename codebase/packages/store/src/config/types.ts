import { Styles } from '@pma/dex-wrapper';

//TODO: split this file to enum interface and type

export enum Status {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

export enum ExpressionType {
  AUTH = 'auth',
  ROLE = 'role',
  WORK_LEVEL = 'work_level',
  REQUEST = 'request',
  LISTENER = 'listener',
  BLOCK = 'block',
  TAG = 'tag',
}

export enum ExpressionValueType {
  OBJECTIVE = 'OBJECTIVE',
  OPEN = 'open',
  CLOSE = 'close',
  OVERALL_RATING = 'overall_rating',
}

export enum FormType {
  HTML_ELEMENT = 'htmlelement',
  DATETIME = 'datetime',
  TEXT_AREA = 'textarea',
  TEXT_FIELD = 'textfield',
  SELECT = 'select',
  TEXT = 'text',
  RADIO = 'radio',
}

export enum FEEDBACK_STATUS_IN {
  DRAFT = 1,
  SUBMITTED,
  PENDING,
  COMPLETED,
}

export enum WorkLevel {
  WL4 = 'WL4',
  WL5 = 'WL5',
}

export interface Component {
  id: string;
  key?: string;
  text?: string;
  label?: string;
  description?: string;
  type?: FormType | string;
  validate?: any;
  values?: { label?: string; value?: string }[];
  expression?: any;
}

export interface BorderedComponent extends Component {
  borderStyle?: Styles;
  level?: number;
}

// to rename after use new scheme
export interface ComponentV2 {
  id: string;
  key?: string;
  content?: string;
  label?: string;
  description?: string;
  type?: string;
  placeholder?: string;
  validate?: any;
  properties?: any;
  conditional?: any;
  data: { values?: { label?: string; value?: string }[] };
}

export enum Folders {
  PERSONAL_FOLDER = 'PERSONAL_FOLDER',
  ARCHIVED_FOLDER = 'ARCHIVED_FOLDER',
  TEAM_ARCHIVED_FOLDER = 'TEAM_ARCHIVED_FOLDER',
  TEAM_FOLDER = 'TEAM_FOLDER',
}
export enum NoteStatus {
  CREATED = 'CREATED',
  ARCHIVED = 'ARCHIVED',
}

export interface ActionParams {
  pathParams?: any;
}

export interface ActionGetParams {
  searchParams?: any;
}

export interface ActionPostData {
  data?: any[];
}

export interface ReviewActionParams extends ActionPostData, ActionGetParams {
  pathParams: { colleagueUuid?: string; code?: string; cycleUuid: string; number?: number; status?: string };
}

export enum ReviewType {
  QUARTER = 'QUARTER',
  OBJECTIVE = 'OBJECTIVE',
  MYR = 'MYR',
  EYR = 'EYR',
}

export enum Statuses {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  WAITING_FOR_APPROVAL = 'WAITING_FOR_APPROVAL',
  APPROVED = 'APPROVED',
  OVERDUE = 'OVERDUE',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  AVAILABLE = 'AVAILABLE',
  RETURNED = 'RETURNED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED',
  STARTED = 'STARTED',
  NOT_STARTED = 'NOT_STARTED',
  NOT_CREATED = 'NOT_CREATED',
  WAITING_FOR_COMPLETION = 'WAITING_FOR_COMPLETION',
  REQUESTED_TO_AMEND = 'REQUESTED_TO_AMEND',
}

export type Review = {
  changeStatusReason: string;
  lastUpdatedTime: string;
  colleagueUuid: string;
  number: number;
  performanceCycleUuid: string;
  properties: Record<string, string>;
  status: Status;
  type: ReviewType;
  uuid: string;
  tlPointUuid: string;
};
