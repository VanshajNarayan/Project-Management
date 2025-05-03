"use client";

import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, options?: object) =>
    sonnerToast.success(message, options),

  error: (message: string, options?: object) =>
    sonnerToast.error(message, options),

  info: (message: string, options?: object) => sonnerToast(message, options),

  warning: (message: string, options?: object) =>
    sonnerToast.warning
      ? sonnerToast.warning(message, options)
      : sonnerToast(message, options),

  loading: (message: string, options?: object) =>
    sonnerToast.loading(message, options),
};
