import Barcode from "react-barcode";
import { otislogoPdf } from "../../../../assets/images";
import dayjs from "dayjs";

const CableMainBarcode = ({ stickers, vendorName }) => {
    return (
        <div className="print-root">
            {stickers?.packingLabelResponses?.map((details, index) => {
                const gridRows = details?.packingDetailsRes || []
                return (
                    <div
                        key={index}
                        className="print-page-wrapper"
                    >
                        <table className="main-print-table">
                            <thead>
                                <tr>
                                    <th colSpan="4">
                                        <div className="header-layout">
                                            <div className="header-top" style={{ borderBottom: "1px solid #000" }}>
                                                <h2 style={{ padding: 0, margin: 0, fontSize: "32px" }}>{stickers?.parentPartNumber}</h2>
                                                <div className="barcode-container">
                                                    <Barcode
                                                        value={details?.barCode || "BARCODE"}
                                                        width={1.5}
                                                        height={30}
                                                        margin={0}
                                                        displayValue={false}
                                                    />
                                                    <p style={{ padding: 0, margin: 0, fontSize: "14px" }}>{details?.barCode}</p>
                                                </div>
                                                <div className="companyLogo"><img src={otislogoPdf} alt="loading" /></div>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan="4">
                                        <div className="header-info">
                                            <div className="info-box">
                                                <p style={{ padding: 0, margin: 0 }}>GROSS WEIGHT :</p>
                                            </div>
                                            <div className="info-box">
                                                <p style={{ padding: 0, margin: 0, fontSize: "14px" }}>Current Qty:  {index + 1}  </p>
                                                <p style={{ padding: 0, margin: 0, fontSize: "14px" }}>Required Qty: {stickers?.packingLabelResponses?.length}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="table-column-headers">
                                    <th style={{ width: '10%', fontSize: "14px" }}>Sl. No</th>
                                    <th style={{ width: '30%', fontSize: "14px" }}>PART NO.</th>
                                    <th style={{ width: '50%', fontSize: "14px" }}>DESCRIPTION</th>
                                    <th style={{ width: '10%', fontSize: "14px" }}>QTY</th>
                                </tr>
                                {gridRows?.map((row, rowIdx) => (
                                    <tr key={rowIdx}>
                                        <td style={{ textAlign: "center", fontSize: "14px" }}>{rowIdx + 1}</td>
                                        <td style={{ paddingLeft: "5px", fontSize: "14px" }}>{row?.partNumber}</td>
                                        <td style={{ paddingLeft: "5px", fontSize: "14px" }}>{row?.description}</td>
                                        <td style={{ textAlign: "center", fontSize: "14px" }}>{row?.totalQty}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4">
                                        <div className="footer-barcodes" style={{ padding: "5px", borderBottom: "1px solid #000", borderTop: "1px solid #000" }}>
                                            <div className="footer-item">
                                                <h2 style={{ padding: 0, margin: 0 }}>Contract No: {stickers?.crNumber}</h2>
                                                <Barcode value={stickers?.crNumber || "BARCODE"} width={1} height={30} displayValue={false} />
                                            </div>
                                            <div className="footer-item">
                                                <h2 style={{ padding: 0, margin: 0 }}>Item: {stickers?.parentPartNumber}</h2>
                                                <Barcode value={stickers?.parentPartNumber || "BARCODE"} width={1} height={30} displayValue={false} />
                                            </div>
                                            <div className="footer-item">
                                                <h2 style={{ padding: 0, margin: 0 }}>Qty: {stickers?.bomQty}</h2>
                                                <Barcode value={String(stickers?.bomQty) || "BARCODE"} width={1} height={30} displayValue={false} />
                                            </div>
                                        </div>
                                        <div className="footer-bottom">
                                            <div className="signature">
                                                <p style={{ padding: 0, margin: 0, fontWeight: 700 }}>Packed By: {stickers?.packedBy} </p>
                                                <p style={{ padding: 0, margin: 0, fontWeight: 700 }}>Date: {dayjs(stickers?.packedDate).format('DD/MM/YYYY hh:mm:ss A')}</p>
                                            </div>
                                            <div>
                                                <p style={{ padding: 0, margin: 0, fontWeight: 700 }}>SUPPLIED BY : </p>
                                                <p style={{ padding: 0, margin: 0, fontWeight: 700 }}>{vendorName}</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}
export default CableMainBarcode