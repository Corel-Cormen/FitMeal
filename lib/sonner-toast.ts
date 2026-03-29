import { toast } from "sonner"

type ToastOptions = Parameters<typeof toast.success>[1]

export const errorToastStyle = {
  background: "#fee2e2",
  border: "1px solid #fca5a5",
  color: "#991b1b",
} as const

export const successToastStyle = {
  background: "#dcfce7",
  border: "1px solid #86efac",
  color: "#166534",
} as const

export function toastError(message: string, options?: ToastOptions) {
  return toast.error(message, {
    ...options,
    style: { ...errorToastStyle, ...(options?.style ?? {}) },
  })
}

export function toastSuccess(message: string, options?: ToastOptions) {
  return toast.success(message, {
    ...options,
    style: { ...successToastStyle, ...(options?.style ?? {}) },
  })
}
