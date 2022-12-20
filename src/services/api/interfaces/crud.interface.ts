import type { IBody, ISuccessResponse, IErrorResponse, IParam } from '.';

export interface DeleteType {
  id?: string;
}

export interface PutType<T> {
  id?: string;
  toUpdate?: IBody<T>;
}

export interface CreateType<T> {
  toCreate?: IBody<T>;
}

export type GetType<T> = {
  query?: IParam<T>;
  complementURL?: string;
};

export type PostType<T> = {
  query?: IBody<T>;
  complementURL?: string;
};

export interface CRUD {
  getAll<T, U>(
    query?: IParam<U>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  getOne<T, U>(
    id: string,
    query?: IParam<U>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  create<T, U>(
    c: CreateType<T>,
  ): Promise<ISuccessResponse<U> | IErrorResponse<U | undefined>>;
  update<T, U>(
    p: PutType<T>,
  ): Promise<ISuccessResponse<U> | IErrorResponse<U | undefined>>;
  updatePartial<T, U>(
    tp: PutType<T>,
  ): Promise<ISuccessResponse<U> | IErrorResponse<U | undefined>>;
  delete(
    del: DeleteType,
  ): Promise<ISuccessResponse<void> | IErrorResponse<void | undefined>>;
  post<T, U>(
    p: PostType<T>,
  ): Promise<ISuccessResponse<U> | IErrorResponse<U | undefined>>;
  get<T>(
    g: GetType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  deactivate<T>(
    del: DeleteType,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  reactivate<T>(
    tp: PutType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
}
