import { Image } from "antd";
import { icons_edit } from "../../../assets/images";

export const PART_COLUMN_HEADER = (handleViewPart) => [
    {
        title: "S.No",
        dataIndex: "sno",
        key: "sno",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Part No",
        dataIndex: "partNo",
        key: "partNo",
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
    },
    {
        title: "Part Image",
        dataIndex: "partImage",
        key: "partImage",
        render: (image) => <Image src={image} alt="part" style={{ width: "50px", height: "50px" }} />,
    },
    {
        title: "Write Item",
        dataIndex: "writeItem",
        key: "writeItem",
        render: (_, record) => (
            <a onClick={() => handleViewPart(record, "view")}>Click Attach Documents</a>
        ),
    },
    {
        title: "",
        dataIndex: "actions",
        key: "actions",
        render: (_, record) => (
            <img src={icons_edit} alt="" onClick={() => handleViewPart(record, "edit")} style={{ cursor: "pointer" }} />
        ),
    },
];