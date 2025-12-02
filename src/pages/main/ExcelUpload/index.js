import React, { useEffect, useRef, useState } from "react";
import { UiButton, UiFileUploader, UiRangePicker, UiSearchBox, UiTable } from "../../../components";
import './style.scss';
import { ExcelUploadTaleColumn } from "./config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import * as api from "../../../actions"
import { handleDownload, searchInitiateDelayTime } from "../../../utils/appUtils";
import dayjs from "dayjs";
import { KITTING } from "../../../apiservices/endpoints";
import { showToast } from "../../../components/UiToastNotification";

export const ExcelUpload = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const debounceTimeOut = useRef(null);

    const [crExcelDetails, setCrExcelDetails] = useState({});
    const [filterValue, setFilterValue] = useState({ page: 0, size: 25, searchValue: "", fromDate: "", toDate: "" });
    const [dateFilter, setDateFilter] = useState(null);
    const [isValidate, setIsValidate] = useState(false);
    const [barCodeKittingAllData, setBarCodeKittingAllData] = useState({});
    const [selectedDetails, setSelectedDetails] = useState({});

    const getAllCrExcels = (details) => api.get(`${KITTING}/get-by-page?page=${details?.page}&size=${details?.size}${details?.searchValue ? `&commonSearch=${details?.searchValue}` : ""}${details?.fromDate && details?.toDate ? `&fromDate=${details?.fromDate}&toDate=${details?.toDate}` : ""}`);
    const uploadExcel = (file) => api.patch(`${KITTING}/file-upload`, file);
    const getExcelDownload = (id) => api.get(`${KITTING}/download-file/${id}`);

    const { isFetching: isFetchCrExcel, refetch: fetchAllCrExcels } = useQuery(["", filterValue?.page, filterValue?.size, filterValue?.searchValue, filterValue?.fromDate, filterValue?.toDate], () => getAllCrExcels(filterValue), {
        enabled: Boolean(filterValue?.page || filterValue?.size || filterValue?.searchValue || (filterValue?.fromDate && filterValue?.toDate)),
        onSuccess: (crResponse) => {
            if (crResponse?.statusCode) {
                setBarCodeKittingAllData(crResponse?.result?.barCodeKittings);
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
            } else {
                showToast.error("Error", uploadResponse?.response?.data?.error?.message);
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
        handleDownload({url:`${KITTING}/download-file/${details?.fileName}`, name: details?.fileName});
    };

    const handlePagination = (page, size) => {
        setFilterValue((prev) => ({ ...prev, page: page - 1, size: size }));
    };

    const handleUploadExcel = async () => {
        const payload = new FormData();
        payload.append("file", crExcelDetails?.excel);
        queryClient.prefetchQuery(["UPLOAD_EXCEL", ""], () => uploadExcel(payload));
    };

    useEffect(() => {
        let isValid = crExcelDetails?.excel?.name;
        setIsValidate(Boolean(isValid));
    }, [crExcelDetails]);

    useEffect(() => {
        let isLoading = isFetchCrExcel || isFetchExcelDownload || isFetchUploadingExcel;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchCrExcel, isFetchExcelDownload, isFetchUploadingExcel]);

    return (
        <>
            <div className="excel-header">
                <h3>Excel Upload</h3>
                <div className="excel-header-controls">
                    <UiRangePicker value={dateFilter} onChange={(date) => handleChangeDate(date)} />
                    <UiSearchBox style={{ width: "300px" }} handleSearch={handleSearch} />
                </div>
            </div>

            <div className="excel-container">
                <div className="excel-left">
                    <UiFileUploader onFileSelect={(file) => handleChangeFieldValue(file, "excel")} />
                    <div className="submit-area">
                        <UiButton
                            disabled={!isValidate}
                            style={{ width: "100%" }}
                            size="large"
                            type="primary"
                            onClick={handleUploadExcel}
                        >
                            Submit
                        </UiButton>
                    </div>
                </div>
                <div className="excel-right">
                    <UiTable
                        columns={ExcelUploadTaleColumn({ handleDownloadFile })}
                        dataSource={barCodeKittingAllData?.content ?? []}
                        pagination={{
                            pageSize: filterValue?.size,
                            current: filterValue?.page + 1,
                            pageSizeOptions: [25, 50, 75, 100],
                            showSizeChanger: true,
                            total: barCodeKittingAllData?.totalElements,
                            onChange: (page, size) => handlePagination(page, size),
                        }}
                    />
                </div>
            </div>
        </>
    );

};