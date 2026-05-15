import React, { useEffect, useRef, useState } from "react";
import { UiCounterBatch, UiSelect, UiTable } from "../../../components"
import { AUDIT_TABLE_COLUMN, } from "./config";
import AuditReport from "./auditPrint";
import { useReactToPrint } from "react-to-print";
import { DispatchModal } from "./dispatchModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../../../actions";
import { CSLBASEURL } from "../../../apiservices/endpoints";
import { useDispatch } from "react-redux";
import { loaderReducer } from "../../../reducers/loader.reducer";
import { showToast } from "../../../components/UiToastNotification";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { reportTypeOptions } from "../reports/config";

const PrintAuditPDF = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <AuditReport selectedRecord={props?.selectedRecord} />
    </div>
));

export const AuditScreen = () => {

    const printRef = useRef();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const changeAuditStatus = (partNo, auditPayload) => api.put(`${CSLBASEURL}/update_csl_details_status/${encodeURIComponent(partNo)}`, auditPayload);

    const [isOpenDispatch, setIsOpenDispatch] = useState(false);
    const [filters, setFilters] = useState({ crNumber: "", finNmber: "", reportType: "" });
    const [cslSource, setCslSource] = useState({ crNumber: [], finNmber: [] });
    const [auditSource, setAuditSource] = useState([]);
    const [currentStatus, setCurrentStatus] = useState("");
    const [selectedRecord, setSelectedRecord] = useState({});

    const { isFetching: isFetchingCRNumbers, refetch: refetchCRNumbers } = useQuery(["GET_CR_NUMBERS_DETAILS", ""],
        () => api.get(`${CSLBASEURL}/get_csl_details${filters?.crNumber ? `?crNumber=${filters?.crNumber}` : ""}`), {
        enabled: true,
        refetchOnWindowFocus: false,
        onSuccess: crNumberResponse => {
            if (crNumberResponse?.statusCode === 200) {
                const cslDetails = crNumberResponse?.result?.cslDetails || [];
                const source = cslDetails?.map(csl => ({ key: csl, value: csl }));
                setCslSource(prev => ({ crNumber: !filters?.crNumber ? source : prev?.crNumber, finNmber: filters?.crNumber ? source : [] }));
                if (!filters?.crNumber) {
                    setFilters(prev => ({ ...prev, crNumber: cslDetails?.[0] }));
                }
            } else {
                showToast.error("Error", crNumberResponse?.response?.data?.error?.message);
            }
        },
    });

    const { isFetching: isFetchingGetAllAudit, refetch: refetchGetAllAudit } = useQuery(["GET_ALL_AUDIT_DETAILS", ""],
        () => api.get(`${CSLBASEURL}/audit_details?crNumber=${filters?.crNumber}${filters?.finNmber ? `&finNumber=${filters?.finNmber}` : ""}`), {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: getAllAuditResponse => {
            if (getAllAuditResponse?.statusCode === 200) {
                const auditDetails = getAllAuditResponse?.result?.auditDetails || [];
                const auditMap = auditDetails?.flatMap(mapDetails => [
                    {
                        ...mapDetails,
                        partNumber: mapDetails?.parentPartNumber,
                        isParentPart: true,
                    },
                    ...mapDetails?.partDetails?.map(part => ({
                        ...part,
                        parentPartNumber: mapDetails?.parentPartNumber,
                        crNumber: mapDetails?.crNumber,
                        fimNumber: mapDetails?.fimNumber,
                        isParentPart: false
                    }))
                ]);
                setAuditSource(auditMap || []);
            } else {
                showToast.error("Error", getAllAuditResponse?.response?.data?.error?.message);
            }
        },
    });

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        onAfterPrint: () => {
            if (selectedRecord?.status === "NOT_AUDIT") {
                refetchGetAllAudit();
            }
            setSelectedRecord({});
            setCurrentStatus("");
        },
        pageStyle: `
    @page {
      size: A4;
      margin: 10mm;
    }

    html, body {
      background: white !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    table {
      border-collapse: collapse !important;
    }

    table, th, td {
      border: 1px solid #000 !important;
    }
  `,
    });

    const { isFetching: isFetchingAuditUpdate } = useQuery(["UPDATE_AUDIT_STATUS", ""], changeAuditStatus, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: auditResponse => {
            if (auditResponse?.status === 200) {
                if (currentStatus === "AUDIT") {
                    handlePrint();
                } else {
                    setIsOpenDispatch(false);
                    refetchGetAllAudit();
                    setSelectedRecord({});
                    setCurrentStatus("");
                }
                showToast.success("Success", auditResponse?.data?.result?.updateCslDetails || "Update successfully");
            } else {
                showToast.error("Error", auditResponse?.response?.data?.error?.message || auditResponse?.response?.data?.message);
            }
        },
    });

    const handlePrintAudit = (auditRec, status, date) => {
        setCurrentStatus(status);
        setSelectedRecord(auditRec);
        let payload = {
            date: date ? dayjs(date).toISOString() : dayjs().toISOString(),
            userId: sessionStorage.getItem("userId"),
        }
        if ((status === "AUDIT" && !auditRec?.auditDate) || (status === "DISPATCH" && date)) {
            payload.status = status;
            queryClient.prefetchQuery(["UPDATE_AUDIT_STATUS", ""], () => changeAuditStatus(auditRec?.cslDetailInfoId, payload));
        } else if (status === "DISPATCH") {
            setIsOpenDispatch(true);
        }
    };

    const handleFiltersChange = (fileldalue, fieldName) => {
        setFilters(prev => ({ ...prev, [fieldName]: fileldalue, ...(fieldName === "crNumber" ? { finNmber: "" } : {}) }));
    };

    useEffect(() => {
        if (currentStatus === "AUDIT" && selectedRecord?.status !== "NOT_AUDIT") {
            handlePrint();
        }
    }, [currentStatus, selectedRecord?.status]);

    useEffect(() => {
        if (filters?.crNumber) {
            refetchGetAllAudit();
        }
    }, [filters, refetchGetAllAudit]);

    useEffect(() => {
        if (filters?.crNumber && cslSource?.crNumber?.length > 0) {
            refetchCRNumbers();
        }
    }, [filters?.crNumber, cslSource?.crNumber?.length, refetchCRNumbers]);

    useEffect(() => {
        let isLoading = isFetchingCRNumbers || isFetchingGetAllAudit || isFetchingAuditUpdate;
        dispatch(loaderReducer(isLoading));
    }, [dispatch, isFetchingCRNumbers, isFetchingGetAllAudit, isFetchingAuditUpdate]);

    return <div className="audit-page">
        <div className="audit-header" style={{ display: "flex", justifyContent: "space-between", padding: "0 5px" }}>
            <div className="flexible-start">
                <h3>Audit</h3> <UiCounterBatch primary >{auditSource?.length || 0}</UiCounterBatch>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <UiSelect
                    allowClear={false}
                    options={reportTypeOptions}
                    isStyle={true}
                    style={{ width: "130px" }}
                    placeholder="Report Type"
                    value={filters?.reportType || null}
                    onChange={(selectValue) => handleFiltersChange(selectValue, "reportType",)}
                />
                <UiSelect
                    isStyle={true}
                    allowClear={false}
                    options={cslSource?.crNumber || []}
                    style={{ width: "150px" }}
                    value={filters?.crNumber || null}
                    onChange={fileldalue => handleFiltersChange(fileldalue, "crNumber")}
                />
                <UiSelect
                    isStyle={true}
                    options={cslSource?.finNmber || []}
                    style={{ width: "150px" }}
                    value={filters?.finNmber || null}
                    onChange={fileldalue => handleFiltersChange(fileldalue, "finNmber")}
                />
            </div>
        </div>
        <div className="audit-body">
            <UiTable
                className="ChangeTablePadding"
                columns={AUDIT_TABLE_COLUMN({ handlePrintAudit, })}
                dataSource={auditSource}
                rowClassName={(record) =>
                    record?.isParentPart ? "parent-part-row" : ""
                }
                pagination={false}
            />
        </div>
        <div style={{ display: "none", width: "100%" }}>
            <PrintAuditPDF
                selectedRecord={selectedRecord}
                ref={printRef}
            />
        </div>
        {isOpenDispatch && <DispatchModal isFetchingAuditUpdate={isFetchingAuditUpdate} open={isOpenDispatch} handleClose={(isCheck, date) => {
            if (isCheck && date) {
                handlePrintAudit(selectedRecord, currentStatus, date);
            } else {
                setIsOpenDispatch(false);
            }
        }} />}
    </div>
}