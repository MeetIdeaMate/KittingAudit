import dayjs from "dayjs";
import { tl_pdf_logo } from "../../../assets/images";
import "./style.scss";

export const DispatchPrint = ({ tableData = [], filters = {} }) => {
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
            <div className="dispatch-print-title">
                {filters?.reportType}
            </div>
            <table className="dispatch-print-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>CR Date</th>
                        <th>Dispatch Date</th>
                        <th>Kanban Date</th>
                        <th>Contract No</th>
                        <th>Part Number</th>
                        <th>Week No</th>
                        <th>BOM Qty</th>
                        <th>Total Qty</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData?.content?.map((item, index) => (
                            <tr key={item?.key || index}>
                                <td>{index + 1}</td>
                                <td>{item?.date || "-"}</td>
                                <td>{item?.dispatchDate || "-"}</td>
                                <td>{item?.kanbanDate || "-"}</td>
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