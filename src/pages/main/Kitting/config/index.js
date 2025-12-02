import { deleteIcon, printer } from "../../../../assets/images";

export const kittingPartColumn = ({ handleKittingPart }) => [
    {
        title: "S.No",
        dataIndex: "level",
        align: "left",
        render: (_, details, index) => index + 1,
    },
    {
        title: "FIM No",
        dataIndex: "fimNumber",
    },
    {
        title: "Part Number",
        dataIndex: "partNumber",
    },
    {
        title: "Print",
        dataIndex: "",
        render: (_, details) =>
            details?.isAllow || details?.isDublicate ?
                <img src={printer} alt="" style={{ cursor: "pointer" }} onClick={() => handleKittingPart(details, details?.key)} /> :
                <img src={printer} alt="" style={{ cursor: "not-allowed" }} />
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Quantity",
        dataIndex: "quantity",
    },
    {
        title: "Labeled Count",
        dataIndex: "totalLabeledQty",
        render: (_, details) => details?.type === "PARENT" ? details?.kittedQty : details?.totalLabeledQty
    },
    {
        title: "Scanned Qty",
        dataIndex: "scannedQty",
    },
    {
        title: "Balanced Count",
        dataIndex: "balanceQty"
    },
];

export const tabsData = [
    { key: "1", label: "Individual", content: "individual" },
    { key: "2", label: "Grouped", content: "grouped" },
];

export const mainPartCase = ({ handleRemoveSpecificPart }) => [
    {
        title: "Part No",
        render: (part) => part?.replace(/-\d+$/, ""),
    },
    {
        title: "Bar Code ID",
        render: (part) => part,
    },
    {
        title: "_",
        render: (_, details, index) => <img src={deleteIcon} alt="" style={{ cursor: "pointer" }} onClick={() => handleRemoveSpecificPart(index)} />
    }
];