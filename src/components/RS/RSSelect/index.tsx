import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { t } from 'i18next';
import {
  Control,
  Controller,
  FieldErrorsImpl,
  RegisterOptions,
} from 'react-hook-form';
import { rulesValidationDictionary } from '@/helpers/rulesValidationDictionary';
import { capitalize } from '@/helpers/utils';
import { BaseModel } from '@/services/interfaces/common.interface';

type RSSelectProps<T extends BaseModel> = {
  id: string;
  className?: string;
  defaultValue?: string;
  label: string;
  labelId: string;
  control?: Control<
    | {
        [x: string]: any;
      }
    | { selectedStore: string },
    any
  >;
  helperText?: string;
  name: string;
  rules?: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
  items: T[];
};

export function RSSelect<T extends BaseModel>({
  id,
  className,
  defaultValue = '',
  helperText,
  labelId,
  label,
  control,
  name,
  rules,
  errors,
  items,
}: RSSelectProps<T>) {
  const getHelperText = () => {
    const message = errors[name]?.message;

    if (!message || !errors[name]) {
      return helperText;
    }
    return t(message as string, { name: t(`Common.${capitalize(name)}`) });
  };
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={rules || rulesValidationDictionary[name]}
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormControl variant="filled" className={className}>
            <InputLabel id={labelId}>{t(label)}</InputLabel>
            <Select
              labelId={labelId}
              id={id}
              label={t(label)}
              error={!!errors[name]}
              variant="filled"
              {...field}
            >
              {items.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
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
