import { useState } from 'react';
import { Severity, ToastValues } from '../components/RS';

export function useToast(
  defaultTitle: string,
  defaultMessage: string,
  defaultSeverity: Severity,
) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(defaultTitle);
  const [message, setMessage] = useState(defaultMessage);
  const [severity, setSeverity] = useState<Severity>(defaultSeverity);

  const toastValues = { open, title, message, severity };
  const setToastValues = ({
    title: toastTitle,
    message: toastMessage,
    severity: toastSeverity,
    open: toastOpen = true,
  }: Partial<ToastValues>): void => {
    setTitle(toastTitle || title);
    setMessage(toastMessage || message);
    setSeverity(toastSeverity || severity);
    setOpen(toastOpen || false);
  };

  return [toastValues, setToastValues] as const;
}
