import BASE_URL from "./config"; 

export const loginApi = `${BASE_URL}/api/login`;



// property
export const newWardByOldWardApi = `${BASE_URL}/api/property/get-new-ward-by-old`;
export const apartmentByOldWardApi = `${BASE_URL}/api/property/get-apartment-by-old-ward`;
export const propertyMasterDataApi = `${BASE_URL}/api/property/get-saf-master-data`;
export const safInboxApi = `${BASE_URL}/api/property/inbox`;
export const safDtlForVerificationApi = `${BASE_URL}/api/property/get-saf-field-verification`