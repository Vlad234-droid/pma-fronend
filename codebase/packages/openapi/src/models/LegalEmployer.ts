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
 * @interface LegalEmployer
 */
export interface LegalEmployer {
  /**
   *
   * @type {number}
   * @memberof LegalEmployer
   */
  id?: number;
  /**
   *
   * @type {string}
   * @memberof LegalEmployer
   */
  name?: string;
}

export function LegalEmployerFromJSON(json: any): LegalEmployer {
  return LegalEmployerFromJSONTyped(json, false);
}

export function LegalEmployerFromJSONTyped(json: any, ignoreDiscriminator: boolean): LegalEmployer {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    name: !exists(json, 'name') ? undefined : json['name'],
  };
}

export function LegalEmployerToJSON(value?: LegalEmployer | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    id: value.id,
    name: value.name,
  };
}
