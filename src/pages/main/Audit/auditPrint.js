import React from "react";
import "./style.scss";
import dayjs from "dayjs";
import { CSLBASEURL, MASTERDATA_URL } from "../../../apiservices/endpoints";

const formatStatusLabel = (status) => {
    if (!status) return "Pending";
    return status
        .toString()
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (changeStatus) => changeStatus.toUpperCase());
};

const TableHead = () => (
    <thead>
        <tr>
            <th style={{ width: "6%" }}>No</th>
            <th style={{ width: "14%" }}>Bill of Material</th>
            <th style={{ width: "10%" }}>Qty as per VEW CSL</th>
            <th style={{ width: "31%" }}>Part Description</th>
            <th style={{ width: "15%" }}>Remarks</th>
            <th style={{ width: "14%" }}>CN Number</th>
            <th style={{ width: "10%" }}>Status</th>
        </tr>
    </thead>
);

const ImageGallery = ({ images }) => {
    const resolved = (images || [])?.filter(Boolean);
    if (!resolved?.length) return null;

    return (
        <div className="image-gallery">
            {resolved?.map((src, idx) => (
                <div className="gallery-item" key={`gallery-${idx}`}>
                    <img src={src} alt={`part-${idx}`} />
                </div>
            ))}
        </div>
    );
};
const BottomImageStrip = ({ images }) => {
    const resolved = (images || [])?.filter(Boolean);

    if (!resolved?.length) return null;

    const columns = Math.max(3, resolved?.length);

    return (
        <div
            className="captured-strip"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
        >
            {resolved?.map((src, idx) => (
                <div
                    className="captured-item"
                    key={`bottom-img-${idx}`}
                >
                    <img src={src} alt={`overflow-small-${idx}`} />
                </div>
            ))}
        </div>
    );
};

const BottomSection = ({ selectedRecord }) => (
    <div className="footer-fixed">
        <div className="footer-meta-row">
            <span>
                <b>Contract Packed Date</b>
                {selectedRecord?.packingDate
                    ? dayjs(selectedRecord?.packingDate).format("DD-MM-YYYY")
                    : dayjs().format("DD-MM-YYYY")}
            </span>
            <span>
                <b>No of Box</b>
                {selectedRecord?.noOfBox ?? ""}
            </span>
            <span>
                <b>Material Condition</b>
                {selectedRecord?.materialCondition ?? ""}
            </span>
        </div>

        <div className="footer-remark-row">
            <b>Remarks</b>
            {selectedRecord?.remark ?? ""}
        </div>

        <div className="footer-signatures">
            <div className="sig-block">
                <span className="sig-line"></span>
                <span className="sig-label">Checked By</span>
            </div>
            <div className="sig-block">
                <span className="sig-line"></span>
                <span className="sig-label">Approved By</span>
            </div>
        </div>
    </div>
);

const SMALL_PART_LIMIT = 4;
const BOTTOM_STRIP_LIMIT = 3;

const AuditReport = ({ selectedRecord, vendorName }) => {
    const partDetails = selectedRecord?.partDetails ?? [];
    const totalRowCount = partDetails?.length;
    const shouldBreakBeforeBottom = totalRowCount > 18;
    const partThumbs = partDetails?.map(detail => detail?.capturedImageUrls?.[0] || detail?.referenceImageUrl)?.filter(Boolean)?.map(urls=>  `${MASTERDATA_URL}/get_image/${urls}`) || [];
    const parentImage = selectedRecord?.parentPartImageUrls?.map(urls=>  `${CSLBASEURL}/get_parentPart_image/${urls}`)?.filter(Boolean) || [];
    const smallGalleryImages = partThumbs.slice(0, SMALL_PART_LIMIT);
        const overflowSmallImages =partThumbs?.length > 4 ? [...(parentImage?.slice(0, 2) || []), ...(partThumbs?.slice(4,6) || [])] : parentImage.slice(0,BOTTOM_STRIP_LIMIT);
    const bottomStripImages = overflowSmallImages;

    return (
        <div className="audit-report">
            <div className="report-main">
                <div className="report-header">
                    <div className="header-left">
                        <h3>{vendorName}</h3>
                        <p>Contract - Wise Packed Audit Report</p>
                    </div>
                    <div className="header-right">
                        <span>Date - {dayjs(selectedRecord?.date).format("DD-MM-YYYY")}</span>
                        <span>Contract No : {selectedRecord?.parentPartNumber || ""}</span>
                    </div>
                </div>

                <div className="report-body">
                    <div className="table-section">
                        <div className="table-wrapper">
                            <table>
                                <TableHead />
                                <tbody>
                                    {partDetails?.map((details, index) => (
                                        <tr key={`data-${index}`}>
                                            <td>{index + 1}</td>
                                            <td className="left">{details?.partNumber ?? ""}</td>
                                            <td>{details?.quantity ?? ""}</td>
                                            <td className="left">{details?.description ?? ""}</td>
                                            <td className="left">{details?.remark ?? ""}</td>
                                            <td>{selectedRecord?.crNumber ?? ""}</td>
                                            <td className="status-cell">
                                                {formatStatusLabel(details?.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    <BottomImageStrip images={bottomStripImages} />
                    </div>

                    <ImageGallery images={smallGalleryImages} />
                </div>
            </div>
            <div className={shouldBreakBeforeBottom ? "bottom-section-break" : ""}>
                <BottomSection selectedRecord={selectedRecord} />
            </div>
        </div>
    );
};

export default AuditReport;