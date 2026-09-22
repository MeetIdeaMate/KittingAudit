import { Image, Switch } from "antd";
import { icons_edit } from "../../../assets/images";
import { MASTERDATA_URL } from "../../../apiservices/endpoints";

export const PART_COLUMN_HEADER = (handleViewPart, handleStatusSwitchClick) => [
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
        dataIndex: "partImageDetails",
        key: "partImageDetails",
        render: (image) => <Image src={`${MASTERDATA_URL}/get_image/${image?.imageUrl || image?.[0]?.imageUrl}`} alt="part" style={{ width: "50px", height: "50px" }} />,
    },
    {
        title: "Similar Parts",
        dataIndex: "writeItem",
        key: "writeItem",
        render: (_, record) => (
            <a onClick={() => handleViewPart(record, "view")}>View All Similar Part Images</a>
        ),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status, record) => (
            <Switch
                checked={status === "ACTIVE"}
                onClick={(checked, e) => {
                    e.stopPropagation();
                    handleStatusSwitchClick(record);
                }}
            />
        ),
    },
    {
        title: "Edit",
        dataIndex: "actions",
        key: "actions",
        render: (_, record) => (
            <img src={icons_edit} alt="" onClick={() => handleViewPart(record, "edit")} style={{ cursor: "pointer" }} />
        ),
    },
];