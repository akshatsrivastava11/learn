import { toast } from "react-hot-toast"

export const showToast = {
  success: (message: string, toastId?: string) => {
    toast.success(message, {
      id: toastId, // Use provided ID for dismissal
      duration: 4000,
      position: "top-right",
      style: {
        background: "#16a34a", // Tailwind green-600
        color: "#fff",
        fontWeight: "bold",
        border: "1px solid #22c55e", // Tailwind green-500
        borderRadius: "8px", // Slightly rounded corners
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow
      },
    })
  },

  error: (message: string, toastId?: string) => {
    toast.error(message, {
      id: toastId, // Use provided ID for dismissal
      duration: 5000,
      position: "top-right",
      style: {
        background: "#dc2626", // Tailwind red-600
        color: "#fff",
        fontWeight: "bold",
        border: "1px solid #ef4444", // Tailwind red-500
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    })
  },

  loading: (message: string) => {
    return toast.loading(message, {
      position: "top-right",
      style: {
        background: "#4b5563", // Tailwind gray-700
        color: "#fff",
        fontWeight: "bold",
        border: "1px solid #6b7280", // Tailwind gray-600
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    })
  },

  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },

  promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }) => {
    return toast.promise(promise, messages, {
      position: "top-right",
      style: {
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      success: {
        style: {
          background: "#16a34a", // Tailwind green-600
          color: "#fff",
          border: "1px solid #22c55e",
        },
      },
      error: {
        style: {
          background: "#dc2626", // Tailwind red-600
          color: "#fff",
          border: "1px solid #ef4444",
        },
      },
      loading: {
        style: {
          background: "#4b5563", // Tailwind gray-700
          color: "#fff",
          border: "1px solid #6b7280",
        },
      },
    })
  },
}
