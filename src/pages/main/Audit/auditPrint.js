import React from "react";
import "./style.scss";
import { tl_pdf_logo } from "../../../assets/images";

const tableData = [
    {
        sno: 1,
        material: "NAA5701AP4",
        weekNo: "202538A",
        quantity: 50,
    },
    {
        sno: 2,
        material: "NPK5710C014",
        weekNo: "202538A",
        quantity: 10,
    },
    {
        sno: 3,
        material: "NAA5701AP4",
        weekNo: "202538A",
        quantity: 10,
    },
    {
        sno: 4,
        material: "NAA368ZP9",
        weekNo: "202538A",
        quantity: 10,
    },
    {
        sno: 5,
        material: "NAA27076KX3",
        weekNo: "202538A",
        quantity: 5,
    },
    {
        sno: 6,
        material: "NAA27076KX3",
        weekNo: "202538A",
        quantity: 5,
    },
];

const AuditReport = () => {
    return (
        <div className="audit-report">
            <div className="report-header">
                <div className="logo-section">
                    <img src={tl_pdf_logo} alt="" />
                </div>

                <h2>Contract - Wise Packed Audit Report</h2>

                <p>
                    Contract No : <strong>52N1X097-MFIM8.1</strong>
                </p>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Bill of Material</th>
                            <th>Week No</th>
                            <th>Quantity</th>
                            <th>Remarks</th>
                            <th>Hardware Inspection Remarks</th>
                            <th>Kitting Inspection Remarks</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableData.map((item) => (
                            <tr key={item.sno}>
                                <td>{item.sno}</td>
                                <td>{item.material}</td>
                                <td>{item.weekNo}</td>
                                <td>{item.quantity}</td>
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
                        <span>29-04-2026</span>
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