import { InputNumber, Form } from "antd";
import { useEffect } from "react";

const UiDecimalNumber = ({
  label,
  name,
  value,
  disabled,
  onChange,
  isStyle,
  ...restProps
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ [name]: value });
  }, [value, name, form]);

  const handleKeyDown = (qty) => {
    const { key } = qty;
    const inputValue = qty?.target?.value;
    const isNumber = key >= "0" && key <= "9";
    const isBackspace = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Ctr", "v", "V", "c", "C"].includes(key);
    const isDot = key === ".";
    if (isDot && inputValue.includes(".")) {
      qty?.preventDefault();
    }
    if (!isNumber && !isBackspace && !isDot) {
      qty?.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text');
    const numericString = pastedData.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(numericString);
    if (!isNaN(parsedValue)) {
      onChange(parsedValue);
    }
  };

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          label={label}
          name={name}
          rules={[
            { required: restProps?.required, message: `${label} is required` },
          ]}
          style={isStyle ? { marginBottom: 0, paddingBottom: 0 } : {}}
        >
          <InputNumber
            min={1}
            disabled={disabled}
            defaultValue={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            {...restProps}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default UiDecimalNumber;