import Barcode from "react-barcode";

const LABEL_WIDTH = "100mm";
const LABEL_HEIGHT = "15mm";

export const CablePrintStickerLabels = ({ vendorNumber, childPartLabels = [], vendorName }) => {

    const LabelContent = ({ barcodeValue, title, subtitle, qty, printingType }) => (
        <div
            style={{
                width: LABEL_WIDTH,
                height: LABEL_HEIGHT,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "2mm 4mm",
                boxSizing: "border-box",
                backgroundColor: "#fff",
                overflow: "hidden",
                border: "1px solid #ccc",
                borderRadius: "5px"
            }}
        >
            <div style={{ textAlign: "left", lineHeight: 1 }}>
                <Barcode
                    value={barcodeValue || ""}
                    width={0.8}
                    height={15}
                    fontSize={7}
                    margin={0}
                    format="CODE128"
                    displayValue={false}
                />
                <div style={{ fontSize: "8px", fontWeight: "bold" }}>
                    {barcodeValue}
                </div>
                <span style={{ fontSize: "10px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>{title || ""}</div> 
                    {printingType === "GROUPED" && (
                        <div style={{ fontSize: "8px", fontWeight: "bold" }}>
                            Qty: {qty}
                        </div>
                    )}
                </span>
            </div>
            <div style={{ width: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ fontSize: "9px", fontWeight: 600, lineHeight: "1", width: "100%", textAlign: "right", paddingRight: "30px" }}>
                    <p style={{ padding: 0, margin: 0 }}>{subtitle} {vendorNumber}</p>
                    <br></br>
                    <p style={{ padding: 0, margin: 0 }}>{vendorName}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {childPartLabels?.map((item, index) => (
                <div
                    key={index}
                    style={{
                        width: LABEL_WIDTH,
                        height: LABEL_HEIGHT,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        pageBreakAfter: "always"
                    }}
                >
                    <LabelContent
                        printingType={item?.printingType}
                        barcodeValue={item?.barCode}
                        title={item?.partNumber}
                        subtitle="OTIS VENDOR"
                        qty={item?.qty}
                    />
                </div>
            ))}
        </div>
    );
};