import { Switch } from "antd";
import { reset } from "../../../../assets/images";

export const USER_COLUMN_HEADER = (handleModalStatusOpen,handleModalOpen) => [
    {
        title: "SNo",
        dataIndex: "sno",
        render: (_, details, index) => index + 1,
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: (ass, dec) => ass?.name?.localeCompare(dec?.name),
        dortDirections: ["descend", "ascend"],
        defaultSortOrder: "ascend",
    },
    {
        title: "User Names",
        dataIndex: "userName",
    },
    {
        title: "Designation",
        dataIndex: "designation",
    },
    {
        title: "Role",
        dataIndex: "role",
    },
    {
        title: "Status",
        dataIndex: "userStatus",
        key: "userStatus",
        width: 100,
        render: (_, record) => (
            <Switch
                checked={record.userStatus === "ACTIVE"}
            onChange={() => handleModalStatusOpen(record)}
            />
        ),
    },
    {
        title: "Reset",
        dataIndex: "reset",
        key: "reset",
        width: 50,
        render: (_, record) => (
            <img
                src={reset}
                alt="Reset"
                onClick={() => handleModalOpen(record)}
                style={{ cursor: 'pointer' }}
            />
        ),
    },
];