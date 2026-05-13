import React from "react";
import { DatePicker, Form } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

const UiDatePicker = ({
    label,
    name,
    value,
    onChange,
    minDate,
    isStyle,
    format = "DD-MM-YYYY",
    ...restProps
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            [name]: value ? dayjs(value) : null,
        });
    }, [value, name, form]);

    const handleDateChange = (date) => {
        let formattedDate = null;
        if (date !== null) {
            formattedDate = dayjs(date).format("YYYY-MM-DD");
        }
        onChange(formattedDate);
    };

    return (
        <Form form={form} layout="vertical">
            <Form.Item
                label={label}
                name={name}
                rules={[
                    {
                        required: restProps?.required || false,
                        message: `${label} is required`,
                    },
                ]}
                style={isStyle ? { margin: "0px" } : {}}
            >
                <DatePicker
                    {...restProps}
                    value={value ? dayjs(value) : null}
                    onChange={handleDateChange}
                    minDate={minDate}
                    format={format}
                />
            </Form.Item>
        </Form>
    );
};

export default UiDatePicker;
