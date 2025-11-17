import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./style.scss";

const UiDrawer = ({
    children,
    className,
    title,
    placement,
    open,
    onClose,
    size,
    extra,
    width,
    ...restProps
}) => {
    return (
        <Drawer
            title={title}
            closable={false}
            onClose={onClose}
            open={open}
            className={`custom-drawer ${className}`}
            size={size}
            extra={extra}
            width={width}
            maskClosable={false}
            placement={placement}
            bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
            {...restProps}
        >
            <CloseOutlined
                className="close-icon"
                style={{ color: "var(--text-on-secondary)" }}
                onClick={onClose}
            />
            {children}
        </Drawer>
    );
};

export default UiDrawer;
