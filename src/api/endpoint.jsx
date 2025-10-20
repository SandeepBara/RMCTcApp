import BASE_URL,{WEB_URL} from "./config"; 
export const FRONTEND_URL = WEB_URL;

export const loginApi = `${BASE_URL}/api/login`;
export const logoutApi = `${BASE_URL}/api/logout`;
export const wfPermissionsApi = `${BASE_URL}/api/get-workflow-permission`;



// property
export const newWardByOldWardApi = `${BASE_URL}/api/property/get-new-ward-by-old`;
export const apartmentByOldWardApi = `${BASE_URL}/api/property/get-apartment-by-old-ward`;
export const propertyMasterDataApi = `${BASE_URL}/api/property/get-saf-master-data`;
export const safInboxApi = `${BASE_URL}/api/property/inbox`;
export const safDtlForVerificationApi = `${BASE_URL}/api/property/get-saf-field-verification`;
export const safSearchApi = `${BASE_URL}/api/property/search-saf`;
export const safDtlApi = `${BASE_URL}/api/property/get-saf-dtl`;
export const verificationDtlApi = `${BASE_URL}/api/property/field-verification-dtl`
export const memoReceiptApi = `${BASE_URL}/api/property/memo-receipt`;