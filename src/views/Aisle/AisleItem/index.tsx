import { ExpandMore, Delete } from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Chip,
  AccordionActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query';

import { RSButton, RSForm, RSInput } from '@/components/RS';
import { AisleDto, AisleDtoPayload } from '@/models/aisle';
import { Permission } from '@/models/role';
import { userHasPermission } from '@/helpers/utils';
import {
  useUpdateMutation,
  useUserContext,
  useAccessToken,
  useToastContext,
} from '@/hooks';
import { IErrorResponse } from '@/services/api/interfaces';

type AisleItemProps = {
  aisleId: number;
  setAisleId: Dispatch<SetStateAction<number>>;
  aisle: AisleDto;
};

type AisleFormValues = {
  name: string;
  categories: number[];
};

type CategoryFormValues = {
  name: string;
};

function AisleItem({ aisleId, setAisleId, aisle }: AisleItemProps) {
  // Hooks
  const { t } = useTranslation('translation');
  const { user } = useUserContext();
  const { accessToken } = useAccessToken();
  const { toast } = useToastContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AisleFormValues>({
    defaultValues: {
      name: '',
      categories: [],
    },
  });
  const { name: aisleName } = watch();
  const {
    handleSubmit: categoryHandleSubmit,
    control: categoryControl,
    formState: { errors: categoryErrors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: '',
    },
  });

  const updateAisleMutation = useUpdateMutation<AisleDtoPayload, AisleDto>(
    {
      toUpdate: {
        body: {
          id: aisle.id?.toString() || '0',
          name: aisleName,
        },
      },
    },
    'aisle',
    accessToken,
  );

  // States
  const [readOnly, setReadOnly] = useState(true);

  // Methods
  /**
   * Open or close expander
   */
  const handleExpand = (id: number) => {
    if (aisleId === id) return setAisleId(0);
    setAisleId(id);
  };

  /**
   * Update aisle name
   */
  const handleUpdateAisle = () => {
    setReadOnly(!readOnly);
    if (aisle.name !== aisleName) {
      updateAisleMutation.mutate(undefined, {
        onSuccess: (response) => {
          const { ok, status } = response;

          if ([401, 403].includes(status)) {
            throw new Response('', { status });
          }

          if (!ok) {
            const updateAisleError = response as IErrorResponse<AisleDto>;
            toast[updateAisleError.formatted.type](
              t(updateAisleError.formatted.errorDefault as string, {
                name: t(`Common.Aisle`),
              }),
              updateAisleError.formatted.title,
            );
            return;
          }
          toast.success('Aisle.Success_Update', 'Aisle.Success_Update_Title');
        },
      });
    }
  };

  /**
   * Make aisle name editable
   */
  const handleEditButtonClick = () => {
    setReadOnly(!readOnly);
  };

  // useEffect
  useEffect(() => {
    setValue('name', aisle.name || '');
    setValue(
      'categories',
      aisle.categories
        ?.map((cat) => cat.id)
        .filter((value) => !!value) as number[],
    );
  }, [aisle]);

  return (
    <Accordion
      expanded={aisleId === aisle.id}
      onChange={() => handleExpand(aisle.id || 0)}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        className="aisle--accordion-summary"
      >
        <RSForm
          onSubmit={handleSubmit(handleUpdateAisle)}
          onClick={(e) => e.stopPropagation()}
        >
          <RSInput
            className="aisle--form-input"
            hiddenLabel
            name="name"
            control={control}
            errors={errors}
            size="small"
            readOnly={readOnly}
            InputProps={{
              disableUnderline: true,
            }}
            onClick={(e) => e.stopPropagation()}
            startIcon="edit"
            onStartIconClick={handleEditButtonClick}
            permissions={[Permission.MANAGE_ALL, Permission.MANAGE_AISLE]}
          />
        </RSForm>
        <div className="aisle--accordion-summary-content">
          <Typography sx={{ color: 'text.secondary' }}>
            {`${aisle.categories?.length || 0} catégories`}
          </Typography>
          <Delete
            className="aisle--accordion-delete-btn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </AccordionSummary>
      <AccordionDetails className="aisle--accordion-details">
        {userHasPermission(user, [
          Permission.MANAGE_ALL,
          Permission.MANAGE_AISLE,
        ]) && (
          <AccordionActions className="aisle--accordion-actions">
            <RSForm
              onSubmit={categoryHandleSubmit(() => console.log('hello'))}
              onClick={(e) => e.stopPropagation()}
              className="aisle--form-category"
            >
              <RSInput
                className="aisle--form-input-category"
                hiddenLabel
                name="name"
                control={categoryControl}
                errors={categoryErrors}
                size="small"
                readOnly={false}
                InputProps={{
                  disableUnderline: true,
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <RSButton
                className="aisle--add-category"
                onClick={() => console.log('Ouvert')}
                permissions={[Permission.MANAGE_ALL, Permission.MANAGE_AISLE]}
                startIcon="arrowDown"
                size="small"
              >
                {t('Aisle.AddCategory')}
              </RSButton>
            </RSForm>
          </AccordionActions>
        )}
        <div className="aisle--accordion-chips">
          {aisle.categories?.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.name}
              color="primary"
              onDelete={
                userHasPermission(user, [
                  Permission.MANAGE_ALL,
                  Permission.MANAGE_AISLE,
                ])
                  ? () => console.log('delete')
                  : undefined
              }
            />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default AisleItem;
