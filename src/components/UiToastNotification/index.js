import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './style.scss';

const UiToastNotification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
};

export const showToast = {
  success: (status, message) =>
    toast.success(`${status ?? ""} ${message ?? ""}` || "Operation successful!", {
      icon: "✅",
    }),

  error: (status, message) =>
    toast.error(`${status ?? ""} ${message ?? ""}` || "Something went wrong!", {
      icon: "❌",
    }),

  warning: (status, message) =>
    toast.warning(`${status ?? ""} ${message ?? ""}` || "Please check the details!", {
      icon: "⚠️",
    }),

  info: (status, message) =>
    toast.info(`${status ?? ""} ${message ?? ""}` || "FYI!", {
      icon: "ℹ️",
    }),
};

export default UiToastNotification;
