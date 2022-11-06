import { Snackbar, Alert, AlertTitle } from '@mui/material';
import { t } from 'i18next';
import { SyntheticEvent } from 'react';

export type ToastValues = {
  open: boolean;
  title: string;
  message: string;
  severity: Severity;
};

export type Severity = 'error' | 'warning' | 'info' | 'success';

type RSToastProps = {
  toastValues: ToastValues;
  setToastValues: (toastValues: Partial<ToastValues>) => void;
};

export function RSToast({ toastValues, setToastValues }: RSToastProps) {
  const handleCloseSnackbar = (
    event?: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setToastValues({
      open: false,
    });
  };
  return (
    <Snackbar
      open={toastValues.open}
      autoHideDuration={1500}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={toastValues.severity}>
        <AlertTitle>{t(toastValues.title)}</AlertTitle>
        {t(toastValues.message)}
      </Alert>
    </Snackbar>
  );
}
