import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

export const reportTypeDateOptions = [
    {
        key: "NOT_AUDIT",
        value: "NOT_AUDIT",
        label: "Contract Date",
    },
    {
        key: "AUDIT",
        value: "AUDIT",
        label: "Audit Date",
    },
    {
        key: "DISPATCH",
        value: "DISPATCH",
        label: "Dispatch Date",
    }
];

export const DownloadOptions = [{ key: '1', label: 'EXL', }, { key: '2', label: 'Print', }];

export const handleDownloadExcel = ({ tableData = [], setTableData = () => { } }) => {
    const excelData = tableData?.content?.map((item, index) => ({
        "S.No": index + 1,
        "CR Date": item?.date ? dayjs(item?.date).format("DD-MM-YYYY") : "-",
        "Dispatch Date": item?.dispatchDate ? dayjs(item?.dispatchDate).format("DD-MM-YYYY") : "-",
        "Kanban Date": item?.kanbanDate ? dayjs(item?.kanbanDate).format("DD-MM-YYYY") : "-",
        "Contract No": item?.crNumber || "-",
        "Part Number": item?.parentPartNumber || "-",
        "Week No": item?.weekNo || "-",
        "BOM Qty": item?.bomQty || "-",
        "Total Qty": item?.totalQty || "-",
        "Description": item?.description || "-",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [{ wch: 10 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 40 },];
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col, });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, },
            fill: { fgColor: { rgb: "FF7A00" }, },
            alignment: { horizontal: "center", vertical: "center", },
        };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reports"
    );
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
    });
    const blob = new Blob(
        [excelBuffer],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8", }
    );
    saveAs(blob, "Reports.xlsx");
    setTableData({});
};