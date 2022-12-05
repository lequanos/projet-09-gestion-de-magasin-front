import { useToastContext } from '@/hooks';
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

export function RSToast() {
  // Hooks
  const { open, title, message, severity, toast } = useToastContext();

  const handleCloseSnackbar = (
    event?: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    toast.close();
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleCloseSnackbar} severity={severity}>
        <AlertTitle>{t(title)}</AlertTitle>
        {t(message)}
      </Alert>
    </Snackbar>
  );
}
