import dayjs from "dayjs";
import React from "react";
import Barcode from "react-barcode";

export const MainBarcode = ({ stickers }) => {

    const MAX_ROWS = 12;
    const GROUPS = 3;

    const createGridRows = (parts = []) => {
        const rows = [];
        for (let i = 0; i < MAX_ROWS; i++) {
            const row = [];
            for (let g = 0; g < GROUPS; g++) {
                const partIndex = i + g * MAX_ROWS;
                row.push(parts[partIndex] || { partNumber: "", totalQty: "" });
            }
            rows.push(row);
        }
        return rows;
    };
    return (
        <>
            {stickers?.packingLabelResponses?.map((details, index) => {
                const gridRows = createGridRows(details?.packingDetailsRes || []);
                const isLast = index === stickers.packingLabelResponses.length - 1;
                return (
                    <React.Fragment key={index}>

                        <div style={{ ...pageStyle, pageBreakAfter: "always", breakAfter: "page" }}>
                            <div style={rotateContainer}>
                                <div style={leftSection}>
                                    <div style={header}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div><h1 style={{ padding: 0, margin: 0, fontSize: "28px", whiteSpace: "nowrap" }}>{stickers?.parentPartNumber}</h1></div>
                                            <div>
                                                <p style={{ fontSize: "14px", padding: 0, margin: 0 }}>
                                                    {details?.barCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={barcodeContainer}>
                                        <Barcode
                                            value={details?.barCode || "BARCODE"}
                                            width={1.4}
                                            height={30}
                                            margin={0}
                                            displayValue={false}
                                            format="CODE128"
                                        />
                                    </div>
                                    <div style={{ width: "100%", display: "flex" }}>
                                        <h6 style={{ width: "50%", padding: 0, margin: 0 }}>GROSS WEIGHT</h6>
                                        <h6 style={{ width: "50%", padding: 0, margin: 0 }}>{stickers?.description}</h6>
                                    </div>
                                    <table style={table}>
                                        <thead>
                                            <tr>
                                                <th style={th}>S.No</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gridRows.map((row, i) => (
                                                <tr key={i}>
                                                    <td style={td}>{i + 1}</td>
                                                    {row.map((item, idx) => (
                                                        <React.Fragment key={idx}>
                                                            <td style={td}>{item?.partNumber}</td>
                                                            <td style={td}>{item?.totalQty}</td>
                                                        </React.Fragment>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={rightSection}>
                                    <div style={sectionStyle}>
                                        <span style={badge}>OTIS-BW</span>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>PACKED BY</div>
                                        <div style={text}>
                                            {stickers?.packedBy ?? sessionStorage.getItem("name")}
                                        </div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>DATE</div>
                                        <div style={text}>
                                            {stickers?.packedDate
                                                ? dayjs(stickers?.packedDate).format("DD-MM-YYYY")
                                                : ""}
                                        </div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>Product Color</div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>Case No.</div>
                                        <div style={text}>{index + 1}</div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>
                                            {stickers?.packingLabelResponses?.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            ...pageStyle, pageBreakAfter: isLast ? "auto" : "always",
                            breakAfter: isLast ? "auto" : "page"
                        }}>
                            <div style={secondRotateContainer}>
                                <div style={{ padding: "0 8px" }}>
                                    <h1 style={{ padding: 0, margin: 0, fontSize: "30px", whiteSpace: "nowrap" }}>
                                        Contract No: {stickers?.crNumber}
                                    </h1>
                                    <Barcode
                                        value={stickers?.crNumber || "BARCODE"}
                                        width={1}
                                        height={25}
                                        displayValue={false}
                                        format="CODE128"
                                    />
                                </div>
                                <div style={{ padding: "0 8px" }}>
                                    <h1 style={{ padding: 0, margin: 0, fontSize: "30px", whiteSpace: "nowrap" }}>
                                        Item : {stickers?.parentPartNumber}
                                    </h1>
                                    <Barcode
                                        value={stickers?.parentPartNumber || "BARCODE"}
                                        width={1}
                                        height={25}
                                        displayValue={false}
                                        format="CODE128"
                                    />
                                </div>
                                <div style={footerRow}>
                                    <div>
                                        <h1 style={{ padding: 0, margin: 0, fontSize: "30px", whiteSpace: "nowrap" }}>
                                            Qty: {(index + 1) === 1 ? "" : "Refer Box-"}{stickers?.bomQty || "0"}
                                        </h1>
                                        {(index + 1) === 1 &&
                                            <Barcode
                                                value={stickers?.bomQty || "0"}
                                                width={1}
                                                height={20}
                                                displayValue={false}
                                                format="CODE128"
                                            />
                                        }
                                    </div>
                                    <div style={caseBox}>
                                        Case No
                                        <br />
                                        {index + 1} / {stickers?.packingLabelResponses?.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </React.Fragment>
                );
            })}
        </>
    );
};

const pageStyle = {
    width: "99mm",
    height: "145mm",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    position: "relative",
};

const rotateContainer = {
    width: "145mm",
    height: "95mm",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-47mm",
    marginLeft: "-73mm",
    transform: "rotate(90deg)",
    transformOrigin: "center center",
    display: "flex",
    flexDirection: "row",
    boxSizing: "border-box",
    border: "1px solid black",
    backgroundColor: "#fff"
};

const secondRotateContainer = {
    width: "145mm",
    height: "95mm",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-47mm",
    marginLeft: "-73mm",
    transform: "rotate(90deg) scale(0.98)",
    transformOrigin: "center center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    overflow: "hidden",
    padding: "3mm",
};

const leftSection = {
    width: "85%",
    height: "100%",
    borderRight: "1px solid black",
    padding: "2mm",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
};

const rightSection = {
    width: "15%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
};

const header = {
    fontSize: "13px",
    fontWeight: "700",
    padding: "3px",
    borderBottom: "1px solid #000",
};

const barcodeContainer = {
    textAlign: "center",
    padding: "3px 0",
    borderBottom: "1px solid #000",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
    border: "1px solid #000",
};

const th = {
    border: "1px solid #000",
    textAlign: "center",
    fontWeight: "600",
    lineHeight: "14px",
};

const td = {
    border: "1px solid #000",
    textAlign: "center",
    lineHeight: "16px",
    fontWeight: "900"
};

const sectionStyle = {
    flex: 1,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
};

const text = {
    fontSize: "11px",
    margin: 0,
    fontWeight: 900
};

const badge = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "11px",
};

const footerRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 8px",
};

const caseBox = {
    border: "2px solid #000",
    padding: "5px 40px",
    textAlign: "center",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};