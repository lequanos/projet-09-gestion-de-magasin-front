import { Severity, ToastValues } from '@/components/RS';
import { createContext, useContext } from 'react';
import { useToast } from './useToast';

export type ToastContextType = ToastValues & {
  toast: {
    [key in Severity]: (message: string, title?: string) => void;
  } & { close: () => void };
};

export const defaultToastValues: ToastValues = {
  open: false,
  title: 'Error.Error_Title',
  message: 'Error.General_Label',
  severity: 'info',
};

const initialContext: ToastContextType = {
  ...defaultToastValues,
  toast: {
    error: (message: string) => {
      return message;
    },
    info: (message: string) => {
      return message;
    },
    warning: (message: string) => {
      return message;
    },
    success: (message: string) => {
      return message;
    },
    close: () => {
      return;
    },
  },
};

export const ToastContext = createContext<ToastContextType>(initialContext);

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toastValues, setToastValues] = useToast(
    'Error.Error_Title',
    'Error.General_Label',
    'info',
  );

  function callToast(severity: Severity) {
    return (message: string, title?: string) => {
      const values: Partial<ToastValues> = { message, severity };

      if (title) values.title = title;

      setToastValues(values);
    };
  }

  const contextValue = {
    ...toastValues,
    toast: {
      error: callToast('error'),
      info: callToast('info'),
      warning: callToast('warning'),
      success: callToast('success'),
      close: () => {
        setToastValues({ open: false });
      },
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

export const useToastContext = () => useContext<ToastContextType>(ToastContext);
