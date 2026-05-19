import dayjs from "dayjs";
import { audit_print_icon, disatch_icon } from "../../../assets/images";

export const AUDIT_TABLE_COLUMN = ({ handlePrintAudit, }) => [
    {
        title: "S.No",
        dataIndex: "sNo",
        key: "sNo",
        width: 70,
        render: (_, rec, index) => index + 1,
    },
    {
        title: "Part Number",
        dataIndex: "partNumber",
        key: "partNumber",
        width: 200,
    },
    {
        title: "Week No",
        dataIndex: "weekNo",
        key: "weekNo",
        width: 200,
    },
    {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        width: 70,
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Audit",
        dataIndex: "audit",
        key: "audit",
        width: 70,
        render: (_, auditRecord) => auditRecord?.isParentPart && auditRecord?.weekNo ? <img style={{ cursor: "pointer" }} src={audit_print_icon} onClick={() => handlePrintAudit(auditRecord, "AUDIT")} alt="" /> : "-",
    },
    {
        title: "Dispatch",
        dataIndex: "dispatch",
        key: "dispatch",
        width: 90,
        render: (_, dispatchRecord) => dispatchRecord?.isParentPart && dispatchRecord?.status !== "NOT_AUDIT" && dispatchRecord?.weekNo ? <img style={{ cursor: "pointer" }} onClick={() => handlePrintAudit(dispatchRecord, "DISPATCH")} src={disatch_icon} alt="" /> : "-",
    },
    {
        title: "CR Date",
        dataIndex: "date",
        key: "date",
        width: 120,
        render: (_, auditRecord) => <p>{auditRecord?.date ? dayjs(auditRecord?.date).format("DD-MM-YYYY") : "-"}</p>
    },
    {
        title: "Kanban date",
        dataIndex: "kanbanDate",
        key: "kanbanDate",
        width: 120,
        render: (_, kanbanRecord) => <p>{kanbanRecord?.kanbanDate ? dayjs(kanbanRecord?.kanbanDate).format("DD-MM-YYYY") : "-"}</p>
    },
    {
        title: "Audit Date",
        dataIndex: "date",
        key: "date",
        width: 120,
        render: (_, auditRecord) => <p>{auditRecord?.auditDate ? dayjs(auditRecord?.auditDate).format("DD-MM-YYYY") : "-"}</p>
    },
    {
        title: "Dispatch Date",
        dataIndex: "dispatchDate",
        key: "date",
        width: 120,
        render: (_, auditRecord) => <p>{auditRecord?.dispatchDate ? dayjs(auditRecord?.dispatchDate).format("DD-MM-YYYY") : "-"}</p>
    },
    {
        title: "BOM Qty",
        dataIndex: "bomQty",
        key: "bomQty",
        width: 90,
    },
];

export const colorStatus = [
    { label: "Not Audit", color: "#000", bgColor: "#fff2e8" },
    { label: "Audit", color: "#000", bgColor: "#e6f7ff" },
    { label: "Dispatch", color: "#000", bgColor: "#f6ffed" }
]