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
  const [name, setName] = useState<string>();

  const toastValues = { open, title, message, severity, name };
  const setToastValues = ({
    title: toastTitle,
    message: toastMessage,
    severity: toastSeverity,
    name: toastName,
    open: toastOpen = true,
  }: Partial<ToastValues>): void => {
    setTitle(toastTitle || title);
    setMessage(toastMessage || message);
    setSeverity(toastSeverity || severity);
    setOpen(toastOpen || false);
    setName(toastName);
  };

  return [toastValues, setToastValues] as const;
}
