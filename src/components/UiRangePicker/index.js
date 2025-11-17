import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const UiRangePicker = ({...restProps}) => {
  return (
    <div className='form-element'>
      <label>{restProps?.label}</label>
      <RangePicker {...restProps} format={"DD-MM-YYYY"}/>
    </div>
  )
};

export default UiRangePicker
