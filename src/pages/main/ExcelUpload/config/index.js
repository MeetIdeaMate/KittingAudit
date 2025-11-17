import dayjs from "dayjs";
import { printer } from "../../../../assets/images";

export const ExcelUploadTaleColumn = ({handleDownloadFile}) => [
    {
        title: "CR Number",
        dataIndex: "crNumber",
    },
    {
        title: "Excel Name",
        dataIndex: "fileName",
    },
    {
        title: "Date",
        dataIndex: "date",
        render: (date) => date ? dayjs(date).format("DD-MM-YYYY") : "",
    },
    {
        title: "Status",
        dataIndex: "status",
        render: (status) => {
            return <p style={{border: `1px solid ${status === "PENDING" ? "#FA8C16" : "#52C41A"}`, borderRadius: "5px", backgroundColor: `${status === "PENDING" ? "#FFF7E6" : "#F6FFED"}`, padding: "4px", color: status === "PENDING" ? "#FA8C16" : "#52C41A" }}>{status}</p>
        }
    },
    {
        title: "Download",
        dataIndex: "status",
        render: (status, details, index) => <img onClick={() => status === "PENDING" ? {} : handleDownloadFile(details)} src={printer} alt="" style={{cursor: status === "PENDING" ? "not-allowed" :  "pointer", filter: status === "PENDING" ?  "grayscale(100%) brightness(60%)" : "" }}/>
    }
];