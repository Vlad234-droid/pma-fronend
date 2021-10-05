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

import * as runtime from '../runtime';
import {
  RestResponse,
  RestResponseFromJSON,
  RestResponseToJSON,
  RestResponseListString,
  RestResponseListStringFromJSON,
  RestResponseListStringToJSON,
  RestResponseString,
  RestResponseStringFromJSON,
  RestResponseStringToJSON,
} from '../models';

export interface DeployProcessRequest {
  body: string;
}

export interface UndeployProcessRequest {
  processName: string;
}

/**
 *
 */
export class DeploymentEndpointApi extends runtime.BaseAPI {
  /**
   */
  async deployProcessRaw(
    requestParameters: DeployProcessRequest,
    initOverrides?: RequestInit,
  ): Promise<runtime.ApiResponse<RestResponseString>> {
    if (requestParameters.body === null || requestParameters.body === undefined) {
      throw new runtime.RequiredError(
        'body',
        'Required parameter requestParameters.body was null or undefined when calling deployProcess.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters['Content-Type'] = 'text/plain';

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization-App'] = this.configuration.apiKey('Authorization-App'); // additional-auth-jwt authentication
    }

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token('bearer-jwt-identity', []);

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/processes`,
        method: 'POST',
        headers: headerParameters,
        query: queryParameters,
        body: requestParameters.body as any,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => RestResponseStringFromJSON(jsonValue));
  }

  /**
   */
  async deployProcess(
    requestParameters: DeployProcessRequest,
    initOverrides?: RequestInit,
  ): Promise<RestResponseString> {
    const response = await this.deployProcessRaw(requestParameters, initOverrides);
    return await response.value();
  }

  /**
   */
  async processesRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<RestResponseListString>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization-App'] = this.configuration.apiKey('Authorization-App'); // additional-auth-jwt authentication
    }

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token('bearer-jwt-identity', []);

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/processes`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => RestResponseListStringFromJSON(jsonValue));
  }

  /**
   */
  async processes(initOverrides?: RequestInit): Promise<RestResponseListString> {
    const response = await this.processesRaw(initOverrides);
    return await response.value();
  }

  /**
   */
  async undeployProcessRaw(
    requestParameters: UndeployProcessRequest,
    initOverrides?: RequestInit,
  ): Promise<runtime.ApiResponse<RestResponseString>> {
    if (requestParameters.processName === null || requestParameters.processName === undefined) {
      throw new runtime.RequiredError(
        'processName',
        'Required parameter requestParameters.processName was null or undefined when calling undeployProcess.',
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.apiKey) {
      headerParameters['Authorization-App'] = this.configuration.apiKey('Authorization-App'); // additional-auth-jwt authentication
    }

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token('bearer-jwt-identity', []);

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/processes/{processName}`.replace(
          `{${'processName'}}`,
          encodeURIComponent(String(requestParameters.processName)),
        ),
        method: 'DELETE',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) => RestResponseStringFromJSON(jsonValue));
  }

  /**
   */
  async undeployProcess(
    requestParameters: UndeployProcessRequest,
    initOverrides?: RequestInit,
  ): Promise<RestResponseString> {
    const response = await this.undeployProcessRaw(requestParameters, initOverrides);
    return await response.value();
  }
}
