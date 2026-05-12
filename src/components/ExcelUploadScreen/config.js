import dayjs from "dayjs";
import { printer } from "../../assets/images";

export const ExcelUploadTaleColumn = ({ handleDownloadFile, title }) => [
    {
        title: "S.No",
        dataIndex: "sno",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Excel Name",
        dataIndex: "fileName",
        render: (_, fileRecord) => fileRecord?.fileName || fileRecord?.filename || "-"
    },
    {
        title: "Date",
        dataIndex: "date",
        render: (date) => date ? <p style={{ whiteSpace: "nowrap" }}>{dayjs(date).format("DD-MM-YYYY")}</p> : "",
    },
    ...((title === "CSL Upload") ? [
        {
            title: "Status",
            dataIndex: "status",
            render: (status) => {
                return <p style={{ border: `1px solid ${status === "NOT_AUDIT" ? "#FA8C16" : (status === "AUDIT" ? "#1a4ac4ff" : "#52C41A")}`, borderRadius: "5px", backgroundColor: `${status === "NOT_AUDIT" ? "#FFF7E6" : (status === "AUDIT" ? "#d8e0f5ff" : "#F6FFED")}`, padding: "4px", color: status === "NOT_AUDIT" ? "#FA8C16" : (status === "NOT_AUDIT" ? "#1a4ac4ff" : "#52C41A") }}>{status}</p>
            }
        },
    ] : []),
    {
        title: "Download",
        dataIndex: "status",
        render: (status, details, index) => <img onClick={() => handleDownloadFile(details)} src={printer} alt="" style={{ cursor: "pointer" }} />
    }
];

export const colorStatus = [
    { label: "Not Audit", color: "#f6822b", bgColor: "#fff2e8" },
    { label: "Audit", color: "#1890ff", bgColor: "#e6f7ff" },
    { label: "Dispatch", color: "#52c41a", bgColor: "#f6ffed" },
];
