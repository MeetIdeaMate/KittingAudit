import dayjs from "dayjs";
import React from "react";

export const LabelPrint = ({ stickers }) => {
    const MAX_ROWS = 12;
    const GROUPS = 2;
    const splitByBomQty = (parts, bomQty) => {
        if (bomQty < 2) return null;
        if (parts?.length <= 1) return [parts];
        const labels = Array.from({ length: bomQty }, () => []);
        parts.forEach((part, i) => {
            labels[i % bomQty].push(part);
        });
        return labels;
    };

    const splitByMaxParts = (parts, bomQty) => {
        if (bomQty !== 1) return null;
        const MAX = 16;
        if (parts?.length <= MAX) return [parts];
        const labels = [];
        for (let i = 0; i < parts?.length; i += MAX) {
            labels.push(parts.slice(i, i + MAX));
        }
        return labels;
    };

    const labelSplitStrategies = [
        splitByBomQty,
        splitByMaxParts,
    ];

    const splitPartsIntoLabels = (parts = [], bomQty = 1) => {
        for (const strategy of labelSplitStrategies) {
            const result = strategy(parts, bomQty);
            if (result !== null) return result;
        }
        return [parts];
    };

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

    const parts = (stickers?.partDetails || [])?.map((part) => ({
        partNumber: part?.partNumber || "",
        totalQty: part?.totalQty ?? part?.quantity ?? "",
    }));

    const gridRows = createGridRows(parts);
    const grossWeight = stickers?.grossWeight ?? 0;

    const labelDetails = splitPartsIntoLabels(parts, stickers?.bomQty);

    return (
        <>
            {
                labelDetails?.map((parts, labelIndex) => {
                    return (
                        <div style={{ ...pageStyle, pageBreakAfter: labelIndex < labelDetails?.length - 1 ? "always" : "auto", breakAfter: labelIndex < labelDetails?.length - 1 ? "always" : "auto" }}>
                            <div style={rotateContainer}>
                                <div style={leftSection}>
                                    <div style={header}>
                                        <div style={{ flex: 1, padding: "0px 4px" }}>
                                            <div style={{ fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #000" }}>
                                                CONTRACT NO: {stickers?.crNumber}
                                            </div>
                                            <div style={{ borderBottom: "1px solid #000" }}>
                                                <h1 style={{ padding: 0, margin: 0, fontSize: "18px", fontWeight: "900", whiteSpace: "nowrap" }}>
                                                    {stickers?.parentPartNumber}
                                                </h1>
                                            </div>
                                            <div style={{ fontSize: "14px", fontWeight: "700", textAlign: "center", borderBottom: "1px solid #000" }}>
                                                {stickers?.description}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ width: "100%", display: "flex" }}>
                                        <h6 style={{ width: "25%", padding: 0, margin: 0, borderRight: "1px solid #000" }}>
                                            GROSS WEIGHT:
                                        </h6>
                                        <h6 style={{ padding: 0, margin: 0 }}>{grossWeight > 0 ? `${grossWeight} KGS` : ""}</h6>
                                    </div>

                                    <table style={table}>
                                        <thead>
                                            <tr>
                                                <th style={th}>S.No</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
                                                <th style={th}>Part Numbers</th>
                                                <th style={th}>QTY</th>
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
                                            {stickers?.date
                                                ? dayjs(stickers?.date).format("DD-MM-YYYY")
                                                : ""}
                                        </div>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={text}>Product <br />Color</div>
                                        <p style={text}>CODIFICATION</p>
                                    </div>
                                    <div style={sectionStyle}>
                                        <div style={{ ...text, fontSize: "14px" }}>Case No.</div>
                                        <div style={{ ...text, fontSize: "16px" }}>
                                            {labelIndex + 1}/{labelDetails?.length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
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
    backgroundColor: "#fff !important",
};

const rotateContainer = {
    width: "145mm",
    height: "95mm",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: "-47mm",
    marginLeft: "-69mm",
    transform: "rotate(90deg)",
    transformOrigin: "center center",
    display: "flex",
    flexDirection: "row",
    boxSizing: "border-box",
    backgroundColor: "#fff",
};

const leftSection = {
    width: "75%",
    height: "100%",
    borderRight: "1px solid black",
    padding: "2mm",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
};

const rightSection = {
    width: "25%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
};

const header = {
    fontSize: "13px",
    fontWeight: "700",
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
    fontWeight: "900",
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
    fontWeight: 900,
};

const badge = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "4px 8px",
    fontSize: "11px",
};