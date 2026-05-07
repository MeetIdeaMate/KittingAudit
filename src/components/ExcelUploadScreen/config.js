import dayjs from "dayjs";
import { printer } from "../../assets/images";

export const ExcelUploadTaleColumn = ({ handleDownloadFile }) => [
    {
        title: "S.No",
        dataIndex: "sno",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Excel Name",
        dataIndex: "fileName",
    },
    {
        title: "Date",
        dataIndex: "date",
        render: (date) => date ? <p style={{ whiteSpace: "nowrap" }}>{dayjs(date).format("DD-MM-YYYY")}</p> : "",
    },
    {
        title: "Status",
        dataIndex: "status",
        render: (status) => {
            return <p style={{ border: `1px solid ${status === "PENDING" ? "#FA8C16" : (status === "IN_PROGRESS" ? "#1a4ac4ff" : "#52C41A")}`, borderRadius: "5px", backgroundColor: `${status === "PENDING" ? "#FFF7E6" : (status === "IN_PROGRESS" ? "#d8e0f5ff" : "#F6FFED")}`, padding: "4px", color: status === "PENDING" ? "#FA8C16" : (status === "IN_PROGRESS" ? "#1a4ac4ff" : "#52C41A") }}>{status}</p>
        }
    },
    {
        title: "Download",
        dataIndex: "status",
        render: (status, details, index) => <img onClick={() => handleDownloadFile(details)} src={printer} alt="" style={{ cursor:  "pointer" }} />
    }
];

export const colorStatus = [
    { label: "Pending", color: "#FA8C16", bgColor: "#FFF7E6" },
    { label: "Inprogress", color: "#1a4ac4ff", bgColor: "#d8e0f5ff" },
    { label: "Completed", color: "#52C41A", bgColor: "#F6FFED" },
];