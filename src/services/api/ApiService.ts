import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { IBody } from './interfaces/body.interface';
import CRUD, {
  CreateType,
  DeleteType,
  PostType,
  PutType,
} from './interfaces/crud.interface';
import {
  ErrorsType,
  FormattedError,
  IErrorResponse,
} from './interfaces/error.interface';
import { IHeader } from './interfaces/header.interface';
import { IParam } from './interfaces/param.interface';
import { ISuccessResponse } from './interfaces/success.interface';

export abstract class ApiService {
  private readonly apiUrl?: string;
  private readonly httpClient: AxiosInstance;
  protected readonly crud: CRUD;

  private readonly ERRORS_TYPE: ErrorsType = {
    ERROR: {
      type: 'error',
      title: 'Error_Title',
    },
    WARNING: {
      type: 'warning',
      title: 'Warning_Title',
    },
  };

  constructor(entity: string, accessToken?: string, url?: string) {
    this.apiUrl = url || import.meta.env['API_BASE_URL'];
    this.httpClient = axios.create({
      baseURL: this.apiUrl,
      timeout: 1000,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (accessToken) {
      this.addHeaders([
        { key: 'Authorization', value: `Bearer ${accessToken}` },
      ]);
    }
    this.crud = this.createEntity(entity);
  }

  addHeaders(headers: IHeader[]): void {
    headers.forEach((header) => {
      this.httpClient.defaults.headers.common[header.key] = header.value;
    });
  }

  /**
   * Create an entity by name
   * @param {string} entity
   */
  protected createEntity(entity: string): CRUD {
    return this.createBasicCRUD(entity);
  }

  /**
   * Create Basic CRUD function for the entity.
   * @param {string} entity
   * @returns Complete CRUD
   */
  private createBasicCRUD(entity: string): CRUD {
    const resourceURL = `${this.apiUrl}/${entity}`;

    return {
      getAll: <T, U>(query: IParam<U> = {}) =>
        this.getRequest(resourceURL, query).then(
          (res: AxiosResponse<T>) => this.formatResponse(res),
          (error: AxiosError<T>) => this.formatError(error),
        ),
      getOne: <T, U>(id: string, query: IParam<U> = {}) =>
        this.getRequest(`${resourceURL}/${id}`, query).then(
          (res: AxiosResponse<T>) => this.formatResponse(res),
          (error: AxiosError<T>) => this.formatError(error),
        ),
      create: <T>(c: CreateType<T>) =>
        this.postRequest(resourceURL, c.toCreate).then(
          (res: AxiosResponse<T>) => this.formatResponse(res),
          (error: AxiosError<T>) => this.formatError(error),
        ),
      update: <T>(p: PutType<T>) => {
        return this.putRequest(resourceURL, p.toUpdate).then(
          (res: AxiosResponse<T>) => this.formatResponse(res),
          (error: AxiosError<T>) => this.formatError(error),
        );
      },
      updatePartial: <T>(p: PutType<T>) => {
        return this.patchRequest(resourceURL, p.toUpdate).then(
          (res: AxiosResponse<T>) => this.formatResponse(res),
          (error: AxiosError<T>) => this.formatError(error),
        );
      },
      delete: <T>(del: DeleteType<T>) => {
        return this.deleteRequest(
          `${resourceURL}/delete/${del.id}`,
          del.body,
        ).then(
          (res: AxiosResponse<T>) => this.formatResponse(res),
          (error: AxiosError<T | undefined>) => this.formatError(error),
        );
      },
      post: <T, U>(post: PostType<T>) =>
        this.postRequest(
          post.complementURL
            ? `${resourceURL}/${post.complementURL}`
            : `${resourceURL}`,
          post.query,
        ).then(
          (res: AxiosResponse<U>) => this.formatResponse(res),
          (error: AxiosError<U | undefined>) => this.formatError(error),
        ),
    };
  }

  /**
   * Use if there is error return by API
   * @param {AxiosError} error error object
   */
  private formatError<T>(error: AxiosError<T>): IErrorResponse<T | undefined> {
    const err = { error };
    const response = err.error.response;
    let status = 0;
    let data;
    let returnedError: FormattedError = {
      title: this.ERRORS_TYPE.ERROR.title,
      type: this.ERRORS_TYPE.ERROR.type,
      errorDefault: 'General_Label',
    };
    if (response) {
      status = response.status;
      data = response.data;

      switch (status) {
        case 400: {
          returnedError = {
            ...returnedError,
            errorDefault: 'Badrequest_Label',
          };
          break;
        }
        case 401: {
          returnedError = {
            ...returnedError,
            errorDefault: 'Unauthorized_Label',
          };
          break;
        }
        case 403: {
          returnedError = {
            ...returnedError,
            title: this.ERRORS_TYPE.WARNING.title,
            errorDefault: 'Forbidden_Label',
            type: this.ERRORS_TYPE.WARNING.type,
          };
          break;
        }
        case 404: {
          returnedError = {
            ...returnedError,
            title: this.ERRORS_TYPE.WARNING.title,
            errorDefault: 'Notfound_Label',
            type: this.ERRORS_TYPE.WARNING.type,
          };
          break;
        }
        default:
          returnedError = {
            ...returnedError,
            errorDefault: 'General_Label',
          };
      }
    } else {
      returnedError = {
        ...returnedError,
        errorDefault: 'General_Label',
      };
    }
    return { ok: false, status, data, formatted: returnedError };
  }

  /**
   * Use if there is no error returned by API
   * @param {AxiosResponse} response response object
   */
  private formatResponse<T, U = any>(
    response: AxiosResponse<T, U>,
  ): ISuccessResponse<T> {
    return {
      ok: true,
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  }

  /**
   * For get requests
   * @param {string} url
   * @param {IParam<T>} params it's an object contain params needed by the backend generate query strings. Example : { params: { sorting: "asc" } } generate http://domain/entity?sorting=asc
   * @returns
   */
  private getRequest = <T = any>(
    url: string,
    params: IParam<T> = {},
    config: AxiosRequestConfig = {},
  ) => {
    return this.httpClient.get(url, {
      params: params.params,
      ...config,
    });
  };

  /**
   * For post requests
   * @param {string} url
   * @param {IBody<T>} body
   * @returns
   */
  private postRequest = <T = any>(
    url: string,
    body: IBody<T> = {},
    config: AxiosRequestConfig = {},
  ) => {
    return this.httpClient.post(url, body.body, config);
  };

  /**
   * For put requests
   * @param {string} url
   * @param {IBody<T>} body
   * @returns
   */
  private putRequest = <T = any>(
    url: string,
    body: IBody<T>,
    config: AxiosRequestConfig = {},
  ) => {
    return this.httpClient.put(url, body.body, config);
  };

  /**
   * For patch requests
   * @param {string} url
   * @param {IBody<T>} body
   * @returns
   */
  private patchRequest = <T = any>(
    url: string,
    body: IBody<T>,
    config: AxiosRequestConfig = {},
  ) => {
    return this.httpClient.patch(url, body.body, config);
  };

  /**
   * For delete requests
   * @param {string} url
   * @param {IBody<T>} body
   * @returns
   */
  private deleteRequest = <T = any>(
    url: string,
    body: IBody<T> = {},
    config: AxiosRequestConfig = {},
  ) => {
    return this.httpClient.delete(url, {
      data: body.body,
      ...config,
    });
  };
}
