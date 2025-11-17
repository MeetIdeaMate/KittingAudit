import React from "react";
import { UiButton, UiTab, UiTextBox } from "../../../../components";
import { tabsData } from "../config";
import { deleteIcon } from "../../../../assets/images";

export const BarcodeSepareateAndCompained = ({
    tabsDataDetails,
    handleChangeTab,
    selectedPartDetails,
    handleChangeFieldValue,
    handleAddNewMap,
    handleRemovePartQty,
}) => {

    return <React.Fragment>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 0, margin: 0, position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 2 }}>
            <span>
                <p>Part Numer</p>
                <h3>{selectedPartDetails?.partNumber}</h3>
            </span>
            <span>
                <p>Quantity</p>
                <h3>{selectedPartDetails?.quantity}</h3>
            </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <UiTab tabs={tabsData} activeTabKey={tabsDataDetails?.tabKey} onChange={handleChangeTab} />
            {!selectedPartDetails?.isDublicate && <p>Balance.Qty: {selectedPartDetails?.isDublicate ? selectedPartDetails?.quantity : selectedPartDetails?.balanceQty}</p>}
        </div>
        {
            Object.entries((selectedPartDetails?.isDublicate ? selectedPartDetails?.tempduplicateInfoMap : selectedPartDetails?.templabeledinfoMap) ?? {})?.map(([key, value], index) => (
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
                            disabled={selectedPartDetails?.isDublicate ? false : selectedPartDetails?.labeledinfoMap?.hasOwnProperty(key)}
                            onChange={(field) => handleChangeFieldValue(field?.target?.value, key)}
                        />
                    </div>
                    <div style={{ width: "10%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {(selectedPartDetails?.isDublicate
                            ? true
                            : !selectedPartDetails?.labeledinfoMap?.hasOwnProperty(key)
                        ) && tabsDataDetails?.activeTab === "grouped" && Object.entries((selectedPartDetails?.isDublicate ? selectedPartDetails?.tempduplicateInfoMap : selectedPartDetails?.templabeledinfoMap) ?? {})?.length > 1 &&
                            <img src={deleteIcon} style={{ cursor: "pointer", width: "70%" }} title="Remove" onClick={() => handleRemovePartQty(key)} alt="" />}
                    </div>
                </div>
            ))
        }
        {tabsDataDetails?.activeTab === "grouped" && selectedPartDetails?.quantity > Object.keys((selectedPartDetails?.isDublicate ? selectedPartDetails?.tempduplicateInfoMap : selectedPartDetails?.templabeledinfoMap) ?? {})?.length && <UiButton style={{ width: "100%", position: "sticky", bottom: 0 }} add type="primary" onClick={() => handleAddNewMap()}>Add</UiButton>}
    </React.Fragment>
};