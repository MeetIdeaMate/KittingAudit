import { barcodeIcon } from "../../../../assets/images";

export const kittingPartColumn = ({ handleKittingPart }) => [
    {
        title: "-",
        dataIndex: "level",
        align: "left",
        render: (level, details) => {
            if (details?.isParent) {
                const num = level.replace(/\D/g, "");
                return num;
            }
            const dotCount = (level.match(/\./g) || []).length;
            const suffix = level.replace(/\./g, "");
            return (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ display: "flex", gap: "4px" }}>
                        {Array.from({ length: dotCount }).map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: "#F6822B",
                                }}
                            ></div>
                        ))}
                    </div>
                    <span>{suffix}</span>
                </div>
            );
        }
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
                <img src={barcodeIcon} alt="" style={{ cursor: "pointer" }} onClick={() => handleKittingPart(details, details?.key)} /> :
                <img src={barcodeIcon} alt="" style={{ cursor: "not-allowed" }} />
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
        title: "UOM",
        dataIndex: "uom"
    },
    {
        title: "Labeled Count",
        dataIndex: "totalLabeledQty",
    },
    {
        title: "Balanced Count",
        dataIndex: "balanceQty"
    },
    {
        title: "Param List",
        dataIndex: "paramList",
        render: (paramList) => paramList?.length > 0 ? paramList?.map((param, index) => <p style={{ textAlign: "left" }}> {index + 1}. {param}</p>) : "",
        width: 250,
    },
    {
        title: "ODS",
        dataIndex: "ods1"
    },
    {
        title: "ODS",
        dataIndex: "ods2"
    }
];

export const tabsData = [
    { key: "1", label: "Individual", content: "individual" },
    { key: "2", label: "Grouped", content: "grouped" },
];