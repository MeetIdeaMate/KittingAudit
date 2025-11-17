import { useEffect } from "react";
import { Form, Input } from "antd";

import "./style.scss";

const UiTextBox = ({
  label,
  name,
  value,
  onChange,
  ref,
  type,
  min,
  max,
  addonAfter,
  isStyle,
  required,
  ...restProps
}) => {
  const [form] = Form.useForm();
  const { maxLength = name === "MobileNumber" ? 10 : "" || name === "Pin Code" ? 6 : "" } = restProps;

  useEffect(() => {
    form.setFieldsValue({ [name]: value });
  }, [value, name, form]);

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required: required,
            message: `${label} is required`,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (name === "GSTNo") {
                if (
                  !value ||
                  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/i.test(
                    value
                  )
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Invalid GST Format!"));
              }
              if (name === "MobileNumber") {
                if (!value || /^[0-9]{10}$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Invalid Mobile No!"));
              }
              if (name === "Pin Code") {
                if (!value || /^[0-9]{6}$/.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Invalid PinCode! Must be 6 digits."));
              }
              return Promise.resolve();
            },
          }),
        ]}
        style={isStyle ? { margin: "0px" } : {}}
      >
        <Input
          {...restProps}
          onChange={onChange}
          ref={ref}
          addonAfter={addonAfter}
          name={name}
          min={min}
          max={max}
          maxLength={maxLength}
          type={type}
          onWheel={(qty) => qty?.target?.blur()}
          onKeyDown={type === "number" ? (event) => {
            const isCtrl = event.ctrlKey || event.metaKey;
            if (isCtrl && ["v", "c", "a", "x"].includes(event.key.toLowerCase())) {
              return;
            }
            notAllowToEnterMoreThanMaxLength(event);
            const parsedMaxValue = parseFloat(max ?? "a");
            const parsedMinValue = parseFloat(min ?? 0);
            if (isNaN(parsedMaxValue) && isNaN(parsedMinValue)) {
            } else {
              if ((event.key < '0' || event.key > '9') && event.key !== 'Backspace' && event.key !== "Tab" && event?.key !== "ArrowLeft" && event?.key !== "ArrowRight") {
                event.preventDefault();
              }
              else {
                const currentValue = parseFloat(event.target.value + event.key);
                if (parsedMinValue > currentValue || currentValue > parsedMaxValue) {
                  event.preventDefault();
                }
              }
            }
          } : undefined}
        />
      </Form.Item>
    </Form>
  );
  function notAllowToEnterMoreThanMaxLength(event) {
    if (maxLength && event.target.value.length >= maxLength && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
};

export default UiTextBox;