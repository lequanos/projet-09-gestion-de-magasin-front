import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
  MenuItem,
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
import { BaseModel } from '@/models/interfaces/common.interface';
import { SyntheticEvent } from 'react';

type RSAutocompleteProps<T extends BaseModel> = {
  className?: string;
  label: string;
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
  options: Partial<T>[];
  onInputChange: (
    _event: SyntheticEvent<Element, Event>,
    value: string,
  ) => void;
};

export function RSAutocomplete<T extends BaseModel>({
  className,
  helperText,
  label,
  control,
  name,
  rules,
  errors,
  options,
  onInputChange,
}: RSAutocompleteProps<T>) {
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
        render={({ field }) => (
          <FormControl variant="filled" className={className}>
            <Autocomplete
              options={options.map((option) => option.id)}
              onInputChange={onInputChange}
              getOptionLabel={(id) =>
                options?.find((opt) => opt.id === id)?.name || ''
              }
              isOptionEqualToValue={(option, value) => option === value}
              {...field}
              value={
                options.map((option) => option.id).includes(field.value)
                  ? field.value
                  : null
              }
              renderInput={(params) => (
                <TextField
                  variant="filled"
                  {...params}
                  label={t(label)}
                  fullWidth
                />
              )}
              renderOption={(params, id) => (
                <MenuItem {...params} key={id} value={id}>
                  {options?.find((opt) => opt.id === id)?.name}
                </MenuItem>
              )}
            />
            <FormHelperText error>{getHelperText()}</FormHelperText>
          </FormControl>
        )}
      />
    </>
  );
}
