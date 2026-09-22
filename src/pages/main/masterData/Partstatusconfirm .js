import { Modal } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UiButton } from "../../../components";
import { MASTERDATA_URL } from "../../../apiservices/endpoints";
import * as api from "../../../actions";
import { showToast } from "../../../components/UiToastNotification";

const PartStatusConfirm = ({ isOpen, record, onClose, onSuccess }) => {
    const queryClient = useQueryClient();

    const currentStatus = record?.status;
    const targetStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const updateStatus = (partId, status) =>
        api.patch(`${MASTERDATA_URL}/${partId}/set-status?status=${status}`);

    const { isFetching: isUpdatingStatus } = useQuery(
        ["UPDATE_PART_STATUS", ""],
        () => updateStatus(record?.partId, targetStatus),
        {
            enabled: false,
            refetchOnWindowFocus: false,
            onSuccess: (response) => {
                if (response?.data?.statusCode === 200 || response?.statusCode === 200) {
                    showToast.success("Success", `Part marked as ${targetStatus} successfully!!!`);
                    onSuccess?.();
                } else {
                    showToast.error("Error", `${response?.response?.data?.error?.message}`);
                }
            },
        }
    );

    const handleConfirm = () => {
        if (!record?.partId) return;
        queryClient.prefetchQuery(["UPDATE_PART_STATUS", ''], () => updateStatus(record?.partId, targetStatus));
    };

    return (
        <Modal
            title="Change Status"
            open={isOpen}
            onCancel={onClose}
            footer={
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <UiButton onClick={onClose}>Cancel</UiButton>
                    <UiButton type="primary" loading={isUpdatingStatus} onClick={handleConfirm}>
                        Yes, {targetStatus === "ACTIVE" ? "Activate" : "Deactivate"}
                    </UiButton>
                </div>
            }
        >
            <p>
                Are you sure you want to mark part <strong>{record?.partNumber}</strong> as{" "}
                <strong>{targetStatus}</strong>?
            </p>
        </Modal>
    );
};

export default PartStatusConfirm;