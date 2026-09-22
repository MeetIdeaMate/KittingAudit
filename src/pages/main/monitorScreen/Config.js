import { UiStatusIcon } from "../../../components";

export const PART_COLUMN_HEADER = (handleVerify) => [
    {
        title: "Part No",
        dataIndex: "partNo",
        key: "partNo",
        width: "22%",
    },
    {
        title: "Part Qty",
        dataIndex: "partQty",
        key: "partQty",
        width: "10%",
    },
    {
        title: "Part Img",
        dataIndex: "partImage",
        key: "partImage",
        width: "12%",
        render: (partImage) =>
            partImage ? (
                <div className="part-thumb">
                    <img src={partImage} alt="part" />
                </div>
            ) : (
                <span className="part-thumb-empty">-</span>
            ),
    },
    {
        title: "Part Description",
        dataIndex: "description",
        key: "description",
        width: "40%",
    },
    {
        title: "Action",
        dataIndex: "status",
        key: "status",
        width: "16%",
        align: "right",
    },
];
