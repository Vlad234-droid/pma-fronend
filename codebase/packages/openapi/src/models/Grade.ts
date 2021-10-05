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
 * @interface Grade
 */
export interface Grade {
  /**
   *
   * @type {string}
   * @memberof Grade
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof Grade
   */
  code?: string;
}

export function GradeFromJSON(json: any): Grade {
  return GradeFromJSONTyped(json, false);
}

export function GradeFromJSONTyped(json: any, ignoreDiscriminator: boolean): Grade {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    code: !exists(json, 'code') ? undefined : json['code'],
  };
}

export function GradeToJSON(value?: Grade | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    code: value.code,
  };
}
