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
            <th style={{ width: "6%" }}>S.No</th>
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
            {resolved?.map((item, idx) => (
                <div className="gallery-item" key={`gallery-${idx}`}>
                    <img src={item?.url} alt={`part-${idx}`} />
                    {item?.partNumber && (
                        <span className="gallery-part-number-overlay">
                            {item?.partNumber}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

const CapturedCell = ({ item, idx }) => {
    if (!item) return <div className="captured-item captured-empty" key={`bottom-img-${idx}`} />;
    if (item?.group) {
        const groupItems = item?.group?.filter(Boolean) || [];
        return (
            <div className="captured-item captured-item-group" key={`bottom-img-${idx}`}>
                {groupItems?.map((sub, subIdx) => (
                    <div className="captured-sub-item" key={`bottom-img-${idx}-${subIdx}`}>
                        <img src={sub?.url ?? sub} alt={`overflow-small-${idx}-${subIdx}`} />
                        {sub?.partNumber && (
                            <span className="captured-part-number-overlay">
                                {sub?.partNumber}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="captured-item" key={`bottom-img-${idx}`}>
            <img src={item?.url ?? item} alt={`overflow-small-${idx}`} />
            {item?.partNumber && (
                <span className="captured-part-number-overlay">
                    {item?.partNumber}
                </span>
            )}
        </div>
    );
};

const BottomImageStrip = ({ images }) => {
    const resolved = (images || [])?.filter(Boolean);
    if (!resolved?.length) return null;
    const columns = 3;
    return (
        <div
            className="captured-strip"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
            {resolved?.map((item, idx) => (
                <CapturedCell item={item} idx={idx} key={`bottom-img-${idx}`} />
            ))}
        </div>
    );
};

const BottomSection = ({ selectedRecord }) => (
    <div className="footer-fixed">
        <div>
            <div className="footer-meta-row">
                <span>
                    <b>Contract Packed Date: </b>
                    {selectedRecord?.packingDate
                        ? dayjs(selectedRecord?.packingDate).format("DD-MM-YYYY")
                        : dayjs().format("DD-MM-YYYY")}
                </span>
                <span>
                    <b>No of Box: </b>
                    {selectedRecord?.noOfBox ?? ""}
                </span>
                <span>
                    <b>Material Condition: </b>
                    {selectedRecord?.materialCondition ?? ""}
                </span>
            </div>
            <div className="footer-remark-row">
                <b>Remarks: </b>
                {selectedRecord?.remark ?? ""}
            </div>
        </div>
        <div className="footer-signatures">
            <div className="sig-block">
                <span className="sig-line"></span>
                <span className="sig-label">Checked By </span>
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
    const shouldBreakBeforeBottom = totalRowCount > 26;

    const partThumbs = partDetails?.map(detail => {
        const url = detail?.capturedImageUrls?.[0] || detail?.referenceImageUrl;
        if (!url) return null;
        return { url: `${MASTERDATA_URL}/get_image/${url}`, partNumber: detail?.partNumber ?? "" };
    })?.filter(Boolean) || [];

    const parentImage = selectedRecord?.parentPartImageUrls
        ?.map(urls => ({ url: `${CSLBASEURL}/get_parentPart_image/${urls}`, partNumber: "" }))
        ?.filter(item => item?.url) || [];

    const smallGalleryImages = partThumbs?.slice(0, SMALL_PART_LIMIT);

    const overflowSmallImages = partThumbs?.length > 4
        ? [
            parentImage?.[0] || null,
            parentImage?.[1] || null,
            { group: [partThumbs?.[4], partThumbs?.[5]]?.filter(Boolean) }
        ]
        : parentImage?.slice(0, BOTTOM_STRIP_LIMIT);

    const bottomStripImages = overflowSmallImages?.filter(Boolean);

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
                                            <td></td>
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