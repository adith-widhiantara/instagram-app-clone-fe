/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { swalErrorDefault } from '@/utils/lib/swal';

export const handleAxiosError = (error: AxiosError, fallbackMessage = 'An error occurred') => {
  swalErrorDefault.fire({
    title: 'Unprocessable Content',
    text: (error?.response?.data as any)?.message ?? fallbackMessage,
  });
};

export const handleGenericError = (error: AxiosError, message = 'An error occurred') => {
  swalErrorDefault.fire({
    text: (error?.response?.data as any)?.message ?? message,
  });
};

export const handleApiError = (response: any, fallbackMessage = 'Failed to update data.') => {
  if (response instanceof AxiosError) {
    handleAxiosError(response, fallbackMessage);
    return;
  }
  handleGenericError(response, fallbackMessage);
};
