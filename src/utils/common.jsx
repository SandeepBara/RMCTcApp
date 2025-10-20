import styles from "../Constants/css";


export const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

export const normalizeApiDate = (dateString) => {
  if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const formatDateForAPI = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** Finds the label in an array of options given a value. */
export const getLabelByValue = (options, value) => {
  if (!options || !value) return '';
  const found = options.find(option => String(option.value) === String(value));
  return found ? found.label : '';
};

export const formatTimeAMPM = (dateStr) => {
  // FIX: Replace the incorrect colon before milliseconds with a period/dot
  const correctedDateStr = dateStr.replace(/:(\d{3})$/, '.$1');

  const date = new Date(correctedDateStr);
  if (isNaN(date.getTime())) {
    console.error(`Invalid Date string provided: ${dateStr}. Corrected: ${correctedDateStr}`);
    // If date is invalid, return N/A or a clear error message
    return "N/A (Invalid Date)";
  }
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
};

export const formatLocalDateTime1 = (dateStr,separator="-") => {
  if (!dateStr) return "N/A";

  const date = new Date(dateStr);console.log("dateStr",formatLocalDate(dateStr));
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}${separator}${month}${separator}${year} ${hours}:${minutes}:${seconds}`;
};

export const formatLocalDateTime = (dateStr, separator = "-") => {
  if (!dateStr) return "N/A";

  // FIX: Replace the incorrect colon before milliseconds with a period/dot
  const correctedDateStr = dateStr.replace(/:(\d{3})$/, '.$1');

  const date = new Date(correctedDateStr);
  if (isNaN(date.getTime())) {
    console.error(`Invalid Date string provided: ${dateStr}. Corrected: ${correctedDateStr}`);
    // If date is invalid, return N/A or a clear error message
    return "N/A (Invalid Date)";
  }


  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}${separator}${month}${separator}${year} ${hours}:${minutes}:${seconds}`;
};
export const formatLocalDate = (dateStr,separator="-") => {
  if (!dateStr) return "N/A";
  // FIX: Replace the incorrect colon before milliseconds with a period/dot
  const correctedDateStr = dateStr.replace(/:(\d{3})$/, '.$1');

  const date = new Date(correctedDateStr);
  if (isNaN(date.getTime())) {
    console.error(`Invalid Date string provided: ${dateStr}. Corrected: ${correctedDateStr}`);
    // If date is invalid, return N/A or a clear error message
    return "N/A (Invalid Date)";
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${separator}${month}${separator}${year}`;

};

export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const statusColor=(status="")=>{
    const statusStr = String(status); 

    if (/Approved/i.test(statusStr)) {
        return { color: "#30843aaa" };
    }
    if (/Back To Citizen|BTC/i.test(statusStr)) {
        return { color: "#e60d0db3" };
    }
    if (/Not/i.test(statusStr)) {
        return { color: "#3969b8b3" };
    }
    
    if (/Pending/i.test(statusStr)) {
        return { color: "#71326db3" };
    }
    return { color: "#282628b3" };
}