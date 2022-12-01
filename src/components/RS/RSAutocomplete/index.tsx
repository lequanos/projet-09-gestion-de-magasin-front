import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
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
import { SyntheticEvent } from 'react';

type RSAutocompleteProps<T extends BaseModel> = {
  className?: string;
  defaultValue: T;
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
  options: T[];
  onInputChange: (
    _event: SyntheticEvent<Element, Event>,
    value: string,
  ) => void;
};

export function RSAutocomplete<T extends BaseModel>({
  className,
  defaultValue,
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
        defaultValue={defaultValue}
        render={({ field }) => (
          <FormControl variant="filled" className={className}>
            <Autocomplete
              defaultValue={defaultValue}
              options={options}
              onInputChange={onInputChange}
              filterOptions={(x) => x}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              {...field}
              renderInput={(params) => (
                <TextField
                  variant="filled"
                  {...params}
                  label={t(label)}
                  fullWidth
                />
              )}
            />
            <FormHelperText error>{getHelperText()}</FormHelperText>
          </FormControl>
        )}
      />
    </>
  );
}
