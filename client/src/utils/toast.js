import { toast } from "react-toastify";

export const toastNotify = (type, message) => {
    if (type === "error") {
        toast.error(message, {
            position: "top-right",
            autoClose: 2000,
        });
    } else if (type === "success") {
        toast.success(message, {
            position: "top-right",
            autoClose: 2000,
        });
    } else if (type === "warning") {
        toast.warning(message, {
            position: "top-right", 
            autoClose: 2000, 
        });
    }
}