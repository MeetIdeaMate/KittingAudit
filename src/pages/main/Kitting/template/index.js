import React from "react";
import Barcode from "react-barcode";

export const PrintStickerLabels = ({
    stickers,
    tabDetails,
}) => {
    const { templabeledinfoMap, dublicateBarcode, isDublicate, labelMap, mode } = stickers;

    const filteredEntries = (dublicateBarcode || [])
        ?.map(code => code?.barcodeId?.split("-").pop())
        ?.filter(key => templabeledinfoMap?.hasOwnProperty(key))
        ?.map(key => [key, templabeledinfoMap[key]]);

    const filteredMap = Object.fromEntries(filteredEntries);

    const getNewlyAddedMap = (prevMap = {}, currMap = {}) => {
        return Object.fromEntries(
            Object.entries(currMap)
                .filter(([key]) => !prevMap.hasOwnProperty(key))
        );
    };

    let printMap = templabeledinfoMap;

    if (mode === "update") {
        printMap = tabDetails?.activeTab === "individual" ? templabeledinfoMap : getNewlyAddedMap(labelMap, templabeledinfoMap);
    } else if (isDublicate && mode !== "edit") {
        printMap = filteredMap;
    }

    const entries = Object.entries(printMap || {});
    const sumValues = (map = {}) =>
        Object.values(map)
            .reduce((s, v) => s + (Number(v) || 0), 0);
    const prevTotal = sumValues(labelMap);
    const currTotal = sumValues(templabeledinfoMap);
    const printQty = mode === "update"
        ? Math.max(currTotal - prevTotal, 0)
        : currTotal;
    const startIndex = mode === "update" ? prevTotal + 1 : 1;
    const labelsArray = Array.from({ length: printQty }, (_, i) => startIndex + i);

    return <React.Fragment>
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
            }}
        >
            {tabDetails?.activeTab === "individual" &&
                labelsArray?.map((key) => (
                    <div
                        key={key}
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
                            <h3>{stickers?.partNumber}-{key}</h3>
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