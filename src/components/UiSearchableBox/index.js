import { Form, Select, Spin } from "antd";
import { useMemo } from "react";
import { emptyImageGray } from "../../assets/images";

export const UiSearchableBox = ({handleSearch, handleChange, isLoading, option, isStyle,...restProps}) => {
    const dropdownWidth = useMemo(() => {
                if (!option?.length) return "auto";
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                context.font = "16px Arial";
                const maxLengthOption = option?.reduce((longest, option) => {
                    const text = option?.value || "";
                    const width = context.measureText(text).width;
                    return Math.max(longest, width);
                }, 0);
                return `${maxLengthOption + 30}px`;
        }, [option]);

    return (
        <Form>
            <Form.Item 
                style={isStyle ? {margin:"0px"} : {}}
            >
                <Select
                    showSearch
                    allowClear
                    options={option}
                    notFoundContent={isLoading ? <div style={{ padding: "20px 0", textAlign: "center" }}><Spin size="small" /></div> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src={emptyImageGray} style={{ display: "block" }} alt=""/>
                    </div>}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    placeholder={restProps?.placeholder || "Search"}
                    dropdownStyle={{ minWidth: dropdownWidth }}
                    {...restProps}
                />
            </Form.Item>
        </Form>
    );
};