import { Input, Form } from "antd";
import { useEffect } from "react";
const { TextArea } = Input;

const UiTextArea = ({
  placeholder,
  label,
  name,
  value,
  onChange,
  maxLength,
  isStyle = false,
  ...restProps
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({ [name]: value });
  }, [value, name, form]);

  const handleTextAreaChange = (e) => {
    onChange?.(e);
  };

  return (
    <div className="form-element">
      <Form form={form} layout="vertical">
        <Form.Item
          label={label}
          name={name}
          rules={[
            { required: restProps?.required, message: `${label} is required` },
          ]}
          style={ isStyle ? {margin: 0} : {}}
        >
          <TextArea
            placeholder={placeholder}
            {...restProps}
            showCount
            onChange={handleTextAreaChange}
            maxLength={maxLength}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default UiTextArea;
