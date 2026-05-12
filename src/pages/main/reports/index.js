import { DownloadOutlined, } from "@ant-design/icons";
import { Select, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { UiButton, UiCounterBatch, UiRangePicker, UiSelect, UiTextBox, } from "../../../components";

import { REPORT_CHILD_COLUMN, REPORTS_TABLE_COLUMNS, reportTypeOptions } from "./config";
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
        <DispatchPrint tableData={props?.tableData} filters={props?.filters} />
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
    });
    const [isFetchApiCall, setIsFetchApiCall] = useState(false);
    const [tableData, setTableData] = useState({});
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [pdfSource, setPdfSource] = useState({});
    const [dropDownSource, setDropDownSource] = useState({ crNumbers: [], fimNumbers: [], partNos: [], weekNos: [] });

    const { isFetching: isFetchingGetAllReportsPage, refetch: refetchAllReportsPage } = useQuery(["GET_ALL_REPORTS_PAGE", ""],
        () => {
            const pageAndSize = `?page=${filters?.page}&size=${filters?.size}`;
            const crNumber = filters?.crNo ? `&crNumber=${filters?.crNo}` : "";
            const fimNumber = filters?.finNo ? `&fimNumber=${filters?.finNo}` : "";
            const partNo = filters?.partNo ? `&partNo=${filters?.partNo}` : "";
            const weekNo = filters?.weekNo ? `&weekNo=${filters?.weekNo}` : "";
            const status = filters?.reportType ? `&status=${filters?.reportType}` : "";
            const startAndEndDate = filters?.dateRange?.length > 0 ? `&startDate=${dayjs(filters?.dateRange?.[0])?.format("YYYY-MM-DD")}&endDate=${dayjs(filters?.dateRange?.[1])?.format("YYYY-MM-DD")}` : "";
            return api.get(`${REPORTBASEURL}${pageAndSize}${crNumber}${fimNumber}${partNo}${weekNo}${status}${startAndEndDate}`)
        }, {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: getAllReportsResponse => {
            if (getAllReportsResponse?.statusCode === 200) {
                const reportSource = getAllReportsResponse?.result?.report || [];
                setTableData(reportSource);
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
                setPdfSource(reportSource);
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
            }
        },
    })

    const handleFilter = (fieldName, fieldValue) => {
        setFilters(prev => ({
            ...prev,
            [fieldName]: fieldValue,
            page: 0,
            size: 25
        }));
        setIsFetchApiCall(true);
    };

    const handlePagination = (pages, size) => {
        setFilters(prev => ({ ...prev, page: pages - 1, size: size, }));
        setIsFetchApiCall(true);
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
            handlePrint();
        }
    }, [pdfSource?.content?.length]);

    useEffect(() => {
        if (!isFetchApiCall) return;
        refetchGetAllDropdown();
    }, [refetchGetAllDropdown, isFetchApiCall, filters?.crNo, filters?.finNo, filters?.partNo]);

    useEffect(() => {
        if (!isFetchApiCall) return;
        refetchAllReportsPage();
    }, [filters, refetchAllReportsPage, isFetchApiCall]);

    useEffect(() => {
        let isLoading = isFetchingGetAllReportsPage || isFetchingGetAllReports || isFetchinngGetDropdown;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingGetAllReportsPage, isFetchingGetAllReports, isFetchinngGetDropdown]);


    return (
        <div>
            <div className="flexible-start" style={{ padding: 0, margin: 0 }}>
                <h3 style={{ padding: 0, margin: 0 }}>
                    Reports
                </h3>
                <UiCounterBatch primary>
                    {tableData?.length || 0}
                </UiCounterBatch>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", marginBottom: "10px", }} >
                <div style={{ display: "flex", alignItems: "center", gap: "2px", }}>
                    <UiSelect
                        allowClear={false}
                        options={reportTypeOptions}
                        isStyle={true}
                        style={{ width: "130px" }}
                        placeholder="Report Type"
                        value={filters?.reportType || null}
                        onChange={(selectValue) => handleFilter("reportType", selectValue)}
                    />
                    <UiRangePicker value={filters?.dateRange?.length > 0 ? filters?.dateRange : []} onChange={date => handleFilter("dateRange", (date?.length > 0 ? date : []))} />
                    <UiSelect
                        isStyle={true}
                        options={dropDownSource?.crNumbers}
                        style={{ width: "150px" }}
                        placeholder="CR no"
                        value={filters?.crNo || ""}
                        onChange={(fileldValue) =>
                            handleFilter("crNo", fileldValue)
                        }
                    />
                    <UiSelect
                        isStyle={true}
                        options={dropDownSource?.fimNumbers}
                        style={{ width: "150px" }}
                        placeholder="FIN no"
                        value={filters?.finNo || ""}
                        onChange={(fileldValue) =>
                            handleFilter("finNo", fileldValue)
                        }
                    />
                    <UiSelect
                        isStyle={true}
                        options={dropDownSource?.partNos}
                        style={{ width: "150px" }}
                        placeholder="Part no"
                        value={filters?.partNo || ""}
                        onChange={(fileldValue) =>
                            handleFilter("partNo", fileldValue)
                        }
                    />
                    <UiSelect
                        isStyle={true}
                        options={dropDownSource?.weekNos}
                        style={{ width: "150px" }}
                        placeholder="Week no"
                        value={filters?.weekNo || null}
                        onChange={(fileldValue) =>
                            handleFilter("weekNo", fileldValue)
                        }
                    />
                    <UiButton
                        icon={<DownloadOutlined />}
                        type="primary"
                        onClick={refetchAllReports}
                    >
                        Export
                    </UiButton>
                </div>
            </div>
            <div>
                <Table
                    columns={REPORTS_TABLE_COLUMNS}
                    dataSource={tableData?.content}
                    scroll={{ x: 1500 }}
                    pagination={{
                        onChange: handlePagination,
                        current: filters?.page + 1,
                        total: tableData?.totalElements || 0,
                        pageSize: filters?.size,
                        pageSizeOptions: [20, 50, 75, 100]
                    }}
                    rowKey={"cslDetailInfoId"}
                    expandable={{
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            if (expanded) {
                                setExpandedRowKeys(prev => [
                                    ...prev,
                                    record.cslDetailInfoId,
                                ]);

                            } else {
                                setExpandedRowKeys(prev =>
                                    prev.filter(key => key !== record.cslDetailInfoId)
                                );
                            }
                        },
                        expandedRowRender: (record) => {
                            return (
                                <Table
                                    dataSource={record?.partDetails || []}
                                    pagination={false}
                                    columns={REPORT_CHILD_COLUMN}
                                />)
                        }
                    }}
                />
            </div>
            <div style={{ display: "none", width: "100%" }}>
                <PrintDispatchPDF
                    ref={tableRef}
                    tableData={pdfSource}
                    filters={filters}
                />
            </div>
        </div>
    );
};