import React, { useEffect } from "react";
import { UiAccordian, UiButton, UiTable, UiTextBox } from "../../../../components";
import { mainPartCase } from "../config";
import '../style.scss';

export const MainPartBarcode = ({
    selectedPartDetails,
    handleToggle,
    accordActive,
    handleAddNewCase,
    hanldePressEnter,
    lastBarcode,
    handleChangeFieldValue,
    inputRef,
    handleRemoveSpecificPart,
}) => {

    useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef]);

    return <React.Fragment>
        <div>
            <p style={{ padding: 0, margin: 0 }}>Part Number</p>
            <h3>{selectedPartDetails?.parentPartNumber}</h3>
            <UiTextBox value={lastBarcode} name={"lastBarcode"} ref={inputRef} onChange={(field) => handleChangeFieldValue(field?.targer?.value)} onKeyPress={(field) => hanldePressEnter(field)} placeholder="Bar Code ID"/>
            {
                selectedPartDetails?.caseInfo?.map((details, index) => {
                    return <UiAccordian
                        style={{backgroundColor: details?.selectedCase ? "orange" : "transparent"}}
                        key={index}
                        data={{
                            label: details?.boxNo,
                            subLabel: "",
                            id: index,
                        }}
                        handleToggle={handleToggle}
                        active={accordActive}
                    >
                        <UiTable
                            pagination={false}
                            columns={mainPartCase({handleRemoveSpecificPart})}
                            dataSource={details?.barcodes}
                        />
                    </UiAccordian>
                })
            }
            <UiButton onClick={() => handleAddNewCase()} add style={{ border: "1px dashed orange", color: "orange", width: "100%", position: "sticky", bottom: 0 }}>Add Case</UiButton>
        </div>
    </React.Fragment>
};