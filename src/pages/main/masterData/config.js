import { Image } from "antd";
import { icons_edit } from "../../../assets/images";
import { MASTERDATA_URL } from "../../../apiservices/endpoints";

export const PART_COLUMN_HEADER = (handleViewPart) => [
    {
        title: "S.No",
        dataIndex: "sno",
        key: "sno",
        render: (_, __, index) => index + 1,
    },
    {
        title: "Part No",
        dataIndex: "partNumber",
        key: "partNumber",
    },
    {
        title: "Description",
        dataIndex: "partDescription",
        key: "partDescription",
    },
    {
        title: "Part Image",
        dataIndex: "imageUrl",
        key: "imageUrl",
        render: (image) => <Image src={`${MASTERDATA_URL}/${image}`} alt="part" style={{ width: "50px", height: "50px" }} />,
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