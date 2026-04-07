import Barcode from "react-barcode";

const LABEL_WIDTH = "1.95in";   // 49.5mm
const LABEL_HEIGHT = "0.94in";  // 24mm
const ROW_WIDTH = "3.94in";     // 100mm
const ROW_HEIGHT = "0.98in";    // 25mm

export const PrintStickerLabels = ({ stickers, tabDetails }) => {

    const {
        templabeledinfoMap,
        dublicateBarcode,
        isDublicate,
        labelMap,
        mode,
        printingType,
        missingList,
    } = stickers;

    const filteredEntries = (dublicateBarcode || [])
        ?.map(code => code?.barcodeId?.split("-").pop())
        ?.filter(key => templabeledinfoMap?.hasOwnProperty(key))
        ?.map(key => [key, templabeledinfoMap[key]]);

    const filteredMap = Object.fromEntries(filteredEntries);

    const getNewlyAddedMap = (prevMap = {}, currMap = {}) => {
        return Object.fromEntries(
            Object.entries(currMap)
                ?.filter(([key]) => !prevMap?.hasOwnProperty(key))
        );
    };

    let printMap = templabeledinfoMap;

    if (mode === "update") {
        printMap =
            tabDetails?.activeTab === "individual"
                ? templabeledinfoMap
                : getNewlyAddedMap(labelMap, templabeledinfoMap);
    } else if (isDublicate && mode !== "edit") {
        printMap = filteredMap;
    }

    const entries = Object.entries(printMap || {});
    const sumValues = (map = {}) =>
        Object.values(map)?.reduce((s, v) => s + (Number(v) || 0), 0);

    const prevTotal = sumValues(labelMap || {});
    const currTotal = sumValues(templabeledinfoMap || {});

    const printQty =
        mode === "update"
            ? Math.max(currTotal - prevTotal, 0)
            : currTotal;

    const startIndex = mode === "update" ? prevTotal + 1 : 1;

    let labelsArray = [];
    let customEntries = [];

    if (printingType === "INDIVIDUAL" && missingList?.length) {
        const selectedKeys = missingList?.map(item => item?.split("-")?.pop());
        selectedKeys?.forEach(key => {
            const qty = labelMap?.[key] || 0;
            for (let i = 0; i < qty; i++) {
                labelsArray.push(Number(key));
            }
        });
    }
    else if (printingType === "GROUPED" && missingList?.length) {
        const selectedKeys = missingList
            ?.map(item => item?.split("-")?.pop());
        customEntries = selectedKeys?.map(key => [key, labelMap?.[key]]);
    } else {
        labelsArray = Array.from({ length: printQty }, (_, i) => startIndex + i);
    }

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const rows =
        tabDetails?.activeTab === "individual"
            ? chunkArray(labelsArray, 2)
            : chunkArray(
                customEntries?.length ? customEntries : entries,
                2
            );

    const LabelContent = ({ barcodeValue, title, subtitle, extraRight }) => (
        <div
            style={{
                width: LABEL_WIDTH,
                height: LABEL_HEIGHT,
                border: "1px solid #999",
                borderRadius: "3px",
                padding: "2px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden",
                boxSizing: "border-box",
            }}
        >
            {/* Barcode */}
            <div style={{ textAlign: "center", lineHeight: 1 }}>
                <Barcode
                    value={barcodeValue}
                    width={1}
                    height={16}
                    fontSize={7}
                    margin={0}
                    format="CODE128"
                    displayValue={true}
                />
            </div>

            {/* Label text */}
            <div
                style={{
                    display: "flex",
                    justifyContent: extraRight ? "space-between" : "flex-start",
                    alignItems: "center",
                    marginTop: "1px",
                }}
            >
                <span style={{ fontSize: "9px", fontWeight: "bold", margin: 0 }}>
                    {title}
                </span>
                {extraRight && (
                    <span style={{ fontSize: "9px", fontWeight: "bold", margin: 0 }}>
                        {extraRight}
                    </span>
                )}
            </div>

            <span style={{ fontSize: "8px", margin: 0, color: "#333" }}>
                {subtitle}
            </span>
        </div>
    );


    return (
        <>
            <div
                style={{
                    width: "99mm",
                    margin: "0 auto", 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    // margin: "0",
                    padding: 0,
                }}
            >
                {rows?.map((row, rowIndex) => {
                    let updatedRow = [...row];
                    if (row?.length === 1) {
                        updatedRow.push("empty");
                    }

                    return (
                        <div
                            key={rowIndex}
                            style={{
                                width: ROW_WIDTH,
                                height: ROW_HEIGHT,
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 0,
                                breakAfter: "page",
                                pageBreakAfter: rowIndex !== rows.length - 1 ? "always" : "auto",
                                breakInside: "avoid",
                                boxSizing: "border-box"
                            }}
                        >
                            {updatedRow?.map((item, index) => {
                                // Empty placeholder
                                if (item === "empty") {
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                width: LABEL_WIDTH,
                                                height: LABEL_HEIGHT,
                                            }}
                                        />
                                    );
                                }

                                // Individual tab
                                if (tabDetails?.activeTab === "individual") {
                                    const key = item;
                                    return (
                                        <LabelContent
                                            key={key}
                                            barcodeValue={`${stickers?.barCode}-${key}`}
                                            title={`${stickers?.partNumber}-${key}`}
                                            subtitle="OTIS VENDOR:"
                                        />
                                    );
                                }

                                // Grouped tab
                                if (tabDetails?.activeTab === "grouped") {
                                    const [key, value] = item;
                                    return (
                                        <LabelContent
                                            key={index}
                                            barcodeValue={`${stickers?.barCode}-${key}`}
                                            title={stickers?.partNumber}
                                            extraRight={value}
                                            subtitle="OTIS VENDOR:"
                                        />
                                    );
                                }

                                return null;
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
};