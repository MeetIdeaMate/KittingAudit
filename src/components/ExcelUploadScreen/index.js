import React from "react";
import { UiButton, UiCounterBatch, UiFileUploader, UiModal, UiRangePicker, UiSearchBox, UiTable } from "../../components";
import "./style.scss";
import { colorStatus, ExcelUploadTaleColumn } from "./config";
import dayjs from "dayjs";
const ExcelUploadLayout = ({
    title,
    counter,
    dateFilter,
    onDateChange,
    onSearch,
    handleDownloadFile,
    handlePagination,
    handleClose,
    fileName,
    onFileSelect,
    onSubmit,
    isSubmitDisabled,
    tableData,
    pagination,
    expandedRowRender,
    isOpen,
    modalTitle,
    handleSubmit,
    loading
}) => {
    const expandedTable = (details) => {
        const weekNoDetailList = details?.weekNoDetailList?.flatMap(sobDetails => {
            const partWeekNo = sobDetails?.sobContractDetails?.map(sob => `${sob?.crNumber} - ${sobDetails?.weekNo}`);
            return partWeekNo
        }) || [];
        const kanbanContractNumberDetail = details?.kanbanContractNumberDetail?.map(kamban => `${kamban?.crNumber} - ${dayjs(kamban?.date).format("DD-MM-YYYY")}`) || [];
        const notStarted = title !== "SOB Upload" ? details?.notStarted : [];
        const inProgress = title !== "SOB Upload" ? details?.inProgress : [];
        const completed = title !== "SOB Upload" ? details?.completed : [];

        return (
            <div style={{ width: "100%", padding: "10px", }}>
                {
                    notStarted?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "3px" }}>
                        <p className="padding-remove">{notStarted?.length > 0 ? `Not Yet Started CR Numbers  (${notStarted?.length}) :` : ""}</p>
                        {
                            notStarted?.map((pendingCrNo) => {
                                return (
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "2px",
                                        border: `1px solid #f6822b`,
                                        backgroundColor: "#fff2e8",
                                        color: "#f6822b",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        whiteSpace: "wrap",
                                    }}
                                    >{pendingCrNo}</span>
                                )
                            })
                        }
                    </div>
                }
                {
                    inProgress?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "3px" }}>
                        <p className="padding-remove">{inProgress?.length > 0 ? `In Progress CR Numbers  (${inProgress?.length}) :` : ""}</p>
                        {
                            inProgress?.map((pendingCrNo) => {
                                return (
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "2px",
                                        border: `1px solid #1890ff`,
                                        backgroundColor: "#e6f7ff",
                                        color: "#1890ff",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        whiteSpace: "wrap",
                                    }}
                                    >{pendingCrNo}</span>
                                )
                            })
                        }
                    </div>
                }
                {
                    completed?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "3px" }}>
                        <p className="padding-remove">{completed?.length > 0 ? `Completed CR Numbers  (${completed?.length}) :` : ""}</p>
                        {
                            completed?.map((pendingCrNo) => {
                                return (
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "2px",
                                        border: `1px solid #66cb34`,
                                        backgroundColor: "#f6ffed",
                                        color: "#66cb34",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        whiteSpace: "wrap",
                                    }}
                                    >{pendingCrNo}</span>
                                )
                            })
                        }
                    </div>
                }
                {
                    weekNoDetailList?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "3px" }}>
                        <p className="padding-remove">{weekNoDetailList?.length > 0 ? `CR - Week Numbers  (${weekNoDetailList?.length}) :` : ""}</p>
                        {
                            weekNoDetailList?.map((pendingCrNo) => {
                                return (
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "2px",
                                        border: `1px solid #FA8C16`,
                                        backgroundColor: "#FFF7E6",
                                        color: "#FA8C16",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        whiteSpace: "wrap",
                                    }}
                                    >{pendingCrNo}</span>
                                )
                            })
                        }
                    </div>
                }
                {
                    kanbanContractNumberDetail?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "3px" }}>
                        <p className="padding-remove">{kanbanContractNumberDetail?.length > 0 ? `CR No - Kamban Date  (${kanbanContractNumberDetail?.length}) :` : ""}</p>
                        {
                            kanbanContractNumberDetail?.map((pendingCrNo) => {
                                return (
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "2px",
                                        border: `1px solid #FA8C16`,
                                        backgroundColor: "#FFF7E6",
                                        color: "#FA8C16",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        whiteSpace: "wrap",
                                    }}
                                    >{pendingCrNo}</span>
                                )
                            })
                        }
                    </div>
                }
            </div>
        )
    };
    return (
        <>
            <div className="excel-header">
                <div className="excel-title-box">
                    <h3>{title}</h3>
                    <UiCounterBatch primary>{counter ?? 0}</UiCounterBatch>
                </div>
                <div className="excel-header-controls">
                    <UiRangePicker value={dateFilter} onChange={onDateChange} />
                    <UiSearchBox
                        placeholder={"Search Excel Name/Contract Number"}
                        style={{ width: "300px" }}
                        handleSearch={onSearch}
                    />
                </div>
            </div>

            {colorStatus?.length > 0 && title === "CSL Upload" && <div className="status-wrapper">
                {colorStatus?.map((status, index) => (
                    <div className="excel-title-box" key={index}>
                        <div
                            className="status-dot"
                            style={{
                                border: `1px solid ${status?.color}`,
                                backgroundColor: status?.bgColor,
                            }}
                        />
                        <p>{status?.label}</p>
                    </div>
                ))}
            </div>}

            <div className="excel-container">
                <div className="excel-left">
                    <UiFileUploader localFileName={fileName} onFileSelect={onFileSelect} />
                    <div className="submit-area">
                        <UiButton
                            disabled={isSubmitDisabled}
                            style={{ width: "100%" }}
                            size="large"
                            type="primary"
                            onClick={onSubmit}
                        >
                            Submit
                        </UiButton>
                    </div>
                </div>

                <div className="excel-right">
                    <UiTable
                        className="ChangeTablePadding"
                        columns={ExcelUploadTaleColumn({ handleDownloadFile, title })}
                        dataSource={tableData}
                        pagination={pagination}
                        expandable={{ expandedRowRender: expandedTable }}
                        rowKey={(item) => title === "CSL Upload" ? item?.cslDetailId : title === "SOB Upload" ? item?.sobDetailId : item?.kanbanDetailId}
                        scroll={{ y: "calc(100vh - 230px)" }}
                    />
                </div>
            </div>

            {isOpen?.isOpenFindExistCr && (
                <UiModal
                    open={isOpen?.isOpenFindExistCr}
                    title={modalTitle}
                    onCancel={handleClose}
                    footer={
                        <div className="flexible-end">
                            <UiButton onClick={handleClose}>NO</UiButton>
                            <UiButton loading={loading} type="primary" onClick={handleSubmit}>
                                YES
                            </UiButton>
                        </div>
                    }
                />
            )}
        </>
    );
};
export default ExcelUploadLayout;