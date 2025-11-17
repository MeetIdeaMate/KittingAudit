import React from "react";
import Barcode from "react-barcode";

export const PrintStickerLabels = ({
    stickers,
    tabDetails,
}) => {
    const { templabeledinfoMap, tempduplicateInfoMap , isDublicate  } = stickers;
    const entries = Object.entries( (isDublicate ? tempduplicateInfoMap : templabeledinfoMap) ?? {});
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
                            <h3>{stickers?.partNumber}</h3>

                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Barcode value={stickers?.partNumber ? `${stickers?.partNumber} ` : "BARCODE"}
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
                        <Barcode value={stickers?.partNumber ? `${stickers?.partNumber} ` : "BARCODE"}
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