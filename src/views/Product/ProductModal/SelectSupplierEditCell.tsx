import { SelectChangeEvent, Select, MenuItem } from '@mui/material';
import { GridRenderCellParams, useGridApiContext } from '@mui/x-data-grid';

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
      id={`${id}`}
      label="fournisseurs"
      labelId="fournisseurs"
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
