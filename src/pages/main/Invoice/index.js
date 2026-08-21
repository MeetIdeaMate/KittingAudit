import { UiButton, UiDatePicker, UiModal, UiRangePicker, UiSearchBox, UiSelect, UiTab, UiTable, UiTextBox } from "../../../components";
import "./style.scss";
import * as api from "../../../actions";
import { CONFIG, CSLBASEURL } from "../../../apiservices/endpoints";
import { useEffect, useRef, useState } from "react";
import { INVOICE_COLUMN_HEADER, tabData } from "./config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchInitiateDelayTime, tablePageSizeOptions } from "../../../utils/appUtils";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { Pagination } from "antd";
import { isEmptyArray } from "formik";
import { flotButton } from "../../../assets/images";
import dayjs from "dayjs";
import { showToast } from "../../../components/UiToastNotification";
import { REPORT_CHILD_COLUMN } from "../reports/config";
const Invoice = () => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const debounceTimeOut = useRef(null);

    const [filteredData, setFilteredData] = useState({ page: 0, size: 25, activeTab: "PENDING", activeKey: "1", crNumber: [], fimNumber: "", fromDate: "", toDate: "", searchTermvalue: "", searchFiltervalue: "", type: "", typeValue: "" });
    const [invioceBoolean, setInvoiceBoolean] = useState({ isSelectRow: false, isOpenInVoiceModel: false });
    const [filterDataList, setFilterDateList] = useState({ crNumber: [], fimNumber: [] });
    const [invoiceDetails, setIvoiceDetails] = useState({});
    const [newSelectedRowKey, setNewSelectedRowKey] = useState([]);
    const [excelTypeList, setExcelTypeList] = useState([]);
    const [invoiceInformation, setInvoiceInformation] = useState({
        invoiceNo: "",
        date: "",
        invoiceAmount: "",
        cslDetailInfoIds: []
    });

    const getAllInVoice = (page, size, status, crNumber, fimNumber, searchvalue, fromDate, toDate, type) => api.get(`${CSLBASEURL}/invoice_details?page=${page}&size=${size}${status ? `&invoiceStatus=${status}` : ""}${crNumber?.length > 0 ? `&crNumber=${crNumber.join(",")}` : ""}${fimNumber ? `&fimNumber=${fimNumber}` : ""}${searchvalue ? `&invoiceNoSearch=${searchvalue}` : ""}${fromDate && toDate ? `&invoiceStartDate=${fromDate}&invoiceEndDate=${toDate}` : ""}${type ? `&type=${type}` : ""}`);
    const updateInvoiceDetails = (payload) => api.patch(`${CSLBASEURL}/update_invoice_no`, payload)

    const { refetch: fetcAllInvoice, isFetching: isFetchingAllInvoice } = useQuery(["FETCH_ALL_INVOICE", filteredData?.page, filteredData?.size, filteredData?.activeTab, filteredData?.crNumber, filteredData?.fimNumber, filteredData?.searchTermvalue, filteredData?.fromDate, filteredData?.toDate, filteredData?.type],
        () => getAllInVoice(filteredData?.page, filteredData?.size, filteredData?.activeTab, filteredData?.crNumber, filteredData?.fimNumber, filteredData?.searchTermvalue, filteredData?.fromDate, filteredData?.toDate, filteredData?.type), {
        onSuccess: (invoiceResponse) => {
            if (invoiceResponse?.statusCode === 200) {
                setIvoiceDetails(invoiceResponse?.result?.invoiceDetails);
            }
        },
        enabled: Boolean(filteredData?.page || filteredData?.size || filteredData?.activeTab || filteredData?.crNumber?.length > 0 || filteredData?.fimNumber || filteredData?.searchTermvalue || filteredData?.fromDate || filteredData?.toDate || filteredData?.type),
        refetchOnWindowFocus: false
    });

    const { isFetching: isFetchingUpdateInvoice } = useQuery(["UPDATE_INVOICE_DETAIL", ""], updateInvoiceDetails, {
        onSuccess: (updateResponse) => {
            if (updateResponse?.status === 200) {
                showToast.success("Success", updateResponse?.data?.result?.updateInvoiceNo);
                setInvoiceBoolean((prev) => ({ ...prev, isOpenInVoiceModel: false }));
                fetcAllInvoice();
                setNewSelectedRowKey([]);
                setInvoiceInformation({});
                setInvoiceBoolean((prev) => ({ ...prev, isSelectRow: false }));
            }
            else {
                showToast.error("Error", updateResponse?.message);
            }
        },
        enabled: false,
        refetchOnWindowFocus: false
    });

    useQuery(
        ["GET_CR_NUMBERS_DETAILS", filteredData?.crNumber],
        () => api.get(`${CSLBASEURL}/get_csl_details${filteredData?.crNumber?.length > 0 ? `?crNumber=${filteredData?.crNumber?.join(",")}` : ""}`),
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onSuccess: (crNumberResponse) => {
                if (crNumberResponse?.statusCode === 200) {
                    const cslDetails = crNumberResponse?.result?.cslDetails || [];
                    const source = cslDetails?.map(csl => ({ key: csl, value: csl }));
                    if (filteredData?.crNumber?.length === 0) {
                        setFilterDateList((prev) => ({ ...prev, crNumber: source }));
                    } else {
                        setFilterDateList((prev) => ({ ...prev, fimNumber: source }));
                    }
                } else {
                    showToast.error("Error", crNumberResponse?.response?.data?.error?.message);
                }
            },
        }
    );

    useQuery(["FETCH_CONFIG", ""], () => api.get(`${CONFIG}/ExcelType`), {
        onSuccess: (configResponse) => {
            const options = configResponse?.configuration?.map((type) => ({
                key: type,
                value: type
            }));
            setExcelTypeList(options);
        },
        enabled: true,
        refetchOnWindowFocus: false
    });

    const handleTabChange = (key) => {
        tabData?.forEach((tab) => {
            if (tab?.key === key) {
                setFilteredData((prev) => ({ ...prev, page: 0, size: 25, activeTab: tab?.content, activeKey: tab?.key, crNumber: [], fimNumber: "", typeValue: "" }));
                setNewSelectedRowKey([]);
                setInvoiceInformation({});
                setInvoiceBoolean((prev) => ({ ...prev, isSelectRow: false }));
            }
        });
    };

    const handlePagination = (page, size) => {
        setFilteredData((prev) => ({ ...prev, page: page - 1, size: size }));
    };

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        setNewSelectedRowKey(newSelectedRowKeys);
        setInvoiceBoolean((prev) => ({ ...prev, isSelectRow: !isEmptyArray(newSelectedRowKeys) }));
    };

    const rowSelection = {
        selectedRowKeys: newSelectedRowKey,
        onChange: onSelectChange,
    };

    const handleOpenInVoiceDetail = () => {
        setInvoiceBoolean((prev) => ({ ...prev, isOpenInVoiceModel: true }));
    };

    const handlCloseInvoiveModel = () => {
        setInvoiceBoolean((prev) => ({ ...prev, isOpenInVoiceModel: false }));
    };

    const handleChange = (fieldValue, fieldName) => {
        setInvoiceInformation((prev) => ({ ...prev, [fieldName]: fieldValue }));
    };

    const handleSubmit = () => {
        const payload = {
            invoiceNo: invoiceInformation?.invoiceNo,
            date: invoiceInformation?.date,
            invoiceAmount: parseFloat(invoiceInformation?.invoiceAmount),
            cslDetailInfoIds: newSelectedRowKey,
        };
        queryClient.prefetchQuery(["UPDATE_INVOICE_DETAIL", ""], () => updateInvoiceDetails(payload));
    };

    const debounceSearch = (searchvalue) => {
        if (debounceTimeOut.current) {
            clearTimeout(debounceTimeOut.current);
        }
        if (searchvalue !== "") {
            debounceTimeOut.current = setTimeout(() => {
                setFilteredData((prev) => ({ ...prev, searchTermvalue: searchvalue, page: 0, size: 25 }));
            }, searchInitiateDelayTime);
        } else {
            setFilteredData((prev) => ({ ...prev, searchTermvalue: "", page: 0, size: 25 }));
        }
    };

    const handlSearch = (value) => {
        setFilteredData((prev) => ({ ...prev, searchFiltervalue: value, searchTermvalue: value }));
        debounceSearch(value);
    };

    const handleRangeChange = (dates) => {
        if (dates && dates?.length === 2) {
            setFilteredData((prev) => ({
                ...prev,
                fromDate: dayjs(dates[0]).format("YYYY-MM-DD"),
                toDate: dayjs(dates[1]).format("YYYY-MM-DD"),
                page: 0,
                size: 25,
            }));
        } else {
            setFilteredData((prev) => ({
                ...prev,
                fromDate: "",
                toDate: "",
                page: 0,
                size: 25,
            }));
        }
    };

    const handleCrNumberChange = (value) => {
        setFilteredData((prev) => ({ ...prev, crNumber: value, fimNumber: "", page: 0, size: 25 }));
        setFilterDateList((prev) => ({ ...prev, fimNumber: [] }));
    };

    const handleFimNumberChange = (value) => {
        setFilteredData((prev) => ({ ...prev, fimNumber: value, page: 0, size: 25 }));
    };

    const handleChangeExcelType = (value) => {
        setFilteredData((prev) => ({ ...prev, type: value, typeValue: value, page: 0, size: 25 }));
    };

    useEffect(() => {
        let isLoading = isFetchingAllInvoice;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingAllInvoice]);

    return <>
        <div className="invoice-page">
            <div className="invoice-header">
                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <div className="invoice-title">
                        <h2 style={{ padding: 0, margin: 0 }}>Invoice</h2>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                        {filteredData?.activeTab === "PENDING" && (
                            <div className="invoice-filter">
                                <UiSelect
                                    style={{ width: "150px" }}
                                    options={filterDataList?.crNumber}
                                    placeholder="Select CR Number"
                                    value={filteredData?.crNumber}
                                    onChange={handleCrNumberChange}
                                    mode="multiple"
                                    allowClear
                                    isStyle={true}
                                />
                                <UiSelect
                                    style={{ width: "150px" }}
                                    options={filterDataList?.fimNumber}
                                    placeholder="Select FIM Number"
                                    value={filteredData?.fimNumber}
                                    onChange={handleFimNumberChange}
                                    allowClear
                                    isStyle={true}
                                    disabled={filteredData?.crNumber?.length === 0}
                                />
                            </div>
                        )}
                        {
                            filteredData?.activeTab === "COMPLETED" && <div className="invoice-filter">
                                <UiRangePicker onChange={handleRangeChange}
                                    value={[
                                        filteredData?.fromDate ? dayjs(filteredData?.fromDate) : null,
                                        filteredData?.toDate ? dayjs(filteredData?.toDate) : null,
                                    ]} />
                                <UiSearchBox placeholder={"Search Invoice No"} handleSearch={handlSearch} value={filteredData?.searchFiltervalue} />
                            </div>
                        }
                    </div>
                </div>
                <UiTab count={invoiceDetails?.totalElements} tabs={tabData} activeTabKey={filteredData?.activeKey} onChange={handleTabChange} />
            </div>
            <div className="invoice-body">
                <UiTable
                    className='ChangeTableInvoicePadding'
                    dataSource={invoiceDetails?.content || []}
                    columns={INVOICE_COLUMN_HEADER({ activeTab: filteredData?.activeTab })}
                    rowSelection={filteredData?.activeTab === "PENDING" ? rowSelection : null}
                    pagination={false}
                    rowKey="cslDetailInfoId"
                    expandable={{
                        expandedRowRender: (record) => {
                            return (
                                <UiTable
                                    dataSource={record?.partDetails || []}
                                    pagination={false}
                                    columns={REPORT_CHILD_COLUMN}
                                />)
                        },
                        rowExpandable: (record) => record.cslDetailInfoId != null,
                    }}
                />
            </div>
            <div className="invoice-footer">
                <Pagination
                    onChange={handlePagination}
                    current={filteredData?.page + 1}
                    total={invoiceDetails?.totalElements || 0}
                    pageSize={filteredData?.size}
                    pageSizeOptions={tablePageSizeOptions}
                    showSizeChanger
                />
            </div>
            {
                invioceBoolean?.isSelectRow && <div>
                    <div className="ivoice-floting-button" onClick={handleOpenInVoiceDetail}>
                        <img src={flotButton} alt="" />
                    </div>
                </div>
            }
            {
                invioceBoolean?.isOpenInVoiceModel && <UiModal
                    open={invioceBoolean?.isOpenInVoiceModel}
                    onClose={handlCloseInvoiveModel}
                    onCancel={handlCloseInvoiveModel}
                    title={"Invoice Details"}
                    maskClosable={false}
                    footer={<div style={{ display: "flex", justifyContent: "right", gap: "10px" }}>
                        <UiButton size="large" onClick={handlCloseInvoiveModel}>Cancel</UiButton>
                        <UiButton size="large" type="primary" isLoading={isFetchingUpdateInvoice} onClick={handleSubmit}>Submit</UiButton>
                    </div>}
                >
                    <div style={{ padding: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <label>Invoice No <span style={{ color: "red" }}>*</span></label>
                                <UiTextBox placeholder={"Enter Invoice Number"} name="invoiceNo" onChange={(event) => handleChange(event?.target?.value, "invoiceNo")} />
                            </div>
                            <div>
                                <label> Select Invoice Date <span style={{ color: "red" }}>*</span></label>
                                <UiDatePicker name="date" onChange={(date) => handleChange(dayjs(date).toISOString(), "date")} />
                            </div>
                        </div>
                        <div>
                            <label>Invoice Amount <span style={{ color: "red" }}>*</span></label>
                            <UiTextBox placeholder={"Enter the Invoice Amount"} name="invoiceAmount" onChange={(event) => handleChange(event?.target?.value, "invoiceAmount")} />
                        </div>
                    </div>
                </UiModal>
            }
        </div>
    </>
};
export default Invoice