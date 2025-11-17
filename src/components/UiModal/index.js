import { Modal } from "antd";
import UiButton from "../UiButton";

export const UiModal = ({
  open = false,
  handleClose,
  handleSubmit,
  icon,
  title,
  subContent,
  submitButtonLabel = "Submit",
  closeButtonLabel = "Cancel",
  children,
  footer,
  ...props
}) => {
  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={
        footer !== undefined
          ? footer
          : [
              <UiButton key="close" onClick={handleClose}>
                {closeButtonLabel}
              </UiButton>,
              <UiButton key="submit" type="primary" onClick={handleSubmit}>
                {submitButtonLabel}
              </UiButton>,
            ]
      }
      {...props}
    >
      <div className="ui-modal-header" style={{ display: "flex", gap: "12px" }}>
        {icon && (
          <div className="ui-modal-icon">
            <img src={icon} alt="icon" style={{ width: 32, height: 32 }} />
          </div>
        )}
        <div>
          {title && <h3 style={{ margin: 0 }}>{title}</h3>}
          {subContent && <p style={{ margin: "4px 0 0" }}>{subContent}</p>}
        </div>
      </div>

      {/* Custom Content */}
      {children && <div className="ui-modal-body">{children}</div>}
    </Modal>
  );
};
