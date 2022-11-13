import { RegisterOptions } from 'react-hook-form';

export const rulesValidationDictionary: {
  [key: string]: Exclude<
    RegisterOptions,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs'
  >;
} = {
  email: {
    required: 'Error.Required_Input',
    pattern: {
      value:
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      message: 'Error.Format_Email',
    },
  },
  password: {
    required: 'Error.Required_Input',
  },
  firstname: {
    required: 'Error.Required_Input',
  },
  lastname: {
    required: 'Error.Required_Input',
  },
};
