import dayjs from "dayjs";
import { printer } from "../../assets/images";

export const ExcelUploadTaleColumn = ({ handleDownloadFile, title }) => [
    {
        title: "S.No",
        dataIndex: "sno",
        render: (_, __, index) => index + 1,
        width: 60,
    },
    {
        title: "Excel Name",
        dataIndex: "fileName",
        render: (_, fileRecord) => fileRecord?.fileName || "-"
    },
    {
        title: "Date",
        dataIndex: "date",
        width: 100,
        render: (date) => date ? <p style={{ whiteSpace: "nowrap" }}>{dayjs(date).format("DD-MM-YYYY")}</p> : "",
    },
    ...((title === "CSL Upload") ? [
        {
            title: "Status",
            dataIndex: "status",
            width: 150,
            render: (status) => {
                return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p style={{ border: `1px solid ${status === "NOT_YET_STARTED" ? "#FA8C16" : (status === "IN_PROGRESS" ? "#1a4ac4ff" : "#52C41A")}`, borderRadius: "5px", backgroundColor: `${status === "NOT_YET_STARTED" ? "#FFF7E6" : (status === "IN_PROGRESS" ? "#d8e0f5ff" : "#F6FFED")}`, padding: "4px", color: status === "NOT_YET_STARTED" ? "#FA8C16" : (status === "IN_PROGRESS" ? "#1a4ac4ff" : "#52C41A"), fontSize: "12px", width: "100px" }}>{status}</p>
                </div>
            }
        },
    ] : []),
    {
        title: "Download",
        dataIndex: "status",
        width: 100,
        render: (status, details, index) => <img onClick={() => handleDownloadFile(details)} src={printer} alt="" style={{ cursor: "pointer" }} />
    }
];

export const colorStatus = [
    { label: "Not Yet Started", color: "#f6822b", bgColor: "#fff2e8" },
    { label: "In Progresss", color: "#1890ff", bgColor: "#e6f7ff" },
    { label: "Completed", color: "#52c41a", bgColor: "#f6ffed" },
];
