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
 * @interface AddressList
 */
export interface AddressList {
  /**
   *
   * @type {Array<string>}
   * @memberof AddressList
   */
  lines?: Array<string>;
  /**
   *
   * @type {string}
   * @memberof AddressList
   */
  countryCode?: string;
  /**
   *
   * @type {string}
   * @memberof AddressList
   */
  postcode?: string;
  /**
   *
   * @type {string}
   * @memberof AddressList
   */
  city?: string;
}

export function AddressListFromJSON(json: any): AddressList {
  return AddressListFromJSONTyped(json, false);
}

export function AddressListFromJSONTyped(json: any, ignoreDiscriminator: boolean): AddressList {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    lines: !exists(json, 'lines') ? undefined : json['lines'],
    countryCode: !exists(json, 'countryCode') ? undefined : json['countryCode'],
    postcode: !exists(json, 'postcode') ? undefined : json['postcode'],
    city: !exists(json, 'city') ? undefined : json['city'],
  };
}

export function AddressListToJSON(value?: AddressList | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    lines: value.lines,
    countryCode: value.countryCode,
    postcode: value.postcode,
    city: value.city,
  };
}
