import { EntityList } from '@/hooks';
import { CheckCircleOutline, ReportGmailerrorred } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
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
): GridColDef[] => {
  if (!tableData.length) return [];

  const columns = Object.keys(tableData[0])
    .map((key) => {
      if (key === 'id') return;

      return {
        field: key,
        headerName: t(`${capitalize(entity)}.Columns.${capitalize(key)}`),
        flex: 1,
      } as GridColDef;
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

  return columns as GridColDef[];
};
