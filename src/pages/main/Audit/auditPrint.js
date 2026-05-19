import React from "react";
import "./style.scss";
import { tl_pdf_logo } from "../../../assets/images";
import dayjs from "dayjs";
const AuditReport = ({ selectedRecord }) => {
    return (
        <div className="audit-report">
            <div className="report-header">
                <div className="logo-section">
                    <img src={tl_pdf_logo} alt="" />
                </div>
                <div>
                    <h2>Contract - Wise Packed Audit Report</h2>
                    <p>
                        Contract No : <strong>{selectedRecord?.parentPartNumber || "-"}</strong>
                    </p>
                </div>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "40px" }}>S.No</th>
                            <th>Bill of Material</th>
                            <th>Week No</th>
                            <th style={{ width: "90px" }}>Quantity</th>
                            <th>Remarks</th>
                            <th>Hardware Inspection Remarks</th>
                            <th>Kitting Inspection Remarks</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedRecord?.partDetails?.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.partNumber}</td>
                                <td>{selectedRecord?.weekNo}</td>
                                <td>{item?.quantity}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bottom-section">
                <div className="info-box">
                    <div className="info-row">
                        <span>Contract Packed Date</span>
                        <span>{selectedRecord?.date ? dayjs(selectedRecord?.date).format("DD-MM-YYYY") : dayjs().format("DD-MM-YYYY")}</span>
                    </div>
                    <div className="info-row">
                        <span>No of Boxes</span>
                        <span></span>
                    </div>
                    <div className="info-row">
                        <span>Invoice No</span>
                        <span></span>
                    </div>
                    <div className="info-row">
                        <span>Dispatch Date</span>
                        <span></span>
                    </div>
                    <div className="info-row large">
                        <span>Material Condition</span>
                    </div>
                    <div className="info-row large">
                        <span>Remarks</span>
                    </div>
                </div>
                <div className="signature-section">
                    <div className="signature-box">
                        <div>
                            Sign : ................................
                        </div>
                        <div>
                            Date : ................................
                        </div>
                    </div>
                    <div className="note-box">
                        <strong>Note :</strong>
                    </div>
                    <div className="footer-sign">
                        <div>Checked By :</div>
                        <div>Approved By :</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditReport;