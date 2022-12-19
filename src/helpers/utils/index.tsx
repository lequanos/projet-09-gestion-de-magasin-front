import { EntityList } from '@/hooks';
import { Permission } from '@/models/role';
import {
  CheckCircleOutline,
  Visibility,
  ReportGmailerrorred,
} from '@mui/icons-material';
import { Chip } from '@mui/material';
import {
  GridActionsCellItem,
  GridEnrichedColDef,
  GridRowParams,
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
  onClick?: () => void,
): GridEnrichedColDef[] => {
  if (!tableData.length) return [];

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
    isActiveField.renderCell = (params) =>
      params.value ? (
        <CheckCircleOutline color="success" />
      ) : (
        <ReportGmailerrorred color="error" />
      );
  }

  const salesField = columns?.find((col) => col?.field === 'sales');

  if (salesField) {
    salesField.renderCell = (params) => params.value || 0;
  }
  const indexOfManageEntity = Object.keys(Permission).indexOf(
    `MANAGE_${entity.toUpperCase()}`,
  );
  const indexOfReadEntity = Object.keys(Permission).indexOf(
    `READ_${entity.toUpperCase()}`,
  );

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
      headerName: t('Product.Modal.AddProduct.Actions'),
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<Visibility />}
          onClick={onClick}
          label="Delete"
          showInMenu={false}
          onResize={undefined}
          onResizeCapture={undefined}
          color="primary"
        />,
      ],
    });
  }
  return columns as GridEnrichedColDef[];
};
