import dayjs from "dayjs";

export const REPORTS_TABLE_COLUMNS = [
    {
        title: "S.No",
        dataIndex: "sNo",
        key: "sNo",
        width: 80,
        render: (_, tableRecord, index) => index + 1,
    },
    {
        title: "CR Date",
        dataIndex: "crDate",
        key: "crDate",
        width: 140,
        render: (_, tableRecord,) => tableRecord?.date ? dayjs(tableRecord?.date).format("DD-MM-YYYY") : "-"
    },
    {
        title: "Dispatch Date",
        dataIndex: "dispatchDate",
        key: "dispatchDate",
        width: 150,
        render: (_, tableRecord,) => tableRecord?.dispatchDate ? dayjs(tableRecord?.dispatchDate).format("DD-MM-YYYY") : "-"
    },
    {
        title: "Kanban Date",
        dataIndex: "kanbanDate",
        key: "kanbanDate",
        width: 150,
        render: (_, tableRecord,) => tableRecord?.kanbanDate ? dayjs(tableRecord?.kanbanDate).format("DD-MM-YYYY") : "-"
    },
    {
        title: "Contract No",
        dataIndex: "crNumber",
        key: "crNumber",
        width: 180,
    },
    {
        title: "Part Number",
        dataIndex: "parentPartNumber",
        key: "parentPartNumber",
        width: 220,
    },
    {
        title: "Week No",
        dataIndex: "weekNo",
        key: "weekNo",
        width: 120,
    },
    {
        title: "BOM Qty",
        dataIndex: "bomQty",
        key: "bomQty",
        width: 100,
    },
    {
        title: "Total Qty",
        dataIndex: "totalQty",
        key: "totalQty",
        width: 100,
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: 300,
    },
];

export const REPORT_CHILD_COLUMN = [
    {
        title: "S.No",
        dataIndex: "sNo",
        key: "sNo",
        width: 80,
        render: (_, tableRecord, index) => index + 1,
    },
    {
        title: "Part No",
        dataIndex: "partNumber",
        key: "partNumber",
        width: 250,
    },
    {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        width: 80,
    },
    {
        title: "Disciption",
        dataIndex: "description",
        key: "description",
    },
];

export const reportTypeOptions = [
    {
        key: "NOT_AUDIT",
        value: "NOT_AUDIT",
        label: "Not Audit",
    },
    {
        key: "AUDIT",
        value: "AUDIT",
        label: "Audit",
    },
    {
        key: "DISPATCH",
        value: "DISPATCH",
        label: "Dispatch",
    }
];