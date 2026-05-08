import React, { useRef, useState } from "react";
import { UiCounterBatch, UiSelect, UiTable } from "../../../components"
import { AUDIT_TABLE_COLUMN, dataSource } from "./config";
import AuditReport from "./auditPrint";
import { useReactToPrint } from "react-to-print";
import { DispatchModal } from "./dispatchModal";

const PrintAuditPDF = React.forwardRef((props, ref) => (
    <div ref={ref}>
        <AuditReport />
    </div>
));

export const AuditScreen = () => {

    const printRef = useRef();

    const [pageSize, setPageSize] = useState({ page: 0, size: 25, });
    const [isOpenDispatch, setIsOpenDispatch] = useState(false);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
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

    const handlePagination = (pages, size) => {
        setPageSize({ page: pages - 1, size: size, });
    };

    const handlePrintAudit = auditRec => {
        handlePrint();
    };

    const handleDispatch = dispatchRec => {
        setIsOpenDispatch(true);
    };

    return <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="flexible-start">
                <h3>Audit</h3> <UiCounterBatch primary >{0}</UiCounterBatch>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <UiSelect
                    isStyle={true}
                    style={{ width: "150px" }}
                // placeholder="Search CR "
                />
                <UiSelect
                    isStyle={true}
                    style={{ width: "150px" }}
                // placeholder="Search user"
                />
            </div>
        </div>
        <UiTable
            columns={AUDIT_TABLE_COLUMN({ handlePrintAudit, handleDispatch })}
            dataSource={dataSource}
            pagination={{
                pageSize: pageSize?.size,
                current: pageSize?.page + 1,
                pageSizeOptions: [25, 50, 75, 100],
                showSizeChanger: true,
                // total: allUsers?.result?.usersWithPage?.totalElements,
                onChange: (page, size) => handlePagination(page, size),
            }}
        />
        <div style={{ display: "none", width: "100%" }}>
            <PrintAuditPDF
                ref={printRef}
            />
        </div>
        {isOpenDispatch && <DispatchModal open={isOpenDispatch} handleClose={() => setIsOpenDispatch(false)} />}
    </div>
}