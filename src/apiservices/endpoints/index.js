const {
    REACT_APP_MASTER_DEV_BASE_URL: MASTER_DEV_BASE_URL,
} = process.env;

//Master
export const LOGIN = `${MASTER_DEV_BASE_URL}user/login`;
export const USER = `${MASTER_DEV_BASE_URL}user`;
export const KITTING = `${MASTER_DEV_BASE_URL}barcode-kitting`;
export const KITTINGINFO = `${MASTER_DEV_BASE_URL}barcode-kitting-info`;
export const MISSING_PART_NO = `${KITTINGINFO}/missingBarcodes`;
export const CONFIG = `${MASTER_DEV_BASE_URL}config`;

//SOB

export const SOCBASEURL = `${MASTER_DEV_BASE_URL}sob`;

//KANBAN

export const KANBANBASEURL = `${MASTER_DEV_BASE_URL}kanban`;

//CSL

export const CSLBASEURL = `${MASTER_DEV_BASE_URL}csl`;
export const REPORTBASEURL = `${CSLBASEURL}/report`;
export const DASHBOARDBASEURL = `${CSLBASEURL}/dashboard`;





