import Barcode from "react-barcode";

const LABEL_WIDTH = "1.95in";   // 49.5mm
const LABEL_HEIGHT = "0.94in";  // 24mm
const ROW_WIDTH = "3.94in";     // 100mm
const ROW_HEIGHT = "0.98in";    // 25mm

export const PrintStickerLabels = ({ vendorNumber, childPartLabels = [] }) => {

    const chunkArray = (arr, size) => {
        const result = [];
        for (let i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    };

    const rows = chunkArray(childPartLabels, 2);

    const LabelContent = ({ barcodeValue, title, subtitle, qty, printingType }) => (
        <div
            style={{
                width: LABEL_WIDTH,
                height: LABEL_HEIGHT,
                border: "1px solid #999",
                borderRadius: "3px",
                padding: "6px 10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                overflow: "hidden",
                boxSizing: "border-box"
            }}
        >
            <div style={{ textAlign: "center", lineHeight: 1 }}>
                <Barcode
                    value={barcodeValue || ""}
                    width={1}
                    height={16}
                    fontSize={9}
                    margin={0}
                    format="CODE128"
                    displayValue={true}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: qty ? "space-between" : "flex-start",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}
                >
                    {title || ""}
                </span>
                {printingType === "GROUPED" && (
                    <span style={{ fontSize: "10px", fontWeight: "bold" }}>
                        Qty : {qty}
                    </span>
                )}
            </div>
            <span
                style={{
                    fontSize: "8px",
                    color: "#000",
                    fontWeight: "600"
                }}
            >
                {subtitle} : {vendorNumber}
            </span>
        </div>
    );

    return (
        <div style={{ width: ROW_WIDTH, margin: "0 auto" }}>
            {rows.map((row, rowIndex) => {

                const updatedRow =
                    row.length === 1
                        ? [...row, { partNumber: "", barCode: "" }]
                        : row;

                return (
                    <div
                        key={rowIndex}
                        style={{
                            width: ROW_WIDTH,
                            height: ROW_HEIGHT,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            breakAfter: rowIndex !== rows?.length - 1 ? "page" : "auto"
                        }}
                    >
                        {updatedRow?.map((item, index) => (
                            <LabelContent
                                key={`${item?.barCode}-${index}`}
                                printingType={item?.printingType}
                                barcodeValue={item?.barCode}
                                title={item?.partNumber}
                                subtitle="OTIS VENDOR"
                                qty={item?.qty}
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};