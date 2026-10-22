import { useEffect, useState } from "react";
import { Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UiButton, UiDrawer, UiTextBox, UiTextArea, UiSelect } from "../../../components";
import { MASTERDATA_URL } from "../../../apiservices/endpoints";
import * as api from "../../../actions";
import { showToast } from "../../../components/UiToastNotification";

const initialPartDetails = {
    partNumber: "",
    partDescription: "",
    positionRequirements: "",
    similarParts: [],
};

const PartDrawer = ({ isOpenDrawer, mode, handleClose, record, onSuccess }) => {
    const queryClient = useQueryClient();

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";
    const isFormMode = isAddMode || isEditMode;

    const drawerTitle = isViewMode ? "View Part" : isEditMode ? "Edit Part" : "Add new Part";
    const submitLabel = isEditMode ? "Update" : "Submit";
    const [formState, setFormState] = useState(initialPartDetails);
    const { partNumber, partDescription, positionRequirements, similarParts } = formState;
    const [isButtonEnabled, setButtonEnabled] = useState(false);
    const [similarPartsList, setSimilarPartsList] = useState([]);

    const getSimilarParts = () => api.get(`${MASTERDATA_URL}/list`);
    const addPart = (payload) => api.post(`${MASTERDATA_URL}`, payload);
    const editPart = (payload, id) => api.put(`${MASTERDATA_URL}/part-id/${id}`, payload);

    useQuery(["FETCH_SIMILAR_PARTS_DRAWER"], getSimilarParts, {
        enabled: isOpenDrawer && isFormMode,
        refetchOnWindowFocus: false,
        onSuccess: (res) => {
            if (res?.statusCode === 200) {
            setSimilarPartsList(res?.result?.masterDataList || []); 
            }
        },
    });

    const { isFetching: isFetchingAddPart } = useQuery(["ADD_PART_DRAWER"], addPart, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (partResponse) => {
            if (partResponse?.data?.statusCode === 201) {
                showToast.success("Success", "Part Created Successfully!!!");
                onSuccess?.();
                closeAndReset();
            } else {
                showToast.error("Error", `${partResponse?.response?.data?.error?.message}`);
            }
        },
    });

    const { isFetching: isFetchingEditPart } = useQuery(["EDIT_PART_DRAWER"], editPart, {
        enabled: false,
        refetchOnWindowFocus: false,
        onSuccess: (partResponse) => {
            if (partResponse?.data?.statusCode === 200) {
                showToast.success("Success", "Part Update Successfully!!!");
                onSuccess?.();
                closeAndReset();
            } else {
                showToast.error("Error", `${partResponse?.response?.data?.error?.message}`);
            }
        },
    });

    useEffect(() => {
        if (!isOpenDrawer) return;

        if (record && Object.keys(record).length > 0) {
            setFormState({
                partNumber: record?.partNumber || "",
                partDescription: record?.partDescription || "",
                positionRequirements: record?.positionRequirements || record?.description || "",
                similarParts:
                    record?.similarParts?.map((p) => ({
                        partId: p?.partId,
                        imageUrl: p?.imageUrl,
                        partNumber: p?.partNumber,
                        notMatchReason: p?.notMatchReason,
                    })) || [],
                partId: record?.partId,
            });
        } else {
            setFormState(initialPartDetails);
        }
    }, [isOpenDrawer, record]);

    useEffect(() => {
        setButtonEnabled(Boolean(partNumber && partDescription));
    }, [partNumber, partDescription]);

    const closeAndReset = () => {
        setFormState(initialPartDetails);
        handleClose();
    };

    const handleChange = (fieldValue, fieldName) => {
        setFormState((prev) => ({ ...prev, [fieldName]: fieldValue }));
    };

    const handleSimilarPartsSelect = (ids) => {
        setFormState((prev) => ({
            ...prev,
            similarParts: ids?.map((id) => {
                const existing = prev.similarParts?.find((p) => p?.partId === id);
                const catalogPart = similarPartsList?.find((p) => p?.partId === id);
                return {
                    partId: id,
                    imageUrl: catalogPart?.partImageDetails?.[0]?.imageUrl || catalogPart?.partImageDetails?.imageUrl,
                    partNumber: catalogPart?.partNumber,
                    notMatchReason: existing?.notMatchReason || "",
                };
            }),
        }));
    };

    const handleRemoveSimilarPart = (partId) => {
        setFormState((prev) => ({
            ...prev,
            similarParts: prev.similarParts?.filter((p) => p?.partId !== partId),
        }));
    };

    const handleNotMatchReasonChange = (partId, value) => {
        setFormState((prev) => ({
            ...prev,
            similarParts: prev.similarParts?.map((p) =>
                p?.partId === partId ? { ...p, notMatchReason: value } : p
            ),
        }));
    };

    const handleSubmit = () => {
        const payload = {
            partNumber,
            partDescription,
            positionRequirements,
            similarParts: similarParts?.map(({ partId, imageUrl, partNumber, notMatchReason }) => ({
                partId,
                imageUrl,
                partNumber,
                notMatchReason: notMatchReason || "",
            })),
        };

        if (isEditMode) {
            if (!formState?.partId) return;
            queryClient.prefetchQuery(["EDIT_PART_DRAWER"], () => editPart(payload, formState?.partId));
        } else {
            queryClient.prefetchQuery(["ADD_PART_DRAWER"], () => addPart(payload));
        }
    };

    const addedParts = similarParts?.map((p) => ({
        ...similarPartsList?.find((cat) => cat?.partId === p?.partId),
        ...p,
    }));

    return (
        <UiDrawer
            title={drawerTitle}
            open={isOpenDrawer}
            onClose={closeAndReset}
            width={340}
            footer={
                isViewMode ? null : (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <UiButton style={{ flex: 1 }} onClick={closeAndReset}>
                            Cancel
                        </UiButton>
                        <UiButton
                            style={{ flex: 1 }}
                            type="primary"
                            disabled={!isButtonEnabled || isFetchingAddPart || isFetchingEditPart}
                            onClick={handleSubmit}
                        >
                            {submitLabel}
                        </UiButton>
                    </div>
                )
            }
        >
            {isViewMode ? (
                <>
                    <p style={{ fontWeight: 600, marginBottom: "12px" }}>Added Parts</p>
                    {(record?.similarParts?.length > 0 ? record?.similarParts : [])?.map((part) => (
                        <div
                            key={part?.partNumber}
                            style={{
                                border: "1px solid #eee",
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "12px",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ display: "flex", gap: "10px" }}>
                                   { part?.imageUrl ? <Image
                                        src={`${MASTERDATA_URL}/get_image/${part?.imageUrl}`}
                                        alt={part?.partNumber}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            borderRadius: "6px",
                                            background: "#f5f5f5",
                                        }}
                                    />:<p>-</p>}
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{part?.partName}</div>
                                        <div style={{ fontSize: "12px", color: "#888" }}>{part?.subtitle}</div>
                                    </div>
                                </div>
                            </div>

                            <p style={{ marginTop: "10px", marginBottom: "4px", fontSize: "13px", color: "#555" }}>
                                Why This Part Not Match
                            </p>
                            <p style={{ margin: 0, fontSize: "13px", color: "#333", lineHeight: 1.5 }}>
                                {part?.notMatchReason}
                            </p>
                        </div>
                    ))}
                </>
            ) : (
                isFormMode && (
                    <>
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <div style={{ flex: 1 }}>
                                <UiTextBox
                                    name="partDescription"
                                    label="Part No"
                                    placeholder="Part No"
                                    value={partNumber}
                                    onChange={(e) => handleChange(e.target.value, "partNumber")}
                                />
                            </div>
                        </div>
                        <div>
                            <UiTextArea
                                label="Part Description"
                                placeholder="Part Description"
                                name="partDescription"
                                value={partDescription}
                                onChange={(e) => handleChange(e.target.value, "partDescription")}
                            />
                        </div>
                        <div>
                            <UiTextArea
                                name='positionRequirements'
                                label="Position Description"
                                placeholder="Position Description"
                                value={positionRequirements}
                                onChange={(e) => handleChange(e.target.value, "positionRequirements")}
                            />
                        </div>
                        <p style={{ color: "#F97316", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>
                            ADD SIMILAR PARTS
                        </p>
                        <UiSelect
                            mode="multiple"
                            isStyle={true}
                            filterOption={(input, option) =>option?.label?.toLowerCase()?.includes(input?.toLowerCase())}
                            placeholder="Search part name"
                            value={similarParts?.map((partDetails) => partDetails?.partId) || []}
                            options={similarPartsList?.filter(partFill => (formState?.partId ? partFill?.partId !== formState?.partId : true) && partFill?.status === 'ACTIVE')?.map((p) => ({ label: p?.partNumber, value: p?.partId, key: p?.partId }))}
                            onChange={handleSimilarPartsSelect}
                        />
                        <div>
                            <p style={{ fontWeight: 600, marginBottom: "8px" }}>Added Parts</p>
                            {addedParts?.map((part) => (
                                <div
                                    key={part?.partId}
                                    style={{
                                        border: "1px solid #eee",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                           {part?.imageUrl ? 
                                                <Image
                                                    src={`${MASTERDATA_URL}/get_image/${part?.imageUrl}`}
                                                    alt={part?.partNumber}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    borderRadius: "6px",
                                                    background: "#f5f5f5",
                                                }}
                                            />:<p>-</p>}
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{part?.partName}</div>
                                                <div style={{ fontSize: "12px", color: "#888" }}>{part?.subtitle}</div>
                                            </div>
                                        </div>
                                        <DeleteOutlined
                                            style={{ color: "#F97316", cursor: "pointer" }}
                                            onClick={() => handleRemoveSimilarPart(part?.partId)}
                                        />
                                    </div>
                                    <UiTextArea
                                        placeholder="Why This part not Match"
                                        style={{ marginTop: "10px" }}
                                        name="notMatchReason"
                                        value={part?.notMatchReason || ""}
                                        onChange={(e) => handleNotMatchReasonChange(part?.partId, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )
            )}
        </UiDrawer>
    );
};

export default PartDrawer;