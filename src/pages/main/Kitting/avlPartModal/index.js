import React from "react";
import { UiTextBox } from "../../../../components";
import { Skeleton } from "antd";

export const GetAvlParts = ({
    selectedPartDetails,
    handleChangeAvlBarcode,
    hanldePressEnter,
    isLoading,
}) => {
    return <React.Fragment>
        <Skeleton active={isLoading} loading={isLoading}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
                <span>Part Number</span>
                <h3 style={{border: 0, margin: 0}}>{selectedPartDetails?.partNumber}</h3>
                <UiTextBox placeholder="Bar Code ID" onKeyPress={(field) => hanldePressEnter(field)} onChange={(field) => handleChangeAvlBarcode(field)}/>
            </div>
            <div>
                <span>Qty</span>
                <h3 style={{border: 0, margin: 0}}>{selectedPartDetails?.quantity}</h3>
            </div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <h2 style={{padding: 0, margin: 0, width: "50%"}}>Available Parts</h2>
            <h2 style={{padding: 0, margin: 0, width: "50%"}}>Missing Parts</h2>
        </div>
        <hr></hr>
        <div style={{width: "100%", display: "flex"}}>
            <div style={{width: "50%"}}>
                <div style={{display: "flex", justifyContent: "space-between", padding: "0 5px"}}>
                    <span>Barcode ID</span>
                    <span>Qty: </span>
                </div>
                <hr></hr>
                {
                    selectedPartDetails?.caseInfo?.[0]?.barcodes?.map((part, indx, arr) => {
                        return <p key={indx} style={{borderBottom: indx !== arr.length - 1 ? "1px solid #ccc" : "none"}}>{part}</p>
                    })
                }
            </div>
            <div style={{width: "1px", backgroundColor: "#000"}}></div>
            <div style={{width: "49%"}}>
                <div style={{display: "flex", justifyContent: "space-between", padding: "0 5px"}}>
                    <span>Barcode ID</span>
                    <span>Qty: </span>
                </div>
                <hr></hr>
                {
                    selectedPartDetails?.caseInfo?.[0]?.barcodes?.map((part, indx, arr) => {
                        return <p key={indx} style={{paddingLeft: "5px ",borderBottom: indx !== arr.length - 1 ? "1px solid #ccc" : "none"}}>{part}</p>
                    })
                }
            </div>
        </div>
        </Skeleton>
    </React.Fragment>
};