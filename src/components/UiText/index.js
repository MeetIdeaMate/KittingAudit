import { Typography } from 'antd';

const { Text } = Typography;

const UiText = ({ children, style, ...restProps }) => {
    const rootStyles = getComputedStyle(document.documentElement);
    const fontSize = rootStyles.getPropertyValue('--body-font-size');
    const color = rootStyles.getPropertyValue('--text-on-primary');

    const mergedStyle = {
        fontSize, // default font size
        color, // default font color
        ...style, // allow the user to override the default or add more styles
    };

    return <Text style={mergedStyle} {...restProps}>{children}</Text>;
};
export default UiText;