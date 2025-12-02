import dayjs from "dayjs";
import { printer } from "../../../../assets/images";

export const ExcelUploadTaleColumn = ({ handleDownloadFile }) => [
    {
        title: "CR Number",
        dataIndex: "crNumbers",
        render: (_, record) => {

            const all = record?.crNumbers || [];
            const completed = record?.completedCrNumbers || [];
            const pending = record?.pendingCrNumbers || [];

            return (
                <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                    {all?.map((crNo, index) => {

                        let borderColor = "#d9d9d9";
                        let bgColor = "#fafafa";
                        let textColor = "#000";

                        if (completed.includes(crNo)) {
                            borderColor = "#52C41A";
                            bgColor = "#F6FFED";
                            textColor = "#52C41A";
                        }
                        else if (pending.includes(crNo)) {
                            borderColor = "#FA8C16";
                            bgColor = "#FFF7E6";
                            textColor = "#FA8C16";
                        }

                        return (
                            <span
                                key={index}
                                style={{
                                    padding: "4px 10px",
                                    borderRadius: "2px",
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {crNo}
                            </span>
                        );
                    })}
                </div>
            );
        }
    },
    {
        title: "Excel Name",
        dataIndex: "fileName",
    },
    {
        title: "Date",
        dataIndex: "date",
        render: (date) => date ? <p style={{ whiteSpace: "" }}>{dayjs(date).format("DD-MM-YYYY")}</p> : "",
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
        render: (status, details, index) => <img onClick={() => status === "PENDING" || status === "IN_PROGRESS" ? {} : handleDownloadFile(details)} src={printer} alt="" style={{ cursor: status === "PENDING" || status === "IN_PROGRESS" ? "not-allowed" : "pointer", filter: status === "PENDING" || status === "IN_PROGRESS" ? "grayscale(100%) brightness(60%)" : "" }} />
    }
];