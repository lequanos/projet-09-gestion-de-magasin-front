import type { IBody, ISuccessResponse, IErrorResponse, IParam } from '.';

export interface DeleteType<T> {
  id?: string;
  body?: IBody<T>;
}

export interface PutType<T> {
  toUpdate: IBody<T>;
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
  create<T>(
    c: CreateType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  update<T>(
    p: PutType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  updatePartial<T>(
    tp: PutType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  delete<T>(
    del: DeleteType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
  post<T, U>(
    p: PostType<T>,
  ): Promise<ISuccessResponse<U> | IErrorResponse<U | undefined>>;
  get<T>(
    g: GetType<T>,
  ): Promise<ISuccessResponse<T> | IErrorResponse<T | undefined>>;
}
