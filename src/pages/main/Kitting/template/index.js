import React from "react";
import Barcode from "react-barcode";

export const PrintStickerLabels = ({
    stickers,
    tabDetails,
}) => {
    const { templabeledinfoMap, dublicateBarcode, isDublicate, mode } = stickers;

    const filteredEntries = (dublicateBarcode || [])
        ?.map(code => code?.barcodeId?.split("-").pop())
        ?.filter(key => templabeledinfoMap?.hasOwnProperty(key))
        ?.map(key => [key, templabeledinfoMap[key]]);

    const filteredMap = Object.fromEntries(filteredEntries);

    const entries = Object.entries((isDublicate && mode !== "edit" ? filteredMap : templabeledinfoMap) ?? {});
    const lastEntry = entries?.[entries?.length - 1];

    const labelInfo = tabDetails?.activeTab === "individual" ? lastEntry?.[1] : 12;
    const labelsArray = Array.from({ length: labelInfo });

    return <React.Fragment>
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
            }}
        >
            {tabDetails?.activeTab === "individual" &&
                labelsArray?.map((details, index) => (
                    <div
                        key={index}
                        style={{
                            width: "calc(50% - 5px)",
                            border: "1px solid #999",
                            padding: "5px",
                            boxSizing: "border-box",
                            borderRadius: "5px",
                            pageBreakInside: "avoid"
                        }}
                    >
                        <div >
                            <h3>{stickers?.partNumber}-{index + 1}</h3>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Barcode value={stickers?.partNumber ? `${stickers?.partNumber}-${index + 1}` : "BARCODE"}
                                width={1}
                                height={17}
                                fontSize={10}
                                marginLeft={1}
                                marginRight={1}
                                textMargin={0}
                                marginBottom={1}
                                marginTop={1}
                                format="CODE128"
                            />
                        </div>
                    </div>
                ))}

            {tabDetails?.activeTab === "grouped" && (entries?.map(([key, value], index) => {
                return <div
                    key={index}
                    style={{
                        width: "calc(50% - 5px)",
                        border: "1px solid #999",
                        padding: "5px",
                        boxSizing: "border-box",
                        borderRadius: "5px",
                        pageBreakInside: "avoid"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3>{stickers?.partNumber}</h3>
                        <h3>{value}</h3>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <Barcode value={stickers?.partNumber ? `${stickers?.partNumber}-${key}` : "BARCODE"}
                            width={1}
                            height={17}
                            fontSize={10}
                            marginLeft={1}
                            marginRight={1}
                            textMargin={0}
                            marginBottom={1}
                            marginTop={1}
                            format="CODE128"
                        />
                    </div>
                </div>
            }))}
        </div>
    </React.Fragment>
};