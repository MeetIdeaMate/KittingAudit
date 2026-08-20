import dayjs from "dayjs";

export const tabData = [
    { label: "Pending", content: "PENDING", key: "1" },
    { label: "Completed", content: "COMPLETED", key: "2" }
];

export const INVOICE_COLUMN_HEADER = ({ activeTab }) => [
    {
        title: "SNo",
        render: (_, detail, index) => index + 1
    },
    {
        title: "Part Number",
        dataIndex: "parentPartNumber"
    },
    {
        title: "Week No",
        dataIndex: "weekNo"
    },
    {
        title: "Qty",
        dataIndex: "totalQty"
    },
    {
        title: "Description",
        dataIndex: "description"
    },
    {
        title: "CR Date",
        render: (detail) => detail?.date ? dayjs(detail?.date).format("DD-MM-YYYY") : "-"
    },
    {
        title: "Kanban Date",
        render: (detail) => detail?.kanbanDate ? dayjs(detail?.kanbanDate).format("DD-MM-YYYY") : "-"
    },
    {
        title: "Audit Date",
        render: (detail) => detail?.auditDate ? dayjs(detail?.auditDate).format("DD-MM-YYYY") : "-"
    },
    {
        title: "Dispatch Date",
        render: (detail) => detail?.dispatchDate ? dayjs(detail?.dispatchDate).format("DD-MM-YYYY") : "-"
    },
    {
        title: "BOM Qty",
        dataIndex: "bomQty"
    },
    {
        title: "Type",
        dataIndex: "type"
    },
    ...(activeTab === "COMPLETED" ? [
        {
            title: "Invoice No",
            dataIndex: "invoiceNo"
        },
        {
            title: "Invoice Date",
            render: (details) => details?.invoiceDate ? dayjs(details?.invoiceDate).format("DD-MM-YYYY") : "-"
        },
        {
            title: "Invoice Amount",
            render: (detail) => detail?.invoiceAmount ? detail?.invoiceAmount.toFixed(2) : "-"
        }
    ] : [])
];