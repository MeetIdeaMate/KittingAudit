import { Checkbox } from "antd";
import { deleteIcon, printer } from "../../../../assets/images";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export const kittingPartColumn = ({ handleKittingPart, handleChangeCheckBox, filterInfo }) => [
    {
        title: "S.No",
        dataIndex: "level",
        align: "left",
        width: 40,
        render: (_, details, index) => index + 1,
    },
    ...(filterInfo?.fimNumber ? [{
        title: "-",
        width: 40,
        render: (_, details, index) => {
            return details?.type === "PARENT" ? "" : <Checkbox value={details?.isSelect} disabled={details?.printingType === "GROUPED"} name="isSelect" checked={details?.isSelect} onChange={(field) => handleChangeCheckBox(field?.target?.checked, index)}></Checkbox>
        }
    },] : []),
    {
        title: "Part No",
        dataIndex: "partNumber",
        width: 100,
    },
    {
        title: "Qty",
        dataIndex: "quantity",
        width: 70,
    },
    {
        title: "Lbl Qty",
        dataIndex: "totalLabeledQty",
        width: 70,
        render: (_, details) => details?.type === "PARENT" ? details?.kittedQty : details?.totalLabeledQty
    },
    {
        title: "Bal Qty",
        dataIndex: "balanceQty",
        width: 70,
        render: (_, details) => {
            return <div>{details?.balanceQty === 0 ? <p style={{ padding: 0, margin: 0 }}><CheckOutlined style={{ color: "green" }} /></p> : <p>{details?.balanceQty}</p>}</div>
        }
    },
    {
        title: "Print",
        dataIndex: "",
        width: 70,
        render: (_, details) =>
            details?.isAllow || details?.isDublicate ?
                <img src={printer} alt="" style={{ cursor: "pointer" }} onClick={() => handleKittingPart(details, details?.key)} /> :
                <img src={printer} alt="" style={{ cursor: "not-allowed" }} />
    },
    {
        title: <p style={{ padding: "0", margin: "0", textAlign: "start" }}>Description</p>,
        dataIndex: "description",
        render: (_, rec) => <p style={{ padding: "0", margin: "0", textAlign: "start" }}>{rec?.description}</p>,
    },
    {
        title:"Date",
        render:(details)=>{
            const date = details?.uploadedDate;
            return date? <p style={{fontWeight:700}}>{dayjs(date).format("DD-MM-YYYY")}</p>:null
        }
    },
    {
        title: "BOM Qty",
        render: (details) => {
            return <p style={{ padding: 0, margin: 0 }}>{details?.bomQty ? details?.bomQty : ""}</p>
        }
    },
    {
        title: "FIM No",
        dataIndex: "fimNumber",
    },
];

export const tabsData = [
    { key: "1", label: "Individual", content: "individual" },
    { key: "2", label: "Grouped", content: "grouped" },
];

export const mainPartCase = ({ handleRemoveSpecificPart }) => [
    {
        title: "Part No",
        render: (_, rec) => rec?.part,
    },
    {
        title: "Qty",
        render: (barqty, rec) => rec?.labelQty,
    },
    {
        title: "_",
        render: (_, details, index) => <img src={deleteIcon} alt="" style={{ cursor: "pointer" }} onClick={() => handleRemoveSpecificPart(index)} />
    }
];