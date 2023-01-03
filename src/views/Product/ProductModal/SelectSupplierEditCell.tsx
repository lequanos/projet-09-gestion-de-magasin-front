import { SelectChangeEvent, Select, MenuItem } from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

import { SupplierDto } from '@/models/supplier';

type SelectSupplierEditCellProps = {
  suppliers: SupplierDto[];
};

function SelectSupplierEditCell(
  props: GridRenderCellParams & SelectSupplierEditCellProps,
) {
  // Hooks
  const { id, value, field, suppliers } = props;
  const apiRef = useGridApiContext();
  const { t } = useTranslation('translation');

  // Methods
  /**
   * Select the supplier
   */
  const handleChange = async (event: SelectChangeEvent) => {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: event.target.value,
    });

    apiRef.current.stopCellEditMode({ id, field });
  };

  return (
    <Select
      size="small"
      onChange={handleChange}
      value={value}
      id={id as string}
      label={t('Product.Form.Name')}
      labelId={t('Product.Form.Name')}
      sx={{ width: '100%' }}
    >
      {suppliers.map((supplier) => (
        <MenuItem key={supplier.id} value={supplier.id}>
          {supplier.name}
        </MenuItem>
      ))}
    </Select>
  );
}

export default SelectSupplierEditCell;
