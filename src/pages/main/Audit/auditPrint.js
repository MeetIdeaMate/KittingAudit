import React from "react";
import "./style.scss";
import dayjs from "dayjs";


const TableHead = () => (
    <thead>
        <tr>
            <th style={{ width: "8%" }}>SNo</th>
            <th style={{ width: "16%" }}>Bill of Material</th>
            <th style={{ width: "8%" }}>Qty as per VEW CSL</th>
            <th style={{ width: "8%" }}>Week No</th>
            <th style={{ width: "10%" }}>Gross Weight (in Kg)</th>
            <th style={{ width: "10%" }}>Quantity as per OTIS CSL</th>
            <th style={{ width: "10%" }}>Remark</th>
            <th style={{ width: "15%" }}>Hardware Inspection Remark</th>
            <th style={{ width: "15%" }}>Kitting Inspection Remark</th>
            <th style={{ width: "8%" }}>Remark</th>
        </tr>
    </thead>
);

const BottomSection = ({ selectedRecord }) => (
    <div style={{ width: "100%" }}>
        <table className="bottom-layout-table">
            <tbody>
                <tr className="meta-row">
                    <td className="col-label" style={{ padding: "0" }}>Contract Packed Date</td>
                    <td className="col-value" style={{ padding: "0" }}>
                        {selectedRecord?.date ? dayjs(selectedRecord?.date).format("DD Oct YYYY") : "-"}
                    </td>
                    <td className="signature-cell-container" rowSpan={6} >
                        <div className="sig-flex-inner">
                            <div className="sig-interactive-field">
                                <span >Sign:</span>
                                <span className="ink-faint-line"></span>
                            </div>
                            <div className="sig-interactive-field">
                                <span>Date:</span>
                                <span className="ink-faint-line"></span>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr className="meta-row">
                    <td className="col-label" style={{ padding: "0" }}>No of Boxes</td>
                    <td className="col-value"></td>
                </tr>
                <tr className="meta-row">
                    <td className="col-label" style={{ padding: "0" }}>Invoice No</td>
                    <td className="col-value"></td>
                </tr>
                <tr className="meta-row">
                    <td className="col-label" style={{ padding: "0" }}>Invoice Date</td>
                    <td className="col-value">
                    </td>
                </tr>
                <tr className="meta-row">
                    <td className="col-label" style={{ padding: "0" }}>Dispatch Date</td>
                    <td className="col-value">
                    </td>
                </tr>
                <tr className="meta-row">
                    <td className="col-label" >Material Condition</td>
                    <td className="col-value"></td>
                </tr>
                <tr>
                    <td className="remark-block-cell" colSpan={2}>
                        Remark: <span></span>
                    </td>
                    <td className="note-block-cell">
                        Note: <span></span>
                    </td>
                </tr>
            </tbody>
        </table>

        <div className="outside-approvals-row">
            <div className="approval-signature-line">
                <span>Checked By:</span>
                <span className="">____________________</span>
            </div>
            <div className="approval-signature-line">
                <span>Approved By:</span>
                <span className="">_____________________</span>
            </div>
        </div>
    </div>
);

const AuditReport = ({ selectedRecord, vendorName }) => {
    const partDetails = selectedRecord?.partDetail ?? [];
    return (
        <>
            <div className="audit-report">
                <div className="report-header">
                    <h3 style={{ padding: 0, margin: 0 }}>{vendorName}</h3>
                    <p style={{ padding: 0, margin: 0 }}>Contract-Wise Packed Audit Report</p>
                    <h4 style={{ padding: 0, margin: 0 }}>
                        Contract No : {selectedRecord?.parentPartNumber || ""}
                    </h4>
                </div>
                <div className="table-wrapper">
                    <table>
                        <TableHead />
                        <tbody>
                            {partDetails?.map((details, index) => (
                                <tr key={`data-${index}`}>
                                    <td>{index + 1}</td>
                                    <td className="left">{details?.partNumber ?? ""}</td>
                                    <td>{details?.qtyVEWCSL ?? details?.quantity ?? ""}</td>
                                    <td>{selectedRecord?.weekNo ?? ""}</td>
                                    <td>{details?.grossWeight ?? "-"}</td>
                                    <td>{details?.qtyOTISCSL ?? details?.quantity ?? ""}</td>
                                    <td>{details?.remark ?? ""}</td>
                                    <td>{details?.hardwareInspectionRemark ?? ""}</td>
                                    <td>{details?.kittingInspectionRemark ?? ""}</td>
                                    <td>{details?.finalRemark ?? ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div
                >
                    <BottomSection selectedRecord={selectedRecord} />
                </div>
            </div>
        </>
    );
};

export default AuditReport;