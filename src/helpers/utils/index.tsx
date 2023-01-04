import { EntityList, ToastFunction } from '@/hooks';
import { Permission } from '@/models/role';
import { ISuccessResponse, IErrorResponse } from '@/services/api/interfaces';
import { Edit, Delete, ChangeCircleOutlined } from '@mui/icons-material';
import { Chip, ToggleButton } from '@mui/material';
import {
  GridActionsCellItem,
  GridEnrichedColDef,
  GridRowParams,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { t } from 'i18next';

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Get columns depending on tableData
 */
export const getColumns = <T extends any[]>(
  tableData: T,
  entity: EntityList,
  permissions?: Permission[],
  onClickEdit?: (params: GridRowParams) => void,
  onClickDelete?: (params: GridRowParams) => void,
  onClickToggleActivateStatus?: (params: GridRenderCellParams) => void,
  onClickChange?: (params: GridRowParams) => void,
): GridEnrichedColDef[] => {
  if (!tableData.length) return [];
  const indexOfManageEntity = Object.keys(Permission).indexOf(
    `MANAGE_${entity.toUpperCase()}`,
  );
  const indexOfReadEntity = Object.keys(Permission).indexOf(
    `READ_${entity.toUpperCase()}`,
  );

  const columns: (GridEnrichedColDef | undefined)[] = Object.keys(tableData[0])
    .map((key) => {
      if (key === 'id') return;

      return {
        field: key,
        headerName: t(`${capitalize(entity)}.Columns.${capitalize(key)}`),
        flex: 1,
      } as GridEnrichedColDef;
    })
    .filter((value) => !!value);

  const priceField = columns?.find((col) => col?.field === 'price');

  if (priceField) {
    priceField.renderCell = (params) => <div>{params.value.toFixed(2)}€</div>;
  }

  const thresholdField = columns?.find((col) => col?.field === 'threshold');

  if (thresholdField) {
    thresholdField.renderCell = (params) =>
      params.value >= Number(params.row.inStock) && params.row.isActive ? (
        <Chip label={t('Product.MustOrder')} color="error" />
      ) : (
        ''
      );
  }

  const isActiveField = columns?.find((col) => col?.field === 'isActive');

  if (isActiveField) {
    isActiveField.align = 'center';
    isActiveField.renderCell = (params) => (
      <ToggleButton
        value={params.value}
        selected={true}
        onChange={() => {
          if (onClickToggleActivateStatus) onClickToggleActivateStatus(params);
        }}
        color={params.value ? 'success' : 'error'}
        size="small"
        sx={{
          border: 'none',
          width: '50%',
        }}
        disabled={
          !(
            permissions &&
            permissions.length &&
            [
              Permission.MANAGE_ALL,
              Object.values(Permission)[indexOfManageEntity],
            ].some((p) => permissions.includes(p))
          )
        }
      >
        {params.value ? 'Actif' : 'Inactif'}
      </ToggleButton>
    );
  }

  const salesField = columns?.find((col) => col?.field === 'sales');

  if (salesField) {
    salesField.renderCell = (params) => params.value || 0;
  }

  if (
    permissions &&
    permissions.length &&
    [
      Permission.MANAGE_ALL,
      Permission.READ_ALL,
      Object.values(Permission)[indexOfManageEntity],
      Object.values(Permission)[indexOfReadEntity],
    ].some((p) => permissions.includes(p))
  ) {
    columns.push({
      field: 'actions',
      type: 'actions',
      headerName: t('Product.Form.Actions'),
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<Edit />}
          onClick={() => {
            if (onClickEdit) onClickEdit(params);
          }}
          label="Edit"
          showInMenu={false}
          onResize={undefined}
          onResizeCapture={undefined}
          color="primary"
          disabled={!params.row.isActive}
        />,
        permissions &&
        permissions.length &&
        [
          Permission.MANAGE_ALL,
          Object.values(Permission)[indexOfManageEntity],
        ].some((p) => permissions.includes(p)) ? (
          <GridActionsCellItem
            icon={<Delete />}
            onClick={() => {
              if (onClickDelete) onClickDelete(params);
            }}
            label="Delete"
            showInMenu={false}
            onResize={undefined}
            onResizeCapture={undefined}
          />
        ) : (
          <></>
        ),
        entity === 'store' ? (
          <GridActionsCellItem
            icon={<ChangeCircleOutlined />}
            onClick={() => {
              if (onClickChange) onClickChange(params);
            }}
            label="ChangeStore"
            showInMenu={false}
            onResize={undefined}
            onResizeCapture={undefined}
            color="primary"
            disabled={!params.row.isActive}
          />
        ) : (
          <></>
        ),
      ],
    });
  }

  return columns as GridEnrichedColDef[];
};

export const onSuccess = <T,>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  toast: ToastFunction,
  entity: string,
) => {
  return (response: ISuccessResponse<T> | IErrorResponse<T | undefined>) => {
    const { ok, status } = response;

    if ([401, 403].includes(status)) {
      throw new Response('', { status });
    }

    if (!ok) {
      const error = response as IErrorResponse<T>;
      toast[error.formatted.type](
        t(error.formatted.errorDefault as string, {
          name: t(`Common.${entity}`),
        }),
        error.formatted.title,
      );
      return;
    }
    const result = response as ISuccessResponse<T>;
    fn(result);
  };
};
