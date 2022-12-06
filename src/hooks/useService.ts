import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { LoginDto, SelectStoreDto } from '@/models/auth';
import { MailDto } from '@/models/mail';
import {
  ISuccessResponse,
  IErrorResponse,
  IParam,
} from '@/services/api/interfaces';
import {
  CreateType,
  DeleteType,
  PutType,
} from '@/services/api/interfaces/crud.interface';
import { AuthService } from '@/services/auth/AuthService';
import { MailService } from '@/services/mail/MailService';
import { StoreService } from '@/services/store/StoreService';
import { GetStoresResponse } from '@/services/store/interfaces/getStoresReponse.interface';
import { DashboardService } from '@/services/dashboard/DashboardService';
import { GetDashboardInfosResponse } from '@/services/dashboard/interfaces/dashboardResponse.interface';
import { ProductService } from '@/services/product/ProductService';

const serviceDictionary = {
  auth: (accessToken?: string) => new AuthService(accessToken),
  mail: () => new MailService(),
  store: (accessToken?: string) => new StoreService(accessToken),
  product: (accessToken?: string) => new ProductService(accessToken),
};

export type EntityList = keyof typeof serviceDictionary;

const getService = (entity: EntityList, accessToken?: string) => {
  return serviceDictionary[entity](accessToken);
};

export const useGetAllQuery = <T>(
  entity: EntityList,
  accessToken?: string,
  query?: IParam<string>,
  enabled = true,
  onSuccess?:
    | ((data: ISuccessResponse<T> | IErrorResponse<T | undefined>) => void)
    | undefined,
  onError?: ((err: unknown) => void) | undefined,
) => {
  const service = getService(entity, accessToken);
  return useQuery<ISuccessResponse<T> | IErrorResponse<T | undefined>, unknown>(
    {
      queryKey: [`${entity}s`],
      queryFn: () => service.crud.getAll<T, string>(query),
      enabled,
      onSuccess,
      onError,
    },
  );
};

export const useGetOneQuery = (entity: EntityList, accessToken?: string) => {
  const service = getService(entity, accessToken);
  return useQuery({
    queryKey: [entity],
    queryFn: () => service.crud.getOne,
  });
};

export const useGetSubscriptionMail = (
  mailDto: MailDto,
  enabled: boolean,
  onSuccess: (
    response: ISuccessResponse<string> | IErrorResponse<string | undefined>,
  ) => void,
) => {
  const service = new MailService();
  return useQuery({
    queryKey: [enabled],
    queryFn: () => service.crud.askSubscription(mailDto),
    enabled,
    onSuccess,
  });
};

export const useCreateMutation = <T>(
  payload: CreateType<T>,
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: () => service.crud.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useUpdateMutation = <T>(
  payload: PutType<T>,
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: () => service.crud.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useUpdatePartialMutation = <T>(
  payload: PutType<T>,
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: () => service.crud.updatePartial(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useDeleteMutation = <T>(
  payload: DeleteType<T>,
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: () => service.crud.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useLoginMutation = (payload: LoginDto) => {
  const service = new AuthService();
  return useMutation({
    mutationFn: () => service.crud.login(payload),
  });
};

export const useSelectStoreMutation = (
  payload: SelectStoreDto,
  accessToken: string,
) => {
  const service = new AuthService(accessToken);
  return useMutation({
    mutationFn: () => service.crud.selectStore(payload),
  });
};

export const useGetMostActive = <T>(
  entity: EntityList,
  accessToken?: string,
  onSuccess?:
    | ((data: ISuccessResponse<T> | IErrorResponse<T | undefined>) => void)
    | undefined,
  onError?: ((err: unknown) => void) | undefined,
  enabled = true,
) => {
  const service = getService(entity, accessToken);
  return useQuery<ISuccessResponse<T> | IErrorResponse<T | undefined>, unknown>(
    {
      queryKey: [`${entity}s`],
      queryFn: () =>
        service.crud.get({
          complementURL: 'most-active',
        }),
      enabled,
      onSuccess,
      onError,
    },
  );
};

export const useSearchStores = (
  searchValue: string,
  enabled: boolean,
  accessToken?: string,
  onSuccess?:
    | ((
        data:
          | ISuccessResponse<GetStoresResponse>
          | IErrorResponse<GetStoresResponse | undefined>,
      ) => void)
    | undefined,
) => {
  const service = new StoreService(accessToken);
  return useQuery({
    queryKey: ['stores'],
    queryFn: () => service.crud.searchStores(searchValue),
    enabled,
    onSuccess,
  });
};

export const useGetStatsQuery = <T>(
  entity: EntityList,
  accessToken: string,
  onSuccess?:
    | ((data: ISuccessResponse<T> | IErrorResponse<T>) => void)
    | undefined,
) => {
  const service = getService(entity, accessToken);
  return useQuery({
    queryKey: [entity],
    queryFn: () =>
      service.crud.get({
        complementURL: 'stats',
      }),
    onSuccess,
  });
};

export const useGetDashboardInfos = (
  accessToken: string,
  onSuccess:
    | ((
        data:
          | ISuccessResponse<GetDashboardInfosResponse>
          | IErrorResponse<GetDashboardInfosResponse>,
      ) => void)
    | undefined,
) => {
  const service = new DashboardService(accessToken);
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => service.crud.getInfos(),
    onSuccess,
  });
};
