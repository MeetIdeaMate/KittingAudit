import React, { useEffect, useState } from "react";
import {
  UiAccordian,
  UiButton,
  UiTable,
  UiTextBox,
} from "../../../../components";
import { mainPartCase } from "../config";
import "../style.scss";
import { Tag } from "antd";

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
  missingParCode,
}) => {
  const [isMissingOpen, setIsMissingOpen] = useState(1);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);
  console.log(missingParCode, "missingParCode");

  return (
    <React.Fragment>
      <div>
        <p style={{ padding: 0, margin: 0 }}>Part Number</p>
        <h3>{selectedPartDetails?.parentPartNumber}</h3>
        <UiTextBox
          value={lastBarcode || ""}
          name={"lastBarcode"}
          ref={inputRef}
          onChange={(field) => handleChangeFieldValue(field?.target?.value)}
          onKeyPress={(field) => hanldePressEnter(field)}
          placeholder="Bar Code ID"
        />
        {missingParCode?.missingList?.length > 0 && (
          <UiAccordian
            style={{ backgroundColor: "transparent" }}
            key={missingParCode?.missingList?.length || 1}
            data={{
              label: `Missing Bar Codes ${
                missingParCode?.missingList?.length || 0
              }`,
              subLabel: "",
              id: 1,
            }}
            handleToggle={(e) =>
              setIsMissingOpen((prev) => (prev !== e ? e : null))
            }
            active={isMissingOpen}
          >
            {missingParCode?.missingList?.map((codes) => (
              <Tag style={{ margin: "3px" }} color={"red"}>
                {" "}
                {codes}
              </Tag>
            ))}
          </UiAccordian>
        )}
        {selectedPartDetails?.caseInfo?.map((details, index) => {
          return (
            <UiAccordian
              style={{
                backgroundColor: details?.selectedCase
                  ? "orange"
                  : "transparent",
              }}
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
                columns={mainPartCase({ handleRemoveSpecificPart })}
                dataSource={details?.barcodes}
              />
            </UiAccordian>
          );
        })}
        <UiButton
          onClick={() => handleAddNewCase()}
          add
          style={{
            border: "1px dashed orange",
            color: "orange",
            width: "100%",
            position: "sticky",
            bottom: 0,
          }}
        >
          Add Case
        </UiButton>
      </div>
    </React.Fragment>
  );
};
