const {
    REACT_APP_MASTER_DEV_BASE_URL: MASTER_DEV_BASE_URL,
} = process.env;

//Master
export const LOGIN = `${MASTER_DEV_BASE_URL}user/login`;
export const USER = `${MASTER_DEV_BASE_URL}user`;
export const KITTING = `${MASTER_DEV_BASE_URL}barcode-kitting`;
export const KITTINGINFO = `${MASTER_DEV_BASE_URL}barcode-kitting-info`;
export  const MISSING_PART_NO = `${KITTINGINFO}/missingBarcodes`;