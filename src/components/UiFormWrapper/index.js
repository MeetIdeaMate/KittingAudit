import React from "react";
import { map } from "lodash";
import { Formik, Field } from "formik";
import classNames from "classnames";
import "./style.scss";
import { Checkbox, Input } from "antd";
import { customStyles } from "../../utils";
import { UiButton, UiText, UiTextBox } from "../../components";

const UiFormWrapper = (props) => {
    const {
        formConfig: FORM_OBJ,
        className,
        // isAddClicked,
        // availableFamilyGroup,
        // availableStages,
        // stageCount,
        initialValues,
        actionState,
        // stage,
        familyGroupSelection,
        validationSchema,
        // active,
        handleButtonClick,
        handleClose,
        // handleToggle,
        // selectedRadio,
        // handleRemoveConfig,
        // handleRadioChange,
        // handleChipsSelected,
        // handleSelectMenu,
        chipRendering,
        // availableSerialNos,
        // handleChecked,
        // isChecked,
        componentSelection,
        specSelection,
        htmlType,
        // handleProductSpecChange,
        // productSpecData,
        // supplierGst,
        // isSpecInputfield,
    } = props;
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => handleButtonClick(values, resetForm)}
            validationSchema={validationSchema}>
            {(formik) => {
                const { handleSubmit, setFieldValue, dirty, isValid } = formik;
                return (
                    <div className={`form-wrapper ${className}`}>
                        {map(FORM_OBJ, (field, i) => (
                            <React.Fragment key={i}>
                                {field?.type === "heading" && (
                                    <UiText
                                        disabled={actionState === "view"}
                                        style={field?.width || customStyles(textClass)}
                                        children={field?.children}
                                    ></UiText>
                                )}
                                {field?.type === "text" && (
                                    <UiTextBox
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field.placeholder}
                                        name={field?.name}
                                        style={field?.style}
                                        className={field?.className}
                                        value={initialValues[field?.key]}
                                        onChange={(val) =>
                                            setFieldValue(field?.key, val.target.value)
                                        }
                                        addonAfter={field?.addonAfter}
                                    />
                                )}
                                {/* {field?.type === "validNumber" && (
                                    <UiTextBox
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field.placeholder}
                                        name={field?.name}
                                        style={field?.style}
                                        className={field?.className}
                                        value={initialValues[field?.key]}
                                        onChange={(val) =>
                                            setFieldValue(field?.key, val.target.value)
                                        }
                                        addonAfter={field?.addonAfter}
                                        type="number"
                                    />
                                )}
                                {field?.type === "textArea" && (
                                    <UiTextArea
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field.placeholder}
                                        name={field?.name}
                                        style={field?.style}
                                        maxLength={field?.maxlength}
                                        className={field?.className}
                                        isAddClicked={isAddClicked}
                                        value={initialValues[field?.key]}
                                        onChange={(val) =>
                                            setFieldValue(field?.key, val.target.value)
                                        }
                                    />
                                )} */}
                                {field?.type === "password" && (
                                    <Input.Password
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field?.placeholder}
                                        name={field?.name}
                                        value={initialValues[field?.key]}
                                        onChange={(val) =>
                                            setFieldValue(field?.key, val.target.value)
                                        }
                                    />
                                )}
                                {/* {field?.type === "number" && (
                                    <UiInputNumber
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field.placeholder}
                                        name={field?.name}
                                        value={initialValues[field?.key]}
                                        onChange={(val) => setFieldValue(field?.key, val)}
                                        addonAfter={field?.addonAfter}
                                        style={field?.style}
                                    />
                                )}
                                {field?.type === "decimalWithNumber" && (
                                    <UiDecimalNumber
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field.placeholder}
                                        name={field?.name}
                                        value={initialValues[field?.key]}
                                        onChange={(val) => setFieldValue(field?.key, val)}
                                        addonAfter={field?.addonAfter}
                                        style={field?.style}
                                    />
                                )} */}
                                {/* {field?.type === "select" && (
                                        <UiSelect
                                            disabled={actionState === "view"}
                                            options={field?.options }
                                            label={field?.label}
                                            name={field?.name}
                                            value={initialValues[field?.key]}
                                            mode={field?.mode}
                                            supplierGst={supplierGst}
                                            onChange={(val, gst, selectedValue) => {
                                                setFieldValue(field?.key, field?.mode === "tags" ? selectedValue : val );
                                                handleSelectMenu(val, selectedValue, field);
                                            }}
                                            validationType ={field?.validationType}
                                        />
                                )}
                                {field?.type === "chip" && (
                                    <UiChipCard
                                        label={field.label}
                                        chipKey={field.key}
                                        title={field.title}
                                        onlyCount={field?.onlyCount}
                                        availableChips={field?.availableChips}
                                        selectedChips={stage}
                                        availableFamilyGroup={availableFamilyGroup}
                                        availableStages={availableStages}
                                        availableSerialNos={availableSerialNos}
                                        stageCount={stageCount}
                                        disabled={actionState === "view"}
                                        actionState={actionState}
                                        handleChipsSelected={(e) => handleChipsSelected(e, values)}
                                    />
                                )}
                                {field?.type === "chipView" && (
                                    <UiChip
                                        label={field.label}
                                        chipKey={field.key}
                                        title={field.title}
                                        onlyCount={field?.onlyCount}
                                        availableChips={field?.availableChips}
                                        selectedChips={stage}
                                        availableFamilyGroup={availableFamilyGroup}
                                        availableStages={availableStages}
                                        availableSerialNos={availableSerialNos}
                                        stageCount={stageCount}
                                        disabled={actionState === "view"}
                                        actionState={actionState}
                                        handleChipsSelected={(e) => handleChipsSelected(e, values)}
                                    />
                                )} */}
                                {/* {field?.type === "checkchip" && (
                                    <UiCheckChip
                                        label={field.label}
                                        title={field.title}
                                        availableChips={field?.availableChips}
                                        onChange={(selectedValue) =>
                                            setFieldValue(field?.key, selectedValue)
                                        }
                                        value={initialValues[field?.key]}
                                        chip={field.chip}
                                        actionState={actionState}
                                    />
                                )} */}
                                {/* {field?.type === "checkViewchip" && (
                                    <UiCheckViewChip value={initialValues[field?.key]} />
                                )}
                                {field?.type === "checkList" && (
                                    <UiCheckList
                                        handleChecked={handleChecked}
                                        value={initialValues[field?.key]}
                                        checkedData={isChecked}
                                    ></UiCheckList>
                                )}
                                {field?.type === "toDo" && (
                                    <UiToDo
                                        label={field.label}
                                        title={field.title}
                                        name={field.name}
                                        closeIcon={field.closeIcon}
                                        value={
                                            initialValues[field?.key] || {
                                                configuration: [],
                                                defaultValue: null,
                                            }
                                        }
                                        onChange={(selectedValues) =>
                                            setFieldValue(field?.key, selectedValues)
                                        }
                                        actionState={actionState}
                                    />
                                )}
                                {field?.type === "file" && (
                                    <UiImageUpload
                                        label={field.label}
                                        title={field.title}
                                        hidden={actionState !== "edit"}
                                        name={field.name}
                                        value={initialValues[field?.key]}
                                        onChange={(selectedValues) =>
                                            setFieldValue(field?.key, selectedValues)
                                        }
                                    />
                                )}
                                {field?.type === "datepicker" && (
                                    <UiDatePicker
                                        disabled={actionState === "view"}
                                        label={field?.label}
                                        placeholder={field.placeholder}
                                        defaultValue={field.defaultValue}
                                        name={field.name}
                                        style={field.style}
                                        value={initialValues[field?.key]}
                                        onChange={(selectedValues) =>
                                            setFieldValue(field?.key, selectedValues)
                                        }
                                    />
                                )} */}
                                {/* {field?.type === "accordian" &&
                                    field?.data?.map(
                                        (el, index) =>
                                            field?.data?.length > 0 && (
                                                <UiAccordian
                                                    key={index}
                                                    label={field?.label}
                                                    active={active}
                                                    handleToggle={handleToggle}
                                                    data={el}
                                                >
                                                    <UiRadio
                                                        disabled={actionState === "view"}
                                                        options={el?.data}
                                                        value={selectedRadio || el.value}
                                                        onChange={(e) => handleRadioChange(e, el.familyId)}
                                                    />
                                                </UiAccordian>
                                            )
                                    )} */}
                                {field?.type === "heading" && (
                                    <div style={{ marginBottom: "20px" }}>
                                        <UiText
                                            className="spec__title"
                                            style={{
                                                color: "var(--secondary-color)",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {field.label}
                                        </UiText>
                                    </div>
                                )}
                                {field?.type === "checkbox" && (
                                    <Checkbox
                                        name={field?.name}
                                        onChange={(e) => {
                                            setFieldValue(field?.key, e.target.checked)
                                            initialValues[field?.key] = e.target.checked;
                                        }}
                                        disabled={actionState === "view"}
                                        value={initialValues[field?.key]}
                                        checked={initialValues[field?.key]}
                                    >{field?.label}</Checkbox>
                                )}
                                {/* {field?.type === "spec" && (
                                    <UiSpecification
                                        label={field?.label}
                                        disabled={actionState === "view"}
                                        handleAdd={(specificationArray) => {
                                            setFieldValue(field?.key, specificationArray);
                                        }}
                                        handleRemoveConfig={handleRemoveConfig}
                                        values={{
                                            config: initialValues?.specificationConfigs || [],
                                        }}
                                    />
                                )}
                                {field?.type === "specValue" && (
                                    <UiSpecificationList
                                        style={{ marginTop: "24px" }}
                                        data={productSpecData}
                                        isSpecInputfield={isSpecInputfield}
                                        handleChange={handleProductSpecChange}
                                    />
                                )} */}

                                {field?.type === "button" && (
                                    <Field
                                        name={field?.key}
                                        label={field?.label}
                                        type={field?.variant}
                                        disabled={
                                            field.key === "cancel" ? false :
                                                field.label === "Next" && isValid
                                                    ? false :
                                                    actionState === "edit" && !isValid
                                                        ? !dirty
                                                        : actionState === "view"
                                                            ? field?.final && actionState !== ""
                                                            : actionState === "add" && isValid
                                                                ? false
                                                                : familyGroupSelection
                                                                    ? false
                                                                    : componentSelection
                                                                        ? false
                                                                        : specSelection
                                                                            ? false
                                                                            : chipRendering
                                                                                ? !isValid && !dirty
                                                                                : (!isValid || !dirty) && !field?.noValidation
                                        }
                                        style={field?.width || customStyles(buttonClass)}
                                        size="large"
                                        className={classNames({
                                            btn: field?.inline,
                                            "btn-cancel": field?.key === "cancel",
                                        })}
                                        onClick={(e) =>
                                            field?.key === "cancel" ? handleClose() : handleSubmit(e)
                                        }
                                        component={UiButton}
                                        htmlType={htmlType}
                                        resetForm={formik.resetForm}
                                    >
                                        {field?.label}
                                    </Field>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                );
            }}
        </Formik>
    );
};

const buttonClass = { w: "150px", br: "6px", m: "0 7px 0 0" };
const textClass = {
    fs: "25px",
    fw: "var(--font-family-bold)",
    c: "#ff9729",
    dply: "block",
};

export default UiFormWrapper;