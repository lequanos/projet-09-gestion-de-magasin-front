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
import { DashboardService } from '@/services/dashboard/DashboardService';
import { GetDashboardInfosResponse } from '@/services/dashboard/interfaces/dashboardResponse.interface';
import { ProductService } from '@/services/product/ProductService';
import { SupplierService } from '@/services/supplier/SupplierService';
import { AisleService } from '@/services/aisle/AisleService';
import { ProductDtoPayload } from '@/models/product';
import { StoreDto } from '@/models/store';

const serviceDictionary = {
  auth: (accessToken?: string) => new AuthService(accessToken),
  aisle: (accessToken?: string) => new AisleService(accessToken),
  dashboard: (accessToken?: string) => new DashboardService(accessToken),
  mail: () => new MailService(),
  product: (accessToken?: string) => new ProductService(accessToken),
  store: (accessToken?: string) => new StoreService(accessToken),
  supplier: (accessToken?: string) => new SupplierService(accessToken),
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
      refetchOnWindowFocus: false,
    },
  );
};

export const useGetOneQuery = <T>(
  entity: EntityList,
  id?: string,
  accessToken?: string,
  query?: IParam<string>,
  enabled = true,
  onSuccess?:
    | ((data: ISuccessResponse<T> | IErrorResponse<T | undefined>) => void)
    | undefined,
) => {
  const service = getService(entity, accessToken);
  return useQuery({
    queryKey: [entity],
    queryFn: () => service.crud.getOne(id || '', query),
    enabled,
    onSuccess,
    refetchOnWindowFocus: false,
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

export const useCreateMutation = <T, U>(
  payload: CreateType<T>,
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: () => service.crud.create<T, U>(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useUpdateMutation = <T, U>(
  payload: PutType<T>,
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: () => service.crud.update<T, U>(payload),
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

export const useDeleteMutation = (entity: EntityList, accessToken?: string) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: (payload: DeleteType) => service.crud.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useDeactivateMutation = <T>(
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: (payload: DeleteType) => service.crud.deactivate<T>(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${entity}s`] });
    },
  });
};

export const useReactivateMutation = <T>(
  entity: EntityList,
  accessToken?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, accessToken);
  return useMutation({
    mutationFn: (payload: PutType<T>) => service.crud.reactivate<T>(payload),
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
    mutationFn: (variables: SelectStoreDto | undefined) =>
      service.crud.selectStore(variables || payload),
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
          | ISuccessResponse<StoreDto[]>
          | IErrorResponse<StoreDto[] | undefined>,
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

export const useSearchStoresSiret = (
  searchValue: string,
  enabled: boolean,
  accessToken?: string,
  onSuccess?:
    | ((
        data: ISuccessResponse<StoreDto> | IErrorResponse<StoreDto | undefined>,
      ) => void)
    | undefined,
) => {
  const service = new StoreService(accessToken);
  return useQuery({
    queryKey: ['store'],
    queryFn: () => service.crud.searchStoresSiret(searchValue),
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

export const useSearchProduct = (
  searchValue: string,
  enabled: boolean,
  accessToken?: string,
  onSuccess?:
    | ((
        data:
          | ISuccessResponse<ProductDtoPayload>
          | IErrorResponse<ProductDtoPayload | undefined>,
      ) => void)
    | undefined,
) => {
  const service = new ProductService(accessToken);
  return useQuery({
    queryKey: ['searchedProduct'],
    queryFn: () => service.crud.searchProduct(searchValue),
    enabled,
    onSuccess,
  });
};
