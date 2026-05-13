import dayjs from "dayjs";
import { audit_print_icon, disatch_icon } from "../../../assets/images";

export const AUDIT_TABLE_COLUMN = ({ handlePrintAudit, }) => [
    {
        title: "S.No",
        dataIndex: "sNo",
        key: "sNo",
        width: 50,
        render: (_, rec, index) => index + 1,
    },
    {
        title: "Part Number",
        dataIndex: "partNumber",
        key: "partNumber",
    },
    {
        title: "Week No",
        dataIndex: "weekNo",
        key: "weekNo",
    },
    {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
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
        render: (_, auditRecord) => auditRecord?.isParentPart ? <img style={{ cursor: "pointer" }} src={audit_print_icon} onClick={() => handlePrintAudit(auditRecord, "AUDIT")} alt="" /> : "-",
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (_, auditRecord) => <p>{auditRecord?.auditDate ? dayjs(auditRecord?.auditDate).format("DD-MM-YYYY") : "-"}</p>
    },
    {
        title: "Dispatch",
        dataIndex: "dispatch",
        key: "dispatch",
        render: (_, dispatchRecord) => dispatchRecord?.isParentPart && dispatchRecord?.status !== "NOT_AUDIT" ? <img style={{ cursor: "pointer" }} onClick={() => handlePrintAudit(dispatchRecord, "DISPATCH")} src={disatch_icon} alt="" /> : "-",
    },
    {
        title: "Kanban date",
        dataIndex: "kanbanDate",
        key: "kanbanDate",
        render: (_, kanbanRecord) => <p>{kanbanRecord?.kanbanDate ? dayjs(kanbanRecord?.kanbanDate).format("DD-MM-YYYY") : "-"}</p>
    },
    {
        title: "BOM Qty",
        dataIndex: "bomQty",
        key: "bomQty",
    },
];