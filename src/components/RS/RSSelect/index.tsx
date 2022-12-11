import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';
import { t } from 'i18next';
import { ReactNode } from 'react';
import {
  Control,
  Controller,
  FieldErrorsImpl,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from 'react-hook-form';

import { rulesValidationDictionary } from '@/helpers/rulesValidationDictionary';
import { capitalize } from '@/helpers/utils';
import { BaseModel } from '@/models/interfaces/common.interface';

type RSSelectProps<T extends BaseModel, U extends FieldValues> = {
  className?: string;
  control?: Control<U, any>;
  errors: Partial<FieldErrorsImpl<FieldValues>>;
  helperText?: string;
  id: string;
  items: T[];
  label: string;
  labelId: string;
  multiple?: boolean;
  name: Path<U>;
  onChange?:
    | ((event: SelectChangeEvent<any>, child: ReactNode) => void)
    | undefined;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  size?: 'small' | 'medium';
};

export function RSSelect<T extends BaseModel, U extends FieldValues>({
  className,
  control,
  errors,
  helperText,
  id,
  items,
  labelId,
  label,
  multiple = false,
  name,
  rules,
  onChange,
  size = 'medium',
}: RSSelectProps<T, U>) {
  // Methods
  /**
   * Get error message
   */
  const getHelperText = () => {
    const message = errors[name]?.message;

    if (!message || !errors[name]) {
      return helperText;
    }
    return t(message as string, { name: t(`Common.${capitalize(name)}`) });
  };

  const onRenderValue = (selected: PathValue<U, Path<U>>) =>
    items.find((item) => item.id === (selected as number)).name;
  const onMultipleRenderValue = (selected: PathValue<U, Path<U>>) =>
    selected
      .map((select) => items.find((item) => item.id === select).name)
      .join(', ');
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules || rulesValidationDictionary[name]}
        render={({ field }) => (
          <FormControl
            variant="filled"
            className={className}
            sx={{
              marginTop: '1rem',
            }}
            size={size}
          >
            <InputLabel id={labelId}>{t(label)}</InputLabel>
            <Select
              labelId={labelId}
              id={id}
              label={t(label)}
              error={!!errors[name]}
              variant="filled"
              multiple={multiple}
              {...field}
              onChange={onChange || field.onChange}
              renderValue={multiple ? onMultipleRenderValue : onRenderValue}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {multiple ? (
                    <>
                      <Checkbox
                        checked={field.value?.indexOf(item.name) > -1}
                      />
                      <ListItemText primary={item.name} />
                    </>
                  ) : (
                    <>{item.name}</>
                  )}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error>{getHelperText()}</FormHelperText>
          </FormControl>
        )}
      />
    </>
  );
}
