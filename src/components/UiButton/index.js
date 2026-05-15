import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Generateicon } from "../../assets/images";

const UiButton = ({
    add,
    generate,
    style,
    onClick,
    children,
    htmlType,
    ...restProps
}) => {

    let icon = null;

    if (add) { icon = <PlusOutlined /> }

    if (generate) {
        icon = (
            <img src={Generateicon} alt="" style={{ verticalAlign: "middle" }} />
        );
    };

    return (
        <Button
            style={style}
            icon={icon}
            htmlType={htmlType}
            onClick={onClick}
            {...restProps}>
            {children}
        </Button>
    );
};
export default UiButton;