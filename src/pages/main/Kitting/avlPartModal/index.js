import React, { useEffect } from "react";
import { UiTextBox } from "../../../../components";
import { Skeleton } from "antd";

export const GetAvlParts = ({
    selectedPartDetails,
    handleChangeAvlBarcode,
    hanldePressEnter,
    isLoading,
    missingParCode,
    lastBarcode,
    inputRef,
}) => {

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);
    
    const totalQty = Object.values(selectedPartDetails?.labelMap ?? {}).reduce((sum, qty) => sum + qty, 0);

    const missingIndexes = missingParCode?.missingList?.map(item => Number(item?.split("-")[1]));

    const availableQty = missingIndexes?.reduce((sum, key) => {
        return sum + (selectedPartDetails?.labelMap[key] || 0);
    }, 0);

    return <React.Fragment>
        <Skeleton active={isLoading} loading={isLoading}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <span>Part Number</span>
                    <h3 style={{ border: 0, margin: 0 }}>{selectedPartDetails?.partNumber}</h3>
                    <UiTextBox name={"lastBarcode"} value={lastBarcode || ""} placeholder="Bar Code ID" onKeyPress={(field) => hanldePressEnter(field)} onChange={(field) => handleChangeAvlBarcode(field?.target?.value)} />
                </div>
                <div>
                    <span>Qty</span>
                    <h3 style={{ border: 0, margin: 0 }}>{selectedPartDetails?.quantity}</h3>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 style={{ padding: 0, margin: 0, width: "50%" }}>Available Parts</h2>
                <h2 style={{ padding: 0, margin: 0, width: "50%" }}>Missing Parts</h2>
            </div>
            <hr></hr>
            <div style={{ width: "100%", display: "flex", height: "300px", overflowY: "auto" }}>
                <div style={{ width: "50%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 5px" }}>
                        <span>Barcode ID</span>
                        <span>Qty: {totalQty - availableQty} </span>
                    </div>
                    <hr></hr>
                    {
                        selectedPartDetails?.caseInfo?.[0]?.barcodes?.[0]?.barcodeNumbers?.map((part, indx, arr) => {
                            return <p key={indx} style={{ borderBottom: indx !== arr.length - 1 ? "1px solid #ccc" : "none" }}>{part}</p>
                        })
                    }
                </div>
                <div style={{ width: "1px", backgroundColor: "#000" }}></div>
                <div style={{ width: "49%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 5px" }}>
                        <span>Barcode ID</span>
                        <span>Qty: {availableQty} </span>
                    </div>
                    <hr></hr>
                    {
                        missingParCode?.missingList?.map((part, indx, arr) => {
                            return <p key={indx} style={{ paddingLeft: "5px ", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: indx !== arr?.length - 1 ? "1px solid #ccc" : "none" }}><span>{part}</span></p>
                        })
                    }
                </div>
            </div>
        </Skeleton>
    </React.Fragment>
};