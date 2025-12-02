import React from "react";
import Barcode from "react-barcode";

export const MainBarcode = ({ stickers }) => {

    const MAX_ROWS = 8;
    const GROUPS = 2;
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

    return <React.Fragment>
        {stickers?.packingLabelResponses?.map((details, index) => {
            const gridRows = createGridRows(details?.packingDetailsRes || []);

            return <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <div style={{ width: "49%", border: "1px solid #ccc" }}>
                    <div style={{ padding: "2px" }}>
                        <div style={{
                            fontSize: "22px",
                            fontWeight: "700",
                            padding: "6px",
                            borderBottom: "1px solid #ccc"
                        }}>
                            {stickers?.parentPartNumber}
                        </div>

                        <div style={{
                            textAlign: "center",
                            padding: "10px 0",
                            borderBottom: "1px solid #ccc"
                        }}>
                            <Barcode
                                value={stickers?.parentPartNumber || "BARCODE"}
                                width={1.4}
                                height={40}
                                fontSize={14}
                                margin={0}
                                format="CODE128"
                                displayValue={false}
                            />
                        </div>
                        <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "12px",
                        }}>
                            <thead>
                                <tr>
                                    <th style={th}>S.no</th>
                                    <th style={th}>Part Name</th>
                                    <th style={th}>Qty</th>
                                    <th style={th}>Part Name</th>
                                    <th style={th}>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gridRows?.map((row, i) => (
                                    <tr key={i}>
                                        <td style={td}>{i + 1}</td>
                                        {row?.map((item, idx) => (
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
                </div>

                <div style={{ width: "49%", border: "1px solid #cccc" }}>
                    <div style={{ padding: "2px" }}>
                        <h3>CR No: {stickers?.crNumber}</h3>
                        <Barcode value={stickers?.crNumber ? `${stickers?.crNumber}` : "BARCODE"}
                            width={1}
                            height={17}
                            fontSize={10}
                            marginLeft={1}
                            marginRight={1}
                            textMargin={0}
                            marginBottom={1}
                            marginTop={1}
                            format="CODE128"
                            displayValue={false}
                        />
                        <h3>{stickers?.parentPartNumber}</h3>
                        <Barcode value={stickers?.parentPartNumber ? `${stickers?.parentPartNumber}` : "BARCODE"}
                            width={1}
                            height={17}
                            fontSize={10}
                            marginLeft={1}
                            marginRight={1}
                            textMargin={0}
                            marginBottom={1}
                            marginTop={1}
                            format="CODE128"
                            displayValue={false}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
                            <div>
                                <h3>Qty: {details?.totalQty}</h3>
                                <Barcode value={details?.totalQty ? `${details?.totalQty}` : "BARCODE"}
                                    width={1}
                                    height={17}
                                    fontSize={10}
                                    marginLeft={1}
                                    marginRight={1}
                                    textMargin={0}
                                    marginBottom={1}
                                    marginTop={1}
                                    format="CODE128"
                                    displayValue={false}
                                />
                            </div>
                            <div>
                                <h3 style={{ padding: "5px", border: "1px solid #999", borderRadius: "5px" }}>Case.No<br />{index + 1}/{stickers?.packingLabelResponses?.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        })}
    </React.Fragment>
};

const th = {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "center",
    fontWeight: "600"
};

const td = {
    border: "1px solid #ccc",
    padding: "4px",
    textAlign: "center",
};
