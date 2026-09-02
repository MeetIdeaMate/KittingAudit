import { useState } from "react";
import { Image, Upload } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { UiButton, UiDrawer, UiTextBox, UiTextArea, UiSelect } from "../../../components";

// ---- Hardcoded dummy/sample data (for testing UI without API) ----
const DUMMY_SIMILAR_PART_OPTIONS = [
    { partId: "P001", partName: "F.JNCLFONDL" },
    { partId: "P002", partName: "F.JNCLFONDR" },
    { partId: "P003", partName: "F.JNCLFONDS" },
];

const DUMMY_ADDED_PARTS = [
    {
        partId: "P001",
        partName: "F.JNCLFONDL",
        subtitle: "Standard M8 fastener",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        notMatchReason:
            "The part does not match due to a dimensional discrepancy — the supplied component exceeds the specified tolerance range, resulting in an improper fit with the mating assembly.",
    },
    {
        partId: "P002",
        partName: "F.JNCLFONDL",
        subtitle: "Standard M8 fastener",
        partImage: "https://images.pexels.com/photos/8081419/pexels-photo-8081419.jpeg",
        notMatchReason:
            "The part does not match due to a dimensional discrepancy — the supplied component exceeds the specified tolerance range, resulting in an improper fit with the mating assembly.",
    },
];

const DUMMY_RECORD = {
    partNo: "PRT-1001",
    description: "Sample hydraulic pump part used for testing view mode.",
    similarParts: DUMMY_ADDED_PARTS,
};

const PartDrawer = ({
    isOpenDrawer,
    mode, // "add" | "edit" | "view"
    handleClose,
    handleChange,
    handleSubmit,
    partDetails,
    similarPartOptions,
    handleSimilarPartSearch,
    handleAddSimilarPart,
    handleRemoveSimilarPart,
    handleNotMatchReasonChange,
    handleUpdatePart, // (partId, updatedReason) => void — inline reason edit in view mode
    isButtonEnabled,
    record,
}) => {
    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";
    const isAddMode = mode === "add";
    const isFormMode = isAddMode || isEditMode; // add & edit share the same form layout

    // fallback to dummy data if nothing passed in (for quick UI testing)
    const displaySimilarPartOptions = similarPartOptions?.length ? similarPartOptions : DUMMY_SIMILAR_PART_OPTIONS;
    const displayAddedParts = partDetails?.similarParts?.length ? partDetails.similarParts : DUMMY_ADDED_PARTS;
    const displayRecord = record?.partNo ? record : DUMMY_RECORD;
    const displayViewParts = displayRecord?.similarParts?.length ? displayRecord.similarParts : DUMMY_ADDED_PARTS;

    // ---- Inline edit state for view-mode cards (edit just the reason text) ----
    const [editingPartId, setEditingPartId] = useState(null);
    const [editingReason, setEditingReason] = useState("");

    const handleStartEdit = (part) => {
        setEditingPartId(part?.partId);
        setEditingReason(part?.notMatchReason ?? "");
    };

    const handleCancelEdit = () => {
        setEditingPartId(null);
        setEditingReason("");
    };

    const handleSaveEdit = (partId) => {
        handleUpdatePart?.(partId, editingReason);
        setEditingPartId(null);
        setEditingReason("");
    };

    const drawerTitle = isViewMode ? "View Part" : isEditMode ? "Edit Part" : "Add new Part";
    const submitLabel = isEditMode ? "Update" : "Submit";

    return (
        <UiDrawer
            title={drawerTitle}
            open={isOpenDrawer}
            onClose={handleClose}
            width={340}
            footer={
                isViewMode ? null : (
                    <div style={{ display: "flex", gap: "10px" }}>
                        <UiButton style={{ flex: 1 }} onClick={handleClose}>
                            Cancel
                        </UiButton>
                        <UiButton
                            style={{ flex: 1 }}
                            type="primary"
                            disabled={!isButtonEnabled}
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
                    {/* ---- ADDED PARTS (READ-ONLY, INLINE-EDITABLE VIA PENCIL) ---- */}
                    <p style={{ fontWeight: 600, marginBottom: "12px" }}>Added Parts</p>
                    {displayViewParts?.map((part) => {
                        const isEditingThisCard = editingPartId === part?.partId;

                        return (
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
                                        <Image
                                            src={part?.partImage}
                                            alt={part?.partName}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "6px",
                                                background: "#f5f5f5",
                                            }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{part?.partName}</div>
                                            <div style={{ fontSize: "12px", color: "#888" }}>{part?.subtitle}</div>
                                        </div>
                                    </div>

                                    {!isEditingThisCard && (
                                        <EditOutlined
                                            style={{ color: "#F97316", cursor: "pointer" }}
                                            onClick={() => handleStartEdit(part)}
                                        />
                                    )}
                                </div>

                                <p style={{ marginTop: "10px", marginBottom: "4px", fontSize: "13px", color: "#555" }}>
                                    Why This Part Not Match
                                </p>

                                {isEditingThisCard ? (
                                    <>
                                        <UiTextArea
                                            value={editingReason}
                                            onChange={(e) => setEditingReason(e.target.value)}
                                            placeholder="Why This part not Match"
                                        />
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                                            <UiButton size="small" onClick={handleCancelEdit}>
                                                Cancel
                                            </UiButton>
                                            <UiButton
                                                size="small"
                                                type="primary"
                                                onClick={() => handleSaveEdit(part?.partId)}
                                            >
                                                Save
                                            </UiButton>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ margin: 0, fontSize: "13px", color: "#333", lineHeight: 1.5 }}>
                                        {part?.notMatchReason}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </>
            ) : (
                isFormMode && (
                    <>
                        {/* ---- MAIN IMAGE + PART NAME ---- */}
                        <p style={{ color: "#F97316", fontWeight: 600, marginBottom: "10px" }}>MAIN IMAGE</p>
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                fileList={
                                    partDetails?.partImage
                                        ? [{ uid: "-1", url: partDetails.partImage, name: "part-image" }]
                                        : []
                                }
                                onChange={(file) => handleChange(file, "partImage")}
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 4, fontSize: "12px" }}>Upload</div>
                                </div>
                            </Upload>
                            <div style={{ flex: 1 }}>
                                <UiTextBox
                                    label="Part Name"
                                    placeholder="Part Name"
                                    value={partDetails?.partName}
                                    onChange={(e) => handleChange(e.target.value, "partName")}
                                />
                            </div>
                        </div>

                        {/* ---- PROCESS DESCRIPTION ---- */}
                        <div style={{ marginTop: "16px" }}>
                            <UiTextArea
                                label="Process Description"
                                placeholder="Process Description"
                                value={partDetails?.description}
                                onChange={(e) => handleChange(e.target.value, "description")}
                            />
                        </div>

                        {/* ---- ADD SIMILAR PARTS ---- */}
                        <p style={{ color: "#F97316", fontWeight: 600, marginTop: "20px", marginBottom: "8px" }}>
                            ADD SIMILAR PARTS
                        </p>
                        <UiSelect
                            mode="multiple"
                            label="Part Name"
                            placeholder="Search part name"
                            value={displayAddedParts?.map((p) => p?.partId)}
                            options={displaySimilarPartOptions?.map((p) => ({ label: p?.partName, value: p?.partId }))}
                            onSearch={(value) => handleSimilarPartSearch(value)}
                            onSelect={(value) => {
                                const selected = displaySimilarPartOptions?.find((p) => p?.partId === value);
                                if (selected) handleAddSimilarPart(selected);
                            }}
                            onDeselect={(value) => handleRemoveSimilarPart(value)}
                        />

                        {/* ---- ADDED PARTS LIST (EDITABLE) ---- */}
                        {displayAddedParts?.length > 0 && (
                            <div style={{ marginTop: "16px" }}>
                                <p style={{ fontWeight: 600, marginBottom: "8px" }}>Added Parts</p>
                                {displayAddedParts.map((part) => (
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
                                                <Image
                                                    src={part?.partImage}
                                                    alt={part?.partName}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        borderRadius: "6px",
                                                        background: "#f5f5f5",
                                                    }}
                                                />
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
                                            value={part?.notMatchReason}
                                            onChange={(e) =>
                                                handleNotMatchReasonChange(part?.partId, e.target.value)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )
            )}
        </UiDrawer>
    );
};

export default PartDrawer;