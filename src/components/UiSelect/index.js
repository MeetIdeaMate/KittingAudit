import { useState, useEffect, useMemo } from "react";
import { Select, Form } from "antd";
import UiTextBox from "../UiTextBox";

const UiSelect = ({
    onChange,
    onSearch,
    options,
    disabled,
    name,
    label,
    placeholder,
    value,
    mode,
    style,
    supplierGst,
    isOnlyValueFilter,
    isStyle,
    validationType,
    ...restProps
}) => {
    const _isOnlyValueFilter = isOnlyValueFilter ?? false;
    const [selectedOption, setSelectedOption] = useState(
        value || (mode === "multiple" || mode === "tags" ? [] : "")
    );
    const [selectedGst, setSelectedGST] = useState(false);
    const [gst, setGST] = useState("");

    const dropdownWidth = useMemo(() => {
        if (!options?.length) return "auto";
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = "16px Arial";
        const maxLengthOption = options?.reduce((longest, option) => {
            const text = option?.value || "";
            const width = context.measureText(text).width;
            return Math.max(longest, width);
        }, 0);
        return `${maxLengthOption + 30}px`;
    }, [options]);

    const newFilterOption = (input, option) => {
        if (_isOnlyValueFilter) {
            return (option?.productName)
                ?.toLowerCase()
                ?.startsWith(input?.toLowerCase());
        } else {
            return (option?.productName || option?.value)
                ?.toLowerCase()
                ?.includes(input?.toLowerCase());
        }
    };

    useEffect(() => {
        if (mode === "multiple") {
            const selectedValues = options
                ?.filter((filter) => value?.includes(filter?.key))
                ?.map((filterMap) => filterMap?.value);
            setSelectedOption(selectedValues);
        } else if (mode === "tags") {
            setSelectedOption(value);
        }
        else {
            const selectedValue = options?.find((selectValue) => selectValue?.key === value)?.value;
            setSelectedOption(selectedValue);
        }
        const selectedOption = options?.find((selectOption) => selectOption?.key === value);
        if (selectedOption && selectedOption.gst) {
            setSelectedGST(true);
        } else {
            setSelectedGST(false);
        }
    }, [options, value, mode]);

    const handleChange = (selectedValues, selectedOptions) => {
        if (mode === "multiple") {
            const selectedKeys = selectedOptions?.map((option) => option?.key);
            if (onChange) {
                onChange(selectedKeys, selectedValues, selectedOptions);
            }
        } else {
            const selectedKey = selectedOptions?.key;
            if (onChange) {
                onChange(selectedKey, selectedOptions?.gst, selectedValues, selectedOptions);
            }
            setGST(selectedOptions?.gst);
        }
    };

    const handleSearch = (selectedOption) => {
        if (onSearch) {
            onSearch(selectedOption?.value);
        }
    };

    const handleKeyDown = (e) => {
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <>
            <Form.Item
                label={label}
                name={selectedOption}
                value={selectedOption}
                rules={[
                    { required: restProps?.required, message: `${label} is required ` },
                ]}
                style={isStyle ? { margin: "0px" } : {}}
            >
                <Select
                    allowClear
                    showSearch
                    disabled={disabled}
                    defaultValue={selectedOption}
                    placeholder={placeholder ? placeholder : "Select"}
                    optionFilterProp="children"
                    onChange={handleChange}
                    onSearch={handleSearch}
                    onInputKeyDown={validationType === "number" && handleKeyDown}
                    filterOption={newFilterOption}
                    options={options}
                    mode={mode}
                    style={style}
                    dropdownStyle={{ minWidth: dropdownWidth }}
                    {...restProps}
                />
                {selectedGst && (
                    <UiTextBox
                        value={gst ? gst : supplierGst}
                        name="GST"
                        label="Supplier GST.No"
                        disabled
                    ></UiTextBox>
                )}
            </Form.Item>
        </>
    );
};

export default UiSelect;