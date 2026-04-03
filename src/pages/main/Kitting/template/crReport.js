import dayjs from "dayjs";
import { TechLambdasLogo } from "../../../../assets/images";
import "../style.scss";


export const CrReport = ({ crDetails, filterInfo }) => {

    return (
        <div style={{ border: "1px solid #000", width: "100%", padding: "2px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#ccc", WebkitPrintColorAdjust: "exact", padding: "10px", borderBottom: "1px solid #000" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0, color: "#000" }}>
                    <img src={TechLambdasLogo} alt="" style={{ width: "30px" }} />
                    <p><span style={{ color: "orange" }}>Tech</span>Lambdas</p>
                </h3>
                <div>
                    <p style={{ padding: 0, margin: 0 }}><strong>Date:</strong> {dayjs().format("DD-MM-YYYY")}</p>
                    <p style={{ padding: 0, margin: 0 }}><strong>Contract No:</strong> {filterInfo?.crNumber}</p>
                    {filterInfo?.fimNumber && <p style={{ padding: 0, margin: 0 }}><strong>FIM NO:</strong> {filterInfo?.fimNumber}</p>}
                </div>
            </div>
            <div>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
                    <thead>
                        <tr style={{ background: "#f0f0f0", padding: "5px 0" }}>
                            <th>S.No</th>
                            {!filterInfo?.fimNumber && <th>FIM No</th>}
                            <th>Part Number</th>
                            <th style={{ textAlign: "left" }}>Description</th>
                            <th>Quantity</th>
                            <th>Label Type</th>
                            <th>Lable Count</th>
                            <th>Balance Qty</th>
                            <th>Scaned Label</th>
                            <th>Box Qty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {(crDetails?.partDetails ?? []).map((row, index) => (
                            <tr
                                key={index}
                                className={
                                    row?.type === "PARENT" && row?.isSelectd
                                        ? "parent-with-select-row"
                                        : row?.type === "PARENT"
                                            ? "custom-row"
                                            : row?.isSelectd
                                                ? "selectd-row"
                                                : ""
                                }
                                style={{ borderTop: "1px solid #ccc", padding: "10px 0" }}
                            >
                                <td>{index + 1}</td>
                                {!filterInfo?.fimNumber && <td>{row?.fimNumber}</td>}
                                <td>{row?.partNumber}</td>
                                <td style={{ textAlign: "left" }}>{row?.description}</td>
                                <td>{row?.quantity}</td>
                                <td>{row?.printingType}</td>
                                <td>{row?.type === "PARENT" ? row?.kittedQty : row?.totalLabeledQty}</td>
                                <td>{row?.balanceQty}</td>
                                <td>{row?.scannedQty}</td>
                                <td>{row?.packingLabelResponses?.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
