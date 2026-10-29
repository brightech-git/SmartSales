import { formatDate } from "./date";

// src/utils/formatDateForAPI.ts
export const formatDateForAPI = (date: string | Date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};


/** dd-mm-yyyy for screens. Missing or invalid dates show as "". */
export const formatDateForShow = (date: string | Date | null) => formatDate(date);
