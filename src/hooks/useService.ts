import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { LoginDto } from '../models/auth';
import {
  CreateType,
  DeleteType,
  PutType,
} from '../services/api/interfaces/crud.interface';
import { AuthService } from '../services/auth/AuthService';

const serviceDictionary = {
  auth: (url?: string) => new AuthService(url),
};

export type EntityList = keyof typeof serviceDictionary;

const getService = (entity: EntityList, url?: string) => {
  return serviceDictionary[entity](url);
};

export const useGetAllQuery = (entity: EntityList, url?: string) => {
  const service = getService(entity, url);
  return useInfiniteQuery({
    queryKey: [`${entity}s`],
    queryFn: () => service.crud.getAll,
  });
};

export const useGetOneQuery = (entity: EntityList, url?: string) => {
  const service = getService(entity, url);
  return useQuery({
    queryKey: [entity],
    queryFn: () => service.crud.getOne,
  });
};

export const useCreateMutation = <T>(
  payload: CreateType<T>,
  entity: EntityList,
  url?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, url);
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
  url?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, url);
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
  url?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, url);
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
  url?: string,
) => {
  const queryClient = useQueryClient();
  const service = getService(entity, url);
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
