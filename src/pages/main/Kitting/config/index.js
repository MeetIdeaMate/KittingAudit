import { deleteIcon, printer } from "../../../../assets/images";

export const kittingPartColumn = ({ handleKittingPart }) => [
    {
        title: "S.No",
        dataIndex: "level",
        align: "left",
      width:40,
        render: (_, details, index) => index + 1,
    },
   
    {
        title: "Part No",
        dataIndex: "partNumber",
         width:100,
    },
     {
        title: "Qty",
         dataIndex: "quantity",
                width:70,
    },
     {
        title: "Lbl Qty",
         dataIndex: "totalLabeledQty",
                width:70,
        render: (_, details) => details?.type === "PARENT" ? details?.kittedQty : details?.totalLabeledQty
    },
    {
        title: "Bal Qty",
        dataIndex: "balanceQty",
        width:70,
        render:(_,details)=>{
            return<div>{details?.balanceQty === 0?<p style={{color : "green",padding : 0, margin : 0}}>✔</p>:<p>{details?.balanceQty}</p>}</div>
        }
    },
    {
        title: "Print",
        dataIndex: "",
                width:70,
        render: (_, details) =>
            details?.isAllow || details?.isDublicate ?
                <img src={printer} alt="" style={{ cursor: "pointer" }} onClick={() => handleKittingPart(details, details?.key)} /> :
                <img src={printer} alt="" style={{ cursor: "not-allowed" }} />
    },
    {
        title: <p style={{ padding: "0", margin: "0",textAlign:"start" }}>Description</p>,
        dataIndex: "description",
        render: (_, rec) => <p style={{ padding: "0", margin: "0", textAlign: "start" }}>{rec?.description}</p>,
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
        render: (_,rec) => rec?.part,
    },
    {
        title: "Qty",
        render: (barqty,rec) =>rec?.labelQty,
    },
    {
        title: "_",
        render: (_, details, index) => <img src={deleteIcon} alt="" style={{ cursor: "pointer" }} onClick={() => handleRemoveSpecificPart(index)} />
    }
];