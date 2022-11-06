import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { LoginDto } from '../models/auth';
import { MailDto } from '../models/mail';
import { ISuccessResponse, IErrorResponse } from '../services/api/interfaces';
import {
  CreateType,
  DeleteType,
  PutType,
} from '../services/api/interfaces/crud.interface';
import { AuthService } from '../services/auth/AuthService';
import { MailService } from '../services/mail/MailService';

const serviceDictionary = {
  auth: (accessToken?: string) => new AuthService(accessToken),
  mail: () => new MailService(),
};

export type EntityList = keyof typeof serviceDictionary;

const getService = (entity: EntityList, accessToken?: string) => {
  return serviceDictionary[entity](accessToken);
};

export const useGetAllQuery = (entity: EntityList, accessToken?: string) => {
  const service = getService(entity, accessToken);
  return useInfiniteQuery({
    queryKey: [`${entity}s`],
    queryFn: () => service.crud.getAll,
  });
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
