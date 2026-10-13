import { useContext } from 'react';
import { ToastContext } from './toastContextInstance';

export const useToast = () => useContext(ToastContext);
