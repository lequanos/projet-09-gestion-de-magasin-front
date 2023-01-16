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
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  MouseEvent,
} from 'react';
import { useForm } from 'react-hook-form';

import { RSButton, RSForm, RSInput } from '@/components/RS';
import { AisleDto, AisleDtoPayload } from '@/models/aisle';
import { Permission } from '@/models/role';
import { onSuccess, userHasPermission } from '@/helpers/utils';
import {
  useUpdateMutation,
  useUserContext,
  useAccessToken,
  useToastContext,
  useCreateMutation,
  useDeleteMutation,
} from '@/hooks';
import { IErrorResponse } from '@/services/api/interfaces';
import { CategoryDtoPayload, CategoryDto } from '@/models/category';

type AisleItemProps = {
  aisleId: number;
  setAisleId: Dispatch<SetStateAction<number>>;
  aisle: AisleDto;
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
};

type AisleFormValues = {
  name: string;
  categories: number[];
};

type CategoryFormValues = {
  name: string;
};

function AisleItem({
  aisleId,
  setAisleId,
  aisle,
  setOpenDelete,
}: AisleItemProps) {
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
    watch: categoryWatch,
    setValue: setCategoryValue,
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: '',
    },
  });
  const { name: categoryName } = categoryWatch();

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

  const addCategoryMutation = useCreateMutation<
    CategoryDtoPayload,
    CategoryDto
  >(
    {
      toCreate: {
        body: {
          name: categoryName,
          aisle: aisle.id || 0,
        },
      },
    },
    'category',
    accessToken,
  );

  const deleteMutation = useDeleteMutation('category', accessToken);

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
              updateAisleError.formatted.errorDefault,
              updateAisleError.formatted.title,
              t(`Common.Aisle`),
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

  /**
   * Add a new category and update the aisle with the new category
   */
  const handleAddCategory = () => {
    addCategoryMutation.mutate(undefined, {
      onSuccess: (response) => {
        const { ok, status, data } = response;

        if ([401, 403].includes(status)) {
          throw new Response('', { status });
        }

        if (!ok) {
          const addCategoryError = response as IErrorResponse<AisleDto>;
          toast[addCategoryError.formatted.type](
            addCategoryError.formatted.errorDefault,
            addCategoryError.formatted.title,
            t(`Common.Category`),
          );
          return;
        }
        aisle.categories?.push({
          id: data?.id,
          name: data?.name,
        });
        setCategoryValue('name', '');
      },
    });
  };

  /**
   * Delete category
   */
  const handleDeleteCategory = (id: number) => {
    deleteMutation.mutate(
      { id: id.toString() },
      {
        onSuccess: onSuccess<void>(
          () => {
            aisle.categories = aisle.categories?.filter((cat) => cat.id !== id);
          },
          toast,
          'Category',
        ),
      },
    );
  };

  /**
   * Open delete aisle modal
   */
  const handleOpenDeleteModal = (
    e: MouseEvent<SVGSVGElement, globalThis.MouseEvent>,
  ) => {
    e.stopPropagation();
    setOpenDelete(true);
    setAisleId(aisle.id || 0);
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
            onClick={handleOpenDeleteModal}
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
              onSubmit={categoryHandleSubmit(handleAddCategory)}
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
                permissions={[Permission.MANAGE_ALL, Permission.MANAGE_AISLE]}
                startIcon="arrowDown"
                size="small"
                type="submit"
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
                  ? () => handleDeleteCategory(cat.id || 0)
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
