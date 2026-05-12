import { ExcelUploadLayout } from "../../../components";
import * as api from "../../../actions"
import { SOCBASEURL } from "../../../apiservices/endpoints";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { showToast } from "../../../components/UiToastNotification";
import dayjs from "dayjs";
import { handleDownload, searchInitiateDelayTime } from "../../../utils/appUtils";
import { loaderReducer } from "../../../reducers/loader.reducer";
const SOBUpload = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const debounceTimeOut = useRef(null);

    const [crExcelDetails, setCrExcelDetails] = useState({});
    const [filterValue, setFilterValue] = useState({ page: 0, size: 25, searchValue: "", fromDate: "", toDate: "" });
    const [dateFilter, setDateFilter] = useState(null);
    const [isValidate, setIsValidate] = useState(false);
    const [barCodeKittingAllData, setBarCodeKittingAllData] = useState({});
    const [selectedDetails, setSelectedDetails] = useState({});
    const [isOpen, setIsOpen] = useState({ isOpenFindExistCr: false });

    const getAllCrExcels = (details) => api.get(`${SOCBASEURL}/page?page=${details?.page}&size=${details?.size}${details?.searchValue ? `&crNumberSearch=${details?.searchValue}` : ""}${details?.fromDate && details?.toDate ? `&startDate=${details?.fromDate}&endDate=${details?.toDate}` : ""}`);
    const uploadExcel = (file) => api.post(`${SOCBASEURL}/file-upload`, file);
    const getExcelDownload = (id) => api.get(`${SOCBASEURL}/download-file/${id}`);
    const alreadyCrUploaded = (file) => api.post(`${SOCBASEURL}/validateCrNumber`, file);

    const { isFetching: isFetchCrExcel, refetch: fetchAllCrExcels } = useQuery(["", filterValue?.page, filterValue?.size, filterValue?.searchValue, filterValue?.fromDate, filterValue?.toDate], () => getAllCrExcels(filterValue), {
        enabled: Boolean(filterValue?.page || filterValue?.size || filterValue?.searchValue || (filterValue?.fromDate && filterValue?.toDate)),
        onSuccess: (crResponse) => {
            if (crResponse?.statusCode) {
                setBarCodeKittingAllData(crResponse?.result?.sobDetailResponsePage);
            }
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchExcelDownload } = useQuery(["DOWNLOAD_EXCEL", ""], getExcelDownload, {
        enabled: false,
        onSuccess: (excelResponse) => {
            const blob = new Blob(
                [excelResponse],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = selectedDetails?.fileName || "download.xlsx";
            link.click();

            window.URL.revokeObjectURL(url);
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchUploadingExcel } = useQuery(["UPLOAD_EXCEL", ""], uploadExcel, {
        enabled: false,
        onSuccess: (uploadResponse) => {
            if (uploadResponse?.status === 200) {
                showToast.success("Success", uploadResponse?.response?.data?.message);
                setCrExcelDetails({});
                fetchAllCrExcels();
                setIsOpen((prev) => ({ ...prev, isOpenFindExistCr: false }));
            } else {
                showToast.error("Error", uploadResponse?.response?.data?.error?.message);
            }
        },
        refetchOnWindowFocus: false,
    });

    const { isFetching: isFetchExistCr } = useQuery(["FIND_EXIST_CR", ""], alreadyCrUploaded, {
        enabled: false,
        onSuccess: (findCrResponse) => {
            if (findCrResponse?.status === 200) {
                if (findCrResponse?.data?.result?.crNumberExist?.length > 0) {
                    setCrExcelDetails((prev) => ({ ...prev, existCrNumbers: findCrResponse?.data?.result?.crNumberExist }));
                    setIsOpen((prev) => ({ ...prev, isOpenFindExistCr: true }));
                } else {
                    handleSubmit();
                }
            } else {
                showToast.error("Error", findCrResponse?.response?.data?.error?.message);
            }
        },
        refetchOnWindowFocus: false,
    });

    const handleChangeDate = (date) => {
        setDateFilter(date);
        if (date) {
            const fromDate = dayjs(date[0]).format("YYYY-MM-DD");
            const toDate = dayjs(date[1]).format("YYYY-MM-DD");
            if (fromDate && toDate) {
                setFilterValue((prev) => ({ ...prev, fromDate: fromDate, toDate: toDate }));
            }
        }
        else {
            setFilterValue((prev) => ({ ...prev, fromDate: "", toDate: "" }));
        }
    };

    const debounceSearch = (searchvalue) => {
        if (debounceTimeOut.current) {
            clearTimeout(debounceTimeOut.current);
        }
        if (searchvalue !== "") {
            debounceTimeOut.current = setTimeout(() => {
                setFilterValue((prev) => ({ ...prev, page: 0, size: 25, searchValue: searchvalue }));
            }, searchInitiateDelayTime);
        } else {
            setFilterValue((prev) => ({ ...prev, page: 0, size: 25, searchValue: "" }));
        }
    };

    const handleSearch = (searchvalue) => {
        debounceSearch(searchvalue);
    }

    const handleChangeFieldValue = (fieldValue, fieldName) => {
        setCrExcelDetails((prev) => ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };

    const handleDownloadFile = (details) => {
        setSelectedDetails(details);
        handleDownload({ url: `${SOCBASEURL}/download-file/${details?.fileName}`, name: details?.fileName });
    };

    const handlePagination = (page, size) => {
        setFilterValue((prev) => ({ ...prev, page: page - 1, size: size }));
    };

    const handleUploadExcel = async () => {
        const payload = new FormData();
        payload.append("file", crExcelDetails?.excel);
        queryClient.prefetchQuery(["FIND_EXIST_CR", ""], () => alreadyCrUploaded(payload));
    };

    const handleClose = () => {
        setIsOpen((prev) => ({ ...prev, isOpenFindExistCr: false }));
        setCrExcelDetails({});
    };

    const handleSubmit = () => {
        const payload = new FormData();
        payload.append("file", crExcelDetails?.excel);
        queryClient.prefetchQuery(["UPLOAD_EXCEL", ""], () => uploadExcel(payload));
    };


    useEffect(() => {
        let isValid = crExcelDetails?.excel?.name;
        setIsValidate(Boolean(isValid));
    }, [crExcelDetails]);

    useEffect(() => {
        let isLoading = isFetchCrExcel || isFetchExcelDownload || isFetchUploadingExcel || isFetchExistCr;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchCrExcel, isFetchExcelDownload, isFetchUploadingExcel, isFetchExistCr]);

    return (
        <>
            <ExcelUploadLayout
                title={"SOB Upload"}
                counter={barCodeKittingAllData?.totalElements}
                dateFilter={dateFilter}
                onDateChange={handleChangeDate}
                onSearch={handleSearch}
                fileName={crExcelDetails?.excel?.name}
                onFileSelect={(file) => handleChangeFieldValue(file, "excel")}
                onSubmit={handleUploadExcel}
                isSubmitDisabled={!isValidate}
                handleDownloadFile={handleDownloadFile}
                tableData={barCodeKittingAllData?.content || []}
                pagination={{
                    current: filterValue?.page + 1,
                }}
                handlePagination={handlePagination}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                isOpen={isOpen}
                modalTitle={`Are you sure you want to proceed with this Excel file and replace the existing ${crExcelDetails?.existCrNumbers?.length > 1 ? "CR numbers" : "CR number"
                    } (${crExcelDetails?.existCrNumbers?.join(", ")})?`}
            />
        </>
    )
}
export default SOBUpload;