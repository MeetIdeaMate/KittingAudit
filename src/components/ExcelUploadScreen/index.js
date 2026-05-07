import React from "react";
import { UiButton, UiCounterBatch, UiFileUploader, UiModal, UiRangePicker, UiSearchBox, UiTable } from "../../components";
import "./style.scss";
import { colorStatus, ExcelUploadTaleColumn } from "./config";
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
  handleSubmit
}) => {
    const expandedTable = (details) => {
        const completed = details?.completedCrNumbers || [];
        const pending = details?.pendingCrNumbers || [];
        const inprogress = details?.inProgressCrNumbers || [];
        return (
            <div style={{ width: "100%", padding: "10px" }}>
                {
                    pending?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <p className="padding-remove">{pending?.length > 0 ? `Pending  (${pending?.length}) :` : ""}</p>
                        {
                            pending?.map((pendingCrNo) => {
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
                    inprogress?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "10px" }}>
                        <p className="padding-remove">{inprogress?.length > 0 ? `In Progress  (${inprogress?.length}) :` : ""}</p>
                        {
                            inprogress?.map((inProgressCrNo) => {
                                return (
                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "2px",
                                            border: `1px solid #1a4ac4ff`,
                                            backgroundColor: "#d8e0f5ff",
                                            color: "#1a4ac4ff",
                                            fontSize: "13px",
                                            fontWeight: 500,
                                            whiteSpace: "wrap",
                                        }}
                                    >
                                        {inProgressCrNo}
                                    </span>
                                )
                            })
                        }
                    </div>
                }
                {
                    completed?.length > 0 && <div style={{ width: "100%", display: "flex", gap: "10px", flexWrap: "wrap", paddingTop: "10px" }}>
                        <p className="padding-remove">{completed?.length > 0 ? `Completed  (${completed?.length}) :` : ""}</p>
                        {
                            completed?.map((completedCrNo) => {
                                return (
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "2px",
                                        border: `1px solid #52C41A`,
                                        backgroundColor: "#F6FFED",
                                        color: "#52C41A",
                                        fontSize: "13px",
                                        fontWeight: 500,
                                        whiteSpace: "wrap",
                                    }}
                                    >{completedCrNo}</span>
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

      <div className="status-wrapper">
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
      </div>

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
            columns={ExcelUploadTaleColumn({ handleDownloadFile })}
            dataSource={tableData}
            pagination={pagination}
            expandable={{ expandedRowRender:expandedTable }}
            rowKey={(item) => item?.id}
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
              <UiButton type="primary" onClick={handleSubmit}>
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