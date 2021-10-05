/* tslint:disable */
/* eslint-disable */
/**
 * PMA API
 * Documentation PMA API v1.0
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 *
 * @export
 * @interface Health
 */
export interface Health {
  /**
   *
   * @type {string}
   * @memberof Health
   */
  name?: string;
  /**
   *
   * @type {string}
   * @memberof Health
   */
  type?: HealthTypeEnum;
  /**
   *
   * @type {string}
   * @memberof Health
   */
  description?: string;
  /**
   *
   * @type {string}
   * @memberof Health
   */
  status?: HealthStatusEnum;
  /**
   *
   * @type {string}
   * @memberof Health
   */
  version?: string;
  /**
   *
   * @type {Date}
   * @memberof Health
   */
  checked?: Date;
  /**
   *
   * @type {{ [key: string]: object; }}
   * @memberof Health
   */
  error?: { [key: string]: object };
}

/**
 * @export
 * @enum {string}
 */
export enum HealthTypeEnum {
  Service = 'SERVICE',
  Component = 'COMPONENT',
  Dependency = 'DEPENDENCY',
}
/**
 * @export
 * @enum {string}
 */
export enum HealthStatusEnum {
  Ok = 'Ok',
  Fail = 'Fail',
  Degraded = 'Degraded',
}

export function HealthFromJSON(json: any): Health {
  return HealthFromJSONTyped(json, false);
}

export function HealthFromJSONTyped(json: any, ignoreDiscriminator: boolean): Health {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    name: !exists(json, 'name') ? undefined : json['name'],
    type: !exists(json, 'type') ? undefined : json['type'],
    description: !exists(json, 'description') ? undefined : json['description'],
    status: !exists(json, 'status') ? undefined : json['status'],
    version: !exists(json, 'version') ? undefined : json['version'],
    checked: !exists(json, 'checked') ? undefined : new Date(json['checked']),
    error: !exists(json, 'error') ? undefined : json['error'],
  };
}

export function HealthToJSON(value?: Health | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    name: value.name,
    type: value.type,
    description: value.description,
    status: value.status,
    version: value.version,
    checked: value.checked === undefined ? undefined : value.checked.toISOString(),
    error: value.error,
  };
}
