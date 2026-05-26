import { DownloadOutlined, EllipsisOutlined, } from "@ant-design/icons";
import { Dropdown, Pagination, Space, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { UiButton, UiCounterBatch, UiRangePicker, UiSelect } from "../../../components";

import { DownloadOptions, handleDownloadExcel, REPORT_CHILD_COLUMN, REPORTS_TABLE_COLUMNS, reportTypeDateOptions, reportTypeOptions } from "./config";
import { DispatchPrint } from "./reportPdf";
import { useQuery } from "@tanstack/react-query";
import * as api from "../../../actions";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { CSLBASEURL, REPORTBASEURL } from "../../../apiservices/endpoints";
import dayjs from "dayjs";
import { showToast } from "../../../components/UiToastNotification";

const PrintDispatchPDF = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <DispatchPrint tableData={props?.tableData} filters={props?.filters} cumulativeData={props?.cumulativeData} />
    </div>
));

export const ReportScreen = () => {

    const tableRef = useRef(null);
    const dispatch = useDispatch();

    const [filters, setFilters] = useState({
        reportType: "NOT_AUDIT",
        dateRange: [],
        crNo: "",
        finNo: "",
        partNo: "",
        weekNo: null,
        page: 0,
        size: 25,
        datePickerStatus: "NOT_AUDIT",
    });
    const [isFetchApiCall, setIsFetchApiCall] = useState(false);
    const [tableData, setTableData] = useState({});
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [pdfSource, setPdfSource] = useState({});
    const [cumulativeData, setCumulativeData] = useState({});
    const [dropDownSource, setDropDownSource] = useState({ crNumbers: [], fimNumbers: [], partNos: [], weekNos: [] });
    const [selectDownloadOption, setSelectDownloadOption] = useState({ key: "1", content: "EXL" });

    const { isFetching: isFetchingGetAllReportsPage, refetch: refetchAllReportsPage } = useQuery(["GET_ALL_REPORTS_PAGE", ""],
        () => {
            const pageAndSize = `?page=${filters?.page}&size=${filters?.size}`;
            const crNumber = filters?.crNo ? `&crNumber=${filters?.crNo}` : "";
            const fimNumber = filters?.finNo ? `&fimNumber=${filters?.finNo}` : "";
            const partNo = filters?.partNo ? `&partNo=${filters?.partNo}` : "";
            const weekNo = filters?.weekNo ? `&weekNo=${filters?.weekNo}` : "";
            const status = filters?.reportType ? `&status=${filters?.reportType}` : "";
            let startAndEndDate = "";
            if (filters?.datePickerStatus === "NOT_AUDIT") {
                startAndEndDate = filters?.dateRange?.length > 0 ? `&startDate=${dayjs(filters?.dateRange?.[0])?.format("YYYY-MM-DD")}&endDate=${dayjs(filters?.dateRange?.[1])?.format("YYYY-MM-DD")}` : "";
            } else if (filters?.datePickerStatus === "AUDIT") {
                startAndEndDate = filters?.dateRange?.length > 0 ? `&auditFromDate=${dayjs(filters?.dateRange?.[0])?.format("YYYY-MM-DD")}&auditToDate=${dayjs(filters?.dateRange?.[1])?.format("YYYY-MM-DD")}` : "";
            } else if (filters?.datePickerStatus === "DISPATCH") {
                startAndEndDate = filters?.dateRange?.length > 0 ? `&dispatchFromDate=${dayjs(filters?.dateRange?.[0])?.format("YYYY-MM-DD")}&dispatchToDate=${dayjs(filters?.dateRange?.[1])?.format("YYYY-MM-DD")}` : "";
            }
            return api.get(`${REPORTBASEURL}${pageAndSize}${crNumber}${fimNumber}${partNo}${weekNo}${status}${startAndEndDate}`)
        }, {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: getAllReportsResponse => {
            if (getAllReportsResponse?.statusCode === 200) {
                const reportSource = getAllReportsResponse?.result?.report || {};
                setTableData(reportSource?.cslDetailInfoResponsePage);
                setCumulativeData(reportSource?.cumulativeData || {});
            } else {
                showToast.error("Error", getAllReportsResponse?.response?.data?.error);
            }
        },
    }
    );

    const { isFetching: isFetchingGetAllReports, refetch: refetchAllReports } = useQuery(["GET_ALL_REPORTS", ""],
        () => {
            const pageAndSize = `?page=${filters?.page}&size=${-1}`;
            const crNumber = filters?.crNo ? `&crNumber=${filters?.crNo}` : "";
            const fimNumber = filters?.finNo ? `&fimNumber=${filters?.finNo}` : "";
            const partNo = filters?.partNo ? `&partNo=${filters?.partNo}` : "";
            const weekNo = filters?.weekNo ? `&weekNo=${filters?.weekNo}` : "";
            const status = filters?.reportType ? `&status=${filters?.reportType}` : "";
            const startAndEndDate = filters?.dateRange?.length > 0 ? `&startDate=${dayjs(filters?.dateRange?.[0])?.format("YYYY-MM-DD")}&endDate=${dayjs(filters?.dateRange?.[1])?.format("YYYY-MM-DD")}` : "";
            return api.get(`${REPORTBASEURL}${pageAndSize}${crNumber}${fimNumber}${partNo}${weekNo}${status}${startAndEndDate}`)
        }, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: getAllReportsResponse => {
            if (getAllReportsResponse?.statusCode === 200) {
                const reportSource = getAllReportsResponse?.result?.report || [];
                setPdfSource(reportSource?.cslDetailInfoResponsePage);
                setCumulativeData(reportSource?.cumulativeData || {});
            } else {
                showToast.error("Error", getAllReportsResponse?.response?.data?.error);
            }
        },
    }
    );

    const { isFetching: isFetchinngGetDropdown, refetch: refetchGetAllDropdown } = useQuery(["GET_ALL_DROPDOWNS", ""], () => {
        const crNumber = filters?.crNo ? `&crNumber=${filters?.crNo}` : "";
        const fimNumber = filters?.finNo ? `&fimNumber=${filters?.finNo}` : "";
        const partNo = filters?.partNo ? `&partNo=${filters?.partNo}` : "";
        const weekNo = filters?.weekNo ? `&weekNo=${filters?.weekNo}` : "";
        const status = filters?.reportType ? `&status=${filters?.reportType}` : "";
        const startAndEndDate = filters?.dateRange?.length > 0 ? `&startDate=${dayjs(filters?.dateRange?.[0])?.format("YYYY-MM-DD")}&endDate=${dayjs(filters?.dateRange?.[1])?.format("YYYY-MM-DD")}` : "";
        return api.get(`${CSLBASEURL}/report_filter_details?${crNumber}${fimNumber}${partNo}${weekNo}${status}${startAndEndDate}`)
    }, {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: getAllDropdownResponse => {
            if (getAllDropdownResponse?.statusCode === 200) {
                const filterDetails = getAllDropdownResponse?.result?.filterDetails || {};
                const convertOption = list => list?.map(listValue => ({
                    key: listValue,
                    value: listValue,
                    label: listValue
                }));
                setDropDownSource(prev => ({
                    crNumbers: !filters?.crNo ? convertOption(filterDetails?.crNumbers || []) : prev?.crNumbers,
                    fimNumbers: !filters?.finNo ? convertOption(filterDetails?.fimNumbers || []) : prev?.fimNumbers,
                    partNos: !filters?.partNo ? convertOption(filterDetails?.partNos || []) : prev?.partNos,
                    weekNos: convertOption(filterDetails?.weekNos || []),
                }));
            } else {
                showToast.error("Error", getAllDropdownResponse?.response?.data?.error?.message || getAllDropdownResponse?.response?.data?.error);
            }
        },
    })

    const handleFilter = (fieldName, fieldValue) => {
        setFilters(prev => ({
            ...prev,
            [fieldName]: fieldValue,
            ...(fieldName === "reportType" ? { crNo: "", finNo: "", partNo: "", weekNo: null, datePickerStatus: fieldValue } : {}),
            ...(fieldName === "dateRange" ? { crNo: "", finNo: "", partNo: "", weekNo: null } : {}),
            ...(fieldName === "crNo" ? { finNo: "", partNo: "", weekNo: null } : {}),
            ...(fieldName === "finNo" ? { partNo: "", weekNo: null } : {}),
            ...(fieldName === "partNo" ? { weekNo: null } : {}),
            page: 0,
            size: 25
        }));
        setIsFetchApiCall(true);
    };

    const onMenuClick = dropClick => {
        setSelectDownloadOption({ key: dropClick?.key, content: DownloadOptions?.find(findKey => findKey?.key === dropClick?.key)?.label });
    };

    const handlePagination = (pages, size) => {
        setFilters(prev => ({ ...prev, page: pages - 1, size: size, }));
        setIsFetchApiCall(true);
    };

    const filterDatePickerDropdownSource = status => {
        if (status === "NOT_AUDIT") return reportTypeDateOptions?.filter(dateKey => dateKey?.key === "NOT_AUDIT");
        if (status === "AUDIT") return reportTypeDateOptions?.filter(dateKey => dateKey?.key !== "DISPATCH");
        return reportTypeDateOptions;
    };

    const handlePrint = useReactToPrint({
        content: () => tableRef.current,
        documentTitle: "Reports",
        onAfterPrint: () => {
            setPdfSource({});
        },
        pageStyle: `
        @page {
            size: A4 landscape;
            margin: 8mm;
        }
        body {
            margin: 0;
            padding: 0;
        }
    `
    });

    useEffect(() => {
        if (pdfSource?.content?.length > 0) {
            if (selectDownloadOption?.content === "EXL") {
                handleDownloadExcel({ tableData: pdfSource, setTableData: setPdfSource });
            } else {
                handlePrint();
            }
        }
    }, [pdfSource?.content?.length, handlePrint, selectDownloadOption, pdfSource]);

    useEffect(() => {
        if (!isFetchApiCall) return;
        refetchGetAllDropdown();
    }, [refetchGetAllDropdown, isFetchApiCall, filters?.crNo, filters?.finNo, filters?.reportType, filters?.partNo, filters?.dateRange?.[0], filters?.dateRange?.[1]]);

    useEffect(() => {
        if (!isFetchApiCall) return;
        refetchAllReportsPage();
    }, [filters, refetchAllReportsPage, isFetchApiCall]);

    useEffect(() => {
        let isLoading = isFetchingGetAllReportsPage || isFetchingGetAllReports || isFetchinngGetDropdown;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingGetAllReportsPage, isFetchingGetAllReports, isFetchinngGetDropdown]);

    return (
        <div className="report-page">
            <div className="report-header">
                <div className="flexible" style={{ padding: 0, margin: 0 }}>
                    <div className="flexible-start" style={{ padding: 0, margin: 0, width: "20%" }}>
                        <h3 style={{ padding: 0, margin: 0 }}>
                            Reports
                        </h3>
                        <UiCounterBatch primary>
                            {tableData?.totalElements || 0}
                        </UiCounterBatch>
                    </div>
                    <div className="info-container">
                        <div className="info-box">
                            <p className="title">Total CR:</p>
                            <p className="value">{cumulativeData?.totalCrNumbers ?? 0}</p>
                        </div>

                        <div className="info-box">
                            <p className="title">Total FIM:</p>
                            <p className="value">{cumulativeData?.totalParentNumbers ?? 0}</p>
                        </div>

                        <div className="info-box">
                            <p className="title">Total SubParts:</p>
                            <p className="value">{cumulativeData?.totalSubPartNumbers ?? 0}</p>
                        </div>

                        <div className="info-box">
                            <p className="title">Total Quantity:</p>
                            <p className="value">{cumulativeData?.totalQty ?? 0}</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "end", marginTop: "10px", marginBottom: "10px", }} >
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                        <UiSelect
                            allowClear={false}
                            options={reportTypeOptions}
                            isStyle={true}
                            style={{ width: "130px" }}
                            placeholder="Report Type"
                            value={filters?.reportType || null}
                            onChange={(selectValue) => handleFilter("reportType", selectValue)}
                        />
                        <UiSelect
                            allowClear={false}
                            options={filterDatePickerDropdownSource(filters?.reportType)}
                            isStyle={true}
                            style={{ width: "130px" }}
                            placeholder="Report Type"
                            value={filters?.datePickerStatus || null}
                            onChange={(selectValue) => handleFilter("datePickerStatus", selectValue)}
                        />
                        <UiRangePicker
                            style={{ width: "170px" }}
                            value={filters?.dateRange?.length > 0 ? filters?.dateRange : []}
                            onChange={date => handleFilter("dateRange", (date?.length > 0 ? date : []))} />
                        <UiSelect
                            isStyle={true}
                            options={dropDownSource?.crNumbers}
                            style={{ width: "130px" }}
                            placeholder="CR No"
                            value={filters?.crNo || ""}
                            onChange={(fileldValue) =>
                                handleFilter("crNo", fileldValue)
                            }
                        />
                        <UiSelect
                            isStyle={true}
                            options={dropDownSource?.fimNumbers}
                            style={{ width: "130px" }}
                            placeholder="FIM No"
                            value={filters?.finNo || ""}
                            onChange={(fileldValue) =>
                                handleFilter("finNo", fileldValue)
                            }
                        />
                        <UiSelect
                            isStyle={true}
                            options={dropDownSource?.partNos}
                            style={{ width: "130px" }}
                            placeholder="Part No"
                            value={filters?.partNo || ""}
                            onChange={(fileldValue) =>
                                handleFilter("partNo", fileldValue)
                            }
                        />
                        <UiSelect
                            isStyle={true}
                            options={dropDownSource?.weekNos}
                            style={{ width: "130px" }}
                            placeholder="Week No"
                            value={filters?.weekNo || null}
                            onChange={(fileldValue) =>
                                handleFilter("weekNo", fileldValue)
                            }
                        />
                        {tableData?.totalElements > 0 && <Space.Compact>
                            <UiButton
                                icon={<DownloadOutlined />}
                                type="primary"
                                onClick={refetchAllReports}
                            >
                                {selectDownloadOption?.content || "-"}
                            </UiButton>
                            <Dropdown menu={{ items: DownloadOptions, onClick: onMenuClick, activeKey: selectDownloadOption?.key }} placement="bottomRight">
                                <UiButton type="primary" icon={<EllipsisOutlined />} />
                            </Dropdown>
                        </Space.Compact>}
                    </div>
                </div>
            </div>
            <div className="report-body ">
                <Table
                    className="ChangeTablePadding"
                    columns={REPORTS_TABLE_COLUMNS}
                    dataSource={tableData?.content}
                    pagination={false}
                    rowKey={"cslDetailInfoId"}
                    expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            if (expanded) {
                                setExpandedRowKeys(prev => [
                                    ...prev,
                                    record?.cslDetailInfoId,
                                ]);
                            } else {
                                setExpandedRowKeys(prev =>
                                    prev?.filter(key => key !== record?.cslDetailInfoId)
                                );
                            }
                        },
                        expandedRowRender: (record) => {
                            return (
                                <Table
                                    className="ChangeTablePadding"
                                    dataSource={record?.partDetails || []}
                                    pagination={false}
                                    columns={REPORT_CHILD_COLUMN}
                                />)
                        }
                    }}
                />
            </div>
            <div className="report-footer">
                <Pagination
                    onChange={handlePagination}
                    current={filters?.page + 1}
                    total={tableData?.totalElements || 0}
                    pageSize={filters?.size}
                    pageSizeOptions={[25, 50, 75, 100]}
                    showSizeChanger
                />
            </div>
            <div style={{ display: "none", width: "100%" }}>
                <PrintDispatchPDF
                    ref={tableRef}
                    tableData={pdfSource}
                    cumulativeData={cumulativeData}
                    filters={filters}
                />
            </div>
        </div>
    );
};