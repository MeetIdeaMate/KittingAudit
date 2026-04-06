import { UiButton, UiTab, UiTextBox } from "../../../../components";
import { tabsData } from "../config";
import { deleteIcon } from "../../../../assets/images";
import React from "react";

export const BarcodeSepareateAndCompained = ({
    tabsDataDetails,
    handleChangeTab,
    selectedPartDetails,
    handleChangeFieldValue,
    handleAddNewMap,
    handleRemovePartQty,
    mode,
    handleOpenAvlPart,
    handleAddNewDublicatePart,
    handleRemoveDubPart,
    handleChangeDubValue,
}) => {

    const existingKeys = Object.keys(selectedPartDetails?.labelMap ?? {})?.map(Number);
    const total = Object.values(selectedPartDetails?.templabeledinfoMap || {})?.reduce((sum, val) => sum + (Number(val) || 0), 0);

    return <React.Fragment>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0, margin: 0, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 2 }}>
            <span>
                <p>Part Number</p>
                <h3>{selectedPartDetails?.partNumber}</h3>
            </span>
            <span>
                <p>Quantity</p>
                <h3>{selectedPartDetails?.quantity}</h3>
            </span>
        </div>
        {mode === "reprint" && <div>
            <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}><div>Enter Barcode ID</div><div style={{color: "orange", fontSize: "12px", cursor: "pointer"}} onClick={() => handleOpenAvlPart()}>Scan Avl-Parts to find</div></div>
            {selectedPartDetails?.dublicateBarcode?.map((details, indx) => {
                return <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0"}}>
                    <div style={{width: "90%"}}>
                    <UiTextBox isStyle={true} style={{width: "100%"}} placeholder="Bar Code ID" name="barCodeId" value={details?.barCodeId} onChange={(field) => handleChangeDubValue(field?.target?.value, indx)}/>
                    </div>
                    {selectedPartDetails?.dublicateBarcode?.length > 1 && <img src={deleteIcon} style={{ cursor: "pointer", width: "5%" }} title="Remove" onClick={() => handleRemoveDubPart(indx)} alt="" />}
                </div>
            })}
                <UiButton add style={{border: "1px dashed orange", width: "100%"}} onClick={() => handleAddNewDublicatePart()}>Add New</UiButton>
            </div>}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <UiTab tabs={tabsData} activeTabKey={tabsDataDetails?.tabKey} onChange={handleChangeTab} />
            {mode !== "reprint" && <p>Balance.Qty: {(Number(selectedPartDetails?.quantity) - Number(total))}</p>}
        </div>
        {mode === "reprint" && Object.entries(( selectedPartDetails?.templabeledinfoMap) ?? {})?.map(([key, value], index) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ width: "5%" }}>{index + 1}.</span>
                    <div style={{ width: "85%" }}>
                        <UiTextBox
                            label={`Label ${key} Quantity`}
                            type={"number"}
                            name={`${key}`}
                            placeholder="Ex: 12"
                            value={value}
                            style={{ width: "100%" }}
                            disabled={true}
                            onChange={(field) => handleChangeFieldValue(field?.target?.value, key)}
                        />
                    </div>
                    <div style={{ width: "10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {( mode === "edit" ? true : !selectedPartDetails?.labelMap?.hasOwnProperty(key)
                        ) && tabsDataDetails?.activeTab === "grouped" && Object.entries((selectedPartDetails?.templabeledinfoMap) ?? {})?.length > 1 &&
                            <img src={deleteIcon} style={{ cursor: "pointer", width: "70%" }} title="Remove" onClick={() => handleRemovePartQty(key)} alt="" />}
                    </div>
                </div>
            ))}
        { mode !== "reprint" &&
            Object.entries(( selectedPartDetails?.templabeledinfoMap) ?? {})?.map(([key, value], index) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ width: "5%" }}>{index + 1}.</span>
                    <div style={{ width: "85%" }}>
                        <UiTextBox
                            label={`Label ${key} Quantity`}
                            type={"number"}
                            name={`${key}`}
                            placeholder="Ex: 12"
                            value={value}
                            style={{ width: "100%" }}
                            disabled={selectedPartDetails?.isDublicate || mode === "edit" ? false : (tabsDataDetails?.tabKey === "1" ?  (existingKeys?.length > 0 ? key === "1" : false) : selectedPartDetails?.labelMap?.hasOwnProperty(key))}
                            onChange={(field) => handleChangeFieldValue(field?.target?.value, key)}
                        />
                    </div>
                    <div style={{ width: "10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {( mode === "edit" ? true : !selectedPartDetails?.labelMap?.hasOwnProperty(key)
                        ) && tabsDataDetails?.activeTab === "grouped" && Object.entries((selectedPartDetails?.templabeledinfoMap) ?? {})?.length > 1 &&
                            <img src={deleteIcon} style={{ cursor: "pointer", width: "70%" }} title="Remove" onClick={() => handleRemovePartQty(key)} alt="" />}
                    </div>
                </div>
            ))
        }
        {tabsDataDetails?.activeTab === "grouped" && selectedPartDetails?.quantity > Object.keys((selectedPartDetails?.templabeledinfoMap) ?? {})?.length && <UiButton style={{ width: "100%", position: "sticky", bottom: 0, color: "orange", border: "1px dashed orange" }} add onClick={() => handleAddNewMap()}>Add</UiButton>}
    </React.Fragment>
};