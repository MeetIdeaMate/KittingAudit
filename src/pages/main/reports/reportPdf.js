import dayjs from "dayjs";
import { tl_pdf_logo } from "../../../assets/images";
import "./style.scss";

export const DispatchPrint = ({ tableData = [], filters = {}, cumulativeData = {} }) => {
    return (
        <div className="dispatch-print">
            <div className="dispatch-print-header">
                <div className="dispatch-print-company">
                    <img
                        src={tl_pdf_logo}
                        alt="logo"
                    />
                </div>
                <div className="dispatch-print-date">
                    Date : {dayjs().format("DD-MM-YYYY")}
                </div>
            </div>
            <div className="flexible">
                <div className="dispatch-print-title">
                    {filters?.reportType}
                </div>
                <div className="info-containerPdf">
                    <div className="info-box-pdf">
                        <p className="title">Total CR:</p>
                        <p className="value">{cumulativeData?.totalCrNumbers ?? 0}</p>
                    </div>

                    <div className="info-box-pdf">
                        <p className="title">Total FIM:</p>
                        <p className="value">{cumulativeData?.totalParentNumbers ?? 0}</p>
                    </div>

                    <div className="info-box-pdf">
                        <p className="title">Total SubParts:</p>
                        <p className="value">{cumulativeData?.totalSubPartNumbers ?? 0}</p>
                    </div>

                    <div className="info-box-pdf">
                        <p className="title">Total Quantity:</p>
                        <p className="value">{cumulativeData?.totalQty ?? 0}</p>
                    </div>
                </div>
            </div>
            <table className="dispatch-print-table">
                <thead>
                    <tr>
                        <th style={{ width: "60px" }}>S.No</th>
                        <th style={{ width: "90px" }}>CR Date</th>
                        <th style={{ width: "90px" }}>Dispatch Date</th>
                        <th style={{ width: "90px" }}>Kanban Date</th>
                        <th>Contract No</th>
                        <th>Part Number</th>
                        <th>Week No</th>
                        <th style={{ width: "60px" }}>BOM Qty</th>
                        <th style={{ width: "60px" }}>Total Qty</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData?.content?.map((item, index) => (
                            <tr key={item?.key || index}>
                                <td>{index + 1}</td>
                                <td>{item?.date ? dayjs(item?.date).format("DD-MM-YYYY") : "-"}</td>
                                <td>{item?.dispatchDate ? dayjs(item?.dispatchDate).format('DD-MM-YYYY') : "-"}</td>
                                <td>{item?.kanbanDate ? dayjs(item?.kanbanDate).format('DD-MM-YYYY') : "-"}</td>
                                <td>{item?.crNumber || "-"}</td>
                                <td>{item?.parentPartNumber || "-"}</td>
                                <td>{item?.weekNo || "-"}</td>
                                <td>{item?.bomQty || "-"}</td>
                                <td>{item?.totalQty || "-"}</td>
                                <td>{item?.description || "-"}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};